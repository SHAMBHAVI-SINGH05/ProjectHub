from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from bson import ObjectId
from extensions import ideas_collection

idea_bp = Blueprint("ideas", __name__)

@idea_bp.route("", methods=["POST"])
@jwt_required()
def create_idea():
    data = request.json
    owner = get_jwt_identity()

    idea_id = ideas_collection.insert_one({
        "title": data["title"],
        "description": data["description"],
        "owner_id": ObjectId(owner),
        "created_at": datetime.utcnow(),
        "status": "draft"
    }).inserted_id

    return jsonify({"idea_id": str(idea_id)}), 201


@idea_bp.route("", methods=["GET"])
def list_ideas():
    ideas = []
    for i in ideas_collection.find().sort("created_at", -1):
        ideas.append({
            "id": str(i["_id"]),
            "title": i["title"],
            "description": i["description"]
        })
    return jsonify({"ideas": ideas})
