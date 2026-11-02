import { getServerSession, type Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const CONTENT_MANAGER_ROLES = new Set(["SUPER_ADMIN", "ADMIN", "EDITOR"]);

type SessionIdentity = { id?: string; role?: string; status?: string };
type VerifiedIdentity = { id: string; role: string; status: string };
export type VerifiedSession = Omit<Session, "user"> & {
  user: NonNullable<Session["user"]> & VerifiedIdentity;
};

async function getCurrentSession(candidate?: Session | null): Promise<Session | null> {
  return candidate === undefined ? getServerSession(authOptions) : candidate;
}

async function hasCurrentActiveRole(session: Session | null, allowedRoles: Set<string>) {
  const user = session?.user as SessionIdentity | undefined;
  if (!session || !user?.id || !user.role || user.status !== "ACTIVE" || !allowedRoles.has(user.role)) {
    return false;
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, status: true },
  });

  return Boolean(
    currentUser &&
    currentUser.status === "ACTIVE" &&
    currentUser.role === user.role &&
    allowedRoles.has(currentUser.role)
  );
}

/** Return an authenticated, currently active CMS editor/admin session, or null. */
export async function getContentManagerSession(candidate?: Session | null): Promise<VerifiedSession | null> {
  const session = await getCurrentSession(candidate);
  if (!(await hasCurrentActiveRole(session, CONTENT_MANAGER_ROLES))) return null;
  return session as VerifiedSession;
}

/** Return an authenticated, currently active super-admin session, or null. */
export async function getSuperAdminSession(candidate?: Session | null): Promise<VerifiedSession | null> {
  const session = await getCurrentSession(candidate);
  if (!(await hasCurrentActiveRole(session, new Set(["SUPER_ADMIN"])))) return null;
  return session as VerifiedSession;
}
