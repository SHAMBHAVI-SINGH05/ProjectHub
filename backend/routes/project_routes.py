from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from datetime import datetime
from extensions import projects_collection

project_bp = Blueprint("projects", __name__)

@project_bp.route("", methods=["POST"])
@jwt_required()
def create_project():
    user_id = get_jwt_identity()
    data = request.json

    project = {
        "title": data["title"],
        "description": data["description"],
        "category": data["category"],
        "stage": "ideation",
        "skills_required": data.get("skills_required", []),
        "owner_id": ObjectId(user_id),
        "team_members": [ObjectId(user_id)],
        "funding_goal": data["funding_goal"],
        "funds_raised": 0,
        "created_at": datetime.utcnow()
    }

    pid = projects_collection.insert_one(project).inserted_id
    return jsonify({"project_id": str(pid)})
