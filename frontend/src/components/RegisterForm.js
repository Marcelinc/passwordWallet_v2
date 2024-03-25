import { useState } from "react"
import { useNavigate } from "react-router-dom"

function RegisterForm({accountType}) {

    const [type,setType] = useState(accountType)
    const [login,setLogin] = useState('')
    const [password,setPassword] = useState('')
    const [message,setMessage] = useState('')
    const [processing,setProcessing] = useState(false);

    const navigation = useNavigate()

    console.log(type)

    const submit = () => {
        if(checkFormValidation()){
            //form validate
            setProcessing(true);
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
                    navigation('/login',{state: {status: message}})
                }
            })
            .catch(err => {
                setMessage("Can't create an account. Try later");
            })
            .finally(() => setProcessing(false));
        } else{
            //form not valdiate
            setMessage('Missing data in form')
        }
        
    }

    const onTypeChange = e => {
        setType(e.target.value);
    }

    const checkFormValidation = () => {
        let validate = true;
        if(type !== 'hmac' && type !== 'sha512'){
            validate = false;
            setMessage('Select account type');
        }
        if(!password || password.length < 5){
            validate = false;
            setMessage('Password must contain at least 5 characters');
        }
        if(!login || login.length < 5){
            validate = false;
            setMessage('Login must contain at least 5 characters');
        }
            
        return validate;
    }

  return (
    <div className="form-container">
        <h1>Create an account</h1>
        <div className="form">
            <label className="formElem">
                <p>Login</p>
                <input type='text' value={login} onChange={e => setLogin(e.target.value)}/>
            </label>
            <label className="formElem">
                <p>Password</p>
                <input type='password' value={password} onChange={e => setPassword(e.target.value)}/>    
            </label>
            <div className="formRadio">
                <label>
                    <input type="radio" name="accountType" value='sha512' id="sha512" checked={type === 'sha512'} onChange={onTypeChange}/>
                    SHA512
                </label>
                <label>
                    <input type="radio" name="accountType" value='hmac' id="hmac" checked={type === 'hmac'} onChange={onTypeChange}/>
                    HMAC
                </label>
            </div>
            <div className="formElem">
                <button onClick={submit} className="submit" >Register</button>
            </div>
            <p className="appMessage">{processing ? 'Creating account...' : message}</p>
        </div>
        
    </div>
  )
}

export default RegisterForm