import LoginForm from "../components/LoginForm"
import Nav from "../components/Nav"
import RegisterForm from "../components/RegisterForm"

function LandingPage() {
  return (
    <>
        <Nav/>
        <main>
            <RegisterForm/>
            <LoginForm/>    
        </main>
    </>
  )
}

export default LandingPage