import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext, MessagePopupContext } from "../App"
import '../resources/css/Nav.css'

function Nav() {

  const authData = useContext(AuthContext)
  const navigation = useNavigate()

  const logout = () => {
    fetch(process.env.REACT_APP_SERVER+'/user/logout',{
      headers: {
        'Authorization': 'Bearer ' + authData.token
      }
    })
    .then(res => res.json())
    .then(res => {
      if(res.message === 'Success') {
        sessionStorage.setItem('logout', true);
        authData.setToken('')
        window.localStorage.setItem('userToken','')
        authData.setLogged(false)
        navigation('/login',{state: {message: 'Logged out'}})
      }
    })
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