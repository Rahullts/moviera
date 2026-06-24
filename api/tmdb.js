export default async function handler(req, res) {
  const path = req.query.path || '';
  const params = new URLSearchParams(req.query);
  params.delete('path');
  
  const url = `https://api.themoviedb.org/3/${path}?${params.toString()}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from TMDB' });
  }
}