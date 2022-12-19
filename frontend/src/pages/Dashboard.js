import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../App"
import AddPasswordForm from "../components/AddPasswordForm"
import Nav from "../components/Nav"
import Password from "../components/Password"
import Popup from '../components/Popup'
import ResetPasswordForm from "../components/ResetPasswordForm"
import '../resources/css/Dashboard.css'
import { FaCaretSquareDown } from "react-icons/fa";

function Dashboard() {

  const authData = useContext(AuthContext)
  const [passwords,setPasswords] = useState([])
  const [loginAttempts,setAttempts] = useState([])
  const [passwordForm,setPasswordForm] = useState(false)
  const [mainPasswordForm,setMainForm] = useState(false)
  const [content,setContent] = useState('passwords')
  const navigation = useNavigate()

  useEffect(() => {
    !authData.logged && navigation('/login')

    //Fetch passwords from db
    fetch(process.env.REACT_APP_SERVER+'/password/getAll',{
      headers: {
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('userToken')
      }
    })
    .then(res => res.json())
    .then(res => {
      if(res.message === 'Success')
        console.log('passwords: ',res.data)
        setPasswords(res.data)
    })
    .catch(err => console.log(err))

    //Fetch login attempts from db
    fetch(process.env.REACT_APP_SERVER+'/user/loginAttempts/getAll',{
      headers: {
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + authData.token
      }
    })
    .then(res => res.json())
    .then(res => {
      if(res.message === 'Success')
        console.log('attempts: ',res.data.reverse())
        setAttempts(res.data)
    })
    .catch(err => console.log(err))

  },[authData.logged,authData.password])

  return (
    <>
    <Nav/>
    <main>
        <section className="userInfo">
          <div className="userInfo">
            <p>Hello {authData.login}</p>
            <p>Account type: {authData.isHmac ? 'HMAC' : 'SHA512'}</p>
            <p>Your passwords: {passwords ? passwords.length : '0'}</p>
          </div>
          <div className="password-operations">
            <p onClick={() => setContent('security')} className="eventTag">Security</p>
            <p onClick={() => setContent('passwords')} className="eventTag">My passwords</p>
            <p onClick={() => setPasswordForm(true)} className='eventTag'>Add new</p>
            <p onClick={() => setMainForm(true)} className='eventTag'>Change main password</p>
          </div>
        </section>
        {content === 'passwords' ? <section className="passwords">
          <h2>My passwords</h2>
          <div className="password-list">
            {passwords.length > 0 ? passwords.map(password => <Password key={password._id} data={password}/>) 
            : <p>You have no saved passwords</p>}
          </div> 
        </section> : <section className="passwords">
            <h2>Login attempts</h2>
            <div className="attempt-list">
              {loginAttempts && loginAttempts.length > 0 ? loginAttempts.map(attempt => <div key={attempt._id} className='attempt'>
                <p>{attempt.correct ? <span className="successLogin">Successful</span> : <span className="failedLogin">Failed</span>} login attempt {attempt.createdAt.substring(11,19)} {attempt.createdAt.substring(0,10)}</p>
                <p>Adres IP: {attempt.id_address.addressIP}</p>
                <p>Urządzenie: {attempt.computer.split(';')[0]}, {attempt.computer.split(';')[1]}</p>
                <FaCaretSquareDown className="expandAttempt"/>
              </div>) : <p>There are no login attempts yet</p>}
            </div>
          </section>}
        {passwordForm && <Popup><AddPasswordForm form={setPasswordForm} setPasswords={setPasswords} passwords={passwords} /></Popup>}
        {mainPasswordForm && <Popup><ResetPasswordForm form={setMainForm} setPasswords={setPasswords}/></Popup>}
    </main>
    </>
  )
}

export default Dashboard