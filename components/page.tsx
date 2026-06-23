"use client";

import Link from "next/link";
import React, {useEffect, useState} from "react";
import axios from "axios";
import Image from "next/image";

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="15.5" y1="15.5" x2="22" y2="22" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="13 5 20 12 13 19" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width={52} height={52} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="12" rx="4" ry="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="22" y2="7" />
      <line x1="2" y1="17" x2="22" y2="17" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
      <rect x="6" y="12" width="2" height="2" />
      <rect x="12" y="12" width="2" height="2" />
      <rect x="12" y="16" width="2" height="2" />
      <rect x="6" y="16" width="2" height="2" />
    </svg>
  );
}

function ChipIcon() {
  return (
    <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <line x1="9" y1="7" x2="9" y2="4" /><line x1="12" y1="7" x2="12" y2="4" /><line x1="15" y1="7" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="17" /><line x1="12" y1="20" x2="12" y2="17" /><line x1="15" y1="20" x2="15" y2="17" />
      <line x1="7" y1="9" x2="4" y2="9" /><line x1="7" y1="12" x2="4" y2="12" /><line x1="7" y1="15" x2="4" y2="15" />
      <line x1="20" y1="9" x2="17" y2="9" /><line x1="20" y1="12" x2="17" y2="12" /><line x1="20" y1="15" x2="17" y2="15" />
      <rect x="10" y="10" width="4" height="4" />
    </svg>
  );
}

function ArtIcon() {
  return (
    <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="10" r="1.5" />
      <circle cx="15" cy="8" r="1.5" />
      <circle cx="16" cy="14" r="1.5" />
      <path d="M7 15c1-2 3-3 5-3s4 1 5 3" />
    </svg>
  );
}

// ─── Types & Data ─────────────────────────────────────────────────────────────

interface ApiArticle {
  title: string;
  link: string;
  contentSnippet: string;
  isoDate: string;
  image: {
    small: string;
    large: string;
  };
}

// Mengubah daftar NAV_LINKS agar sesuai dengan kategori yang didukung oleh API CNN Berita Indo
const NAV_LINKS = [
  { label: "Terbaru", path: "" },
  { label: "Nasional", path: "nasional" },
  { label: "Internasional", path: "internasional" },
  { label: "Ekonomi", path: "ekonomi" },
  { label: "Olahraga", path: "olahraga" },
  { label: "Teknologi", path: "teknologi" },
  { label: "Hiburan", path: "hiburan" },
] as const;

const FOOTER_LINKS = ["Tentang Kami", "Kebijakan Privasi", "Syarat & Ketentuan", "Kontak"] as const;

// ─── Navbar ───────────────────────────────────────────────────────────────────

interface NavbarProps {
  currentCategory: string;
  onCategoryChange: (path: string) => void;
}
function Navbar({ currentCategory, onCategoryChange }: NavbarProps) {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100, backgroundColor: "#f9f8f6", borderBottom: "1px solid #e0ddd8" }}>
      <nav style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", gap: 28 }}>
        <button 
          onClick={() => onCategoryChange("")}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: "1.05rem", letterSpacing: "0.04em", color: "#1a1a1a", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0, padding: 0 }}
        >
          INI BERITA
        </button>

        <ul style={{ display: "flex", alignItems: "center", gap: 2, listStyle: "none", margin: 0, padding: 0, flex: 1, overflowX: "auto" }}>
          {NAV_LINKS.map((link) => {
            const isActive = currentCategory === link.path;
            return (
              <li key={link.label}>
                <button
                  onClick={() => onCategoryChange(link.path)}
                  style={{
                    background: "none",
                    border: "none",
                    borderBottom: isActive ? "2px solid #1a1a1a" : "2px solid transparent",
                    cursor: "pointer",
                    display: "inline-block",
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "0.68rem",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: isActive ? "#1a1a1a" : "#6b6b6b",
                    padding: "6px 7px",
                  }}
                >
                  {link.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <button aria-label="Search" style={{ background: "none", border: "none", cursor: "pointer", color: "#1a1a1a", padding: 6, display: "flex", alignItems: "center", borderRadius: 4 }}>
            <SearchIcon />
          </button>
          <button aria-label="Account" style={{ background: "none", border: "none", cursor: "pointer", color: "#1a1a1a", padding: 6, display: "flex", alignItems: "center", borderRadius: 4 }}>
            <UserIcon />
          </button>
          <a href="/subscribe" style={{ backgroundColor: "#1a1a1a", color: "#f9f8f6", fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", padding: "8px 16px", borderRadius: 2, textDecoration: "none" }}>
            Subscribe
          </a>
        </div>
      </nav>
    </header>
  );
}
// ─── Hero Story ───────────────────────────────────────────────────────────────

interface HeroStoryProps {
  article: ApiArticle;
}

function HeroStory({ article }: HeroStoryProps) {
  return (
    <section style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 56px", display: "grid", gridTemplateColumns: "3fr 2fr", gap: 40, alignItems: "center" }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", backgroundColor: "#2a2a2a", borderRadius: 2, display: "flex", overflow: "hidden" }}>
        {article.image?.large ? (
          <Image src={article.image.large} alt={article.title} fill style={{ objectFit: "cover" }} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", gap: 10, color: "rgba(255,255,255,0.22)" }}>
            <GlobeIcon />
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <span style={{ display: "inline-block", alignSelf: "flex-start", backgroundColor: "#1a1a1a", color: "#f9f8f6", fontFamily: "system-ui, sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 8px", borderRadius: 2 }}>
          Sorotan Utama
        </span>

        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "1.85rem", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.01em", color: "#1a1a1a", margin: 0 }}>
          {article.title}
        </h1>

        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.875rem", lineHeight: 1.7, color: "#6b6b6b", margin: 0 }}>
          {article.contentSnippet}
        </p>

        <a href={article.link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start", fontFamily: "system-ui, sans-serif", fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a1a1a", textDecoration: "none", borderBottom: "1px solid #1a1a1a", paddingBottom: 2 }}>
          Baca Selengkapnya
          <ArrowRightIcon />
        </a>
      </div>
    </section>
  );
}
// ─── News Card ────────────────────────────────────────────────────────────────

function NewsCard({ title, link, contentSnippet, image, isoDate }: ApiArticle) {
  const formattedDate = new Date(isoDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <article style={{ display: "flex", flexDirection: "column" }}>
      <a href={link} target="_blank" rel="noopener noreferrer" style={{ display: "block", overflow: "hidden", borderRadius: 2, textDecoration: "none" }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", backgroundColor: "#e0ddd8", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {image?.small ? (
            <Image src={image.small} alt={title} fill style={{ objectFit: "cover" }} />
          ) : (
            <span style={{ color: "#6b6b6b" }}>No Image</span>
          )}
        </div>
      </a>
      <div style={{ paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b6b6b" }}>
          {formattedDate}
        </span>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.1rem", fontWeight: 700, lineHeight: 1.25, color: "#1a1a1a", margin: 0 }}>
          <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>{title}</a>
        </h2>
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.8rem", lineHeight: 1.65, color: "#6b6b6b", margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {contentSnippet}
        </p>
      </div>
    </article>
  );
}
// ─── Latest News ──────────────────────────────────────────────────────────────

interface LatestNewsProps {
  articles: ApiArticle[];
  categoryLabel: string;
}

function LatestNews({ articles, categoryLabel }: LatestNewsProps) {
  return (
    <section style={{ borderTop: "1px solid #e0ddd8", padding: "48px 0 64px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.35rem", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
            Berita {categoryLabel}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
          {articles.map((article, idx) => (
            <NewsCard key={idx} {...article} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ backgroundColor: "#f9f8f6", borderTop: "1px solid #e0ddd8", padding: "28px 0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <Link href="/" style={{ fontFamily: "Georgia, serif", fontWeight: 900, fontSize: "0.9rem", letterSpacing: "0.04em", color: "#1a1a1a", textDecoration: "none", flexShrink: 0 }}>
          PORTAL BERITA
        </Link>
        <nav style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 20, flex: 1, justifyContent: "center" }}>
          {FOOTER_LINKS.map((link) => (
            <a key={link} href="#" style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.7rem", color: "#6b6b6b", textDecoration: "none" }}>
              {link}
            </a>
          ))}
        </nav>
        <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.7rem", color: "#6b6b6b", flexShrink: 0, marginLeft: "auto" }}>
          &copy; {new Date().getFullYear()} Portal Berita. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
// ─── Page ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 9;

export default function PortalBerita() {
  const [articles, setArticles] = useState<ApiArticle[]>([]);
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const fetchInitialNews = async () => {
      setLoading(true);
      setError(null);
      setArticles([]);

      try {
        const reqCategory = category === "" ? "latest" : category;
        const response = await axios.get(`/api/news/${reqCategory}?limit=${PAGE_SIZE}&offset=0`);

        if (response.data && response.data.data) {
          const newArticles = response.data.data;
          const totalCount = response.data.total ?? 0;

          setArticles(newArticles);
          setTotal(totalCount);
          setHasMore(newArticles.length < totalCount);
        } else {
          setArticles([]);
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat berita. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialNews();
  }, [category]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    setError(null);

    try {
      const offset = articles.length;
      const reqCategory = category === "" ? "latest" : category;
      const response = await axios.get(`/api/news/${reqCategory}?limit=${PAGE_SIZE}&offset=${offset}`);

      if (response.data && response.data.data) {
        const newArticles = response.data.data;
        const totalCount = response.data.total ?? 0;

        setArticles(prev => [...prev, ...newArticles]);
        setTotal(totalCount);
        setHasMore(offset + newArticles.length < totalCount);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat berita. Silakan coba lagi nanti.");
    } finally {
      setLoadingMore(false);
    }
  };

  // Mengambil artikel pertama sebagai Hero, dan sisa artikel untuk grid di bawahnya
  const heroArticle = articles[0];
  const listArticles = articles.slice(1);

  const currentLabel = NAV_LINKS.find(l => l.path === category)?.label || "Terbaru";

  return (
    <div style={{ backgroundColor: "#f9f8f6", minHeight: "100vh" }}>
      <Navbar currentCategory={category} onCategoryChange={setCategory} />
      <main>
        {loading && (
          <div style={{ textAlign: "center", padding: "100px 0", fontFamily: "system-ui, sans-serif", color: "#6b6b6b" }}>
            Memuat berita...
          </div>
        )}
        
        {error && (
          <div style={{ textAlign: "center", padding: "100px 0", fontFamily: "system-ui, sans-serif", color: "#d9534f" }}>
            {error}
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div style={{ textAlign: "center", padding: "100px 0", fontFamily: "system-ui, sans-serif", color: "#6b6b6b" }}>
            Tidak ada berita yang ditemukan.
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <>
            {heroArticle && <HeroStory article={heroArticle} />}
            <LatestNews articles={listArticles} categoryLabel={currentLabel} />
            {hasMore && (
              <div style={{ textAlign: "center", padding: "24px 0 64px" }}>
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  style={{
                    backgroundColor: "#1a1a1a",
                    color: "#f9f8f6",
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "12px 32px",
                    borderRadius: 2,
                    border: "none",
                    cursor: loadingMore ? "not-allowed" : "pointer",
                    opacity: loadingMore ? 0.6 : 1,
                  }}
                >
                  {loadingMore ? "Memuat..." : "Muat Lebih Banyak"}
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}