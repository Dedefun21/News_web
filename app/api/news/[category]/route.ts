import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category: rawCategory } = await params;
  const category = rawCategory === "latest" ? "" : rawCategory;

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "9", 10), 1), 100);
  const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);

  const baseUrl = "https://berita-indo-api-next.vercel.app/api/cnn-news";
  const url = category ? `${baseUrl}/${category}` : baseUrl;

  try {
    const response = await axios.get(url);
    const allData = response.data?.data ?? [];
    const paginatedData = allData.slice(offset, offset + limit);

    return NextResponse.json({ ...response.data, data: paginatedData, total: allData.length });
  } catch (error) {
    console.error("API /api/news/[category] error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dari API berita." },
      { status: 500 }
    );
  }
}
