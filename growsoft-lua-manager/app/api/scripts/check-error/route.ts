import { NextRequest, NextResponse } from 'next/server';
import { checkLuaSyntax } from '@/lib/lua-checker';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    const result = await checkLuaSyntax(content);
    
    return NextResponse.json({
      success: true,
      valid: result.valid,
      error: result.error,
      warnings: result.warnings,
    });
  } catch (error) {
    console.error('Error checking syntax:', error);
    return NextResponse.json(
      { 
        success: false, 
        valid: false, 
        error: 'Failed to check syntax',
        warnings: [] 
      },
      { status: 500 }
    );
  }
}