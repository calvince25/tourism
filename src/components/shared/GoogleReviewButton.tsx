import Link from "next/link";
import { Star } from "lucide-react";

const GOOGLE_REVIEW_URL = "https://g.page/r/Ccs72OsNu-NBEBI/review";

interface GoogleReviewButtonProps {
  className?: string;
  variant?: "default" | "compact";
}

/**
 * "Leave us a Google Review" button.
 * Opens the Google review page in a new tab.
 */
export default function GoogleReviewButton({
  className = "",
  variant = "default",
}: GoogleReviewButtonProps) {
  if (variant === "compact") {
    return (
      <Link
        href={GOOGLE_REVIEW_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 text-sm text-accent hover:text-white transition-colors ${className}`}
        aria-label="Leave us a Google Review"
      >
        <Star size={16} className="fill-accent text-accent" />
        <span>Leave a Google Review</span>
      </Link>
    );
  }

  return (
    <Link
      href={GOOGLE_REVIEW_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 bg-white/5 hover:bg-accent/10 border border-white/10 hover:border-accent/50 rounded-2xl px-6 py-4 transition-all group ${className}`}
      aria-label="Leave us a Google Review"
    >
      <div className="bg-accent/10 p-2 rounded-xl text-accent group-hover:bg-accent group-hover:text-navy transition-all">
        <Star size={20} className="fill-current" />
      </div>
      <div>
        <p className="text-sm font-bold text-white group-hover:text-accent transition-colors">
          Leave us a Google Review
        </p>
        <p className="text-xs text-white/40">
          We&apos;d love to hear about your experience
        </p>
      </div>
    </Link>
  );
}
