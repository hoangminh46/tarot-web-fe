// js/form.js v4 — 5+1 main themes → sub-theme drill-down → auto-advance
(function () {
  const overlay = document.getElementById('formOverlay');
  const panel = overlay.querySelector('.form-panel');
  const progressBar = document.getElementById('formProgressBar');
  const stepDots = document.querySelectorAll('.step-dot');
  const stepEls = document.querySelectorAll('.form-step');
  const charCount = document.getElementById('charCount');
  const inputQ = document.getElementById('inputQuestion');

  let currentStep = 1;
  const TOTAL = 4;
  let _selectedTheme = 'general';

  /* ── Helpers ──────────────────────────────────────── */
  function formatGenderText(text) {
    const gender = document.getElementById('inputGender')?.value || '';
    if (gender === 'Nam' || gender === 'Nữ') {
      let res = text.replace(/chồng\/vợ|vợ\/chồng/gi, match => {
        const isUpper = match.charAt(0) === match.charAt(0).toUpperCase();
        const repl = gender === 'Nam' ? 'vợ' : 'chồng';
        return isUpper ? repl.charAt(0).toUpperCase() + repl.slice(1) : repl;
      });
      res = res.replace(/người yêu( cũ| hiện tại| tương lai)?/gi, match => {
        const isFirstUpper = match.charAt(0) === 'N';
        const isSecondUpper = match.charAt(6) === 'Y';
        const suffix = match.slice(9) || '';
        let repl = gender === 'Nam' ? 'bạn gái' : 'bạn trai';
        if (isFirstUpper && isSecondUpper) {
          repl = gender === 'Nam' ? 'Bạn Gái' : 'Bạn Trai';
        } else if (isFirstUpper) {
          repl = gender === 'Nam' ? 'Bạn gái' : 'Bạn trai';
        }
        return repl + suffix;
      });
      res = res.replace(/\[cha_con\]/gi, match => {
        const isUpper = match.charAt(1) === 'C';
        let repl = gender === 'Nam' ? 'cha con' : 'mẹ con';
        return isUpper ? repl.charAt(0).toUpperCase() + repl.slice(1) : repl;
      });
      res = res.replace(/\[anh_em\]/gi, match => {
        const isUpper = match.charAt(1) === 'A';
        let repl = gender === 'Nam' ? 'anh em' : 'chị em';
        return isUpper ? repl.charAt(0).toUpperCase() + repl.slice(1) : repl;
      });
      return res;
    }
    return text.replace(/\[cha_con\]/gi, 'cha/mẹ con').replace(/\[anh_em\]/gi, 'anh/chị em');
  }

  function getStep(n) { return document.getElementById(`step${n}`); }

  function updateProgress(n) {
    const pct = ((n - 1) / (TOTAL - 1)) * 100;
    progressBar.style.width = Math.max(8, pct) + '%';
    stepDots.forEach((d, i) => {
      const wasActive = d.classList.contains('active');
      d.classList.toggle('active', i + 1 === n);
      d.classList.toggle('done', i + 1 < n);
      if (i + 1 === n && !wasActive) window.FX?.activateDot(d);
    });
  }


  /* ── Birth Card Profiler ────────────────────────────── */
  function calculateZodiac(d, m) {
    if ((m == 1 && d >= 20) || (m == 2 && d <= 18)) return { name: 'Bảo Bình', element: 'Khí', symbol: '♒' };
    if ((m == 2 && d >= 19) || (m == 3 && d <= 20)) return { name: 'Song Ngư', element: 'Nước', symbol: '♓' };
    if ((m == 3 && d >= 21) || (m == 4 && d <= 19)) return { name: 'Bạch Dương', element: 'Lửa', symbol: '♈' };
    if ((m == 4 && d >= 20) || (m == 5 && d <= 20)) return { name: 'Kim Ngưu', element: 'Đất', symbol: '♉' };
    if ((m == 5 && d >= 21) || (m == 6 && d <= 20)) return { name: 'Song Tử', element: 'Khí', symbol: '♊' };
    if ((m == 6 && d >= 21) || (m == 7 && d <= 22)) return { name: 'Cự Giải', element: 'Nước', symbol: '♋' };
    if ((m == 7 && d >= 23) || (m == 8 && d <= 22)) return { name: 'Sư Tử', element: 'Lửa', symbol: '♌' };
    if ((m == 8 && d >= 23) || (m == 9 && d <= 22)) return { name: 'Xử Nữ', element: 'Đất', symbol: '♍' };
    if ((m == 9 && d >= 23) || (m == 10 && d <= 22)) return { name: 'Thiên Bình', element: 'Khí', symbol: '♎' };
    if ((m == 10 && d >= 23) || (m == 11 && d <= 21)) return { name: 'Thiên Yết', element: 'Nước', symbol: '♏' };
    if ((m == 11 && d >= 22) || (m == 12 && d <= 21)) return { name: 'Nhân Mã', element: 'Lửa', symbol: '♐' };
    if ((m == 12 && d >= 22) || (m == 1 && d <= 19)) return { name: 'Ma Kết', element: 'Đất', symbol: '♑' };
    return { name: 'Vô Hướng', element: '', symbol: '✨' };
  }

  function getLifePath(dobStr) {
    if (!dobStr) return 0;
    const digits = dobStr.replace(/\D/g, '');
    let sum = 0;
    for (let c of digits) sum += parseInt(c, 10);
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      let temp = 0;
      for (let c of sum.toString()) temp += parseInt(c, 10);
      sum = temp;
    }
    return sum;
  }

  function updateBirthCardUI() {
    const dobInput = document.getElementById('inputDob').value;
    const nameInput = document.getElementById('inputName').value.trim();
    const bcContainer = document.getElementById('birthCardProfile');
    if (!bcContainer) return;

    if (!dobInput) {
      bcContainer.style.display = 'none';
      return;
    }

    const parts = dobInput.split('-');
    if (parts.length < 3) return;

    const zodiac = calculateZodiac(parseInt(parts[2], 10), parseInt(parts[1], 10));
    const lp = getLifePath(dobInput);

    bcContainer.style.display = 'flex';
    bcContainer.style.gap = '20px';
    bcContainer.style.alignItems = 'center';
    bcContainer.style.background = 'linear-gradient(135deg, rgba(20,5,30,0.6), rgba(10,5,20,0.8))';
    bcContainer.style.border = '1px solid rgba(180, 130, 255, 0.2)';
    bcContainer.style.borderLeft = '3px solid rgba(255, 215, 0, 0.6)';
    bcContainer.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5), inset 0 0 15px rgba(255,215,0,0.03)';
    bcContainer.style.padding = '12px 16px';
    bcContainer.style.borderRadius = '12px';
    bcContainer.style.position = 'relative';

    const cleanSymbol = zodiac.symbol + '\uFE0E';

    bcContainer.innerHTML = `
      <div style="width: 50px; height: 50px; border-radius: 50%; border: 1px dashed rgba(255,215,0,0.4); display: flex; align-items: center; justify-content: center; position: relative; flex-shrink: 0; box-shadow: 0 0 15px rgba(155,48,255,0.3);">
         <div style="position: absolute; width: 60px; height: 60px; border: 1px solid rgba(155,48,255,0.2); border-radius: 50%; opacity: 0.5;"></div>
         <div style="position: absolute; width: 40px; height: 40px; border: 1px solid rgba(255,215,0,0.2); border-radius: 50%; transform: rotateD; animation: spin 10s linear infinite;"></div>
         <svg width="40" height="40" viewBox="0 0 100 100" style="position:absolute; animation: spinReverse 15s linear infinite; opacity: 0.6;">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(200,150,255,0.4)" stroke-dasharray="4 6" stroke-width="1"/>
            <polygon points="50,15 80,75 20,75" fill="none" stroke="rgba(255,215,0,0.3)" stroke-width="1"/>
            <polygon points="50,85 20,25 80,25" fill="none" stroke="rgba(255,215,0,0.3)" stroke-width="1"/>
         </svg>
         <span style="font-family: 'Times New Roman', serif; color: #ffd700; font-size: 1.4rem; z-index: 2; text-shadow: 0 0 8px rgba(255,215,0,0.8);">${cleanSymbol}</span>
      </div>
      <div style="flex:1; font-family:'EB Garamond', serif; font-size:0.95rem; line-height:1.5;">
        <span style="color:rgba(255,255,255,0.7);">Kẻ lữ hành <strong style="color:var(--c-gold); font-family:'Philosopher', serif; font-size:1.05rem;">${nameInput}</strong>, <br/> Vũ trụ kết nối tín hiệu chân mệnh của bạn thuộc chòm sao <strong style="color:#d2b4ff;">${zodiac.name}</strong>.</span><br>
        <span style="color:rgba(255,255,255,0.7);">Tần số dao động Thần số học: <strong style="color:#ffd700; font-size:1.15rem; font-family:'Philosopher', serif;">${lp}</strong>.</span>
      </div>
    `;

    // Inject simple spin animations if not exist
    if (!document.getElementById('bc-anims')) {
      const style = document.createElement('style');
      style.id = 'bc-anims';
      style.innerHTML = '@keyframes spin { 100% { transform: rotate(360deg); } } @keyframes spinReverse { 100% { transform: rotate(-360deg); } }';
      document.head.appendChild(style);
    }
  }

  function goToStep(next, direction = 'forward') {
    const outEl = getStep(currentStep);
    const inEl = getStep(next);
    currentStep = next;
    updateProgress(next);
    if (window.FX?.slideStep) window.FX.slideStep(outEl, inEl, direction);
    else { outEl.classList.remove('active'); inEl.classList.add('active'); }
    if (next === 2) { updateBirthCardUI(); }
    if (next === 3) {
      setTimeout(() => switchQTab('preset'), 480);
    }
    setTimeout(() => {
      const firstInput = inEl.querySelector('input, textarea');
      if (firstInput && firstInput.type !== 'radio') firstInput.focus();
    }, 460);
  }

  /* ── Open / Close ─────────────────────────────────── */
  const USER_KEY = 'tbhb_user';

  function openForm() {
    // Prevent overlap with daily draw modal
    const dailyModal = document.getElementById('dailyDrawModal');
    const btnDailyClose = document.getElementById('btnDailyClose');
    if (dailyModal && dailyModal.classList.contains('open') && btnDailyClose) {
      btnDailyClose.click();
    }

    stepEls.forEach((s, i) => s.classList.toggle('active', i === 0));
    currentStep = 1;
    updateProgress(1);
    _selectedTheme = 'general';
    renderMainThemes('mainThemeGrid');

    // Auto-fill: try current session first, then localStorage
    const prev = window.ReadingModule?.getSession ? window.ReadingModule.getSession() : null;
    let savedName = prev?.name || '';
    let savedDob = prev?.dob || '';
    let savedGen = prev?.gender || '';
    if (!savedName || !savedDob || !savedGen) {
      try {
        const stored = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
        if (!savedName) savedName = stored.name || '';
        if (!savedDob) savedDob = stored.dob || '';
        if (!savedGen) savedGen = stored.gender || '';
      } catch { }
    }
    if (savedName) document.getElementById('inputName').value = savedName;
    if (savedDob) window.DobPicker?.setValue(savedDob);
    if (savedGen) {
      document.getElementById('inputGender').value = savedGen;
      const textEl = document.getElementById('genderDisplayText');
      if (textEl) textEl.textContent = savedGen;
      const wrapEl = document.getElementById('genderPickerWrap');
      if (wrapEl) wrapEl.classList.add('has-value');

      const opts = document.querySelectorAll('.gender-opt');
      opts.forEach(o => {
        o.classList.toggle('selected', o.dataset.val === savedGen);
      });
    } else {
      document.getElementById('inputGender').value = '';
      const textEl = document.getElementById('genderDisplayText');
      if (textEl) textEl.textContent = 'Chọn';
      const wrapEl = document.getElementById('genderPickerWrap');
      if (wrapEl) wrapEl.classList.remove('has-value');
      const opts = document.querySelectorAll('.gender-opt');
      opts.forEach(o => o.classList.remove('selected'));
    }

    const subEl = document.getElementById('subThemePanel');
    const gridEl = document.getElementById('mainThemeGrid');
    if (subEl) { subEl.classList.add('hidden'); subEl.innerHTML = ''; }
    if (gridEl) gridEl.classList.remove('hidden');
    if (window.FX?.modalOpen) window.FX.modalOpen(overlay, panel);
    else overlay.classList.add('visible');
    // Reset câu hỏi mỗi lần mở form mới
    if (inputQ) { inputQ.value = ''; if (charCount) charCount.textContent = '0 / 200'; }
    const oldHint = document.getElementById('_step3Hint');
    if (oldHint) oldHint.remove();

    // Reset step 2 title
    const stTitle = document.querySelector('#step2 .step-title');
    const stDesc = document.querySelector('#step2 .step-desc');
    if (stTitle) stTitle.textContent = 'Chọn Lĩnh Vực';
    if (stDesc) stDesc.style.display = 'block';
  }
  function closeForm(skipRestore = false) {
    if (window.FX?.modalClose) window.FX.modalClose(overlay, panel);
    else overlay.classList.remove('visible');

    // Phục hồi lại trang chủ nếu user đóng form (cancel)
    if (skipRestore !== true) {
      const landingCenter = document.querySelector('.landing-center');
      if (landingCenter) {
        landingCenter.style.transform = '';
        landingCenter.style.opacity = '1';
        landingCenter.style.transition = 'transform 0.6s var(--ease-out), opacity 0.6s';
        landingCenter.style.pointerEvents = 'all';
      }
    }
  }

  document.getElementById('btnOpenForm').addEventListener('click', (e) => {
    // Kích hoạt Fullscreen (F11) để tạo cảm giác nhập vai
    const docEl = document.documentElement;
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      // if (docEl.requestFullscreen) docEl.requestFullscreen().catch(() => { });
      // else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen().catch(() => { });
      // else if (docEl.msRequestFullscreen) docEl.msRequestFullscreen().catch(() => { });
    }

    // Play background music when entering full screen / exploring
    if (!window.bgMusic) {
      window.bgMusic = new Audio('bg_music/mfcc-mystery-mystic-mystical-music-279834.mp3');
      window.bgMusic.loop = true;
      window.bgMusic.volume = 0.5;
    }
    window.bgMusic.play().catch(err => console.log("Audio autoplay blocked:", err));

    window.FX?.ripple(e.currentTarget, e, 'rgba(200,121,255,0.35)');
    if (window.Particles && window.Particles.triggerWarp) {
      window.Particles.triggerWarp(1500);

      const landingCenter = document.querySelector('.landing-center');
      if (landingCenter) {
        landingCenter.style.transition = 'transform 1.0s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.8s';
        landingCenter.style.transform = 'scale(1.4) translateY(-30px)';
        landingCenter.style.opacity = '0';
        landingCenter.style.pointerEvents = 'none';
      }

      // Đợi 1.1s (để sao bay đã mắt) rồi mới mở Popup Form
      setTimeout(() => {
        openForm();
      }, 1100);
    } else {
      setTimeout(openForm, 80);
    }
  });
  document.getElementById('btnCloseForm').addEventListener('click', closeForm);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeForm(); });

  /* ── 5 Main themes + "Xem Thêm" ──────────────────── */
  const MAIN_THEMES = [
    { key: 'love', label: 'Tình Yêu', icon: '&#9829;', desc: 'Quan hệ & cảm xúc' },
    { key: 'career', label: 'Sự Nghiệp', icon: '&#9651;', desc: 'Công việc & định hướng' },
    { key: 'finance', label: 'Tài Chính', icon: '&#11045;', desc: 'Tiền bạc & đầu tư' },
    { key: 'health', label: 'Sức Khỏe', icon: '&#10022;', desc: 'Thể chất & tinh thần' },
    { key: 'self', label: 'Bản Thân', icon: '&#10038;', desc: 'Phát triển & định hướng' },
    { key: 'more', label: 'Xem Thêm', icon: '&#8943;', desc: 'Tất cả chủ đề' },
  ];

  /* ── Sub-theme groups (expanded) ─────────────────── */
  const SUB_THEMES = {
    love: [
      { key: 'ex', label: 'Người Yêu Cũ', desc: 'Mối quan hệ đã qua' },
      { key: 'current_love', label: 'Người Yêu Hiện Tại', desc: 'Tình cảm đang có' },
      { key: 'future_love', label: 'Người Yêu Tương Lai', desc: 'Tình duyên sắp tới' },
      { key: 'ambiguous', label: 'Mối Quan Hệ Mập Mờ', desc: 'Chưa rõ ràng' },
      { key: 'crush', label: 'Crush / Thầm Thích', desc: 'Người tôi thích' },
      { key: 'secret_admirer', label: 'Người Thương Bạn', desc: 'Ai đang để ý bạn' },
      { key: 'someone', label: 'Người Ấy', desc: 'Người đang nghĩ đến' },
      { key: 'marriage', label: 'Hôn Nhân', desc: 'Vợ chồng & hôn nhân' },
      { key: 'conflict', label: 'Giải Quyết Xung Đột', desc: 'Hóa giải mâu thuẫn' },
      { key: 'breakup', label: 'Chia Tay & Hàn Gắn', desc: 'Sau chia tay & hàn gắn' },
      { key: 'reconciliation', label: 'Gương Vỡ Lại Lành', desc: 'Quay lại tái hợp' },
      { key: 'long_distance', label: 'Yêu Xa', desc: 'Mối tình dị địa' },
      { key: 'jealousy', label: 'Người Thứ Ba / Ghen', desc: 'Nghi ngờ & phản bội' },
      { key: 'self_love', label: 'Yêu Bản Thân', desc: 'Nhìn lại chính mình' },
      { key: 'friendship', label: 'Tình Bạn / Tri Kỷ', desc: 'Sự thấu hiểu & khăng khít' },
      { key: 'family', label: 'Gia Đình', desc: 'Các mối quan hệ gia đình' },
      { key: 'pregnancy', label: 'Con Cái / Thai Kỳ', desc: 'Kế hoạch gia đình' },
      { key: 'gossip', label: 'Thị Phi / Đàm Tiếu', desc: 'Lời ra tiếng vào' },
      { key: 'toxic_relationship', label: 'Quan Hệ Độc Hại', desc: 'Đau buồn & bế tắc' },
      { key: 'soulmate', label: 'Tri Kỷ / Soulmate', desc: 'Kết nối linh hồn' },
    ],
    career: [
      { key: 'career', label: 'Sự Nghiệp / Công Việc', desc: 'Công việc hiện tại' },
      { key: 'job_search', label: 'Xin Việc Làm', desc: 'Cơ hội việc mới' },
      { key: 'promotion', label: 'Thăng Tiến', desc: 'Lên chức & tăng lương' },
      { key: 'business', label: 'Kinh Doanh / Khởi Nghiệp', desc: 'Thuận lợi khởi nghiệp' },
      { key: 'colleague', label: 'Mối Quan Hệ Đồng Nghiệp', desc: 'Đồng nghiệp & cấp trên' },
      { key: 'career_change', label: 'Chuyển Nghề', desc: 'Thay đổi hướng đi' },
      { key: 'freelance', label: 'Freelance / Tự Do', desc: 'Công việc tự do' },
      { key: 'interview', label: 'Phỏng Vấn', desc: 'Kết quả phỏng vấn' },
      { key: 'legal', label: 'Pháp Lý / Giấy Tờ', desc: 'Hợp đồng & rắc rối' },
      { key: 'moving', label: 'Chuyển Chỗ / Xuất Ngoại', desc: 'Định cư & nhà cửa' },
      { key: 'burnout', label: 'Kiệt Sức / Áp Lực', desc: 'Quá tải công việc' },
      { key: 'startup', label: 'Khởi Nghiệp', desc: 'Mở cơ sở kinh doanh' },
      { key: 'workplace_politics', label: 'Thị Phi Công Sở', desc: 'Đấu đá & chèn ép' },
      { key: 'side_hustle', label: 'Nghề Tay Trái', desc: 'Thu nhập phụ' },
    ],
    finance: [
      { key: 'finance', label: 'Tài Chính Tổng Quán', desc: 'Tiền bạc & đầu tư' },
      { key: 'investment', label: 'Đầu Tư / Chứng Khoán', desc: 'Cổ phiếu & tài sản' },
      { key: 'debt', label: 'Nợ Nần / Vay Mượn', desc: 'Giải quyết nợ' },
      { key: 'savings', label: 'Tiết Kiệm & Tích Lũy', desc: 'Xây dựng tảng lưỡng' },
      { key: 'luck_money', label: 'Lộc Tài / May Mắn', desc: 'Vận đỏ & tiền bạc' },
      { key: 'real_estate', label: 'Bất Động Sản', desc: 'Mua bán nhà đất' },
      { key: 'financial_loss', label: 'Thua Lỗ / Khó Khăn', desc: 'Khủng hoảng tiền bạc' },
      { key: 'sudden_wealth', label: 'Vận May Bất Ngờ', desc: 'Trúng số & Lộc rơi' },
    ],
    health: [
      { key: 'health', label: 'Sức Khỏe Thể Chất', desc: 'Cơ thể & bệnh tật' },
      { key: 'mental', label: 'Sức Khỏe Tâm Thần', desc: 'Cảm xúc & tâm lý' },
      { key: 'energy', label: 'Năng Lượng & Chakra', desc: 'Cân bằng năng lượng' },
      { key: 'diet', label: 'Điều Độ / Chăm Sóc', desc: 'Ăn uống & lối sống' },
      { key: 'pet', label: 'Thú Cưng', desc: 'Vật nuôi kết nối' },
      { key: 'healing', label: 'Chữa Lành Tâm Hồn', desc: 'Phục hồi vết thương' },
      { key: 'stress', label: 'Căng Thẳng / Âu Lo', desc: 'Quản lý cảm xúc' },
      { key: 'trauma', label: 'Tổn Thương Quá Khứ', desc: 'Bóng ma tâm lý' },
    ],
    self: [
      { key: 'study', label: 'Học Tập', desc: 'Kết quả & mục tiêu học' },
      { key: 'study_abroad', label: 'Du Học', desc: 'Cuộc sống học tập nước ngoài' },
      { key: 'self', label: 'Định Hướng Bản Thân', desc: 'Phát triển cá nhân' },
      { key: 'purpose', label: 'Sứ Mệnh / Mục Đích', desc: 'Tìm ý nghĩa cuộc đời' },
      { key: 'shadow_self', label: 'Bóng Tối Nội Tâm', desc: 'Chiều sử tối của bản thân' },
      { key: 'decision', label: 'Ra Quyết Định', desc: 'Lựa chọn quan trọng' },
      { key: 'travel', label: 'Du Lịch / Di Chuyển', desc: 'Kế hoạch di chuyển' },
      { key: 'spiritual', label: 'Tâm Linh', desc: 'Giác ngộ & tâm linh' },
      { key: 'dream', label: 'Giải Mã Giấc Mơ', desc: 'Thông điệp cõi vô thức' },
      { key: 'past_life', label: 'Tiền Kiếp', desc: 'Nợ nần kiếp trước' },
      { key: 'karma', label: 'Nghiệp Quả', desc: 'Nhân quả tuần hoàn' },
      { key: 'lost_item', label: 'Đồ Vật Thất Lạc', desc: 'Manh mối & phương hướng' },
      { key: 'exams', label: 'Thi Cử / Kiểm Tra', desc: 'Kết quả bài thi' },
      { key: 'scholarship', label: 'Học Bổng', desc: 'Cơ hội vươn xa' },
      { key: 'talent', label: 'Năng Khiếu / Đam Mê', desc: 'Khám phá biệt tài' },
      { key: 'spirit_guide', label: 'Thần Hộ Mệnh', desc: 'Thông điệp dẫn lối' },
    ],
  };

  const ALL_SUBS = Object.values(SUB_THEMES).flat();

  /* ── Render main theme card grid ──────────────────── */
  function renderMainThemes(containerId) {
    const grid = document.getElementById(containerId || 'mainThemeGrid');
    if (!grid) return;
    grid.innerHTML = MAIN_THEMES.map(t => `
      <button class="theme-card" data-main="${t.key}" type="button">
        <span class="theme-icon-wrap"><span class="theme-icon">${t.icon}</span></span>
        <span class="theme-name">${t.label}</span>
        <span class="theme-desc">${t.desc}</span>
      </button>`).join('');
    grid.querySelectorAll('.theme-card').forEach(card => {
      card.addEventListener('click', (e) => {
        window.FX?.ripple(card, e, 'rgba(200,121,255,0.35)');
        setTimeout(() => showSubThemes(card.dataset.main, containerId || 'mainThemeGrid'), 60);
      });
    });
  }

  /* ── Show sub-themes after main card click ────────── */
  function showSubThemes(mainKey, containerId) {
    containerId = containerId || 'mainThemeGrid';
    const isQR = containerId === 'qrMainThemeGrid';
    const gridEl = document.getElementById(containerId);
    const subEl = document.getElementById(isQR ? 'qrSubThemePanel' : 'subThemePanel');
    const mainLabel = MAIN_THEMES.find(t => t.key === mainKey)?.label || 'Tất Cả';

    let subs;
    if (mainKey === 'more') {
      subs = Object.entries(SUB_THEMES).flatMap(([k, arr]) =>
        arr.map(s => ({ ...s, _group: MAIN_THEMES.find(t => t.key === k)?.label || '' }))
      );
    } else {
      subs = (SUB_THEMES[mainKey] || []).map(s => ({ ...s, _group: '' }));
    }

    const step2Title = document.querySelector('#step2 .step-title');
    const step2Desc = document.querySelector('#step2 .step-desc');
    if (step2Title) step2Title.textContent = mainKey === 'more' ? 'Lĩnh Vực Khác' : `Lĩnh Vực ${mainLabel}`;
    if (step2Desc) step2Desc.style.display = 'none';

    subEl.innerHTML = `
      <div class="sub-theme-search" style="padding: 0 0 12px 0;">
        <div style="position: relative;">
          <input type="text" id="subThemeSearch" placeholder="Tìm kiếm nhanh chủ đề..." autocomplete="off" style="width: 100%; padding: 10px 16px 10px 38px; border-radius: 20px; border: 1px solid rgba(201,168,76,0.3); background: rgba(20,9,30,0.5); color: var(--c-gold); font-family: 'Philosopher', sans-serif; font-size: 0.95rem; outline: none; transition: all 0.3s; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);" onfocus="this.style.borderColor='rgba(201,168,76,0.8)'; this.style.boxShadow='0 0 10px rgba(201,168,76,0.2), inset 0 2px 4px rgba(0,0,0,0.2)';" onblur="this.style.borderColor='rgba(201,168,76,0.3)'; this.style.boxShadow='inset 0 2px 4px rgba(0,0,0,0.2)';"/>
          <svg style="position: absolute; left: 12px; top: 11px; color: rgba(201,168,76,0.6);" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
      </div>
      <div class="sub-theme-list">
        ${subs.map(s => `
          <button class="sub-theme-item" data-value="${s.key}" data-search="${(formatGenderText(s.label) + ' ' + formatGenderText(s.desc)).toLowerCase()}" type="button">
            <span class="sti-label">${formatGenderText(s.label)}</span>
            <span class="sti-desc">${s._group ? formatGenderText(s._group) + ' · ' : ''}${formatGenderText(s.desc)}</span>
            <span class="sti-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></span>
          </button>`).join('')}
      </div>`;

    const searchInput = subEl.querySelector('#subThemeSearch');
    if (searchInput) {
      const removeTones = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
      searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase().trim();
        const valNoTones = removeTones(val);
        const items = subEl.querySelectorAll('.sub-theme-item');
        let hasMatch = false;

        items.forEach(item => {
          const text = item.dataset.search || '';
          const match = text.includes(val) || removeTones(text).includes(valNoTones);
          if (match) {
            item.style.display = 'flex';
            hasMatch = true;
          } else {
            item.style.display = 'none';
          }
        });

        let emptyMsg = subEl.querySelector('.sub-theme-empty');
        if (!hasMatch) {
          if (!emptyMsg) {
            emptyMsg = document.createElement('div');
            emptyMsg.className = 'sub-theme-empty';
            emptyMsg.style.cssText = "text-align: center; color: rgba(232, 224, 255, 0.5); padding: 20px 0; font-family: 'Philosopher', serif; font-size: 0.95rem; font-style: italic;";
            emptyMsg.innerHTML = "Không tìm thấy chủ đề phù hợp ✧";
            subEl.querySelector('.sub-theme-list').appendChild(emptyMsg);
          } else {
            emptyMsg.style.display = 'block';
          }
        } else if (emptyMsg) {
          emptyMsg.style.display = 'none';
        }
      });
    }

    // Removed sub-back-btn event listener as per instruction

    subEl.querySelectorAll('.sub-theme-item').forEach(item => {
      item.addEventListener('click', (e) => {
        subEl.querySelectorAll('.sub-theme-item').forEach(i => i.classList.remove('chosen'));
        item.classList.add('chosen');
        _selectedTheme = item.dataset.value;
        window.FX?.ripple(item, e, 'rgba(200,121,255,0.4)');
        if (!isQR) {
          setTimeout(() => goToStep(3, 'forward'), 260);
        }
      });
    });

    // Smooth transition
    gridEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    gridEl.style.opacity = '0';
    gridEl.style.transform = 'scale(0.96)';
    
    setTimeout(() => {
      gridEl.classList.add('hidden');
      gridEl.style.display = '';
      gridEl.style.opacity = '';
      gridEl.style.transform = '';
      
      subEl.classList.remove('hidden');
      subEl.style.display = 'block'; // ensure it's block
      subEl.style.opacity = '0';
      subEl.style.transform = 'translateY(15px)';
      
      // Force reflow
      subEl.offsetHeight; 
      
      subEl.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
      subEl.style.opacity = '1';
      subEl.style.transform = 'translateY(0)';
      
      setTimeout(() => {
         subEl.style.transition = '';
      }, 400);
    }, 200);
  }

  /* ── Skip theme (Bỏ Qua) ─────────────────────────── */
  document.getElementById('btnSkipTheme')?.addEventListener('click', () => {
    _selectedTheme = 'general';
    goToStep(3, 'forward');
  });

  /* ── Gender Dropdown Logic ────────────────────────── */
  const genderWrap = document.getElementById('genderPickerWrap');
  const genderDisplay = document.getElementById('genderDisplay');
  const genderDropdown = document.getElementById('genderDropdown');
  const inputGender = document.getElementById('inputGender');
  const genderDisplayText = document.getElementById('genderDisplayText');

  if (genderDisplay && genderDropdown) {
    genderDisplay.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = genderDropdown.classList.contains('open');
      document.querySelectorAll('.gender-dropdown').forEach(p => p.classList.remove('open'));
      // Close dob panel if it exists
      if (window.DobPicker?.close) window.DobPicker.close();

      if (!isOpen) {
        genderDropdown.classList.add('open');
        genderDisplay.classList.add('active');
      } else {
        genderDisplay.classList.remove('active');
      }
    });

    genderDropdown.querySelectorAll('.gender-opt').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = opt.dataset.val;
        inputGender.value = val;
        genderDisplayText.innerHTML = opt.innerHTML;
        genderWrap.classList.add('has-value');
        genderDropdown.classList.remove('open');
        genderDisplay.classList.remove('active');

        genderDropdown.querySelectorAll('.gender-opt').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      });
    });

    document.addEventListener('click', (e) => {
      if (genderWrap && !genderWrap.contains(e.target)) {
        genderDropdown.classList.remove('open');
        genderDisplay.classList.remove('active');
      }
    });
  }

  /* ── Validation ───────────────────────────────────── */
  function validateStep(n) {
    if (n === 1) {
      const name = document.getElementById('inputName');
      const dob = document.getElementById('inputDob');
      const gen = document.getElementById('inputGender').value;

      let valid = true;
      let nameVal = name.value.trim();

      // Format Name: capitalize first letters
      if (nameVal) {
        nameVal = nameVal.replace(/\s+/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        name.value = nameVal;
      }

      // nameRegex allows purely Vietnamese letters and spaces, nothing else (min 5 chars)
      const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{5,50}$/;
      const isSpamName = (s) => {
        const clean = s.toLowerCase().replace(/\s/g, '');
        if (!clean.length) return false;
        // 4+ consecutive identical chars: aaaa
        if (/(.)\1{3,}/.test(clean)) return true;
        // Single char frequency > 50%
        const freq = {};
        for (const c of clean) freq[c] = (freq[c] || 0) + 1;
        const maxF = Math.max(...Object.values(freq));
        if (clean.length >= 5 && maxF / clean.length > 0.5) return true;
        // Common keyboard smashes
        const smashes = ['asdf', 'qwer', 'zxcv', 'hjkl'];
        if (smashes.some(smash => clean.includes(smash))) return true;
        return false;
      };

      if (!nameVal) {
        name.placeholder = 'Vui lòng nhập tên của bạn...';
        window.FX?.shake(name); window.FX?.glowPulse(name, 'rgba(255,80,80,0.6)');
        valid = false;
      } else if (nameVal.length < 5) {
        name.value = '';
        name.placeholder = 'Tên quá ngắn, vui lòng nhập từ 5 ký tự trở lên...';
        window.FX?.shake(name); window.FX?.glowPulse(name, 'rgba(255,80,80,0.6)');
        valid = false;
      } else if (!nameRegex.test(nameVal)) {
        name.value = '';
        name.placeholder = 'Chỉ nhập chữ cái tiếng Việt, không chứa số/kí tự...';
        window.FX?.shake(name); window.FX?.glowPulse(name, 'rgba(255,80,80,0.6)');
        valid = false;
      } else if (isSpamName(nameVal)) {
        name.value = '';
        name.placeholder = 'Tên không hợp lệ (nghi ngờ nhập sai / spam)...';
        window.FX?.shake(name); window.FX?.glowPulse(name, 'rgba(255,80,80,0.6)');
        valid = false;
      }

      if (!dob.value) {
        const dobDisplay = document.getElementById('dobDisplay');
        if (dobDisplay) {
          window.FX?.shake(dobDisplay);
          dobDisplay.style.borderColor = 'rgba(255,80,80,0.6)';
          dobDisplay.style.boxShadow = '0 0 0 3px rgba(255,80,80,0.15)';
          setTimeout(() => {
            dobDisplay.style.borderColor = '';
            dobDisplay.style.boxShadow = '';
          }, 1200);
        }
        valid = false;
      }
      if (!gen) {
        const genDisplay = document.getElementById('genderDisplay');
        if (genDisplay) {
          window.FX?.shake(genDisplay);
          genDisplay.style.borderColor = 'rgba(255,80,80,0.6)';
          genDisplay.style.boxShadow = '0 0 0 3px rgba(255,80,80,0.15)';
          setTimeout(() => {
            genDisplay.style.borderColor = '';
            genDisplay.style.boxShadow = '';
          }, 1200);
        }
        valid = false;
      }
      return valid;
    }
    if (n === 3) {
      const q = inputQ.value.trim();
      const isCustomTab = !document.getElementById('customQPanel')?.classList.contains('hidden');

      function showInputError(msg) {
        window.FX?.shake(inputQ);
        window.FX?.glowPulse(inputQ, 'rgba(255,80,80,0.6)');
        inputQ.placeholder = msg;
        setTimeout(() => { inputQ.placeholder = ' '; }, 3000);
      }

      function isSpam(s) {
        const clean = s.replace(/\s/g, '');
        if (!clean.length) return false;
        // 5+ consecutive identical chars: aaaaaa, #####, 111111
        if (/(.)\1{4,}/.test(clean)) return true;
        // Single char frequency > 50%
        const freq = {};
        for (const c of clean) freq[c] = (freq[c] || 0) + 1;
        const maxF = Math.max(...Object.values(freq));
        if (maxF / clean.length > 0.5) return true;
        // Very few unique chars (< 25% of length, min 4 unique needed for long strings)
        const unique = Object.keys(freq).length;
        if (clean.length >= 10 && unique / clean.length < 0.25) return true;
        // Only digits or only symbols (no letters at all)
        if (/^[\d\W_]+$/.test(clean)) return true;
        return false;
      }

      if (!q) {
        if (isCustomTab) {
          showInputError('Bạn cần nhập câu hỏi để tiếp tục...');
        } else {
          const grid = document.getElementById('presetQGrid');
          if (grid) window.FX?.shake(grid);
          let hint = document.getElementById('_step3Hint');
          if (!hint) {
            hint = document.createElement('div');
            hint.id = '_step3Hint';
            hint.style.cssText = 'color:rgba(255,110,110,0.9);font-family:"EB Garamond",serif;font-size:0.9rem;text-align:center;margin-top:8px;transition:opacity 0.4s;';
            grid.parentElement?.appendChild(hint);
          }
          hint.textContent = '✦ Vui lòng chọn một câu hỏi để tiếp tục';
          hint.style.opacity = '1';
          setTimeout(() => { hint.style.opacity = '0'; }, 2500);
        }
        return false;
      }
      if (isCustomTab) {
        if (q.length < 10) {
          showInputError(`Câu hỏi cần ít nhất 10 ký tự (hiện ${q.length}/10)...`);
          return false;
        }
        if (isSpam(q)) {
          showInputError('Câu hỏi không hợp lệ – vui lòng đặt câu hỏi thực sự...');
          return false;
        }
      }
    }
    return true;
  }


  /* ── Spread option ripple ─────────────────────────── */
  document.querySelectorAll('.spread-card-opt').forEach(opt => {
    opt.addEventListener('click', (e) => {
      const ui = opt.querySelector('.spread-card-ui');
      window.FX?.ripple(ui, e, 'rgba(200,121,255,0.3)');
      window.FX?.glowPulse(ui, 'rgba(155,48,255,0.5)');
    });
  });

  /* ── Next / Prev delegation ───────────────────────── */
  document.addEventListener('click', (e) => {
    const nextBtn = e.target.closest('.btn-next');
    const prevBtn = e.target.closest('.btn-prev');
    if (nextBtn && nextBtn.closest('#formOverlay')) {
      const next = parseInt(nextBtn.dataset.next);
      if (validateStep(currentStep)) {
        window.FX?.ripple(nextBtn, e, 'rgba(200,121,255,0.4)');

        // Birth Card intercept


        setTimeout(() => goToStep(next, 'forward'), 60);
      }
    }
    if (prevBtn && prevBtn.closest('#formOverlay')) {
      const prev = parseInt(prevBtn.dataset.prev);
      window.FX?.ripple(prevBtn, e, 'rgba(155,48,255,0.3)');

      const subPanel = document.getElementById('subThemePanel');
      const gridPanel = document.getElementById('mainThemeGrid');

      // Intercept back button if currently viewing sub-themes inside step 2
      if (currentStep === 2 && subPanel && !subPanel.classList.contains('hidden')) {
        // Smooth transition back to Main Grid
        subPanel.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        subPanel.style.opacity = '0';
        subPanel.style.transform = 'translateY(15px)';

        setTimeout(() => {
          subPanel.classList.add('hidden');
          subPanel.style.display = '';
          subPanel.style.opacity = '';
          subPanel.style.transform = '';

          if (gridPanel) {
            gridPanel.classList.remove('hidden');
            gridPanel.style.opacity = '0';
            gridPanel.style.transform = 'scale(0.96)';
            
            gridPanel.offsetHeight; // force reflow
            
            gridPanel.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
            gridPanel.style.opacity = '1';
            gridPanel.style.transform = 'scale(1)';
            
            setTimeout(() => { gridPanel.style.transition = ''; }, 400);
          }
        }, 200);

        const stTitle = document.querySelector('#step2 .step-title');
        const stDesc = document.querySelector('#step2 .step-desc');
        if (stTitle) stTitle.textContent = 'Chọn Lĩnh Vực';
        if (stDesc) stDesc.style.display = 'block';
        return; // Do not go back to step 1
      }

      if (prev === 1) {
        subPanel?.classList.add('hidden');
        gridPanel?.classList.remove('hidden');
        const stTitle = document.querySelector('#step2 .step-title');
        const stDesc = document.querySelector('#step2 .step-desc');
        if (stTitle) stTitle.textContent = 'Chọn Lĩnh Vực';
        if (stDesc) stDesc.style.display = 'block';
      }
      setTimeout(() => goToStep(prev, 'backward'), 60);
    }
  });

  /* ── Enter key ────────────────────────────────────── */
  document.getElementById('inputName').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (validateStep(1)) {
        goToStep(2, 'forward');
      }
    }
  });
  inputQ.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.shiftKey)) {
      e.preventDefault(); if (validateStep(3)) goToStep(4, 'forward');
    }
  });

  /* ── Char counter ─────────────────────────────────── */
  if (inputQ && charCount) {
    inputQ.addEventListener('input', () => {
      const len = Math.min(inputQ.value.length, 200);
      if (inputQ.value.length > 200) inputQ.value = inputQ.value.slice(0, 200);
      charCount.textContent = `${len} / 200`;
      if (len < 10) {
        charCount.style.color = 'rgba(255,100,100,0.8)';
      } else if (len > 180) {
        charCount.style.color = 'rgba(255,160,80,0.8)';
      } else {
        charCount.style.color = 'rgba(255,255,255,0.25)';
      }
    });
  }


  /* ── Input focus sparkle ──────────────────────────── */
  document.querySelectorAll('.mystical-input').forEach(inp => {
    inp.addEventListener('focus', () => {
      const rect = inp.getBoundingClientRect();
      window.FX?.burst(rect.left + 20, rect.bottom, 6, 'rgba(155,48,255,0.6)');
    });
  });

  /* ── Preset questions (expanded) ─────────────────── */
  const PRESET_Q = {
    ex: [{
      group: 'Người Yêu Cũ', qs: [
        'Người yêu cũ từng dành cho tôi tình cảm như thế nào?',
        'Hiện tại người yêu cũ còn giữ tình cảm gì với tôi không?',
        'Người yêu cũ nghĩ gì về việc quay lại?',
        'Bản chất và ý nghĩa của mối quan hệ cũ là gì?',
        'Nếu quay lại, mối quan hệ sẽ tiến triển ra sao?',
        'Lời khuyên để tôi đối diện với người yêu cũ?',

        'Dạo này người yêu cũ sống thế nào?',
        'Họ có từng hối hận khi rời xa tôi?',
        'Người yêu cũ có hay theo dõi tôi trên mạng xã hội?',
        'Bao giờ người đó mới hết ảnh hưởng tới tôi?',
        'Tôi có nên xóa hẳn liên lạc với họ?',
        'Bài học lớn nhất từ người này là gì?',
        'Người mới của họ có tốt hơn tôi không?',
        'Họ có đang kể xấu tôi với người khác?',
        'Tôi và họ có duyên làm bạn bè không?',
        'Làm sao để tôi quên hẳn người yêu cũ?',
      ]
    }],
    current_love: [{
      group: 'Người Yêu Hiện Tại', qs: [
        'Người yêu hiện tại dành cho tôi tình cảm thế nào?',
        'Người ấy kỳ vọng gì ở mối quan hệ này?',
        'Người ấy đang suy nghĩ thế nào về tình yêu của chúng tôi?',
        'Thử thách hoặc trở ngại trong mối quan hệ hiện tại là gì?',
        'Lời khuyên để mối quan hệ của chúng tôi bền vững hơn?',
        'Tương lai của mối quan hệ này sẽ đi về đâu?',

        'Hôm nay người yêu tôi đang có tâm trạng gì?',
        'Người ấy có đang giấu tôi chuyện tiền bạc không?',
        'Sắp tới chúng tôi có cãi vã chuyện gì không?',
        'Người ấy có thực sự trân trọng sự hy sinh của tôi?',
        'Làm sao để hâm nóng tình cảm lúc này?',
        'Tôi có đang đòi hỏi quá nhiều ở người yêu?',
        'Lời nói nào dạo này làm tổn thương người ấy?',
        'Chúng tôi có nên đi du lịch xa cùng nhau sắp tới?',
        'Gia đình người ấy đang phản ứng sao về tôi?',
        'Tật xấu nào của tôi làm người ấy mệt mỏi nhất?',
      ]
    }],
    ambiguous: [{
      group: 'Mối Quan Hệ Mập Mờ', qs: [
        'Người này thật sự có cảm xúc gì với tôi?',
        'Họ mong đợi điều gì từ mối quan hệ này?',
        'Trong suy nghĩ của họ, tôi có vị trí thế nào?',
        'Nếu tiến xa hơn, kết quả có tốt đẹp không?',
        'Lời khuyên để tôi ứng xử trong mối quan hệ mập mờ này?',
        'Tôi có nên chủ động làm rõ mối quan hệ không?',

        'Họ có đang \'thả thính\' ai khác ngoài tôi?',
        'Điểm dừng cuối cùng của mối quan hệ này là đâu?',
        'Tôi có đang tự ảo tưởng về vị trí của mình?',
        'Khi nào thì họ mới chịu chủ động tiến tới?',
        'Họ thấy tôi là một lựa chọn an toàn hay ưu tiên?',
        'Tôi có nên giả vờ lạnh nhạt để thử lòng họ?',
        'Điều gì cản trở họ tỏ tình với tôi?',
        'Họ kể gì về tôi với bạn bè của họ?',
        'Tôi nên chấm dứt hay cho họ thêm thời gian?',
        'Tin nhắn gần nhất của tôi họ nghĩ gì?',
      ]
    }],
    crush: [{
      group: 'Crush / Người Thầm Thích', qs: [
        'Crush của tôi là người có tính cách như thế nào?',
        'Người tôi thích có đang để ý đến tôi không?',
        'Giữa tôi và crush có khả năng phát triển tình cảm không?',
        'Lời khuyên để tôi tiến gần hơn đến crush?',
        'Ai đang thầm yêu tôi mà tôi chưa biết?',
        'Tôi có nên tỏ tình hay tiếp tục chờ đợi?',

        'Crush có quan tâm đến ngoại hình của tôi không?',
        'Hôm nay crush có vô tình nghĩ đến tôi?',
        'Crush có đang thích thầm một ai khác?',
        'Làm sao để tôi bắt chuyện thật tự nhiên?',
        'Nếu tôi chủ động rủ đi cafe, crush có đồng ý?',
        'Ấn tượng đầu tiên của crush về tôi là gì?',
        'Crush có nhận ra tình cảm của tôi không?',
        'Tôi có phải gu người yêu của crush?',
        'Cơ hội để chúng tôi thành đôi trong 1 tháng tới?',
        'Tôi nên từ bỏ hay tiếp tục theo đuổi?',
      ]
    }],
    future_love: [{
      group: 'Người Yêu Tương Lai', qs: [
        'Tôi có thể gặp người mình thích trong khoảng thời gian nào?',
        'Người yêu tương lai của tôi có đặc điểm ra sao?',
        'Người yêu tương lai sẽ đối xử với tôi như thế nào?',
        'Tổng quan tình yêu giữa tôi và người yêu tương lai thế nào?',
        'Khi nào tôi sẽ kết hôn?',
        'Người chồng/vợ tương lai của tôi có thể làm nghề gì?',
        'Tôi cần chuẩn bị gì để sãn sàng đón nhận tình yêu mới?',

        'Người yêu tương lai của tôi đang ở đâu?',
        'Đặc điểm nhận dạng của người yêu sắp tới?',
        'Chúng tôi sẽ gặp nhau trong hoàn cảnh nào?',
        'Tình yêu mới sẽ trưởng thành hay trẻ con?',
        'Người đó đến để mang lại bài học gì cho tôi?',
        'Sắp tới tôi có vô tình va phải \'red flag\' nào?',
        'Vết thương cũ có cản trở tình yêu mới của tôi?',
        'Yếu tố ngoại hình người yêu tương lai thế nào?',
        'Tình mới sẽ đến nhanh hay phải chờ rất lâu?',
        'Tôi đang tỏa ra năng lượng thu hút đối tượng nào?',
      ]
    }],
    someone: [{
      group: 'Người Ấy', qs: [
        'Người ấy có sợ mất tôi không?',
        'Người ấy có nghĩ đến việc quay lại không?',
        'Người ấy có nhớ tôi không?',
        'Tôi và người ấy có thể đi đến kết thúc hạnh phúc không?',
        'Người ấy đang giấu tôi điều gì?',
        'Người ấy thật sự cảm thấy gì về tôi lúc này?',

        'Người ấy vừa trải qua chuyện gì buồn không?',
        'Họ có đang cảm thấy áp lực vì tôi?',
        'Nụ cười hôm nay của họ là thật hay giả vờ?',
        'Họ đang hy vọng tôi làm gì cho họ?',
        'Lời hứa gần đây của người ấy có thực hiện được?',
        'Tôi có nên tin tưởng người này 100%?',
        'Họ đánh giá cao nhất điều gì ở tôi?',
        'Điều tôi vừa làm họ có để tâm không?',
        'Có ai đang tác động xấu đến suy nghĩ của họ?',
        'Điểm yếu lớn nhất của người ấy là gì?',
      ]
    }],
    marriage: [{
      group: 'Hôn Nhân', qs: [
        'Nguyên nhân nào khiến cuộc hôn nhân của tôi gặp khó khăn?',
        'Điều gì đang ảnh hưởng mạnh đến mối quan hệ vợ chồng của tôi?',
        'Có thể cứu vãn hôn nhân của tôi bằng cách nào?',
        'Nửa kia của tôi mong muốn điều gì ở tôi?',
        'Hôn nhân của tôi sẽ đi đến đâu nếu tiếp tục như hiện tại?',
        'Tôi có nên tiếp tục hay buông tay mối hôn nhân này?',

        'Cơm áo gạo tiền có đang bào mòn tình cảm của chúng tôi?',
        'Gia đình nội ngoại có đang tác động xấu đến vợ chồng tôi?',
        'Chồng/Vợ tôi có đang thay lòng đổi dạ?',
        'Làm sao để vợ chồng bớt khắc khẩu việc vặt?',
        'Trách nhiệm nuôi con có đang làm chúng tôi xa cách?',
        'Người ấy có đang chịu áp lực ngầm ở chỗ làm?',
        'Bao lâu nữa tài chính gia đình mới dễ thở hơn?',
        'Chúng tôi có thiếu sự lãng mạn như thuở mới yêu?',
        'Khoản tiền riêng của nửa kia đang được dùng ra sao?',
        'Điều gì níu giữ cuộc hôn nhân này mạnh nhất?',
      ]
    }],
    conflict: [{
      group: 'Giải Quyết Xung Đột', qs: [
        'Tôi có nên là người chủ động hòa giải trước không?',
        'Nếu nhìn từ góc nhìn của người kia, tôi sẽ thấy điều gì?',
        'Tôi có nên tha thứ cho người gây xung đột với mình không?',
        'Kết quả sau cùng của xung đột gần đây sẽ ra sao?',
        'Điều gì thực sự gây ra mâu thuẫn này?',

        'Sự nóng giận hôm qua của tôi để lại hậu quả gì?',
        'Bao giờ thì người kia mới chịu chủ động xin lỗi?',
        'Tôi có đang bảo thủ quá mức trong chuyện này?',
        'Người kia có hiểu được uất ức của tôi không?',
        'Nếu tôi im lặng thêm, chuyện sẽ tốt hay xấu đi?',
        'Xung đột này có phá vỡ hoàn toàn mối quan hệ?',
        'Nguyên nhân sâu xa của mâu thuẫn này là do đâu?',
        'Đóng vai người nhún nhường có khiến tôi bị thiệt?',
        'Sự hiểu lầm lớn nhất hiện tại ở đây là gì?',
        'Hòa giải lúc này có quá sớm không?',
      ]
    }],
    breakup: [{
      group: 'Chia Tay & Hàn Gắn', qs: [
        'Tôi có nên cố gắng hàn gắn sau khi chia tay không?',
        'Lý do ẩn khuất nào khiến chúng tôi chia tay?',
        'Người kia có hối hận và muốn quay lại không?',
        'Nếu tôi tha thứ, mối quan hệ sẽ đi về đâu?',
        'Tôi cần chữa lành điều gì trong bản thân sau cuộc chia tay này?',
        'Tôi nên đối mặt với người kia hay giữ khoảng cách?',

        'Chia tay rồi, quyết định này của tôi có đúng không?',
        'Họ đang buồn đau hay cảm thấy nhẹ nhõm?',
        'Sẽ mất bao lâu để tôi ngừng khóc vì chuyện này?',
        'Có nguy cơ người kia tìm cách trả thù tôi không?',
        'Những kỷ vật cũ tôi có nên vứt bỏ hết?',
        'Họ có đang tìm hiểu ngay người mới để lấp chỗ trống?',
        'Việc tôi yếu lòng nhắn tin lại có phải sai lầm?',
        'Đêm nay họ có trằn trọc mất ngủ giống tôi?',
        'Làm sao cắt đứt sợi dây liên kết năng lượng với họ?',
        'Tôi có đang lý tưởng hóa hình ảnh của họ?',
      ]
    }],
    long_distance: [{
      group: 'Yêu Xa', qs: [
        'Mối tình xa cách của tôi có bền vững không?',
        'Người yêu xa có thực sự chung thủy với tôi không?',
        'Chúng tôi có cơ hội thu rút khoảng cách địa lý không?',
        'Thách thức lớn nhất trong mối tình xa này là gì?',
        'Tôi có nên tiếp tục chờ đợi hay nên buông tay?',

        'Hôm nay khoảng cách địa lý có làm họ nản lòng?',
        'Làm sao để xoa dịu nỗi cô đơn của yêu xa lúc này?',
        'Người xung quanh họ có ai đang gạ gẫm thả thính?',
        'Họ có trung thực về lịch trình sinh hoạt không?',
        'Tần suất liên lạc hiện tại là quá ít hay quá nhiều?',
        'Chuyến đi thăm nhau sắp tới có suôn sẻ không?',
        'Lời mệt mỏi hôm qua của họ là nói thật hay dỗi?',
        'Chúng tôi có đang đi chung một mục tiêu tương lai?',
        'Thói quen nào giúp chúng tôi gắn kết hơn từ xa?',
        'Yêu xa đang lấy đi của tôi cơ hội gì?',
      ]
    }],
    jealousy: [{
      group: 'Người Thứ Ba / Ghen Tuông', qs: [
        'Người yêu có đang che giấu mối quan hệ nào với tôi không?',
        'Liệu có người thứ ba nào đang cố tình xâm phạm mối quan hệ của tôi?',
        'Người ấy có yêu tôi thật lòng không?',
        'Cảm giác ghen tuông của tôi có căn cứ không?',
        'Tôi nên xử lý tình huống này như thế nào?',

        'Trực giác báo có người thứ 3, điều này đúng không?',
        'Đồng nghiệp nữ/nam của họ có vượt quá giới hạn?',
        'Tôi ghen bóng ghen gió hay thực sự có vấn đề?',
        'Sự kiểm soát của tôi có đang đẩy họ ra xa?',
        'Người thứ ba đó có tốt hơn tôi không?',
        'Họ có đang so sánh tôi với người cũ của họ?',
        'Làm sao để tôi lấy lại sự tự tin và bớt đa nghi?',
        'Tin nhắn lạ tối qua là của ai?',
        'Họ có giấu diếm một mối quan hệ online nào không?',
        'Lòng chung thủy của họ ở mức độ nào?',
      ]
    }],
    self_love: [{
      group: 'Yêu Bản Thân', qs: [
        'Tôi đang đối xử với bản thân như thế nào?',
        'Vết thương nội tâm nào tôi cần chữa lành đầu tiên?',
        'Điều gì đang cản tôi yêu chính mình?',
        'Tôi có đang đặt ra giới hạn rõ ràng trong các mối quan hệ không?',
        'Tôi cần buông bỏ điều gì để sống tại thời điểm hiện tại?',

        'Hôm nay tôi đã ép bản thân quá mức chưa?',
        'Sở thích nào tôi bỏ quên quá lâu rồi?',
        'Dạo này tôi tự nói những lời tiêu cực gì với mình?',
        'Tại sao tôi lại hay cảm thấy tự ti khi gặp người giỏi?',
        'Tôi cần sắm sửa gì cho bản thân ngay lúc này?',
        'Nỗi sợ nào đang ngăn tôi sống cuộc đời hạnh phúc?',
        'Tôi có đang hy sinh mù quáng vì người khác?',
        'Làm sao để bao dung hơn với những khuyết điểm của tôi?',
        'Tối nay tôi nên làm gì để nuông chiều tâm hồn?',
        'Năng lượng của tôi tuần này là màu gì?',
      ]
    }],
    career: [{
      group: 'Sự Nghiệp / Công Việc', qs: [
        'Tình hình công việc hiện tại của tôi có tốt không?',
        'Công việc trong 3 tháng tới của tôi sẽ như thế nào?',
        'Tôi có nên chuyển chỗ làm không?',
        'Môi trường làm việc mới có đặc điểm thế nào?',
        'Đồng nghiệp trong môi trường làm việc mới sẽ ra sao?',
        'Năng lực nào của tôi đang chưa được khai thác đúng chỗ?',

        'Nhiệm vụ hôm nay cấp trên giao có rủi ro gì không?',
        'Kết quả dự án tôi đang làm sẽ được đánh giá ra sao?',
        'Tôi có phù hợp với văn hóa của công ty hiện tại?',
        'Thái độ làm việc dạo này của tôi có bị chê trách?',
        'Năm nay tôi có cơ hội được tăng bậc chức danh?',
        'Đâu là kỹ năng tôi còn yếu nhất trong công việc?',
        'Có ai đang ngấm ngầm cướp công lao của tôi?',
        'Công việc hiện tại có đang bào mòn tuổi trẻ của tôi?',
        'Làm sao để tìm thấy lại niềm vui khi đi làm?',
        'Sếp có nhìn nhận đúng năng lực thực sự của tôi?',
      ]
    }],
    job_search: [{
      group: 'Xin Việc Làm', qs: [
        'Trong 3 tháng tới tôi có tìm được công việc phù hợp không?',
        'Những khó khăn tôi sẽ gặp khi đi xin việc là gì?',
        'Điểm mạnh của tôi trong lần ứng tuyển này?',
        'Điểm yếu của tôi trong lần ứng tuyển này?',
        'Lĩnh vực nào phù hợp nhất với tôi để ứng tuyển?',

        'Tháng tới tôi có gọi đi làm ở nơi tốt không?',
        'Lý do rớt phỏng vấn công ty vừa rồi là gì?',
        'Hồ sơ của tôi đang tạo ấn tượng mạnh hay nhạt nhòa?',
        'Tình hình thị trường việc làm lĩnh vực tôi ra sao?',
        'Tôi có đang yêu cầu mức lương quá cao?',
        'Vận may tìm việc của tôi phụ thuộc vào yếu tố nào?',
        'Nên nhờ người quen giới thiệu hay tự nộp mạng?',
        'Sự tự ti đang phá hỏng cơ hội ưng ý nào của tôi?',
        'Công việc tạm thời lúc này có ổn không?',
        'Nhà tuyển dụng tiềm năng đang mong chờ điều gì ở tôi?',
      ]
    }],
    promotion: [{
      group: 'Thăng Tiến & Tăng Lương', qs: [
        'Tôi có cơ hội thăng chức trong thời gian tới không?',
        'Điều gì đang giữ tôi lại khỏi vị trí cao hơn?',
        'Tôi nên làm gì để nổi bật hơn trong mắt quản lý?',
        'Cấp trên hiện tại nhìn tôi như thế nào?',
        'Lộ trình sự nghiệp tốt nhất cho tôi lúc này là gì?',

        'Đợt đánh giá nhân sự tới tôi có tên trong danh sách loại bỏ không?',
        'Đối thủ cạnh tranh vị trí với tôi mạnh cỡ nào?',
        'Tôi có bị thiệt thòi vì ít nịnh bợ sếp không?',
        'Cân nhắc nhảy việc hay chờ tăng lương ở lại?',
        'Lời hứa thăng chức của cấp trên có đáng tin?',
        'Tôi thiếu chứng chỉ gì để lên chức quản lý?',
        'Danh tiếng của tôi ở công ty hiện tại ra sao?',
        'Tiếp nhận nhiệm vụ khó dự án này có mang lại quả ngọt?',
        'Quyền lực mới nếu được thăng chức sẽ là gánh nặng?',
        'Sếp của sếp có ấn tượng gì về tôi?',
      ]
    }],
    business: [{
      group: 'Kinh Doanh / Khởi Nghiệp', qs: [
        'Dự án kinh doanh của tôi có tiềm năng không?',
        'Thách thức lớn nhất trong kế hoạch khởi nghiệp của tôi là gì?',
        'Tôi nên tập trung vào lĩnh vực nào để kiến tiền hiệu quả?',
        'Đối tác kinh doanh hiện tại có phù hợp với tôi không?',
        'Năng lượng nào tôi cần mang vào việc kinh doanh?',
        'Thời điểm nào là tốt để ra mắt sản phẩm / dịch vụ?',

        'Doanh thu cửa hàng tuần/tháng này sẽ thế nào?',
        'Chiến dịch marketing tôi đang chạy có hiệu quả không?',
        'Khách hàng mục tiêu có đang hài lòng với dịch vụ?',
        'Người hợp tác chung có đang gian lận tài chính?',
        'Tôi tung ra sản phẩm mới lúc này có vội vàng?',
        'Rủi ro lớn nhất của dòng tiền công ty lúc này là gì?',
        'Có nhân viên nào đang làm hỏng uy tín thương hiệu?',
        'Mở rộng mặt bằng hay tối ưu bán online thời điểm này?',
        'Tôi có đang quá mạo hiểm trong quyết định đầu tư?',
        'Vận khí cửa hàng đang bị chặn bởi yếu tố nào?',
      ]
    }],
    colleague: [{
      group: 'Mối Quan Hệ Đồng Nghiệp', qs: [
        'Đồng nghiệp đang đối xử với tôi ra sao?',
        'Có ai đồng nghiệp đang muốn hại tôi không?',
        'Tôi có nên tin tưởng đồng nghiệp/sếp hiện tại không?',
        'Cách đồng nghiệp đánh giá tôi là gì?',
        'Tôi nên ứng xử như thế nào với môi trường làm việc phức tạp này?',

        'Người ngồi cạnh có đang dò xét tôi không?',
        'Tôi có đắc tội với ai trong phòng ban hôm qua?',
        'Làm sao để từ chối khối lượng việc đồng nghiệp đẩy sang?',
        'Có tin đồn nào về tôi đang lan truyền ở văn phòng?',
        'Tôi nên phe phái với ai hay giữ thái độ trung lập?',
        'Đồng nghiệp mới vào có tính cách chân thật không?',
        'Họ tươi cười với tôi nhưng sau lưng tính toán gì?',
        'Sự hợp tác nhóm đợt này có gâyức chế không?',
        'Tôi có đang tỏa ra sự kiêu ngạo khó gần?',
        'Bí mật tôi kể cho họ có bị lộ ra ngoài?',
      ]
    }],
    career_change: [{
      group: 'Chuyển Nghề', qs: [
        'Tôi có nên từ bỏ công việc hiện tại không?',
        'Hướng đi nào phù hợp với năng lực và đam mê của tôi?',
        'Việc chuyển sang ngành mới có mang lại hạnh phúc không?',
        'Rủi ro lớn nhất nếu tôi đổi hướng nghề nghiệp là gì?',
        'Lời khuyên cho tôi khi chuẩn bị bước ra khỏi vùng an toàn?',

        'Bao giờ là thời điểm chín muồi để xin nghỉ việc?',
        'Ngành mới tôi đang hướng tới có mang lại tiền bạc tốt hơn?',
        'Thay đổi công việc lúc này có là ném tiền qua cửa sổ?',
        'Gia đình sẽ ủng hộ quyết định rẽ ngang của tôi chứ?',
        'Sự ảo tưởng nào tôi đang mắc phải về nghề mới?',
        'Điều gì ở ngành cũ còn níu kéo bước chân tôi?',
        'Khoảng thời gian trống việc bao lâu thì tôi chịu được?',
        'Đam mê có đủ nuôi sống tôi thay vì công việc ổn định?',
        'Kỹ năng cũ có trợ giúp gì cho công việc mới này?',
        'Sự liều lĩnh này có được Đấng bảo trợ ủng hộ?',
      ]
    }],
    freelance: [{
      group: 'Freelance / Làm Việc Tự Do', qs: [
        'Làm freelance có phù hợp với tôi thời điểm này không?',
        'Tôi có thể kiếm sống ổn định bằng công việc tự do không?',
        'Lĩnh vực nào có thể mang lại thu nhập tốt cho tôi khi làm tự do?',
        'Điểm yếu nào của tôi cần cải thiện khi làm việc độc lập?',

        'Khách hàng này có kỳ kèo trả giá khó chịu không?',
        'Deadline bủa vây, tôi có hoàn thành nổi tuần này?',
        'Bao giờ tôi mới tìm được một đối tác dài hạn?',
        'Làm tự do có khiến tôi cách ly với xã hội quá mức?',
        'Có rủi ro không được thanh toán trong hợp đồng này?',
        'Tôi có đang làm việc với giá quá rẻ mạt?',
        'Tôi cần xây dựng thương hiệu cá nhân ở kênh nào?',
        'Kỷ luật bản thân của tôi đang báo động đỏ ở đâu?',
        'Làm sao để lấy lại cảm hứng sáng tạo bị nghẽn?',
        'Sự cô đơn trong công việc tự do này có đáng giá?',
      ]
    }],
    interview: [{
      group: 'Phỏng Vấn Việc Làm', qs: [
        'Buổi phỏng vấn sắp tới của tôi có thành công không?',
        'Diện mạo và cách trình bày nào giúp tôi gây ấn tượng?',
        'Điểm yếu nào có thể làm tôi mất điểm trong mắt nhà tuyển dụng?',
        'Môi trường làm việc mới này có phù hợp với tôi không?',
        'Lời khuyên trước buổi phỏng vấn quan trọng này?',

        'Người phỏng vấn trực tiếp tôi tính cách ra sao?',
        'Họ đánh xoáy vào điểm yếu nào của tôi?',
        'Kỳ vọng thu nhập thực tế họ có thể trả là bao nhiêu?',
        'Buổi phỏng vấn qua online hay gặp trực tiếp sẽ tốt hơn?',
        'Sự căng thẳng đang tước đi của tôi sự tự tin nào?',
        'Lời khuyên về trang phục cho buổi gặp này?',
        'Tôi có cần nói dối chút về kinh nghiệm để đỗ?',
        'Đằng sau công việc tuyển dụng kia có uẩn khúc gì?',
        'Khoảng thời gian chờ kết quả tôi nên làm gì?',
        'Đây có phải là \'công ty ma\' lừa đảo không?',
      ]
    }],
    finance: [{
      group: 'Tài Chính', qs: [
        'Cơ hội tài chính nào đang đến với tôi?',
        'Tình hình tài chính của tôi trong 3 tháng tới thế nào?',
        'Mục tiêu tài chính hiện tại có khả năng đạt được không?',
        'Trở ngại tài chính lớn nhất của tôi hiện tại là gì?',
        'Làm sao để chi tiêu hợp lý hơn?',

        'Dòng tiền vào tài khoản tháng này có bị tắc nghẽn?',
        'Tại sao tôi làm nhiều mà tiền không thấy đâu?',
        'Ví tiền của tôi có đang thất thoát bởi những khoản vụn vặt?',
        'Kế hoạch tài chính cá nhân tôi đang mắc sai lầm gì?',
        'Tôi có đang sống xa hoa so với thu nhập thật?',
        'Việc tôi mua sắm món đồ lớn sắp tới có ổn không?',
        'Nguồn tiền bất ngờ nào sắp xuất hiện?',
        'Làm sao để tâm trí lúc nào cũng thấy giàu có?',
        'Áp lực đồng tiền có đang làm hỏng các mối quan hệ?',
        'Sự phóng khoáng hôm nay của tôi có để lại hậu quả?',
      ]
    }],
    investment: [{
      group: 'Đầu Tư & Chứng Khoán', qs: [
        'Kênh đầu tư nào phù hợp với tôi nhất hiện tại?',
        'Dự án/cổ phiếu tôi đáng cân nhắc có nên đầu tư không?',
        'Dự án tiền ảo tôi đáng cân nhắc có nên đầu tư không?',
        'Rủi ro nào tôi cần cảnh giác khi đầu tư?',
        'Thời điểm nào là tốt để tôi bước vào thị trường?',
        'Điểm mạnh của tôi với tư cách nhà đầu tư là gì?',

        'Giá trị cổ phiếu/dự án tôi ôm có khởi sắc trong tuần?',
        'Thông tin \'phím hàng\' tôi nhận được có đáng tin?',
        'Thị trường đang chuẩn bị cho đợt sập hay bay cao?',
        'Sự nóng vội có xui tôi cắt lỗ sai thời điểm?',
        'Có phải dự án tôi định ném tiền vào là lừa đảo?',
        'Trực giác của tôi về kênh đầu tư này đang báo hiệu gì?',
        'Phân bổ vốn của tôi hiện tại đã an toàn chưa?',
        'Lời hứa hẹn lợi nhuận kép kia có sự thật bao nhiêu %?',
        'Điều gì che mắt khiến tôi lạc quan thái quá về khoản tiền này?',
        'Hãy khuyên tôi 1 điều về tham vọng làm giàu nhanh.',
      ]
    }],
    debt: [{
      group: 'Nợ Nần & Tài Chính', qs: [
        'Tôi có thể thoát khỏi tình trạng nợ nần trong thời gian này không?',
        'Năng lượng nào đang cản tôi thoát khỏi nợ?',
        'Tôi nên ưu tiên trả khoản nợ nào trước?',
        'Bài học tài chính tôi cần học từ tình huống này là gì?',

        'Khoản nợ tôi đang mang bao giờ mới vơi đi?',
        'Người vay tôi liệu bao giờ mới chịu hoàn tiền?',
        'Có nên mở mồm hỏi mượn thêm đáo hạn?',
        'Ám ảnh nợ nần đang hút tạn sinh lực của tôi?',
        'Lời hứa trả tiền của bạn tôi có thành hiện thực?',
        'Làm sao để gia đình không biết về khoản nợ này?',
        'Sự siết nợ có gõ cửa vào tháng tới?',
        'Đâu là giải pháp bất ngờ để giải phóng gánh nặng này?',
        'Bài học cốt lõi từ sai lầm chi tiêu gây nợ là gì?',
        'Phải chăng tôi thường gánh nợ thay cho người khác?',
      ]
    }],
    savings: [{
      group: 'Tiết Kiệm & Tích Lũy', qs: [
        'Tôi có đạt được mục tiêu tiết kiệm trong năm nay không?',
        'Tôi nên thay đổi thói quen chi tiêu như thế nào?',
        'Nguồn thu nhập mới nào có thể xuất hiện với tôi?',
        'Tôi đang lãng phí năng lượng và tiền bạc vào đâu?',

        'Việc trích tiền tiết kiệm tháng này có trôi chảy?',
        'Sổ tiết kiệm của tôi bao giờ mới đạt con số kỳ vọng?',
        'Có khoản phát sinh đột xuất nào phá vỡ quỹ dự phòng?',
        'Tôi có quá tằn tiện kham khổ với bản thân không?',
        'Nên gửi ngân hàng hay gom mua vàng thời điểm này?',
        'Sự bất an về tương lai khiến tôi tích cóp quá đà?',
        'Động lực nào giúp tôi nuôi heo đất không bỏ cuộc?',
        'Làm sao thoát khỏi cạm bẫy \'mua sắm xả stress\'?',
        'Ví tiền của tôi có đắp chăn an toàn trong năm nay?',
        'Sự kiên nhẫn này cuối cùng mang lại phúc báu gì?',
      ]
    }],
    luck_money: [{
      group: 'Lộc Tài & Vận May', qs: [
        'Tài lộc của tôi trong tháng này thế nào?',
        'May mắn nào sắp đến với tôi?',
        'Tôi có nên đánh số, xổ số vào thời gian này không?',
        'Điều gì đang cản trở luồng tiền chảy vào cuộc đời tôi?',
        'Hướng nào giúp tôi tài lộc tốt nhất?',

        'Ngày mai ra đường tôi có gặp lộc ăn uống không?',
        'Tháng này vận may trúng số tử vi thế nào?',
        'Có sếp/khách hàng nào định lì xì boa cho tôi?',
        'Cửa tài lộc từ đất đai nhà cửa đang mở hay đóng?',
        'Đấng thiêng liêng có đang gửi tôi tín hiệu làm giàu?',
        'Điềm báo tâm linh nào hôm qua liên quan tới tiền?',
        'Có người ở xa chuẩn bị gửi quà/tiền về cho tôi?',
        'Sự hào phóng gần đây của tôi thu hút lộc gì về?',
        'Ngày mai có tiền rơi trúng đầu hay tôi lại đánh rơi đồ?',
        'Năng lượng may mắn hiện tại của tôi được chấm mấy điểm?',
      ]
    }],
    health: [{
      group: 'Sức Khỏe', qs: [
        'Tình hình sức khỏe sắp tới của tôi thế nào?',
        'Điều gì đang là trở ngại đối với sức khỏe của tôi?',
        'Tôi nên thay đổi lối sống hiện tại ra sao?',
        'Tôi đang bỏ qua vấn đề gì liên quan đến sức khỏe?',
        'Tôi nên làm gì để tăng cường năng lượng và thể chất?',

        'Dấu hiệu mệt mỏi vài ngày nay là do làm việc hay bệnh?',
        'Giấc ngủ của tôi đang cần điều chỉnh ở điểm nào?',
        'Dạ dày hay hệ tiêu hóa của tôi đang lên tiếng gì?',
        'Thời tiết chuyển mùa ảnh hưởng ra sao tới cơ thể?',
        'Bệnh cũ có nguy cơ tái phát trong tuần sau?',
        'Thuốc hay liệu trình tôi đang dùng có thực sự tốt?',
        'Hãy nhắc tôi uống nước nghỉ ngơi bằng 1 thông điệp.',
        'Tôi có đang dùng quá nhiều caffeine hay đường?',
        'Thay đổi thời gian sinh hoạt lúc này lợi hay hại?',
        'Mắt và cột sống của tôi đang biểu tình như thế nào?',
      ]
    }],
    mental: [{
      group: 'Sức Khỏe Tâm Thần', qs: [
        'Cảm xúc nào đang ảnh hưởng tiêu cực đến cuộc sống của tôi?',
        'Tôi có đang ở trong trạng thái kiệt sức không?',
        'Vết thương tâm lý nào tôi chưa đối mặt?',
        'Tôi cần làm gì để bảo vệ sức khỏe tâm thần?',
        'Lo âu hay sợ hãi nào đang khiến tôi không tiến về phía trước?',
        'Nguồn hạnh phúc đích thực của tôi là gì?',

        'Sự buồn chán vô cớ hôm nay đến từ nguyên nhân sâu xa nào?',
        'Tôi có đang kìm nén tiếng khóc bên trong quá lâu?',
        'Cảm giác trống rỗng này làm sao để thoát ra?',
        'Mạng xã hội đang làm tâm trí tôi ô nhiễm ra sao?',
        'Có phải tôi tự trách mình quá đáng về lỗi lầm cũ?',
        'Tôi cần cách ly khỏi người nào để bảo vệ tinh thần?',
        'Sự tổn thương tâm lý lúc nhỏ ảnh hưởng gì đến hiện tại?',
        'Câu thần chú nào tôi nên nhẩm trong đầu lúc này?',
        'Làm sao ngăn chặn các luồng suy nghĩ tiêu cực chồng chéo?',
        'Đóng vai nạn nhân có đang nuôi dưỡng tâm tối của tôi?',
      ]
    }],
    energy: [{
      group: 'Năng Lượng & Chakra', qs: [
        'Chakra nào của tôi đang mất cân bằng?',
        'Năng lượng nào tôi cần tẩy rửa và giải phóng?',
        'Tôi có đang chịu ảnh hưởng của năng lượng tiêu cực từ người khác không?',
        'Phương pháp thực hành nào giúp tôi cân bằng cơ thể và tâm trí?',
        'Tôi nên hướng năng lượng của mình vào đâu thời điểm này?',

        'Ngôi nhà tôi đang sống năng lượng có nặng nề u ám?',
        'Tiếp xúc với người đó xong tôi thấy cạn kiệt, vì sao?',
        'Có linh hồn hay thực thể nào đang quanh quẩn theo tôi?',
        'Aura (hào quang) của tôi hôm nay hiện lên màu gì?',
        'Tắm muối lá có giúp tôi xả xui lúc này không?',
        'Luân xa tim của tôi đang tắc nghẽn điều gì?',
        'Cây cối thú cưng định cảnh báo tôi chuyển biến gì?',
        'Việc tôi hấp thụ năng lượng tiêu cực từ đám đông là sao?',
        'Sức mạnh trực giác của tôi trong 3 ngày tới?',
        'Đồ thạch anh/phong thủy tôi đeo có đang phát huy tác dụng?',
      ]
    }],
    family: [{
      group: 'Gia Đình', qs: [
        'Thời gian tới gia đình tôi có gặp khó khăn gì không?',
        'Các mối quan hệ trong gia đình tôi sẽ diễn biến ra sao?',
        'Tôi nên làm gì để cải thiện mối quan hệ với gia đình?',
        'Lời khuyên chung cho gia đình tôi trong thời gian tới?',
        'Thành viên gia đình nào đang cần tôi quan tâm nhiều hơn?',

        'Mâu thuẫn giữa cha mẹ tôi thời gian này bao giờ dứt?',
        'Con cái/Anh chị em đang che giấu tôi chuyện rắc rối gì?',
        'Tiếng nói của tôi trong gia đình có được tôn trọng?',
        'Việc dọn ra ở riêng lúc này có thuận lợi không?',
        'Gánh nặng nội ngoại cản trở cuộc sống riêng của tôi ra sao?',
        'Bữa cơm chung gia đình sắp tới có sóng gió gì?',
        'Sự so sánh của bố mẹ làm tôi tổn thương, sao họ không hiểu?',
        'Làm sao gỡ bỏ những định kiến bảo thủ trong nhà?',
        'Họ hàng xa có ai rắp tâm xúi giục gia đình tôi tranh cãi?',
        'Phúc đức tổ tiên có đang che chở gia đạo bình an?',
      ]
    }],
    diet: [{
      group: 'Ăn Uống & Chăm Sóc Bản Thân', qs: [
        'Lối sống của tôi hiện tại có ảnh hưởng xấu đến sức khỏe không?',
        'Tôi nên thay đổi thói quen nào để cải thiện sức khỏe?',
        'Điều nào cổ vũ tôi để duy trì thói quen lành mạnh hơn?',
        'Tôi đang bỏ qua yếu tố nào nhưng quan trọng với sức khỏe?',

        'Đồ ăn hôm nay tôi nạp vào có gây hại trực tiếp cơ thể?',
        'Tại sao tôi mãi không giảm/tăng cân được?',
        'Có phải tôi thường ăn uống vì căng thẳng tâm lý?',
        'Thói quen ăn đêm đang lấy đi của tôi bao nhiêu sinh khí?',
        'Thực phẩm chức năng này thực chất chỉ là ảo tưởng?',
        'Cơ thể đang \'kêu gào\' thiếu vitamin gì?',
        'Làm sao để thiết lập lại thói quen nấu nướng tại nhà?',
        'Đợt nhịn ăn thanh lọc săp tới có nguy hiểm không?',
        'Bạn nhậu nhẹt có đang xúi giục tôi phá vỡ kỷ luật?',
        'Da dẻ và tóc tôi phản ánh đường tiêu hóa tội tệ ra sao?',
      ]
    }],
    study: [{
      group: 'Học Tập', qs: [
        'Tổng quan việc học tập của tôi hiện tại ra sao?',
        'Kết quả học tập của tôi trong 3 tháng tới thế nào?',
        'Kết quả học tập của tôi trong năm nay thế nào?',
        'Tôi có đạt kết quả tốt trong kỳ thi sắp tới không?',
        'Lời khuyên quan trọng về học tập thời gian tới?',
        'Tôi cần thay đổi phương pháp học như thế nào?',
        'Ngành học chuyên môn nào phù hợp nhất với tôi?',

        'Kỳ học này tôi có bị thầy cô đánh trượt môn nào?',
        'Điểm số bài kiểm tra vừa xong có như mong đợi?',
        'Tôi có qua môn này suôn sẻ mà không cần học tủ?',
        'Bài luận nhóm có người nào lười biếng phó mặc cho tôi?',
        'Cơn lười biếng hôm nay bao giờ mới dứt?',
        'Focus vào môn học này có tương lai hơn môn kia?',
        'Cảm giác học sai ngành này là do chán hay do không hợp?',
        'Người hướng dẫn luận văn/đồ án có gây khó dễ cho tôi?',
        'Tôi có vượt qua kỳ thi sát hạch chứng chỉ tuần tới?',
        'Môi trường lớp học mới có vẻ kỳ thị hay thân thiện với tôi?',
      ]
    }],
    study_abroad: [{
      group: 'Du Học', qs: [
        'Tôi có thực sự phù hợp để đi du học không?',
        'Cuộc sống của tôi khi đi du học sẽ như thế nào?',
        'Những khó khăn nào có thể xảy ra khi đi du học?',
        'Lời khuyên dành cho tôi khi chuẩn bị du học?',
        'Đất nước nào phù hợp nhất với tôi để du học?',

        'Visa hoặc giấy tờ du học của tôi có trục trặc phút cuối?',
        'Việc thích nghi văn hóa ở nước đó có trầm cảm như tôi nghĩ?',
        'Tài chính du học có làm bố mẹ kiệt quệ?',
        'Tôi có kết bạn được với người bản xứ trên đất khách?',
        'Rời đi bây giờ có phải bỏ lỡ người quan trọng ở nhà?',
        'Môi trường học tập bên đó có ưu đãi hơn cho riêng tôi?',
        'Sốc khí hậu và đồ ăn sẽ đánh gục tôi 3 tháng đầu?',
        'Có cơ hội làm thêm phụ tiền phòng dễ dàng không?',
        'Thầy cô giáo ở trường mới có thiên vị học sinh Tây?',
        'Cuộc tẩu thoát ra vũng an toàn này có thành công vang dội?',
      ]
    }],
    self: [{
      group: 'Định Hướng Bản Thân', qs: [
        'Tôi hiện tại là người như thế nào?',
        'Hình ảnh của tôi trong mắt người khác ra sao?',
        'Tôi cần chú ý gì để phát triển bản thân tốt hơn?',
        'Xu hướng của tôi trong tình yêu và các mối quan hệ là gì?',
        'Tôi đang tự giới hạn bản thân ở điểm nào?',

        'Hôm nay hãy mô tả con người thật của tôi bằng 3 từ.',
        'Tôi lười biếng bẩm sinh hay do cạn kiệt hy vọng?',
        'Sự thay đổi ngoại hình làm tóc/đồ mới có mang lại lộc?',
        'Góc khuất tính cách nào làm tôi tự phá hoại chuyện tốt?',
        'Mọi người đang có định kiến sai lệch gì về cá tính tôi?',
        'Tôi có đang ép mình trở thành phiên bản giả tạo?',
        'Điều tôi khát khao thầm kín nhưng luôn phủ nhận là gì?',
        'Làm sao để tôi chai mặt hơn trước những lời chê bai?',
        'Nét duyên ngầm của tôi nằm ở ánh mắt hay lời nói?',
        'Hôm nay vũ trụ gửi tôi một lời khen gì?',
      ]
    }],
    purpose: [{
      group: 'Sứ Mệnh & Ý Nghĩa Cuộc Đời', qs: [
        'Sứ mệnh của tôi trong cuộc đời này là gì?',
        'Tôi sinh ra để làm điều gì?',
        'Tôi đang lãng phí tiềm năng của mình ở đâu?',
        'Giá trị cốt lõi nào tôi cần sống đúng hơn?',
        'Hành động nào đưa tôi lại gần hơn với đích đến thực sự?',

        'Làm sao để tôi cảm thấy cuộc sống bớt thừa thãi vô dụng?',
        'Chuyến đi/Kế hoạch sắp tới có làm tôi ngộ ra chân lý?',
        'Tại sao các mối quan hệ đến rồi đi nhanh chóng thế?',
        'Tôi đến trái đất này để học cách tha thứ cho ai?',
        'Công việc đem lại tiền nhưng vì sao tâm tôi vẫn khuyết?',
        'Ngày trôi qua ngày lặp lại, lối thoát ở đâu?',
        'Đóng góp nhỏ bé của tôi có ai mảy may quan tâm?',
        'Năng khiếu bẩm sinh tôi mang theo mà quên mở khóa là gì?',
        'Nếu chỉ còn 1 năm sống, điều làm tôi hối tiếc nhất?',
        'Bước đệm tiếp theo giúp tôi tới gần sứ mệnh tột cùng?',
      ]
    }],
    shadow_self: [{
      group: 'Bóng Tối Nội Tâm', qs: [
        'Điều gì trong bản thân tôi mà tôi đang cố tình tránh đối diện?',
        'Bóng tối nào đang như nước địa dưới chân tôi?',
        'Tôi đang tự phá hoại bản thân theo những cách nào?',
        'Khó khăn hiện tại đang dạy tôi điều gì về chính mình?',
        'Tôi cần hòa giải điều gì bên trong để bước tiếp?',

        'Góc khuất trong tâm hồn tôi là gì?',
        'Tính xấu nào tôi đang cố che giấu?',
        'Vì sao đôi khi tôi lại ghen tị?',
        'Tôi hay tự lừa dối bản thân chuyện gì?',
        'Sự bướng bỉnh này đem lại hậu quả gì?',
        'Mặt tối của tôi đang muốn trỗi dậy?',
        'Tôi cần chấp nhận khuyết điểm nào?',
        'Nỗi sợ lớn nhất ẩn sâu trong tôi?',
        'Tính ích kỷ của tôi làm tổn thương ai?',
        'Làm sao để cân bằng ánh sáng và bóng tối?',
      ]
    }],
    decision: [{
      group: 'Ra Quyết Định', qs: [
        'Tôi nên chọn hướng nào trong quyết định lần này?',
        'Đâu là điều tôi thực sự muốn khi phải lựa chọn?',
        'Nếu cứ trì hoãn, điều gì sẽ xảy ra?',
        'Lời khuyên tương lai cho tôi liên quan đến quyết định này?',
        'Tôi đang sợ điều gì khiến khó ra quyết định?',

        'Quyết định sắp tới có đúng đắn không?',
        'Tôi nên chọn phương án nào tốt hơn?',
        'Do dự lúc này có làm lỡ cơ hội?',
        'Trực giác mách bảo tôi điều gì?',
        'Có yếu tố nào tôi chưa cân nhắc kĩ?',
        'Mọi người khuyên tôi, có nên nghe theo?',
        'Quyết định này có thay đổi đời tôi?',
        'Nên nhanh chóng giải quyết hay từ từ?',
        'Nếu làm sai, tôi có mất nhiều không?',
        'Tôi có đang bị cảm xúc chi phối?',
      ]
    }],
    travel: [{
      group: 'Du Lịch & Di Chuyển', qs: [
        'Chuyến đi này có thuận lợi và mang lại điều tốt không?',
        'Tôi có nên dời đến nơi ở mới không?',
        'Điều gì tôi cần chuẩn bị cho chuyến đi?',
        'Nơi nào mang lại cơ hội tốt cho tôi?',
        'Nơi đó có mang lại may mắn cho tôi?',

        'Chuyến đi sắp tới có an toàn không?',
        'Tôi có gặp rắc rối trên đường đi?',
        'Chuyến du lịch này có vui vẻ như ý?',
        'Có nên rủ người này đi cùng không?',
        'Hành lý và giấy tờ chuẩn bị đã đủ?',
        'Có phát sinh chi phí nào ngoài dự kiến?',
        'Nơi sắp đến có hợp với tôi không?',
        'Chuyến đi có giúp tôi giải tỏa tâm lý?',
        'Có cuộc gặp gỡ thú vị nào trên đường?',
        'Tôi nên ở khách sạn sang hay tiết kiệm?',
      ]
    }],
    spiritual: [{
      group: 'Tâm Linh & Giác Ngộ', qs: [
        'Tôi đang ở giai đoạn nào trong hành trình tâm linh của mình?',
        'Năng lượng bảo hộ nào đang ở bên cạnh tôi?',
        'Tôi có tiền duyên với con đường tâm linh nào không?',
        'Điều gì vũ trụ muốn nhắn gử cho tôi lúc này?',
        'Quyết định nào khởi đầu hành trình tâm linh của tôi?',
        'Tôi có năng khiếu tâm linh hay thấu cảm nào chưa khám phá?',

        'Lời cầu xin của tôi bề trên có nghe thấy?',
        'Cảm giác linh tính hôm nay có đúng không?',
        'Việc làm phước dạo này có mang lại vận may?',
        'Tín hiệu ngẫu nhiên vừa thấy báo hiệu gì?',
        'Hành trình tâm linh của tôi có tiến triển?',
        'Đồ phong thủy đang đeo có tác dụng tốt?',
        'Nhà cửa hiện tại có năng lượng xấu không?',
        'Tôi có đang vướng phải vận xui nào cản trở?',
        'Tâm tôi có đang thanh tịnh thật sự?',
        'Bề trên muốn nhắc nhở tôi điều gì?',
      ]
    }],
    friendship: [{
      group: 'Tình Bạn & Tri Kỷ', qs: [
        'Mối quan hệ bạn bè của chúng tôi hiện tại ra sao?',
        'Người bạn này có thực sự chân thành với tôi không?',
        'Làm sao để chúng tôi gắn kết và hiểu nhau hơn?',
        'Có xích mích nào đang ngầm tồn tại giữa chúng tôi không?',
        'Tương lai của tình bạn này sẽ đi về đâu?',

        'Bạn ấy có giận tôi không?',
        'Tình bạn này có chân thành không?',
        'Tại sao dạo này bạn ấy lạnh nhạt?',
        'Tôi có nên giúp đỡ họ lúc này?',
        'Họ có đang lợi dụng tôi?',
        'Chúng tôi có thể thân lại như xưa?',
        'Họ nghĩ gì về tôi?',
        'Có người nói xấu chia rẽ chúng tôi?',
        'Tôi nên làm gì để hàn gắn tình bạn?',
        'Họ có đang giấu tôi chuyện quan trọng?',
      ]
    }],
    pregnancy: [{
      group: 'Con Cái & Thai Kỳ', qs: [
        'Kế hoạch sinh con của tôi sắp tới có thuận lợi không?',
        'Giai đoạn thai kỳ của tôi cần lưu ý điều gì về năng lượng?',
        'Mối liên kết tâm linh giữa tôi và đứa trẻ sắp chào đời?',
        'Làm sao để tôi chuẩn bị tốt nhất vai trò làm cha/mẹ?',
        'Thông điệp vũ trụ dành cho kế hoạch gia đình của tôi?',
        'Tôi có nên sinh con không?',
        'Con của tôi là con trai hay con gái?',

        'Tôi đã sẵn sàng làm cha/mẹ chưa?',
        'Sức khỏe thai kỳ có ổn không?',
        'Việc có con lúc này gặp khó khăn gì?',
        'Gia đình có hỗ trợ tôi không?',
        'Áp lực tâm lý tôi cần giải tỏa là gì?',
        'Chồng/vợ tôi có cùng chung suy nghĩ?',
        'Đứa bé sinh ra sẽ mang năng lượng gì?',
        'Tài chính có đủ lo cho con không?',
        'Tôi cần thay đổi điều gì lúc này?',
        'Sắp tới có tin vui về em bé không?',
      ]
    }],
    gossip: [{
      group: 'Thị Phi & Đàm Tiếu', qs: [
        'Ai là người đang gieo rắc tin đồn về tôi rắc rối này?',
        'Tại sao thị phi này lại xuất hiện trong cuộc đời tôi?',
        'Cách tốt nhất để tôi dập tắt ngọn lửa đàm tiếu này là gì?',
        'Thị phi này có ảnh hưởng thực tế đến công việc của tôi không?',
        'Bài học tôi nhận được sau biến cố danh tiếng này là gì?',

        'Ai đang nói xấu tôi?',
        'Tin đồn này từ đâu ra?',
        'Tôi có nên đính chính không?',
        'Sếp có tin vào những lời này?',
        'Thị phi này bao giờ mới kết thúc?',
        'Mọi người đang đánh giá sai về tôi?',
        'Im lặng có phải là cách tốt nhất?',
        'Bài học từ vụ ồn ào này là gì?',
        'Người quen có quay lưng với tôi?',
        'Tôi cần làm gì để lấy lại uy tín?',
      ]
    }],
    legal: [{
      group: 'Pháp Lý & Giấy Tờ', qs: [
        'Vấn đề pháp lý hiện tại của tôi có kết quả khả quan không?',
        'Tôi cần chuẩn bị giấy tờ hoặc đối sách gì để xoay chuyển?',
        'Người hỗ trợ pháp lý hoặc luật sư của tôi có đáng tin cậy không?',
        'Vấn đề kiện tụng này kéo dài bao lâu nữa?',
        'Vũ trụ khuyên tôi nên nhượng bộ hay chiến đấu đến cùng?',

        'Vụ việc này có giải quyết êm xuôi?',
        'Hợp đồng sắp ký có ổn không?',
        'Tôi có rủi ro pháp lý nào không?',
        'Khâu giấy tờ bao giờ mới xong?',
        'Người làm việc với tôi có uy tín?',
        'Có nguy cơ phải đền bù không?',
        'Tôi nên chờ đợi hay hối thúc?',
        'Khó khăn thủ tục do đâu?',
        'Việc này có ảnh hưởng tài chính không?',
        'Tôi cần chuẩn bị thêm giấy tờ gì?',
      ]
    }],
    moving: [{
      group: 'Chuyển Chỗ & Định Cư', qs: [
        'Việc chuyển nhà / xuất ngoại lúc này có mang lại tài lộc không?',
        'Năng lượng phong thủy tại nơi ở mới có phù hợp với tôi?',
        'Rào cản lớn nhất cản bước tôi định cư tại vùng đất mới là gì?',
        'Quá trình di dời có thuận lợi không hay gặp trắc trở?',
        'Cuộc sống của tôi sẽ thay đổi thế nào sau khi chuyển chỗ?',

        'Có nên dọn đi chỗ khác ở?',
        'Nơi mới có mang lại may mắn không?',
        'Kế hoạch đi xa có thuận lợi?',
        'Môi trường mới tôi có hợp không?',
        'Chỗ ở hiện tại có vấn đề gì?',
        'Quyết định chuyển đi lúc này là đúng?',
        'Tôi có gặp khó khăn khi thích nghi?',
        'Bạn cùng phòng/hàng xóm mới ra sao?',
        'Chi phí chuyển đổi có đội lên cao?',
        'Chuyến đi sắp tới có an toàn?',
      ]
    }],
    pet: [{
      group: 'Thú Cưng', qs: [
        'Boss (thú cưng) của tôi đang cảm thấy thế nào?',
        'Thú cưng có mang lại năng lượng chữa lành cho ngôi nhà không?',
        'Vấn đề sức khỏe hiện tại của bé cưng có đáng lo ngại không?',
        'Mối liên hệ tiền kiếp giữa tôi và thú cưng là gì?',
        'Làm sao để tôi chăm sóc và kết nối tốt hơn với chúng?',

        'Thú cưng dạo này có vui vẻ không?',
        'Sức khỏe của vật nuôi hiện tại ra sao?',
        'Vì sao nó lại hay kêu ca bất thường?',
        'Tôi chăm sóc nó đã đủ tốt chưa?',
        'Nhận nuôi thêm thú cưng lúc này có ổn?',
        'Bé nó có quấn quýt và yêu thương tôi?',
        'Nó có truyền tin nhắn gì cho tôi qua hành động?',
        'Nên đổi thức ăn mới cho bé không?',
        'Nó thấy cô đơn khi tôi vắng nhà không?',
        'Chúng tôi có sự kết nối đặc biệt nào?',
      ]
    }],
    dream: [{
      group: 'Giải Mã Giấc Mơ', qs: [
        'Giấc mơ lặp đi lặp lại gần đây của tôi chứa thông điệp gì?',
        'Hình ảnh đáng sợ trong mơ cảnh báo tôi điều gì từ tiềm thức?',
        'Có điềm báo tương lai nào ẩn giấu trong giấc mộng đêm qua không?',
        'Vũ trụ muốn nhắc nhở tôi giải quyết vấn đề gì qua giấc mơ?',
        'Tôi nên hành động thế nào ở đời thực sau khi thấy điềm báo?',

        'Giấc mơ lạ tối qua là điềm lành hay dữ?',
        'Tại sao tôi lại hay thấy người cũ trong mơ?',
        'Ác mộng gần đây có phải do stress?',
        'Mơ thấy tiền bạc báo hiệu điều gì?',
        'Có lời nhắn nhủ nào từ cõi vô thức?',
        'Giấc mơ lặp đi lặp lại mang ý nghĩa gì?',
        'Dự báo trong mơ có thành hiện thực?',
        'Người đã khuất về báo mộng cho tôi?',
        'Tôi có nên làm theo chỉ dẫn trong mơ?',
        'Cách nào để không thấy ác mộng nữa?',
      ]
    }],
    past_life: [{
      group: 'Tiền Kiếp', qs: [
        'Tôi mang theo món nợ tiền kiếp nào ảnh hưởng đến hiện tại?',
        'Mối liên hệ giữa tôi và người ấy trong tiền kiếp là gì?',
        'Năng khiếu bẩm sinh hiện tại của tôi đến tử tiền kiếp nào?',
        'Chấp niệm nào từ tiền kiếp vẫn còn đang cản bước tôi?',
        'Tôi cần làm gì để giải thoát những nỗi đau từ quá khứ nhọc nhằn?',

        'Kiếp trước tôi có nợ nần người này không?',
        'Vì sao chúng tôi lại có cảm giác thân thuộc?',
        'Rắc rối hôm nay có từ nghiệp kiếp trước?',
        'Kiếp trước tính cách tôi thế nào?',
        'Mối quan hệ này là nhân hay là quả?',
        'Năng khiếu bẩm sinh tôi mang từ kiếp nào?',
        'Có hẹn ước nào chưa hoàn thành?',
        'Tính cách nóng nảy/rụt rè của tôi do đâu?',
        'Bài học cốt lõi kéo dài từ kiếp trước?',
        'Làm sao gỡ rối nghiệp quả lúc này?',
      ]
    }],
    karma: [{
      group: 'Nghiệp Quả', qs: [
        'Khó khăn tôi đang chịu đựng có phải xuất phát từ nghiệp quả?',
        'Bài học nhân quả (karma) lớn nhất mà tôi cần tốt nghiệp là gì?',
        'Làm sao để tôi gieo những hạt giống thiện lành cho tương lai?',
        'Có chướng nghiệp nào với gia đình dòng họ đang trói buộc tôi?',
        'Tôi đã trả xong món nghiệp đối với người này hay chưa?',

        'Khó khăn hiện tại là nghiệp tôi phải trả?',
        'Kẻ làm tôi buồn có phải nhận quả báo?',
        'Sự tử tế của tôi bao giờ được đền đáp?',
        'Chuyện xui xẻo này từ đâu mà ra?',
        'Gieo nhân nào thì gặt kết quả sắp tới?',
        'Tôi mang nợ ân tình ai chưa trả đàng hoàng?',
        'Thành công hôm nay là phước phần tích lũy?',
        'Luật nhân quả có thực sự công bằng với tôi?',
        'Nghiệp tình duyên của tôi bao lâu mới dứt?',
        'Làm sao để tôi sống tích đức hơn?',
      ]
    }],
    lost_item: [{
      group: 'Đồ Vật Thất Lạc', qs: [
        'Món đồ quý giá tôi làm rơi hiện đang nằm ở phương hướng nào?',
        'Trạng thái hiện tại của món đồ (còn nguyên hay đã hư hỏng)?',
        'Tôi nên tìm đồ vật này ở nơi ánh sáng hay trong góc khuất?',
        'Sự thất lạc này có mang ý nghĩa cảnh báo tôi bất cẩn điều gì?',
        'Tỷ lệ tôi tìm lại được đồ vật này là bao nhiêu phần trăm?',

        'Món đồ vừa mất có tìm lại được không?',
        'Nó đang ở trong nhà hay ngoài đường?',
        'Có ai cố tình lấy cắp đồ của tôi không?',
        'Người nhặt được có ý định trả lại?',
        'Tôi có nên tiếp tục cất công tìm kiếm?',
        'Đánh rơi đồ này là điềm báo gì?',
        'Lỗi do tôi bất cẩn hay do xui xẻo?',
        'Khoảng bao lâu đồ thất lạc sẽ về?',
        'Có phải nó kẹt ở góc khuất nào đó?',
        'Việc mất mát này có tổn thất lớn không?',
      ]
    }],
    general: [{
      group: 'Thông Điệp Chung', qs: [
        'Thông điệp chung của vũ trụ cho tôi là gì?',
        'Tôi cần tập trung điều gì thời gian này?',
        'Năng lượng nào đang bao quanh tôi?',
        'Thử thách lớn nhất tôi sẽ đối mặt là gì?',
        'Điều tốt đẹp nào sắp đến với tôi?',
      ]
    }],
    toxic_relationship: [{
      group: 'Mối Quan Hệ Độc Hại', qs: [
        'Tại sao tôi cứ mãi lặp lại khuôn mẫu bế tắc này trong tình yêu?',
        'Có nên dứt khoát chấm dứt mối quan hệ mang lại nhiều nước mắt này?',
        'Cách nào để tự giải thoát bản thân khỏi sự kìm kẹp tình cảm?',
        'Người kia có đang thao túng tâm lý (gaslight) tôi không?',
        'Bài học lớn nhất sau sự tan vỡ này là gì?'
        ,
        'Tôi có nên dứt khoát chấm dứt?',
        'Họ có thực sự thương tôi?',
        'Tại sao tôi mãi không buông được?',
        'Họ có đang thao túng tôi?',
        'Chia tay rồi họ có làm phiền tôi?',
        'Nếu rời đi, công viêc tôi có bị ảnh?',
        'Sự mệt mỏi này bao giờ mới dứt?',
        'Tôi đang tự lừa dối bản thân?',
        'Họ có thay đổi tính cách không?',
        'Làm sao để tôi mạnh mẽ hơn?',
      ]
    }],
    soulmate: [{
      group: 'Tri Kỷ / Soulmate', qs: [
        'Dấu hiệu nhận biết soulmate của tôi sắp xuất hiện là gì?',
        'Liệu người tôi vừa gặp có phải là mảnh ghép định mệnh?',
        'Điểm chung nào gắn kết linh hồn hai người trong vạn dặm đời?',
        'Sự hội ngộ mang lại điều gì cho sự phát triển của cả hai?',
        'Làm cách nào để vun đắp trọn vẹn sự kết nối kỳ diệu này?'
        ,
        'Người ấy có phải chân ái của tôi?',
        'Chúng tôi có duyên phận lâu dài?',
        'Làm sao để nhận ra soulmate?',
        'Chân ái của tôi đang ở đâu?',
        'Sự kết nối này mang lại điều gì?',
        'Có thử thách nào ngăn cản chúng tôi?',
        'Trực giác của tôi mách bảo đúng không?',
        'Chúng tôi hiểu nhau đến mức nào?',
        'Kiếp này chúng tôi có đến được với nhau?',
        'Bài học lớn nhất từ người này là gì?',
      ]
    }],
    reconciliation: [{
      group: 'Gương Vỡ Lại Lành', qs: [
        'Nếu quay lại, cả hai đã đủ trưởng thành để không vấp ngã?',
        'Tôi cần thay đổi điểm nào nếu muốn gương vỡ lại lành?',
        'Đối phương đã sẵn sàng bỏ qua cái tôi chưa?',
        'Cơ hội tái hợp lần này có mang lại hạnh phúc thật sự?',
        'Vũ trụ khuyên tôi nên buông xuôi hay cố níu giữ?'
        ,
        'Tôi có nên chủ động làm hòa?',
        'Họ có muốn quay lại không?',
        'Nếu quay lại, có cãi nhau nữa không?',
        'Họ đã thay đổi chưa?',
        'Việc quay lại lúc này có quá vội?',
        'Tôi nên mở lời thế nào?',
        'Họ có đang chờ tôi liên lạc?',
        'Tình cảm họ dành cho tôi còn không?',
        'Tái hợp xong có tốt đẹp hơn trước?',
        'Có ai đang cản trở chuyện chúng tôi?',
      ]
    }],
    secret_admirer: [{
      group: 'Người Thầm Thương', qs: [
        'Ai đang âm thầm quan tâm tôi từ xa?',
        'Cảm xúc thực sự của họ dành cho tôi sâu đậm đến đâu?',
        'Tôi có nên bật đèn xanh cho họ bước tới không?',
        'Lời tỏ tình có sắp sửa diễn ra trong thời gian tới?'
        ,
        'Ai đang thầm thương trộm nhớ tôi?',
        'Người để ý tôi là người quen hay lạ?',
        'Dấu hiệu nào để tôi nhận ra họ?',
        'Họ có định tỏ tình với tôi không?',
        'Người ấy có hay xem story của tôi?',
        'Tại sao họ ngần ngại không tiến tới?',
        'Người thương thầm tôi trông như thế nào?',
        'Tôi có từng làm người ấy tổn thương?',
        'Họ thích tôi vì ngoại hình hay tính cách?',
        'Nếu tôi bật đèn xanh, họ có dám lại gần?',
      ]
    }],
    burnout: [{
      group: 'Kiệt Sức & Áp Lực', qs: [
        'Tôi phải làm gì để khôi phục lại cảm hứng công việc?',
        'Khoảng thời gian kiệt sức này bao giờ mới chấm dứt?',
        'Tôi có đang ép bản thân chạy theo những tiêu chuẩn sai lầm?',
        'Bình yên thực sự đang chực chờ tôi ở phương hướng nào?'
        ,
        'Làm sao để hết kiệt sức?',
        'Tôi có nên xin nghỉ vài ngày?',
        'Sự mệt mỏi do công việc hay tâm lý?',
        'Làm gì để lấy lại năng lượng?',
        'Có ai san sẻ bớt gánh nặng cho tôi?',
        'Tôi ôm đồm quá nhiều việc phải không?',
        'Động lực nào giúp tôi vượt qua?',
        'Tâm trạng tồi tệ này kéo dài bao lâu?',
        'Việc tôi đang cố gắng có đáng giá?',
        'Tôi có đang quá khắt khe với mình?',
      ]
    }],
    startup: [{
      group: 'Khởi Nghiệp', qs: [
        'Ý tưởng khởi nghiệp của tôi có được thị trường đón nhận?',
        'Người đồng sáng lập này có đáng để tôi giao phó sứ mệnh không?',
        'Nên gọi vốn lúc này hay tự thân khởi nghiệp gầy dựng?',
        'Thử thách khó lường nhất trong giai đoạn đầu startup là gì?'
        ,
        'Khởi nghiệp lúc này có khả thi?',
        'Dự án sắp tới có thành công?',
        'Khó khăn lớn nhất phía trước là gì?',
        'Khách hàng có đón nhận không?',
        'Người làm chung có đáng tin?',
        'Lợi nhuận có như mức tôi kỳ vọng?',
        'Tôi có nên vay vốn thêm không?',
        'Chiến lược hiện tại đi đúng hướng chưa?',
        ' Rủi ro lớn nhất lúc này là gì?',
        'Sự cố gắng của tôi có được đền đáp?',
      ]
    }],
    workplace_politics: [{
      group: 'Thị Phi Công Sở', qs: [
        'Kẻ nào đang ném đá giấu tay trong bộ phận của tôi?',
        'Sáng suốt nhất bây giờ là cắn răng chịu đựng hay vùng lên?',
        'Sếp có thực sự hiểu và ghi nhận nỗ lực của tôi giữa cơn thị phi?',
        'Bao giờ những lời đơm đặt này mới tan biến đi?'
        ,
        'Tôi có đang bị gài bẫy ở chỗ làm?',
        'Làm sao để an toàn giữa drama?',
        'Đồng nghiệp này là bạn hay thù?',
        'Sếp có hiểu năng lực của tôi?',
        'Nên lên tiếng hay im lặng?',
        'Người mới vào có làm ảnh hưởng tôi?',
        'Tôi có bị cướp công không?',
        'Môi trường này có hợp với tôi?',
        'Ai đang được sếp ưu ái hơn?',
        'Tôi có nên đổi team/bộ phận không?',
      ]
    }],
    side_hustle: [{
      group: 'Nghề Tay Trái', qs: [
        'Ý tưởng kiếm thêm tiền này có mang lại lợi nhuận thực tế?',
        'Tôi nên phân bổ thời gian thế nào để không ảnh hưởng việc chính?',
        'Ai có thể là cộng sự tốt nhất cho tôi ở nghề tay trái?',
        'Nghề phụ này liệu có khả năng trở thành sự nghiệp trọn đời?'
        ,
        'Làm thêm có mang lại nhiều tiền?',
        'Nghề phụ có ảnh hưởng nghề chính?',
        'Tôi nên đầu tư thêm vào việc này?',
        'Khách hàng làm việc tự do có sòng phẳng?',
        'Tôi có đủ sức khỏe để cày cuốc?',
        'Việc này có khả năng thành việc chính?',
        'Kỹ năng của tôi đã đủ tốt chưa?',
        'Có nên tăng giá sản phẩm/dịch vụ?',
        'Thời gian tới việc làm thêm có thuận lợi?',
        'Người hỗ trợ tôi việc này có nhiệt tình?',
      ]
    }],
    real_estate: [{
      group: 'Bất Động Sản', qs: [
        'Tháng này có phải là thời điểm vàng để chốt mảnh đất này?',
        'Ngôi nhà mới có mang lại luồng sinh khí tốt đẹp không?',
        'Người mua/bán có đang giấu giếm rủi ro về mặt pháp lý?',
        'Làm sao để giao dịch mua bán nhà đất diễn ra suôn sẻ?'
        ,
        'Có nên mua / bán mảnh đất này lúc này?',
        'Giao dịch sắp tới có trôi chảy?',
        'Giá trị tài sản này có tăng không?',
        'Chủ nhà / khách thuê có tin cậy không?',
        'Mảnh đất/căn hộ này có tốt không?',
        'Thủ tục sang tên có bị chậm trễ?',
        'Đầu tư vào bất động sản lúc này có ổn?',
        'Có yếu tố rủi ro nào đang bị che giấu?',
        'Tôi có đủ tài chính để thanh toán?',
        'Việc thuê/mua chỗ này có mang lại tài lộc?',
      ]
    }],
    financial_loss: [{
      group: 'Thua Lỗ Khó Khăn', qs: [
        'Sau mất mát này, tôi cần cảnh giác lỗ hổng tài chính nào?',
        'Thời gian tới, luồng tiền có quay trở lại bù đắp cho tôi?',
        'Kẻ tiểu nhân nào đã lợi dụng sự cả tin của tôi?',
        'Làm sao để duy trì tinh thần trước sự cố hao tài tốn của?'
        ,
        'Khoản tiền bị mất có lấy lại được?',
        'Vì sao dạo này tôi hao tài?',
        'Làm sao để vượt qua khủng hoảng này?',
        'Bạn mượn tiền bao giờ mới trả?',
        'Khoản đầu tư đang lỗ có hồi lại vốn?',
        'Tôi chi tiêu sai lầm ở đâu?',
        'Bao lâu nữa tài chính mới ổn lại?',
        'Có cơ hội nào để tôi gỡ gạc?',
        'Gia đình có giúp đỡ tôi không?',
        'Bài học từ lần mất tiền này là gì?',
      ]
    }],
    sudden_wealth: [{
      group: 'Vận May Bất Ngờ', qs: [
        'Phải chăng vận cực thái lai, tôi chuẩn bị đón nhận tài lộc lớn?',
        'Nên phân bổ món lộc lạ này sao cho bền vững lâu dài?',
        'Liệu có ai đố kỵ với sự giàu lên đột ngột của tôi?',
        'Bao giờ cơn mưa tiền tiếp theo mới đến gõ cửa nhà tôi?'
        ,
        'Sắp tới tôi có lộc bất ngờ không?',
        'Đầu tư hôm nay có gặp may mắn?',
        'Khoản tiền lớn sắp có nên dùng làm gì?',
        'Tiền thưởng/Hoa hồng đợt này có cao?',
        'Tôi có gặp vận đỏ vào cuối tuần?',
        'May mắn tài chính đến từ đâu?',
        'Lộc này là do nỗ lực hay may mắn?',
        'Tôi có nên giữ kín tin vui này?',
        'Cơ hội làm giàu nhanh có đáng tin?',
        'Làm sao để giữ được lộc lâu dài?',
      ]
    }],
    healing: [{
      group: 'Chữa Lành Tâm Hồn', qs: [
        'Ai đã để lại vết xước lớn nhất trong lòng tôi?',
        'Hành trình chữa lành của tôi sẽ mất bao lâu nữa để trọn vẹn?',
        'Bước đầu tiên thiết thực để xoa dịu tiếng khóc trong tâm hồn?',
        'Tôi đang chối bỏ nỗi buồn bằng những lớp vỏ bọc nào?'
        ,
        'Bao giờ tôi mới quên được chuyện cũ?',
        'Tôi cần làm gì để thấy nhẹ nhõm hơn?',
        'Cách thiền tĩnh tâm này có hiệu quả?',
        'Tôi có đang trốn tránh cảm xúc thật?',
        'Vết thương này từ đâu mà ra?',
        'Làm thế nào để tha thứ cho họ?',
        'Tôi nên đi du lịch thư giãn không?',
        'Đã đến lúc tôi phải thay đổi?',
        'Sự dằn vặt này bao giờ mới qua?',
        'Tôi cần yêu thương bản thân theo cách nào?',
      ]
    }],
    stress: [{
      group: 'Căng Thẳng Âu Lo', qs: [
        'Tôi tự gánh vác quá nhiều hay do đời khắc nghiệt?',
        'Cách đơn giản nhất để não bộ được thư giãn hôm nay?',
        'Bao giờ những kỳ vọng đè bẹp vai mới chịu tan biến?',
        'Nên từ bỏ trách nhiệm nào để nhường chỗ cho sự bình an?'
        ,
        'Dạo này tôi áp lực nhất về việc gì?',
        'Làm sao để bớt lo âu suy nghĩ?',
        'Căng thẳng này sắp kết thúc chưa?',
        'Tôi tìm đến ai để tâm sự lúc này?',
        'Môi trường này khiến tôi ngột ngạt?',
        'Tôi có đang tự tạo áp lực cho mình?',
        'Nên đi chơi xả stress ở đâu?',
        'Có chuyện gì tồi tệ sắp xảy ra không?',
        'Giấc ngủ của tôi sao lại chập chờn?',
        'Cách giải tỏa nào phù hợp với tôi nhất?',
      ]
    }],
    trauma: [{
      group: 'Tổn Thương Quá Khứ', qs: [
        'Ký ức kinh hoàng nào vẫn đang thao túng hành vi hiện tại?',
        'Nhờ đâu tôi mới có can đảm đối diện với bóng tối ấy?',
        'Bao giờ vết thương này mới đóng vảy thành sẹo để quên đi?',
        'Bài học thiêng liêng từ nỗi đau quá khứ là gì?'
        ,
        'Nỗi ám ảnh này khi nào mới buông tha tôi?',
        'Ký ức cũ có ảnh hưởng quyết định của tôi?',
        'Tôi đã che giấu tổn thương này bao lâu?',
        'Người gây ra tổn thương có hối hận?',
        'Nội tâm tôi đang muốn nói điều gì?',
        'Làm sao để tôi mạnh mẽ đối mặt?',
        'Tôi có hay đóng vai nạn nhân không?',
        'Việc tôi nổi cáu có xuất phát từ tổn thương?',
        'Mối quan hệ hiện tại có chữa lành cho tôi?',
        'Bước tiếp theo để tôi vượt qua là gì?',
      ]
    }],
    exams: [{
      group: 'Thi Cử Điểm Số', qs: [
        'Kết quả môn học này sẽ như tôi mong ước chứ?',
        'Phương pháp ôn tập hiện tại của tôi đã tối ưu?',
        'Bẫy trắc nghiệm nào tôi dễ vấp phải nhất?',
        'Thần hộ mệnh có sát cánh cùng tôi trong phòng thi?'
        ,
        'Lần thi sắp tới tôi có qua môn suôn sẻ?',
        'Đề thi sẽ dễ hay khó đối với tôi?',
        'Có sai sót ngớ ngẩn nào khi làm bài không?',
        'Kết quả điểm số có như tôi mong đợi?',
        'Buổi phỏng vấn/kiểm tra có êm đẹp?',
        'Học tủ phần này có trúng không?',
        'Giám khảo/giáo viên có gắt gao với tôi?',
        'Tôi có nên nhờ bạn hỗ trợ không?',
        'Trượt môn này ảnh hưởng tương lai ra sao?',
        'Tâm lý lúc đi thi của tôi có ổn định?',
      ]
    }],
    scholarship: [{
      group: 'Học Bổng', qs: [
        'Hồ sơ của tôi đã đủ tỏa sáng để hội đồng xét duyệt chú ý?',
        'Kỹ năng nào tôi cần trau dồi gấp để đạt được học bổng này?',
        'Đối thủ cạnh tranh của tôi trong đợt apply này mạnh thế nào?',
        'Tôi nên chọn quốc gia nào để xin học bổng êm xuôi nhất?'
        ,
        'Hồ sơ xét duyệt của tôi có được đánh giá cao?',
        'Có khả năng tôi sẽ giành được suất học bổng?',
        'Người cạnh tranh với tôi có mạnh không?',
        'Kết quả sẽ mang lại niềm vui hay tiếc nuối?',
        'Sự thiếu sót nhỏ liệu có làm tôi bị trượt?',
        'Nhận hỗ trợ này tôi có chịu áp lực lớn?',
        'Buổi phỏng vấn vừa rồi tôi làm tốt chứ?',
        'Tôi cần bổ sung gì cơ hội cơ hội cao hơn?',
        'Trượt cơ hội này, có bù đắp khác tốt hơn?',
        'Thầy cô có nhiệt tình giúp đỡ tôi?',
      ]
    }],
    talent: [{
      group: 'Năng Khiếu Đam Mê', qs: [
        'Thiên bẩm ẩn giấu của tôi mạnh nhất ở khía cạnh nào?',
        'Tôi đang lãng phí tài năng vì nỗi sợ thất bại nào?',
        'Sống hết mình với đam mê nghệ thuật liệu có thành công?',
        'Làm sao để biến sở thích cá nhân thành nguồn thu nhập lớn?'
        ,
        'Tôi có nên theo đuổi đam mê này thay việc chính?',
        'Tài lẻ của tôi có hái ra tiền không?',
        'Có ai đang lợi dụng chất xám của tôi?',
        'Tôi bị chỉ trích là thiếu năng lực, đúng không?',
        'Hướng đi phát triển bản thân này có đúng?',
        'Sáng tạo hiện tại của tôi có bế tắc do đâu?',
        'Kỹ năng mềm nào tôi còn yếu kém?',
        'Tiềm năng tiềm ẩn nào tôi chưa phát hiện?',
        'Khoản đầu tư học kỹ năng mới có đáng giá?',
        'Tôi sẽ tỏa sáng trong lĩnh vực nào?',
      ]
    }],
    spirit_guide: [{
      group: 'Thần Hộ Mệnh Dẫn Lối', qs: [
        'Linh hồn dẫn dắt đang gửi thông điệp gì qua những con số lặp lại?',
        'Xin thần hộ mệnh ban cho tôi chỉ dẫn ở ngã rẽ cuộc đời?',
        'Có nguy hiểm tàng hình nào mà cõi vô hình đang cố chắn ngang?',
        'Tôi phải tĩnh tâm thế nào mới nghe rõ tiếng gọi từ vị thần hộ mệnh?'
        ,
        'Thần hộ mệnh có đang ở bên bảo vệ tôi?',
        'Dấu hiệu cảnh báo nguy hiểm gần đây là gì?',
        'Tôi có lỡ làm mếch lòng bề trên không?',
        'Năng lượng tâm linh đang hướng tôi đi đâu?',
        'Khó khăn này có bàn tay vô hình nào trợ giúp?',
        'Lời khấn nguyện của tôi đã được thấu hiểu?',
        'Cảm giác bất an lúc này là thông điệp gì?',
        'Nhà cửa có dấu hiệu phong thủy gì bất ổn?',
        'Tại sao công việc tôi liên tục gặp xui rủi?',
        'Đấng tối cao đang gửi cho tôi bài học gì?',
      ]
    }],
  };

  // Add more deep, diverse questions to every subtheme
  const extraQS = {
    "ex": [
      "Nên nhớ hay quên người cũ?",
      "Có nên mở lòng trở lại?",
      "Vì sao chúng tôi chia tay?"
    ],
    "current_love": [
      "Tình cảm hiện tại ra sao?",
      "Chúng tôi có hợp nhau không?",
      "Cần làm gì để gắn kết hơn?"
    ],
    "ambiguous": [
      "Họ có thích tôi thật không?",
      "Mối quan hệ này đi về đâu?",
      "Tôi có nên chủ động?"
    ],
    "crush": [
      "Crush có để ý đến tôi không?",
      "Cơ hội thành đôi là bao nhiêu?",
      "Tôi nên tỏ tình thế nào?"
    ],
    "future_love": [
      "Bao giờ tôi gặp tình yêu đích thực?",
      "Người ấy có đặc điểm gì?",
      "Tình duyên sắp tới ra sao?"
    ],
    "someone": [
      "Họ đang nghĩ gì về tôi?",
      "Họ có nhớ tôi không?",
      "Họ đang giấu tôi điều gì?"
    ],
    "marriage": [
      "Hôn nhân của chúng tôi ổn chứ?",
      "Làm sao để vợ chồng hòa thuận?",
      "Tương lai gia đình ra sao?"
    ],
    "conflict": [
      "Ai đang có lỗi trong chuyện này?",
      "Nên làm lành như thế nào?",
      "Cãi vã này để lại hậu quả gì?"
    ],
    "breakup": [
      "Vì sao chúng tôi đổ vỡ?",
      "Có cơ hội quay lại không?",
      "Tôi nên làm gì lúc này?"
    ],
    "long_distance": [
      "Yêu xa có bền vững không?",
      "Họ có chung thủy với tôi?",
      "Khi nào chúng tôi đoàn tụ?"
    ],
    "jealousy": [
      "Có người thứ 3 xen vào không?",
      "Họ có lừa dối tôi không?",
      "Sự ghen tuông của tôi là đúng?"
    ],
    "self_love": [
      "Tôi có đang yêu bản thân đủ?",
      "Tôi cần thay đổi điều gì?",
      "Cách nào giải phóng áp lực?"
    ],
    "friendship": [
      "Tình bạn này có chân thành?",
      "Họ có lợi dụng tôi không?",
      "Nên chơi tiếp hay nghỉ?"
    ],
    "pregnancy": [
      "Tâm trạng khi có con ra sao?",
      "Tôi chuẩn bị làm phụ huynh tốt chưa?",
      "Tương lai của bé sẽ ra sao?"
    ],
    "gossip": [
      "Ai đang nói xấu sau lưng tôi?",
      "Họ đồn đại vì ghen tị đúng không?",
      "Làm sao dập tắt tin đồn?"
    ],
    "career": [
      "Công việc của tôi ổn định không?",
      "Nên đổi việc hay ở lại?",
      "Sếp đang nghĩ gì về tôi?"
    ],
    "job_search": [
      "Bao giờ tôi tìm được việc?",
      "Công ty mới có tốt không?",
      "Tôi cần kỹ năng gì thêm?"
    ],
    "promotion": [
      "Khi nào tôi được thăng chức?",
      "Sếp có ưu ái tôi không?",
      "Tôi hợp làm quản lý chưa?"
    ],
    "business": [
      "Kinh doanh sắp tới có lãi?",
      "Tôi có nên mở rộng đầu tư?",
      "Đối tác có đáng tin không?"
    ],
    "colleague": [
      "Đồng nghiệp có tốt với tôi?",
      "Ai đang ngầm hại tôi?",
      "Làm sao hòa đồng hơn?"
    ],
    "career_change": [
      "Có nên chuyển ngành lúc này?",
      "Ngành mới có hợp với tôi?",
      "Tôi sẽ hối hận vì đổi nghề?"
    ],
    "freelance": [
      "Thu nhập tự do sắp tới ra sao?",
      "Có nên nghỉ hẳn để làm riêng?",
      "Dự án mới có tốt không?"
    ],
    "interview": [
      "Buổi phỏng vấn sẽ ra sao?",
      "Họ có thích tôi không?",
      "Mức lương họ trả có xứng?"
    ],
    "legal": [
      "Kiện tụng có phần thắng không?",
      "Hợp đồng này có rủi ro không?",
      "Tôi nên thỏa hiệp không?"
    ],
    "moving": [
      "Chuyển chỗ mới có may mắn?",
      "Môi trường mới hợp tôi không?",
      "Có nên định cư ở đây?"
    ],
    "finance": [
      "Tài chính tháng này ra sao?",
      "Tiền bạc có thất thoát không?",
      "Tôi sẽ kiếm được nhiêu tiền?"
    ],
    "investment": [
      "Dự án này có sinh lời?",
      "Nên cắt lỗ hay giữ lại?",
      "Tôi có bị lừa không?"
    ],
    "debt": [
      "Khi nào tôi trả hết nợ?",
      "Chủ nợ có lừa tôi không?",
      "Cách nào mau thoát nợ?"
    ],
    "savings": [
      "Nên tiết kiệm sao cho đúng?",
      "Tôi có đủ tiền mua nhà?",
      "Khoản tiết kiệm này an toàn?"
    ],
    "luck_money": [
      "Khi nào tôi có lộc bất ngờ?",
      "Vận may sắp tới thế nào?",
      "Nguồn tài lộc từ đâu tới?"
    ],
    "health": [
      "Sức khỏe hiện tại của tôi?",
      "Nên chú ý bộ phận nào?",
      "Làm sao để mau khỏi bệnh?"
    ],
    "mental": [
      "Tinh thần tôi đang ổn chứ?",
      "Nỗi buồn này do đâu?",
      "Cách nào vui vẻ trở lại?"
    ],
    "energy": [
      "Ai đang hút năng lượng của tôi?",
      "Tần số của tôi có cao không?",
      "Nên làm gì để tích cực hơn?"
    ],
    "family": [
      "Tình cảm [cha_con] dạo này ra sao?",
      "Kết nối [anh_em] đang tốt lên chứ?",
      "Vì sao gia đình mâu thuẫn?"
    ],
    "diet": [
      "Chế độ ăn của tôi ổn không?",
      "Tôi có nên giảm cân?",
      "Thức ăn nào hợp với tôi?"
    ],
    "pet": [
      "Thú cưng có khỏe không?",
      "Thú cưng mang lại may mắn?",
      "Khó khăn khi nuôi bé?"
    ],
    "study": [
      "Tôi có đang học đúng hướng?",
      "Kết quả học tập sắp tới?",
      "Làm sao bớt lười biếng?"
    ],
    "study_abroad": [
      "Tôi có cơ hội du học không?",
      "Môi trường nước ngoài ra sao?",
      "Nên chọn nước nào tốt?"
    ],
    "self": [
      "Tôi là ai trong mắt người khác?",
      "Năng lực thực sự của tôi?",
      "Giá trị cốt lõi của tôi?"
    ],
    "purpose": [
      "Sứ mệnh đời tôi là gì?",
      "Tôi sinh ra để làm gì?",
      "Điều gì giúp tôi hạnh phúc?"
    ],
    "shadow_self": [
      "Nỗi sợ đen tối nhất của tôi?",
      "Ghen tuông của tôi ở đâu ra?",
      "Tôi trốn tránh điều gì?"
    ],
    "decision": [
      "Tôi chọn đúng hay sai?",
      "Kết quả sẽ như thế nào?",
      "Điều gì cản tôi quyết định?"
    ],
    "travel": [
      "Chuyến đi có an toàn không?",
      "Tôi hợp nơi này không?",
      "Tôi gặp ai đặc biệt không?"
    ],
    "spiritual": [
      "Số thiên thần đang nhắc tôi gì?",
      "Tôi có căn năng tâm linh?",
      "Làm sao trực giác mạnh hơn?"
    ],
    "dream": [
      "Giấc mơ vừa rồi có ý gì?",
      "Ai báo mộng cho tôi?",
      "Ác mộng kia chỉ là ảo?"
    ],
    "past_life": [
      "Kiếp trước tôi là ai?",
      "Nợ tiền kiếp của tôi là gì?",
      "Mối duyên cũ còn không?"
    ],
    "karma": [
      "Tôi đang trả nghiệp gì vậy?",
      "Làm sao giải được oan gia?",
      "Nhân quả của sự việc này?"
    ],
    "lost_item": [
      "Đồ của tôi đang ở đâu?",
      "Bị ai lấy hay tự rớt?",
      "Tôi có tìm lại được không?"
    ],
    "toxic_relationship": [
      "Tổn thương này do đâu?",
      "Họ có thao túng tôi?",
      "Giải thoát mối tình này?"
    ],
    "soulmate": [
      "Tiền kiếp chúng tôi nợ nhau gì?",
      "Sứ mệnh chung của hai đứa?",
      "Khi nào định mệnh đến?"
    ],
    "reconciliation": [
      "Hàn gắn này có ý nghĩa gì?",
      "Cái tôi của ai cao hơn?",
      "Chúng tôi sẽ hạnh phúc chứ?"
    ],
    "secret_admirer": [
      "Người thầm thương là ai?",
      "Họ giúp gì được tôi?",
      "Có nên đón nhận họ?"
    ],
    "burnout": [
      "Trống rỗng do công việc?",
      "Trốn tránh nỗi đau nào đây?",
      "Làm sao hết kiệt quệ?"
    ],
    "startup": [
      "Dự án khởi nghiệp tốt không?",
      "Tiền kiếm được sắp tới?",
      "Ai đang ủng hộ kinh doanh này?"
    ],
    "workplace_politics": [
      "Sự ghen ghét này do đâu?",
      "Sếp có đang hiểu lầm tôi?",
      "Nên im lặng lúc này?"
    ],
    "side_hustle": [
      "Nghề tay trái có phát triển?",
      "Kỹ năng gì tạo ra tiền?",
      "Tác động đến cuộc sống?"
    ],
    "real_estate": [
      "Nhà đất này định hướng sao?",
      "Nên mua hay bán lúc này?",
      "Rủi ro phong thủy ra sao?"
    ],
    "financial_loss": [
      "Bài học kinh doanh sau thất bại?",
      "Tin sai người hay tự lừa mình?",
      "Tài lộc mới bao giờ đến?"
    ],
    "sudden_wealth": [
      "Lộc trời cho hay trừng phạt?",
      "Làm sao giữ số tiền này?",
      "Nên chia sẻ như thế nào?"
    ],
    "healing": [
      "Ai chữa lành vết thương này?",
      "Tôi còn đau khổ vì ai?",
      "Hạnh phúc mới mang lại gì?"
    ],
    "stress": [
      "Âu lo do tôi hay do đời?",
      "Ai đang là gánh nặng?",
      "Làm sao để nhẹ nhõm hơn?"
    ],
    "trauma": [
      "Ai khiến tôi tổn thương vậy?",
      "Thu hút đau khổ này từ đâu?",
      "Buông bỏ quá khứ cách nào?"
    ],
    "exams": [
      "Bài thi kỳ này nhàn không?",
      "Cần chuẩn bị tâm lý gì?",
      "Kết quả kỳ thi sắp tới?"
    ],
    "scholarship": [
      "Hội đồng chọn tôi chưa?",
      "Nếu trượt thì sao?",
      "Vinh quang này tốt hay xấu?"
    ],
    "talent": [
      "Năng khiếu thật sự của tôi?",
      "Nỗi sợ làm mờ tài năng?",
      "Người khác có nể phục tôi?"
    ],
    "spirit_guide": [
      "Thần hộ mệnh gửi gắm gì?",
      "Giải mã điềm báo ra sao?",
      "Tin trực giác hay lý trí?"
    ],
    "general": [
      "Sự kiện sắp tới của tôi?",
      "Vũ trụ đang muốn tôi làm gì?",
      "Lời khuyên tổng quát lúc này?"
    ]
  };

  Object.keys(extraQS).forEach(k => {
    if (PRESET_Q[k] && PRESET_Q[k][0]) {
      PRESET_Q[k][0].qs.push(...extraQS[k]);
    }
  });


  function refreshPresetQ() {
    const grid = document.getElementById('presetQGrid');
    const groups = PRESET_Q[_selectedTheme] || PRESET_Q.general;

    grid.innerHTML = groups.map(g => `
      <div class="preset-q-group">
        <div class="preset-q-group-header">${formatGenderText(g.group)}</div>
        ${g.qs.map(q => `<button class="preset-q-btn" type="button">${formatGenderText(q)}</button>`).join('')}
      </div>`).join('');
    grid.querySelectorAll('.preset-q-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        inputQ.value = btn.textContent;
        if (charCount) charCount.textContent = `${inputQ.value.length} / 200`;
        setTimeout(() => goToStep(4, 'forward'), 180);
      });
    });
  }

  function switchQTab(mode) {
    const customPanel = document.getElementById('customQPanel');
    const presetPanel = document.getElementById('presetQPanel');
    const tabC = document.getElementById('tabCustomQ');
    const tabP = document.getElementById('tabPresetQ');
    if (mode === 'preset') {
      customPanel?.classList.add('hidden');
      presetPanel?.classList.remove('hidden');
      tabC?.classList.remove('active');
      tabP?.classList.add('active');
      refreshPresetQ();
    } else {
      presetPanel?.classList.add('hidden');
      customPanel?.classList.remove('hidden');
      tabP?.classList.remove('active');
      tabC?.classList.add('active');
    }
  }

  document.getElementById('tabCustomQ')?.addEventListener('click', () => {
    switchQTab('custom');
    const hint = document.getElementById('_step3Hint');
    if (hint) hint.style.opacity = '0';
  });
  document.getElementById('tabPresetQ')?.addEventListener('click', () => {
    switchQTab('preset');
    const hint = document.getElementById('_step3Hint');
    if (hint) hint.style.opacity = '0';
  });

  /* ── Privacy Modal ────────────────────────────────────── */
  const btnOpenPrivacy = document.getElementById('btnOpenPrivacy');
  const btnPrivacyClose = document.getElementById('btnPrivacyClose');
  const privacyModal = document.getElementById('privacyModal');

  if (btnOpenPrivacy && privacyModal) {
    btnOpenPrivacy.addEventListener('click', () => {
      privacyModal.classList.add('visible');
    });
    btnPrivacyClose?.addEventListener('click', () => {
      privacyModal.classList.remove('visible');
    });
    privacyModal.addEventListener('click', (e) => {
      if (e.target === privacyModal) privacyModal.classList.remove('visible');
    });
  }

  /* ── Spread Selection Logic ────────────────────────── */
  const spreadRadios = document.querySelectorAll('input[name="spread"]');
  const spreadDescBox = document.getElementById('spreadDescriptionBox');

  const spreadWarnModal5 = document.getElementById('spreadWarnModal5');
  const swmBtnCancel5 = document.getElementById('swmBtnCancel5');
  const swmBtnConfirm5 = document.getElementById('swmBtnConfirm5');

  const spreadWarnModal7 = document.getElementById('spreadWarnModal7');
  const swmBtnCancel7 = document.getElementById('swmBtnCancel7');
  const swmBtnConfirm7 = document.getElementById('swmBtnConfirm7');

  const spreadWarnModal10 = document.getElementById('spreadWarnModal10');
  const swmBtnCancel10 = document.getElementById('swmBtnCancel10');
  const swmBtnConfirm10 = document.getElementById('swmBtnConfirm10');

  const spreadWarnModal12 = document.getElementById('spreadWarnModal12');
  const swmBtnCancel12 = document.getElementById('swmBtnCancel12');
  const swmBtnConfirm12 = document.getElementById('swmBtnConfirm12');

  let pendingSpreadRadio = null;
  const COOLDOWN_DAYS = { 5: 1, 7: 7, 10: 30, 12: 90 };

  function checkSpreadCooldown(spreadVal) {
    if (spreadVal !== 5 && spreadVal !== 7 && spreadVal !== 10 && spreadVal !== 12) return { allowed: true };
    try {
      const data = JSON.parse(localStorage.getItem('tbhb_spread_cooldown') || '{}');
      const lastTime = data[spreadVal];
      if (!lastTime) return { allowed: true };

      const diffMs = Date.now() - lastTime;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const requiredDays = COOLDOWN_DAYS[spreadVal];

      if (diffDays < requiredDays) {
        const endTimeMs = lastTime + (requiredDays * 24 * 60 * 60 * 1000);
        const unlockDate = new Date(endTimeMs);
        const dd = String(unlockDate.getDate()).padStart(2, '0');
        const mm = String(unlockDate.getMonth() + 1).padStart(2, '0');
        const yyyy = unlockDate.getFullYear();
        const HH = String(unlockDate.getHours()).padStart(2, '0');
        const MM = String(unlockDate.getMinutes()).padStart(2, '0');
        const unlockStr = `${HH}:${MM} ngày ${dd}/${mm}/${yyyy}`;

        return { allowed: false, remaining: requiredDays - diffDays, unlockStr: unlockStr };
      }
    } catch (e) { }
    return { allowed: true };
  }

  function closeWarningModals() {
    if (spreadWarnModal5) spreadWarnModal5.classList.remove('visible');
    if (spreadWarnModal7) spreadWarnModal7.classList.remove('visible');
    if (spreadWarnModal10) spreadWarnModal10.classList.remove('visible');
    if (spreadWarnModal12) spreadWarnModal12.classList.remove('visible');
  }

  function confirmPendingSpread() {
    closeWarningModals();
    if (pendingSpreadRadio) {
      pendingSpreadRadio.dataset.confirmed = "true";
      pendingSpreadRadio.checked = true;
      // manually dispatch change event to update the description box
      const event = new Event('change', { bubbles: true });
      pendingSpreadRadio.dispatchEvent(event);
      pendingSpreadRadio = null;
    }
  }

  if (swmBtnCancel5) swmBtnCancel5.addEventListener('click', () => { closeWarningModals(); pendingSpreadRadio = null; });
  if (swmBtnConfirm5) swmBtnConfirm5.addEventListener('click', confirmPendingSpread);

  if (swmBtnCancel7) swmBtnCancel7.addEventListener('click', () => { closeWarningModals(); pendingSpreadRadio = null; });
  if (swmBtnConfirm7) swmBtnConfirm7.addEventListener('click', confirmPendingSpread);

  if (swmBtnCancel10) swmBtnCancel10.addEventListener('click', () => { closeWarningModals(); pendingSpreadRadio = null; });
  if (swmBtnConfirm10) swmBtnConfirm10.addEventListener('click', confirmPendingSpread);

  if (swmBtnCancel12) swmBtnCancel12.addEventListener('click', () => { closeWarningModals(); pendingSpreadRadio = null; });
  if (swmBtnConfirm12) swmBtnConfirm12.addEventListener('click', confirmPendingSpread);

  if (spreadRadios.length && spreadDescBox) {
    spreadRadios.forEach(r => {
      r.addEventListener('click', (e) => {
        const val = parseInt(r.value);
        if (val === 5 || val === 7 || val === 10 || val === 12) {
          const cd = checkSpreadCooldown(val);
          if (!cd.allowed) {
            e.preventDefault();
            // Show cooldown message state
            if (val === 5 && spreadWarnModal5) {
              document.getElementById('swmNormalText5').style.display = 'none';
              document.getElementById('swmCdText5').style.display = 'block';
              swmBtnConfirm5.style.display = 'none';
              spreadWarnModal5.classList.add('visible');
            } else if (val === 7 && spreadWarnModal7) {
              document.getElementById('swmNormalText7').style.display = 'none';
              document.getElementById('swmCdText7').style.display = 'block';
              document.getElementById('swmCdDays7').textContent = cd.unlockStr;
              swmBtnConfirm7.style.display = 'none';
              spreadWarnModal7.classList.add('visible');
            } else if (val === 10 && spreadWarnModal10) {
              document.getElementById('swmNormalText10').style.display = 'none';
              document.getElementById('swmCdText10').style.display = 'block';
              document.getElementById('swmCdDays10').textContent = cd.unlockStr;
              swmBtnConfirm10.style.display = 'none';
              spreadWarnModal10.classList.add('visible');
            } else if (val === 12 && spreadWarnModal12) {
              document.getElementById('swmNormalText12').style.display = 'none';
              document.getElementById('swmCdText12').style.display = 'block';
              document.getElementById('swmCdDays12').textContent = cd.unlockStr;
              swmBtnConfirm12.style.display = 'none';
              spreadWarnModal12.classList.add('visible');
            }
            return;
          }

          if (r.dataset.confirmed !== "true") {
            e.preventDefault();
            pendingSpreadRadio = r;
            // Restore normal message state
            if (val === 5 && spreadWarnModal5) {
              document.getElementById('swmNormalText5').style.display = 'block';
              document.getElementById('swmCdText5').style.display = 'none';
              swmBtnConfirm5.style.display = 'inline-block';
              spreadWarnModal5.classList.add('visible');
            } else if (val === 7 && spreadWarnModal7) {
              document.getElementById('swmNormalText7').style.display = 'block';
              document.getElementById('swmCdText7').style.display = 'none';
              swmBtnConfirm7.style.display = 'inline-block';
              spreadWarnModal7.classList.add('visible');
            } else if (val === 10 && spreadWarnModal10) {
              document.getElementById('swmNormalText10').style.display = 'block';
              document.getElementById('swmCdText10').style.display = 'none';
              swmBtnConfirm10.style.display = 'inline-block';
              spreadWarnModal10.classList.add('visible');
            } else if (val === 12 && spreadWarnModal12) {
              document.getElementById('swmNormalText12').style.display = 'block';
              document.getElementById('swmCdText12').style.display = 'none';
              swmBtnConfirm12.style.display = 'inline-block';
              spreadWarnModal12.classList.add('visible');
            }
          }
        }
      });

      r.addEventListener('change', () => {
        if (r.checked) {
          spreadDescBox.style.opacity = 0;
          spreadDescBox.style.transform = 'translateY(4px)';
          setTimeout(() => {
            spreadDescBox.innerHTML = r.getAttribute('data-desc') || '';
            spreadDescBox.style.opacity = 1;
            spreadDescBox.style.transform = 'translateY(0)';
          }, 250);
        }
      });
    });
  }

  /* ── Public API ─────────────────────────────────────── */
  window.FormModule = {
    open: openForm,
    close: closeForm,
    getThemeLabel(key) {
      return MAIN_THEMES.find(t => t.key === key)?.label
        || Object.values(SUB_THEMES).flat().find(s => s.key === key)?.label
        || key;
    },
    getData() {
      const data = {
        name: document.getElementById('inputName').value.trim(),
        dob: document.getElementById('inputDob').value,
        gender: document.getElementById('inputGender').value,
        theme: _selectedTheme,
        question: inputQ.value.trim(),
        spread: parseInt(document.querySelector('input[name="spread"]:checked')?.value || '3')
      };
      try { localStorage.setItem(USER_KEY, JSON.stringify({ name: data.name, dob: data.dob, gender: data.gender })); } catch { }
      return data;
    },
    setTheme(key) { _selectedTheme = key; }
  };
})();



