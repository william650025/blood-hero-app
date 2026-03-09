# 捐血勇士 (Blood Hero) — Design System

> 品牌調性：**溫暖、信任、鼓勵**
> 主題：血液捐贈 + 英雄

---

## 1. 色彩系統 (Color System)

### Primary — 暖紅色（捐血主題）

| Token | Light Mode | Dark Mode | 用途 |
|-------|-----------|-----------|------|
| `primary-50` | `#fef2f2` | `#450a0a` | 背景淡色 |
| `primary-100` | `#fee2e2` | `#7f1d1d` | 淡色填充 |
| `primary-200` | `#fecaca` | `#991b1b` | 輕填充 / hover 狀態 |
| `primary-300` | `#fca5a5` | `#b91c1c` | border / icon |
| `primary-400` | `#f87171` | `#dc2626` | 次要強調 |
| `primary-500` | `#ef4444` | `#ef4444` | 品牌主色 |
| `primary-600` | `#dc2626` | `#f87171` | 按鈕 / CTA |
| `primary-700` | `#b91c1c` | `#fca5a5` | 按鈕 hover |
| `primary-800` | `#991b1b` | `#fecaca` | 深色文字 |
| `primary-900` | `#7f1d1d` | `#fee2e2` | 極深色 |
| `primary-950` | `#450a0a` | `#fef2f2` | 最深色 |

### Secondary — 溫暖琥珀色

| Token | Light Mode | Dark Mode | 用途 |
|-------|-----------|-----------|------|
| `secondary-50` | `#fffbeb` | `#451a03` | 背景淡色 |
| `secondary-100` | `#fef3c7` | `#78350f` | 淡色填充 |
| `secondary-200` | `#fde68a` | `#92400e` | 輕填充 |
| `secondary-300` | `#fcd34d` | `#b45309` | border |
| `secondary-400` | `#fbbf24` | `#d97706` | icon |
| `secondary-500` | `#f59e0b` | `#f59e0b` | 主色 |
| `secondary-600` | `#d97706` | `#fbbf24` | 按鈕 |
| `secondary-700` | `#b45309` | `#fcd34d` | hover |
| `secondary-800` | `#92400e` | `#fde68a` | 深色 |
| `secondary-900` | `#78350f` | `#fef3c7` | 極深色 |
| `secondary-950` | `#451a03` | `#fffbeb` | 最深色 |

### Accent — 金色（成就勳章）

| Token | Light Mode | Dark Mode | 用途 |
|-------|-----------|-----------|------|
| `accent-50` | `#fefce8` | `#422006` | 背景 |
| `accent-100` | `#fef9c3` | `#713f12` | 淡色 |
| `accent-200` | `#fef08a` | `#854d0e` | 輕填充 |
| `accent-300` | `#fde047` | `#a16207` | border |
| `accent-400` | `#facc15` | `#ca8a04` | 勳章底色 |
| `accent-500` | `#eab308` | `#eab308` | 勳章主色 |
| `accent-600` | `#ca8a04` | `#facc15` | 勳章深色 |
| `accent-700` | `#a16207` | `#fde047` | 強調 |
| `accent-800` | `#854d0e` | `#fef08a` | 深色 |
| `accent-900` | `#713f12` | `#fef9c3` | 極深色 |
| `accent-950` | `#422006` | `#fefce8` | 最深色 |

### Neutral — 灰階

| Token | Value | 用途 |
|-------|-------|------|
| `neutral-50` | `#fafafa` | 頁面背景 |
| `neutral-100` | `#f5f5f5` | 卡片背景 |
| `neutral-200` | `#e5e5e5` | 分隔線 |
| `neutral-300` | `#d4d4d4` | 邊框 |
| `neutral-400` | `#a3a3a3` | Placeholder |
| `neutral-500` | `#737373` | 次要文字 |
| `neutral-600` | `#525252` | 段落文字 |
| `neutral-700` | `#404040` | 標題文字 |
| `neutral-800` | `#262626` | 主要文字 |
| `neutral-900` | `#171717` | 深色背景文字 |
| `neutral-950` | `#0a0a0a` | 最深黑 |

### Semantic — 語意色彩

| 語意 | Light | Dark | 用途 |
|------|-------|------|------|
| **Success** | `#16a34a` | `#4ade80` | 捐血成功、目標達成 |
| `success-bg` | `#f0fdf4` | `#052e16` | 成功背景 |
| **Warning** | `#d97706` | `#fbbf24` | 即將到期提醒 |
| `warning-bg` | `#fffbeb` | `#451a03` | 警告背景 |
| **Error** | `#dc2626` | `#f87171` | 錯誤、刪除 |
| `error-bg` | `#fef2f2` | `#450a0a` | 錯誤背景 |
| **Info** | `#2563eb` | `#60a5fa` | 提示、引導 |
| `info-bg` | `#eff6ff` | `#172554` | 資訊背景 |

---

## 2. 字體系統 (Typography)

### 字型家族

| 用途 | 字體 | 備註 |
|------|------|------|
| 標題 | **Noto Sans TC Bold** (700) | 中文友好，Google Fonts |
| 內文 | **Noto Sans TC Regular** (400) | 中文友好 |
| 數字 / 強調 | **Geist** | 已內建於 Next.js |
| 等寬 | **Geist Mono** | 已內建 |

### 大小階層

| 層級 | 大小 | 行高 | 字重 | CSS Variable |
|------|------|------|------|-------------|
| h1 | 30px (1.875rem) | 36px | Bold (700) | `--text-h1` |
| h2 | 24px (1.5rem) | 32px | Bold (700) | `--text-h2` |
| h3 | 20px (1.25rem) | 28px | SemiBold (600) | `--text-h3` |
| body | 16px (1rem) | 24px | Regular (400) | `--text-body` |
| small | 14px (0.875rem) | 20px | Regular (400) | `--text-small` |
| caption | 12px (0.75rem) | 16px | Regular (400) | `--text-caption` |

---

## 3. 間距系統 (Spacing)

基準：**4px**

| Token | Value | 常見用途 |
|-------|-------|---------|
| `space-1` | 4px | 元素內部微間距 |
| `space-2` | 8px | 圖示與文字間距 |
| `space-3` | 12px | 表單元素間距 |
| `space-4` | 16px | 卡片內邊距 |
| `space-5` | 20px | 區塊間距 |
| `space-6` | 24px | 段落間距 |
| `space-8` | 32px | 區域間距 |
| `space-10` | 40px | 章節間距 |
| `space-12` | 48px | 大區塊間距 |
| `space-16` | 64px | 頁面頂部間距 |

---

## 4. 圓角 (Border Radius)

| Token | Value | 用途 |
|-------|-------|------|
| `radius-sm` | 6px | 小型按鈕、Badge |
| `radius-md` | 8px | 預設按鈕、Input |
| `radius-lg` | 12px | 卡片 |
| `radius-xl` | 16px | 大型卡片、Modal |
| `radius-full` | 9999px | 頭像、圓形按鈕 |

---

## 5. 陰影 (Shadows)

| Token | Value | 用途 |
|-------|-------|------|
| `shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | 按鈕、Badge |
| `shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` | 卡片、下拉選單 |
| `shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | Modal、浮動面板 |

---

## 6. 核心元件規範 (Core Components)

### 6.1 Button

#### 變體

| 變體 | 背景 | 文字 | 邊框 | 用途 |
|------|------|------|------|------|
| **Primary** | `primary-600` | 白色 | 無 | 主要行動（立即捐血、確認） |
| **Secondary** | 白色 | `primary-600` | `primary-300` | 次要行動（取消、返回） |
| **Ghost** | 透明 | `neutral-700` | 無 | 文字按鈕（更多、查看） |
| **Danger** | `error` | 白色 | 無 | 危險操作（刪除紀錄） |

#### 尺寸

| 尺寸 | 高度 | 內邊距 | 文字 | 圓角 |
|------|------|--------|------|------|
| **sm** | 32px | 12px 16px | 14px | `radius-md` |
| **md** | 40px | 12px 20px | 16px | `radius-md` |
| **lg** | 48px | 16px 24px | 16px | `radius-md` |

#### 狀態
- **Default**: 基本樣式
- **Hover**: 背景加深一階（如 primary-700）
- **Active/Pressed**: 背景再深一階（如 primary-800）
- **Disabled**: opacity 50%, cursor not-allowed
- **Loading**: 顯示 spinner 圖示，文字保留

---

### 6.2 Input

| 狀態 | 邊框 | 背景 | 說明 |
|------|------|------|------|
| **Default** | `neutral-300` | 白色 | 標準輸入框 |
| **Focus** | `primary-500` (ring) | 白色 | 聚焦時顯示 ring |
| **Error** | `error` | `error-bg` | 錯誤時紅色邊框 |
| **Disabled** | `neutral-200` | `neutral-100` | 禁用灰色 |

**組成元素**：
- **Label**: `text-small`, `neutral-700`, 必填欄位加 `*` 紅色標記
- **Placeholder**: `neutral-400`, 提示文字
- **Helper Text**: `text-caption`, `neutral-500`, 顯示在 Input 下方
- **Error Message**: `text-caption`, `error`, 取代 Helper Text

---

### 6.3 Card

#### 捐血紀錄卡片

```
┌─────────────────────────────────┐
│ 🩸 全血捐血                [A+] │  ← 類型 + 血型 Badge
│                                 │
│ 2024/03/15  台北捐血中心         │  ← 日期 + 地點
│ 250ml                          │  ← 捐血量
│                                 │
│ ─────────────────────────────── │
│ 下次可捐血：2024/06/15  (92天後) │  ← 倒數
└─────────────────────────────────┘
```
- 背景：白色 / dark: `neutral-900`
- 圓角：`radius-lg`
- 陰影：`shadow-md`
- 內邊距：`space-4`

#### 成就卡片

```
┌─────────────────────────────────┐
│         🏅                      │  ← 勳章圖示（accent 金色）
│     初心捐血者                   │  ← 成就名稱
│   完成第一次捐血                 │  ← 成就描述
│                                 │
│   ████████████░░  80%           │  ← 進度條
│   已達成 4/5 次                  │  ← 進度文字
└─────────────────────────────────┘
```
- 背景：漸層 `accent-50` → `accent-100`
- 圓角：`radius-xl`
- 特殊：未達成成就使用灰階 + opacity

#### 統計卡片

```
┌────────────┐
│    12      │  ← 數字（Geist, h1, primary-600）
│  捐血次數   │  ← 標籤（caption, neutral-500）
└────────────┘
```
- 背景：`primary-50` / dark: `primary-950`
- 圓角：`radius-lg`
- 內邊距：`space-4`

---

### 6.4 Badge

#### 血型標籤

| 血型 | 背景 | 文字 | 邊框 |
|------|------|------|------|
| **A** | `primary-100` | `primary-700` | `primary-200` |
| **B** | `info-bg` | `#2563eb` | `#bfdbfe` |
| **O** | `secondary-100` | `secondary-700` | `secondary-200` |
| **AB** | `#f3e8ff` | `#7c3aed` | `#ddd6fe` |

- 尺寸：20px 高，padding `2px 8px`
- 圓角：`radius-full`
- 文字：`caption`, Bold

#### 捐血類型標籤

| 類型 | 顏色方案 |
|------|---------|
| 全血 | primary（紅） |
| 分離術血小板 | secondary（琥珀） |
| 分離術血漿 | info（藍） |

#### 成就勳章

- 底色：`accent-400` 漸層
- 邊框：`accent-600`
- 圖示：白色，居中
- 未解鎖：灰階 `neutral-300`，加鎖頭圖示

---

### 6.5 BottomNavBar

**5 個 Tab 配置**：

| 順序 | 圖示 | 文字 | 說明 |
|------|------|------|------|
| 1 | 🏠 Home | 首頁 | Dashboard / 總覽 |
| 2 | 🩸 Drop | 紀錄 | 捐血紀錄列表 |
| 3 | ➕ Plus | 新增 | 新增捐血紀錄（突出設計） |
| 4 | 🏆 Trophy | 成就 | 成就勳章頁 |
| 5 | 👤 User | 我的 | 個人設定 |

**樣式**：
- 高度：64px + safe area bottom
- 背景：白色 / dark: `neutral-900`
- 陰影：`shadow-lg`（向上）
- **Active 狀態**：圖示 + 文字 `primary-600`，圖示填滿
- **Inactive 狀態**：圖示 + 文字 `neutral-400`，圖示描邊
- **中間 Tab (新增)**：特殊突出按鈕，圓形 `primary-600` 背景，白色 `+` 圖示，向上偏移 8px

---

## 7. 動效 (Motion)

| Token | Duration | Easing | 用途 |
|-------|----------|--------|------|
| `duration-fast` | 150ms | ease-out | 按鈕 hover |
| `duration-normal` | 250ms | ease-in-out | 面板展開 |
| `duration-slow` | 350ms | ease-in-out | 頁面轉場 |

---

## 8. Dark Mode 策略

- 使用 CSS `prefers-color-scheme` 媒體查詢 + 手動切換
- 色彩翻轉原則：Light 的淺色 ↔ Dark 的深色（見色彩表 Dark Mode 欄）
- 背景：`neutral-950` (#0a0a0a)
- 卡片：`neutral-900` (#171717)
- 文字：`neutral-50` (#fafafa)
- 邊框：`neutral-800` (#262626)
