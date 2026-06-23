import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { SITE_NAME } from "@/utils/seo";

export default function TermsPage() {
  return (
    <LegalPage
      title="Điều khoản sử dụng"
      description={`Điều khoản và điều kiện sử dụng ${SITE_NAME} — quy định khi truy cập và chơi game trên nền tảng.`}
      canonical="/terms"
    >
      <h1 className="legal-title">Điều khoản và điều kiện</h1>
      <p className="legal-updated">Cập nhật lần cuối: 23/06/2025</p>

      <section className="legal-section">
        <h2>1. Chấp nhận điều khoản</h2>
        <p>
          Bằng việc truy cập hoặc sử dụng {SITE_NAME}, bạn đồng ý tuân thủ các
          điều khoản này. Nếu không đồng ý, vui lòng không sử dụng dịch vụ.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Dịch vụ</h2>
        <p>
          {SITE_NAME} cung cấp nền tảng chơi game HTML5 trực tuyến miễn phí.
          Chúng tôi có thể thay đổi, tạm ngưng hoặc gỡ bỏ game hoặc tính năng
          bất kỳ lúc nào mà không cần thông báo trước.
        </p>
      </section>

      <section className="legal-section">
        <h2>3. Tài khoản người dùng</h2>
        <ul>
          <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình.</li>
          <li>
            Thông tin đăng ký phải chính xác; không mạo danh hoặc sử dụng tài
            khoản của người khác.
          </li>
          <li>
            Chúng tôi có quyền đình chỉ hoặc xóa tài khoản vi phạm điều
            khoản.
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>4. Nội dung game</h2>
        <p>
          Game trên nền tảng thuộc quyền sở hữu của nhà phát triển tương ứng.
          Bạn chỉ được sử dụng game cho mục đích cá nhân, phi thương mại. Không
          sao chép, phân phối lại hoặc khai thác nội dung trái phép.
        </p>
      </section>

      <section className="legal-section">
        <h2>5. Hành vi bị cấm</h2>
        <ul>
          <li>Gian lận, spam, tấn công hoặc can thiệp hệ thống.</li>
          <li>Sử dụng bot, script tự động trái phép.</li>
          <li>Đăng tải nội dung vi phạm pháp luật hoặc quyền của bên thứ ba.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>6. Quảng cáo</h2>
        <p>
          Website có thể hiển thị quảng cáo từ bên thứ ba (ví dụ Google
          AdSense). Nội dung quảng cáo do đối tác quảng cáo chịu trách nhiệm;
          chúng tôi không kiểm soát toàn bộ nội dung quảng cáo bên thứ ba.
        </p>
      </section>

      <section className="legal-section">
        <h2>7. Giới hạn trách nhiệm</h2>
        <p>
          Dịch vụ được cung cấp &quot;nguyên trạng&quot;. Chúng tôi không đảm
          bảo website luôn hoạt động liên tục, không lỗi. Trong phạm vi pháp
          luật cho phép, chúng tôi không chịu trách nhiệm về thiệt hại gián
          tiếp phát sinh từ việc sử dụng dịch vụ.
        </p>
      </section>

      <section className="legal-section">
        <h2>8. Thay đổi điều khoản</h2>
        <p>
          Chúng tôi có thể cập nhật điều khoản này theo thời gian. Phiên bản
          mới có hiệu lực khi đăng tải trên trang này. Việc tiếp tục sử dụng
          dịch vụ đồng nghĩa bạn chấp nhận điều khoản đã cập nhật.
        </p>
      </section>

      <section className="legal-section">
        <h2>9. Liên hệ</h2>
        <p>
          Câu hỏi về điều khoản, vui lòng liên hệ qua trang{" "}
          <Link href="/contact">Liên hệ</Link> hoặc email{" "}
          <a href="mailto:contact@rogame.space">contact@rogame.space</a>.
        </p>
      </section>
    </LegalPage>
  );
}
