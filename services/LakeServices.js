import { createLake, getLakeByName } from "../modules/LakeModules.js";
import { auth } from "../config/firebase.js";
import { UserCollectionRef } from "../models/UserModel.js";
import { LakesCollectionRef } from "../models/LakesModel.js";
import { buildTokens } from "../libs/buildSearchNames.js";

const searchLakeByName = async (lakeName, token) => {
  try {
    //   const fetchUser = await auth.verifyIdToken(token);

    //   const userDocs = await UserCollectionRef.where(
    //     "uid",
    //     "==",
    //     fetchUser.uid
    //   ).get();

    //   if (!userDocs.empty && userDocs.docs[0].data().role == "admin") {
    const dbLake = await LakesCollectionRef.where(
      "searchName",
      "array-contains",
      lakeName
    ).get();
    if (dbLake.empty) {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      const url = "https://places.googleapis.com/v1/places:searchText";

      const requestBody = {
        textQuery: lakeName,
        maxResultCount: 5,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          // Define fields to avoid being billed for data you don't use
          "X-Goog-FieldMask":
            "places.displayName,places.formattedAddress,places.location,places.id,places.types",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      let payload = {};

      for (const element of data.places) {
        if (element.types.includes("natural_feature")) {
          Object.assign(payload, { location: element.location });
          Object.assign(payload, { name: element.displayName.text });
          const searchNames = await buildTokens(lakeName);
          console.log(searchNames);
          Object.assign(payload, { searchNames: searchNames });
          Object.assign(payload, {
            country: element.formattedAddress.split(",")[2].trim(),
          });
          Object.assign(payload, {
            state: element.formattedAddress.split(",")[1].trim(),
          });
          Object.assign(payload, {
            createdAt: new Date(),
          });
          Object.assign(payload, { placeId: element.id });
          break;
        }
      }

      console.log("Cycle done");

      const newLake = await createLake(payload);
      return newLake;
    }
    // }

    // return { status: "Error", msg: "Auth error" };
  } catch (error) {
    console.log("Error fetching lake:", error);
    return { status: "Error", msg: error.message };
  }
};

export { searchLakeByName };
