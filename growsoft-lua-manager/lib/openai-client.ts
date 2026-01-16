const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-coder';

export async function generateAIContent(
  prompt: string,
  context?: string
): Promise<{
  success: boolean;
  content: string;
  error?: string;
}> {
  if (!DEEPSEEK_API_KEY) {
    return {
      success: false,
      content: '',
      error: 'DeepSeek API key not configured',
    };
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          {
            role: 'system',
            content:
              context ||
              'You are a Lua scripting assistant specialized in Growsoft (Growtopia Private Server).',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('DeepSeek API error');
    }

    const data = await response.json();

    return {
      success: true,
      content: data.choices?.[0]?.message?.content || '',
    };
  } catch (error: any) {
    console.error('DeepSeek API error:', error);
    return {
      success: false,
      content: '',
      error: error.message,
    };
  }
}
