import { FormEvent, useState } from "react";
import LegalPage from "@/components/LegalPage";
import { SITE_NAME } from "@/utils/seo";

const CONTACT_EMAIL = "contact@rogame.space";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = encodeURIComponent(
      `[${SITE_NAME}] Liên hệ từ ${name.trim() || "Khách"}`,
    );
    const body = encodeURIComponent(
      `Họ tên: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <LegalPage
      title="Liên hệ"
      description={`Liên hệ ${SITE_NAME} — gửi câu hỏi, góp ý hoặc yêu cầu hỗ trợ.`}
      canonical="/contact"
    >
      <h1 className="legal-title">Liên hệ</h1>
      <p className="legal-lead">
        Bạn cần hỗ trợ, góp ý hoặc hợp tác? Hãy gửi tin nhắn cho chúng tôi.
      </p>

      <section className="legal-section">
        <h2>Thông tin liên hệ</h2>
        <ul className="legal-contact-list">
          <li>
            <span className="legal-contact-label">Email</span>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </li>
          <li>
            <span className="legal-contact-label">Website</span>
            <a
              href="https://rogame.space"
              target="_blank"
              rel="noopener noreferrer"
            >
              rogame.space
            </a>
          </li>
          <li>
            <span className="legal-contact-label">Thời gian phản hồi</span>
            <span>Trong vòng 2–3 ngày làm việc</span>
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>Gửi tin nhắn</h2>
        <form className="legal-contact-form" onSubmit={handleSubmit}>
          <label className="legal-field">
            <span className="legal-field-label">Họ tên</span>
            <input
              type="text"
              className="legal-field-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Tên của bạn"
              autoComplete="name"
            />
          </label>
          <label className="legal-field">
            <span className="legal-field-label">Email</span>
            <input
              type="email"
              className="legal-field-input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email@example.com"
              required
              autoComplete="email"
            />
          </label>
          <label className="legal-field">
            <span className="legal-field-label">Nội dung</span>
            <textarea
              className="legal-field-input legal-field-textarea"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Mô tả câu hỏi hoặc yêu cầu của bạn..."
              rows={6}
              required
            />
          </label>
          <button type="submit" className="legal-submit-btn">
            Gửi email
          </button>
        </form>
      </section>
    </LegalPage>
  );
}
