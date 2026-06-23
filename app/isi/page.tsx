"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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

export default function IsiBeritaPage() {
    const searchParams = useSearchParams();
    const [articles, setArticles] = useState<ApiArticle[]>([]);
    const [loading, setLoading] = useState(true);

    const queryTitle = searchParams.get("title");
    const queryLink = searchParams.get("link");

    // Jika ada query params, gunakan article dari URL
    const articleFromParams: ApiArticle | null =
        queryTitle && queryLink
            ? {
                title: queryTitle,
                link: queryLink,
                contentSnippet: searchParams.get("contentSnippet") || "",
                isoDate: searchParams.get("isoDate") || "",
                image: {
                    small: searchParams.get("imageSmall") || "",
                    large: searchParams.get("imageLarge") || "",
                },
            }
            : null;

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get("/api/news/latest?limit=3&offset=0");
                if (response.data && response.data.data) {
                    setArticles(response.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center font-body-md">Memuat...</div>;
    }

    const mainArticle = articleFromParams || articles[0];
    const trendingArticles = articles.slice(0, 3);

    const formattedDate = mainArticle ? new Date(mainArticle.isoDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short"
    }) : "";

    return (
        <div className="font-body-md text-body-md selection:bg-secondary-fixed selection:text-on-secondary-fixed bg-surface text-on-surface min-h-screen">
            {/* Top Navigation Bar */}
            <header className="w-full top-0 sticky z-50 bg-[#001F3F] border-b border-[#001F3F] h-20 text-white shadow-md">
                <nav className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-full">
                    <div className="flex items-center gap-8">
                        <Link className="font-headline-md text-headline-md font-bold text-white" href="/">INI BERITA</Link>
                        <ul className="hidden lg:flex items-center gap-6">
                            <li><Link className="font-label-sm text-label-sm uppercase tracking-wider text-white border-b-2 border-white h-20 flex items-center" href="/">Terbaru</Link></li>
                            <li><Link className="font-label-sm text-label-sm uppercase tracking-wider text-white/70 hover:text-white transition-colors duration-200 h-20 flex items-center border-b-2 border-transparent" href="/kategori/nasional">Nasional</Link></li>
                            <li><Link className="font-label-sm text-label-sm uppercase tracking-wider text-white/70 hover:text-white transition-colors duration-200 h-20 flex items-center border-b-2 border-transparent" href="/kategori/internasional">Internasional</Link></li>
                            <li><Link className="font-label-sm text-label-sm uppercase tracking-wider text-white/70 hover:text-white transition-colors duration-200 h-20 flex items-center border-b-2 border-transparent" href="/kategori/ekonomi">Ekonomi</Link></li>
                            <li><Link className="font-label-sm text-label-sm uppercase tracking-wider text-white/70 hover:text-white transition-colors duration-200 h-20 flex items-center border-b-2 border-transparent" href="/kategori/olahraga">Olahraga</Link></li>
                            <li><Link className="font-label-sm text-label-sm uppercase tracking-wider text-white/70 hover:text-white transition-colors duration-200 h-20 flex items-center border-b-2 border-transparent" href="/kategori/teknologi">Teknologi</Link></li>
                            <li><Link className="font-label-sm text-label-sm uppercase tracking-wider text-white/70 hover:text-white transition-colors duration-200 h-20 flex items-center border-b-2 border-transparent" href="/kategori/hiburan">Hiburan</Link></li>
                        </ul>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="hidden md:flex items-center px-6 py-2 bg-white text-[#001F3F] font-label-sm uppercase tracking-wider active:scale-95 transition-transform">
                            Subscribe
                        </button>
                        <button className="p-2 text-white/70 hover:text-white transition-colors">
                            <span className="material-symbols-outlined">account_circle</span>
                        </button>
                        <button className="lg:hidden p-2 text-white/70 hover:text-white transition-colors">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </nav>
            </header>

            <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 mb-stack-md text-on-surface-variant font-label-sm uppercase tracking-widest text-[10px]">
                    <Link className="hover:text-primary" href="/">Home</Link>
                    <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                    <span className="text-primary font-bold">Terbaru</span>
                </nav>

                {mainArticle ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                        {/* Article Body Container */}
                        <article className="lg:col-span-8">
                            {/* Header Section */}
                            <header className="mb-stack-lg">
                                <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-stack-sm leading-tight">
                                    {mainArticle.title}
                                </h1>
                                <p className="font-headline-md text-headline-md text-on-surface-variant font-light mb-stack-md italic opacity-90">
                                    Ringkasan berita terbaru dari CNN Indonesia.
                                </p>

                                {/* Meta Data */}
                                <div className="flex flex-wrap items-center gap-y-4 border-y border-outline-variant py-stack-sm text-on-surface-variant font-label-sm">
                                    <div className="flex items-center gap-2 mr-6">
                                        <span className="text-primary">Oleh</span>
                                        <span className="font-bold text-primary underline underline-offset-4 cursor-pointer">CNN Indonesia</span>
                                    </div>
                                    <div className="flex items-center gap-2 mr-6">
                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                        <span>Diperbarui {formattedDate}</span>
                                    </div>
                                    <div className="bg-surface-container-highest px-3 py-1 text-[10px] uppercase font-bold tracking-widest">
                                        3 min read
                                    </div>
                                </div>
                            </header>

                            {/* Featured Image */}
                            <figure className="mb-stack-lg">
                                <div className="w-full aspect-video bg-surface-container-high overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-[1.02]"
                                        src={mainArticle.image?.large || mainArticle.image?.small}
                                        alt={mainArticle.title}
                                    />
                                </div>
                                <figcaption className="mt-4 text-on-surface-variant font-body-md text-sm border-l-2 border-secondary pl-4 py-1 italic">
                                    Ilustrasi: {mainArticle.title}
                                </figcaption>
                            </figure>

                            {/* Body Content */}
                            <div className="article-content font-body-lg text-body-lg text-on-surface leading-relaxed max-w-none">
                                <p>
                                    {mainArticle.contentSnippet}
                                </p>
                                <p>
                                    Berita ini dilaporkan oleh CNN Indonesia. Untuk membaca informasi selengkapnya mengenai topik ini, Anda dapat mengunjungi tautan resmi ke artikel tersebut.
                                </p>

                                <blockquote className="my-stack-lg p-stack-md bg-surface-container-low border-l-4 border-primary italic font-headline-md text-headline-md text-primary">
                                    <span className="material-symbols-outlined text-4xl text-secondary mb-2 block">format_quote</span>
                                    "Tetap up-to-date dengan perkembangan berita terbaru di sekitar Anda dan secara global."
                                </blockquote>

                                <p>
                                    Analisis lebih lanjut mengenai berita ini dapat ditemukan langsung di situs resmi. Kami menyediakan portal ringkasan ini untuk memudahkan Anda mencari berita-berita terkini secara cepat dan responsif.
                                </p>

                                <div className="mt-8">
                                    <a href={mainArticle.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-primary text-on-primary font-label-sm uppercase tracking-wider hover:bg-opacity-90 transition-colors">
                                        Baca Selengkapnya di CNN
                                        <span className="material-symbols-outlined ml-2 text-sm">open_in_new</span>
                                    </a>
                                </div>
                            </div>

                            {/* Footer Social / Tags */}
                            <div className="mt-stack-lg pt-stack-md border-t border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 border border-outline text-[11px] font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-colors cursor-pointer">Berita</span>
                                    <span className="px-3 py-1 border border-outline text-[11px] font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-colors cursor-pointer">Terkini</span>
                                </div>
                                <div className="flex items-center gap-4 text-on-surface-variant">
                                    <span className="font-label-sm">Bagikan:</span>
                                    <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">share</span></button>
                                    <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">bookmark</span></button>
                                    <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">mail</span></button>
                                </div>
                            </div>
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4 lg:pl-10">
                            <div className="sticky top-28">
                                <div className="border-t-4 border-primary pt-4 mb-stack-md">
                                    <h3 className="font-label-sm text-label-sm uppercase tracking-[0.2em] font-extrabold text-primary">Trending News</h3>
                                </div>

                                <div className="flex flex-col gap-8">
                                    {trendingArticles.map((article, idx) => {
                                        const tParams = new URLSearchParams({
                                            title: article.title,
                                            link: article.link,
                                            contentSnippet: article.contentSnippet,
                                            isoDate: article.isoDate,
                                            imageSmall: article.image?.small || "",
                                            imageLarge: article.image?.large || "",
                                        });
                                        return (
                                            <div key={idx} className={`group cursor-pointer ${idx > 0 ? 'pt-6 border-t border-outline-variant' : ''}`}>
                                                <Link href={`/isi?${tParams.toString()}`} className="flex gap-4 items-start">
                                                    <div className="w-20 h-20 bg-surface-container-high shrink-0 overflow-hidden">
                                                        {article.image?.small && (
                                                            <img
                                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                                src={article.image.small}
                                                                alt={article.title}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="font-label-sm text-[10px] text-secondary uppercase tracking-widest font-bold mb-1 block">Terkini</span>
                                                        <h4 className="font-headline-md text-lg leading-snug group-hover:underline decoration-secondary decoration-2 underline-offset-4">
                                                            {article.title}
                                                        </h4>
                                                    </div>
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Sidebar Newsletter Signup */}
                                <div className="mt-stack-lg bg-primary-container p-6 text-on-primary">
                                    <h4 className="font-headline-md text-xl mb-3 text-on-primary-container">Morning Briefing</h4>
                                    <p className="font-body-md text-sm mb-4 opacity-80">Dapatkan berita utama hari ini langsung di kotak masuk Anda setiap pagi.</p>
                                    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                                        <input className="w-full bg-white text-primary border-none focus:ring-2 focus:ring-secondary text-sm p-3 font-body-md" placeholder="Alamat Email" type="email" />
                                        <button className="w-full bg-secondary text-on-secondary font-label-sm uppercase tracking-widest p-3 hover:bg-opacity-90 transition-all active:scale-95">Sign Up</button>
                                    </form>
                                </div>
                            </div>
                        </aside>
                    </div>
                ) : (
                    <div className="text-center py-20 font-body-lg text-on-surface-variant">
                        Berita tidak ditemukan.
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="w-full mt-stack-lg bg-[#001F3F] border-t border-[#001F3F] py-12 text-white">
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                        <div className="font-headline-md text-headline-md text-on-primary">Portal Berita</div>
                        <ul className="flex flex-wrap justify-center gap-6 text-on-primary font-body-md opacity-70">
                            <li><Link className="hover:opacity-100 transition-opacity" href="/">Tentang Kami</Link></li>
                            <li><Link className="hover:opacity-100 transition-opacity" href="/">Pedoman Editorial</Link></li>
                            <li><Link className="hover:opacity-100 transition-opacity" href="/">Kebijakan Privasi</Link></li>
                            <li><Link className="hover:opacity-100 transition-opacity" href="/">Syarat Layanan</Link></li>
                            <li><Link className="hover:opacity-100 transition-opacity" href="/">Kontak</Link></li>
                        </ul>
                    </div>
                    <div className="text-center pt-8 border-t border-white/10">
                        <p className="font-body-md text-sm text-surface-variant opacity-70">
                            © {new Date().getFullYear()} Portal Berita. All rights reserved. Designed for the intellectually curious.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
