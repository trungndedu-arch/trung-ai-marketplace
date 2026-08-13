import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { getSafeNextPath } from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const nextPath = getSafeNextPath(requestUrl.searchParams.get("next"));

  if (!tokenHash || !type) {
    const callbackUrl = new URL("/auth/callback", request.url);
    callbackUrl.search = requestUrl.search;

    return NextResponse.redirect(callbackUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  });

  if (error) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("message", "Không thể xác thực email. Vui lòng thử lại hoặc đăng nhập.");

    return NextResponse.redirect(loginUrl);
  }

  const destination = type === "recovery" ? "/reset-password" : nextPath;

  return NextResponse.redirect(new URL(destination, request.url));
}
