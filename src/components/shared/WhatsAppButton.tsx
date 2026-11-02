import { MessageCircle } from "lucide-react";
import { buildWhatsAppHref } from "@/lib/whatsapp";
export default function WhatsAppButton() {
  return (
    <a
      href={buildWhatsAppHref("Hi WildpathAfrica! I'd like to enquire about a safari.")}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform group"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="absolute right-full mr-4 bg-white text-navy-dark px-3 py-1 rounded text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-sm pointer-events-none">
        Chat with us
      </span>
    </a>
  );
}
