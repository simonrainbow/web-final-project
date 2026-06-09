/* === 1. 動態數值跳動 === */
    function updateMonitor() {
        const stabilityBase = 88.42;
        const s = (stabilityBase + (Math.random() * 0.4 - 0.2)).toFixed(2);
        const el = document.getElementById('stability-val');
        if (el) el.innerText = s + "%";

        const co2Base = 421.8;
        const c = (co2Base + (Math.random() * 0.6 - 0.3)).toFixed(1);
        const co2El = document.getElementById('co2-val');
        if (co2El) co2El.innerText = c;
    }
    setInterval(updateMonitor, 2500);

    /* === 2. Recovery 按鈕 === */
    const recoveryBtn = document.getElementById('recoveryBtn');
    recoveryBtn.onclick = () => {
        const orig = recoveryBtn.innerHTML;
        recoveryBtn.innerText = "EXECUTING...";
        recoveryBtn.style.background = "#ffcf00";
        recoveryBtn.style.color = "#000";
        setTimeout(() => {
            recoveryBtn.innerHTML = orig;
            recoveryBtn.style.background = "";
            recoveryBtn.style.color = "";
            addLog("INFO", "Recovery protocol executed. System status: OPTIMAL.");
        }, 2000);
    };

    /* === 3. Action Card Modals === */
    function openModal(id) {
        document.getElementById(id).classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeModal(id) {
        document.getElementById(id).classList.remove('active');
        document.body.style.overflow = '';
    }
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active')
                .forEach(m => m.classList.remove('active'));
            document.body.style.overflow = '';
        }
    });

    /* === 4. Alert System === */
    function triggerAlert() {
        document.getElementById('alert-system').classList.add('alert-active');
        document.getElementById('alertBorder').classList.add('active');
        document.getElementById('alertLevel').innerText  = 'CRITICAL';
        document.getElementById('alertSubtext').innerText = '⚠ 臨界警報 — 氣候指標超出安全範圍';
        document.getElementById('alertDesc').innerText =
            '警告！模擬數據顯示大氣 CO₂ 濃度突破 450 ppm 臨界值，全球平均溫度上升超過 1.5°C 安全閾值。系統已進入緊急氣候行動模式。現在採取行動已刻不容緩。';
        document.getElementById('resetBtn').style.display = 'block';
        addLog("ALERT", "⚠ 臨界警報觸發：CO₂ > 450 ppm / TEMP > +1.5°C — 緊急應對程序啟動");
        document.getElementById('system-logs').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    function resetAlert() {
        document.getElementById('alert-system').classList.remove('alert-active');
        document.getElementById('alertBorder').classList.remove('active');
        document.getElementById('alertLevel').innerText  = 'NORMAL';
        document.getElementById('alertSubtext').innerText = '大氣穩定度正常 — 所有系統運作中';
        document.getElementById('alertDesc').innerText =
            '目前監控系統顯示全球氣候指標尚在可接受範圍內，但大氣 CO₂ 濃度持續上升，需持續關注。科學家警告，若在 2030 年前不將排放量減少 45%，將無法實現 1.5°C 目標。';
        document.getElementById('resetBtn').style.display = 'none';
        addLog("INFO", "系統已恢復正常運行模式。All systems nominal.");
    }

    /* === 5. Dynamic Log === */
    function addLog(level, msg) {
        const terminal = document.getElementById('logTerminal');
        const cursor   = document.getElementById('cursor');
        const now  = new Date();
        const pad  = n => String(n).padStart(2, '0');
        const time = `[${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}]`;
        const cls  = level === 'ALERT' ? 'log-alert' : level === 'WARN' ? 'log-warn' : 'log-info';
        const p = document.createElement('p');
        p.className = 'log-line';
        p.innerHTML = `<span class="log-time">${time}</span> <span class="${cls}">${level.padEnd(5)}</span> <span class="log-msg">${msg}</span>`;
        terminal.insertBefore(p, cursor);
        terminal.scrollTop = terminal.scrollHeight;
    }

    /* === 6. Cursor blink === */
    setInterval(() => {
        const c = document.getElementById('cursor');
        if (c) c.style.opacity = c.style.opacity === '0' ? '1' : '0';
    }, 600);

    /* ============================================================
       LIVE CLIMATE SCANNER — OpenWeatherMap API
       ── 如何啟用真實即時資料 ──
       1. 到 https://openweathermap.org/api 免費註冊
       2. 在「API keys」頁面複製你的 key
       3. 把下面的 "YOUR_API_KEY_HERE" 換成你的 key
       （未填入時自動使用示範模擬資料，頁面不會壞掉）
       ============================================================ */
    const OWM_API_KEY = "48d6abafb3e0cdfee08ed9bd7227c1cb";
    const USE_LIVE = OWM_API_KEY && OWM_API_KEY !== "YOUR_API_KEY_HERE";

    // 隱藏/顯示示範模式提示
    if (USE_LIVE) document.getElementById('demoBanner').classList.add('hidden');

    // 空氣品質等級對照（OpenWeatherMap AQI 1~5）
    const AQI_INFO = {
        1: { text: "良好 GOOD",       cls: "aqi-1" },
        2: { text: "尚可 FAIR",       cls: "aqi-2" },
        3: { text: "普通 MODERATE",   cls: "aqi-3" },
        4: { text: "不良 POOR",       cls: "aqi-4" },
        5: { text: "極差 VERY POOR",  cls: "aqi-5" }
    };

    // 示範模擬資料（無 API Key 時使用）
    const DEMO_DATA = {
        "taipei":   { name: "Taipei",   country: "TW", lat: 25.04, lon: 121.56, temp: 28.3, feels: 31.2, humid: 78, wind: 3.1, desc: "多雲 scattered clouds", aqi: 3 },
        "tokyo":    { name: "Tokyo",    country: "JP", lat: 35.68, lon: 139.69, temp: 24.1, feels: 24.8, humid: 65, wind: 4.2, desc: "晴 clear sky",         aqi: 2 },
        "london":   { name: "London",   country: "GB", lat: 51.51, lon: -0.13,  temp: 14.6, feels: 13.9, humid: 71, wind: 5.4, desc: "小雨 light rain",       aqi: 2 },
        "new york": { name: "New York", country: "US", lat: 40.71, lon: -74.01, temp: 19.8, feels: 19.5, humid: 60, wind: 4.8, desc: "晴時多雲 few clouds",   aqi: 2 },
        "beijing":  { name: "Beijing",  country: "CN", lat: 39.90, lon: 116.41, temp: 30.5, feels: 32.0, humid: 45, wind: 2.6, desc: "霾 haze",               aqi: 5 },
        "sydney":   { name: "Sydney",   country: "AU", lat: -33.87,lon: 151.21, temp: 17.2, feels: 17.0, humid: 68, wind: 6.1, desc: "晴 clear sky",          aqi: 1 },
        "delhi":    { name: "Delhi",    country: "IN", lat: 28.61, lon: 77.21,  temp: 35.7, feels: 38.4, humid: 52, wind: 2.2, desc: "煙霧 smoke",            aqi: 5 }
    };

    const scanBtn   = document.getElementById('scanBtn');
    const scanInput = document.getElementById('scanInput');

    async function runScan(city) {
        if (!city || !city.trim()) return;
        city = city.trim();
        showScanState('scanning');
        scanBtn.disabled = true;

        try {
            let data, isDemo = false;
            if (USE_LIVE) {
                try {
                    data = await fetchLiveData(city);
                } catch (err) {
                    // 城市真的不存在 → 顯示錯誤；其他失敗（如 key 尚未生效、額度、網路）→ 退回示範資料
                    if (err.notFound) throw err;
                    console.warn("即時 API 失敗，改用示範資料：", err.message);
                    await new Promise(r => setTimeout(r, 400));
                    data = getDemoData(city);
                    isDemo = true;
                }
            } else {
                await new Promise(r => setTimeout(r, 900)); // 模擬掃描延遲
                data = getDemoData(city);
                isDemo = true;
            }
            renderScan(data, isDemo);
            addLog("INFO", "氣候掃描完成：" + data.name + " — 氣溫 " + data.temp + "°C / 空氣品質 " + AQI_INFO[data.aqi].text);
        } catch (err) {
            showScanError(err.message);
        } finally {
            scanBtn.disabled = false;
        }
    }

    async function fetchLiveData(city) {
        // 1. 當前天氣（同時取得經緯度）
        const wUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OWM_API_KEY}&units=metric&lang=zh_tw`;
        const wRes = await fetch(wUrl);
        if (wRes.status === 404) {
            const e = new Error("找不到城市「" + city + "」，請確認拼字");
            e.notFound = true;
            throw e;
        }
        if (!wRes.ok) throw new Error("氣象 API 連線失敗 (" + wRes.status + ")");
        const w = await wRes.json();

        // 2. 空氣品質（用經緯度查詢）
        let aqi = 0;
        try {
            const aUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${w.coord.lat}&lon=${w.coord.lon}&appid=${OWM_API_KEY}`;
            const aRes = await fetch(aUrl);
            if (aRes.ok) {
                const a = await aRes.json();
                aqi = a.list[0].main.aqi;
            }
        } catch (e) { /* 空品失敗不影響主要資料 */ }

        return {
            name: w.name,
            country: w.sys.country,
            lat: w.coord.lat,
            lon: w.coord.lon,
            temp: Math.round(w.main.temp * 10) / 10,
            feels: Math.round(w.main.feels_like * 10) / 10,
            humid: w.main.humidity,
            wind: w.wind.speed,
            desc: w.weather[0].description,
            aqi: aqi
        };
    }

    function getDemoData(city) {
        const key = city.toLowerCase();
        if (DEMO_DATA[key]) return DEMO_DATA[key];
        // 未知城市 → 隨機合理化模擬
        return {
            name: city.charAt(0).toUpperCase() + city.slice(1),
            country: "??", lat: 0, lon: 0,
            temp: Math.round((Math.random() * 30 + 5) * 10) / 10,
            feels: Math.round((Math.random() * 30 + 5) * 10) / 10,
            humid: Math.round(Math.random() * 50 + 40),
            wind: Math.round(Math.random() * 60) / 10,
            desc: "示範資料 demo data",
            aqi: Math.ceil(Math.random() * 5)
        };
    }

    function showScanState(state) {
        document.getElementById('scanLoading').style.display = 'none';
        document.getElementById('scanError').style.display = 'none';
        document.getElementById('scanData').classList.remove('show');
        document.getElementById('scanResult').classList.remove('scanning');
        if (state === 'scanning') {
            document.getElementById('scanResult').classList.add('scanning');
            const ld = document.getElementById('scanLoading');
            ld.style.display = 'block';
            ld.innerText = '▸ 連線氣象站中... SCANNING ATMOSPHERE...';
        }
    }

    function showScanError(msg) {
        document.getElementById('scanResult').classList.remove('scanning');
        document.getElementById('scanLoading').style.display = 'none';
        document.getElementById('scanData').classList.remove('show');
        const er = document.getElementById('scanError');
        er.style.display = 'block';
        er.innerText = '✗ 掃描失敗：' + msg;
        addLog("WARN", "氣候掃描失敗：" + msg);
    }

    function renderScan(d, isDemo) {
        document.getElementById('scanResult').classList.remove('scanning');
        document.getElementById('scanLoading').style.display = 'none';
        document.getElementById('scanError').style.display = 'none';

        document.getElementById('scanCity').innerText  = d.name + (d.country !== "??" ? "，" + d.country : "");
        document.getElementById('scanDesc').innerText  = d.desc;
        document.getElementById('scanCoord').innerText =
            d.lat ? `[ ${d.lat.toFixed(2)}, ${d.lon.toFixed(2)} ]` : '';
        document.getElementById('scanTemp').innerText  = d.temp + '°C';
        document.getElementById('scanFeels').innerText = '體感 ' + d.feels + '°C';
        document.getElementById('scanHumid').innerText = d.humid + '%';
        document.getElementById('scanWind').innerText  = d.wind;

        const aqiEl   = document.getElementById('scanAqi');
        const aqiInfo = AQI_INFO[d.aqi] || { text: "無資料 N/A", cls: "" };
        aqiEl.innerText = d.aqi || '—';
        aqiEl.className = 'scan-metric-value ' + aqiInfo.cls;
        document.getElementById('scanAqiText').innerText = aqiInfo.text;

        // SDG 13 連結訊息
        let ctx;
        if (d.aqi >= 4) {
            ctx = `⚠ <b>${d.name}</b> 的空氣品質為「${aqiInfo.text}」。空氣污染與氣候變遷同源 — 主要都來自化石燃料燃燒。改善空氣品質與減碳，正是 <b>SDG 13</b> 的雙重目標。`;
        } else if (d.temp >= 32) {
            ctx = `🌡 <b>${d.name}</b> 目前 ${d.temp}°C，體感 ${d.feels}°C。隨著全球暖化，極端高溫日數逐年增加。每減少一噸碳排，都在為降低未來熱浪頻率努力 — 這就是 <b>SDG 13</b> 的意義。`;
        } else {
            ctx = `🌍 已掃描 <b>${d.name}</b> 的即時大氣數據。這些看似日常的氣溫與空氣品質，長期累積就構成了全球氣候趨勢。SDG 13 提醒我們：每個地方的氣候，都是全人類共同的責任。`;
        }
        if (isDemo && USE_LIVE) {
            ctx = '<span style="color:#ffcf00;">[ 示範資料 — 即時 API 暫時無法連線，可能是 API Key 尚未生效 ]</span><br>' + ctx;
        }
        document.getElementById('scanContext').innerHTML = ctx;
        document.getElementById('scanData').classList.add('show');
    }

    // 事件綁定
    scanBtn.addEventListener('click', () => runScan(scanInput.value));
    scanInput.addEventListener('keydown', e => { if (e.key === 'Enter') runScan(scanInput.value); });
    document.querySelectorAll('.scan-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            scanInput.value = chip.dataset.city;
            runScan(chip.dataset.city);
        });
    });

    /* ============================================================
       「你的城市，2050」— 在地化氣候衝擊
       資料來源：
       1. Open-Meteo Geocoding（城市→經緯度，免金鑰）
       2. Open-Meteo Climate API（CMIP6 降尺度氣候推估，免金鑰）
       3. Climate Central（海平面淹水地圖，iframe 嵌入）
       全部免 API key。
       ============================================================ */
    const cityInput = document.getElementById('cityInput');
    const cityBtn   = document.getElementById('cityBtn');
    let _cityLat = null, _cityLon = null;  // 記住目前城市座標，給地圖年份切換用

    // 退路示範資料：若 Open-Meteo 連線失敗時使用。
    // 數值為各城市已發表 CMIP6 區域推估的「代表值」，非亂數（清楚標示為示範資料）。
    // 數值為 >33°C 高溫日尺度的代表值（台北一組為實測 9→39）
    const CITY_DEMO = {
        "taipei":    { name: "Taipei，TW",    lat: 25.04,  lon: 121.56, tempDelta: 1.3, hotFuture: 39,  hotBase: 9,  rainFuture: 3,  rainBase: 4 },
        "kaohsiung": { name: "Kaohsiung，TW", lat: 22.63,  lon: 120.30, tempDelta: 1.4, hotFuture: 95,  hotBase: 48, rainFuture: 6,  rainBase: 5 },
        "tokyo":     { name: "Tokyo，JP",     lat: 35.68,  lon: 139.69, tempDelta: 1.6, hotFuture: 32,  hotBase: 12, rainFuture: 8,  rainBase: 6 },
        "london":    { name: "London，GB",    lat: 51.51,  lon: -0.13,  tempDelta: 1.7, hotFuture: 12,  hotBase: 3,  rainFuture: 3,  rainBase: 2 },
        "bangkok":   { name: "Bangkok，TH",   lat: 13.75,  lon: 100.50, tempDelta: 1.5, hotFuture: 190, hotBase: 130, rainFuture: 14, rainBase: 11 },
        "sydney":    { name: "Sydney，AU",    lat: -33.87, lon: 151.21, tempDelta: 1.4, hotFuture: 15,  hotBase: 7,  rainFuture: 5,  rainBase: 4 }
    };

    // 城市名 → 經緯度（Open-Meteo Geocoding，免金鑰）
    async function geocodeCity(city) {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=zh&format=json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('地理編碼服務連線失敗');
        const j = await res.json();
        if (!j.results || !j.results.length) {
            const e = new Error('找不到城市「' + city + '」，請確認拼字');
            e.notFound = true;
            throw e;
        }
        const r = j.results[0];
        return { name: r.name + (r.country_code ? '，' + r.country_code : ''), lat: r.latitude, lon: r.longitude };
    }

    // 抓某段時間視窗的每日氣候推估資料
    // 用單一模式 MRI_AGCM3_2_S（全球涵蓋佳、速度快）；要更準可加更多模式取平均
    async function fetchClimate(lat, lon, start, end) {
        const url = `https://climate-api.open-meteo.com/v1/climate?latitude=${lat}&longitude=${lon}`
            + `&start_date=${start}&end_date=${end}`
            + `&models=MRI_AGCM3_2_S`
            + `&daily=temperature_2m_max,temperature_2m_mean,precipitation_sum`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('氣候推估服務連線失敗 (' + res.status + ')');
        return res.json();
    }

    // 從每日資料統計出：年均溫、每年 >35°C 天數、每年豪雨(>50mm)天數
    function analyzeClimate(data) {
        const d = data.daily;
        const n = d.time.length;
        const years = n / 365.25;            // 估算涵蓋年數
        let sumMean = 0, cntMean = 0, hot = 0, heavy = 0;
        for (let i = 0; i < n; i++) {
            const tmean = d.temperature_2m_mean[i];
            const tmax  = d.temperature_2m_max[i];
            const prcp  = d.precipitation_sum[i];
            if (tmean != null) { sumMean += tmean; cntMean++; }
            if (tmax  != null && tmax  >= 33) hot++;    // 高溫日（>33°C 熱壓力門檻）
            if (prcp  != null && prcp  >= 50) heavy++;  // 豪雨日
        }
        return {
            meanTemp:     cntMean ? sumMean / cntMean : 0,
            hotPerYear:   hot   / years,
            heavyPerYear: heavy / years
        };
    }

    async function runCity(city) {
        if (!city || !city.trim()) return;
        city = city.trim();
        showCityState('loading');
        cityBtn.disabled = true;
        try {
            let r;
            try {
                const geo = await geocodeCity(city);
                // Promise.all：同時並行抓「未來窗」與「基準窗」，比一個一個抓快一倍
                const [future, base] = await Promise.all([
                    fetchClimate(geo.lat, geo.lon, '2040-01-01', '2050-12-31'),  // 未來
                    fetchClimate(geo.lat, geo.lon, '1995-01-01', '2014-12-31')   // 基準
                ]);
                const f = analyzeClimate(future), b = analyzeClimate(base);
                r = {
                    name: geo.name, lat: geo.lat, lon: geo.lon,
                    tempDelta:  f.meanTemp - b.meanTemp,
                    hotFuture:  f.hotPerYear,   hotBase:  b.hotPerYear,
                    rainFuture: f.heavyPerYear, rainBase: b.heavyPerYear,
                    isDemo: false
                };
            } catch (err) {
                if (err.notFound) throw err;   // 城市真的不存在 → 顯示錯誤
                console.warn('Open-Meteo 失敗，改用示範資料：', err.message);
                r = getCityDemo(city);
            }
            renderCity(r);
            addLog('INFO', '城市未來預測：' + r.name + ' — 2050 年均溫 +' + r.tempDelta.toFixed(1) + '°C / 高溫日 ' + Math.round(r.hotFuture) + '天');
        } catch (err) {
            showCityError(err.message);
        } finally {
            cityBtn.disabled = false;
        }
    }

    function getCityDemo(city) {
        const key = city.toLowerCase();
        if (CITY_DEMO[key]) return Object.assign({ isDemo: true }, CITY_DEMO[key]);
        // 未知城市 → 用台北座標當地圖中心，數字標示示範
        return Object.assign({ isDemo: true }, CITY_DEMO['taipei'], { name: city + '（示範）' });
    }

    function showCityState(state) {
        document.getElementById('cityError').style.display = 'none';
        document.getElementById('cityData').classList.remove('show');
        const ld = document.getElementById('cityLoading');
        if (state === 'loading') {
            ld.style.display = 'block';
            ld.innerText = '▸ 連線氣候模型中... 分析你家 2050 年的未來（約需 1–3 秒）...';
        } else {
            ld.style.display = 'none';
        }
    }

    function showCityError(msg) {
        document.getElementById('cityLoading').style.display = 'none';
        document.getElementById('cityData').classList.remove('show');
        const er = document.getElementById('cityError');
        er.style.display = 'block';
        er.innerText = '✗ 預測失敗：' + msg;
        addLog('WARN', '城市未來預測失敗：' + msg);
    }

    function renderCity(r) {
        document.getElementById('cityLoading').style.display = 'none';
        document.getElementById('cityError').style.display = 'none';
        _cityLat = r.lat; _cityLon = r.lon;

        document.getElementById('cityName').innerText  = r.name;
        document.getElementById('cityCoord').innerText = '[ ' + r.lat.toFixed(2) + ', ' + r.lon.toFixed(2) + ' ]';
        document.getElementById('cityTempDelta').innerText = '+' + r.tempDelta.toFixed(1) + '°C';

        const hotInc = Math.round(r.hotFuture - r.hotBase);
        document.getElementById('cityHotDays').innerText = Math.round(r.hotFuture) + ' 天';
        document.getElementById('cityHotSub').innerHTML  = '基準 ' + Math.round(r.hotBase) + ' 天 → <b style="color:#ff7777;">+' + hotInc + ' 天</b>';

        const rainInc = Math.round(r.rainFuture - r.rainBase);
        document.getElementById('cityRainDays').innerText = Math.round(r.rainFuture) + ' 天';
        document.getElementById('cityRainSub').innerHTML  = '基準 ' + Math.round(r.rainBase) + ' 天 → <b style="color:#ffcf00;">+' + rainInc + ' 天</b>';

        // SDG 訊息
        let ctx = `🏠 這是 <b>${r.name}</b> 在 2050 年的氣候未來：夏天 >33°C 的高溫日將從 ${Math.round(r.hotBase)} 天增加到約 <b>${Math.round(r.hotFuture)} 天</b>（+${hotInc} 天），年均溫上升 <b>+${r.tempDelta.toFixed(1)}°C</b>。氣候變遷不是遙遠的事 — 它正在改變你居住的這座城市。`;
        if (r.isDemo) {
            ctx = '<span style="color:#ffcf00;">[ 示範資料 — 即時氣候模型暫時無法連線 ]</span><br>' + ctx;
        }
        document.getElementById('cityContext').innerHTML = ctx;

        updateCityMap();  // 載入該城市的淹水地圖
        document.getElementById('cityData').classList.add('show');
    }

    // 依「目前城市座標 + 選定年份水位」組出 Climate Central 深連結網址並載入 iframe
    function updateCityMap() {
        if (_cityLat == null) return;
        const activeBtn = document.querySelector('#city-future .year-btn.active');
        const level = activeBtn ? activeBtn.dataset.level : '2';
        const year  = activeBtn ? activeBtn.dataset.year  : '2100';
        // Climate Central 網址格式（此格式經實測：載入後即顯示藍色淹水，不需手動操作）：
        //   #{縮放}/{緯度}/{經度}?show=satellite&projections=...&level=...&unit=meters&pois=hide
        // ⚠ 關鍵：必須帶 projections 參數，地圖才會進入「顯示水位」狀態；
        //   只給 level 而少了 projections，載入時不會淹水（先前的 bug）。
        // level=水位(公尺，相對高潮線)、show=satellite 衛星圖（看得到實際地貌被淹）。
        const url = `https://ss2.climatecentral.org/#12/${_cityLat}/${_cityLon}`
            + `?show=satellite&projections=0-K14_RCP85-SLR&level=${level}&unit=meters&pois=hide`;
        const iframe = document.getElementById('cityMap');
        const loading = document.getElementById('cityMapLoading');
        loading.style.display = 'block';
        // ⚠ 切換年份/水位時，新舊網址只差 hash（# 後面）。
        //   瀏覽器對「只改 hash」的 iframe 不會重新載入 → 水位不更新（按鈕看似沒反應）。
        //   解法：先把 iframe 設成空白頁清掉，再載入新網址，強制完整重載、水位即時切換。
        iframe.onload = null;
        iframe.src = 'about:blank';
        clearTimeout(window._cityMapTimer);
        setTimeout(() => {
            iframe.onload = () => { loading.style.display = 'none'; };
            iframe.src = url;
            // 保險：SPA 的 onload 不一定穩定觸發，4.5 秒後強制隱藏載入提示
            window._cityMapTimer = setTimeout(() => { loading.style.display = 'none'; }, 4500);
        }, 60);
        addLog('INFO', '載入淹水地圖：' + year + ' 海平面 +' + level + 'm（Climate Central）');
    }

    // 事件綁定
    cityBtn.addEventListener('click', () => runCity(cityInput.value));
    cityInput.addEventListener('keydown', e => { if (e.key === 'Enter') runCity(cityInput.value); });
    document.querySelectorAll('#city-future .city-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            cityInput.value = chip.dataset.city;
            runCity(chip.dataset.city);
        });
    });
    // 年份切換（2050 / 2100）→ 重載地圖水位
    document.querySelectorAll('#city-future .year-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#city-future .year-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateCityMap();
        });
    });

    /* === GAME 1: CLIMATE QUIZ === */
    const quizData = [
        {
            q: "工業革命前，大氣中的 CO₂ 濃度約為多少？",
            options: ["280 ppm", "350 ppm", "421 ppm"],
            answer: 0,
            explain: "工業革命前約 280 ppm，現已突破 420 ppm，短短兩百年內增加了約 50%。（來源：IPCC AR6）"
        },
        {
            q: "《巴黎協定》努力將全球升溫控制在工業化前水準的多少度以內？",
            options: ["2.0°C", "1.5°C", "3.0°C"],
            answer: 1,
            explain: "巴黎協定目標將升溫控制在 2°C 以下，並「努力」限制在 1.5°C 內。每多 0.5°C 都會大幅增加極端氣候風險。（來源：UNFCCC）"
        },
        {
            q: "下列哪一種氣體「不是」溫室氣體？",
            options: ["二氧化碳 CO₂", "甲烷 CH₄", "氮氣 N₂"],
            answer: 2,
            explain: "氮氣佔大氣約 78%，但不是溫室氣體。主要溫室氣體有 CO₂、甲烷、氧化亞氮等，其中甲烷的暖化效應是 CO₂ 的數十倍。"
        },
        {
            q: "根據 IPCC，要達成 1.5°C 目標，2030 年前全球須減少約多少排放？",
            options: ["約 10%", "約 25%", "約 45%"],
            answer: 2,
            explain: "IPCC 指出 2030 年前須較 2010 年減少約 45% 排放，並在 2050 年達成淨零。時間非常緊迫。（來源：IPCC 1.5°C 特別報告）"
        },
        {
            q: "下列哪種個人行動，通常最能有效減少碳足跡？",
            options: ["改用紙吸管", "減少長途飛行與開車", "隨手關燈"],
            answer: 1,
            explain: "交通運輸（尤其長途飛行）是個人碳足跡的最大來源之一。一趟跨洲來回航班的碳排，可能超過某些人一整年的其他排放總和。"
        },
        {
            q: "台灣《氣候變遷因應法》明定的淨零排放目標年是？",
            options: ["2030 年", "2050 年", "2070 年"],
            answer: 1,
            explain: "台灣已於 2023 年將「2050 淨零排放」目標入法，與全球多數國家的時程一致。（來源：台灣《氣候變遷因應法》）"
        }
    ];

    let quizIndex = 0, quizScore = 0, quizAnswered = false;

    function startQuiz() {
        quizIndex = 0; quizScore = 0;
        document.getElementById('quizResult').style.display = 'none';
        document.getElementById('quizPlay').style.display = 'block';
        document.getElementById('qScore').innerText = '0';
        document.getElementById('qTotal').innerText = quizData.length;
        loadQuestion();
    }

    function loadQuestion() {
        quizAnswered = false;
        const item = quizData[quizIndex];
        document.getElementById('qNum').innerText = quizIndex + 1;
        document.getElementById('qText').innerText = item.q;
        document.getElementById('qExplain').classList.remove('show');
        document.getElementById('qNext').classList.remove('show');
        const optBox = document.getElementById('qOptions');
        optBox.innerHTML = '';
        item.options.forEach((opt, i) => {
            const b = document.createElement('button');
            b.className = 'quiz-opt';
            b.innerText = opt;
            b.onclick = () => answerQuestion(i);
            optBox.appendChild(b);
        });
    }

    function answerQuestion(choice) {
        if (quizAnswered) return;
        quizAnswered = true;
        const item = quizData[quizIndex];
        const opts = document.querySelectorAll('#qOptions .quiz-opt');
        opts.forEach((b, i) => {
            b.disabled = true;
            if (i === item.answer) b.classList.add('correct');
            else if (i === choice) b.classList.add('wrong');
        });
        if (choice === item.answer) {
            quizScore++;
            document.getElementById('qScore').innerText = quizScore;
        }
        const ex = document.getElementById('qExplain');
        ex.innerText = (choice === item.answer ? "✓ 答對了！ " : "✗ 正確答案：" + item.options[item.answer] + "。 ") + item.explain;
        ex.classList.add('show');
        const nextBtn = document.getElementById('qNext');
        nextBtn.innerText = (quizIndex < quizData.length - 1) ? '下一題 →' : '查看結果 →';
        nextBtn.classList.add('show');
    }

    function nextQuestion() {
        if (quizIndex < quizData.length - 1) {
            quizIndex++;
            loadQuestion();
        } else {
            showQuizResult();
        }
    }

    function showQuizResult() {
        document.getElementById('quizPlay').style.display = 'none';
        document.getElementById('quizResult').style.display = 'block';
        document.getElementById('finalScore').innerText = quizScore;
        let rating, msg;
        if (quizScore <= 2) {
            rating = "🌱 氣候新手 (LEVEL 1)";
            msg = "別擔心！剛踏出第一步。往上滑回去看看氣候數據與行動方案，再來挑戰一次吧！";
        } else if (quizScore <= 4) {
            rating = "🌿 氣候公民 (LEVEL 2)";
            msg = "不錯喔！你已經具備基本氣候素養，再多了解一些細節就能成為氣候行動者。";
        } else if (quizScore === 5) {
            rating = "🌳 氣候達人 (LEVEL 3)";
            msg = "非常厲害！你對氣候議題的了解超越大多數人，快把知識分享給身邊的人。";
        } else {
            rating = "🌍 氣候守護者 (LEVEL MAX)";
            msg = "滿分！你就是 SDG 13 最需要的氣候行動領袖，地球需要更多像你這樣的人！";
        }
        document.getElementById('finalRating').innerText = rating;
        document.getElementById('finalMsg').innerText = msg;
        addLog("INFO", "氣候知識檢測完成，得分 " + quizScore + "/6 — 評級：" + rating);
    }

    /* === GAME 2: NET ZERO SIMULATOR === */
    const BASELINE  = 2.7;   // 照目前趨勢的 2100 升溫
    const TARGET    = 1.5;   // 巴黎協定目標
    const DANGER    = 3.0;   // 危險臨界值（觸發警告彈窗）
    const MAX_SCALE = 4.0;   // 進度條滿刻度
    const simData = [
        // ── 減碳行動（降低升溫 ↓）──
        { name: "100% 再生能源發電",   effect: -0.6,  type: "good" },
        { name: "電動運輸全面普及",     effect: -0.35, type: "good" },
        { name: "停止毀林 + 大規模造林", effect: -0.3,  type: "good" },
        { name: "工業碳捕捉與封存 (CCS)", effect: -0.25, type: "good" },
        { name: "建築與能源效率提升",   effect: -0.2,  type: "good" },
        { name: "永續飲食與農業",       effect: -0.2,  type: "good" },
        { name: "全球碳定價政策",       effect: -0.3,  type: "good" },
        // ── 高排放行為（增加升溫 ↑）──
        { name: "擴建燃煤電廠",         effect:  0.5,  type: "bad" },
        { name: "大規模砍伐雨林",       effect:  0.4,  type: "bad" },
        { name: "鼓勵燃油汽車與航空",   effect:  0.35, type: "bad" },
        { name: "擴張高耗能重工業",     effect:  0.3,  type: "bad" }
    ];
    const simState = simData.map(() => false);

    let _lastBadIdx = null;   // 記錄最近一次觸發警告的高排放行為

    // 洗牌：把減碳與高排放選項打散混合，瀏覽者點擊前看不出好壞
    function shuffled(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function buildSimulator() {
        const box = document.getElementById('simActions');
        box.innerHTML = '';
        const order = shuffled(simData.map((_, i) => i));  // 混合排列
        order.forEach(i => {
            const a = simData[i];
            const d = document.createElement('div');
            d.className = 'sim-action' + (a.type === 'bad' ? ' bad-action' : '');
            d.dataset.idx = i;
            d.onclick = () => toggleSim(i, d);
            // 效果值預設隱藏（顯示「?」），點擊後才揭曉
            d.innerHTML =
                '<div class="sim-left"><span class="sim-toggle"></span>' +
                '<span class="sim-action-name">' + a.name + '</span></div>' +
                '<span class="sim-action-val" data-hidden="1">?</span>';
            box.appendChild(d);
        });
        updateSimulator();
    }

    function toggleSim(i, el) {
        simState[i] = !simState[i];
        el.classList.toggle('on', simState[i]);
        const a = simData[i];
        const valEl = el.querySelector('.sim-action-val');
        if (simState[i]) {
            // 揭曉效果值
            const sign = a.effect < 0 ? '' : '+';
            valEl.textContent = sign + a.effect.toFixed(2) + '°C';
            valEl.removeAttribute('data-hidden');
            // 只要選到「高排放行為」就立刻跳出警告
            if (a.type === 'bad') {
                _lastBadIdx = i;
                showSimDanger(a.name);
            }
        } else {
            // 取消 → 重新隱藏
            valEl.textContent = '?';
            valEl.setAttribute('data-hidden', '1');
        }
        updateSimulator();
    }

    // 取消最近一次觸發警告的高排放行為
    function cancelBadAction() {
        const i = _lastBadIdx;
        if (i != null && simState[i]) {
            simState[i] = false;
            const el = document.querySelector('#simActions .sim-action[data-idx="' + i + '"]');
            if (el) {
                el.classList.remove('on');
                const v = el.querySelector('.sim-action-val');
                v.textContent = '?';
                v.setAttribute('data-hidden', '1');
            }
            addLog("INFO", "✓ 已取消高排放行為「" + simData[i].name + "」，回到正確的減碳路徑。");
        }
        closeModal('simDanger');
        updateSimulator();
    }

    /* === 升溫曲線圖（Chart.js + IPCC AR6 SSP 情境）=== */
    const SSP_YEARS = [2025, 2030, 2040, 2050, 2060, 2070, 2080, 2090, 2100];
    // 三條官方情境的升溫路徑（相對工業化前 1850–1900，°C）。
    // 端點值來源：IPCC AR6 WG1 SPM Table SPM.1；中間年份為平滑內插（僅供視覺化）。
    const SSP = {
        ssp119: [1.2, 1.3,  1.5, 1.6, 1.55, 1.5, 1.45, 1.42, 1.4],  // 最佳：強力減碳
        ssp245: [1.2, 1.35, 1.6, 2.0, 2.2,  2.4, 2.5,  2.6,  2.7],  // 中間：現行政策
        ssp585: [1.25,1.4,  1.7, 2.4, 2.9,  3.4, 3.8,  4.1,  4.4]   // 最糟：高排放
    };
    let simChart = null;

    // 依使用者的 2100 升溫終點，在三條 SSP 情境之間「逐年內插」出一條路徑
    function computeUserCurve(endpoint) {
        const E = Math.max(1.1, Math.min(4.4, endpoint));   // 限制在情境涵蓋範圍
        let lower, upper, frac;
        if (E <= 1.4) return SSP.ssp119.slice();            // 比最佳情境還低 → 用最佳路徑
        if (E <= 2.7) { lower = SSP.ssp119; upper = SSP.ssp245; frac = (E - 1.4) / (2.7 - 1.4); }
        else          { lower = SSP.ssp245; upper = SSP.ssp585; frac = (E - 2.7) / (4.4 - 2.7); }
        // 每年的值 = 下情境 + 比例 ×（上情境 − 下情境）
        return lower.map((v, i) => Math.round((v + frac * (upper[i] - v)) * 100) / 100);
    }

    function buildSimChart() {
        // Chart.js 沒載入（離線）→ 退回長條圖
        if (typeof Chart === 'undefined') {
            document.getElementById('simFallback').style.display = 'block';
            document.getElementById('simChartWrap').style.display = 'none';
            return;
        }
        const ctx = document.getElementById('simChart').getContext('2d');
        simChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: SSP_YEARS,
                datasets: [
                    // 第 0 條＝使用者路徑（粗線，會即時重畫、依達標變色）
                    { label: '你的路徑',     data: SSP.ssp245.slice(), borderColor: '#00e87a', backgroundColor: '#00e87a', borderWidth: 3, pointRadius: 0, tension: 0.35, order: 0 },
                    // 1.5°C 巴黎協定目標（白色虛線）
                    { label: '1.5°C 目標',   data: SSP_YEARS.map(() => 1.5), borderColor: '#ffffff', borderWidth: 1.5, borderDash: [6, 4], pointRadius: 0, order: 1 },
                    // 三條 SSP 情境參考線（淡色虛線）
                    { label: 'SSP1-1.9 最佳', data: SSP.ssp119, borderColor: 'rgba(0,232,122,0.25)', borderWidth: 1, borderDash: [3, 3], pointRadius: 0, order: 2 },
                    { label: 'SSP2-4.5 中間', data: SSP.ssp245, borderColor: 'rgba(255,207,0,0.25)', borderWidth: 1, borderDash: [3, 3], pointRadius: 0, order: 3 },
                    { label: 'SSP5-8.5 最糟', data: SSP.ssp585, borderColor: 'rgba(255,51,51,0.25)', borderWidth: 1, borderDash: [3, 3], pointRadius: 0, order: 4 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { labels: { color: '#888', font: { size: 9 }, boxWidth: 14, padding: 8 } },
                    tooltip: { callbacks: { label: c => c.dataset.label + '：+' + c.parsed.y.toFixed(2) + '°C' } }
                },
                scales: {
                    x: { ticks: { color: '#555', font: { size: 9 } }, grid: { color: '#1c1c1c' } },
                    y: { min: 1, max: 4.6,
                         title: { display: true, text: '升溫 °C（相對工業化前）', color: '#666', font: { size: 9 } },
                         ticks: { color: '#555', font: { size: 9 } }, grid: { color: '#1c1c1c' } }
                }
            }
        });
    }

    // 更新使用者路徑（顏色依達標與否：綠=達標 / 黃=超標 / 紅=危險）
    function updateSimChart(endpoint, temp) {
        if (!simChart) return;
        const color = temp <= TARGET ? '#00e87a' : (temp < DANGER ? '#ffcf00' : '#ff3333');
        simChart.data.datasets[0].data = computeUserCurve(endpoint);
        simChart.data.datasets[0].borderColor = color;
        simChart.data.datasets[0].backgroundColor = color;
        simChart.update();
    }

    // 退路長條圖（Chart.js 載入失敗時才用）
    function updateFallbackBar(temp) {
        const bar = document.getElementById('simBar');
        if (!bar) return;
        bar.style.width = Math.min(100, (temp / MAX_SCALE) * 100) + '%';
        bar.className = 'sim-bar-fill' + (temp <= TARGET ? ' safe' : (temp < DANGER ? ' mid' : ''));
    }

    function updateSimulator() {
        let delta = 0;
        simData.forEach((a, i) => { if (simState[i]) delta += a.effect; });
        const rawEnd = BASELINE + delta;                 // 2100 升溫終點（給曲線用，未設下限）
        const temp = Math.round(Math.max(0.8, rawEnd) * 10) / 10;

        const tempEl = document.getElementById('simTemp');
        tempEl.innerHTML = '+' + temp.toFixed(1) + '<span class="sim-temp-unit">°C</span>';
        const status = document.getElementById('simStatus');
        tempEl.className = 'sim-temp';
        status.className = 'sim-status';

        if (temp <= TARGET) {
            tempEl.classList.add('safe');
            status.classList.add('win');
            status.innerHTML = '✓ 成功！你將升溫控制在 1.5°C 目標內，達成 SDG 13！這證明：氣候行動需要「多管齊下」，沒有單一萬靈丹。';
            if (!window._simWon) {
                window._simWon = true;
                addLog("INFO", "🌍 淨零模擬達標！升溫成功控制在 +" + temp.toFixed(1) + "°C ≤ 1.5°C 目標");
            }
        } else if (temp < DANGER) {
            tempEl.classList.add('mid');
            status.innerHTML = '↗ 目前 +' + temp.toFixed(1) + '°C。試著點擊不同選項 — 但小心，有些行為反而會讓地球更熱！';
            window._simWon = false;
        } else {
            tempEl.classList.add('danger');
            status.classList.add('danger');
            status.innerHTML = '🔥 危險！預測升溫達 +' + temp.toFixed(1) + '°C，已突破 3°C 災難臨界值！';
            window._simWon = false;
        }

        // 更新曲線圖（或退路長條）
        if (simChart) updateSimChart(rawEnd, temp);
        else updateFallbackBar(temp);
    }

    function showSimDanger(name) {
        document.getElementById('simDangerName').innerText = name;
        openModal('simDanger');
        addLog("ALERT", "⚠ 選擇了高排放行為「" + name + "」— 觸發升溫警告");
    }

    // 初始化兩個遊戲
    startQuiz();
    buildSimChart();    // 先建立升溫曲線圖（buildSimulator 內會呼叫 updateSimulator 畫出初始路徑）
    buildSimulator();

    /* === Console Easter Egg === */
    console.log("%cProtocol 13 v2.0 initialized.", "color:#00e87a;font-size:14px;font-weight:bold;");
    console.log("%cMonitoring global climate targets — SDG 13 Climate Action", "color:#ffcf00;");