# 捐血勇士 Blood Hero — 開發規格書

> 版本：1.0  
> 最後更新：2026-03-09  
> 狀態：開發完成，待部署

---

## 1. 專案概述

### 1.1 目標
為台灣捐血者提供一站式的捐血管理 Web App，解決以下痛點：
- 不知道自己上次什麼時候捐血、下次什麼時候可以再捐
- 不知道離自己最近的捐血站在哪裡
- 缺乏捐血動力和成就感

### 1.2 目標用戶
- 台灣的定期捐血者
- 初次想嘗試捐血的人
- 想追蹤捐血紀錄的人

### 1.3 產品定位
- **類型**：Progressive Web App (PWA)
- **平台**：手機瀏覽器為主，桌面瀏覽器為輔
- **語言**：繁體中文
- **區域**：台灣

---

## 2. 功能規格

### 2.1 使用者認證

| 功能 | 說明 |
|------|------|
| Email 註冊 | 輸入 Email + 密碼 + 顯示名稱 + 性別 + 血型 |
| Email 登入 | Email + 密碼 |
| Google OAuth | 一鍵 Google 登入 |
| 登出 | 清除 Session 並導回登入頁 |
| Session 管理 | 透過 Middleware 自動檢查，未登入自動導至 /login |

**註冊流程**：兩步驟設計
1. Step 1：Email、密碼、確認密碼（含密碼強度指示器）
2. Step 2：姓名、性別（男/女選擇）、血型（A/B/O/AB 選擇）

### 2.2 Dashboard（首頁）

| 區塊 | 說明 |
|------|------|
| 問候語 | 顯示使用者名稱 |
| 捐血狀態卡 | 若可捐血：綠色「你現在可以捐血！」；若不可：顯示距離下次可捐的天數 |
| 上次捐血紀錄 | 日期、類型、地點 |
| 快捷操作 | 新增紀錄、找捐血站、查活動（3 宮格） |
| 累計統計 | 捐血次數、總 cc 數 |

**資料來源**：從 Supabase 即時查詢，無 mock 資料

### 2.3 捐血紀錄管理

#### 紀錄列表頁 `/records`
- 按日期倒序排列所有捐血紀錄
- 每筆紀錄顯示：日期、捐血類型（Badge）、地點、備註
- 每筆紀錄有「編輯」和「刪除」按鈕
- 刪除前彈出確認 Dialog
- 無紀錄時顯示空狀態引導

#### 新增紀錄頁 `/records/new`
| 欄位 | 類型 | 必填 | 說明 |
|------|------|:----:|------|
| 捐血日期 | Date picker | ✅ | 不可選未來日期 |
| 捐血類型 | Select | ✅ | 全血250/全血500/血小板/白血球 |
| 捐血地點 | Text | ❌ | 自由輸入 |
| 備註 | Textarea | ❌ | 自由輸入 |

- 送出後自動計算 `next_eligible_date`（根據使用者性別 + 捐血類型）
- 成功後導回紀錄列表頁 + Toast 通知

#### 編輯紀錄頁 `/records/[id]/edit`
- 與新增相同的表單，預填現有資料
- 更新後重新計算 `next_eligible_date`

### 2.4 捐血地圖

#### 地圖模式 `/map`
- 使用 Leaflet + OpenStreetMap 圖磚
- 預設顯示台灣全島（中心點約 23.7°N, 120.9°E，zoom 7）
- 每個捐血站以 Marker 標示
- 點擊 Marker 彈出 Popup：站名、地址、電話（可撥打）、營業時間

#### 列表模式
- Card 列表顯示所有捐血站
- 顯示：站名、類型 Badge（捐血站/捐血車）、地址、電話、營業時間

#### 地區篩選
- 下拉選單可選擇 17 個地區：全部、台北、新北、基隆、桃園、新竹、台中、彰化、南投、雲林、嘉義、台南、高雄、屏東、宜蘭、花蓮、台東
- 篩選後即時更新地圖 Markers 和列表

#### 資料來源
- **固定捐血站（39 站）**：手動整理自 blood.org.tw
- **台中巡迴捐血車**：台中市開放資料 API 自動同步
- **座標取得**：Nominatim 地理編碼（建站時批次處理）

### 2.5 捐血活動

#### 活動列表 `/events`
- 按開始日期升序排列
- 每個活動卡片顯示：
  - 標題
  - 說明
  - 日期範圍（起迄日）
  - 地點
  - 主辦單位
  - 「即將舉辦」Badge（若 start_date > today）
  - 外部連結按鈕
- 卡片頂部有彩色條（即將舉辦=紅色，已過=灰色）

#### 資料來源
- 目前使用範例資料（4 筆）
- 預留 Supabase `donation_events` 資料表接口
- 未來可透過 Cron Job 從 blood.org.tw 爬取

### 2.6 成就系統

#### 勳章列表 `/achievements`

| 勳章 | 圖示 | 條件 |
|------|:----:|------|
| 初心者 | 🩸 | 捐血 1 次 |
| 熱血青年 | 🔥 | 捐血 3 次 |
| 捐血達人 | ⭐ | 捐血 5 次 |
| 捐血英雄 | 🏅 | 捐血 10 次 |
| 捐血勇士 | 🏆 | 捐血 20 次 |
| 生命守護者 | 💎 | 捐血 50 次 |
| 傳奇捐血者 | 👑 | 捐血 100 次 |

- 頂部顯示解鎖進度（X / 7 已解鎖）和累計捐血次數
- 已解鎖勳章：金色背景 + 圖示 + 「已解鎖」Badge
- 未解鎖勳章：灰色半透明 + 鎖頭圖示 + 進度條

### 2.7 個人資料

#### 個人資料頁 `/profile`
- 顯示頭像（預設圖示）、姓名、血型、性別、Email
- 「編輯個人資料」按鈕展開編輯表單
- 可編輯：顯示名稱、性別、血型
- 登出按鈕

---

## 3. 捐血間隔規則引擎

### 3.1 規則定義

| 捐血類型 | 代碼 | 男性間隔（天） | 女性間隔（天） |
|----------|------|:-:|:-:|
| 全血 250ml | `whole_250` | 60 | 90 |
| 全血 500ml | `whole_500` | 90 | 120 |
| 分離術血小板 | `platelet` | 14 | 14 |
| 分離術白血球 | `leukocyte` | 30 | 30 |

### 3.2 計算邏輯
1. `calculateNextEligibleDate(donationDate, donationType, gender)` → 下次可捐日期
2. `isEligibleToday(lastDate, lastType, gender)` → 今天是否可捐（boolean）
3. `getDaysUntilEligible(lastDate, lastType, gender)` → 距離下次可捐天數（≥0）

### 3.3 日期處理
- 所有日期統一正規化為 00:00:00.000 避免跨日邊界問題
- Server Action 中的日期以 ISO 字串格式傳遞（`YYYY-MM-DD`）

---

## 4. 資料庫設計

### 4.1 資料表

| 資料表 | 說明 | RLS |
|--------|------|:---:|
| `profiles` | 使用者基本資料（擴展 auth.users） | ✅ 自己的資料 |
| `donation_records` | 捐血紀錄 | ✅ 自己的紀錄 |
| `blood_stations` | 捐血站 | ✅ 公開可讀 |
| `donation_events` | 捐血活動 | ✅ 公開可讀 |
| `achievements` | 成就定義 | ✅ 公開可讀 |
| `user_achievements` | 使用者已解鎖成就 | ✅ 自己的成就 |

### 4.2 profiles

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | UUID (PK, FK → auth.users) | 使用者 ID |
| `display_name` | TEXT | 顯示名稱 |
| `gender` | TEXT (male/female) | 性別 |
| `blood_type` | TEXT (A/B/O/AB) | 血型 |
| `created_at` | TIMESTAMPTZ | 建立時間 |
| `updated_at` | TIMESTAMPTZ | 更新時間 |

### 4.3 donation_records

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | UUID (PK) | 紀錄 ID |
| `user_id` | UUID (FK → profiles) | 使用者 ID |
| `donation_date` | DATE | 捐血日期 |
| `donation_type` | TEXT | 捐血類型 |
| `location_name` | TEXT | 捐血地點 |
| `notes` | TEXT | 備註 |
| `next_eligible_date` | DATE | 下次可捐日期（自動計算） |
| `created_at` | TIMESTAMPTZ | 建立時間 |
| `updated_at` | TIMESTAMPTZ | 更新時間 |

### 4.4 blood_stations

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | UUID (PK) | 站點 ID |
| `name` | TEXT | 站名 |
| `address` | TEXT | 地址 |
| `lat` | NUMERIC | 緯度 |
| `lng` | NUMERIC | 經度 |
| `phone` | TEXT | 電話 |
| `operating_hours` | TEXT | 營業時間 |
| `station_type` | TEXT (fixed_station/mobile_bus) | 類型 |
| `source_url` | TEXT | 資料來源 |
| `last_synced_at` | TIMESTAMPTZ | 最後同步時間 |

### 4.5 Triggers
- `on_auth_user_created`：新使用者註冊時自動建立 profiles 記錄（含 display_name, gender, blood_type）
- `profiles_updated_at`：profiles 更新時自動設定 updated_at
- `donation_records_updated_at`：donation_records 更新時自動設定 updated_at

### 4.6 Indexes
- `idx_donation_records_user_id` — 加速使用者紀錄查詢
- `idx_donation_records_date` — 加速日期排序
- `idx_user_achievements_user_id` — 加速成就查詢
- `idx_blood_stations_type` — 加速站點類型篩選
- `idx_donation_events_dates` — 加速活動日期篩選

---

## 5. API 設計

### 5.1 Server Actions（Next.js）

所有資料操作使用 Next.js Server Actions（`'use server'`），不另設 REST API。

#### 捐血紀錄 `src/lib/actions/donations.ts`
| Action | 說明 |
|--------|------|
| `fetchDonationRecords()` | 取得當前使用者所有紀錄（按日期倒序） |
| `createDonationRecord(data)` | 新增紀錄 + 自動計算 next_eligible_date |
| `updateDonationRecord(id, data)` | 更新紀錄 + 重新計算 next_eligible_date |
| `deleteDonationRecord(id)` | 刪除紀錄 |
| `fetchDonationStats()` | 取得統計（次數、總量、最近一筆） |
| `fetchSingleRecord(id)` | 取得單筆紀錄（編輯用） |

#### 個人資料 `src/lib/actions/profile.ts`
| Action | 說明 |
|--------|------|
| `fetchProfile()` | 取得當前使用者 profile + email |
| `updateProfile(data)` | 更新 display_name / gender / blood_type |

#### 捐血站 `src/lib/actions/stations.ts`
| Action | 說明 |
|--------|------|
| `fetchBloodStations(region?)` | 從 DB 取得捐血站（可選地區篩選） |
| `getDefaultStations()` | 取得預設捐血站資料（DB 為空時的 fallback） |

#### 活動 `src/lib/actions/events.ts`
| Action | 說明 |
|--------|------|
| `fetchDonationEvents()` | 取得未來的捐血活動 |

#### 成就 `src/lib/actions/achievements.ts`
| Action | 說明 |
|--------|------|
| `fetchAchievementsWithStatus()` | 取得所有成就 + 使用者解鎖狀態 + 捐血次數 |

### 5.2 Cron API

| 端點 | 方法 | 說明 |
|------|------|------|
| `/api/cron/sync-stations` | GET | 同步捐血站資料（每週一 03:00 UTC） |

- 認證：`Authorization: Bearer <CRON_SECRET>`
- 流程：從開放資料 API 抓取 → 地理編碼 → Upsert 到 Supabase
- 使用 `SUPABASE_SERVICE_ROLE_KEY` 繞過 RLS

---

## 6. 前端架構

### 6.1 路由結構

| 路由 | 頁面 | 認證 |
|------|------|:----:|
| `/login` | 登入 | ❌ 公開 |
| `/register` | 註冊 | ❌ 公開 |
| `/auth/callback` | OAuth 回調 | ❌ 公開 |
| `/` | Dashboard | ✅ 需登入 |
| `/records` | 捐血紀錄列表 | ✅ 需登入 |
| `/records/new` | 新增紀錄 | ✅ 需登入 |
| `/records/[id]/edit` | 編輯紀錄 | ✅ 需登入 |
| `/map` | 捐血地圖 | ✅ 需登入 |
| `/events` | 捐血活動 | ✅ 需登入 |
| `/achievements` | 成就系統 | ✅ 需登入 |
| `/profile` | 個人資料 | ✅ 需登入 |

### 6.2 Layout 結構
- **Root Layout**：Noto Sans TC 字體 + Toaster
- **(main) Layout**：max-w-md 容器 + BottomNav 底部導航
- **(auth) Layout**：全螢幕居中

### 6.3 設計系統
- **主色調**：暖紅色 `primary-600: #dc2626`（捐血主題）
- **輔色**：琥珀色 `secondary-600: #d97706`
- **成就色**：金色 `accent-400: #facc15`
- **語義色**：success / warning / error / info
- **字體**：Noto Sans TC（中文）+ Geist（英文）
- **元件庫**：shadcn/ui（Button, Card, Badge, Dialog, Select, Input, Label）

### 6.4 狀態管理
- Zustand Store：`useDonationStore`（本地快取用）
- 主要資料流：Server Actions 直接查詢 Supabase → 頁面 state

---

## 7. 資料同步機制

### 7.1 捐血站同步 Cron Job

```
觸發時機：每週一 UTC 03:00（台灣時間 11:00）
    ↓
從台中開放資料 API 抓取巡迴捐血車 XML
    ↓
合併固定捐血站資料（39 站）
    ↓
對沒有座標的站點進行 Nominatim 地理編碼
    ↓
Upsert 到 Supabase blood_stations 表
    ↓
回傳統計：新增/更新/地理編碼筆數
```

### 7.2 地理編碼
- 使用 OpenStreetMap Nominatim API
- 嚴格遵守 1 request/sec 速率限制
- 記憶體快取避免重複請求
- User-Agent: `BloodHero/1.0`

---

## 8. 安全設計

### 8.1 認證與授權
- Supabase Auth 處理所有認證邏輯
- Middleware 攔截未登入請求，導至 `/login`
- 使用 `getUser()`（而非 `getSession()`）確保 token 驗證

### 8.2 Row Level Security (RLS)
- 所有資料表啟用 RLS
- 使用者只能存取自己的 profiles、donation_records、user_achievements
- blood_stations、donation_events、achievements 公開可讀
- Cron Job 使用 Service Role Key 繞過 RLS

### 8.3 Cron 端點保護
- 透過 `Authorization: Bearer <CRON_SECRET>` 認證
- 未通過認證回傳 401

### 8.4 Trigger 安全
- `handle_new_user` trigger 使用 `SECURITY DEFINER` + `SET search_path = ''`
- 防止 search_path 注入攻擊

---

## 9. 測試策略

### 9.1 單元測試（Vitest）

| 測試檔案 | 測試數 | 涵蓋範圍 |
|----------|:------:|----------|
| `donation-rules.test.ts` | 13 | 間隔規則、日期計算、資格判斷 |
| `blood-stations.test.ts` | 7 | 資料完整性、地區覆蓋、去重 |
| **合計** | **20** | |

### 9.2 CI Pipeline

```
push to dev/main 或 PR to main
    ↓
npm ci → npm run lint → npx tsc --noEmit → npm test → npm run build
```

### 9.3 未來測試計畫
- E2E 測試（Playwright）：登入流程、CRUD 操作、地圖互動
- API 測試：Server Actions 整合測試
- 視覺回歸測試

---

## 10. 部署架構

```
使用者 → Vercel Edge Network → Next.js App
                                    ↓
                              Supabase Cloud
                              (PostgreSQL + Auth)
                                    ↑
                        Vercel Cron → /api/cron/sync-stations
                                    ↓
                        台中開放資料 API + Nominatim
```

### 10.1 部署環境
- **前端 + API**：Vercel（自動從 GitHub main 分支部署）
- **資料庫**：Supabase Cloud（Southeast Asia region）
- **Cron**：Vercel Cron（每週一同步捐血站資料）

### 10.2 Git 分支策略
- `main`：穩定版本，部署到生產環境
- `dev`：開發分支，日常開發在此進行
- `feature/*`：功能分支，從 dev 分出
- `fix/*`：Bug 修復分支

---

## 11. 效能考量

- **Static Generation**：登入、註冊等不需要動態資料的頁面預渲染
- **Dynamic Rendering**：Dashboard、紀錄、地圖等需要即時資料的頁面動態渲染
- **Leaflet Dynamic Import**：地圖元件使用 `next/dynamic` 避免 SSR 問題
- **Supabase Indexes**：關鍵查詢欄位已建立索引
- **Nominatim 快取**：地理編碼結果快取避免重複請求

---

## 12. 版本歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| 0.1.0 | 2026-03-09 | 初始版本：全功能開發完成 |
