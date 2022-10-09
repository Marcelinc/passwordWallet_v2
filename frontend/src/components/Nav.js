import { Link } from "react-router-dom"
import '../resources/css/Nav.css'

function Nav() {
  return (
    <nav>
        <Link to='/'>PasswordWallet</Link>
        <div className="authLinks">
            <Link to='/login'>Log in</Link>
        </div>
        
    </nav>
  )
}

export default Nav