import { NextResponse } from "next/server";

const VALID_USERS = [
  {
    email: "CHRIST2024001@christuniversity.in",
    password: "student123",
    student_id: "CHRIST2024001",
    name: "Rahul Sharma",
  },
  {
    email: "CHRIST2024002@christuniversity.in",
    password: "student123",
    student_id: "CHRIST2024002",
    name: "Priya Patel",
  },
  {
    email: "CHRIST2024003@christuniversity.in",
    password: "student123",
    student_id: "CHRIST2024003",
    name: "Arjun Kumar",
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = VALID_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(`${user.student_id}:${Date.now()}`).toString("base64");

    return NextResponse.json({
      token,
      student_id: user.student_id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
