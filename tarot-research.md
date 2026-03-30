# Mystery Tarot Reverse Engineering Notes

Xác minh lần cuối: 2026-03-30  
Website mục tiêu: `https://mystery-tarot.vercel.app/`

## 1. Mục đích tài liệu

Tài liệu này tổng hợp toàn bộ kiến thức đã bóc tách được từ web `Mystery Tarot` để dùng làm tài liệu tham chiếu khi phát triển một sản phẩm cùng nhóm.

Phạm vi:
- Tổng hợp những gì có thể xác nhận trực tiếp từ frontend public.
- Tách riêng phần `confirmed` và `inference`.
- Tập trung vào thông tin có giá trị thực chiến cho product, UX, frontend, backend và dữ liệu.

Không phạm vi:
- Không có source backend gốc.
- Không xác định được công nghệ CSDL backend chỉ từ frontend public.
- Không sao chép nguyên bản nội dung, hình ảnh, text copyrighted để sử dụng lại.

## 2. Tổng quan sản phẩm

### Confirmed

- Thương hiệu hiện trên site: `Tarot Huyền Bí`, `Mystery Tarot`.
- Footer và source frontend có chuỗi:
  - `Mystery Tarot free by TurnioDev`
  - `Developed & Designed by Turnio DEV`
- Link tác giả được gắn trong site: `https://www.facebook.com/turni0`
- Site deploy trên Vercel.
- Frontend là web tĩnh, không phải build SPA đóng gói kiểu Next.js/React SSR.
- HTML tải trực tiếp, CSS và JS được nạp bằng các file static.

### Inference

- Đây là một sản phẩm tarot online hướng tới người dùng Việt Nam, kết hợp tarot + AI interpretation + chia sẻ kết quả + daily draw + lịch sử.
- Giao diện được custom rất mạnh, không giống một template phổ biến đang public.

## 3. Định vị sản phẩm

### Thông điệp marketing xuất hiện trên page

- Tarot online miễn phí.
- Luận giải AI cá nhân hóa.
- Phù hợp các nhóm chủ đề: tình yêu, sự nghiệp, tài chính, sức khỏe, bản thân, tổng quát.
- Nhanh, huyền bí, cá nhân hóa, có trải nghiệm “nghi lễ” và “không gian tâm linh”.

### Product positioning

- Không chỉ là “random card draw”.
- Đây là một “ritualized experience”:
  - vào landing,
  - nhập thông tin cá nhân,
  - chọn chủ đề,
  - đặt câu hỏi,
  - chọn spread,
  - rút bài,
  - trả lời câu hỏi làm rõ,
  - nhận AI interpretation,
  - lưu/share/xem lại.

## 4. Kiến trúc thông tin và flow màn hình

Frontend có 3 page logic chính:

1. `Landing`
2. `Reading`
3. `Analysis`

Ngoài ra có nhiều overlay/modal.

### 4.1 Landing page

Thành phần chính:
- Background nebula + vignette + sigil.
- Tiêu đề: `Tarot Huyền Bí`.
- Subtitle theo hướng tạo mood.
- Nút `Bắt Đầu Hành Trình`.
- Nút `Thông điệp quá khứ` để mở lịch sử.
- Nút `Ý nghĩa các lá bài`.
- Floating button thống kê chủ đề.
- Floating daily draw widget.
- User badge sau đăng nhập.

Mục tiêu UX:
- Tạo ấn tượng “mystical premium”.
- Đưa người dùng vào nghi thức “nghi lễ”.
- Đẩy daily engagement bằng daily draw.

### 4.2 Form overlay

Flow form nhiều bước:

Step 1:
- Họ tên
- Ngày sinh
- Giới tính
- Privacy note

Step 2:
- Chọn lĩnh vực chính
- Chọn sub-theme
- Có nút bỏ qua

Step 3:
- Chọn câu hỏi gợi ý hoặc tự nhập

Step 4:
- Chọn spread / bố cục trải bài

Mục tiêu UX:
- Thu thập metadata để cá nhân hóa.
- Giảm friction bằng gợi ý preset.
- Biến việc nhập thông tin thành một nghi thức.

### 4.3 Reading page

Thành phần:
- Header hiện thông tin user và câu hỏi.
- Instruction area.
- Khu vực deck.
- Khu vực đã chọn.
- Nút `Xem Luận Giải`.

Mục tiêu UX:
- Tạo cảm giác tự tay chọn bài.
- Kéo dài thời gian tập trung trước khi vào AI reading.

### 4.4 Analysis page

Thành phần:
- Hero thông điệp + metadata.
- Khối AI analysis tổng hợp.
- Danh sách từng lá bài:
  - tên
  - tên Việt
  - số
  - xuôi/ngược
  - ý nghĩa
  - từ khóa
  - meaning theo theme
  - lời khuyên
- Floating action:
  - chia sẻ
  - lịch sử
  - về trang chủ
- Donate area.

Mục tiêu UX:
- Phân cấp thông tin rõ:
  - tổng hợp AI trước,
  - card detail sau.
- Tăng khả năng share và quay lại.

### 4.5 Modals và overlays phụ

Xác nhận có:
- Daily draw modal
- Clarification modal
- History panel
- Dictionary modal
- Card detail modal
- Donate modal
- Privacy modal
- Top topics modal
- Daily limit blocked modal
- Daily limit warning modal
- Google login modal

## 5. Danh sách tính năng đã xác nhận

### Core tarot features

- Rút bài tarot theo nhiều spread.
- Hỗ trợ card xuôi/ngược.
- Hiện ý nghĩa từng lá.
- AI tổng hợp kết quả.
- Có dictionary tra nghĩa lá bài.

### Personalization

- Họ tên
- Ngày sinh
- Giới tính
- Theme/sub-theme
- Câu hỏi riêng
- Clarification questions trước khi AI synthesis

### Engagement

- Daily draw
- History local + remote sync
- Share public link
- Top topics chart
- Login với Google
- Freemium / quota / paywall

### Monetization / retention

- Buy Me A Coffee
- Gating AI readings theo quota
- Gating anonymous vs logged-in
- Block/warn khi vượt giới hạn trải bài theo ngày
- Gói premium mở rộng quota

## 6. Hệ thống visual và UI language

### 6.1 Visual direction

Tone tổng thể:
- dark mystical
- purple / violet / gold
- cosmic / occult / ritual
- premium but dramatic

Biến màu xuất hiện trong CSS:
- `--c-void`
- `--c-deep`
- `--c-dark`
- `--c-mid`
- `--c-purple`
- `--c-violet`
- `--c-glow`
- `--c-pale`
- `--c-gold`
- `--c-gold-bright`
- `--c-gold-pale`

Cảm giác thị giác:
- nền tối
- glow tím
- accent vàng kim
- border mờ
- blur/glow/trail/particle

### 6.2 Typography

Google Fonts được nạp:
- `Cinzel Decorative`
- `Cinzel`
- `Philosopher`
- `EB Garamond`

Vai trò fonts:
- `Cinzel Decorative`: heading, title, mystical branding
- `Cinzel`: heading phụ, accent text
- `Philosopher`: labels, buttons, mystical UI copy
- `EB Garamond`: body text, description, narrative text

### 6.3 Motion language

Site dùng nhiều motion có chủ đích:
- floating
- breathing glow
- sigil rotation
- particle field
- lightning / warp transition
- stagger reveal
- card flip
- modal scale/fade
- shimmer

Nó không phải micro-interaction nhỏ lẻ, mà là một “theatrical motion system”.

### 6.4 Layout style

- Fullscreen app-like layout.
- Nhiều fixed layers.
- Overlay và modal rất nhiều.
- Page transitions trong cùng một HTML.
- Floating buttons góc màn hình.
- Reading page và analysis page như một app mobile-first trong desktop shell.

## 7. Frontend architecture đã bóc tách được

### Confirmed stack

- HTML static
- CSS thủ công rất lớn (`style.css`)
- JavaScript thủ công chia module bằng namespace toàn cục
- Vercel hosting
- Thư viện third-party:
  - Chart.js
  - Google Identity Services
  - Vanilla Tilt

### Các file JS chính

- `js/data.js`
- `js/particles.js`
- `js/lightning.js`
- `js/float-cards.js`
- `js/effects.js`
- `js/dob-picker.js`
- `js/helper.js`
- `js/auth.js`
- `js/daily_limit.js`
- `js/history.js`
- `js/daily_messages.js`
- `js/daily.js`
- `js/form.js`
- `js/reading.js`
- `js/clarify_data.js`
- `js/analysis.js`
- `js/dictionary.js`
- `js/app.js`

### Namespace / module pattern

Frontend dùng pattern:
- `window.AnalysisModule`
- `window.AuthModule`
- `window.HistoryModule`
- `window.FormModule`
- `window.ReadingModule`
- `window.TAROT_DB`
- `window.ClarifyData`
- `window.DAILY_MESSAGES`

Điều này cho thấy:
- app là custom vanilla JS
- giao tiếp giữa module qua global namespace
- routing được làm bằng ẩn/hiện page

### Routing

Trong `js/app.js`, app chuyển page bằng class toggle:
- `page--active`

Có flow:
- landing
- reading
- analysis

Có `share` query param để mở trực tiếp analysis page từ public link.

## 8. Dữ liệu và nơi lưu trữ

## 8.1 Dữ liệu tarot tĩnh

### Confirmed

- File `js/data.js` chứa dataset tarot dưới dạng obfuscated.
- Bên trong có `window.TAROT_DB = JSON.parse(...)`.
- Header HTTP cho thấy file có kích thước xấp xỉ `4.48 MB`.

### Ý nghĩa thực tế

Rất có khả năng file này chứa:
- 78 lá bài
- id
- tên Anh
- tên Việt
- số thứ tự
- image path
- ý nghĩa xuôi
- ý nghĩa ngược
- từ khóa
- astrology / numerology / element / zodiac / planet
- advice
- aspect theo từng chủ đề

### Vị trí lưu

- Frontend static trên Vercel:
  - `https://mystery-tarot.vercel.app/js/data.js?v=3` tại thời điểm verify

## 8.2 Dữ liệu message bổ sung

Confirmed:
- `js/daily_messages.js` chứa `window.DAILY_MESSAGES`
- `js/clarify_data.js` chứa `window.ClarifyData`

Ý nghĩa:
- Daily card message được pre-seed sẵn trên frontend.
- Clarification question bank theo theme cũng được ship sẵn cho client.

## 8.3 Dữ liệu lưu trên browser

Confirmed:

- `localStorage`:
  - key `tbhb_hist`: lịch sử trải bài local
  - key `tarot_daily_draw`: thông tin rút bài trong ngày
- `sessionStorage`:
  - key `tbhb_guser`: session Google user

Ý nghĩa:
- App có khả năng hoạt động một phần ngay cả khi user chưa login.
- Local history được dùng như offline-first cache.

## 8.4 Dữ liệu lưu trên backend remote

Frontend gọi tới:
- `https://ka-en.com.vn/tarot_api/get_reading.php`
- `https://ka-en.com.vn/tarot_api/get_top_topics.php`
- `https://ka-en.com.vn/tarot_api/gemini_proxy.php`
- `https://ka-en.com.vn/tarot_api/make_public.php`
- `https://ka-en.com.vn/tarot_api/get_history.php`
- `https://ka-en.com.vn/tarot_api/delete_reading.php`
- `https://ka-en.com.vn/tarot_api/delete_all_readings.php`

Suy ra backend `ka-en.com.vn/tarot_api` đang lưu:
- kết quả AI analysis
- public share reading
- history remote khi đăng nhập
- thống kê top topics
- cơ chế quota / public sharing / sync lịch sử

### Inference

Không xác định được backend đang dùng:
- MySQL
- PostgreSQL
- file JSON
- hay hệ thống lưu trữ khác

Nhưng có thể kết luận an toàn:
- Dữ liệu động không nằm trên Vercel frontend.
- Nó nằm trên backend `ka-en.com.vn`.

## 9. AI và backend behavior

### Confirmed

`js/analysis.js` gọi:
- `gemini_proxy.php`

Payload gửi lên gồm:
- thông tin session
- theme
- question
- spread
- cards đã chọn
- card metadata
- clarification answers

AI block có hành vi:
- loading state
- error state
- retry state
- preloaded analysis state
- login gate
- quota gate

### Inference

- Backend có khả năng gọi Gemini hoặc một LLM thông qua PHP proxy.
- Frontend không gọi thẳng API key AI từ client.
- Clarification questions được thêm vào payload để nâng mức độ “cá nhân hóa” của AI synthesis.

## 10. Quota, paywall và monetization mechanics

### Confirmed từ UI/source

- Có giới hạn reading miễn phí theo ngày.
- Có cảnh báo khi hỏi lại cùng một theme trong ngày.
- Có gói trả phí:
  - tier phổ biến
  - tier vô hạn
- Có thông điệp anonymous quota và khuyến khích login.
- Có donate QR.

### Product meaning

Đây là một mô hình freemium:
- low-friction entry
- free local experience
- AI premium interpretation làm điểm bán hàng
- login để tăng retention
- quota để tạo scarcity

## 11. Feature details có giá trị sao chép về mặt sản phẩm

### 11.1 Daily draw

Thành phần:
- floating widget
- modal
- flip card
- message trong ngày

Giá trị:
- retention hằng ngày
- mở cửa để quay lại app
- không cần friction cao như full reading

### 11.2 Clarification questions

Thành phần:
- hỏi 3 hoặc 5 câu
- random theo theme
- có skip / replace
- progress bar

Giá trị:
- tăng cảm giác AI “hiểu mình”
- tăng token input cho AI
- tăng ritualization
- tạo khác biệt so với random tarot site

### 11.3 History replay

Thành phần:
- local save
- remote merge khi login
- replay analysis
- delete item
- delete all
- date filter
- pagination

Giá trị:
- retention
- feeling of personal archive
- tạo habit và revisit loop

### 11.4 Public share link

Thành phần:
- tạo link public
- open qua `?share=...`
- copy link

Giá trị:
- acquisition qua social sharing
- viral loop nhẹ

### 11.5 Dictionary

Thành phần:
- search
- major/minor arcana
- card detail modal

Giá trị:
- SEO / utility
- tăng time-on-site
- tạo lý do quay lại ngoài reading

### 11.6 Top topics chart

Thành phần:
- popup chart
- dữ liệu aggregate từ backend

Giá trị:
- social proof
- “người khác cũng đang lo lắng điều này”
- tăng curiosity

## 12. Theme taxonomy và content model

Theme level 1 xác nhận:
- love
- career
- finance
- health
- self
- general

Trong source còn có nhiều sub-theme / labels, ví dụ:
- ex
- current_love
- ambiguous
- crush
- future_love
- marriage
- breakup
- soulmate
- friendship
- family
- career_change
- interview
- business
- startup
- finance
- investment
- debt
- savings
- real_estate
- health
- mental
- healing
- study
- spiritual
- karma
- dream
- lost_item
- more

### Gợi ý content schema nếu phát triển lại

Cho mỗi card:
- `id`
- `name`
- `name_vi`
- `number`
- `arcana`
- `image`
- `general_upright`
- `general_reversed`
- `keywords`
- `keywords_rev`
- `planet`
- `zodiac`
- `element`
- `numerology`
- `advice`
- `aspects[theme].upright`
- `aspects[theme].reversed`

Cho mỗi reading session:
- `user_name`
- `dob`
- `gender`
- `theme`
- `subtheme`
- `question`
- `spread`
- `cards[]`
- `clarifications[]`
- `analysis_markdown`
- `is_public`
- `created_at`

## 13. UX / product lessons có thể áp dụng

### Lesson 1: bán trải nghiệm, không chỉ bán kết quả

Site này thành công ở chỗ:
- build atmosphere
- build ceremony
- build anticipation
- rồi mới đưa ra kết quả

Nếu xây lại, đừng chỉ làm:
- chọn theme
- bấm generate
- hiện text

Cần có:
- pre-reading ritual
- progressive reveal
- cho user “tham gia” vào kết quả

### Lesson 2: metadata input cần có lý do cảm xúc

Web không chỉ hỏi tên/ngày sinh/giới tính một cách khô khan.
Nó frame thành:
- kết nối năng lượng
- cá nhân hóa thông điệp

Đây là bài học UX writing quan trọng.

### Lesson 3: AI cần được “dàn sân khấu”

AI analysis không hiện như chatbot.
Nó hiện như:
- thông điệp từ vũ trụ
- đã qua bộ lọc
- có nghi thức

Nếu phát triển lại, presentation layer quan trọng ngang model layer.

### Lesson 4: local-first + remote sync là cân bằng hợp lý

Local history:
- nhanh
- không cần login ngay

Remote history:
- đồng bộ
- share
- retention

Đây là pattern rất hợp lý cho consumer app.

### Lesson 5: free utility + premium depth

Miễn phí:
- xem cơ bản
- daily draw
- một số reading

Trả phí:
- AI analysis sâu hơn
- quota cao hơn
- no ads
- premium interpretation

Đây là cấu trúc monetization để áp dụng lại.

## 14. Điểm mạnh của sản phẩm này

- Visual identity rất rõ.
- Mood nhất quán.
- Flow có tính “nghi lễ”.
- Có nhiều retention hooks.
- Khả năng social sharing.
- AI được đóng gói thành premium value.
- Dataset tarot được enrich hơn mức tối thiểu.

## 15. Điểm yếu / rủi ro kỹ thuật và sản phẩm

### Kỹ thuật

- Frontend vanilla JS + global namespace sẽ khó scale.
- `data.js` quá lớn, gây nặng payload.
- Dataset ship full xuống client có thể dễ bị scrape.
- Nhiều JS/CSS lớn trong 1 app có thể gây khó maintain.
- Nếu không có cache/chunking tốt, first load có thể nặng.

### Bảo mật / dữ liệu

- Session trong browser storage cần quan tâm XSS risk.
- API remote cần được bảo vệ quota và auth.
- Public share reading cần cân nhắc privacy.

### Product

- Quá nhiều theatrical effects có thể tăng bounce nếu user muốn speed.
- Friction cao ở form nhiều bước nếu SEO traffic là cold traffic.

## 16. Gợi ý kiến trúc xây dựng phiên bản của riêng bạn

## 16.1 MVP để học nhanh

Nên có:
- landing rất rõ thông điệp
- 3 theme chính đầu tiên
- 1-card, 3-card, 5-card spreads
- card database có schema chuẩn
- local history
- AI interpretation
- daily draw
- share link

Không cần ngay:
- top topics chart
- remote history merge
- premium tiers phức tạp
- dictionary đầy đủ

## 16.2 Version nâng cấp

Thêm sau:
- login
- remote history
- clarification questions
- quota + pricing
- dictionary
- analytics dashboard
- payment

## 16.3 Gợi ý công nghệ

Nếu xây mới, nên ưu tiên:
- React / Next.js hoặc Vue / Nuxt
- server-side API route cho AI proxy
- PostgreSQL / MySQL cho readings và history
- object storage cho assets
- card dataset tách file / chunk / search index

Không nên copy pattern:
- global namespace module
- ship dataset quá lớn trong 1 file JS obfuscated

## 17. Checklist reverse-spec để implementation

### Product checklist

- [ ] Landing có mood rõ ràng
- [ ] Flow nhập thông tin 3-4 bước
- [ ] Theme và sub-theme taxonomy
- [ ] Chọn spread
- [ ] Card draw interaction
- [ ] Xuôi / ngược
- [ ] AI synthesis
- [ ] Clarification step
- [ ] Daily draw
- [ ] History
- [ ] Share result
- [ ] Login
- [ ] Quota / paywall

### Content checklist

- [ ] Tarot DB schema
- [ ] Card images
- [ ] Upright / reversed meaning
- [ ] Keyword sets
- [ ] Theme-specific interpretations
- [ ] Advice snippets
- [ ] Clarification question bank
- [ ] Daily message bank

### Technical checklist

- [ ] API auth
- [ ] Reading persistence
- [ ] Public share token
- [ ] Error states
- [ ] Loading states
- [ ] Analytics
- [ ] Rate limiting
- [ ] Mobile responsiveness
- [ ] Asset optimization

## 18. Nguồn và bằng chứng tham chiếu

Frontend gốc:
- `https://mystery-tarot.vercel.app/`

CSS:
- `https://mystery-tarot.vercel.app/style.css`

JS quan trọng:
- `https://mystery-tarot.vercel.app/js/app.js`
- `https://mystery-tarot.vercel.app/js/analysis.js`
- `https://mystery-tarot.vercel.app/js/history.js`
- `https://mystery-tarot.vercel.app/js/auth.js`
- `https://mystery-tarot.vercel.app/js/data.js`
- `https://mystery-tarot.vercel.app/js/daily.js`
- `https://mystery-tarot.vercel.app/js/daily_messages.js`
- `https://mystery-tarot.vercel.app/js/clarify_data.js`

Backend endpoints xác nhận từ frontend:
- `https://ka-en.com.vn/tarot_api/get_reading.php`
- `https://ka-en.com.vn/tarot_api/get_top_topics.php`
- `https://ka-en.com.vn/tarot_api/gemini_proxy.php`
- `https://ka-en.com.vn/tarot_api/make_public.php`
- `https://ka-en.com.vn/tarot_api/get_history.php`
- `https://ka-en.com.vn/tarot_api/delete_reading.php`
- `https://ka-en.com.vn/tarot_api/delete_all_readings.php`

## 19. Kết luận thực dụng

Nếu tóm lại, web này không chỉ là “tarot site”.
Nó là một consumer web app có công thức:

- dark premium mystical branding
- ritualized multi-step onboarding
- tarot dataset enrich
- AI explanation layer
- daily retention loop
- local-first history
- remote sync / share
- freemium monetization

Nếu muốn phát triển một sản phẩm học từ nó, hãy copy:
- structure sản phẩm
- logic retention
- thông điệp UX
- architecture dữ liệu

Không nên copy:
- text gốc
- assets gốc
- card art gốc
- một-một giao diện / source

Hãy xem đây là bộ reverse-spec để tự xây bản riêng, tốt hơn, gọn hơn, scale được hơn.
