import argparse
import json
import os
import re
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass

import anthropic

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "output"
HUMAN_REVIEW_DIR = OUTPUT_DIR / "human_review"
AGENTS_DIR = BASE_DIR / "agents"

MODEL_RESEARCH = "claude-opus-4-8"
MODEL_PRODUCT = "claude-opus-4-8"
MODEL_SNS = "claude-sonnet-4-6"

WEB_SEARCH_TOOL = {"type": "web_search_20260209", "name": "web_search"}

JST = timezone(timedelta(hours=9))

REVIEW_FILE_LABELS = {
    "research_report": "リサーチ結果の確認",
    "oem_review": "OEMパートナーの選定",
    "blend_review": "ブレンド候補のテイスティング・選定",
    "oem_inquiry": "OEM問い合わせメールの送信判断",
    "pricing_simulation": "価格・クラウドファンディング目標額の最終決定",
    "sns_review": "SNS投稿の承認",
}


def today_str():
    return datetime.now(JST).strftime("%Y-%m-%d")


def load_json(path, default):
    path = Path(path)
    if not path.exists():
        return default
    content = path.read_text(encoding="utf-8").strip()
    if not content:
        return default
    return json.loads(content)


def save_json(path, data):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def save_text(path, text):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def load_brand_context():
    return load_json(BASE_DIR / "brand_context.json", {})


def load_agent_persona(name):
    return (AGENTS_DIR / f"{name}.md").read_text(encoding="utf-8")


def load_progress():
    return load_json(DATA_DIR / "progress_log.json", {})


def save_progress(progress):
    save_json(DATA_DIR / "progress_log.json", progress)


def merge_by_key(existing, new_items, key):
    merged = list(existing)
    existing_keys = {e.get(key) for e in existing if isinstance(e, dict)}
    for item in new_items:
        if not isinstance(item, dict):
            continue
        k = item.get(key)
        if k and k not in existing_keys:
            merged.append(item)
            existing_keys.add(k)
    return merged


def extract_json(text):
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    fence_match = re.search(r"```(?:json)?\s*(.*?)\s*```", text, re.DOTALL)
    if fence_match:
        try:
            return json.loads(fence_match.group(1).strip())
        except json.JSONDecodeError:
            pass
    bracket_match = re.search(r"(\[.*\]|\{.*\})", text, re.DOTALL)
    if bracket_match:
        return json.loads(bracket_match.group(1))
    raise ValueError("レスポンスからJSONを抽出できませんでした")


def get_client():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError(
            "ANTHROPIC_API_KEY が設定されていません。ruhe/.env.example を参考に .env を作成してください。"
        )
    return anthropic.Anthropic(api_key=api_key)


def call_claude(system_prompt, user_message, model, max_tokens=8000, use_web_search=False, max_retries=3):
    client = get_client()
    kwargs = dict(
        model=model,
        max_tokens=max_tokens,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}],
    )
    if use_web_search:
        kwargs["tools"] = [WEB_SEARCH_TOOL]

    response = None
    for attempt in range(1, max_retries + 1):
        try:
            response = client.messages.create(**kwargs)
            break
        except (anthropic.RateLimitError, anthropic.APIConnectionError, anthropic.InternalServerError) as e:
            if attempt == max_retries:
                print(f"[ERROR] Claude API呼び出しが{max_retries}回失敗しました: {e}", file=sys.stderr)
                raise
            wait = 2**attempt
            print(f"[WARN] API呼び出し失敗（{attempt}回目）。{wait}秒後に再試行します: {e}", file=sys.stderr)
            time.sleep(wait)

    return "\n".join(block.text for block in response.content if getattr(block, "type", None) == "text")


def run_research_agent(incremental=False):
    print("[Research] 開始します...")
    persona = load_agent_persona("research_agent")
    brand_json = json.dumps(load_brand_context(), ensure_ascii=False, indent=2)

    oem_path = DATA_DIR / "oem_list.json"
    competitor_path = DATA_DIR / "competitor_list.json"
    makuake_path = DATA_DIR / "makuake_cases.json"

    existing_oem = load_json(oem_path, [])
    existing_competitors = load_json(competitor_path, [])
    existing_makuake = load_json(makuake_path, [])

    oem_target = 5 if incremental else 15
    competitor_target = 3 if incremental else 10
    makuake_target = 3 if incremental else 8

    existing_oem_names = [e.get("company_name") for e in existing_oem]
    user_msg = f"""{brand_json}

上記はRUHEブランドの背景情報（brand_context.json）です。

ハーブティーの小ロット対応・個人/スタートアップ歓迎のOEM企業を{oem_target}社程度、Web検索を使って調査してください。
既に判明している企業（重複させないこと）: {existing_oem_names if existing_oem_names else "なし"}

各企業について以下のJSON配列形式のみで出力してください（説明文・前置きは不要、JSON以外の文字は出力しないこと）：
[
  {{"company_name": "string", "url": "string", "min_lot": "string", "features": "string", "contact_url": "string", "notes": "string"}}
]
"""
    response_text = call_claude(persona, user_msg, model=MODEL_RESEARCH, use_web_search=True, max_tokens=8000)
    try:
        new_oem = extract_json(response_text)
    except (json.JSONDecodeError, ValueError):
        print("[Research][WARN] OEMリストのJSON解析に失敗しました。")
        new_oem = []
    merged_oem = merge_by_key(existing_oem, new_oem, "company_name")
    save_json(oem_path, merged_oem)
    print(f"[Research] OEM候補 {len(merged_oem)}社（新規{len(new_oem)}件）を保存しました。")

    existing_brand_names = [e.get("brand_name") for e in existing_competitors]
    user_msg = f"""{brand_json}

既存の睡眠用ハーブティーブランドを{competitor_target}件程度、Web検索を使って調査してください。
各ブランドについて、ビジネスパーソン向けかどうかを必ず明記してください。
既に判明しているブランド（重複させないこと）: {existing_brand_names if existing_brand_names else "なし"}

各ブランドについて以下のJSON配列形式のみで出力してください（説明文・前置きは不要）：
[
  {{"brand_name": "string", "price_per_bag": "string", "target": "string", "world_view": "string", "sales_channel": "string", "sns_followers": "string", "weakness": "string", "url": "string"}}
]
"""
    response_text = call_claude(persona, user_msg, model=MODEL_RESEARCH, use_web_search=True, max_tokens=8000)
    try:
        new_competitors = extract_json(response_text)
    except (json.JSONDecodeError, ValueError):
        print("[Research][WARN] 競合リストのJSON解析に失敗しました。")
        new_competitors = []
    merged_competitors = merge_by_key(existing_competitors, new_competitors, "brand_name")
    save_json(competitor_path, merged_competitors)
    print(f"[Research] 競合ブランド {len(merged_competitors)}件（新規{len(new_competitors)}件）を保存しました。")

    existing_project_names = [e.get("project_name") for e in existing_makuake]
    user_msg = f"""飲料・ハーブティー関連で成功したMakuakeクラウドファンディング事例を{makuake_target}件程度、Web検索を使って調査してください。
既に判明している事例（重複させないこと）: {existing_project_names if existing_project_names else "なし"}

各事例について以下のJSON配列形式のみで出力してください（説明文・前置きは不要）：
[
  {{"project_name": "string", "category": "string", "target_amount": "string", "achieved_amount": "string", "backers": "string", "success_factor": "string", "url": "string"}}
]
"""
    response_text = call_claude(persona, user_msg, model=MODEL_RESEARCH, use_web_search=True, max_tokens=8000)
    try:
        new_makuake = extract_json(response_text)
    except (json.JSONDecodeError, ValueError):
        print("[Research][WARN] Makuake事例のJSON解析に失敗しました。")
        new_makuake = []
    merged_makuake = merge_by_key(existing_makuake, new_makuake, "project_name")
    save_json(makuake_path, merged_makuake)
    print(f"[Research] Makuake事例 {len(merged_makuake)}件（新規{len(new_makuake)}件）を保存しました。")

    report_lines = [f"# Research レポート（{today_str()}）", "", f"## OEM候補（{len(merged_oem)}社）"]
    for e in merged_oem:
        report_lines.append(f"- **{e.get('company_name', '不明')}** | 最小ロット: {e.get('min_lot', '不明')} | {e.get('url', '')}")
    report_lines += ["", f"## 競合ブランド（{len(merged_competitors)}件）"]
    for e in merged_competitors:
        report_lines.append(f"- **{e.get('brand_name', '不明')}** | ターゲット: {e.get('target', '不明')} | {e.get('url', '')}")
    report_lines += ["", f"## Makuake成功事例（{len(merged_makuake)}件）"]
    for e in merged_makuake:
        report_lines.append(f"- **{e.get('project_name', '不明')}** | 達成額: {e.get('achieved_amount', '不明')} | {e.get('url', '')}")
    save_text(HUMAN_REVIEW_DIR / "research_report.md", "\n".join(report_lines) + "\n")

    oem_review_lines = [
        f"# OEM候補レビュー（{today_str()}）",
        "",
        "以下のOEM候補から、最終的なパートナーを選定してください（AIによる代理判断は行いません）。",
        "",
    ]
    for e in merged_oem:
        oem_review_lines.append(
            f"## {e.get('company_name', '不明')}\n"
            f"- URL: {e.get('url', '不明')}\n"
            f"- 最小ロット: {e.get('min_lot', '不明')}\n"
            f"- 特徴: {e.get('features', '不明')}\n"
            f"- 問い合わせ先: {e.get('contact_url', '不明')}\n"
            f"- メモ: {e.get('notes', '')}\n"
        )
    save_text(HUMAN_REVIEW_DIR / "oem_review.md", "\n".join(oem_review_lines) + "\n")

    progress = load_progress()
    progress["last_updated"] = today_str()
    progress.setdefault("research", {})
    progress["research"]["last_run"] = today_str()
    progress["research"]["oem_count"] = len(merged_oem)
    progress["research"]["competitor_count"] = len(merged_competitors)
    progress["research"]["makuake_count"] = len(merged_makuake)
    save_progress(progress)

    print(
        f"Research完了：OEM{len(merged_oem)}社 / 競合{len(merged_competitors)}社 / "
        f"Makuake事例{len(merged_makuake)}件 — output/human_review/research_report.mdに保存"
    )


def run_product_agent():
    print("[Product] 開始します...")
    persona = load_agent_persona("product_agent")
    brand = load_brand_context()
    brand_json = json.dumps(brand, ensure_ascii=False, indent=2)

    user_msg = f"""{brand_json}

RUHE SLEEPのためのハーブ・成分ブレンドパターンを3パターン提案してください。
科学的根拠（evidence）が確認できる成分のみを使用し、効能を断定する表現は避けてください。

以下のJSON配列形式のみで出力してください（説明文・前置きは不要）：
[
  {{
    "pattern_name": "string",
    "ingredients": [{{"name": "string", "role": "string", "evidence": "string"}}],
    "taste_profile": "string",
    "target_scene": "string",
    "pros": "string",
    "cons": "string"
  }}
]
"""
    response_text = call_claude(persona, user_msg, model=MODEL_PRODUCT, max_tokens=6000)
    try:
        blends = extract_json(response_text)
    except (json.JSONDecodeError, ValueError):
        print("[Product][WARN] ブレンド候補のJSON解析に失敗しました。")
        blends = []
    save_json(DATA_DIR / "blend_candidates.json", blends)

    blend_lines = [
        f"# ブレンド候補レビュー（{today_str()}）",
        "",
        "テイスティングを行い、最終的な成分を決定してください（AIによる代理判断は行いません）。",
        "",
    ]
    for b in blends:
        blend_lines.append(f"## {b.get('pattern_name', '不明')}")
        blend_lines.append(f"- 風味: {b.get('taste_profile', '不明')}")
        blend_lines.append(f"- 想定シーン: {b.get('target_scene', '不明')}")
        blend_lines.append("- 成分:")
        for ing in b.get("ingredients", []):
            blend_lines.append(f"  - {ing.get('name', '不明')}（役割: {ing.get('role', '不明')} / 根拠: {ing.get('evidence', '不明')}）")
        blend_lines.append(f"- メリット: {b.get('pros', '不明')}")
        blend_lines.append(f"- デメリット: {b.get('cons', '不明')}")
        blend_lines.append("")
    save_text(HUMAN_REVIEW_DIR / "blend_review.md", "\n".join(blend_lines) + "\n")

    oem_names = [e.get("company_name") for e in load_json(DATA_DIR / "oem_list.json", [])][:5]
    user_msg = f"""{brand_json}

以下はブレンド候補です：
{json.dumps(blends, ensure_ascii=False, indent=2)}

OEM企業（候補: {oem_names if oem_names else "未調査"}）への問い合わせメールの文面を1パターン作成してください。
以下を必ず含めてください：ブランド概要、希望するブレンド内容、希望最小ロット数、サンプル依頼、価格・リードタイムに関する質問。

メール文面のみをMarkdown形式で出力してください（このメールは人間が確認後、手動送信します）。
"""
    inquiry_text = call_claude(persona, user_msg, model=MODEL_PRODUCT, max_tokens=3000)
    save_text(
        HUMAN_REVIEW_DIR / "oem_inquiry.md",
        f"# OEM問い合わせメール（下書き・{today_str()}）\n\n"
        "**注意：このメールは内容を確認のうえ、人間が手動で送信してください。AIが自動送信することはありません。**\n\n"
        f"{inquiry_text}\n",
    )

    lot_sizes = [100, 300, 500]
    retail_prices = [1200, 1500, 1800]
    bag_costs = [50, 80, 100, 150]
    bags_per_box = brand.get("pricing_target", {}).get("box", {}).get("bags_per_box", 10)

    sim_lines = [f"# 価格シミュレーション（{today_str()}）", ""]
    sim_lines.append(
        "| ロットバッグ数 | ロット内箱数 | 小売価格(箱) | バッグ単価コスト | 粗利(箱) | 粗利率 | 損益分岐点(箱数) | ロット内で回収可能か | 想定CF目標額 |"
    )
    sim_lines.append("|---|---|---|---|---|---|---|---|---|")
    for lot in lot_sizes:
        total_boxes_in_lot = lot / bags_per_box
        for price in retail_prices:
            for cost in bag_costs:
                cost_per_box = cost * bags_per_box
                profit_per_box = price - cost_per_box
                margin = (profit_per_box / price * 100) if price else 0
                total_lot_cost = lot * cost
                if profit_per_box > 0:
                    breakeven_boxes = total_lot_cost / profit_per_box
                    breakeven_str = f"{breakeven_boxes:.1f}箱"
                    feasible = "○" if breakeven_boxes <= total_boxes_in_lot else "△（増産が必要）"
                else:
                    breakeven_str = "到達不可"
                    feasible = "✕（赤字価格）"
                crowdfunding_target = total_lot_cost * 1.3
                sim_lines.append(
                    f"| {lot} | {total_boxes_in_lot:.0f} | {price}円 | {cost}円 | {profit_per_box}円 | "
                    f"{margin:.1f}% | {breakeven_str} | {feasible} | {crowdfunding_target:,.0f}円 |"
                )
    sim_lines.append("")
    sim_lines.append(
        "※ 損益分岐点は「ロット仕入れ総コスト ÷ 箱あたり粗利」で算出した箱数です。"
        "想定クラウドファンディング目標額は仕入れ総コストに30%の安全マージンを加えた簡易推計値です。"
        "実際の目標額は、配送費・決済手数料・Makuake手数料等を加味して人間が最終判断してください。"
    )
    save_text(HUMAN_REVIEW_DIR / "pricing_simulation.md", "\n".join(sim_lines) + "\n")

    progress = load_progress()
    progress["last_updated"] = today_str()
    progress.setdefault("product", {})
    progress["product"]["last_run"] = today_str()
    progress["product"]["blend_candidates_count"] = len(blends)
    progress["product"]["oem_inquiry_drafted"] = True
    progress["product"]["pricing_simulation_done"] = True
    save_progress(progress)

    print(
        f"Product完了：ブレンド候補{len(blends)}件 / OEM問い合わせ文面作成済み / "
        "価格シミュレーション完了 — output/human_review/に保存"
    )


def run_sns_agent():
    print("[SNS] 開始します...")
    persona = load_agent_persona("sns_agent")
    brand_json = json.dumps(load_brand_context(), ensure_ascii=False, indent=2)
    date_str = today_str()

    theme_plan = [
        ("夜のルーティーン", 4),
        ("睡眠・休息に関する論理的な解説", 3),
        ("働く人への共感投稿", 3),
        ("ハーブ・植物にまつわる小話", 2),
        ("デスク環境に関する投稿", 2),
    ]
    theme_list_str = "\n".join(f"- {name}：{count}本" for name, count in theme_plan)

    user_msg = f"""{brand_json}

Phase 0（商品の宣伝・販促は一切行わない時期）のSNS投稿を14本（2週間分）作成してください。
テーマ配分は以下の通りです（合計14本になるよう厳密に従ってください）：
{theme_list_str}

各投稿は以下のJSON配列形式のみで出力してください（説明文・前置きは不要）：
[
  {{
    "theme": "string（上記テーマのいずれか）",
    "instagram_body": "string（300文字以内）",
    "hashtags": ["string", "..."],
    "x_summary": "string（140文字以内）"
  }}
]
"""
    response_text = call_claude(persona, user_msg, model=MODEL_SNS, max_tokens=8000)
    try:
        posts = extract_json(response_text)
    except (json.JSONDecodeError, ValueError):
        print("[SNS][WARN] 投稿ドラフトのJSON解析に失敗しました。")
        posts = []

    draft_lines = [f"# SNS投稿ドラフト（{date_str}）", ""]
    for i, p in enumerate(posts, start=1):
        hashtags = " ".join(f"#{h.lstrip('#')}" for h in p.get("hashtags", []))
        draft_lines.append(f"## 投稿{i}：{p.get('theme', '不明')}")
        draft_lines.append("**Instagram本文（300文字以内）：**")
        draft_lines.append(p.get("instagram_body", ""))
        draft_lines.append("")
        draft_lines.append("**ハッシュタグ（5〜10個）：**")
        draft_lines.append(hashtags)
        draft_lines.append("")
        draft_lines.append("**X用要約版（140文字以内）：**")
        draft_lines.append(p.get("x_summary", ""))
        draft_lines.append("")
    save_text(DATA_DIR / "sns_drafts" / f"{date_str}.md", "\n".join(draft_lines) + "\n")

    user_msg = """睡眠・ハーブティー・ビジネスパーソン関連で効果的なInstagramハッシュタグを、Web検索を使って調査してください。
投稿量（人気度）に応じてmain（大規模）/sub（中規模）/niche（小規模・専門的）の3層に分類してください。

以下のJSON形式のみで出力してください（説明文・前置きは不要）：
{
  "main": ["string", "..."],
  "sub": ["string", "..."],
  "niche": ["string", "..."]
}
"""
    response_text = call_claude(persona, user_msg, model=MODEL_SNS, use_web_search=True, max_tokens=4000)
    try:
        hashtags = extract_json(response_text)
    except (json.JSONDecodeError, ValueError):
        print("[SNS][WARN] ハッシュタグ調査のJSON解析に失敗しました。")
        hashtags = {"main": [], "sub": [], "niche": []}
    save_json(OUTPUT_DIR / "hashtag_list.json", hashtags)

    competitors = load_json(DATA_DIR / "competitor_list.json", [])
    user_msg = f"""以下は調査済みの競合ブランド一覧です：
{json.dumps(competitors, ensure_ascii=False, indent=2)}

これらの競合ブランドのSNSアカウントについて、Web検索を使ってエンゲージメント傾向を分析し、
RUHEブランドが差別化できる機会についてMarkdown形式でまとめてください。
"""
    analysis_text = call_claude(persona, user_msg, model=MODEL_SNS, use_web_search=True, max_tokens=4000)
    save_text(OUTPUT_DIR / "sns_analysis.md", f"# 競合SNS分析（{date_str}）\n\n{analysis_text}\n")

    review_lines = [
        f"# SNS投稿レビュー（{date_str}）",
        "",
        "投稿前に必ずブランドボイスとしての適切性を確認してください（AIによる自動投稿は行いません）。",
        "",
        f"今週分のドラフト全文は `data/sns_drafts/{date_str}.md` を参照してください。",
        "",
        "## 投稿一覧（概要）",
    ]
    for i, p in enumerate(posts, start=1):
        review_lines.append(f"{i}. [{p.get('theme', '不明')}] {p.get('instagram_body', '')[:40]}...")
    save_text(HUMAN_REVIEW_DIR / "sns_review.md", "\n".join(review_lines) + "\n")

    progress = load_progress()
    progress["last_updated"] = date_str
    progress.setdefault("sns", {})
    progress["sns"]["last_run"] = date_str
    progress["sns"]["posts_drafted"] = progress["sns"].get("posts_drafted", 0) + len(posts)
    progress["sns"]["posts_pending"] = len(posts)
    progress["sns"]["hashtag_research_done"] = True
    progress["sns"]["competitor_analysis_done"] = True
    save_progress(progress)

    print(
        f"SNS完了：投稿{len(posts)}本ドラフト作成 / ハッシュタグリサーチ完了 / "
        "競合分析完了 — output/human_review/sns_review.mdに保存"
    )


def run_report():
    progress = load_progress()
    date_str = today_str()
    research = progress.get("research", {})
    product = progress.get("product", {})
    sns = progress.get("sns", {})

    def ran_today(section):
        return section.get("last_run") == date_str

    progress_done = []
    if ran_today(research):
        progress_done.append(
            f"- Research：OEM{research.get('oem_count', 0)}社 / 競合{research.get('competitor_count', 0)}件 / "
            f"Makuake{research.get('makuake_count', 0)}件 を更新"
        )
    else:
        progress_done.append("- Research：今回は実行されませんでした")

    if ran_today(product):
        progress_done.append(
            f"- Product：ブレンド候補{product.get('blend_candidates_count', 0)}件 / "
            "OEM問い合わせ文面 / 価格シミュレーションを更新"
        )
    else:
        progress_done.append("- Product：今回は実行されませんでした")

    if ran_today(sns):
        progress_done.append(f"- SNS：投稿{sns.get('posts_pending', 0)}本のドラフトを作成")
    else:
        progress_done.append("- SNS：今回は実行されませんでした")

    review_files = sorted(HUMAN_REVIEW_DIR.glob("*.md"))
    review_lines = [
        f"{i}. {REVIEW_FILE_LABELS.get(f.stem, f.stem)}→{f.relative_to(BASE_DIR)}"
        for i, f in enumerate(review_files, start=1)
    ]
    if not review_lines:
        review_lines = ["（現在確認待ちの項目はありません）"]

    next_tasks = []
    if research.get("oem_count", 0) < 10:
        next_tasks.append("OEM候補の追加調査")
    if not product.get("blend_approved", False):
        next_tasks.append("ブレンド候補のテイスティング・最終選定")
    if not progress.get("trademark_filed", False):
        next_tasks.append("商標出願（第30類）の準備")
    next_tasks.append("次週分SNS投稿ドラフトの作成・承認")

    blend_status = "承認済み" if product.get("blend_approved", False) else "未承認"
    trademark_status = "済み" if progress.get("trademark_filed", False) else "未"

    report = f"""# RUHE 週次レポート {date_str}
## 今週の進捗
{chr(10).join(progress_done)}
## あなたが確認・判断すべきこと
{chr(10).join(review_lines)}
## 来週の予定タスク
{chr(10).join(f"- {t}" for t in next_tasks)}
## Phase 0 進捗メーター
OEM候補：{research.get('oem_count', 0)}社収集済み
ブレンド候補：{blend_status}
SNS投稿：承認済み{sns.get('posts_approved', 0)}本/未承認{sns.get('posts_pending', 0)}本
商標出願：{trademark_status}
"""
    save_text(OUTPUT_DIR / "weekly_report.md", report)
    print("週次レポートを生成しました: output/weekly_report.md")


def run_review():
    files = sorted(HUMAN_REVIEW_DIR.glob("*.md"))
    if not files:
        print("確認待ちの項目はありません。")
        return
    print("=== 確認・判断待ちの項目 ===")
    for f in files:
        mtime = datetime.fromtimestamp(f.stat().st_mtime, JST).strftime("%Y-%m-%d %H:%M")
        label = REVIEW_FILE_LABELS.get(f.stem, f.stem)
        print(f"- {label} → {f.relative_to(BASE_DIR)}（更新: {mtime}）")


def run_weekly():
    run_research_agent(incremental=True)
    run_product_agent()
    run_sns_agent()
    run_report()


def main():
    parser = argparse.ArgumentParser(description="RUHE AI駆動マルチエージェントシステム")
    parser.add_argument(
        "--mode",
        required=True,
        choices=["weekly", "research", "product", "sns", "report", "review"],
        help="実行モード",
    )
    args = parser.parse_args()

    if args.mode == "weekly":
        run_weekly()
    elif args.mode == "research":
        run_research_agent(incremental=False)
    elif args.mode == "product":
        run_product_agent()
    elif args.mode == "sns":
        run_sns_agent()
    elif args.mode == "report":
        run_report()
    elif args.mode == "review":
        run_review()


if __name__ == "__main__":
    try:
        main()
    except RuntimeError as e:
        print(f"[ERROR] {e}", file=sys.stderr)
        sys.exit(1)
    except anthropic.APIError as e:
        print(f"[ERROR] Claude APIエラー: {e}", file=sys.stderr)
        sys.exit(1)
