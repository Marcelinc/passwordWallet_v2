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
import { GrShieldSecurity } from 'react-icons/gr'
import { IoWalletSharp } from 'react-icons/io5'
import { RiUserSharedFill } from 'react-icons/ri'
import { RiAddCircleFill } from "react-icons/ri"
import { RiLockPasswordLine } from "react-icons/ri"
import ModeSelector from "../components/ModeSelector"

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
                <button onClick={changeMode}>{mode} Mode</button>
                {/*<ModeSelector mode={mode} onClickHandler={changeMode}/>*/}
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
            {content === 'passwords' ? <section className="passwords">
              <h2>My passwords</h2>
              <div className="password-list">
                {passwords.length > 0 ? passwords.map(password => <Password key={password._id} data={password} mode={mode}/>) 
                : <p>You have no saved passwords</p>}
              </div> 

            </section> : content === 'security' ? <section className="passwords">
                <h2>Login attempts</h2>
                <div className="attempt-list">
                  {loginAttempts && loginAttempts.length > 0 ? loginAttempts.map(attempt => <div key={attempt._id} className='attempt'>
                    <p>{attempt.correct ? <span className="successLogin">Successful</span> : <span className="failedLogin">Failed</span>} login attempt {attempt.createdAt.substring(11,19)} {attempt.createdAt.substring(0,10)}</p>
                    <p>Adres IP: {attempt.id_address.addressIP}</p>
                    <p>Urządzenie: {attempt.computer.split(';')[0]}, {attempt.computer.split(';')[1]}</p>
                    <FaCaretSquareDown className="expandAttempt"/>
                  </div>) : <p>There are no login attempts yet</p>}
                </div>

              </section> : <section className="passwords">
                <h2>Sharing passwords</h2>
                <div className="shared-list">
                  {sharedPasswords && sharedPasswords.length > 0 ? sharedPasswords.map(psswd => <p key={psswd.sh._id}>
                    Password: <span className="sharedPassword">{psswd.decryptedPassword} </span> 
                    from <span className="sharedOwner">{psswd.sh.id_owner.login}</span>
                  </p>) : <p>You don't have any shared passwords</p>}
                </div>
              </section>}
            {passwordForm && <Popup><AddPasswordForm form={setPasswordForm} setPasswords={setPasswords} passwords={passwords} /></Popup>}
            {mainPasswordForm && <Popup><ResetPasswordForm form={setMainForm} setPasswords={setPasswords}/></Popup>}
        </main>
      </div>
    </div>
  )
}

export default Dashboard