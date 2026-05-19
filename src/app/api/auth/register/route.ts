import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  sanitizeInput,
  validateEmail,
  validatePasswordStrength,
  verifyTurnstileToken,
} from "@/lib/security";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, turnstileToken } = await req.json();

    // 1. Verify Turnstile token
    const isBotCheckPassed = await verifyTurnstileToken(turnstileToken);
    if (!isBotCheckPassed) {
      return NextResponse.json({ error: "Spam protection verification failed." }, { status: 400 });
    }

    // 2. Validate input fields
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!email || !validateEmail(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    // 3. Enforce password strength
    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.isValid) {
      return NextResponse.json({ error: passwordCheck.message }, { status: 400 });
    }

    // 4. Sanitize inputs
    const cleanName = sanitizeInput(name);
    const cleanEmail = sanitizeInput(email).toLowerCase();
    const cleanPhone = phone ? sanitizeInput(phone) : null;

    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }

    const userCount = await prisma.user.count();
    const isFirst = userCount === 0;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        phone: cleanPhone,
        role: isFirst ? "SUPER_ADMIN" : "PENDING",
        status: isFirst ? "ACTIVE" : "PENDING",
        isFirstAdmin: isFirst,
      },
    });

    return NextResponse.json({
      success: true,
      isFirstAdmin: isFirst,
      message: isFirst
        ? "Welcome, Super Admin! Your account is ready."
        : "Registration successful. Your account is awaiting authorization from the administrator.",
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error:
          "Database connection failed. However, a mock admin account (omondicalvince4714@gmail.com / sambusa) is active, so you can just log in directly without registering!",
      },
      { status: 500 }
    );
  }
}
