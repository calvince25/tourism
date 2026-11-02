import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSuperAdminSession } from "@/lib/authorization";

type ManagedRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "PENDING";
type ManagedStatus = "ACTIVE" | "PENDING" | "SUSPENDED";

const VALID_ROLES = new Set<string>(["SUPER_ADMIN", "ADMIN", "EDITOR", "PENDING"]);
const VALID_STATUSES = new Set<string>(["ACTIVE", "PENDING", "SUSPENDED"]);

export async function GET() {
  try {
    const adminSession = await getSuperAdminSession();
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        isFirstAdmin: true,
        phone: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Users GET error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const adminSession = await getSuperAdminSession();
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
      const parsed: unknown = await req.json();
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
      }
      body = parsed as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    const { id, status, role } = body;
    if (typeof id !== "string" || !id) {
      return NextResponse.json({ error: "A valid user ID is required" }, { status: 400 });
    }
    if (status !== undefined && (typeof status !== "string" || !VALID_STATUSES.has(status))) {
      return NextResponse.json({ error: "Invalid user status" }, { status: 400 });
    }
    if (role !== undefined && (typeof role !== "string" || !VALID_ROLES.has(role))) {
      return NextResponse.json({ error: "Invalid user role" }, { status: 400 });
    }
    if (status === undefined && role === undefined) {
      return NextResponse.json({ error: "A role or status change is required" }, { status: 400 });
    }
    if (id === adminSession.user.id) {
      return NextResponse.json(
        { error: "You cannot modify your own role or status." },
        { status: 403 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: { role?: ManagedRole; status?: ManagedStatus } = {};
    if (status !== undefined) {
      updateData.status = status as ManagedStatus;
      if (status === "ACTIVE" && existingUser.role === "PENDING" && role === undefined) {
        updateData.role = "EDITOR";
      }
    }
    if (role !== undefined) updateData.role = role as ManagedRole;

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        isFirstAdmin: true,
        phone: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Users PUT error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const adminSession = await getSuperAdminSession();
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
      const parsed: unknown = await req.json();
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
      }
      body = parsed as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    const id = body.id;
    if (typeof id !== "string" || !id) {
      return NextResponse.json({ error: "A valid user ID is required" }, { status: 400 });
    }
    if (id === adminSession.user.id) {
      return NextResponse.json(
        { error: "You cannot delete your own account." },
        { status: 403 }
      );
    }

    const deleted = await prisma.user.delete({
      where: { id },
      select: { id: true, name: true, email: true, role: true, status: true },
    });
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("Users DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
