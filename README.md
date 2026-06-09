# 🌍 Protocol 13 — SDG 13 氣候行動互動網站

> 把冰冷的氣候數據，變成一個你會想動手玩、而且「跟你有關」的互動體驗。

一個以**工業科幻監控終端**為設計風格的單頁網站，主題為聯合國永續發展目標 **SDG 13：氣候行動 (Climate Action)**。網頁程式設計期末專題。

## 🔗 線上展示

**https://simonrainbow.github.io/web-final-project/**

## ✨ 主要功能

- **即時氣候掃描器** — 串接 OpenWeatherMap API，查詢任何城市的即時氣溫與空氣品質
- **你的城市，2050** — 用真實 CMIP6 氣候模型推估你家未來的高溫日、年均溫變化，並用 Climate Central 把海平面上升的**淹水範圍疊在街道地圖上**
- **淨零排放模擬器** — 互動式升溫曲線圖（Chart.js），在 IPCC SSP 情境間即時內插，挑戰把升溫壓在 1.5°C 內
- **氣候知識檢測** — 邊答題邊學的氣候素養測驗
- **臨界警報系統 / 系統日誌** — 沉浸式的監控終端體驗

## 🛠️ 技術

- 純前端：HTML / CSS / JavaScript（無框架）
- [Chart.js](https://www.chartjs.org/) — 升溫曲線圖
- [OpenWeatherMap API](https://openweathermap.org/api) — 即時天氣
- [Open-Meteo Climate API](https://open-meteo.com/) — CMIP6 降尺度氣候推估
- [Climate Central](https://coastal.climatecentral.org/) — 海平面淹水地圖

## 📊 資料來源

聯合國 SDGs 官網、IPCC AR6、NASA、NOAA、Open-Meteo、Climate Central（Kulp & Strauss 2019, *Nature Communications*）。

## 📂 檔案結構

```
index.html    — 網頁結構
style.css     — 樣式
script.js     — 互動邏輯與資料
```
