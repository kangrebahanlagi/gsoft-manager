import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { fetchDocsContent } from '@/lib/docs-fetcher';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// System prompt with Growsoft Lua context
const SYSTEM_PROMPT = `You are an expert Lua scripting assistant specialized in Growtopia Private Server (Growsoft). 
Your knowledge includes:
- Growsoft Lua API functions and events
- Packet handling and hook systems
- Game mechanics and automation
- Lua best practices and optimization

Guidelines:
1. Always provide accurate, working Lua code examples
2. Explain concepts clearly with practical examples
3. Focus on Growsoft-specific implementations
4. Include error handling and best practices
5. When unsure, suggest checking official documentation

Format responses with clear explanations and code blocks.`;

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json();
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Fetch relevant documentation for context
    let docsContext = '';
    if (context === 'growtopia-lua-growsoft') {
      const docs = await fetchDocsContent(['api-reference', 'events', 'packets']);
      docsContext = `\n\nRelevant Documentation:\n${docs}`;
    }

    // Prepare messages for OpenAI
    const openaiMessages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT + docsContext,
      },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-1106-preview',
      messages: openaiMessages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: false,
    });

    const reply = completion.choices[0]?.message?.content || 'No response generated.';

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error('AI API error:', error);
    
    // Fallback responses if OpenAI fails
    const fallbackResponses = [
      "I understand you need help with Lua scripting. Unfortunately, I'm having trouble accessing my full capabilities right now. You might want to check the documentation or try again later.",
      "As a Growsoft Lua assistant, I typically help with script generation and debugging. Please try your request again in a moment.",
      "For Lua scripting help, you can check the documentation section for API references and examples while I work on getting back to full functionality.",
    ];
    
    return NextResponse.json({
      success: true,
      reply: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
    });
  }
}