"""サイトで使う文字だけをまとめた IBM Plex Sans JP（src/fonts/site-sans-*.woff2）を作り直す。

使い方（プロジェクトの一番上のフォルダで）：
  1. npm run build
  2. npm run start -- -p 3101   （別の画面で起動したままにする）
  3. python scripts/make-site-font.py http://localhost:3101
必要なもの：Python の fontTools と brotli。詳しくは src/fonts/README.md。
"""
import glob, io, os, re, sys, tempfile, urllib.error, urllib.request
from html.parser import HTMLParser
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.merge import Merger

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))).replace("\\", "/")
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3101"
out = ROOT + "/src/fonts"
tmp = tempfile.mkdtemp(prefix="site-font-")
os.makedirs(out, exist_ok=True)


class Text(HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=True)
        s.skip = 0
        s.t = []

    def handle_starttag(s, t, a):
        if t in ("script", "style"):
            s.skip += 1
        for k, v in a:
            if v and k in ("alt", "aria-label", "placeholder"):
                s.t.append(v)

    def handle_endtag(s, t):
        if t in ("script", "style"):
            s.skip -= 1

    def handle_data(s, d):
        if not s.skip:
            s.t.append(d)


chars = set(chr(c) for c in range(0x20, 0x7F))
chars |= set(chr(c) for c in range(0x3041, 0x3097)) | set(chr(c) for c in range(0x30A1, 0x30FD))
chars |= set("、。，．・「」『』（）【】！？：；ー〜～…‥－―／＆％￥＋＝＜＞　©・→←↑↓×")
for path in ["/", "/about", "/service", "/works", "/articles", "/contact", "/privacy", "/thanks", "/no-such-page"]:
    try:
        html = urllib.request.urlopen(BASE + path, timeout=60).read().decode("utf-8")
    except urllib.error.HTTPError as e:
        html = e.read().decode("utf-8")
    p = Text()
    p.feed(html)
    chars |= set("".join(p.t))
# 送信中の表示など、HTML に最初は出ない文字は、ソースから拾う
for f in glob.glob(ROOT + "/src/**/*.ts*", recursive=True):
    s = io.open(f, encoding="utf-8").read()
    s = re.sub(r"/\*.*?\*/|//[^\n]*", "", s, flags=re.S)
    chars |= set(re.findall(r"[\u3000-\u9fff\uff00-\uffef]", s))
need = {ord(c) for c in chars if c.isprintable()}
print("対象の文字数:", len(need))

faces = []
for css in glob.glob(ROOT + "/.next/static/**/*.css", recursive=True):
    for block in re.findall(r"@font-face\s*{([^}]*)}", io.open(css, encoding="utf-8").read()):
        if not re.search(r"font-family:\s*['\"]?IBM Plex Sans JP['\"]?\s*[;}]?", block):
            continue
        if "url(" not in block or "font-weight" not in block:
            continue
        w = re.search(r"font-weight:\s*(\d+)", block).group(1)
        url = re.search(r"url\(['\"]?([^)'\"]+)", block).group(1)
        path = os.path.normpath(os.path.join(os.path.dirname(css), url)) if not url.startswith("/") else ROOT + "/.next" + url.replace("/_next", "")
        ur = re.search(r"unicode-range:\s*([^;}]+)", block)
        cps = set()
        for part in (ur.group(1).split(",") if ur else []):
            part = part.strip()[2:]
            if "?" in part:
                a, b = int(part.replace("?", "0"), 16), int(part.replace("?", "F"), 16)
            elif "-" in part:
                a, b = (int(x, 16) for x in part.split("-"))
            else:
                a = b = int(part, 16)
            cps |= set(range(a, b + 1))
        faces.append((w, path, cps))
print("分割ファイルの定義:", len(faces))

report = {}
for weight in ("400", "700"):
    remaining = set(need)
    parts = []
    for i, (w, path, cps) in enumerate(faces):
        if w != weight or not (cps & remaining):
            continue
        font = TTFont(path)
        have = set(font.getBestCmap()) & cps & remaining
        if not have:
            continue
        opt = subset.Options()
        opt.layout_features = ["*"]
        opt.notdef_outline = True
        opt.name_IDs = ["*"]
        sub = subset.Subsetter(opt)
        sub.populate(unicodes=have)
        sub.subset(font)
        font.flavor = None
        p = os.path.join(tmp, f"{weight}-{i}.ttf")
        font.save(p)
        parts.append(p)
        remaining -= have
    merged = Merger().merge(parts)
    # ライセンス（SIL OFL）の予約名 "Plex" は、加工した版の名前に使えないので、付け直す
    for rec in merged["name"].names:
        if rec.nameID in (1, 3, 4, 6, 16, 18, 21):
            rec.string = ("SiteSansJP-" + weight) if rec.nameID == 6 else "Site Sans JP " + weight
    merged.flavor = "woff2"
    dest = os.path.join(out, f"site-sans-{weight}.woff2")
    merged.save(dest)
    got = sorted(TTFont(dest).getBestCmap())
    report[weight] = got
    print(f"太さ{weight}: 元の分割 {len(parts)}個 → 1個 {os.path.getsize(dest)/1024:.0f}KB / 収録 {len(got)}字 / 見つからない {len(remaining)}字")


def ranges(cps):
    res, start, prev = [], None, None
    for c in cps:
        if start is None:
            start = prev = c
        elif c == prev + 1:
            prev = c
        else:
            res.append((start, prev))
            start = prev = c
    res.append((start, prev))
    return ",".join(f"U+{a:X}" if a == b else f"U+{a:X}-{b:X}" for a, b in res)


assert report["400"] == report["700"], "太さによって収録した文字が違う"
ts = ROOT + "/src/lib/siteSans.ts"
src = io.open(ts, encoding="utf-8", newline="").read()
new, n = re.subn(r'(prop: "unicode-range", value: ")[^"]*(")', lambda m: m[1] + ranges(report["400"]) + m[2], src)
assert n == 1, "siteSans.ts の unicode-range が見つからない"
io.open(ts, "w", encoding="utf-8", newline="").write(new)
print("更新: src/fonts/site-sans-400.woff2, site-sans-700.woff2, src/lib/siteSans.ts")
