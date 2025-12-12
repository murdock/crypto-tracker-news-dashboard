import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

    const subscriber = await prisma.subscriber.create({
      data: { email },
      select: { id: true, email: true },
    });

    return NextResponse.json({ message: "Subscribed successfully", subscriber });
  } catch (err) {
    console.error("Subscription failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
