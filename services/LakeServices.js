

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

    if (data.status === "OK") {
      return data.results;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching nearby lakes:", error);
    return [];
  }
};

module.exports = getNearbyLakes;
