import { createLake, getLakes } from "../modules/LakeModules.js";

const getNearbyLakes = async (region) => {
  let radiusMeters = region.latitudeDelta * 69 * 1609.34;

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `location=${region.latitude},${region.longitude}&` +
        `radius=${radiusMeters}&` +
        `type=natural_feature&` +
        `keyword=lake&` +
        `key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();
    const lakesResult = [];

    for (const element of data.results) {
      const lake = await getLakes(
        element.geometry.location.lat,
        element.geometry.location.lng
      );
      if (lake.status == "Success") {
        lakesResult.push(lake.data);
      } else {
        let lakePayload = {};
        Object.assign(lakePayload, { latitude: element.geometry.location.lat });
        Object.assign(lakePayload, {
          longitude: element.geometry.location.lng,
        });
        Object.assign(lakePayload, { name: element.name });
        Object.assign(lakePayload, { place_id: element.place_id });
        Object.assign(lakePayload, { shore_fishing: false });
        Object.assign(lakePayload, { vicinity: element.vicinity });
        if (element.photos != undefined && element.photos.length > 0) {
          let photoRef = element.photos[0].photo_reference;
          const photoRes = await fetch(
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${process.env.GOOGLE_MAPS_API_KEY}`
          );
          Object.assign(lakePayload, { image: photoRes.url });
          const addLakeRes = await createLake(lakePayload);
          if (addLakeRes.status == "Success") {
            lakesResult.push(lakePayload);
            continue;
          } else {
            return { status: "Error", msg: addLakeRes.msg };
          }
        }
      }
    }

    return { status: "Success", data: lakesResult };
  } catch (error) {
    console.error("Error fetching nearby lakes:", error);
    return [];
  }
};

export { getNearbyLakes };
