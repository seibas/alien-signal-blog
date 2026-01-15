/**
 * Environment Variables Validation
 * Ensures all required environment variables are present at startup
 */

/**
 * Required environment variables for production
 */
const REQUIRED_ENV_VARS = [
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'ADMIN_PASSWORD',
  'JWT_SECRET',
];

/**
 * Optional but recommended environment variables
 */
const OPTIONAL_ENV_VARS = [
  'NEXT_PUBLIC_BASE_URL',
  'BLOB_READ_WRITE_TOKEN', // For Vercel Blob storage
];

/**
 * Validate that all required environment variables are present
 * @throws {Error} If any required variables are missing
 */
export function validateEnv() {
  const missing = [];
  const warnings = [];

  // Check required variables
  for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  // Check optional but recommended variables
  for (const varName of OPTIONAL_ENV_VARS) {
    if (!process.env[varName]) {
      warnings.push(varName);
    }
  }

  // Throw error if required variables are missing
  if (missing.length > 0) {
    const errorMessage = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  MISSING REQUIRED ENVIRONMENT VARIABLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The following required environment variables are not set:

${missing.map(v => `  ❌ ${v}`).join('\n')}

Please set these variables in your .env.local file or Vercel dashboard.

Example .env.local:
${missing.map(v => `${v}=your-value-here`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
    throw new Error(errorMessage);
  }

  // Log warnings for optional variables (development only)
  if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.warn('⚠️  Optional environment variables not set:');
    console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    warnings.forEach(v => console.warn(`  ⚠️  ${v}`));
    console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }

  return true;
}

/**
 * Get environment info for debugging (safe - doesn't expose values)
 */
export function getEnvInfo() {
  const info = {
    nodeEnv: process.env.NODE_ENV,
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    requiredVarsSet: REQUIRED_ENV_VARS.every(v => !!process.env[v]),
    optionalVarsSet: OPTIONAL_ENV_VARS.filter(v => !!process.env[v]).length,
    totalOptional: OPTIONAL_ENV_VARS.length,
  };

  return info;
}
