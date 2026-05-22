import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sanitizeInput, validateEmail, verifyTurnstileToken } from "@/lib/security";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const inquiries = await prisma.bookingInquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(inquiries);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, status } = await req.json();
    const inquiry = await prisma.bookingInquiry.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(inquiry);
  } catch (error) {
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
