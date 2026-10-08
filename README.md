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
Azure App Service (Node.js 22)  ── server.js
   │  ├─ public/          静的ファイル / static pages
   │  └─ POST /api/chat   AIアシスタント / AI assistant
   │        マネージドID（秘密鍵なし）/ managed identity, no secret key
   ▼
Azure OpenAI (gpt-5-mini)
```

## 技術的なポイント / Technical choices

- **依存パッケージなし / Zero dependencies** — Node.js 22 の標準機能だけで静的ファイル配信とAPIを実装。*Static files and the chat API use only built-in Node.js modules.*
- **秘密鍵なし / No secret keys** — App Service のマネージドIDで Azure OpenAI に接続。コードにも設定にもAPIキーはありません。*The app reaches Azure OpenAI with its managed identity: no API key anywhere.*
- **AIの回答範囲を限定 / A grounded assistant** — プロフィール文書だけを根拠に答え、知らないことは「わからない」と答えます。*The assistant only answers from my profile document and says when it doesn't know.*
- **使いすぎ対策 / Abuse limits** — 訪問者ごと・1日ごとのメッセージ数制限、メッセージ長の制限。*Per-visitor and daily message limits, message length limits.*
- **検索エンジンとAIに対応 / Search and AI discovery** — `sitemap.xml`、`robots.txt`、構造化データ（JSON-LD）、`llms.txt`、OGP画像。*Sitemap, robots.txt, JSON-LD, llms.txt and share images.*
- **独自ドメイン / Custom domain** — Cloudflare DNS + App Service マネージド証明書（HTTPS）。*Cloudflare DNS with an App Service managed certificate.*

## 構成 / Structure

| | |
|---|---|
| `server.js` | サーバー：静的ファイルとチャットAPI / server: static files and chat API |
| `public/` | 公開ページ / public pages (HTML, CSS, JS, images) |
| `public/chat.js` | チャットUI / chat widget |
| `deployer.sh` | Azure へのデプロイ / deploy to Azure (zip deploy) |
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
