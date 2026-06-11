import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const namesQuery = searchParams.get('names');
    const listOnly = searchParams.get('list') === 'true';

    if (listOnly) {
      const [rows] = await db.query("SELECT name FROM University ORDER BY name ASC");
      return NextResponse.json({ universities: rows.map(r => r.name) });
    }

    let universityNames = [];
    if (namesQuery) {
      universityNames = namesQuery
        .split(',')
        .map(n => n.trim())
        .filter(n => n.length > 0);
    }

    if (universityNames.length === 0) {
      return NextResponse.json({ universities: [] });
    }

    const results = [];
    for (const name of universityNames) {
      // Direct database lookup using fuzzy search
      const [rows] = await db.query(
        "SELECT * FROM University WHERE name LIKE ?",
        [`%${name}%`]
      );

      if (rows.length > 0) {
        const dbUni = rows[0];
        results.push({
          name: dbUni.name,
          country: dbUni.country || dbUni.location || "N/A",
          type: dbUni.type || "Private",
          established: dbUni.established || "N/A",
          size: dbUni.size || "N/A",
          students: dbUni.students || "N/A",
          internationalStudents: dbUni.international_students || "N/A",
          rank: dbUni.ranking || "N/A",
          majors: dbUni.majors || "N/A",
          researchOpportunities: dbUni.research_opportunities || "N/A",
          system: dbUni.academic_system || "Semester",
          graduationRate: dbUni.graduation_rate || "N/A",
          acceptanceRate: dbUni.acceptance_rate || "N/A",
          avgGpa: dbUni.avg_gpa || "N/A",
          recommendationLetters: dbUni.recommendation_letters || "N/A",
          personalEssay: dbUni.personal_essay || "N/A",
          applicationFee: dbUni.application_fee || "N/A",
          image: dbUni.image_url || "/img/university-placeholder.jpg",
          logo: dbUni.logo_url || "/img/Logo.png"
        });
      } else {
        // Return a structured fallback "not found" object
        results.push({
          name: `${name} (Not in Database)`,
          country: "N/A",
          type: "N/A",
          established: "N/A",
          size: "N/A",
          students: "N/A",
          internationalStudents: "N/A",
          rank: "N/A",
          majors: "N/A",
          researchOpportunities: "N/A",
          system: "N/A",
          graduationRate: "N/A",
          acceptanceRate: "N/A",
          avgGpa: "N/A",
          recommendationLetters: "N/A",
          personalEssay: "N/A",
          applicationFee: "N/A",
          image: "/img/university-placeholder.jpg",
          logo: "/img/Logo.png",
          notFound: true
        });
      }
    }

    return NextResponse.json({ universities: results });
  } catch (error) {
    console.error('API Error /api/compare/db:', error);
    return NextResponse.json(
      { error: 'Failed to query database comparison.' },
      { status: 500 }
    );
  }
}
