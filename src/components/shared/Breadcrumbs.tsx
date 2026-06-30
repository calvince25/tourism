import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import JsonLd from "./JsonLd";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Visible breadcrumb navigation with matching BreadcrumbList JSON-LD schema.
 * Renders semantic HTML with proper ARIA attributes for accessibility.
 */
export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Build full breadcrumb trail with Home prepended
  const fullItems = [{ name: "Home", href: "/" }, ...items];

  // Schema data for JsonLd component
  const schemaItems = fullItems.map((item) => ({
    name: item.name,
    item: item.href,
  }));

  return (
    <>
      <JsonLd type="breadcrumb" data={{ items: schemaItems }} />
      <nav
        aria-label="Breadcrumb"
        className="container mx-auto px-4 sm:px-8 py-3"
      >
        <ol className="flex items-center flex-wrap gap-1 text-xs sm:text-sm text-white/50">
          {fullItems.map((item, index) => {
            const isLast = index === fullItems.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1">
                {index === 0 && (
                  <Home size={14} className="mr-0.5 text-white/40" aria-hidden="true" />
                )}
                {isLast ? (
                  <span className="text-accent font-medium" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link
                      href={item.href}
                      className="hover:text-accent transition-colors"
                    >
                      {item.name}
                    </Link>
                    <ChevronRight size={14} className="text-white/30" aria-hidden="true" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
