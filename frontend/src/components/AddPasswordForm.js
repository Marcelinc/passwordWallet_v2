import {useContext, useState} from 'react'
import { AuthContext } from '../App'
import '../resources/css/PasswordForm.css'
function AddPasswordForm({form,passwords,setPasswords}) {

    const [password,setPassword] = useState('')
    const [web_address,setWebAddress] = useState('')
    const [login,setLogin] = useState('')
    const [description,setDesc] = useState('')
    const authData = useContext(AuthContext)

    const addPassword = () => {
        if(password)
            fetch(process.env.REACT_APP_SERVER+'/password/create',{
                method: 'POST',
                headers: {'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authData.token,
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({password,web_address,login,description})
            })
            .then(res => res.json())
            .then(res => {
                if(res.message === 'Success'){
                    console.log('res: ',res)
                    setPasswords([res.data,...passwords])
                    form(false)
                }
                    
            })
            .catch(err => console.log(err))
    }

  return (
    <>
    <h2 className='popup-header'>Add password</h2>
    <section className='form passwordForm'> 
        <label className="formElem">
            <p>Password</p>
            <input type='password' value={password} onChange={e => setPassword(e.target.value)}/>
        </label>
        <label className="formElem">
            <p>Web Address</p>
            <input type='text' value={web_address} onChange={e => setWebAddress(e.target.value)}/>
        </label>
        <label className="formElem">
            <p>Login (Optional)</p>
            <input type='text' value={login} onChange={e => setLogin(e.target.value)}/>
        </label>
        <label className="formElem">
            <p>Description (Optional)</p>
            <input type='text' value={description} onChange={e => setDesc(e.target.value)}/>
        </label>
        <button className="submit" onClick={addPassword}>Add</button>
        <button className="submit" onClick={() => form(false)}>Cancel</button>
    </section>
    </>
  )
}

export default AddPasswordForm