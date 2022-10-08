import { useState } from "react"

function LoginForm() {

    const [login,setLogin] = useState('')
    const [password,setPassword] = useState('')

    const submit = () => {
        console.log(login,password)
    }

  return (
    <section className="form">
        <div className="loginForm">
            <label className="formElem">
                <p>Login</p>
                <input type='text' value={login} onChange={e => setLogin(e.target.value)}/>
            </label>
            <label className="formElem">
                <p>Password</p>
                <input type='password' value={password} onChange={e => setPassword(e.target.value)}/>    
            </label>
            <label className="formElem">
                <button onClick={submit} className="submit" >Log in</button>
            </label>
        </div>
    </section>
  )
}

export default LoginForm