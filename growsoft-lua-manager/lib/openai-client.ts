import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY is not set. AI features will be limited.');
}

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export async function generateAIContent(
  prompt: string,
  context?: string
): Promise<{
  success: boolean;
  content: string;
  error?: string;
}> {
  if (!openai) {
    return {
      success: false,
      content: 'AI service is not configured. Please set OPENAI_API_KEY environment variable.',
      error: 'OpenAI not configured',
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: context || 'You are a helpful Lua scripting assistant for Growtopia Private Server.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return {
      success: true,
      content: completion.choices[0]?.message?.content || '',
    };
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    return {
      success: false,
      content: '',
      error: error.message,
    };
  }
}