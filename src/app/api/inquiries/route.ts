import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sanitizeInput, validateEmail, verifyTurnstileToken } from "@/lib/security";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [bookings, contacts] = await Promise.all([
      prisma.bookingInquiry.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    // Merge into a unified shape
    const unified = [
      ...bookings.map((b) => ({
        type: "BOOKING" as const,
        id: b.id,
        name: b.name,
        email: b.email,
        phone: b.phone ?? null,
        status: b.status,
        createdAt: b.createdAt,
        // booking-specific
        travelDate: b.travelDate ?? null,
        travelersAdults: b.travelersAdults,
        travelersChildren: b.travelersChildren,
        budgetRange: b.budgetRange ?? null,
        accommodationPref: b.accommodationPref ?? null,
        specialRequirements: b.specialRequirements ?? null,
        // contact-specific
        message: null,
        destinationInterest: null,
      })),
      ...contacts.map((c) => ({
        type: "CONTACT" as const,
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone ?? null,
        status: c.status,
        createdAt: c.createdAt,
        // booking-specific
        travelDate: null,
        travelersAdults: null,
        travelersChildren: null,
        budgetRange: null,
        accommodationPref: null,
        specialRequirements: null,
        // contact-specific
        message: c.message,
        destinationInterest: c.destinationInterest ?? null,
      })),
    ];

    // Sort merged list newest first
    unified.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(unified);
  } catch (error) {
    console.error("GET /api/inquiries error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, status, type } = await req.json();

    if (type === "CONTACT") {
      // Map InquiryStatus-like values to ContactStatus enum
      const contactStatusMap: Record<string, "NEW" | "READ" | "REPLIED"> = {
        NEW: "NEW",
        CONTACTED: "READ",
        BOOKED: "REPLIED",
        QUOTED: "REPLIED",
        CANCELLED: "NEW",
        READ: "READ",
        REPLIED: "REPLIED",
      };
      const contactStatus = contactStatusMap[status] ?? "READ";
      const updated = await prisma.contactSubmission.update({
        where: { id },
        data: { status: contactStatus },
      });
      return NextResponse.json({ ...updated, type: "CONTACT" });
    }

    // Default: BOOKING
    const inquiry = await prisma.bookingInquiry.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ ...inquiry, type: "BOOKING" });
  } catch (error) {
    console.error("PATCH /api/inquiries error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      tourId,
      destinationId,
      name,
      email,
      phone,
      whatsapp,
      travelDate,
      travelersAdults = 1,
      travelersChildren = 0,
      budgetRange,
      accommodationPref,
      specialRequirements,
      turnstileToken,
    } = body;

    // 1. Verify Spam Protection Token
    const isBotCheckPassed = await verifyTurnstileToken(turnstileToken);
    if (!isBotCheckPassed) {
      return NextResponse.json({ error: "Spam protection verification failed." }, { status: 400 });
    }

    // 2. Input Validation
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!email || !validateEmail(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    // 3. Sanitization
    const cleanName = sanitizeInput(name);
    const cleanEmail = sanitizeInput(email);
    const cleanPhone = phone ? sanitizeInput(phone) : null;
    const cleanWhatsapp = whatsapp ? sanitizeInput(whatsapp) : null;
    const cleanBudgetRange = budgetRange ? sanitizeInput(budgetRange) : null;
    const cleanAccommodationPref = accommodationPref ? sanitizeInput(accommodationPref) : null;
    const cleanSpecialReqs = specialRequirements ? sanitizeInput(specialRequirements) : null;

    let parsedTravelDate = null;
    if (travelDate) {
      const dateVal = new Date(travelDate);
      if (!isNaN(dateVal.getTime())) {
        parsedTravelDate = dateVal;
      }
    }

    const inquiry = await prisma.bookingInquiry.create({
      data: {
        tourId: tourId || null,
        destinationId: destinationId || null,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        whatsapp: cleanWhatsapp,
        travelDate: parsedTravelDate,
        travelersAdults: parseInt(String(travelersAdults), 10) || 1,
        travelersChildren: parseInt(String(travelersChildren), 10) || 0,
        budgetRange: cleanBudgetRange,
        accommodationPref: cleanAccommodationPref,
        specialRequirements: cleanSpecialReqs,
      },
    });

    return NextResponse.json({ success: true, data: inquiry });
  } catch (error) {
    console.error("Booking inquiry API Error:", error);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id || !type) {
      return NextResponse.json({ error: "Missing id or type" }, { status: 400 });
    }

    if (type === "CONTACT") {
      await prisma.contactSubmission.delete({
        where: { id },
      });
    } else {
      await prisma.bookingInquiry.delete({
        where: { id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/inquiries error:", error);
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}
