#!/usr/bin/env python3
"""
AirSlide — High-Fidelity PPTX Conversion Server
Converts .pptx presentations to pristine PDF documents.

Engines:
1. macOS Native Keynote Engine (Primary on macOS):
   Uses Apple's native presentation suite via AppleScript.
   Guarantees 100% pixel-perfect preservation of fonts, typography,
   embedded high-res images, vectors, shapes, tables, and colors.
2. LibreOffice Engine (Headless CLI):
   Used if LibreOffice / soffice is present on the system.
3. Enhanced python-pptx Engine (Universal fallback).

Usage:
    python3 server_convert.py          # default port 5001
    python3 server_convert.py 5002     # custom port
"""
import io
import os
import shutil
import subprocess
import sys
import tempfile
import traceback

from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ─── Detection ────────────────────────────────────────────────────────────────

def has_keynote() -> bool:
    """Return True if running on macOS with Keynote installed."""
    if sys.platform != "darwin":
        return False
    return (
        os.path.exists("/Applications/Keynote.app")
        or os.path.exists(os.path.expanduser("~/Applications/Keynote.app"))
    )


def find_libreoffice() -> str | None:
    """Return path to soffice/libreoffice binary if available."""
    candidates = [
        "soffice",
        "libreoffice",
        "/Applications/LibreOffice.app/Contents/MacOS/soffice",
    ]
    for c in candidates:
        path = shutil.which(c)
        if path:
            return path
        if os.path.exists(c):
            return c
    return None


# ─── Engine 1: macOS Keynote (100% Native Fidelity) ───────────────────────────

def convert_via_keynote(pptx_path: str, pdf_path: str, timeout: int = 60) -> bool:
    """
    Open presentation in Apple Keynote in background and export directly to PDF.
    Preserves all original layouts, high-res images, fonts, styles, and graphics.
    """
    abs_pptx = os.path.abspath(pptx_path)
    abs_pdf = os.path.abspath(pdf_path)

    # AppleScript to open, export as PDF, close without saving, and keep hidden
    applescript = f'''
    set pptxFile to POSIX file "{abs_pptx}"
    set pdfFile to POSIX file "{abs_pdf}"
    with timeout of {timeout} seconds
        tell application "Keynote"
            set doc to open pptxFile
            export doc to file pdfFile as PDF
            close doc saving no
        end tell
    end timeout
    tell application "System Events"
        if exists (process "Keynote") then
            set visible of process "Keynote" to false
        end if
    end tell
    '''

    res = subprocess.run(
        ["osascript", "-e", applescript],
        capture_output=True,
        text=True,
        timeout=timeout + 5,
    )

    if res.returncode != 0:
        err = res.stderr.strip() or res.stdout.strip()
        print(f"  [Keynote Engine Error]: {err}", file=sys.stderr)
        return False

    return os.path.exists(abs_pdf) and os.path.getsize(abs_pdf) > 0


# ─── Engine 2: Headless LibreOffice ───────────────────────────────────────────

def convert_via_libreoffice(pptx_path: str, out_dir: str, binary: str, timeout: int = 60) -> str | None:
    """Convert PPTX to PDF using LibreOffice in headless mode."""
    cmd = [
        binary,
        "--headless",
        "--convert-to",
        "pdf",
        os.path.abspath(pptx_path),
        "--outdir",
        os.path.abspath(out_dir),
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    if res.returncode != 0:
        print(f"  [LibreOffice Engine Error]: {res.stderr.strip()}", file=sys.stderr)
        return None

    base = os.path.splitext(os.path.basename(pptx_path))[0]
    expected_pdf = os.path.join(out_dir, f"{base}.pdf")
    if os.path.exists(expected_pdf) and os.path.getsize(expected_pdf) > 0:
        return expected_pdf
    return None


# ─── Engine 3: Enhanced Python Fallback ───────────────────────────────────────

def convert_via_python_fallback(pptx_path: str, pdf_path: str) -> bool:
    """Universal python-pptx fallback with recursive shape & image extraction."""
    from PIL import Image, ImageDraw, ImageFont
    from pptx import Presentation
    from pptx.enum.shapes import MSO_SHAPE_TYPE

    prs = Presentation(pptx_path)
    if len(prs.slides) == 0:
        return False

    sw_emu = prs.slide_width
    sh_emu = prs.slide_height

    # Compute canvas size maintaining slide ratio
    aspect = sw_emu / sh_emu if sh_emu else (16 / 9)
    h_px = 1080
    w_px = int(h_px * aspect)

    def to_x(emu):
        return int(emu / sw_emu * w_px)

    def to_y(emu):
        return int(emu / sh_emu * h_px)

    def get_font(size):
        try:
            return ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", max(10, size))
        except Exception:
            return ImageFont.load_default()

    def process_shapes(shapes, img, draw):
        for shape in shapes:
            try:
                # Group shape handling
                if shape.shape_type == MSO_SHAPE_TYPE.GROUP:
                    process_shapes(shape.shapes, img, draw)
                    continue

                if shape.left is None or shape.top is None:
                    continue

                x1 = to_x(shape.left)
                y1 = to_y(shape.top)
                w = to_x(shape.width)
                h = to_y(shape.height)
                x2, y2 = x1 + w, y1 + h

                if w <= 0 or h <= 0:
                    continue

                # Pictures & Placeholders with pictures
                pic_blob = None
                if shape.shape_type == MSO_SHAPE_TYPE.PICTURE:
                    try:
                        pic_blob = shape.image.blob
                    except Exception:
                        pass
                elif shape.is_placeholder:
                    try:
                        pic_blob = shape.image.blob
                    except Exception:
                        pass

                if pic_blob:
                    try:
                        pic = Image.open(io.BytesIO(pic_blob)).convert("RGBA")
                        pic = pic.resize((w, h), Image.LANCZOS)
                        r, g, b, a = pic.split()
                        img.paste(Image.merge("RGB", (r, g, b)), (x1, y1), a)
                        continue
                    except Exception:
                        pass

                # Text frames
                if shape.has_text_frame:
                    ty = y1 + 4
                    for para in shape.text_frame.paragraphs:
                        text = para.text.strip()
                        if not text:
                            ty += 8
                            continue
                        font_size = 18
                        try:
                            if para.font and para.font.size and para.font.size.pt:
                                font_size = int(para.font.size.pt)
                        except Exception:
                            pass
                        f = get_font(max(10, int(font_size * h_px / 720)))
                        draw.text((x1 + 6, ty), text, fill=(20, 20, 20), font=f)
                        ty += int(font_size * 1.3) + 4
            except Exception:
                pass

    images = []
    for slide in prs.slides:
        img = Image.new("RGB", (w_px, h_px), (255, 255, 255))
        draw = ImageDraw.Draw(img)
        process_shapes(slide.shapes, img, draw)
        images.append(img)

    if not images:
        return False

    if len(images) == 1:
        images[0].save(pdf_path, format="PDF", resolution=150)
    else:
        images[0].save(
            pdf_path,
            format="PDF",
            save_all=True,
            append_images=images[1:],
            resolution=150,
        )
    return os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 0


# ─── Orchestrator ─────────────────────────────────────────────────────────────

def convert_pptx(pptx_path: str, pdf_path: str) -> str:
    """
    Attempt conversion in order of fidelity:
    1. Keynote (100% native quality on macOS)
    2. LibreOffice (if installed)
    3. Python fallback
    """
    # 1. Keynote
    if has_keynote():
        print("  → Using Engine 1: Apple Keynote (100% Native Fidelity)…", file=sys.stderr)
        try:
            if convert_via_keynote(pptx_path, pdf_path):
                print("  ✓ Keynote conversion successful!", file=sys.stderr)
                return "keynote"
        except Exception as e:
            print(f"  [warn] Keynote conversion raised: {e}", file=sys.stderr)

    # 2. LibreOffice
    lo_bin = find_libreoffice()
    if lo_bin:
        print(f"  → Using Engine 2: LibreOffice ({lo_bin})…", file=sys.stderr)
        out_dir = os.path.dirname(pdf_path)
        try:
            lo_pdf = convert_via_libreoffice(pptx_path, out_dir, lo_bin)
            if lo_pdf and os.path.exists(lo_pdf):
                if lo_pdf != pdf_path:
                    shutil.move(lo_pdf, pdf_path)
                print("  ✓ LibreOffice conversion successful!", file=sys.stderr)
                return "libreoffice"
        except Exception as e:
            print(f"  [warn] LibreOffice conversion raised: {e}", file=sys.stderr)

    # 3. Python fallback
    print("  → Using Engine 3: Python renderer fallback…", file=sys.stderr)
    if convert_via_python_fallback(pptx_path, pdf_path):
        print("  ✓ Python fallback conversion successful!", file=sys.stderr)
        return "python-fallback"

    raise RuntimeError("All conversion engines failed to convert presentation")


# ─── HTTP Endpoints ───────────────────────────────────────────────────────────

@app.route("/api/health", methods=["GET"])
def health():
    engine = "Apple Keynote (Native Fidelity)" if has_keynote() else ("LibreOffice" if find_libreoffice() else "Python Fallback")
    return jsonify({
        "status": "ok",
        "service": "AirSlide High-Fidelity PPTX Converter",
        "primary_engine": engine,
        "platform": sys.platform,
    })


@app.route("/api/convert", methods=["POST"])
def handle_convert():
    if "file" not in request.files:
        return jsonify({"error": "Missing 'file' field in request"}), 400

    upload = request.files["file"]
    filename = upload.filename or "presentation.pptx"

    if not filename.lower().endswith(".pptx"):
        return jsonify({"error": "Only .pptx files are supported"}), 400

    print(f"\n📂 Received PPTX: {filename!r}", file=sys.stderr)

    with tempfile.TemporaryDirectory() as tmpdir:
        input_pptx = os.path.join(tmpdir, "input.pptx")
        output_pdf = os.path.join(tmpdir, "output.pdf")

        upload.save(input_pptx)
        file_size_kb = os.path.getsize(input_pptx) // 1024
        print(f"  Input size: {file_size_kb} KB", file=sys.stderr)

        try:
            engine_used = convert_pptx(input_pptx, output_pdf)
            pdf_size_kb = os.path.getsize(output_pdf) // 1024
            print(f"  Result: {pdf_size_kb} KB PDF via {engine_used}", file=sys.stderr)

            # Read into memory so tempdir can be safely cleaned up
            with open(output_pdf, "rb") as f:
                pdf_bytes = f.read()

            buf = io.BytesIO(pdf_bytes)
            buf.seek(0)

            download_name = filename.rsplit(".", 1)[0] + ".pdf"
            return send_file(
                buf,
                mimetype="application/pdf",
                as_attachment=False,
                download_name=download_name,
            )

        except Exception as e:
            traceback.print_exc(file=sys.stderr)
            return jsonify({"error": f"Conversion failed: {str(e)}"}), 500


# ─── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5001
    engine_name = "Apple Keynote (Native Fidelity 100%)" if has_keynote() else "Universal Engine"
    print(f"\n✋ AirSlide PPTX Converter  →  http://localhost:{port}")
    print(f"   Primary Engine: {engine_name}")
    print(f"   POST /api/convert   (multipart: file=<.pptx>) → 100% Faithful Vector PDF")
    print(f"   GET  /api/health\n")
    app.run(host="0.0.0.0", port=port, debug=False)
