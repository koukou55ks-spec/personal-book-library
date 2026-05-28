# Personal Book Library

Python `FastAPI` と TypeScript `Next.js` で作る、初心者向けの読書管理アプリです。

このリポジトリは、いきなり全部作るのではなく、以下の順で少しずつ積み上げます。

1. バックエンドの最小アプリを作る
2. SQL を意識したデータ設計を入れる
3. 本の CRUD API を作る
4. フロントエンドを接続する

## 現在の状態

最初のコミットとして、以下を用意しています。

- FastAPI の最小アプリ
- ヘルスチェック API
- 本の CRUD API と検索 API
- ダッシュボード集計 API
- SQLAlchemy によるデータモデル
- pytest による API テスト
- Next.js による本一覧・登録・更新・削除フロントエンド

## ディレクトリ構成

```text
backend/
  app/
    api/
      routes.py
    database.py
    main.py
    models.py
    schemas.py
  tests/
    conftest.py
    test_api.py
  pyproject.toml
  uv.lock
frontend/
  src/
    app/
      layout.tsx
      page.tsx
    lib/
      api.ts
  package.json
```

## セットアップ

前提:

- `uv` がインストール済みであること
- Python 3.9 以上が使えること

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload
```

起動後、以下で動作確認できます。

- API: `http://127.0.0.1:8000`
- Docs: `http://127.0.0.1:8000/docs`

## 環境変数

ローカルでは `DATABASE_URL` を使って接続先を切り替えます。

```bash
export DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/personal_book_library"
```

指定しない場合も、同じ PostgreSQL 接続先をデフォルトで参照します。

## テスト

```bash
cd backend
uv run pytest
```

## フロントエンド起動

```bash
cd frontend
npm install
BACKEND_URL=http://127.0.0.1:8000 npm run dev
```

フロントエンド:

- App: `http://127.0.0.1:3000`

いまのフロントエンドでできること:

- 本一覧の表示
- ダッシュボード統計の表示
- タイトル / 著者検索
- 読書状態フィルタ
- 本の登録フォーム送信
- 本の更新フォーム送信
- 本の削除
- 検索条件を保ったまま CRUD 操作

フロントエンド実装で学べること:

- Server Component でのデータ取得
- URL クエリを使った検索フォーム
- Server Action を使った登録フォーム
- Server Action を使った更新・削除
- 操作後に URL 状態を維持するリダイレクト処理
- TypeScript の API 型定義

## いま学べる SQL のポイント

- `INSERT`: 本を登録する
- `SELECT`: 本の一覧を取得する
- `WHERE`: タイトル・著者・読書状態で絞り込む
- `UPDATE`: 本の状態やメモを更新する
- `DELETE`: 本を削除する
- `COUNT`: 冊数や状態別件数を集計する
- `AVG`: 平均評価を集計する

## ダッシュボード API

`GET /dashboard` で、次の集計を返します。

- 総冊数
- 読了冊数
- 平均評価
- 読書状態ごとの件数

## 次の実装ステップ

次はフロントエンドの画面を分割して、一覧・作成・編集の責務を整理しながら、React のコンポーネント分割を学べる形に進めます。
