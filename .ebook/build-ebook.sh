#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DOCS_ROOT="$ROOT/docs"
EBOOK_ROOT="$ROOT/ebooks"
BUILD_ROOT="$SCRIPT_DIR/build"
VERSION_FILE="$EBOOK_ROOT/VERSION"
ORDER_FILE="$DOCS_ROOT/reading-order.txt"
MANIFEST="$EBOOK_ROOT/build.json"
PDF_STYLE="$SCRIPT_DIR/pdf.css"
EPUB_STYLE="$SCRIPT_DIR/epub.css"
METADATA="$SCRIPT_DIR/metadata.yaml"
LINK_FILTER="$SCRIPT_DIR/external-links.lua"
LOGO="$ROOT/brand/logo/icon.png"

fail() {
  echo "Erro: $*" >&2
  exit 1
}

relative_path() {
  realpath --relative-to="$ROOT" "$1"
}

[ -f "$VERSION_FILE" ] || fail "ebook/VERSION ausente."
VERSION="$(tr -d '[:space:]' < "$VERSION_FILE")"
[[ "$VERSION" =~ ^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$ ]] \
  || fail "ebook/VERSION deve conter SemVer estável."

STEM="Brandfy-Documentacao-Completa-v$VERSION"
PDF_OUT="$EBOOK_ROOT/$STEM.pdf"
EPUB_OUT="$EBOOK_ROOT/$STEM.epub"

required_sources=(
  "$VERSION_FILE"
  "$ORDER_FILE"
  "$PDF_STYLE"
  "$EPUB_STYLE"
  "$METADATA"
  "$LINK_FILTER"
  "$SCRIPT_DIR/build-ebook.sh"
  "$LOGO"
  "$ROOT/brand/fonts/manrope-latin.woff2"
  "$ROOT/brand/fonts/inter-latin.woff2"
)

for source in "${required_sources[@]}"; do
  [ -f "$source" ] \
    || fail "fonte obrigatória ausente: $(relative_path "$source")"
done

grep -Fxq 'lang: "pt-BR"' "$METADATA" \
  || fail '.ebook/metadata.yaml deve declarar lang: "pt-BR".'

mapfile -t ordered_pages < <(
  sed -e '/^[[:space:]]*#/d' -e '/^[[:space:]]*$/d' "$ORDER_FILE"
)
[ "${#ordered_pages[@]}" -gt 0 ] \
  || fail "docs/reading-order.txt está vazio."

declare -A ordered_set=()
page_inputs=()
for relative in "${ordered_pages[@]}"; do
  [[ "$relative" == docs/*.md || "$relative" == docs/*/*.md ]] \
    || fail "página fora de docs/: $relative"
  [ -f "$ROOT/$relative" ] || fail "página ausente: $relative"
  [ -z "${ordered_set[$relative]:-}" ] || fail "página duplicada: $relative"
  ordered_set["$relative"]=1
  page_inputs+=("${relative#docs/}")
done

while IFS= read -r relative; do
  [ -n "${ordered_set[$relative]:-}" ] \
    || fail "página não ordenada: $relative"
done < <(
  find "$DOCS_ROOT" -type f -name '*.md' -print0 \
    | sort -z \
    | xargs -0 -r realpath --relative-to="$ROOT"
)

source_files=()
while IFS= read -r -d '' source; do
  source_files+=("$source")
done < <(find "$DOCS_ROOT" -type f -print0 | sort -z)
source_files+=("${required_sources[@]}")

SOURCE_SHA="$(
  for source in "${source_files[@]}"; do
    printf '%s\0%s\n' \
      "$(relative_path "$source")" \
      "$(sha256sum "$source" | cut -d' ' -f1)"
  done | sha256sum | cut -d' ' -f1
)"

check_build() {
  [ -f "$MANIFEST" ] || fail "ebooks/build.json ausente; execute npm run ebook."
  [ -f "$PDF_OUT" ] || fail "$(basename "$PDF_OUT") ausente."
  [ -f "$EPUB_OUT" ] || fail "$(basename "$EPUB_OUT") ausente."

  VERSION="$VERSION" SOURCE_SHA="$SOURCE_SHA" PDF_OUT="$PDF_OUT" \
    EPUB_OUT="$EPUB_OUT" MANIFEST="$MANIFEST" python3 - <<'PY'
import hashlib
import json
import os
from pathlib import Path

manifest = json.loads(Path(os.environ["MANIFEST"]).read_text(encoding="utf-8"))
expected = {
    "version": os.environ["VERSION"],
    "edition": f"v{os.environ['VERSION']}",
    "source_sha256": os.environ["SOURCE_SHA"],
}
for key, value in expected.items():
    if manifest.get(key) != value:
        raise SystemExit(f"Erro: {key} desatualizado; execute npm run ebook.")

for kind, variable in (("pdf", "PDF_OUT"), ("epub", "EPUB_OUT")):
    path = Path(os.environ[variable])
    record = manifest.get("artifacts", {}).get(kind, {})
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    if record.get("file") != path.name or record.get("sha256") != digest:
        raise SystemExit(f"Erro: hash de {path.name} desatualizado.")
PY

  unzip -tqq "$EPUB_OUT" || fail "EPUB inválido."
  while IFS= read -r entry; do
    unzip -p "$EPUB_OUT" "$entry" | xmllint --noout - \
      || fail "XML inválido no EPUB: $entry"
  done < <(
    unzip -Z1 "$EPUB_OUT" | grep -E '\.(xhtml|opf|ncx|xml)$'
  )

  EPUB_OUT="$EPUB_OUT" python3 - <<'PY'
import os
import posixpath
import xml.etree.ElementTree as ET
from urllib.parse import urlsplit
from zipfile import ZipFile

failures = []
with ZipFile(os.environ["EPUB_OUT"]) as archive:
    names = set(archive.namelist())
    documents = {
        name: ET.fromstring(archive.read(name))
        for name in sorted(names)
        if name.endswith((".xhtml", ".html"))
    }
    identifiers = {
        name: {
            node.attrib["id"]
            for node in document.iter()
            if "id" in node.attrib
        }
        for name, document in documents.items()
    }
    for name, document in documents.items():
        for node in document.iter():
            target = node.attrib.get("href") or node.attrib.get("src")
            if not target:
                continue
            parsed = urlsplit(target)
            if parsed.scheme or parsed.netloc:
                failures.append(f"{name} aponta para destino externo: {target}")
                continue
            resolved = name
            if parsed.path:
                resolved = posixpath.normpath(
                    posixpath.join(posixpath.dirname(name), parsed.path)
                )
                if resolved not in names:
                    failures.append(f"{name} aponta para arquivo ausente: {target}")
                    continue
            if (
                parsed.fragment
                and parsed.fragment not in identifiers.get(resolved, set())
            ):
                failures.append(f"{name} aponta para âncora ausente: {target}")

if failures:
    raise SystemExit("Erro: navegação inválida no EPUB:\n" + "\n".join(failures))
PY

  pdfinfo "$PDF_OUT" | grep -Eq '^Pages:[[:space:]]+[1-9][0-9]*$' \
    || fail "PDF sem páginas legíveis."
  PDF_TEXT="$(pdftotext "$PDF_OUT" -)"
  grep -Fq "Brandfy" <<<"$PDF_TEXT" \
    || fail "PDF não contém o nome do produto."
  grep -Fq "Documentação" <<<"$PDF_TEXT" \
    || fail "PDF não contém a identificação documental."
  grep -Fq "completa" <<<"$PDF_TEXT" \
    || fail "PDF não contém o título esperado."
  echo "OK: edição v$VERSION sincronizada com docs/."
}

if [ "${1:-}" = "--check" ]; then
  check_build
  exit 0
fi
[ "$#" -eq 0 ] || fail "uso: ./.ebook/build-ebook.sh [--check]"

for bin in pandoc weasyprint python3 unzip xmllint pdfinfo pdftotext magick fc-match; do
  command -v "$bin" >/dev/null 2>&1 \
    || fail "'$bin' não encontrado no PATH."
done

mkdir -p "$BUILD_ROOT" "$EBOOK_ROOT"
HTML_OUT="$BUILD_ROOT/$STEM.html"
COVER_OUT="$BUILD_ROOT/$STEM-cover.png"
PT_DATE="$(date +'%d/%m/%Y')"
SANS_FONT="$(fc-match -f '%{file}\n' 'DejaVu Sans:style=Book' | head -1)"
BOLD_FONT="$(fc-match -f '%{file}\n' 'DejaVu Sans:style=Bold' | head -1)"
[ -f "$SANS_FONT" ] || fail "Fonte DejaVu Sans não encontrada."
[ -f "$BOLD_FONT" ] || fail "Fonte DejaVu Sans Bold não encontrada."

magick \
  -size 1600x2560 xc:'#00161E' \
  -fill '#FDA4B7' -draw 'circle 1310,300 1445,300' \
  -fill none -stroke '#5EEDE1' -strokewidth 12 \
  -draw 'roundrectangle 180,360 328,508 30,30' \
  -stroke none -fill '#FDA4B7' -font "$BOLD_FONT" -pointsize 92 \
  -gravity northwest -annotate +226+375 'B' \
  -fill '#FFFFFF' -font "$BOLD_FONT" -pointsize 120 \
  -annotate +180+940 'Brandfy' \
  -annotate +180+1085 'Documentação' \
  -annotate +180+1230 'completa' \
  -fill '#B2C6CE' -font "$SANS_FONT" -pointsize 54 \
  -annotate +180+1500 'Guia do usuário e referência técnica' \
  -stroke '#15626A' -strokewidth 4 -draw 'line 180,2220 1420,2220' \
  -stroke none -fill '#B2C6CE' -pointsize 38 \
  -annotate +180+2280 'PROMOVAWEB · DOCUMENTAÇÃO OFICIAL' \
  "$COVER_OUT"

(
  cd "$DOCS_ROOT"
  pandoc "${page_inputs[@]}" \
    --from=gfm \
    --to=html5 \
    --standalone \
    --file-scope \
    --lua-filter="$LINK_FILTER" \
    --toc \
    --toc-depth=2 \
    --embed-resources \
    --css="$PDF_STYLE" \
    --resource-path="$SCRIPT_DIR:$ROOT:$DOCS_ROOT" \
    --metadata-file="$METADATA" \
    --metadata title="Brandfy — Documentação completa · v$VERSION" \
    --metadata version="$VERSION" \
    --metadata date="$PT_DATE" \
    --output "$HTML_OUT"
)

weasyprint "$HTML_OUT" "$PDF_OUT" --base-url "$ROOT"

(
  cd "$DOCS_ROOT"
  pandoc "${page_inputs[@]}" \
    --from=gfm \
    --to=epub3 \
    --standalone \
    --file-scope \
    --lua-filter="$LINK_FILTER" \
    --toc \
    --toc-depth=2 \
    --epub-title-page=true \
    --epub-cover-image="$COVER_OUT" \
    --css="$EPUB_STYLE" \
    --resource-path="$SCRIPT_DIR:$ROOT:$DOCS_ROOT" \
    --metadata-file="$METADATA" \
    --metadata title="Brandfy — Documentação completa · v$VERSION" \
    --metadata version="$VERSION" \
    --metadata date="$(date +%F)" \
    --output "$EPUB_OUT"
)

sources_json="$(
  printf '%s\n' "${source_files[@]}" \
    | while IFS= read -r source; do relative_path "$source"; done \
    | sort -u \
    | python3 -c 'import json,sys; print(json.dumps([line.rstrip() for line in sys.stdin]))'
)"
PDF_SHA="$(sha256sum "$PDF_OUT" | cut -d' ' -f1)"
EPUB_SHA="$(sha256sum "$EPUB_OUT" | cut -d' ' -f1)"

VERSION="$VERSION" SOURCE_SHA="$SOURCE_SHA" PDF_SHA="$PDF_SHA" \
  EPUB_SHA="$EPUB_SHA" PDF_FILE="$(basename "$PDF_OUT")" \
  EPUB_FILE="$(basename "$EPUB_OUT")" SOURCES_JSON="$sources_json" \
  MANIFEST="$MANIFEST" python3 - <<'PY'
import json
import os
from datetime import datetime, timezone
from pathlib import Path

manifest = {
    "schema_version": 1,
    "version": os.environ["VERSION"],
    "edition": f"v{os.environ['VERSION']}",
    "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    "source_sha256": os.environ["SOURCE_SHA"],
    "sources": json.loads(os.environ["SOURCES_JSON"]),
    "artifacts": {
        "pdf": {
            "file": os.environ["PDF_FILE"],
            "sha256": os.environ["PDF_SHA"],
        },
        "epub": {
            "file": os.environ["EPUB_FILE"],
            "sha256": os.environ["EPUB_SHA"],
        },
    },
}
Path(os.environ["MANIFEST"]).write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)
PY

check_build
echo "PDF:  $PDF_OUT"
echo "EPUB: $EPUB_OUT"
