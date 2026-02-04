import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { applyAuthRateLimit, rateLimitResponse } from '@/lib/rateLimit';

// Server-side only - never exposed to client
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '0904';
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

export async function POST(request) {
  try {
    // Apply strict rate limiting (5 attempts per minute)
    const rateLimitResult = await applyAuthRateLimit(request);
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult.reset);
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password required' },
        { status: 400 }
      );
    }

    // Verify password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Generate JWT token (expires in 24 hours)
    const token = await new SignJWT({ admin: true })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    // Return token
    return NextResponse.json({
      success: true,
      token,
      message: 'Authentication successful'
    });

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
