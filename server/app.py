#!/usr/bin/env python3

from flask import request, jsonify, session
from flask_restful import Resource
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from config import create_app, db, api  # ✅ fixed import
from models import User, Budget, Expense  # ✅ fixed import

# === App Init ===
app = create_app()
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)  # 🔥 Cookie support for auth

# === Root Route ===
@app.route('/')
def index():
    return '<h1>BrokeBuddy API Server Running 🚀</h1>'

# === AUTH Resources ===

class Signup(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return {'error': 'All fields required'}, 400

        if User.query.filter_by(email=email).first():
            return {'error': 'Email already exists'}, 409

        user = User(username=username, email=email)
        user.password = password  # ✅ Uses password setter

        db.session.add(user)
        db.session.commit()

        session['user_id'] = user.id
        return user.to_dict(), 201


class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()
        if not user:
            return {'error': 'Invalid email'}, 401

        if not user.check_password(password):
            return {'error': 'Invalid password'}, 401

        session['user_id'] = user.id
        return user.to_dict(), 200


class Logout(Resource):
    def delete(self):
        session.pop('user_id', None)
        return {'message': 'Logged out'}, 204


class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {'error': 'Unauthorized'}, 401

        user = User.query.get(user_id)
        return user.to_dict(), 200

# === CRUD Resources ===

class Users(Resource):
    def get(self):
        users = User.query.all()
        return [user.to_dict() for user in users], 200


class Budgets(Resource):
    def get(self):
        budgets = Budget.query.all()
        return [budget.to_dict() for budget in budgets], 200

    def post(self):
        data = request.get_json()
        try:
            budget = Budget(
                title=data['title'],
                amount=data['amount'],
                user_id=data['user_id']
            )
            db.session.add(budget)
            db.session.commit()
            return budget.to_dict(), 201
        except Exception as e:
            return {'error': str(e)}, 400


class Expenses(Resource):
    def get(self):
        expenses = Expense.query.all()
        return [expense.to_dict() for expense in expenses], 200

    def post(self):
        data = request.get_json()
        try:
            expense = Expense(
                name=data['name'],
                cost=data['cost'],
                category=data['category'],
                budget_id=data['budget_id']
            )
            db.session.add(expense)
            db.session.commit()
            return expense.to_dict(), 201
        except Exception as e:
            return {'error': str(e)}, 400

# === Register Resources ===

api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CheckSession, '/check_session')

api.add_resource(Users, '/users')
api.add_resource(Budgets, '/budgets')
api.add_resource(Expenses, '/expenses')

# === Run App ===

if __name__ == '__main__':
    app.run(port=5555, debug=True)
