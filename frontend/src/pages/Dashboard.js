import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../App"
import AddPasswordForm from "../components/AddPasswordForm"
import Nav from "../components/Nav"
import Password from "../components/Password"
import Popup from '../components/Popup'
import ResetPasswordForm from "../components/ResetPasswordForm"
import '../resources/css/Dashboard.css'

function Dashboard() {

  const authData = useContext(AuthContext)
  const [passwords,setPasswords] = useState(new Array([]))
  const [passwordForm,setPasswordForm] = useState(false)
  const [mainPasswordForm,setMainForm] = useState(false)
  const navigation = useNavigate()

  useEffect(() => {
    !authData.logged && navigation('/login')

    //Fetch passwords from db
    fetch(process.env.REACT_APP_SERVER+'/password/getAll',{
      headers: {
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + authData.token
      }
    })
    .then(res => res.json())
    .then(res => {
      if(res.message === 'Success')
        console.log(res.data)
        setPasswords(res.data)
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
            <p onClick={() => setPasswordForm(true)} className='eventTag'>Add new</p>
            <p onClick={() => setMainForm(true)} className='eventTag'>Change main password</p>
          </div>
        </section>
        <section className="passwords">
          <h2>My passwords</h2>
          <div className="password-list">
            {passwords && passwords.length > 0 ? passwords.map(password => <Password key={password._id} data={password}/>) 
            : <p>You have no saved passwords</p>}
          </div>
        </section>
        {passwordForm && <Popup><AddPasswordForm form={setPasswordForm} setPasswords={setPasswords} passwords={passwords} /></Popup>}
        {mainPasswordForm && <Popup><ResetPasswordForm form={setMainForm} setPasswords={setPasswords}/></Popup>}
    </main>
    </>
  )
}

export default Dashboard