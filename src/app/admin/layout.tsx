import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayoutShell from "@/components/admin/AdminLayoutShell";
import AuthProvider from "@/components/AuthProvider";

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
    <AuthProvider>
      <AdminLayoutShell>
        {children}
      </AdminLayoutShell>
    </AuthProvider>
  );
}
