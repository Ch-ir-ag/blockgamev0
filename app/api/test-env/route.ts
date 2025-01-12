import { NextResponse } from 'next/server'
import { validateEnv } from '../validate-env'

export async function GET() {
  try {
    const env = validateEnv()
    return NextResponse.json({
      status: 'success',
      huggingface: 'Present',
      huggingfaceLength: env.HUGGING_FACE_API_KEY.length,
      message: 'Environment variables loaded successfully'
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      rawEnv: process.env.HUGGING_FACE_API_KEY ? 'Present' : 'Missing'
    })
  }
} 