const DEFAULT_WHATSAPP_NUMBER = "254704059438";

/** Build a WhatsApp Click-to-Chat URL using a digits-only international number. */
export function buildWhatsAppHref(
  message = "",
  number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER,
): string {
  const internationalNumber = number.replace(/\D/g, "") || DEFAULT_WHATSAPP_NUMBER;
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${internationalNumber}${query}`;
}
