import { useEffect, useState } from "react"
import '../resources/css/RegisterForm.css'
import { useNavigate } from "react-router-dom"

function RegisterForm() {

    const [type,setType] = useState('')
    const [login,setLogin] = useState('')
    const [password,setPassword] = useState('')
    const [message,setMessage] = useState('')

    const navigation = useNavigate()

    const submit = () => {
        console.log(type,login,password)
        fetch(process.env.REACT_APP_SERVER+'/user/register',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({login,password,type})
        })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            res.message && setMessage(res.message)
            if(res.message === 'Success') {
                navigation('/login')
            }
        })
    }

  return (
    <section className="form">
        {type === '' ? <div className="typeSelect">
            <div className="type" onClick={() => setType('sha512')}><p>SHA512</p></div>
            <div className="type" onClick={() => setType('hmac')}><p>HMAC</p></div>
        </div> : <div className="registerForm">
            <label className="formElem">
                <p>Login</p>
                <input type='text' value={login} onChange={e => setLogin(e.target.value)}/>
            </label>
            <label className="formElem">
                <p>Password</p>
                <input type='password' value={password} onChange={e => setPassword(e.target.value)}/>    
            </label>
            <label className="formElem">
                <button onClick={submit} className="submit" >Submit</button>
            </label>
            <p className="appMessage">{message}</p>
        </div>}
        
    </section>
  )
}

export default RegisterForm