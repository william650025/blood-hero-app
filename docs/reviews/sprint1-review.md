# Sprint 1 Code Review Report

**審查者**: Daniel (Code Reviewer)  
**日期**: 2026-03-09  
**分支**: `dev`  

---

## 總結: ⚠️ APPROVED WITH SUGGESTIONS

整體程式碼品質良好，架構清晰，團隊遵循了 Next.js App Router 的最佳實踐。有 **2 個必須修復** 的安全/正確性問題，以及多項建議改善。修復 Critical 項目後即可合併。

---

## 各維度評分

| 維度 | 評分 | 說明 |
|------|------|------|
| 程式碼品質 | ✅ 通過 | 命名規範一致，結構清晰，可讀性佳 |
| TypeScript | ⚠️ 建議改善 | 型別定義完整，但部分地方可更嚴謹 |
| 安全性 | ❌ 必須修復 | OAuth redirectTo 設定有誤；middleware 路由匹配有 bug |
| 效能 | ⚠️ 建議改善 | 部分 `'use client'` 可避免；字型載入可優化 |
| 錯誤處理 | ⚠️ 建議改善 | 基礎錯誤處理已做，但缺少 loading/error boundary |
| 架構 | ✅ 通過 | 檔案組織清楚，關注點分離得當 |
| 最佳實踐 | ⚠️ 建議改善 | 大部分遵循 App Router 最佳實踐，有幾處可改進 |

---

## 具體問題

### ❌ 必須修復 (Critical)

#### C1: OAuth redirectTo 指向錯誤 — `src/lib/auth.ts`
**嚴重性**: ❌ 安全性 + 功能性  
**開發者**: Marcus

```typescript
// ❌ 目前寫法 — 指向 Supabase URL 而非應用 URL
redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback`,

// ✅ 應改為應用自己的 callback URL
redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
```

**原因**: Google OAuth 完成後需要回到應用程式的 URL，而不是 Supabase 的 URL。目前的寫法會導致 OAuth 流程斷裂，使用者無法完成 Google 登入。需要：
1. 新增 `NEXT_PUBLIC_APP_URL` 環境變數（或用 `NEXT_PUBLIC_SITE_URL`）
2. 建立 `/auth/callback/route.ts` 來處理 OAuth code exchange

---

#### C2: Middleware 路由匹配 bug — `src/lib/supabase/middleware.ts`
**嚴重性**: ❌ 功能性  
**開發者**: Marcus

```typescript
// ❌ 目前寫法 — Next.js 路由組 (main) 不會出現在 URL 中
if (!user && request.nextUrl.pathname.startsWith('/(main)')) {

// ✅ 實際 URL 是 /、/records、/map 等，不含 (main)
// 應比對實際 URL path，或改用 middleware matcher
if (!user && !request.nextUrl.pathname.startsWith('/login') && 
    !request.nextUrl.pathname.startsWith('/register')) {
```

**原因**: Next.js route groups（如 `(main)`、`(auth)`）不會反映在實際 URL 路徑中。`/(main)/` 永遠不會匹配任何請求，導致**所有受保護路由都不受保護**。這是一個嚴重的認證繞過 bug。

---

### ⚠️ 建議改善 (Suggestions)

#### S1: `getSession()` 應使用 `getUser()` — `src/lib/auth.ts`
**開發者**: Marcus

```typescript
// ⚠️ getSession() 從 local storage 讀取 JWT，未向 Supabase Auth 伺服器驗證
const { data: { session } } = await supabase.auth.getSession();

// ✅ getUser() 會向 Auth 伺服器驗證，更安全
const { data: { user } } = await supabase.auth.getUser();
```

Supabase 官方文件建議在 Server Component 中使用 `getUser()` 而非 `getSession()`，因為後者不會驗證 JWT。

---

#### S2: 註冊時未儲存 gender/bloodType — `src/app/(auth)/register/page.tsx` + `src/lib/auth.ts`
**開發者**: Emily + Marcus

註冊第二步收集了 `gender` 和 `bloodType`，但 `signUp()` 只傳了 `displayName`。這些欄位收集了卻沒有存入 DB（profiles 表有這些欄位）。

建議將 `gender` 和 `bloodType` 加入 `signUp` 的 `user_metadata`，並在 `handle_new_user()` trigger 中一併寫入 profiles。

---

#### S3: `update_updated_at()` 函式缺少 `security definer` + `search_path` — Schema SQL
**開發者**: Marcus

```sql
-- ⚠️ 目前
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$

-- ✅ 建議加上，與 handle_new_user 一致
create or replace function public.update_updated_at()
returns trigger language plpgsql
security definer set search_path = ''
as $$
```

---

#### S4: Dashboard 使用 mock user 而非 auth store — `src/app/(main)/page.tsx`
**開發者**: Emily

```typescript
// ⚠️ 硬編碼 mock data
const mockUser = { displayName: '小明', gender: 'male' as const };
```

雖然註解提到 Sprint 2 會改，但 `useAuthStore` 已經存在。建議至少在 Sprint 1 就接入 auth store，或加上 `// TODO: Sprint 2` 明確標記。

---

#### S5: placeholder 頁面可改為 Server Component
**開發者**: Emily

`map/page.tsx`、`events/page.tsx`、`achievements/page.tsx`、`records/page.tsx`、`records/new/page.tsx` 都標記了 `'use client'`，但這些 placeholder 頁面沒有任何互動邏輯（沒有 state、沒有 event handler）。移除 `'use client'` 可減少 client bundle size。

---

#### S6: PWA manifest 缺少 192x192 和 512x512 icons
**開發者**: Emily

```json
// ⚠️ 目前只有 favicon
"icons": [{ "src": "/favicon.ico", "sizes": "64x64" }]

// ✅ PWA 安裝需要至少 192x192 和 512x512 的圖示
```

沒有正確的 icon sizes，PWA 安裝提示不會出現。

---

#### S7: `donation-rules.ts` 的 `calculateNextEligibleDate` 未正規化時間
**開發者**: Marcus

```typescript
export function calculateNextEligibleDate(...): Date {
  const nextDate = new Date(donationDate);
  nextDate.setDate(nextDate.getDate() + intervalDays);
  return nextDate;
  // ⚠️ 如果 donationDate 帶有時間部分，計算結果可能不準確
  // 建議加上 nextDate.setHours(0, 0, 0, 0);
}
```

`isEligibleToday` 正確地正規化了 `today`，但 `nextEligible` 可能帶有非零時間，導致邊界日期判斷偏差。

---

### 💡 改進建議 (Nice to have)

#### N1: 考慮加入 Zod 做表單驗證
目前登入/註冊的驗證邏輯散落在 component 中（手動 `includes('@')`、`length < 6`）。引入 Zod schema 可以集中管理驗證規則並提供更好的型別推斷。

#### N2: 加入 `loading.tsx` 和 `error.tsx`
App Router 支援的 loading/error boundary 檔案尚未建立。建議至少為 `(main)` 路由組加上，提升使用者體驗。

#### N3: BottomNav safe area 處理
```typescript
// 目前 fixed bottom-0，在有 Home Indicator 的裝置（iPhone X+）可能被遮擋
// 建議加上 pb-safe 或使用 env(safe-area-inset-bottom)
```

#### N4: `useDonationStore` 的 mock data 應標記更明顯
Mock data 直接寫在 store 初始值中，未來接入 API 時容易遺忘清除。建議用 `// MOCK:` 前綴或獨立到 `__mocks__/` 目錄。

#### N5: 環境變數型別安全
多處使用 `process.env.NEXT_PUBLIC_SUPABASE_URL!` 非空斷言。建議建立 `src/lib/env.ts` 統一管理環境變數驗證（可用 `zod` 或 `@t3-oss/env-nextjs`）。

#### N6: `blood_stations` 的 `lat`/`lng` 建議使用 `double precision` 而非 `numeric`
`numeric` 型別會有精度和效能的 trade-off，地理座標一般使用 `double precision`（或未來使用 PostGIS `geography`）。

---

## 各模組審查

### Backend (Marcus)

**整體評價**: ⭐⭐⭐⭐ 良好

| 檔案 | 評價 | 備註 |
|------|------|------|
| `supabase/client.ts` | ✅ | 簡潔正確，遵循 Supabase SSR 文件 |
| `supabase/server.ts` | ✅ | Cookie 處理正確，`setAll` catch 合理 |
| `supabase/middleware.ts` | ❌ | 路由匹配 bug（C2）；其餘 session refresh 邏輯正確 |
| `middleware.ts` | ✅ | Matcher 設定合理 |
| `auth.ts` | ❌ | OAuth redirectTo 錯誤（C1）；getSession 不夠安全（S1） |
| `donation-rules.ts` | ✅ | 邏輯清晰，型別安全，規則正確。小改善見 S7 |
| `initial_schema.sql` | ✅ | Schema 設計合理，RLS 完整正確，trigger 適當 |

**亮點**:
- RLS 策略覆蓋完整，每張表都啟用了 RLS
- `handle_new_user` trigger 使用 `security definer` + 空 `search_path`，安全做法
- 捐血間隔邏輯封裝良好，型別驅動

---

### UI/Design (Aria)

**整體評價**: ⭐⭐⭐⭐⭐ 優秀

| 檔案 | 評價 | 備註 |
|------|------|------|
| `globals.css` | ✅ | 完整的 design token 系統，light/dark mode 支援 |
| `layout.tsx` | ✅ | 字體載入正確，metadata/viewport 配置完善 |
| `components.json` | ✅ | shadcn/ui 配置正確 |

**亮點**:
- 色彩系統設計出色：primary（暖紅=捐血）、secondary（琥珀）、accent（金=成就）語義清晰
- 完整的語義色（success/warning/error/info）
- 正確使用 Tailwind v4 的 `@theme` 語法
- 字體層級合理：Noto Sans TC（中文）+ Geist（英文/UI）

---

### Frontend (Emily)

**整體評價**: ⭐⭐⭐⭐ 良好

| 檔案 | 評價 | 備註 |
|------|------|------|
| Login page | ✅ | UI 完整，表單驗證合理，Google 登入整合 |
| Register page | ⚠️ | 收集了 gender/bloodType 卻未傳給 backend（S2） |
| Main layout | ✅ | 簡潔乾淨 |
| Dashboard | ⚠️ | Mock user 硬編碼（S4），但功能邏輯完整 |
| Placeholder pages | ⚠️ | 不必要的 `'use client'`（S5） |
| BottomNav | ✅ | 路由 active 判斷正確，UI 符合 mobile-first |
| Header | ✅ | 簡潔且可復用 |
| useAuthStore | ✅ | Zustand store 設計合理，型別完整 |
| useDonationStore | ⚠️ | Mock data 混在 production code 中（N4） |
| manifest.json | ⚠️ | 缺少 PWA 所需的 icon sizes（S6） |

**亮點**:
- 登入/註冊頁面的 UX 設計出色（密碼強度指示器、分步註冊）
- Zustand store 結構清晰，型別完整
- Dashboard 的捐血倒數計時 UI 與 donation-rules 整合正確
- 善用 shadcn/ui 元件保持一致性

---

## 行動項目摘要

| 優先級 | 項目 | 負責人 | 說明 |
|--------|------|--------|------|
| ❌ Critical | C1 | Marcus | 修正 OAuth redirectTo + 建立 callback route |
| ❌ Critical | C2 | Marcus | 修正 middleware 路由匹配邏輯 |
| ⚠️ Suggestion | S1 | Marcus | `getSession` → `getUser` |
| ⚠️ Suggestion | S2 | Emily + Marcus | 註冊時傳遞 gender/bloodType |
| ⚠️ Suggestion | S3 | Marcus | trigger 函式加 security definer |
| ⚠️ Suggestion | S5 | Emily | placeholder 頁面移除 'use client' |
| ⚠️ Suggestion | S6 | Emily | PWA icons 補齊 |
| ⚠️ Suggestion | S7 | Marcus | 日期正規化 |

---

*Review by Daniel — Code Reviewer*
