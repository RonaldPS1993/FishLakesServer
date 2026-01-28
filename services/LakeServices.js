import { createLake, getLakeByName } from "../modules/LakeModules.js";
import { authenticateUser } from "../modules/UserModules.js";
const searchLakeByName = async (lakeName, token) => {
  try {
    const validUser = await authenticateUser(token);

    if (validUser.status == "Success" && validUser.data.role == "admin") {
      const dbLake = await getLakeByName(lakeName);
      if (dbLake.msg == "No lake found") {
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
            let nameStrings = element.displayName.text.split(" ");
            for (let i = 0; i < nameStrings.length; i++) {
              nameStrings[i] = nameStrings[i].toLowerCase();
            }
            const searchName = nameStrings.join(" ");
            Object.assign(payload, { searchName: searchName });
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
      if (dbLake.status == "Success") {
        console.log("Found lake");

        return dbLake;
      }
    }

    return validUser;
  } catch (error) {
    console.log("Error fetching lake:", error);
    return { status: "Error", msg: error.message };
  }
};

export { searchLakeByName };
