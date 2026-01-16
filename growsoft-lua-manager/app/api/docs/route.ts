import { NextRequest, NextResponse } from 'next/server';
import { fetchDocsIndex, fetchDocByPath } from '@/lib/docs-fetcher';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/docs
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path');
    
    if (path) {
      // Fetch specific document
      const doc = await fetchDocByPath(path);
      if (!doc) {
        return NextResponse.json(
          { success: false, error: 'Document not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        ...doc,
      });
    } else {
      // Fetch all docs index
      const docs = await fetchDocsIndex();
      
      return NextResponse.json({
        success: true,
        docs,
      });
    }
  } catch (error) {
    console.error('Error fetching docs:', error);
    
    // Return fallback docs if fetch fails
    return NextResponse.json({
      success: true,
      docs: getFallbackDocs(),
    });
  }
}

function getFallbackDocs() {
  return [
    {
      id: 'api-reference',
      title: 'API Reference',
      description: 'Complete Growsoft Lua API reference',
      category: 'API',
      path: 'api-reference.md',
    },
    {
      id: 'events',
      title: 'Events System',
      description: 'How to use events in Growsoft Lua',
      category: 'Events',
      path: 'events.md',
    },
    {
      id: 'packets',
      title: 'Packet Handling',
      description: 'Working with packets in Growsoft',
      category: 'Packets',
      path: 'packets.md',
    },
    {
      id: 'hooks',
      title: 'Hooks System',
      description: 'Using hooks to intercept functions',
      category: 'Hooks',
      path: 'hooks.md',
    },
    {
      id: 'tutorial-basics',
      title: 'Getting Started',
      description: 'Basic tutorial for Lua scripting',
      category: 'Tutorials',
      path: 'tutorial-basics.md',
    },
  ];
}