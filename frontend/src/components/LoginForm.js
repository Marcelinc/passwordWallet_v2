import { useContext, useState } from "react"
import { AuthContext } from "../App"

function LoginForm() {

    const authData = useContext(AuthContext)

    const [login,setLogin] = useState('')
    const [password,setPassword] = useState('')

    const submit = () => {
        if(login && password)
            fetch(process.env.REACT_APP_SERVER+'/user/login',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({login,password})
            })
            .then(res => res.json())
            .then(res => {
                if(res.message === 'Success'){
                    authData.setLogged(true)
                    authData.setToken(res.data.token)
                    window.localStorage.setItem('userToken',res.data.token)
                }
            })
            .catch(err => console.log(err))
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