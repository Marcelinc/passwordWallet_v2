import { useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext, MESSAGE_POPUP_TIMER, MessagePopupContext } from '../App'
import LoginForm from '../components/Forms/LoginForm'
import Nav from '../components/Nav'
import '../resources/css/FormPage.css'
import MessagePopup from '../components/Popups/MessagePopup'

function LoginPage() {

    const authData = useContext(AuthContext)
    const messagePopup = useContext(MessagePopupContext)
    const navigation = useNavigate()
    const location = useLocation()
  
    useEffect(() => {
       authData.logged && navigation('/dashboard')   
    },[authData.logged,navigation])

    useEffect(() => {
      if(location.state?.message && (sessionStorage.getItem('logout') || sessionStorage.getItem('account_created'))){
        console.log(location.state)
        messagePopup.setMessage(location.state.message);
        messagePopup.setIsActive(true);
        setTimeout(() => {
          location.state.message = null;
          sessionStorage.removeItem('logout');
          sessionStorage.removeItem('account_created');
        },MESSAGE_POPUP_TIMER)
      }
    },[])

    return (
      <>
        <Nav/>
        <main className='formPage'>
            <LoginForm/>
        </main>
        <MessagePopup/>
      </>
    )
  }
  
  export default LoginPage