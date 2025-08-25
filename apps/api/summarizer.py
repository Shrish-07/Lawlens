from pypdf import PdfReader
from transformers import pipeline

# Load summarizer once at startup (facebook/bart-large-cnn)
try:
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
except Exception as e:
    summarizer = None
    print("⚠️ Failed to load summarizer:", e)


def extract_text(pdf_path: str) -> str:
    """Extract text from a PDF file."""
    try:
        reader = PdfReader(pdf_path)
        chunks = []
        for page in reader.pages:
            txt = page.extract_text() or ""
            chunks.append(txt.strip())
        return "\n\n".join(chunks).strip()
    except Exception:
        return ""


def summarize_text(text: str, chunk_size: int = 800) -> str:
    """Summarize long text by splitting into chunks and combining summaries."""
    if not text:
        return "No text found in PDF."

    if summarizer is None:
        return "Summarizer not available."

    words = text.split()
    chunks = [" ".join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]

    summaries = []
    for chunk in chunks:
        try:
            result = summarizer(
                chunk,
                max_length=250,
                min_length=80,
                do_sample=False
            )
            summaries.append(result[0]["summary_text"])
        except Exception as e:
            summaries.append(f"[Error summarizing chunk: {e}]")

    return "\n\n".join(summaries)
