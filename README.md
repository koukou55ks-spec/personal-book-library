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
- pytest による最小テスト
- 開発を始めるための依存関係ファイル

## ディレクトリ構成

```text
backend/
  app/
    api/
      routes.py
    main.py
  tests/
    test_health.py
  pyproject.toml
  uv.lock
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

## テスト

```bash
cd backend
uv run pytest
```

## 次の実装ステップ

次は `books` テーブル設計と、それに対応する CRUD API を追加します。
