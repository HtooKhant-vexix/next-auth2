import { db } from "@/lib/db";
import { error } from "console";
import { Eagle_Lake } from "next/font/google";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function GET() {
  return NextResponse.json({ success: true });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { username, email, password } = data;

    const exitingEmail = await db.user.findUnique({ where: { email: email } });
    if (exitingEmail) {
      return NextResponse.json(
        { user: null, message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPswd = await hash(password, 10);

    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPswd,
      },
    });

    const { password: newUserPswd, ...rest } = newUser;

    return NextResponse.json(
      {
        user: rest,
        message: "New User Created Successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in post request");
  }
}
