import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit3, Globe, MapPin } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function DestinationsListPage() {
  let destinations: any[] = [];
  try {
    destinations = await prisma.destination.findMany({
      include: { country: true, thumbnailImage: true },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Database connection failed fetching destinations:", error);
    destinations = [];
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold font-outfit text-white mb-2">Destinations</h1>
          <p className="text-white/40 text-sm">Manage your world-class travel locations.</p>
        </div>
        <Link 
          href="/admin/destinations/new"
          className="bg-accent text-navy px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus size={20} />
          Add Destination
        </Link>
      </div>

      <div className="bg-navy-light/20 border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest font-bold text-white/40">
            <tr>
              <th className="px-8 py-6">Destination</th>
              <th className="px-8 py-6">Country</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6">SEO Word Count</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {destinations.map((dest) => (
              <tr key={dest.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-navy-deep">
                      <Image 
                        src={dest.thumbnailImage?.fileUrl || "/assets/placeholder.png"} 
                        alt={dest.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white font-bold">{dest.name}</p>
                      <p className="text-xs text-white/40">/{dest.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-white/60">
                    <Globe size={14} className="text-accent" />
                    {dest.country.name}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    dest.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/40'
                  }`}>
                    {dest.status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <span className={`font-bold ${dest.totalWordCount >= 1200 ? 'text-green-400' : 'text-red-400'}`}>
                    {dest.totalWordCount.toLocaleString()} / 1,200
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Link 
                      href={`/admin/destinations/${dest.id}/edit`}
                      className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-accent hover:bg-accent/10 transition-all"
                    >
                      <Edit3 size={18} />
                    </Link>
                    <DeleteButton id={dest.id} type="destinations" name={dest.name} />
                  </div>
                </td>
              </tr>
            ))}
            {destinations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-white/20 italic">
                  No destinations added yet. Click &quot;Add Destination&quot; to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
