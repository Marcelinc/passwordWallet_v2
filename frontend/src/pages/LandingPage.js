import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../App"
import Nav from "../components/Nav"
import '../resources/css/LandingPage.css'

function LandingPage() {

  const authData = useContext(AuthContext)
  const navigation = useNavigate()

  useEffect(() => {
    authData.logged && navigation('/dashboard')
  })

  return (
    <div className="container">
        <Nav/>
        <div className="content landing">
          <main>
              <section className="appDescript">
                <h1>Save all your passwords in one place</h1>
                <div className="appDescript-box">
                  <h3>Safety First</h3>
                  <p>All passwords are encrypted and the only way to decrypt is to give your main account password</p>
                </div>
                <div className="appDescript-box">
                  <h3>Password Sharing</h3>
                  <p>With encrypted sharing options and granular access controls, you can confidently share passwords while maintaining utmost security and control over sensitive information.</p>
                </div>
                <div className="appDescript-box">
                  <h3>Account protection</h3>
                  <p>Choose between two encryption account types: SHA512 and HMAC. </p>
                </div>
              </section>
              <section className="accountType">
                <h2>Create account</h2>
                <div className="typeSelect">
                  <div className="type sha" onClick={() => navigation('/register', {state: {type: 'sha512'} })}><p>SHA512</p></div>
                  <div className="type hmac" onClick={() => navigation('/register', {state: {type: 'hmac'} })}><p>HMAC</p></div>
                </div> 
              </section>
          </main>
        </div>
    </div>
  )
}

export default LandingPage