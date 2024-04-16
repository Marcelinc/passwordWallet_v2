import { useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'
import Nav from '../components/Nav'
import RegisterForm from '../components/Forms/RegisterForm'
import '../resources/css/FormPage.css'

function RegisterPage() {

    const authData = useContext(AuthContext)
    const navigation = useNavigate()
    const location = useLocation()
  
    useEffect(() => {
       authData.logged && navigation('/dashboard')
    },[authData.logged,navigation])

    return (
      <>
        <Nav/>
        <main className='formPage'>
            <RegisterForm accountType={location.state.type}/>
        </main>
      </>
    )
  }
  
  export default RegisterPage