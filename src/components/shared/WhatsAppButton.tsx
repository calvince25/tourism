import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function WhatsAppButton() {
  return (
    <Link
      href="https://wa.me/254700000000?text=Hi%20WildpathAfrica!%20I%27d%20like%20to%20enquire%20about%20a%20safari."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform group"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="absolute right-full mr-4 bg-white text-navy-dark px-3 py-1 rounded text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-sm pointer-events-none">
        Chat with us
      </span>
    </Link>
  );
}
