import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../App"
import LoginForm from "../components/LoginForm"
import Nav from "../components/Nav"
import RegisterForm from "../components/RegisterForm"
import '../resources/css/LandingPage.css'

function LandingPage() {

  const authData = useContext(AuthContext)
  const navigation = useNavigate()

  useEffect(() => {
    authData.logged && navigation('/dashboard')
  })

  return (
    <>
        <Nav/>
        <main>
            <section className="accountType">Choose account type</section>
            <RegisterForm/>   
        </main>
    </>
  )
}

export default LandingPage