import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { SITE_NAME } from "@/utils/seo";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Quyền riêng tư"
      description={`Chính sách quyền riêng tư của ${SITE_NAME} — cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu người dùng.`}
      canonical="/privacy"
    >
      <h1 className="legal-title">Chính sách quyền riêng tư</h1>
      <p className="legal-updated">Cập nhật lần cuối: 23/06/2025</p>

      <section className="legal-section">
        <h2>1. Giới thiệu</h2>
        <p>
          {SITE_NAME} (&quot;chúng tôi&quot;) cam kết bảo vệ quyền riêng tư của
          bạn khi sử dụng website chơi game trực tuyến. Chính sách này mô tả
          thông tin chúng tôi thu thập và cách xử lý dữ liệu đó.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Thông tin chúng tôi thu thập</h2>
        <ul>
          <li>
            <strong>Thông tin tài khoản:</strong> email, tên hiển thị khi bạn
            đăng ký hoặc đăng nhập (kể cả qua Google).
          </li>
          <li>
            <strong>Dữ liệu sử dụng:</strong> game đã chơi, thời lượng chơi,
            lượt thích và tương tác trên nền tảng.
          </li>
          <li>
            <strong>Dữ liệu kỹ thuật:</strong> loại trình duyệt, thiết bị, địa
            chỉ IP, cookie và dữ liệu nhật ký truy cập.
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>3. Cách chúng tôi sử dụng thông tin</h2>
        <ul>
          <li>Cung cấp và vận hành dịch vụ chơi game.</li>
          <li>Lưu tiến trình, lịch sử chơi và tùy chọn cá nhân.</li>
          <li>Cải thiện trải nghiệm, bảo mật và phát triển tính năng mới.</li>
          <li>Gửi thông báo liên quan đến tài khoản khi cần thiết.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>4. Cookie và quảng cáo</h2>
        <p>
          Chúng tôi sử dụng cookie để duy trì phiên đăng nhập và phân tích cách
          website được sử dụng. Trang web có thể hiển thị quảng cáo thông qua
          Google AdSense; Google có thể dùng cookie để phân phối quảng cáo phù
          hợp. Bạn có thể tìm hiểu thêm tại{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chính sách quảng cáo của Google
          </a>
          .
        </p>
      </section>

      <section className="legal-section">
        <h2>5. Chia sẻ thông tin</h2>
        <p>
          Chúng tôi không bán dữ liệu cá nhân của bạn. Thông tin có thể được
          chia sẻ với nhà cung cấp dịch vụ (lưu trữ, xác thực, quảng cáo) chỉ
          trong phạm vi cần thiết để vận hành website, hoặc khi pháp luật yêu
          cầu.
        </p>
      </section>

      <section className="legal-section">
        <h2>6. Quyền của bạn</h2>
        <p>
          Bạn có thể yêu cầu truy cập, chỉnh sửa hoặc xóa dữ liệu tài khoản bằng
          cách liên hệ với chúng tôi. Bạn cũng có thể từ chối cookie quảng cáo
          thông qua cài đặt trình duyệt hoặc công cụ của Google.
        </p>
      </section>

      <section className="legal-section">
        <h2>7. Liên hệ</h2>
        <p>
          Mọi câu hỏi về quyền riêng tư, vui lòng liên hệ qua trang{" "}
          <Link href="/contact">Liên hệ</Link> hoặc email{" "}
          <a href="mailto:contact@rogame.space">contact@rogame.space</a>.
        </p>
      </section>
    </LegalPage>
  );
}
