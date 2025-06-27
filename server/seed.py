from config import create_app
from models import User, Budget, Expense
from faker import Faker
import random

# Unpack the tuple returned by create_app
app, db, _ = create_app()
fake = Faker()

with app.app_context():
    print(" Clearing old data...")
    Expense.query.delete()
    Budget.query.delete()
    User.query.delete()

    print(" Seeding users...")
    users = []
    for _ in range(5):
        user = User(
            username=fake.user_name(),
            email=fake.email()
        )
        db.session.add(user)
        users.append(user)

    db.session.commit()

    print(" Seeding budgets...")
    budgets = []
    for user in users:
        for _ in range(random.randint(1, 3)):
            budget = Budget(
                title=fake.bs().title(),
                amount=random.randint(100, 1000),
                user_id=user.id
            )
            db.session.add(budget)
            budgets.append(budget)

    db.session.commit()

    print(" Seeding expenses...")
    for budget in budgets:
        for _ in range(random.randint(2, 5)):
            expense = Expense(
                name=fake.word(),
                cost=random.randint(10, 200),
                category=random.choice(["Food", "Transport", "Entertainment", "Utilities"]),
                budget_id=budget.id
            )
            db.session.add(expense)

    db.session.commit()

    print(" Done seeding!")
