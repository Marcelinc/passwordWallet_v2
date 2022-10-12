import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../App"
import Nav from "../components/Nav"
import Password from "../components/Password"

function Dashboard() {

  const authData = useContext(AuthContext)
  const [passwords,setPasswords] = useState([{id:1,hash:'sfsfsdsfefesf',website:'Google'},{id:2,hash:'faffsdfsegsddf',website:'Github'}])
  const navigation = useNavigate()

  useEffect(() => {
    !authData.logged && navigation('/login')
  },[])

  return (
    <>
    <Nav/>
    <main>
        <section className="userInfo">
          <div className="userInfo">
            <p>Login {'login'}</p>
            <p>Hasła: {'36'}</p>
          </div>
          <div className="password-operations">
            <p>Add new</p>
          </div>
        </section>
        <section className="passwords">
          <h2>My passwords</h2>
          <div className="password-list">
            {passwords.map(password => <Password key={password.id} data={password}/>)}
          </div>
        </section>
    </main>
    </>
  )
}

export default Dashboard