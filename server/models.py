from sqlalchemy_serializer import SerializerMixin
from werkzeug.security import generate_password_hash, check_password_hash
from config import db

# === Models ===

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)

    # One-to-many: User has many Budgets
    budgets = db.relationship('Budget', backref='owner', cascade='all, delete-orphan')

    serialize_rules = ('-budgets.owner', '-_password_hash')

    @property
    def password(self):
        raise AttributeError("Password is write-only.")

    @password.setter
    def password(self, password):
        self._password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self._password_hash, password)

    def to_dict(self):
        # Minimal user info (no budgets)
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }

    def to_dict_with_budgets(self):
        # User info with budgets
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "budgets": [budget.to_dict() for budget in self.budgets]
        }

    def __repr__(self):
        return f'<User {self.username}>'


class Budget(db.Model, SerializerMixin):
    __tablename__ = 'budgets'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # One-to-many: Budget has many Expenses
    expenses = db.relationship('Expense', backref='budget', cascade='all, delete-orphan')

    serialize_rules = ('-expenses.budget', '-owner.budgets')

    def to_dict(self):
        # Budget info with expenses
        return {
            "id": self.id,
            "title": self.title,
            "amount": self.amount,
            "user_id": self.user_id,
            "expenses": [expense.to_dict() for expense in self.expenses]
        }

    def __repr__(self):
        return f'<Budget {self.title} - ${self.amount}>'


class Expense(db.Model, SerializerMixin):
    __tablename__ = 'expenses'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    cost = db.Column(db.Float, nullable=False)
    category = db.Column(db.String)
    budget_id = db.Column(db.Integer, db.ForeignKey('budgets.id'), nullable=False)

    serialize_rules = ('-budget.expenses',)

    def to_dict(self):
        # Expense info
        return {
            "id": self.id,
            "name": self.name,
            "cost": self.cost,
            "category": self.category,
            "budget_id": self.budget_id
        }

    def __repr__(self):
        return f'<Expense {self.name}: ${self.cost}>'
