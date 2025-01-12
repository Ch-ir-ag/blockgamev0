export function validateEnv() {
  const requiredEnvVars = {
    HUGGING_FACE_API_KEY: process.env.HUGGING_FACE_API_KEY,
  }

  const missingEnvVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    )
  }

  return requiredEnvVars as Record<keyof typeof requiredEnvVars, string>
} 