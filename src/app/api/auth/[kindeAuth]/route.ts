// import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";

// export const GET = handleAuth();

import { NextRequest, NextResponse } from "next/server"

const MOCK_USER = {
  id: "mock_user_001",
  email: "dev@example.com",
}

export const GET = (req: NextRequest) => {
  const url = new URL(req.url)
  // Extract the action from the route segment e.g. /api/auth/login → "login"
  const action = url.pathname.split("/").pop()

  switch (action) {
    case "login":
    case "register":
      // In real Kinde these redirect to OAuth — just redirect home with mock session
      return NextResponse.redirect(new URL("/", req.url))

    case "logout":
      // Clear any client-side session cookies if needed and redirect home
      const response = NextResponse.redirect(new URL("/", req.url))
      response.cookies.delete("mock_session")
      return response

    case "callback":
      // Kinde normally handles the OAuth callback here
      return NextResponse.redirect(new URL("/", req.url))

    default:
      return NextResponse.json({ authenticated: true, user: MOCK_USER })
  }
}