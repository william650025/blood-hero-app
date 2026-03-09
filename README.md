# 🩸 捐血勇士 Blood Hero

> 台灣捐血者的一站式管理工具 — 紀錄捐血歷程、查詢捐血站、追蹤成就

[![CI](https://github.com/william650025/blood-hero-app/actions/workflows/ci.yml/badge.svg)](https://github.com/william650025/blood-hero-app/actions)

## 📖 簡介

**捐血勇士**是一款專為台灣捐血者打造的 Progressive Web App（PWA），提供：

- 📋 **捐血紀錄管理** — 記錄每次捐血的日期、類型、地點
- ⏰ **下次可捐計算** — 根據捐血類型與性別自動計算下次可捐日期
- 🗺 **全台捐血地圖** — 查詢全台 39+ 個固定捐血站，支援地區篩選
- 📅 **捐血活動** — 瀏覽近期捐血活動資訊
- 🏆 **成就系統** — 7 個勳章等級，激勵持續捐血
- 📱 **PWA 安裝** — 可安裝到手機桌面，類似原生 App 體驗

## 🖼 功能截圖

| 首頁 Dashboard | 捐血紀錄 | 捐血地圖 | 成就系統 |
|:-:|:-:|:-:|:-:|
| 捐血狀態 · 統計 | CRUD 管理 | 地圖 / 列表 | 勳章 · 進度 |

## 🚀 快速開始

### 環境需求

- Node.js 22+
- npm 10+
- [Supabase](https://supabase.com) 專案（免費方案即可）

### 安裝與執行

```bash
# 1. Clone 專案
git clone https://github.com/william650025/blood-hero-app.git
cd blood-hero-app

# 2. 安裝依賴
npm install

# 3. 設定環境變數
cp .env.example .env.local
# 編輯 .env.local 填入 Supabase keys

# 4. 初始化資料庫
# 到 Supabase Dashboard → SQL Editor，執行 supabase/migrations/ 中的 SQL

# 5. 啟動開發伺服器
npm run dev
```

瀏覽器開啟 [http://localhost:3000](http://localhost:3000)

### 環境變數

| 變數名稱 | 說明 | 必要 |
|----------|------|:----:|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 專案 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key（Cron 用） | ✅ |
| `NEXT_PUBLIC_SITE_URL` | 網站 URL（OAuth callback 用） | ✅ |
| `CRON_SECRET` | Cron Job 認證密鑰 | 選填 |

## 🛠 技術棧

| 類別 | 技術 |
|------|------|
| **框架** | Next.js 16 (App Router, Turbopack) |
| **語言** | TypeScript 5 |
| **UI** | Tailwind CSS 4 + shadcn/ui |
| **狀態管理** | Zustand |
| **資料庫** | Supabase (PostgreSQL) |
| **認證** | Supabase Auth (Email + Google OAuth) |
| **地圖** | Leaflet + OpenStreetMap |
| **地理編碼** | Nominatim (OSM) |
| **測試** | Vitest + Testing Library |
| **CI/CD** | GitHub Actions |
| **部署** | Vercel |
| **PWA** | Web App Manifest + Icons |

## 📁 專案結構

```
blood-hero-app/
├── .github/workflows/     # CI pipeline
├── public/
│   ├── icons/             # PWA 圖示
│   └── manifest.json      # PWA 設定
├── supabase/
│   └── migrations/        # 資料庫 Schema
├── src/
│   ├── app/
│   │   ├── (auth)/        # 登入 / 註冊頁面
│   │   ├── (main)/        # 主要功能頁面
│   │   │   ├── achievements/
│   │   │   ├── events/
│   │   │   ├── map/
│   │   │   └── records/
│   │   ├── api/cron/      # Cron Job API
│   │   └── profile/       # 個人資料
│   ├── components/
│   │   ├── layout/        # Header, BottomNav
│   │   ├── map/           # MapView
│   │   ├── records/       # DonationForm
│   │   └── ui/            # shadcn/ui 元件
│   ├── lib/
│   │   ├── actions/       # Server Actions (CRUD)
│   │   ├── scrapers/      # 資料爬蟲
│   │   └── supabase/      # Supabase Client
│   ├── stores/            # Zustand Stores
│   └── __tests__/         # 測試
├── .env.example
├── vercel.json            # Vercel Cron 設定
└── vitest.config.ts
```

## 📊 指令

| 指令 | 說明 |
|------|------|
| `npm run dev` | 啟動開發伺服器 |
| `npm run build` | 建置生產版本 |
| `npm run start` | 啟動生產伺服器 |
| `npm run lint` | ESLint 檢查 |
| `npm test` | 執行測試 |
| `npm run test:watch` | 測試監聽模式 |

## 🩸 台灣捐血間隔規則

| 捐血類型 | 男性間隔 | 女性間隔 |
|----------|----------|----------|
| 全血 250ml | 2 個月 (60 天) | 3 個月 (90 天) |
| 全血 500ml | 3 個月 (90 天) | 4 個月 (120 天) |
| 分離術血小板 | 2 週 (14 天) | 2 週 (14 天) |
| 分離術白血球 | 1 個月 (30 天) | 1 個月 (30 天) |

## 🗺 捐血站資料來源

- **固定捐血站（39 站）**：台灣血液基金會官網 (blood.org.tw) 手動整理
- **台中巡迴捐血車**：台中市政府開放資料平台 API 自動同步
- **地理編碼**：OpenStreetMap Nominatim

覆蓋地區：台北、新北、基隆、桃園、新竹、台中、彰化、南投、雲林、嘉義、台南、高雄、屏東、宜蘭、花蓮、台東

## 📄 授權

MIT License

## 🙏 致謝

- [台灣血液基金會](https://www.blood.org.tw) — 捐血站資料
- [台中市政府開放資料平台](https://opendata.taichung.gov.tw) — 巡迴捐血車 API
- [OpenStreetMap](https://www.openstreetmap.org) — 地圖圖磚與地理編碼
