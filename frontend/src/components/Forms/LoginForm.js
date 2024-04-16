import { useContext, useState } from "react"
import { AuthContext } from "../../App"
import { useLocation } from "react-router-dom"

function LoginForm() {

    const authData = useContext(AuthContext)

    const [login,setLogin] = useState('')
    const [password,setPassword] = useState('')
    const [message,setMessage] = useState('')
    const location = useLocation();
    console.log('location: ' + location)

    const submit = () => {
        if(checkFormValidation()){
            setMessage('Logging in...');
            fetch(process.env.REACT_APP_SERVER+'/user/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({login,password})
            })
            .then(res => res.json())
            .then(res => {
                if(res.message === 'Success'){
                    authData.setLogin(res.data.login)
                    authData.setIsHmac(res.data.isHmac)
                    authData.setLogged(true)
                    authData.setToken(res.data.token)
                    window.localStorage.setItem('userToken',res.data.token)
                }
                setMessage(res.message)
            })
            .catch(err => {
                console.log(err)
                setMessage('Cannot log in. Try again later')
            })
        }   
    }

    const checkFormValidation = () => {
        let validate = true;    
        if(!password){
            validate = false;
            setMessage('Enter login credentials');
        }

        if(!login){
            validate = false;
            setMessage('Enter login credentials');
        }
        return validate
    }

  return (
    <section className="form-container">
        <h2>Sign in</h2>
        <div className="form">
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
            <p className="appMessage">{message}</p>
        </div>
    </section>
  )
}

export default LoginForm