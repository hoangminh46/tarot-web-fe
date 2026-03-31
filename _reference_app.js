// js/app.js — Main application coordinator / page router
(function () {
  console.log(
    "\n\n\n\n\n%c✦ IMPERIAL TAROT ✦%c\n\nChào mừng bạn đến với không gian tâm linh Huyền Bí Mystery Tarot. Mọi thông điệp đều mang tần số năng lượng riêng dành cho bạn.\n\n%c🔮 Developed & Designed by Turnio DEV%c\nKết nối: https://www.facebook.com/turni0\n\n\n\n\n\n\n\n\n\n\n",
    "color: #C9A84C; font-size: 28px; font-weight: bold; text-shadow: 0 0 15px rgba(201, 168, 76, 0.8), 0 0 30px rgba(155, 48, 255, 0.5); font-family: 'Cinzel', serif; padding: 10px 0;",
    "color: #e8b4ff; font-size: 14px; font-style: italic; font-family: 'EB Garamond', serif; line-height: 1.8;",
    "color: #fff; font-size: 13px; font-family: 'Philosopher', serif; background: linear-gradient(90deg, #1e0f32, #6a1b9a); padding: 5px 12px; border-radius: 4px; border: 1px solid rgba(201, 168, 76, 0.3); display: inline-block;",
    "color: #aaa; font-size: 12px; font-style: italic; margin-top: 10px; display: block;"
  );
  const pages = {
    landing: document.getElementById('pageLanding'),
    reading: document.getElementById('pageReading'),
    analysis: document.getElementById('pageAnalysis')
  };

  function showPage(name) {
    Object.entries(pages).forEach(([key, el]) => {
      el.classList.toggle('page--active', key === name);
    });
    if (pages[name]) pages[name].scrollTop = 0;
  }

  // ── Begin reading (from main form) ─────────────────
  document.getElementById('btnBeginReading').addEventListener('click', async () => {
    const data = window.FormModule.getData();
    if (!data.name || !data.theme || !data.question) return;

    // Duplicate question check (3 months)
    if (window.HistoryModule && window.HistoryModule.checkDuplicateQuestion) {
      if (window.HistoryModule.checkDuplicateQuestion(data.question)) {
        const proceed = await window.DailyLimit.showWarning(
          data.theme,
          `Bạn đã hỏi vũ trụ câu hỏi này gần đây. Việc hỏi lại cùng một vấn đề khi chưa có sự thay đổi thực tế sẽ làm <em>nhiễu loạn</em> năng lượng.<br><br>Vũ trụ khuyên bạn nên chờ ít nhất <strong>3 tháng</strong> để tình hình biến chuyển rồi mới xem lại.`
        );
        if (!proceed) return;
      }
    }

    // Daily limit check
    const limitResult = window.DailyLimit?.check(data.theme, data.spread);
    if (limitResult === 'blocked') {
      window.FormModule.close();
      window.DailyLimit.showBlocked(data.theme);
      return;
    }
    if (limitResult === 'warn') {
      const proceed = await window.DailyLimit.showWarning(data.theme);
      if (!proceed) return;
    }

    window.AuthModule?.syncGamification();
    window.FormModule.close(true);

    function executeWarpAndRead() {
      const particles = window.Particles;
      const hasWarp = particles && particles.triggerWarp;

      if (hasWarp) {
        particles.triggerWarp(2000); // Trigger visual warp and make it last longer

        const landingCenter = document.querySelector('.landing-center');
        if (landingCenter) {
          landingCenter.style.transition = 'transform 1.0s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.8s';
          landingCenter.style.transform = 'scale(1.4) translateY(-30px)';
          landingCenter.style.opacity = '0';
          landingCenter.style.pointerEvents = 'none';
        }
      }

      setTimeout(() => {
        if (window.triggerLightning) window.triggerLightning();
        showPage('reading');
        window.ReadingModule.init(data);

        if (hasWarp) {
          setTimeout(() => {
            const landingCenter = document.querySelector('.landing-center');
            if (landingCenter) {
              landingCenter.style.transform = '';
              landingCenter.style.opacity = '1';
              landingCenter.style.transition = '';
              landingCenter.style.pointerEvents = 'all';
            }
          }, 1000);
        }
      }, hasWarp ? 2000 : 300);
    }

    const focusScreen = document.getElementById('focusScreen');
    const focusText = document.getElementById('focusText');

    if (focusScreen && focusText) {
      focusText.innerHTML = `Hãy nghiêm túc tập trung suy nghĩ và tự trả lời...<br><br><span style="color:var(--c-gold); font-size:1.4rem; font-style:italic">"${data.question}"</span><br><br><span style="font-size:0.85rem; opacity:0.5; font-family:'EB Garamond',serif">Chấp tâm trong khoảnh khắc, vũ trụ đang lắng nghe...</span><div id="btnSkipFocus" style="display:block; margin:100px auto 0; text-align:center; font-size:0.75rem; font-family:'EB Garamond',serif; font-style:italic; color:rgba(232, 180, 255, 0.6); cursor:pointer; letter-spacing:0.08em; animation:instrPulse 3s ease-in-out infinite; white-space:nowrap;">Tôi đã sẵn sàng</div>`;
      focusScreen.classList.add('active');

      let focusTimeout;
      const finishFocus = () => {
        if (!focusScreen.classList.contains('active')) return;
        clearTimeout(focusTimeout);
        focusScreen.onclick = null; // Remove global click listener
        focusScreen.classList.remove('active');
        setTimeout(executeWarpAndRead, 1100);
      };

      focusTimeout = setTimeout(finishFocus, 15000);

      // Allow clicking ANYWHERE on the focus screen to skip
      setTimeout(() => {
        focusScreen.onclick = finishFocus;
      }, 0);
    } else {
      executeWarpAndRead();
    }
  });

  // ── Go to analysis ─────────────────────────────────
  document.getElementById('btnGoAnalysis').addEventListener('click', () => {
    const cards = window.ReadingModule.getSelectedCards();
    const session = window.ReadingModule.getSession();
    // Record AFTER reading is complete
    window.DailyLimit?.record(session.theme, session.spread);
    session.localId = window.HistoryModule?.save(session, cards);

    // Spread Energy Cooldown for 5/7/10 cards
    if (session.spread === 5 || session.spread === 7 || session.spread === 10) {
      try {
        const data = JSON.parse(localStorage.getItem('tbhb_spread_cooldown') || '{}');
        data[session.spread] = Date.now();
        localStorage.setItem('tbhb_spread_cooldown', JSON.stringify(data));
      } catch (e) { }
    }

    showPage('analysis');
    setTimeout(() => window.AnalysisModule.render(cards, session), 200);
  });


  // ── Initial state / Share Link ─────────────────────
  const urlParams = new URLSearchParams(window.location.search);
  const shareId = urlParams.get('share');

  if (shareId) {
    showPage('analysis');
    loadSharedReading(shareId);
  } else {
    showPage('landing');
  }

  async function loadSharedReading(id) {
    const contentEl = document.getElementById('analysisContent');
    contentEl.innerHTML = `
      <div class="ai-loading">
        <div class="ai-pulse"></div>
        <span>Đang tải thông điệp…</span>
      </div>`;

    try {
      const res = await fetch(`https://ka-en.com.vn/tarot_api/get_reading.php?id=${id}`);
      if (!res.ok) throw new Error("Không tìm thấy kết quả hoặc kết nối lỗi.");
      const data = await res.json();

      const session = {
        name: data.name,
        dob: data.dob,
        theme: data.theme,
        question: data.question,
        spread: data.spread_count,
        isSharedReplay: true,
        readingId: id
      };

      // Map API cards to app format
      const cards = data.cards.map(c => {
        const fullCard = window.TAROT_DB ? window.TAROT_DB.find(db => db.id === c.id || db.name === c.name) : null;
        return {
          id: c.id,
          name: c.name,
          nameVi: c.name_vi,
          number: fullCard ? fullCard.number : '',
          image: fullCard ? fullCard.image : `cards/${c.id || c.name.toLowerCase().replace(/\s+/g, '')}.jpg`,
          isReversed: c.is_reversed === 1 || c.is_reversed === true,
          upright: fullCard ? (fullCard.generalUpright || fullCard.upright) : c.meaning,
          reversed: fullCard ? (fullCard.generalReversed || fullCard.reversed) : c.meaning,
          keywords: fullCard ? fullCard.keywords : [],
          keywordsRev: fullCard ? fullCard.keywordsRev : [],
          planet: fullCard?.planet,
          zodiac: fullCard?.zodiac,
          element: fullCard?.element,
          numerology: fullCard?.numerology,
          aspects: fullCard?.aspects,
          advice: fullCard?.advice
        };
      });

      window.AnalysisModule.render(cards, session, data.gemini_analysis);

    } catch (err) {
      console.error("Lỗi tải share:", err);
      document.getElementById('analysisContent').innerHTML = '';
      showPage('landing');
      window.showMysticalAlert(
        "Thông điệp bị ẩn",
        "Vũ trụ không tìm thấy tín hiệu hoặc thông điệp này đã được ẩn đi. Xin hãy trở lại nơi bắt đầu.",
        "Quay Về",
        () => {
          if (window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        },
        5000
      );
    }
  }

  // ── Top Topics Chart ─────────────────────────────────
  const THEME_LABEL = {
    love: 'Tình Yêu', ex: 'Người Yêu Cũ', current_love: 'Người Yêu Hiện Tại',
    ambiguous: 'Mối Quan Hệ Mập Mờ', crush: 'Crush / Thầm Thích',
    future_love: 'Tình Duyên Tương Lai', someone: 'Người Ấy',
    marriage: 'Hôn Nhân', conflict: 'Giải Quyết Xung Đột',
    breakup: 'Chia Tay & Hàn Gắn', long_distance: 'Yêu Xa',
    jealousy: 'Người Thứ Ba / Ghen Tuông', self_love: 'Yêu Bản Thân',
    finding_love: 'Tìm Kiếm Tình Yêu', compatibility: 'Độ Tương Hợp',
    toxic_relationship: 'Quan Hệ Độc Hại', soulmate: 'Tri Kỷ / Soulmate', reconciliation: 'Gương Vỡ Lại Lành', secret_admirer: 'Người Thầm Thương',
    friendship: 'Tình Bạn / Tri Kỷ', pregnancy: 'Con Cái / Thai Kỳ', gossip: 'Thị Phi / Đàm Tiếu', family: 'Gia Đình',
    career: 'Sự Nghiệp', job_search: 'Xin Việc Làm', promotion: 'Thăng Tiến',
    business: 'Kinh Doanh / Khởi Nghiệp', colleague: 'Quan Hệ Đồng Nghiệp',
    career_change: 'Chuyển Nghề', freelance: 'Freelance / Tự Do', interview: 'Phỏng Vấn',
    legal: 'Pháp Lý / Giấy Tờ', moving: 'Chuyển Chỗ',
    burnout: 'Kiệt Sức', startup: 'Khởi Nghiệp', workplace_politics: 'Thị Phi Công Sở', side_hustle: 'Nghề Tay Trái',
    finance: 'Tài Chính', investment: 'Đầu Tư / Chứng Khoán',
    debt: 'Nợ Nần / Vay Mượn', savings: 'Tiết Kiệm & Tích Lũy', luck_money: 'Lộc Tài / May Mắn',
    real_estate: 'Bất Động Sản', financial_loss: 'Thua Lỗ', sudden_wealth: 'Vận May Bất Ngờ',
    health: 'Sức Khỏe', mental: 'Sức Khỏe Tâm Thần', energy: 'Năng Lượng & Chakra',
    diet: 'Điều Độ / Chăm Sóc Bản Thân', pet: 'Thú Cưng',
    healing: 'Chữa Lành Tâm Hồn', stress: 'Căng Thẳng', trauma: 'Tổn Thương Quá Khứ',
    study: 'Học Tập', study_abroad: 'Du Học', self: 'Bản Thân',
    purpose: 'Sứ Mệnh / Mục Đích Sống', shadow_self: 'Bóng Tối Nội Tâm',
    decision: 'Ra Quyết Định', travel: 'Du Lịch / Di Chuyển', spiritual: 'Tâm Linh',
    dream: 'Giải Mã Giấc Mơ', past_life: 'Tiền Kiếp', karma: 'Nghiệp Quả', lost_item: 'Đồ Vật Thất Lạc',
    exams: 'Thi Cử', scholarship: 'Học Bổng', talent: 'Năng Khiếu', spirit_guide: 'Thần Hộ Mệnh',
    general: 'Tổng Quát', more: 'Tổng Quát'
  };

  const btnTopTopics = document.getElementById('btnTopTopics');
  const topTopicsModal = document.getElementById('topTopicsModal');
  const topicsChartCanvas = document.getElementById('topicsChart');
  const topTopicsLoading = document.getElementById('topTopicsLoading');
  let topTopicsChartInstance = null;

  if (btnTopTopics && topTopicsModal && topicsChartCanvas) {
    btnTopTopics.addEventListener('click', async () => {
      topTopicsModal.classList.add('visible');
      topTopicsLoading.style.display = 'block';
      topicsChartCanvas.style.display = 'none';

      try {
        const res = await fetch('https://ka-en.com.vn/tarot_api/get_top_topics.php');
        const json = await res.json();

        if (json.status === 'success') {
          topTopicsLoading.style.display = 'none';
          topicsChartCanvas.style.display = 'block';

          let getLabel = (t) => t;
          if (window.TarotHelper && window.TarotHelper.getThemeLabel) {
            getLabel = window.TarotHelper.getThemeLabel;
          } else {
            getLabel = (t) => THEME_LABEL[t] || t;
          }

          const labels = json.data.map(d => getLabel(d.theme));
          const counts = json.data.map(d => parseInt(d.count, 10));
          const totalCount = counts.reduce((sum, val) => sum + val, 0);
          const percentages = counts.map(count => ((count / totalCount) * 100).toFixed(1));

          if (topTopicsChartInstance) {
            topTopicsChartInstance.destroy();
          }

          Chart.defaults.color = 'rgba(232, 180, 255, 0.7)';
          Chart.defaults.font.family = "'EB Garamond', serif";

          const ctx = topicsChartCanvas.getContext('2d');

          // Trì hoãn một chút để CSS transition (fade-in) của modal chạy xong 
          // thì mới tạo chart, giúp hiệu ứng chạy từ 0 lên hiển thị trọn vẹn
          setTimeout(() => {
            topTopicsChartInstance = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Tỷ lệ %',
                  data: percentages,
                  backgroundColor: 'rgba(201, 168, 76, 0.6)',
                  borderColor: 'rgba(201, 168, 76, 1)',
                  borderWidth: 1,
                  borderRadius: 4
                }]
              },
              options: {
                indexAxis: 'y',
                animation: {
                  duration: 2000,
                  delay: 200,   // Thêm nhẹ delay để chắc chắn modal đã bung hết cỡ
                  easing: 'easeOutCubic',
                  x: {
                    from: 0
                  }
                },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(20, 10, 30, 0.9)',
                    titleColor: '#e8b4ff',
                    bodyColor: '#c9a84c',
                    borderColor: '#c9a84c',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                      label: (ctx) => `${ctx.raw}%`
                    }
                  }
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                      callback: function (value) { return value + "%"; }
                    },
                    grid: { color: 'rgba(155, 48, 255, 0.1)' }
                  },
                  y: {
                    ticks: { font: { family: "'Philosopher', serif", size: 14 } },
                    grid: { display: false }
                  }
                }
              }
            });
          }, 350);
        }
      } catch (err) {
        console.error('Error fetching top topics:', err);
        topTopicsLoading.innerHTML = '<span style="color:var(--c-gold)">Không thể tải dữ liệu thống kê.</span>';
      }
    });
  }

  // ── Gamification: Title System ────────────────────────
  window.updateUserTitle = function () {
    const badge = document.getElementById('userTitleBadge');
    if (!badge) return;
    const count = parseInt(localStorage.getItem('tarot_reading_count') || '0', 10);
    if (count <= 0) return;

    let title = 'Kẻ Khờ (The Fool)';
    let color = '#a0a0a0';
    if (count >= 100) { title = 'Bậc Thầy Tarot (The Master)'; color = '#ffeb3b'; }
    else if (count >= 50) { title = 'Kẻ Thức Tỉnh (The Awakened)'; color = '#ce93d8'; }
    else if (count >= 10) { title = 'Người Tìm Kiếm (The Seeker)'; color = '#90caf9'; }

    badge.innerHTML = `<span style="font-size: 0.8rem; opacity: 0.7; font-family: 'EB Garamond', serif;">Danh hiệu vũ trụ</span>
                       <strong style="color: ${color}; font-family: 'Philosopher', serif; font-size: 1.1rem; text-shadow: 0 0 10px ${color}80;">✧ ${title} ✧</strong>
                       <span style="font-size: 0.75rem; color: #a0a0a0; margin-top: 4px;">Đã kết nối: ${count} lần</span>`;
    badge.style.display = 'none'; // Tạm ẩn trên màn hình chính
    badge.style.cursor = 'pointer';
    badge.onclick = () => { if (window.showAchievements) window.showAchievements(); };
  };

  // Load title on init
  setTimeout(() => window.updateUserTitle(), 500);

  // ── Show Achievements Modal ────────────────────────────
  window.showAchievements = function () {
    const modal = document.getElementById('achievementsModal');
    if (!modal) return;

    const count = parseInt(localStorage.getItem('tarot_reading_count') || '0', 10);
    const rawAchv = JSON.parse(localStorage.getItem('tarot_daily_streak') || '{}');
    let streak = 0;
    if (rawAchv.count !== undefined) streak = parseInt(rawAchv.count) || 0;
    else if (rawAchv._tx) { try { streak = (parseInt(atob(rawAchv._tx)) - 42) / 9 || 0; } catch (e) { } }

    const titles = [
      { name: 'Kẻ Khờ (The Fool)', req: 0, current: count },
      { name: 'Người Tìm Kiếm (The Seeker)', req: 10, current: count },
      { name: 'Kẻ Thức Tỉnh (The Awakened)', req: 50, current: count },
      { name: 'Bậc Thầy Tarot (The Master)', req: 100, current: count }
    ];

    const streaks = [
      { name: 'Khởi đầu kết nối (3 ngày)', req: 3, current: streak },
      { name: 'Tuần trăng hoàn hảo (7 ngày)', req: 7, current: streak },
      { name: 'Năng lượng bền bỉ (21 ngày)', req: 21, current: streak },
      { name: 'Chu kỳ thức tỉnh (30 ngày)', req: 30, current: streak }
    ];

    function renderProgress(list, icon) {
      return list.map(item => {
        const isUnlocked = item.current >= item.req;
        const progress = Math.min(100, (item.current / (item.req || 1)) * 100);
        const unlockedClass = isUnlocked ? 'achv-unlocked' : 'achv-locked';

        let text = isUnlocked ? 'Hoàn thành' : `${item.current} / ${item.req}`;
        let barWidth = isUnlocked ? 100 : progress;
        let progressHTML = `<div class="achv-progress"><div class="achv-progress-bar" style="width: ${barWidth}%"></div></div>
                            <div class="achv-progress-text">${text}</div>`;

        return `
          <div class="achv-item ${unlockedClass}">
            <div class="achv-icon">${isUnlocked ? icon : '🔒'}</div>
            <div class="achv-info">
              <div class="achv-name">${item.name}</div>
              ${progressHTML}
            </div>
          </div>
        `;
      }).join('');
    }

    const html = `
      <div class="achv-section">
        <h3 class="achv-title" style="color: var(--c-gold); font-family: 'Philosopher', serif; margin-bottom: 12px; border-bottom: 1px solid rgba(201, 168, 76, 0.3); padding-bottom: 5px;">Tuyến Trải Bài & Danh Hiệu</h3>
        ${renderProgress(titles, '✧')}
      </div>
      <div class="achv-section" style="margin-top: 24px;">
        <h3 class="achv-title" style="color: #ffb090; font-family: 'Philosopher', serif; margin-bottom: 12px; border-bottom: 1px solid rgba(255, 176, 144, 0.3); padding-bottom: 5px;">Tuyến Kết Nối</h3>
        ${renderProgress(streaks, '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffb090" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c0 0-4 7-4 12a4 4 0 0 0 8 0c0-5-4-12-4-12z"/><path d="M12 2v10"/></svg>')}
      </div>
    `;

    document.getElementById('achievementsContent').innerHTML = html;
    modal.classList.add('visible');
  };

})();
