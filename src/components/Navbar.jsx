import { Link } from "react-router-dom"
import "./Navbar.css"

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">💸 BrokeBuddy</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/budgets">Budgets</Link></li>
        <li><Link to="/expenses">Expenses</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar
