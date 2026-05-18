import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authBaseUrl = process.env.AUTH_BASE_URL || "https://oauth2.quran.foundation";

  try {
    const response = await fetch(`${authBaseUrl}/.well-known/jwks.json`);

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch JWKS" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ error: "JWKS fetch failed" });
  }
}
