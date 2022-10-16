import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../App"
import AddPasswordForm from "../components/AddPasswordForm"
import Nav from "../components/Nav"
import Password from "../components/Password"
import Popup from '../components/Popup'
import '../resources/css/Dashboard.css'

function Dashboard() {

  const authData = useContext(AuthContext)
  const [passwords,setPasswords] = useState([])
  const [passwordForm,setPasswordForm] = useState(false)
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
        setPasswords(res.data)
    })
    .catch(err => console.log(err))

  },[authData])

  return (
    <>
    <Nav/>
    <main>
        <section className="userInfo">
          <div className="userInfo">
            <p>Hello {'login'}</p>
            <p>Your passwords: {'36'}</p>
          </div>
          <div className="password-operations">
            <p onClick={() => setPasswordForm(true)} className='eventTag'>Add new</p>
          </div>
        </section>
        <section className="passwords">
          <h2>My passwords</h2>
          <div className="password-list">
            {passwords.map(password => <Password key={password._id} data={password}/>)}
          </div>
        </section>
        {passwordForm && <Popup><AddPasswordForm form={setPasswordForm}/></Popup>}
    </main>
    </>
  )
}

export default Dashboard