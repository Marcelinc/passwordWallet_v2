import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../App"
import AddPasswordForm from "../components/Forms/AddPasswordForm"
import Nav from "../components/Nav"
import Popup from '../components/Popup'
import ResetPasswordForm from "../components/Forms/ResetPasswordForm"
import '../resources/css/Dashboard.css'
import { GrShieldSecurity } from 'react-icons/gr'
import { IoWalletSharp } from 'react-icons/io5'
import { RiUserSharedFill } from 'react-icons/ri'
import { RiAddCircleFill } from "react-icons/ri"
import { RiLockPasswordLine } from "react-icons/ri"
import ModeSelector from "../components/ModeSelector"
import PasswordSection from "../components/DashboardComponents/PasswordSection"
import SecuritySection from "../components/DashboardComponents/SecuritySection"
import SharedPasswordSection from "../components/DashboardComponents/SharedPasswordSection"

function Dashboard() {

  const authData = useContext(AuthContext)
  const [passwords,setPasswords] = useState([])
  const [loginAttempts,setAttempts] = useState([])
  const [sharedPasswords,setShared] = useState([])
  const [passwordForm,setPasswordForm] = useState(false)
  const [mainPasswordForm,setMainForm] = useState(false)
  const [content,setContent] = useState('passwords')

  const [mode,setMode] = useState('Read')
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
        'Authorization': 'Bearer ' + authData.token,
        'Access-Control-Allow-Origin': '*'
      }
    })
    .then(res => res.json())
    .then(res => {
      if(res.message === 'Success')
        console.log('attempts: ',res.data.reverse())
        setAttempts(res.data)
    })
    .catch(err => console.log(err))

    //Fetch shared passwords
    fetch(process.env.REACT_APP_SERVER+'/password/getShared',{
      headers: {
        'Authorization': 'Bearer ' + authData.token
      }
    })
    .then(res => res.json())
    .then(res => {
      console.log('shared: ',res)
      if(res.message === 'Success'){
        setShared(res.data)
      }
    })
    .catch(err => console.log(err))

  },[authData,navigation])

  const changeMode = () => {
    if(mode === 'Read'){
      setMode('Edit')
    }
    if(mode === 'Edit'){
      setMode('Read')
    }
  }

  return (
    <div className="container">
      <Nav/>
      <div className="content">
        <main>
            <section className="userDash">
              <div className="userInfo">
                <h2>Hello {authData.login}</h2>
                <p>Account type: {authData.isHmac ? 'HMAC' : 'SHA512'}</p>
                <p>Your passwords: {passwords ? passwords.length : '0'}</p>
                
                {<ModeSelector mode={mode} onClickHandler={changeMode}/>}
              </div>
              <div className="password-operations">
                <p onClick={() => setContent('security')} className="eventTag" title="Security">
                  <GrShieldSecurity />
                </p>
                <p onClick={() => setContent('passwords')} className="eventTag" title="My passwords">
                  <IoWalletSharp />
                </p>
                <p onClick={() => setContent('sharedPasswords')} className="eventTag" title="Sharing passwords">
                  <RiUserSharedFill />
                </p>
                <p onClick={() => setPasswordForm(true)} className='eventTag' title="Add new">
                  <RiAddCircleFill />
                </p>
                <p onClick={() => {mode === 'Edit' && setMainForm(true)}} className={(mode === 'Read' ? 'disabledBttn ' : '') +'eventTag'} title="Change main password">
                  <RiLockPasswordLine />
                </p>
              </div>
            </section>
            {content === 'passwords' ? <PasswordSection passwords={passwords} mode={mode}/> : 
            content === 'security' ? <SecuritySection loginAttempts={loginAttempts}/> : <SharedPasswordSection sharedPasswords={sharedPasswords}/>}
            {passwordForm && <Popup><AddPasswordForm form={setPasswordForm} setPasswords={setPasswords} passwords={passwords} /></Popup>}
            {mainPasswordForm && <Popup><ResetPasswordForm form={setMainForm} setPasswords={setPasswords}/></Popup>}
        </main>
      </div>
    </div>
  )
}

export default Dashboard