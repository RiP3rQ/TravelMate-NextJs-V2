export default async function handler(req, res) {
  try {
    const { selectedTypeOfSearch, coordinates, endPoint, accessToken } =
      req.body;

    if (
      !selectedTypeOfSearch &&
      !coordinates.lat &&
      !coordinates.lng &&
      !endPoint.lat &&
      !endPoint.lng &&
      !accessToken
    ) {
      return res.status(400).json({ message: "Bad Request" });
    }

    const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${selectedTypeOfSearch}/${coordinates.lng},${coordinates.lat};${endPoint.lng},${endPoint.lat}?geometries=geojson&access_token=${accessToken}`
      ),
      data = await response.json();

    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ message: "Something went wrong." });
  }
}
