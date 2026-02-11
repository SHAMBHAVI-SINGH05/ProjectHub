from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import conversations_collection, messages_collection

conversation_bp = Blueprint("conversations", __name__)

@conversation_bp.route("/conversations", methods=["GET"])
@jwt_required()
def get_conversations():
    user_id = get_jwt_identity()
    convos = conversations_collection.find({"participants": user_id})

    result = []
    for c in convos:
        last = messages_collection.find_one(
            {"conversationId": c["_id"]},
            sort=[("timestamp", -1)]
        )
        result.append({
            "conversation_id": str(c["_id"]),
            "last_message": last["text"] if last else ""
        })

    return jsonify({"conversations": result})
