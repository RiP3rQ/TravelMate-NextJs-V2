export default async function handler(req, res) {
  try {
    const { endPoint } = req.body;

    if (!endPoint.lat && !endPoint.lng) {
      return res.status(400).json({ message: "Bad Request" });
    }

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${endPoint.lat}&lon=${endPoint.lng}&exclude=current&appid=1ed8dd22abcc366797735d49b5990f85&lang=pl&units=metric`
      ),
      data = await response.json();

    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ message: "Something went wrong." });
  }
}
