import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/database';
import { checkLuaSyntax } from '@/lib/lua-checker';

// GET /api/scripts/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToDatabase();
    const script = await db.collection('scripts').findOne({
      _id: new ObjectId(params.id),
    });

    if (!script) {
      return NextResponse.json(
        { success: false, error: 'Script not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      script: {
        id: script._id.toString(),
        name: script.name,
        content: script.content,
        status: script.status,
        createdAt: script.createdAt,
        updatedAt: script.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching script:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch script' },
      { status: 500 }
    );
  }
}

// PUT /api/scripts/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const result = await db.collection('scripts').updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          name,
          content,
          status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Script not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      script: {
        id: params.id,
        name,
        content,
        status,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error updating script:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update script' },
      { status: 500 }
    );
  }
}

// DELETE /api/scripts/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToDatabase();
    const result = await db.collection('scripts').deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Script not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Script deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting script:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete script' },
      { status: 500 }
    );
  }
}