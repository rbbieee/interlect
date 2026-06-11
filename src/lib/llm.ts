import config from './config';

export interface University {
  name: string;
  established: string;
  rank: string;
  country: string;
  type: string;
  size: string;
  students: string;
  internationalStudents: string;
  majors: string;
  researchOpportunities: string;
  system: string;
  graduationRate: string;
  acceptanceRate: string;
  avgGpa: string;
  recommendationLetters: string;
  personalEssay: string;
  applicationFee: string;
  image?: string;
  logo?: string;
  notFound?: boolean;
}

export interface ChatMessage {
  role: string;
  content: string;
}

const mockData: Record<string, University> = {
  "harvard university": {
    name: "Harvard University",
    established: "1636",
    rank: "#1 Worldwide (QWUR 2025)",
    country: "America",
    type: "Private",
    size: "~5000 Acres",
    students: "~24.519",
    internationalStudents: "~25-27%",
    majors: "Economics, Government, Law, Medicine",
    researchOpportunities: "Very high (many research institutes)",
    system: "Liberal Arts",
    graduationRate: "~97%",
    acceptanceRate: "~3.5%",
    avgGpa: "~4.0",
    recommendationLetters: "2 required",
    personalEssay: "Required",
    applicationFee: "~$85"
  },
  "princeton university": {
    name: "Princeton University",
    established: "1746",
    rank: "#3 Worldwide (QWUR 2025)",
    country: "America",
    type: "Private",
    size: "~600 Acres",
    students: "~8.500",
    internationalStudents: "~23%",
    majors: "Mathematics, Physics, Public Policy",
    researchOpportunities: "Extremely strong for undergraduates",
    system: "Liberal Arts",
    graduationRate: "~98%",
    acceptanceRate: "~4%",
    avgGpa: "3.8 – 4.0",
    recommendationLetters: "2 required",
    personalEssay: "Required",
    applicationFee: "~$75"
  },
  "yale university": {
    name: "Yale University",
    established: "1701",
    rank: "#5 Worldwide (QWUR 2025)",
    country: "America",
    type: "Private",
    size: "~1015 Acres",
    students: "~14.500",
    internationalStudents: "~24%",
    majors: "Political Science, History, Economics",
    researchOpportunities: "Strong research programs",
    system: "Liberal Arts",
    graduationRate: "~96%",
    acceptanceRate: "~5%",
    avgGpa: "3.8 – 4.0",
    recommendationLetters: "2 required",
    personalEssay: "Required",
    applicationFee: "~$80"
  }
};

function findMockUniversity(name: string): University | null {
  const norm = name.toLowerCase().trim();
  if (norm.includes("harvard")) return mockData["harvard university"];
  if (norm.includes("yale")) return mockData["yale university"];
  if (norm.includes("princeton")) return mockData["princeton university"];
  return null;
}

function generateGenericMock(name: string): University {
  const formattedName = name
    .trim()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
    
  return {
    name: formattedName,
    established: "1880",
    rank: "#" + (Math.floor(Math.random() * 100) + 10) + " Worldwide (QWUR)",
    country: "United States",
    type: "Public",
    size: "~400 Acres",
    students: "~20,000",
    internationalStudents: "~15%",
    majors: "Computer Science, Business Administration, Engineering",
    researchOpportunities: "High level of undergraduate research opportunities",
    system: "Semester System",
    graduationRate: "~88%",
    acceptanceRate: "~12%",
    avgGpa: "3.7 – 3.9",
    recommendationLetters: "2 required",
    personalEssay: "Required",
    applicationFee: "~$75"
  };
}

export async function compareUniversities(universityNames: string[]): Promise<{ universities: University[] }> {
  if (!Array.isArray(universityNames) || universityNames.length === 0) {
    return { universities: [] };
  }

  // 1. Check if we can fulfill all of them using local mock data (for quick response & no-key support)
  const results: University[] = [];
  let allMockFound = true;
  
  for (const name of universityNames) {
    const mock = findMockUniversity(name);
    if (mock) {
      results.push(mock);
    } else {
      allMockFound = false;
    }
  }

  if (allMockFound) {
    return { universities: results };
  }

  // 2. Check if we have API keys configured. If not, generate generic mocks for the missing ones.
  const provider = config.provider;
  const apiKey = config[provider]?.apiKey;

  if (!apiKey) {
    console.warn(`No API key configured for provider: ${provider}. Using mock data.`);
    const combinedResults = universityNames.map(name => {
      const mock = findMockUniversity(name);
      return mock ? mock : generateGenericMock(name);
    });
    return { universities: combinedResults };
  }

  // 3. Make LLM API call
  const prompt = `You are a university comparison expert. Compare the following universities: ${universityNames.join(', ')}.
Return a JSON object with a single key "universities" mapping to an array of objects.
Each object represents one university and must contain these fields exactly:
- name: (Official full name of the university, e.g. "Harvard University")
- established: (Year established, e.g. "1636")
- rank: (QS World University Rank or similar, e.g. "#1 Worldwide (QWUR 2025)" or "#20 Worldwide")
- country: (Country where it is located, e.g. "America", "United Kingdom", "Japan")
- type: (Public or Private, e.g. "Private")
- size: (Campus size, e.g. "~5000 Acres" or "~120 Hectares")
- students: (Total student enrollment, e.g. "~24.519" or "~15,000")
- internationalStudents: (Percentage of international students, e.g. "~25-27%")
- majors: (Comma-separated list of popular majors, e.g. "Economics, Government, Law, Medicine")
- researchOpportunities: (Brief description of research level/opportunities, e.g. "Very high (many research institutes)")
- system: (Academic system/curriculum type, e.g. "Liberal Arts" or "Semester")
- graduationRate: (Graduation rate percentage, e.g. "~97%")
- acceptanceRate: (Acceptance rate percentage, e.g. "~3.5%")
- avgGpa: (Average GPA of admitted students, e.g. "~4.0" or "3.8 – 4.0")
- recommendationLetters: (Recommendation letter requirements, e.g. "2 required" or "None")
- personalEssay: (Essay requirement, e.g. "Required" or "Optional")
- applicationFee: (Application fee, e.g. "~$85" or "Free")

Ensure that the order of the universities in the returned array matches the order requested: ${universityNames.join(', ')}.
Return ONLY the raw JSON object. Do not include markdown formatting blocks unless required by JSON mode.`;

  try {
    let jsonResponseText = '';

    if (provider === 'gemini') {
      const url = `${config.gemini.apiUrl}/models/${config.gemini.model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      jsonResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } 
    else if (provider === 'openai') {
      const url = `${config.openai.apiUrl}/chat/completions`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: config.openai.model,
          messages: [
            { role: 'system', content: 'You are a helpful assistant that returns JSON only.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API returned status ${response.status}`);
      }

      const data = await response.json();
      jsonResponseText = data.choices?.[0]?.message?.content || '';
    } 
    else if (provider === 'deepseek') {
      const url = `${config.deepseek.apiUrl}/chat/completions`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: config.deepseek.model,
          messages: [
            { role: 'system', content: 'You are a helpful assistant that returns JSON only.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API returned status ${response.status}`);
      }

      const data = await response.json();
      jsonResponseText = data.choices?.[0]?.message?.content || '';
    }
    else if (provider === 'openrouter') {
      const url = `${config.openrouter.apiUrl}/chat/completions`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Interlect'
        },
        body: JSON.stringify({
          model: config.openrouter.model,
          messages: [
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API returned status ${response.status}`);
      }

      const data = await response.json();
      jsonResponseText = data.choices?.[0]?.message?.content || '';
    }
    else if (provider === 'claude') {
      const url = `${config.claude.apiUrl}/messages`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: config.claude.model,
          max_tokens: 4000,
          system: "You are a helpful assistant that returns JSON only.",
          messages: [
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API returned status ${response.status}`);
      }

      const data = await response.json();
      jsonResponseText = data.content?.[0]?.text || '';
    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    // Clean Markdown wrapper blocks if the LLM returned it
    let cleanJson = jsonResponseText.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    }

    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('LLM Fetch Error:', error);
    // On failure, fallback to generating mock data so page doesn't crash
    const fallbackResults = universityNames.map(name => {
      const mock = findMockUniversity(name);
      return mock ? mock : generateGenericMock(name);
    });
    return { universities: fallbackResults };
  }
}

const CHAT_SYSTEM_INSTRUCTION = `You are the Interlect Education Consultant AI. Your only purpose is to help students find universities, scholarships, admission requirements, and academic counseling. Politely refuse to write code, solve programming tasks, perform creative writing on unrelated topics, or answer unrelated general knowledge questions. If the user asks about unrelated topics, reply: "I am only programmed to assist with university, scholarship, and educational counseling inquiries." Keep responses helpful, professional, and concise.`;

export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
  if (!Array.isArray(messages) || messages.length === 0) {
    return "Hello! How can I help you find your dream university today?";
  }

  const provider = config.provider;
  const apiKey = config[provider]?.apiKey;

  // Fallback simulator if no API key is provided
  if (!apiKey) {
    const latestUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';
    const query = latestUserMessage.toLowerCase();

    if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
      return "Hello! I am your Interlect education assistant. I can help you search for universities, compare requirements, and find scholarship programs. What study destination are you interested in?";
    }
    if (query.includes('scholarship')) {
      return "There are several major scholarship options available: the Japanese MEXT Scholarship covers 100% tuition plus monthly allowance, while the US Fulbright Program offers full funding for graduate students. Would you like to check admission requirements for universities offering these?";
    }
    if (query.includes('japan') || query.includes('tokyo') || query.includes('kyoto')) {
      return "Japan is a fantastic study destination! The University of Tokyo and Kyoto University are world-renowned, especially for research. I can help you compare their GPA requirements and tuition fees. Would you like to check their details?";
    }
    if (query.includes('requirement') || query.includes('gpa') || query.includes('test')) {
      return "Top universities typically require a GPA of 3.8+ out of 4.0 and English proficiency (TOEFL 90+ / IELTS 6.5+). They also require recommendation letters and a personal essay. Would you like me to compare specific entry requirements?";
    }
    
    // Default fallback
    return "I am here to assist you with university search, scholarship details, and admission criteria. Let me know which programs or countries you want to explore!";
  }

  try {
    if (provider === 'gemini') {
      const url = `${config.gemini.apiUrl}/models/${config.gemini.model}:generateContent?key=${apiKey}`;
      
      // Map roles: Gemini uses 'user' and 'model'
      const geminiContents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: geminiContents,
          systemInstruction: {
            parts: [{ text: CHAT_SYSTEM_INSTRUCTION }]
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";
    }
    else if (provider === 'openai') {
      const url = `${config.openai.apiUrl}/chat/completions`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: config.openai.model,
          messages: [
            { role: 'system', content: CHAT_SYSTEM_INSTRUCTION },
            ...messages
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API returned status ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    }
    else if (provider === 'deepseek') {
      const url = `${config.deepseek.apiUrl}/chat/completions`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: config.deepseek.model,
          messages: [
            { role: 'system', content: CHAT_SYSTEM_INSTRUCTION },
            ...messages
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API returned status ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    }
    else if (provider === 'openrouter') {
      const url = `${config.openrouter.apiUrl}/chat/completions`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Interlect'
        },
        body: JSON.stringify({
          model: config.openrouter.model,
          messages: [
            { role: 'system', content: CHAT_SYSTEM_INSTRUCTION },
            ...messages
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API returned status ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    }
    else if (provider === 'claude') {
      const url = `${config.claude.apiUrl}/messages`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: config.claude.model,
          max_tokens: 1000,
          system: CHAT_SYSTEM_INSTRUCTION,
          messages: messages
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API returned status ${response.status}`);
      }

      const data = await response.json();
      return data.content?.[0]?.text || "I'm sorry, I couldn't generate a response.";
    }
    else {
      throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (error) {
    console.error('LLM Chat Fetch Error:', error);
    return "I apologize, but I encountered an error. Please check your network connection or try again later.";
  }
}
