# backend/routes/ai_routes.py

import os
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

from google import genai
from google.genai import types, errors

ai_bp = Blueprint("ai", __name__)

# Initialize Gemini Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


# -------------------------------
# 1) AI SUMMARY FOR PDF
# -------------------------------
@ai_bp.route("/summary", methods=["POST"])
def summarize():
    """
    Summarize either a single page or the full extracted PDF text.
    Expected JSON:
    {
        "scope": "page" or "full",
        "page": 3,
        "text": "extracted text here..."
    }
    """
    data = request.get_json() or {}

    scope = data.get("scope", "page")
    page = data.get("page")
    text = data.get("text", "")

    if not text.strip():
        return jsonify({"summary": "⚠️ No text extracted on this page."}), 200

    # Build prompt
    if scope == "page":
        prompt = f"""
You are a professional study assistant.

Summarize the following text from a PDF **page {page}**.

TEXT:
{text}

Return:
- 4–8 clean bullet points  
- Simple wording  
- Key ideas only  
"""
    else:
        prompt = f"""
You are a professional study tutor.

Summarize the **entire PDF** text below.

TEXT:
{text}

Return:
- Overview  
- Key ideas  
- Concepts  
- Important definitions  
- Bullet points  
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt]
        )

        summary = response.text or "No summary generated."
        return jsonify({"summary": summary})

    except errors.ServerError as e:
        print("GEMINI SERVER ERROR:", e)
        return jsonify({"summary": "❗ Gemini server error. Check usage quota."}), 500

    except Exception as e:
        print("AI SUMMARY ERROR:", e)
        return jsonify({"summary": f"❗ AI error: {e}"}), 500



# -------------------------------
# 2) GENERAL AI CHAT (Tutor)
# -------------------------------
@ai_bp.post("/tutor")
def tutor_reply():
    try:
        data = request.get_json() or {}
        question = data.get("question", "").strip()

        if not question:
            return jsonify({"reply": "Please enter a question first."}), 400

        # Gemini request
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[question]
        )

        reply = response.text or "No response generated."
        return jsonify({"reply": reply})

    except Exception as e:
        print("AI Tutor Error:", e)
        return jsonify({"reply": "Server error", "error": str(e)}), 500
