import Link from "next/link";
import type { ReactNode } from "react";
import { SEO } from "@/components";
import TopNav from "@/components/UI/TopNav";

interface IProps {
  title: string;
  description: string;
  canonical: string;
  children: ReactNode;
}

export default function LegalPage({
  title,
  description,
  canonical,
  children,
}: IProps) {
  return (
    <div className="legal-page">
      <SEO title={title} description={description} canonical={canonical} />
      <div className="legal-layout">
        <TopNav />
        <main className="legal-main">
          <article className="legal-article">{children}</article>
          <nav className="legal-links" aria-label="Trang pháp lý">
            <Link href="/privacy">Quyền riêng tư</Link>
            <Link href="/terms">Điều khoản</Link>
            <Link href="/contact">Liên hệ</Link>
          </nav>
        </main>
      </div>
    </div>
  );
}
