import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function DestinationCard({ destination, countrySlug }: { destination: any; countrySlug: string }) {
  return (
    <Link 
      href={`/destinations/${countrySlug}/${destination.slug}`}
      className="group bg-navy-light/30 border border-white/5 rounded-3xl overflow-hidden hover:border-accent/50 transition-all duration-500 flex flex-col"
    >
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src={destination.thumbnailImage?.fileUrl || "/assets/placeholder.png"}
          alt={destination.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-80" />
        <div className="absolute top-6 left-6 flex gap-2">
          {destination.visaRequired && (
            <span className="bg-accent text-navy text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">Visa Required</span>
          )}
          <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
            {destination.bestSeason || "Year Round"}
          </span>
        </div>
      </div>
      
      <div className="p-8 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-3 font-outfit text-white group-hover:text-accent transition-colors">
            {destination.name}
          </h3>
          <p className="text-white/60 text-sm leading-relaxed line-clamp-3 mb-6">
            {destination.shortTeaser}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <span className="text-xs text-white/40 font-medium">EXPLORE DESTINATION</span>
          <ArrowRight className="text-accent transform group-hover:translate-x-2 transition-transform" size={20} />
        </div>
      </div>
    </Link>
  );
}
