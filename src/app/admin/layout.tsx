import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if ((session.user as any).status === "PENDING") {
    redirect("/auth/pending");
  }

  return (
    <div className="flex min-h-screen bg-navy text-white">
      <AdminSidebar />
      <div className="flex-grow flex flex-col">
        <AdminTopbar />
        <main className="p-10 flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}
