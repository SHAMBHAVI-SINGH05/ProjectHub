from flask_socketio import emit, join_room
from datetime import datetime
from bson import ObjectId
from extensions import socketio, messages_collection

@socketio.on("send_message")
def send_message(data):
    msg = {
        "conversationId": ObjectId(data["conversation_id"]),
        "senderId": data["sender_id"],
        "text": data["text"],
        "timestamp": datetime.utcnow()
    }

    messages_collection.insert_one(msg)

    emit("receive_message", {
        "text": msg["text"],
        "senderId": msg["senderId"]
    }, room=data["conversation_id"])
