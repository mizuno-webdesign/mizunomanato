# RUHE（ルーエ）AI駆動マルチエージェントシステム

RUHEブランドのPhase 0（立ち上げ準備期間）を支援するための、Claude APIを用いたマルチエージェントシステムです。Research / Product / SNSの3つのエージェントが、毎週月曜の定例ルーティーンとして情報収集・候補生成・週次レポート作成を行います。

## セットアップ

```bash
cd ruhe
pip install -r requirements.txt
cp .env.example .env
# .env に ANTHROPIC_API_KEY を設定する
```

## 実行モード

| コマンド | 内容 |
|---|---|
| `python main.py --mode weekly` | Research（差分調査）→Product→SNSを順に実行し、週次レポートを生成する毎週月曜の定例ルーティーン |
| `python main.py --mode research` | Researchエージェントのみ実行（初回はこちらでOEM・競合・Makuake事例をまとめて収集） |
| `python main.py --mode product` | Productエージェントのみ実行（ブレンド候補・OEM問い合わせ文面・価格シミュレーション） |
| `python main.py --mode sns` | SNSエージェントのみ実行（2週間分の投稿ドラフト・ハッシュタグ調査・競合SNS分析） |
| `python main.py --mode report` | 週次レポート（`output/weekly_report.md`）のみ再生成 |
| `python main.py --mode review` | `output/human_review/` 以下にある、確認・判断待ちの項目一覧を表示 |

## AIが担当すること

- 情報収集・整理（OEM企業リスト、競合ブランド調査、Makuake成功事例など）
- 案・候補の生成（ブレンドパターン案、OEM問い合わせメール文面、SNS投稿ドラフト）
- 価格シミュレーション（ロット×価格×コストの組み合わせ計算）
- 週次レポートの自動生成

## 人間が判断すること（AIは代理判断しません）

- **ブレンドの最終成分選定** — 必ず実際にテイスティングした上で決定してください。
- **OEMパートナーの最終選定** — AIが整理したリストを参考に、人間の目で判断してください。
- **SNS投稿の承認** — 投稿前に必ずブランドボイスとしての適切性を確認してください。AIが自律的に投稿することはありません。
- **最終的な価格の決定** — シミュレーションはあくまで参考値です。
- **商標出願のタイミング**
- **クラウドファンディング開始のタイミング**

すべてのAI生成物は `output/human_review/` 以下に保存され、人間の確認・承認を経るまで実行・送信・投稿はされません。

## 週次の運用フロー

1. 毎週月曜、`--mode weekly` が実行される（GitHub Actionsで自動化）。
2. `output/human_review/` 以下の生成物を確認する（`--mode review` で一覧表示可能）。
3. 必要な判断（OEM選定、ブレンド承認、SNS投稿承認など）を行う。
4. `data/progress_log.json` の承認フラグ（`blend_approved` など）を必要に応じて手動で更新する。

## コストについて

Anthropic APIは従量課金制です。「minimal budget」というブランド制約を踏まえ、すべてのエージェントは `claude-sonnet-4-6`（Opus系より安価なモデル）を使用しています（`main.py` 冒頭の `MODEL_RESEARCH` / `MODEL_PRODUCT` / `MODEL_SNS` で変更可能）。すべての出力は人間レビューを経るため、より高精度なモデルへの変更は出力品質に不満がある場合のみ検討してください。

想定外の課金を避けるため、[console.anthropic.com](https://console.anthropic.com) の Settings → Billing で月間使用上限（spending limit）を設定しておくことを推奨します。
