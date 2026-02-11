from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from extensions import users_collection

users_bp = Blueprint("users", __name__)

@users_bp.route("/match", methods=["GET"])
@jwt_required()
def match_users():
    user_id = get_jwt_identity()

    current_user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not current_user:
        return jsonify({"error": "User not found"}), 404

    my_tags = set(current_user.get("tags", []))

    matches = []

    for u in users_collection.find({"_id": {"$ne": ObjectId(user_id)}}):
        score = len(my_tags.intersection(set(u.get("tags", []))))
        matches.append({
            "id": str(u["_id"]),
            "email": u["email"],
            "score": score
        })

    matches.sort(key=lambda x: x["score"], reverse=True)

    return jsonify({"matches": matches[:10]})
@users_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})

    return jsonify({
        "name": user.get("name"),
        "email": user.get("email"),
        "role": user.get("role"),
        "bio": user.get("bio"),
        "skills": user.get("skills", []),
        "interests": user.get("interests", []),
        "lookingFor": user.get("lookingFor", []),
        "projects": [],
        "connections": []
    })


@users_bp.route("/update-bio", methods=["POST"])
@jwt_required()
def update_bio():
    user_id = get_jwt_identity()
    data = request.get_json()

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"bio": data["bio"]}}
    )

    return jsonify({"msg": "Updated"})

@users_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()

    user = users_collection.find_one({"_id": ObjectId(user_id)})

    return jsonify({
        "id": str(user["_id"]),
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "bio": user.get("bio", ""),
        "skills": user.get("skills", []),
        "interests": user.get("interests", []),
        "role": user.get("role", "")
    })
@users_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_me():
    user_id = get_jwt_identity()
    data = request.get_json()

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "name": data.get("name"),
            "bio": data.get("bio"),
            "skills": data.get("skills", []),
            "interests": data.get("interests", []),
            "tags": data.get("skills", []) + data.get("interests", [])
        }}
    )

    return jsonify({"msg": "Profile updated"})
