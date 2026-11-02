import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayoutShell from "@/components/admin/AdminLayoutShell";
import AuthProvider from "@/components/AuthProvider";
import { getContentManagerSession } from "@/lib/authorization";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const sessionStatus = (session.user as { status?: string } | undefined)?.status;
  if (sessionStatus === "PENDING") {
    redirect("/auth/pending");
  }

  if (!(await getContentManagerSession(session))) {
    redirect("/auth/login");
  }

  return (
    <AuthProvider>
      <AdminLayoutShell>
        {children}
      </AdminLayoutShell>
    </AuthProvider>
  );
}
