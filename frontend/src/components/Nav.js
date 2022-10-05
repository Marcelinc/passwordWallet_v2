import { Link } from "react-router-dom"

function Nav() {
  return (
    <nav>
        <Link to='/'>PasswordWallet</Link>
        <div className="authLinks">
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
        </div>
        
    </nav>
  )
}

export default Nav