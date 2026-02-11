from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from datetime import datetime
import bcrypt
from extensions import users_collection

auth_bp = Blueprint("auth", __name__)
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    email = data["email"]
    password = data["password"]

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User exists"}), 400

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    user_doc = {
        "name": data.get("name", ""),
        "email": email,
        "password": hashed,
        "role": data.get("role", "student"),
        "skills": data.get("skills", []),
        "interests": data.get("interests", []),
        "lookingFor": data.get("lookingFor", []),
        "bio": data.get("bio", ""),
        "tags": data.get("skills", []) + data.get("interests", []),
        "created_at": datetime.utcnow()
    }

    user_id = users_collection.insert_one(user_doc).inserted_id

    token = create_access_token(identity=str(user_id))

    return jsonify({
        "access_token": token,
        "user_id": str(user_id)
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = users_collection.find_one({"email": data["email"]})

    if not user or not bcrypt.checkpw(
        data["password"].encode(), user["password"]
    ):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user["_id"]))
    return jsonify({"access_token": token, "user_id": str(user["_id"])})
