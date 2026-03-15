import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import API from "@/api";
import { SEO } from "@/components";
import TopNav from "@/components/UI/TopNav";
import { useAuth } from "@/context/AuthProvider";
import { useFetch } from "@/hooks";
import { formatDuration } from "@/utils";
import {
  displayNameFromUser,
  initialsFromUser,
  profileHandleFromUser,
  profileSlugFromUser,
} from "@/utils/profile";

const PROFILE_COMPLETE_PCT = 60;
const PROFILE_SCROLL_ID = "profile-scroll";

function formatMemberSince(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatSessionDate(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatLikedDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function gameThumbUrl(thumbnail?: string, coverImage?: string): string {
  return thumbnail?.trim() || coverImage?.trim() || "";
}

type ProfileActivityTab = "played" | "sessions" | "liked";

const PROFILE_ACTIVITY_TABS: {
  id: ProfileActivityTab;
  label: string;
}[] = [
  { id: "played", label: "Game đã chơi" },
  { id: "sessions", label: "Phiên chơi" },
  { id: "liked", label: "Game yêu thích" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [activityTab, setActivityTab] =
    useState<ProfileActivityTab>("played");

  const slug =
    typeof router.query.display_name === "string"
      ? router.query.display_name
      : "";
  const isReady = router.isReady && slug.length > 0;

  const isOwnProfile =
    user != null &&
    profileSlugFromUser(user).toLowerCase() === slug.toLowerCase();

  const profileUser = isOwnProfile ? user : null;
  const canLoadStats = isOwnProfile && isReady && ready;

  const { data: playStats, status: statsStatus } = useFetch(
    () => API.playSession.myStats(),
    [canLoadStats],
    canLoadStats,
  );

  const { data: playHistory, status: historyStatus } = useFetch(
    () => API.playSession.myHistory({ page: 1, limit: 30 }),
    [canLoadStats],
    canLoadStats,
  );

  const { data: likedGamesData, status: likesStatus } = useFetch(
    () => API.gameLike.myLikes({ page: 1, limit: 50 }),
    [canLoadStats],
    canLoadStats,
  );

  const topGames = playStats?.top_games ?? [];
  const recentSessions = playHistory?.items ?? [];
  const likedGames = likedGamesData?.items ?? [];
  const uniqueGames = playStats?.unique_games ?? topGames.length;
  const totalSessions = playStats?.total_sessions ?? 0;
  const totalDuration = playStats?.total_duration_seconds ?? 0;
  const likedCount = likedGames.length;
  const profileTitle = profileUser
    ? `${displayNameFromUser(profileUser)} - Hồ sơ`
    : "Hồ sơ";

  return (
    <div className="profile-page">
      <SEO
        title={profileTitle}
        description={
          profileUser
            ? `Xem hồ sơ và thống kê chơi game của ${displayNameFromUser(profileUser)} trên RO Game.`
            : "Hồ sơ người chơi trên RO Game."
        }
        canonical={slug ? `/profile/${slug}` : undefined}
        noIndex
      />
      <div id={PROFILE_SCROLL_ID} className="profile-scroll">
        <div className="layout">
          <TopNav />
          <main className="profile-main">
            {!isReady || !ready ? (
              <p className="profile-status">Đang tải hồ sơ...</p>
            ) : profileUser == null ? (
              <div className="profile-empty">
                <h1 className="profile-empty-title">Không tìm thấy hồ sơ</h1>
                <p className="profile-empty-text">
                  Hồ sơ này không tồn tại hoặc bạn chưa có quyền xem.
                </p>
                <Link href="/" className="profile-empty-link">
                  Về trang chủ
                </Link>
              </div>
            ) : (
              <div className="profile-layout">
                <aside className="profile-sidebar">
                  <section
                    className="profile-hero"
                    aria-labelledby="profile-heading"
                  >
                    <div className="profile-avatar" aria-hidden>
                      <span className="profile-initials">
                        {initialsFromUser(profileUser)}
                      </span>
                    </div>
                    <h1 id="profile-heading" className="profile-handle">
                      {profileHandleFromUser(profileUser)}
                    </h1>
                    <p className="profile-name">
                      {displayNameFromUser(profileUser)}
                    </p>
                    <p className="profile-email">{profileUser.email}</p>
                    <p className="profile-joined">
                      Thành viên từ {formatMemberSince(profileUser.created_at)}
                    </p>
                  </section>

                  <section
                    className="profile-completion"
                    aria-labelledby="profile-completion-heading"
                  >
                    <div className="profile-completion-head">
                      <h2
                        id="profile-completion-heading"
                        className="profile-completion-title"
                      >
                        Hoàn thiện hồ sơ
                      </h2>
                      <span className="profile-completion-pct">
                        {PROFILE_COMPLETE_PCT}%
                      </span>
                    </div>
                    <p className="profile-completion-text">
                      Hồ sơ của bạn đã hoàn thành {PROFILE_COMPLETE_PCT}%. Hoàn
                      thiện thêm để bạn bè dễ nhận ra bạn hơn.
                    </p>
                    <div
                      className="profile-progress-track"
                      role="progressbar"
                      aria-valuenow={PROFILE_COMPLETE_PCT}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Tiến độ hoàn thiện hồ sơ"
                    >
                      <div
                        className="profile-progress-fill"
                        style={{ width: `${PROFILE_COMPLETE_PCT}%` }}
                      />
                    </div>
                  </section>

                  <section
                    className="profile-details"
                    aria-labelledby="profile-details-heading"
                  >
                    <h2
                      id="profile-details-heading"
                      className="profile-section-title"
                    >
                      Thông tin tài khoản
                    </h2>
                    <dl className="profile-info-list">
                      <div className="profile-info-row">
                        <dt>Tên hiển thị</dt>
                        <dd>{displayNameFromUser(profileUser)}</dd>
                      </div>
                      <div className="profile-info-row">
                        <dt>Email</dt>
                        <dd>{profileUser.email}</dd>
                      </div>
                      <div className="profile-info-row">
                        <dt>Vai trò</dt>
                        <dd>
                          {profileUser.role === "admin"
                            ? "Quản trị viên"
                            : "Người chơi"}
                        </dd>
                      </div>
                      <div className="profile-info-row">
                        <dt>Ngày tham gia</dt>
                        <dd>{formatMemberSince(profileUser.created_at)}</dd>
                      </div>
                    </dl>
                  </section>
                </aside>

                <div className="profile-content">
                  <section
                    className="profile-stats profile-activity"
                    aria-labelledby="profile-stats-heading"
                  >
                    <h2
                      id="profile-stats-heading"
                      className="profile-section-title"
                    >
                      Hoạt động game
                    </h2>

                    {statsStatus === "loading" && (
                      <p className="profile-stats-status">Đang tải thống kê...</p>
                    )}
                    {statsStatus === "error" && (
                      <p className="profile-stats-status profile-stats-status--error">
                        Không tải được thống kê. Vui lòng thử lại sau.
                      </p>
                    )}
                    {statsStatus === "success" && (
                      <div className="profile-stats-grid">
                        <div className="profile-stat-card">
                          <span className="profile-stat-value">
                            {totalSessions}
                          </span>
                          <span className="profile-stat-label">Lượt chơi</span>
                        </div>
                        <div className="profile-stat-card">
                          <span className="profile-stat-value">
                            {formatDuration(totalDuration)}
                          </span>
                          <span className="profile-stat-label">
                            Tổng thời lượng
                          </span>
                        </div>
                        <div className="profile-stat-card">
                          <span className="profile-stat-value">
                            {uniqueGames}
                          </span>
                          <span className="profile-stat-label">
                            Game đã chơi
                          </span>
                        </div>
                        <div className="profile-stat-card">
                          <span className="profile-stat-value">
                            {likesStatus === "success" ? likedCount : "—"}
                          </span>
                          <span className="profile-stat-label">
                            Game yêu thích
                          </span>
                        </div>
                      </div>
                    )}

                    <div
                      className="profile-tabs"
                      role="tablist"
                      aria-label="Hoạt động game"
                    >
                      {PROFILE_ACTIVITY_TABS.map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          role="tab"
                          id={`profile-tab-${tab.id}`}
                          className={`profile-tab${
                            activityTab === tab.id ? " profile-tab--active" : ""
                          }`}
                          aria-selected={activityTab === tab.id}
                          aria-controls={`profile-panel-${tab.id}`}
                          onClick={() => setActivityTab(tab.id)}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="profile-tab-panels">
                      <div
                        role="tabpanel"
                        id="profile-panel-played"
                        aria-labelledby="profile-tab-played"
                        hidden={activityTab !== "played"}
                        className="profile-tab-panel"
                      >
                        {statsStatus === "loading" && (
                          <p className="profile-stats-status">
                            Đang tải danh sách game...
                          </p>
                        )}
                        {statsStatus === "success" && topGames.length === 0 && (
                          <p className="profile-stats-empty">
                            Bạn chưa chơi game nào. Hãy khám phá và bắt đầu chơi
                            nhé!
                          </p>
                        )}
                        {statsStatus === "success" && topGames.length > 0 && (
                          <ul className="profile-game-list">
                            {topGames.map((item) => {
                              const thumbUrl = gameThumbUrl(
                                item.game?.thumbnail,
                                item.game?.cover_image,
                              );

                              return (
                                <li
                                  key={item.game_id}
                                  className="profile-game-item"
                                >
                                  <Link
                                    href={`/game/${item.game.slug}`}
                                    className="profile-game-card"
                                  >
                                    <div className="profile-game-thumb">
                                      {thumbUrl ? (
                                        <img
                                          src={thumbUrl}
                                          alt={item.game.title}
                                          loading="lazy"
                                          decoding="async"
                                        />
                                      ) : (
                                        <span
                                          className="profile-game-thumb-placeholder"
                                          aria-hidden
                                        />
                                      )}
                                    </div>
                                    <div className="profile-game-body">
                                      <span className="profile-game-title">
                                        {item.game.title}
                                      </span>
                                      <div className="profile-game-meta">
                                        <span>{item.session_count} lượt</span>
                                        <span
                                          className="profile-game-meta-sep"
                                          aria-hidden
                                        >
                                          ·
                                        </span>
                                        <span>
                                          {formatDuration(
                                            item.total_duration_seconds,
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>

                      <div
                        role="tabpanel"
                        id="profile-panel-sessions"
                        aria-labelledby="profile-tab-sessions"
                        hidden={activityTab !== "sessions"}
                        className="profile-tab-panel"
                      >
                        {historyStatus === "loading" && (
                          <p className="profile-stats-status">
                            Đang tải lịch sử...
                          </p>
                        )}
                        {historyStatus === "success" &&
                          recentSessions.length === 0 && (
                            <p className="profile-stats-empty">
                              Chưa có phiên chơi nào.
                            </p>
                          )}
                        {historyStatus === "success" &&
                          recentSessions.length > 0 && (
                            <ul className="profile-session-list">
                              {recentSessions.map((session) => {
                                const thumbUrl = gameThumbUrl(
                                  session.game?.thumbnail,
                                  session.game?.cover_image,
                                );
                                const gameSlug =
                                  session.game?.slug ?? session.game_id;
                                const gameTitle =
                                  session.game?.title ?? session.game_id;

                                return (
                                  <li
                                    key={session.id}
                                    className="profile-session-item"
                                  >
                                    <Link
                                      href={`/game/${gameSlug}`}
                                      className="profile-game-card"
                                    >
                                      <div className="profile-game-thumb">
                                        {thumbUrl ? (
                                          <img
                                            src={thumbUrl}
                                            alt={gameTitle}
                                            loading="lazy"
                                            decoding="async"
                                          />
                                        ) : (
                                          <span
                                            className="profile-game-thumb-placeholder"
                                            aria-hidden
                                          />
                                        )}
                                      </div>
                                      <div className="profile-game-body">
                                        <div className="profile-session-head">
                                          <span className="profile-game-title">
                                            {gameTitle}
                                          </span>
                                          <span
                                            className={`profile-session-status profile-session-status--${session.status}`}
                                          >
                                            {session.status === "active"
                                              ? "Đang chơi"
                                              : "Đã xong"}
                                          </span>
                                        </div>
                                        <div className="profile-session-meta">
                                          <span>
                                            {formatSessionDate(
                                              session.started_at,
                                            )}
                                          </span>
                                          <span
                                            className="profile-game-meta-sep"
                                            aria-hidden
                                          >
                                            ·
                                          </span>
                                          <span>
                                            {formatDuration(
                                              session.duration_seconds,
                                            )}
                                          </span>
                                        </div>
                                      </div>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                      </div>

                      <div
                        role="tabpanel"
                        id="profile-panel-liked"
                        aria-labelledby="profile-tab-liked"
                        hidden={activityTab !== "liked"}
                        className="profile-tab-panel"
                      >
                        {likesStatus === "loading" && (
                          <p className="profile-stats-status">
                            Đang tải game yêu thích...
                          </p>
                        )}
                        {likesStatus === "error" && (
                          <p className="profile-stats-status profile-stats-status--error">
                            Không tải được danh sách game yêu thích.
                          </p>
                        )}
                        {likesStatus === "success" && likedGames.length === 0 && (
                          <p className="profile-stats-empty">
                            Bạn chưa thích game nào. Hãy thả tim ở trang chơi
                            game nhé!
                          </p>
                        )}
                        {likesStatus === "success" && likedGames.length > 0 && (
                          <ul className="profile-game-list">
                            {likedGames.map((item) => {
                              const game = item.game;
                              if (!game) return null;

                              const thumbUrl = gameThumbUrl(
                                game.thumbnail,
                                game.cover_image,
                              );

                              return (
                                <li key={item.id} className="profile-game-item">
                                  <Link
                                    href={`/game/${game.slug}`}
                                    className="profile-game-card"
                                  >
                                    <div className="profile-game-thumb">
                                      {thumbUrl ? (
                                        <img
                                          src={thumbUrl}
                                          alt={game.title}
                                          loading="lazy"
                                          decoding="async"
                                        />
                                      ) : (
                                        <span
                                          className="profile-game-thumb-placeholder"
                                          aria-hidden
                                        />
                                      )}
                                    </div>
                                    <div className="profile-game-body">
                                      <span className="profile-game-title">
                                        {game.title}
                                      </span>
                                      <div className="profile-game-meta">
                                        <span>
                                          Đã thích{" "}
                                          {formatLikedDate(item.created_at)}
                                        </span>
                                      </div>
                                    </div>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
