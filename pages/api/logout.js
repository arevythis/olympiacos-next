export default function handler(req, res) {
    if (req.method === 'POST') {
      res.json({ message: 'Logout successful' });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} not allowed`);
    }
  }