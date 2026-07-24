# Iris AI 花卉辨識前端

使用 Vite、React、TypeScript 與 Tailwind CSS 製作的 RWD 鳶尾花預測介面。

## 本機啟動

```bash
npm install
npm run dev
```

預設 API 是 `https://2026-07-03-python-ai-tvdi.onrender.com`。如需變更，複製 `.env.example` 成 `.env`，並修改 `VITE_API_URL` 後重新啟動開發伺服器。

## Render 部署

1. 將本專案推送到 GitHub。
2. 在 Render 選擇 **New → Static Site**，連接此 GitHub repository。
3. 設定 **Root Directory** 為 `__2026_07_03_python_ai_tvdi__/frontend`。
4. Build Command：`npm ci && npm run build`；Publish Directory：`dist`。
5. 在 Environment 設定 `VITE_API_URL=https://2026-07-03-python-ai-tvdi.onrender.com`，然後部署。

請先重新部署後端，讓 `app.py` 的 CORS 設定生效。
