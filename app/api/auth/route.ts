import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();

  const correctPassword = process.env.ACCESS_PASSWORD;

  if (!correctPassword) {
    return NextResponse.json({ error: "Password not configured" }, { status: 500 });
  }

  if (password === correctPassword) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
}
