# 🚀 Pet Blood Connect デプロイ手順書

このファイルはデプロイ作業（Web公開）のための公式ガイドです。
VS Code などのエディタで開き、必要なテキストやコマンドをコピーして使用してください。

---

## 📦 ステップ1: GitHub へのアップロード
GitHub にリポジトリ（貯蔵庫）を作成し、コードをアップロードします。

### 1. GitHub で新しいリポジトリを作成
- [GitHub](https://github.com/new) にアクセス。
- Repository name: `pet-blood-connect`
- Public / Private: **Private**（非公開）を推奨。

### 2. コマンドラインでの操作 (プロジェクトフォルダ内で実行)
ターミナルを開き、以下のコマンドを順番にコピー＆ペーストして実行してください。

```bash
# Gitの初期化
git init

# 全ファイルをステージング（.env.localは自動で除外されます）
git add .

# 最初のコミット
git commit -m "Initialize project"

# メインブランチに切り替え
git branch -M main

# リポジトリとの紐付け（※URLは自分のものに書き換えてください）
# 例: git remote add origin https://github.com/ユーザー名/pet-blood-connect.git
git remote add origin YOUR_GITHUB_REPO_URL

# アップロード
git push -u origin main
```

---

## 🚀 ステップ2: Vercel での公開設定
Vercel で GitHub リポジトリを取り込み、環境変数を設定します。

### 1. プロジェクトのインポート
- [Vercel Dashboard](https://vercel.com/dashboard) から 「Add New...」→「Project」を選択。
- 先ほど push したリポジトリを 「Import」。

### 2. 環境変数 (Environment Variables) の設定
デプロイ画面の 「Environment Variables」 セクションで、以下の **Key** と **Value** を 1つずつ追加してください。
※右側の Value はそのままコピーして使えます。

| Key | Value (コピー用) |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://sgnorkbtuxtrrrdcgaag.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_W3zK_Hya4m4bshL1d9aWdA_jpRRJEqe` |

---

## 🔐 ステップ3: Supabase 側の最終設定
公開された URL からのログインを許可するために、Supabase の管理画面を更新します。

### 1. URL の登録
- [Supabase Dashboard](https://supabase.com/dashboard/project/sgnorkbtuxtrrrdcgaag/auth/url-configuration) にアクセス。
- **Site URL**: Vercel で発行された URL（例: `https://pet-blood-connect.vercel.app`）に変更。
- **Redirect URLs**: 同じく Vercel の URL を追加して `Save`。

---

## 🛠️ トラブルシューティング
- **ビルドエラーが発生した場合**: お手元の環境で再度 `npm run build` を実行し、エラーが出ないか確認してください。
- **ログインができない場合**: ステップ3 の URL 設定が正しいか（`https://` で始まっているか、末尾に余計なスラッシュがないか等）を確認してください。
