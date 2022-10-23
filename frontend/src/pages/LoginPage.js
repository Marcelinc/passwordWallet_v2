import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'
import LoginForm from '../components/LoginForm'
import Nav from '../components/Nav'

function LoginPage() {

    const authData = useContext(AuthContext)
    const navigation = useNavigate()
  
    useEffect(() => {
       authData.logged && navigation('/dashboard')
    },[authData.logged])

    return (
      <>
      <Nav/>
      <main className='loginPage'>
          <LoginForm/>
      </main>
      </>
    )
  }
  
  export default LoginPage