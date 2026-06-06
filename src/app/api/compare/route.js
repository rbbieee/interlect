import { NextResponse } from 'next/server';
import { compareUniversities } from '../../../lib/llm';

// Descriptive User-Agent header strictly required by Wikimedia APIs to prevent 403 blocks
const WIKIPEDIA_HEADERS = {
  'User-Agent': 'InterlectApp/1.0 (support@interlect.com; education consultant comparison tool)'
};

// Helper to fetch high-resolution campus images from Wikipedia
async function fetchWikimediaImage(universityName) {
  try {
    // 1. Search Wikipedia for the best matching page title
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(universityName + " campus")}&srlimit=1`;
    const searchRes = await fetch(searchUrl, { headers: WIKIPEDIA_HEADERS });
    if (!searchRes.ok) throw new Error("Search API failed");
    const searchData = await searchRes.json();
    let page = searchData.query?.search?.[0];

    // If " campus" query fails to yield results, try just the university name
    if (!page) {
      const fallbackSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(universityName)}&srlimit=1`;
      const fallbackRes = await fetch(fallbackSearchUrl, { headers: WIKIPEDIA_HEADERS });
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        page = fallbackData.query?.search?.[0];
      }
    }

    if (!page) return null;

    // 2. Query PageImages to get the actual image URL
    const imageUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&piprop=original|thumbnail&pithumbsize=800&titles=${encodeURIComponent(page.title)}`;
    const imageRes = await fetch(imageUrl, { headers: WIKIPEDIA_HEADERS });
    if (!imageRes.ok) throw new Error("Image API failed");
    const imageData = await imageRes.json();
    const pages = imageData.query?.pages;
    if (!pages) return null;

    const pageId = Object.keys(pages)[0];
    const pageData = pages[pageId];
    
    // Prioritize original size, fallback to 800px thumbnail
    return pageData.original?.source || pageData.thumbnail?.source || null;
  } catch (error) {
    console.error(`Wikimedia fetch failed for ${universityName}:`, error);
    return null;
  }
}

// Helper to fetch university logo from Wikipedia
async function fetchWikimediaLogo(universityName) {
  try {
    // 1. Search Wikipedia for logo
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(universityName + " logo")}&srlimit=1`;
    const searchRes = await fetch(searchUrl, { headers: WIKIPEDIA_HEADERS });
    if (!searchRes.ok) throw new Error("Logo search failed");
    const searchData = await searchRes.json();
    let page = searchData.query?.search?.[0];

    // Fallback: search for " seal"
    if (!page) {
      const fallbackUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(universityName + " seal")}&srlimit=1`;
      const fallbackRes = await fetch(fallbackUrl, { headers: WIKIPEDIA_HEADERS });
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        page = fallbackData.query?.search?.[0];
      }
    }

    if (!page) return null;

    // 2. Query PageImages to get the image URL
    const imageUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&piprop=original|thumbnail&pithumbsize=300&titles=${encodeURIComponent(page.title)}`;
    const imageRes = await fetch(imageUrl, { headers: WIKIPEDIA_HEADERS });
    if (!imageRes.ok) throw new Error("Logo image API failed");
    const imageData = await imageRes.json();
    const pages = imageData.query?.pages;
    if (!pages) return null;

    const pageId = Object.keys(pages)[0];
    const pageData = pages[pageId];
    
    return pageData.original?.source || pageData.thumbnail?.source || null;
  } catch (error) {
    console.error(`Wikimedia logo fetch failed for ${universityName}:`, error);
    return null;
  }
}

// Helper to get local fallback logo if it exists
function getLocalLogo(universityName) {
  const norm = universityName.toLowerCase().trim();
  if (norm.includes("harvard")) return "/harvard.png";
  if (norm.includes("yale")) return "/yale.png";
  if (norm.includes("princeton")) return "/princeton.png";
  if (norm.includes("tokyo")) return "/tokyo.png";
  if (norm.includes("ucla")) return "/ucla.png";
  if (norm.includes("kyoto")) return "/kyoto.png";
  if (norm.includes("malaya")) return "/malaya.png";
  if (norm.includes("nara")) return "/nara.png";
  return null;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const namesQuery = searchParams.get('names');
    
    // Parse names, defaulting to Harvard, Yale, Princeton if empty or omitted
    let universityNames = [];
    if (namesQuery) {
      universityNames = namesQuery
          .split(',')
          .map(n => n.trim())
          .filter(n => n.length > 0);
    }

    if (universityNames.length === 0) {
      universityNames = ['Harvard University', 'Yale University', 'Princeton University'];
    }

    // Call LLM agnostic compare helper
    const comparisonResult = await compareUniversities(universityNames);
    
    // Fetch Wikipedia images and logos in parallel for each resolved university name
    const updatedUniversities = await Promise.all(
      comparisonResult.universities.map(async (uni) => {
        const nameKey = uni.name || uni.requestedName;
        const localLogo = getLocalLogo(nameKey);
        
        const [image, logo] = await Promise.all([
          fetchWikimediaImage(nameKey),
          localLogo ? Promise.resolve(localLogo) : fetchWikimediaLogo(nameKey)
        ]);

        return {
          ...uni,
          image: image || `/img/university-placeholder.jpg`, // fallback if Wikimedia doesn't find any image
          logo: logo || `/img/Logo.png` // fallback logo
        };
      })
    );

    return NextResponse.json({ universities: updatedUniversities });
  } catch (error) {
    console.error('API Error /api/compare:', error);
    return NextResponse.json(
      { error: 'Failed to generate comparison data.' },
      { status: 500 }
    );
  }
}
