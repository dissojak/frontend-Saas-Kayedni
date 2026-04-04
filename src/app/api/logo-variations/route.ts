import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const LOGO_VARIATIONS_DIR = path.join(process.cwd(), "public", "LogoVariations");

export async function GET() {
  try {
    const entries = await fs.readdir(LOGO_VARIATIONS_DIR, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile() && /\.(png|jpg|jpeg|webp|svg)$/i.test(entry.name))
      .map((entry) => entry.name);

    return NextResponse.json({ files });
  } catch {
    // Fallback to empty list; navbar will keep the generic logo.
    return NextResponse.json({ files: [] });
  }
}