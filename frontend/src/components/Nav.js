import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../App"
import '../resources/css/Nav.css'

function Nav() {

  const authData = useContext(AuthContext)
  const navigation = useNavigate()

  const logout = () => {
    authData.setToken('')
    window.localStorage.setItem('userToken','')
    authData.setLogged(false)
    navigation('/login')
  }

  return (
    <nav>
      {authData.logged ? <>
        <Link id="logout" to={'/login'} onClick={logout}>Logout</Link>
      </> : <>
        <Link to='/'>PasswordWallet</Link>
        <div className="authLinks">
          <Link to='/login'>Log in</Link>
        </div>
      </>}
    </nav>
  )
}

export default Nav