export default async function handler(req, res) {
  const response = await fetch('http://3.15.171.43/api' + req.url);
  const data = await response.json();
  res.status(response.status).json(data);
}