# BrokeBuddy 💰

**Take Control of Your Finances with BrokeBuddy**

BrokeBuddy is a smart budget tracking application that helps you manage your finances, track expenses, and achieve your financial goals. With an intuitive interface and powerful features, it's the perfect tool for anyone looking to improve their financial health.

## ✨ Features

- **🏦 Smart Budgeting**: Create intelligent budgets that adapt to your spending patterns
- **📊 Expense Tracking**: Monitor your spending in real-time with detailed analytics
- **🎯 Goal Achievement**: Set financial goals and track your progress with visual indicators
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🔐 Secure Authentication**: User registration and login system
- **📈 Financial Insights**: Detailed reports and analytics of your spending habits

## 🚀 Demo Account

**Try BrokeBuddy instantly with our demo account:**

**Email:** `demo@example.com`  
**Password:** `demo123`

_We strongly recommend using the demo account to explore all features before creating your own account._

## 🛠️ Technology Stack

### Frontend

- **React** 18.2.0 - Modern JavaScript library for building user interfaces
- **React Router** v5.3.4 - Client-side routing
- **Axios** - HTTP client for API requests
- **CSS3** - Custom styling with responsive design

### Backend

- **Flask** - Lightweight Python web framework
- **SQLAlchemy** - SQL toolkit and Object-Relational Mapping
- **Alembic** - Database migration tool
- **Python** 3.8+ - Programming language

## 📦 Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **Python** (v3.8 or higher)
- **pip** (Python package manager)

### Frontend Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd brokebuddy
   ```

2. **Install frontend dependencies:**

   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

### Backend Setup

1. **Navigate to the server directory:**

   ```bash
   cd server
   ```

2. **Install Python dependencies:**

   ```bash
   pip install pipenv
   pipenv install
   pipenv shell
   ```

3. **Set up the database:**

   ```bash
   flask db upgrade
   python seed.py  # Optional: populate with sample data
   ```

4. **Start the Flask server:**
   ```bash
   python app.py
   ```
   The backend API will be available at `http://localhost:5555`

## 🎯 Usage

### Quick Start with Demo Account

1. **Start both frontend and backend servers** (see installation steps above)
2. **Open your browser** and navigate to `http://localhost:3000`
3. **Click "Sign In"** and use the demo credentials:
   - Email: `demo@example.com`
   - Password: `demo123`
4. **Explore the features:**
   - View the Dashboard for financial overview
   - Navigate to Budgets to manage your budgets
   - Add and track expenses
   - Monitor your financial progress

### Creating Your Own Account

1. Click **"Sign Up"** on the homepage
2. Fill in your details and create an account
3. Start managing your finances immediately

## 📁 Project Structure

```
brokebuddy/
├── public/                 # Static assets
├── src/                    # React frontend source
│   ├── components/         # Reusable React components
│   │   ├── App.js         # Main application component
│   │   ├── ExpenseForm.js # Expense creation form
│   │   ├── ExpenseList.js # List of expenses
│   │   └── Navbar.jsx     # Navigation component
│   ├── pages/             # Page components
│   │   ├── Dashboard.js   # Dashboard with financial overview
│   │   ├── Budgets.js     # Budget management page
│   │   ├── Home.js        # Landing page
│   │   ├── Login.js       # Login page
│   │   └── Signup.js      # Registration page
│   └── styles/            # CSS stylesheets
├── server/                # Flask backend
│   ├── models.py          # Database models (User, Budget, Expense)
│   ├── app.py             # Flask application entry point
│   ├── config.py          # Configuration settings
│   └── seed.py            # Database seeding script
├── migrations/            # Database migration files
└── package.json           # Frontend dependencies
```

## 🔧 Development

### Running Tests

```bash
npm test                   # Frontend tests
```

### Building for Production

```bash
npm run build             # Build frontend for production
```

### Database Migrations

```bash
cd server
flask db migrate -m "Description of changes"
flask db upgrade
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📝 API Endpoints

### Authentication

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout

### Budgets

- `GET /api/budgets` - Get user budgets
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Expenses

- `GET /api/expenses` - Get user expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. **Check existing issues** in the repository
2. **Create a new issue** with detailed description
3. **Use the demo account** (`demo@example.com`) to reproduce issues

---

**Happy budgeting! 💰**
