# server/config.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from sqlalchemy import MetaData

# Naming convention for Alembic constraints
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

# Initialize extensions
db = SQLAlchemy(metadata=metadata)
migrate = Migrate()
api = Api()
bcrypt = Bcrypt()  # ✅ Bcrypt for hashing

def create_app():
    app = Flask(__name__)

    # SQLite DB for development
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///broke_buddy.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Secret key for sessions
    app.config['SECRET_KEY'] = 'broke-buddy-secret-key'

    # Session cookie settings
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS

    app.json.compact = False

    # Init extensions
    db.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)
    bcrypt.init_app(app)
    CORS(app, supports_credentials=True)  # ✅ Required for login/logout cookies

    # Import models so they’re ready for migration
    import models


    return app
