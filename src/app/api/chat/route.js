import { NextResponse } from 'next/server';
import { chatWithAI } from '../../../lib/llm';

// Helper to filter potential prompt hijacking, jailbreaking, or coding abuses
function detectPromptAbuse(text) {
  const query = text.toLowerCase().trim();

  // 1. Coding/programming requests
  const programmingPatterns = [
    'write code', 'write a function', 'write a script', 'how to code', 
    'javascript', 'python', 'c++', 'java', 'html', 'css', 'sql query', 
    'react component', 'typescript', 'binary tree', 'sort an array',
    'coding task', 'programming'
  ];

  // 2. Jailbreak or system override phrases
  const jailbreakPatterns = [
    'ignore previous instructions', 'ignore the system prompt', 'ignore instructions',
    'dan mode', 'do anything now', 'jailbreak', 'system prompt:', 'you are now a',
    'bypass guidelines'
  ];

  // 3. Completely unrelated general topics
  const unrelatedPatterns = [
    'recipe for', 'how to bake', 'how to cook', 'movie review', 
    'weather in', 'lyrics of', 'who won the world cup'
  ];

  if (programmingPatterns.some(p => query.includes(p))) return true;
  if (jailbreakPatterns.some(p => query.includes(p))) return true;
  if (unrelatedPatterns.some(p => query.includes(p))) return true;

  return false;
}

export async function POST(request) {
  try {
    const { messages } = await request.json();
    
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages provided.' },
        { status: 400 }
      );
    }

    // Get the latest user message
    const latestUserMsg = [...messages].reverse().find(m => m.role === 'user');
    const userText = latestUserMsg ? latestUserMsg.content : '';

    // Guardrail against prompt hijacking and abuse
    if (detectPromptAbuse(userText)) {
      return NextResponse.json({
        response: "I can only assist you with university admissions, scholarship inquiries, and educational consulting. I am not programmed to write code, solve general knowledge queries, or fulfill unrelated requests. Please let me know how I can help you with your college search!"
      });
    }

    // Call unified LLM client
    const aiResponse = await chatWithAI(messages);

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('API Error /api/chat:', error);
    return NextResponse.json(
      { error: 'Failed to process chat conversation.' },
      { status: 500 }
    );
  }
}
