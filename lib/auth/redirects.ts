import { headers } from "next/headers";

const DEFAULT_AUTH_REDIRECT = "/account";

export function getSafeNextPath(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== "string") {
    return DEFAULT_AUTH_REDIRECT;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue || !trimmedValue.startsWith("/") || trimmedValue.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT;
  }

  try {
    const parsedUrl = new URL(trimmedValue, "http://trung-ai.local");
    const safePath = `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;

    if (safePath.startsWith("//")) {
      return DEFAULT_AUTH_REDIRECT;
    }

    return safePath;
  } catch {
    return DEFAULT_AUTH_REDIRECT;
  }
}

export async function getRequestOrigin() {
  const headerStore = await headers();
  const requestOrigin = headerStore.get("origin");
  const forwardedHost = headerStore.get("x-forwarded-host");
  const forwardedProto = headerStore.get("x-forwarded-proto") ?? "https";
  const host = headerStore.get("host");

  if (requestOrigin) {
    return requestOrigin;
  }

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  if (host) {
    const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
    return `${protocol}://${host}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function buildAuthRedirectUrl(path: string, nextPath?: string) {
  const origin = await getRequestOrigin();
  const url = new URL(path, origin);

  if (nextPath) {
    url.searchParams.set("next", getSafeNextPath(nextPath));
  }

  return url.toString();
}

export function getAuthMessage(value: string | string[] | undefined) {
  const message = Array.isArray(value) ? value[0] : value;

  if (!message) {
    return "";
  }

  try {
    return decodeURIComponent(message);
  } catch {
    return message;
  }
}
