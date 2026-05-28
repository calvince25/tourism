import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit3, Calendar, DollarSign, Clock } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function ToursListPage() {
  let tours: any[] = [];
  try {
    tours = await prisma.tour.findMany({
      include: { coverImage: true },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Database connection failed fetching tours:", error);
    tours = [];
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold font-outfit text-white mb-2">Safari Tours</h1>
          <p className="text-white/40 text-sm">Manage your safari packages and itineraries.</p>
        </div>
        <Link 
          href="/admin/tours/new"
          className="bg-accent text-navy px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus size={20} />
          Add Tour Package
        </Link>
      </div>

      <div className="bg-navy-light/20 border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest font-bold text-white/40">
            <tr>
              <th className="px-8 py-6">Tour Package</th>
              <th className="px-8 py-6">Duration</th>
              <th className="px-8 py-6">Price (USD)</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tours.map((tour) => (
              <tr key={tour.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-navy-deep">
                      <Image 
                        src={tour.coverImage?.fileUrl || "/assets/placeholder.png"} 
                        alt={tour.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white font-bold">{tour.name}</p>
                      <p className="text-xs text-white/40">{tour.travelStyle || 'Safari'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-white/60">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-accent" />
                    {tour.durationDays} Days / {tour.durationNights} Nights
                  </div>
                </td>
                <td className="px-8 py-6 text-white font-bold">
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} className="text-accent" />
                    {tour.priceUsd?.toLocaleString()}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    tour.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/40'
                  }`}>
                    {tour.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Link 
                      href={`/admin/tours/${tour.id}/edit`}
                      className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-accent hover:bg-accent/10 transition-all"
                    >
                      <Edit3 size={18} />
                    </Link>
                    <DeleteButton id={tour.id} type="tours" name={tour.name} />
                  </div>
                </td>
              </tr>
            ))}
            {tours.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-white/20 italic">
                  No tours added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
