# # backend/routes/ai_routes.py
# from flask import Blueprint, request, jsonify
# import os
# import openai

# ai_bp = Blueprint("ai", __name__)

# # Load key from environment (.env)
# openai.api_key = os.getenv("OPENAI_API_KEY")


# @ai_bp.route("/summary", methods=["POST"])
# def summarize():
#     data = request.get_json() or {}

#     scope = data.get("scope", "page")
#     page = data.get("page")
#     text = data.get("text", "")

#     if not openai.api_key:
#         return jsonify({"error": "Missing OPENAI_API_KEY"}), 500

#     if not text.strip():
#         return jsonify({"summary": "No text provided."})

#     if scope == "page":
#         prompt = f"""
# You are an academic assistant. Summarize the following PDF page clearly.

# PAGE NUMBER: {page}

# TEXT TO SUMMARIZE:
# {text}

# Return a clean bullet-point summary.
# """
#     else:
#         prompt = f"""
# You are an academic assistant. Summarize the full PDF.

# TEXT: 
# {text}

# Return:
# - A clear overview  
# - Key ideas  
# - Important definitions  
# - Main concepts
# """

#     try:
#         response = openai.chat.completions.create(
#             model="gpt-4o-mini",
#             messages=[{"role": "user", "content": prompt}],
#             max_tokens=500,
#         )

#         summary = response.choices[0].message["content"]

#         return jsonify({"summary": summary})

#     except Exception as e:
#         print("AI Summary Error:", e)
#         return jsonify({"error": "AI request failed", "details": str(e)}), 500
from flask import Blueprint, request, jsonify
from openai import OpenAI
import os

ai_bp = Blueprint("ai", __name__)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@ai_bp.post("/ai")
def ai_chat():
    data = request.get_json()
    message = data.get("message", "")

    if not message:
        return jsonify({"reply": "Please type a question first."})

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful study tutor."},
                {"role": "user", "content": message}
            ]
        )

        # Correct way to extract content (new OpenAI format)
        answer = response.choices[0].message.content

        return jsonify({"reply": answer})

    except Exception as e:
        print("AI ERROR:", e)
        return jsonify({"reply": "⚠️ AI server error. Check backend console."})

