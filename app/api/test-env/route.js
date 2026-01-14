// Test endpoint to check environment variables
export async function GET() {
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
  const keyPreview = process.env.ANTHROPIC_API_KEY
    ? process.env.ANTHROPIC_API_KEY.substring(0, 15) + '...'
    : 'NOT SET';

  return Response.json({
    environment: process.env.NODE_ENV,
    hasAnthropicKey: hasApiKey,
    keyPreview: keyPreview,
    keyLength: process.env.ANTHROPIC_API_KEY?.length || 0,
    allEnvVars: Object.keys(process.env).filter(key =>
      key.includes('ANTHROPIC') || key.includes('API')
    )
  });
}
