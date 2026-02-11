from flask import Flask
from flask_cors import CORS
from config import SECRET_KEY, JWT_SECRET_KEY
from extensions import jwt, socketio

from routes.auth_routes import auth_bp
from routes.ai_routes import ai_bp
from routes.idea_routes import idea_bp
from routes.project_routes import project_bp
from routes.conversation_routes import conversation_bp
from routes.user_routes import users_bp

app = Flask(__name__)
app.config["SECRET_KEY"] = SECRET_KEY
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY

CORS(app)

jwt.init_app(app)
socketio.init_app(app)

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(ai_bp, url_prefix="/api/ai")
app.register_blueprint(idea_bp, url_prefix="/api/ideas")
app.register_blueprint(project_bp, url_prefix="/api/projects")
app.register_blueprint(conversation_bp, url_prefix="/api")
app.register_blueprint(users_bp, url_prefix="/api/users")
if __name__ == "__main__":
    socketio.run(app, debug=False, use_reloader=False)
