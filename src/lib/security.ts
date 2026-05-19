import { headers } from "next/headers";

/**
 * Sanitizes input strings by trimming whitespace and removing HTML tags to prevent XSS.
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/[&<>"']/g, (match) => {
      // Escape critical characters
      const map: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
      };
      return map[match] || match;
    });
}

/**
 * Validates email addresses format.
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validates password strength.
 * Enforces at least 8 characters, 1 uppercase letter, 1 lowercase letter, and 1 number.
 */
export function validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
  if (!password || typeof password !== "string") {
    return { isValid: false, message: "Password is required." };
  }
  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one uppercase letter." };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one lowercase letter." };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one number." };
  }
  return { isValid: true };
}

/**
 * Verifies Cloudflare Turnstile token server-side.
 */
export async function verifyTurnstileToken(token: string): Promise<boolean> {
  // If no token is provided, check if we're in development or Turnstile is disabled
  if (!token) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Turnstile token missing, bypassing verification in development mode.");
      return true;
    }
    return false;
  }

  try {
    const secretKey = process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA"; // Cloudflare Turnstile test secret key
    
    // Fetch client IP if available
    let ip = "";
    try {
      const headerList = headers();
      ip = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "";
    } catch {
      // ignore headers access if outside request context
    }

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}${ip ? `&remoteip=${encodeURIComponent(ip)}` : ""}`,
    });

    const data = await response.json();
    return !!data.success;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    // In case of verification server issue, default to true in development
    return process.env.NODE_ENV === "development";
  }
}
