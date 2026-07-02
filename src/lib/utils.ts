import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ApiClientOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  token?: string;
  headers?: Record<string, string>;
  content?: string
}


export const base_api = "/api";
export const base_url = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

export async function howl<T>(
  endpoint: string,
  { method = "GET", body, token, content, headers = {} }: ApiClientOptions = {}
): Promise<T> {
  const res = await fetch(`${base_url}${base_api}${endpoint}`, {
    method,
    headers: {
      "Accept": "application/json",
      ...(content ? { "Content-Type": content } : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.log(errorData);
    
    throw new Error((errorData as idk).message || "API request failed");
  }

  return res.json() as Promise<T>;
}





export type idk = any;

export function formatSol(amount: number | string | undefined | null): string {
  if (amount == null || isNaN(Number(amount))) return "0";
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(numAmount);
}

export function formatSolFee(amount: number | string | undefined | null): string {
  if (amount == null || isNaN(Number(amount))) return "0";
  const numAmount = Number(amount);
  if (numAmount > 0 && numAmount < 0.001) {
    return "< 0.001";
  }
  return formatSol(numAmount);
}
