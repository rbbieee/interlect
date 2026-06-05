// Configuration loader for LLM providers and API keys
const config = {
  provider: process.env.LLM_PROVIDER || 'gemini', // 'gemini', 'openai', 'claude', 'deepseek', 'openrouter'
  
  // Provider API keys
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    apiUrl: process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta'
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    apiUrl: process.env.OPENAI_API_URL || 'https://api.openai.com/v1'
  },
  claude: {
    apiKey: process.env.CLAUDE_API_KEY || '',
    model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
    apiUrl: process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1'
  },
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    apiUrl: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1'
  },
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || '',
    model: process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash',
    apiUrl: process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1'
  }
};

export default config;
