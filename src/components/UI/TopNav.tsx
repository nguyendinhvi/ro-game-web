import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import GameSearchModal from "@/components/GameSearchModal";
import {
  IconClose,
  IconEdit,
  IconGlobe,
  IconLogout,
  IconMail,
  IconSearch,
  IconSettings,
  IconShare,
  IconShield,
  IconUser,
  IconUserAvatar,
} from "@/components/core/Icon";
import { BrandLogo } from "@/components/UI";
import { useAuth } from "@/context/AuthProvider";
import {
  initialsFromUser,
  profileHandleFromUser,
  profileSlugFromUser,
} from "@/utils/profile";

const PROFILE_COMPLETE_PCT = 60;

export default function TopNav() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [panelPos, setPanelPos] = useState({ top: 0, right: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { user, logout } = useAuth();

  const handleLabel = user != null ? profileHandleFromUser(user) : "";
  const profileHref =
    user != null ? `/profile/${profileSlugFromUser(user)}` : "/login";
  const initials = user != null ? initialsFromUser(user) : "";

  const updatePanelPosition = useCallback(() => {
    const el = triggerRef.current;
    if (el == null) {
      return;
    }
    const r = el.getBoundingClientRect();
    setPanelPos({
      top: r.bottom + 10,
      right: Math.max(16, window.innerWidth - r.right),
    });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const openSearch = useCallback(() => {
    setMenuOpen(false);
    setSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, []);

  const handleLogout = useCallback(() => {
    closeMenu();
    void logout();
  }, [closeMenu, logout]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    updatePanelPosition();
    window.addEventListener("resize", updatePanelPosition);
    window.addEventListener("scroll", updatePanelPosition, true);
    return () => {
      window.removeEventListener("resize", updatePanelPosition);
      window.removeEventListener("scroll", updatePanelPosition, true);
    };
  }, [menuOpen, updatePanelPosition]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  useEffect(() => {
    const closeSearchOnNavigate = () => {
      setSearchOpen(false);
    };

    router.events.on("routeChangeStart", closeSearchOnNavigate);
    return () => {
      router.events.off("routeChangeStart", closeSearchOnNavigate);
    };
  }, [router.events]);

  return (
    <header
      className={`topnav${searchOpen ? " topnav--search-open" : ""}`}
    >
      <BrandLogo
        className="logo"
        imageClassName="logo-img"
        textClassName="logo-text"
        priority
      />
      <div className="search-wrap">
        <span className="search-icon" aria-hidden>
          <IconSearch width={18} height={18} />
        </span>
        <input
          ref={searchInputRef}
          type="search"
          className="search"
          placeholder="Tìm game..."
          aria-label="Tìm game"
          aria-expanded={searchOpen}
          aria-controls="game-search-panel"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={openSearch}
          onClick={openSearch}
        />
      </div>
      <GameSearchModal
        open={searchOpen}
        query={searchQuery}
        onClose={closeSearch}
      />
      <div className="right">
        <div className="user-block">
          {user ? (
            <>
              <div className="user-menu-anchor">
                <button
                  ref={triggerRef}
                  type="button"
                  className="avatar-trigger"
                  aria-expanded={menuOpen}
                  aria-haspopup="dialog"
                  aria-controls="user-menu-dialog"
                  aria-label="Mở menu tài khoản"
                  onClick={() => {
                    closeSearch();
                    setMenuOpen((o) => !o);
                  }}
                >
                  <div className="avatar-wrap">
                    <span className="avatar-initials" aria-hidden>
                      {initials}
                    </span>
                  </div>
                </button>
              </div>
              {menuOpen && typeof document !== "undefined"
                ? createPortal(
                    <>
                      <button
                        type="button"
                        className="user-menu-backdrop"
                        aria-label="Đóng menu"
                        onClick={closeMenu}
                      />
                      <div
                        id="user-menu-dialog"
                        className="user-menu-panel"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="user-menu-heading"
                        style={{
                          top: panelPos.top,
                          right: panelPos.right,
                        }}
                      >
                        <button
                          type="button"
                          className="user-menu-close"
                          aria-label="Đóng"
                          onClick={(e) => {
                            e.stopPropagation();
                            closeMenu();
                          }}
                        >
                          <IconClose width={20} height={20} aria-hidden />
                        </button>

                        <div className="user-menu-identity">
                          <div className="user-menu-avatar-lg" aria-hidden>
                            <span className="user-menu-initials">
                              {initials}
                            </span>
                          </div>
                          <h2
                            id="user-menu-heading"
                            className="user-menu-handle"
                          >
                            {handleLabel}
                          </h2>
                          <p className="user-menu-email">{user.email}</p>
                          <div className="user-menu-actions">
                            <Link
                              href={profileHref}
                              className="user-menu-profile-btn"
                              onClick={closeMenu}
                            >
                              <IconUser width={18} height={18} aria-hidden />
                              Hồ sơ
                            </Link>
                            <button
                              type="button"
                              className="user-menu-icon-btn"
                              title="Chỉnh sửa"
                              aria-label="Chỉnh sửa hồ sơ"
                            >
                              <IconEdit width={18} height={18} aria-hidden />
                            </button>
                            <button
                              type="button"
                              className="user-menu-icon-btn"
                              title="Chia sẻ"
                              aria-label="Chia sẻ hồ sơ"
                            >
                              <IconShare width={18} height={18} aria-hidden />
                            </button>
                          </div>
                        </div>

                        <div className="user-menu-completion">
                          <div className="user-menu-completion-head">
                            <span className="user-menu-completion-text">
                              Hồ sơ của bạn đã hoàn thành {PROFILE_COMPLETE_PCT}
                              %
                            </span>
                            <button
                              type="button"
                              className="user-menu-completion-link"
                            >
                              Hoàn thành ngay
                              <span aria-hidden> ›</span>
                            </button>
                          </div>
                          <div
                            className="user-menu-progress-track"
                            role="progressbar"
                            aria-valuenow={PROFILE_COMPLETE_PCT}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div
                              className="user-menu-progress-fill"
                              style={{ width: `${PROFILE_COMPLETE_PCT}%` }}
                            />
                          </div>
                        </div>

                        <nav className="user-menu-nav" aria-label="Tài khoản">
                          <button type="button" className="user-menu-item">
                            <IconMail width={20} height={20} aria-hidden />
                            Tùy chọn thông báo
                          </button>
                          <button type="button" className="user-menu-item">
                            <IconShield width={20} height={20} aria-hidden />
                            Tùy chọn quyền riêng tư
                          </button>
                          <button type="button" className="user-menu-item">
                            <IconSettings width={20} height={20} aria-hidden />
                            Cài đặt tài khoản
                          </button>
                          <button
                            type="button"
                            className="user-menu-item user-menu-item--danger"
                            onClick={handleLogout}
                          >
                            <IconLogout width={20} height={20} aria-hidden />
                            Đăng xuất
                          </button>
                          <div className="user-menu-divider" role="separator" />
                          <button type="button" className="user-menu-item">
                            <IconMail width={20} height={20} aria-hidden />
                            Hỗ trợ
                          </button>
                        </nav>

                        <div className="user-menu-lang">
                          <button type="button" className="user-menu-lang-btn">
                            <IconGlobe width={18} height={18} aria-hidden />
                            Tiếng Việt
                          </button>
                        </div>

                        <div className="user-menu-footer-links">
                          <a href="#">Về chúng tôi</a>
                          <a href="#">Trang trẻ em</a>
                          <a href="#">Điều khoản và điều kiện</a>
                          <a href="#">Công việc</a>
                          <a href="#">Quyền riêng tư</a>
                          <a href="#">Nhà phát triển trò chơi</a>
                          <Link href="/">Tất cả trò chơi</Link>
                        </div>
                      </div>
                    </>,
                    document.body,
                  )
                : null}
            </>
          ) : (
            <>
              <Link href="/login" className="auth-login">
                Đăng nhập
              </Link>
              <div className="avatar-wrap">
                <div className="avatar" role="img" aria-label="Khách">
                  <IconUserAvatar width={22} height={22} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
