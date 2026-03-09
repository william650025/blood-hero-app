# Information Architecture — 捐血勇士 (Blood Hero)

## 導航結構總覽

```
捐血勇士 App
├── 🔐 Auth（獨立於 Tab 導航外）
│   ├── 歡迎頁 / Landing
│   ├── 登入頁
│   └── 註冊頁（Step 1 + Step 2）
│
├── 📱 主要 Tab 導航（Bottom Navigation Bar）
│   │
│   ├── 🏠 首頁 (Dashboard)
│   │   ├── 問候語 + 頭像（→ 個人設定）
│   │   ├── 捐血狀態卡片（下次可捐倒數）
│   │   ├── 上次捐血資訊卡片
│   │   ├── 快速操作按鈕
│   │   │   ├── ➕ 新增紀錄
│   │   │   ├── 🗺 找捐血站
│   │   │   └── 📅 查活動
│   │   └── 累計捐血統計
│   │
│   ├── 📊 紀錄 (Records)
│   │   ├── 紀錄列表（按月份分組）
│   │   ├── 紀錄詳情頁
│   │   ├── 新增紀錄表單
│   │   └── 編輯紀錄表單
│   │
│   ├── 🗺 地圖 (Map)
│   │   ├── 地圖視圖（標記捐血站/車）
│   │   ├── 篩選器（捐血站 / 捐血車）
│   │   ├── 站點資訊卡片
│   │   └── 搜尋功能
│   │
│   ├── 📅 活動 (Events)
│   │   ├── 活動列表（依日期排序）
│   │   ├── 活動詳情頁
│   │   └── 篩選器（地區 / 日期範圍）
│   │
│   └── 🏆 成就 (Achievements)
│       ├── 勳章牆（已解鎖 / 未解鎖）
│       ├── 進度追蹤
│       └── 勳章詳情
│
└── ⚙️ 個人設定（從 Dashboard 頭像進入）
    ├── 個人資料編輯
    │   ├── 姓名
    │   ├── 性別
    │   ├── 血型
    │   └── 大頭照
    ├── 通知設定
    │   ├── 可捐血提醒
    │   └── 活動推播
    ├── 外觀設定
    │   └── 深色/淺色模式
    ├── 關於 App
    │   ├── 版本資訊
    │   └── 隱私政策
    └── 登出
```

## Bottom Navigation Bar 規格

| 位置 | Icon | 標籤 | 目標頁面 | 說明 |
|------|------|------|----------|------|
| 1 (左) | 🏠 | 首頁 | Dashboard | 預設啟動頁 |
| 2 | 📊 | 紀錄 | Records List | 捐血歷史 |
| 3 (中) | 🗺 | 地圖 | Map View | 捐血站地圖 |
| 4 | 📅 | 活動 | Events List | 捐血活動 |
| 5 (右) | 🏆 | 成就 | Achievements | 勳章牆 |

### 導航行為
- **Active Tab**: Icon 填色 + 標籤加粗 + 品牌色（紅色系 #E53935）
- **Inactive Tab**: Icon 線框 + 標籤灰色
- **切換動畫**: 淡入淡出，無滑動
- **Tab 記憶**: 返回時恢復上次瀏覽位置

## 頁面層級與導航方式

| 層級 | 頁面 | 進入方式 | 返回方式 |
|------|------|----------|----------|
| L0 | 歡迎頁 | App 啟動（未登入） | — |
| L0 | 登入/註冊 | 歡迎頁按鈕 | 返回歡迎頁 |
| L1 | Dashboard | Tab Bar / 登入後 | — |
| L1 | 紀錄列表 | Tab Bar | — |
| L1 | 地圖 | Tab Bar | — |
| L1 | 活動列表 | Tab Bar | — |
| L1 | 成就牆 | Tab Bar | — |
| L2 | 紀錄詳情 | 點擊紀錄卡片 | ← 返回紀錄列表 |
| L2 | 新增/編輯紀錄 | ➕ 按鈕 / 編輯按鈕 | ← 返回（含取消確認） |
| L2 | 活動詳情 | 點擊活動卡片 | ← 返回活動列表 |
| L2 | 站點資訊 | 點擊地圖標記 | 關閉卡片 |
| L2 | 勳章詳情 | 點擊勳章 | ← 返回成就牆 |
| L2 | 個人設定 | Dashboard 頭像 | ← 返回 Dashboard |

## 資料模型摘要

```
User
├── uid, email, displayName
├── gender (male/female)
├── bloodType (A+, A-, B+, B-, O+, O-, AB+, AB-)
├── profilePhoto (URL)
└── createdAt

DonationRecord
├── id, userId
├── date
├── type (whole_250 / whole_500 / platelet / leukocyte)
├── location (optional)
├── notes (optional)
├── nextEligibleDate (calculated)
└── createdAt

Achievement
├── id, name, description
├── icon
├── condition (e.g., total_count >= 10)
└── unlockedAt (nullable)

BloodStation
├── id, name, type (station / bus)
├── address, lat, lng
├── phone, operatingHours
└── services[]
```
