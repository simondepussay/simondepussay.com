# simondepussay.com

ポートフォリオサイトとAIアシスタント / Portfolio website with an AI assistant

**https://simondepussay.com**

---

## 概要 / Overview

自分の作品を紹介するポートフォリオです。訪問者はAIアシスタントに、私の経歴やプロジェクトについて日本語か英語で質問できます。

*My portfolio. Visitors can ask an AI assistant about my background and projects, in Japanese or English.*

```
ブラウザ / Browser
   │  HTTPS
   ▼
Azure Static Web Apps (Free)
   │  ├─ public/          静的ファイル（CDN）/ static pages (CDN)
   │  └─ POST /api/chat   Azure Function (Node 20) ── api/
   │        APIキーはサーバー側の設定のみ / key kept in server-side app settings
   ▼
Azure OpenAI (gpt-5-mini)
```

## 技術的なポイント / Technical choices

- **ホスティング費用ゼロ / Zero hosting cost** — 2026年10月に App Service（B1、約13ドル/月）から Static Web Apps 無料プランへ移行。ページは変わらず、ダウンタイムなし。*Moved in October 2026 from App Service (B1, about $13/month) to the Static Web Apps free plan: same pages, no downtime.*
- **最小限の依存 / Minimal dependencies** — チャットのロジックは Node.js の標準機能だけ（`api/src/coeur.js`）。Function とローカルサーバーで同じコードを使います。*The chat logic uses only built-in Node.js modules and is shared by the Azure Function and the local dev server.*
- **APIキーはブラウザに出さない / Key never reaches the browser** — Azure OpenAI のキーは Static Web Apps のアプリ設定にだけ保存。*The Azure OpenAI key lives only in server-side app settings.* （App Service 時代はマネージドIDでしたが、無料プランの Functions では使えません / App Service used a managed identity, which the free plan's Functions don't support.）
- **AIの回答範囲を限定 / A grounded assistant** — プロフィール文書だけを根拠に答え、知らないことは「わからない」と答えます。*The assistant only answers from my profile document and says when it doesn't know.*
- **使いすぎ対策 / Abuse limits** — 訪問者ごと・1日ごとのメッセージ数制限、メッセージ長の制限、モデルの1分あたりトークン上限。*Per-visitor and daily message limits, message length limits, and a tokens-per-minute cap on the model deployment.*
- **検索エンジンとAIに対応 / Search and AI discovery** — `sitemap.xml`、`robots.txt`、構造化データ（JSON-LD）、`llms.txt`、OGP画像。*Sitemap, robots.txt, JSON-LD, llms.txt and share images.*
- **独自ドメイン / Custom domain** — Cloudflare DNS + Static Web Apps の無料証明書（HTTPS）。*Cloudflare DNS with a free Static Web Apps certificate.*

## 構成 / Structure

| | |
|---|---|
| `api/` | Azure Function：チャットAPI / chat API (`src/coeur.js` = shared logic) |
| `server.js` | ローカル開発用サーバー / local dev server |
| `public/staticwebapp.config.json` | Static Web Apps の設定 / Static Web Apps config |
| `public/` | 公開ページ / public pages (HTML, CSS, JS, images) |
| `public/chat.js` | チャットUI / chat widget |
| `deployer.sh` | Azure へのデプロイ / deploy to Azure (SWA CLI) |
| `agent/profil.md` | AIが使うプロフィール文書（このリポジトリには含めていません）/ profile document used by the assistant (not included in this repo) |

## ローカルで動かす / Run locally

```bash
AZURE_TOKEN=$(az account get-access-token --resource https://cognitiveservices.azure.com --query accessToken -o tsv) node server.js
```

→ http://localhost:8080

## 開発の進め方 / How I work

2021年にPythonを独学で始め、2022年末からXcodeでiOSアプリを開発しています。最初の約1年半はAIを使わず、自分でコードを書きながらSwiftとiOSの仕組みを学びました。2024年からAI（GPT-4o）を使い始め、現在はClaude Codeと一緒に開発しています。設計・判断・テスト・公開は自分で行っています。

*I taught myself Python in 2021 and started building iOS apps with Xcode in late 2022. For the first year and a half I wrote all the code myself, without AI. I started using AI in 2024 (GPT-4o), and today I build with Claude Code: I design the architecture, make the decisions, test and ship.*

## 作者 / Author

**Simon Depussay（シモン デプセ）** — iOS・Webエンジニア / iOS & web developer, Tokyo
[simondepussay.com](https://simondepussay.com) · depussay.simon@icloud.com
