import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { checkLuaSyntax } from '@/lib/lua-checker';

// GET /api/scripts
export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    
    let query = {};
    if (status && status !== 'all') {
      query = { status };
    }
    
    const scripts = await db.collection('scripts')
      .find(query)
      .sort({ updatedAt: -1 })
      .toArray();
    
    return NextResponse.json({
      success: true,
      scripts: scripts.map(script => ({
        id: script._id.toString(),
        name: script.name,
        content: script.content,
        status: script.status,
        createdAt: script.createdAt,
        updatedAt: script.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching scripts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch scripts' },
      { status: 500 }
    );
  }
}

// POST /api/scripts
export async function POST(request: NextRequest) {
  try {
    const { name, content } = await request.json();
    
    if (!name || !content) {
      return NextResponse.json(
        { success: false, error: 'Name and content are required' },
        { status: 400 }
      );
    }

    const syntaxCheck = await checkLuaSyntax(content);
    const status = syntaxCheck.valid ? 'valid' : 'error';

    const db = await connectToDatabase();
    const result = await db.collection('scripts').insertOne({
      name,
      content,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      script: {
        id: result.insertedId.toString(),
        name,
        content,
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error creating script:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create script' },
      { status: 500 }
    );
  }
}