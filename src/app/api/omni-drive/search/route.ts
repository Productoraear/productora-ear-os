import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Lazy import to avoid build-time evaluation crashing on missing .db file
    const Database = (await import("better-sqlite3")).default;
    const dbPath = process.env.DB_PATH || "../../data/golden_index.db";
    const db = new Database(dbPath);

    const stmt = db.prepare(`
      SELECT filename, filepath
      FROM fts_index
      WHERE fts_index MATCH ?
      ORDER BY rank
      LIMIT 50;
    `);

    const results = stmt.all(query);
    db.close();

    return NextResponse.json(results);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown database error";
    console.error("⚠️ [Omni-Drive] Database query failed:", message);
    return NextResponse.json(
      { error: "Database unavailable", detail: message },
      { status: 503 }
    );
  }
}
