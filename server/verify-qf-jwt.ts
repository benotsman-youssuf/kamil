import { createRemoteJWKSet, jwtVerify } from "jose";

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
  if (!jwks) {
    jwks = createRemoteJWKSet(
      new URL("https://oauth2.quran.foundation/.well-known/jwks.json"),
      { cooldownDuration: 3_600_000 } // cache 1 hour
    );
  }
  return jwks;
}

export interface QFJwtPayload {
  sub: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  nonce?: string;
  iss: string;
  aud: string[];
  exp: number;
  iat: number;
}

export async function verifyQFJwt(token: string): Promise<QFJwtPayload> {
  const jwks = getJWKS();
  const { payload } = await jwtVerify(token, jwks, {
    issuer: "https://oauth2.quran.foundation",
  });
  return payload as unknown as QFJwtPayload;
}
