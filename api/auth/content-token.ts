import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const authBaseUrl = process.env.AUTH_BASE_URL || "https://oauth2.quran.foundation";

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const response = await fetch(`${authBaseUrl}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        scope: "content search",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error,
        error_description: data.error_description,
      });
    }

    return res.status(200).json({
      access_token: data.access_token,
      expires_in: data.expires_in,
    });
  } catch {
    return res.status(500).json({ error: "Content token exchange failed" });
  }
}
