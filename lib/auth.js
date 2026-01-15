import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Promise<boolean>} - True if valid, false otherwise
 */
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.admin === true;
  } catch (error) {
    return false;
  }
}

/**
 * Get token from request headers
 * @param {Request} request - Next.js request object
 * @returns {string|null} - Token or null
 */
export function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Middleware to verify admin authentication
 * Use this in API routes that require admin access
 * @param {Request} request - Next.js request object
 * @returns {Promise<NextResponse|null>} - Error response or null if authenticated
 */
export async function requireAuth(request) {
  const token = getTokenFromRequest(request);
  
  if (!token) {
    return new Response(
      JSON.stringify({ error: 'Authentication required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const isValid = await verifyToken(token);
  
  if (!isValid) {
    return new Response(
      JSON.stringify({ error: 'Invalid or expired token' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return null; // Authentication successful
}
