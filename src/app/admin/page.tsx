import { prisma } from "@/lib/prisma";
import { 
  MapPin, 
  Plane, 
  FileText, 
  Users as UsersIcon, 
  Mail, 
  TrendingUp 
} from "lucide-react";

export default async function AdminDashboard() {
  let destCount = 0, tourCount = 0, blogCount = 0, userCount = 0, pendingUsers = 0, inquiryCount = 0;

  try {
    const counts = await Promise.all([
      prisma.destination.count(),
      prisma.tour.count(),
      prisma.blogPost.count(),
      prisma.user.count(),
      prisma.user.count({ where: { status: 'PENDING' } }),
      prisma.bookingInquiry.count({ where: { status: 'NEW' } })
    ]);
    
    [destCount, tourCount, blogCount, userCount, pendingUsers, inquiryCount] = counts;
  } catch (error) {
    console.error("Database connection failed, using 0 for dashboard stats.");
  }

  const stats = [
    { name: "Destinations", value: destCount, icon: MapPin, color: "text-blue-400" },
    { name: "Tours", value: tourCount, icon: Plane, color: "text-green-400" },
    { name: "Blog Posts", value: blogCount, icon: FileText, color: "text-purple-400" },
    { name: "Total Users", value: userCount, icon: UsersIcon, color: "text-orange-400" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold font-outfit text-white mb-2">Dashboard Overview</h1>
        <p className="text-white/40">Welcome to the WildpathAfrica CMS. Here is your site at a glance.</p>
      </div>

      {/* Alerts */}
      {(pendingUsers > 0 || inquiryCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingUsers > 0 && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h4 className="text-orange-400 font-bold mb-1">Pending Approvals</h4>
                <p className="text-sm text-white/60">{pendingUsers} users are awaiting access approval.</p>
              </div>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold">Review</button>
            </div>
          )}
          {inquiryCount > 0 && (
            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h4 className="text-accent font-bold mb-1">New Inquiries</h4>
                <p className="text-sm text-white/60">You have {inquiryCount} new booking inquiries.</p>
              </div>
              <button className="bg-accent text-navy px-4 py-2 rounded-xl text-sm font-bold">View</button>
            </div>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-navy-light/20 border border-white/5 p-8 rounded-3xl hover:border-accent/20 transition-all group">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-white/5 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <p className="text-white/40 text-sm font-medium uppercase tracking-wider mb-2">{stat.name}</p>
            <h3 className="text-4xl font-bold font-outfit text-white group-hover:text-accent transition-colors">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-navy-light/20 border border-white/5 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold font-outfit">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/5 hover:border-accent/50 hover:bg-white/5 transition-all group text-center">
              <div className="p-3 bg-accent/10 rounded-xl text-accent group-hover:bg-accent group-hover:text-navy transition-all">
                <MapPin size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">New Dest</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/5 hover:border-accent/50 hover:bg-white/5 transition-all group text-center">
              <div className="p-3 bg-accent/10 rounded-xl text-accent group-hover:bg-accent group-hover:text-navy transition-all">
                <Plane size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">New Tour</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/5 hover:border-accent/50 hover:bg-white/5 transition-all group text-center">
              <div className="p-3 bg-accent/10 rounded-xl text-accent group-hover:bg-accent group-hover:text-navy transition-all">
                <FileText size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">New Post</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/5 hover:border-accent/50 hover:bg-white/5 transition-all group text-center">
              <div className="p-3 bg-accent/10 rounded-xl text-accent group-hover:bg-accent group-hover:text-navy transition-all">
                <UsersIcon size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Users</span>
            </button>
          </div>
        </div>

        <div className="bg-navy-light/20 border border-white/5 rounded-3xl p-8">
          <h3 className="text-xl font-bold font-outfit mb-6">Recent Activity</h3>
          <div className="space-y-6">
            <div className="text-sm text-white/40 italic">
              No recent activity to show.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
