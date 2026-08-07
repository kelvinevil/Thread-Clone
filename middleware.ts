import { NextResponse } from "next/server";

export default function middleware(request: Request) {
  return NextResponse.next();
}
