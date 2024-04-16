import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'
import LoginForm from '../components/Forms/LoginForm'
import Nav from '../components/Nav'
import '../resources/css/FormPage.css'

function LoginPage() {

    const authData = useContext(AuthContext)
    const navigation = useNavigate()
  
    useEffect(() => {
       authData.logged && navigation('/dashboard')
    },[authData.logged,navigation])

    return (
      <>
        <Nav/>
        <main className='formPage'>
            <LoginForm/>
        </main>
      </>
    )
  }
  
  export default LoginPage