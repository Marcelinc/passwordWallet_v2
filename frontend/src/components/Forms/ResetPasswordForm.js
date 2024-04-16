import { useContext, useState } from "react"
import { AuthContext } from "../../App"

function ResetPasswordForm({form,setPasswords}) {

    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirm] = useState('')
    const [actualPassword,setActualPassword] = useState('')
    const [type,setType] = useState('sha512')
    const authData = useContext(AuthContext)

    const resetPassword = () => {
        var isHmac = false
        if(type === 'hmac')
            isHmac = true

        if(password !== '' && password === confirmPassword && actualPassword !== ''){
            console.log('sending data..')
            fetch(process.env.REACT_APP_SERVER+'/user/resetPassword',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authData.token,
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    oldPassword: actualPassword,
                    newPassword: password,
                    isHmac:isHmac
                })
            })
            .then(res => res.json())
            .then(res => {console.log("res: ",res); 
                if(res.message === 'Success'){
                    form(false)
                    setPassword(res.data)
                    fetchPasswords()
                }
                    
            })
            .catch(err => console.log(err))
        }
    }

    const fetchPasswords = () => {
    //Fetch passwords from db
    fetch(process.env.REACT_APP_SERVER+'/password/getAll',{
        headers: {
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + authData.token,
        'Access-Control-Allow-Origin': '*'
        }
    })
    .then(res => res.json())
    .then(res => {
        if(res.message === 'Success')
        console.log(res.data)
        setPasswords(res.data)
    })
    .catch(err => console.log(err))

    }

    /*const handleEncryptType = e => {
        setType(e.target.value)
    }*/

  return (
    <div className="form passwordForm">
        <h2 className="popup-header">Change your main password</h2>
        <label className="formElem">
            <p>Enter your actual password</p>
            <input type='password' value={actualPassword} onChange={e => setActualPassword(e.target.value)}/>
        </label>
        <label className="formElem">
            <p>Enter your new password</p>
            <input type='password' value={password} onChange={e => setPassword(e.target.value)}/>
        </label>
        <label className="formElem">
            <p>Confirm new password</p>
            <input type="password" value={confirmPassword} onChange={e => setConfirm(e.target.value)}/>
        </label>
        {/*<div>
            <p>Encrypting</p>
            <label>SHA512 <input type='radio' value='sha512' name='type' checked={type === 'sha512'} onChange={handleEncryptType}/></label>
            <label>HMAC <input type='radio' value='hmac' name='type' checked={type === 'hmac'} onChange={handleEncryptType}/></label>
  </div>*/}
        <button className="submit" onClick={resetPassword}>Submit</button>
        <button className="submit" onClick={() => form(false)}>Cancel</button>
    </div>
  )
}

export default ResetPasswordForm