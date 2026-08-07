import { NextResponse } from "next/server";

// No authentication — public app
export default function middleware(request: Request) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
