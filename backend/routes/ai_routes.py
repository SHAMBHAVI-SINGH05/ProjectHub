from flask import Blueprint, request, jsonify
from extensions import openai_client

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/improve-proposal", methods=["POST"])
def improve_proposal():
    idea = request.json.get("idea")

    response = openai_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": idea}],
        max_tokens=400
    )

    return jsonify({"feedback": response.choices[0].message.content})
