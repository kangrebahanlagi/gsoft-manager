import { NextRequest, NextResponse } from 'next/server';
import { fetchDocsContent } from '@/lib/docs-fetcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * DeepSeek AI – Growsoft Lua Assistant
 * Compatible with OpenAI-style chat completions
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawMessages = body.messages || [];

    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY not set');
    }

    const messages = rawMessages.map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        temperature: 0.6,
        max_tokens: 2000,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('DeepSeek error:', data);
      return NextResponse.json({
        success: false,
        reply:
          data?.error?.message ||
          'AI unavailable (possibly insufficient balance)',
      });
    }

    return NextResponse.json({
      success: true,
      reply: data.choices?.[0]?.message?.content || '',
    });
  } catch (error) {
    console.error('[AI ERROR]', error);
    return NextResponse.json({
      success: false,
      reply:
        'AI sedang tidak tersedia. Silakan cek saldo atau konfigurasi DeepSeek.',
    });
  }
}

/**
 * 🔥 OPTIMIZED SYSTEM PROMPT – Growsoft Lua
 */
const SYSTEM_PROMPT = `
You are a senior Lua developer specialized in Growtopia Private Server scripting (Growsoft).

You have deep knowledge of:
- Growsoft Lua API (gt.sendPacket, gt.on, gt.hook, gt.getLocal, gt.sleep, etc.)
- Packet handling, tile updates, dialogs, hooks, and events
- Automation scripts (auto farm, auto break, auto collect, bot helpers)
- Performance-safe Lua scripting for game environments

Rules:
1. Always write VALID Lua 5.x code
2. Use Growsoft-style APIs (prefix: gt.)
3. Avoid imaginary functions
4. Prefer event-based logic over infinite loops
5. Add comments for clarity
6. If fixing code, explain the bug briefly
7. If generating code, provide a COMPLETE script ready to use

Formatting:
- Use markdown
- Put code inside triple backticks (lua)
- Be concise but clear

Context:
This code will run inside Growsoft Lua environment (NOT standard Lua, NOT Roblox).
`;
