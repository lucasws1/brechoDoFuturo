import axios from "axios";
// @ts-expect-error: Sem tipos para 'qs', mas é seguro para uso aqui
import qs from "qs";

// Definição da URL base da API do Melhor Envio
const BASE_URL =
  process.env.ME_BASE_URL || "https://sandbox.melhorenvio.com.br";
const CLIENT_ID = process.env.ME_CLIENT_ID as string;
const CLIENT_SECRET = process.env.ME_CLIENT_SECRET!;
const REDIRECT_URI = process.env.ME_REDIRECT_URI!;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error("Missing required environment variables");
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function getAuthUrl(scopes: string[] = ["shipping-calculate"]) {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: scopes.join(" "),
  });

  return `${BASE_URL}/oauth/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string) {
  const body = qs.stringify({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    code: code,
  });

  try {
    const { data } = await axios.post(`${BASE_URL}/oauth/token`, body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return data as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
      token_type: "Bearer";
    };
  } catch (error: any) {
    console.error("Exchange Code Error:");
    console.error("Response:", error.response?.data);
    console.error("Status:", error.response?.status);
    throw error;
  }
}

export async function refreshAccessToken(refreshToken: string) {
  const body = qs.stringify({
    grant_type: "refresh_token",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: refreshToken,
    redirect_uri: REDIRECT_URI,
  });

  const { data } = await axios.post(`${BASE_URL}/oauth/token`, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return data as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: "Bearer";
  };
}

export const calculateShipment = async (accessToken: string, payload: any) => {
  const { data } = await api.post("/api/v2/me/shipment/calculate", payload, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data;
};
