import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../App'
import '../resources/css/Password.css'
import PasswordForm from './PasswordForm'
import Popup from './Popup'

function Password({data}) {

  const [decrypted,setDecrypted] = useState('')
  const [notAllowed,setNotAllowed] = useState(false);
  const [form,setForm] = useState(false)
  const authData = useContext(AuthContext)

  useEffect(() => {
    setDecrypted('')
  },[])

  const show = () => {
    if(!authData.password || authData.password === '' || notAllowed)
      setForm(true)
    
    if(authData.password !== ''){
      fetch(process.env.REACT_APP_SERVER+'/password/decrypt',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authData.token
        },
        body: JSON.stringify({password: data.password,userMainPassword: authData.password})
      })
      .then(res => res.json())
      .then(res => {
        if(res.message === 'Success'){
          setDecrypted(res.data.decrypted)
          setNotAllowed(false)
        }
          
        if(res.message === 'Not authorized') {
          setForm(true)
          setNotAllowed(true)
        }
      })
      .catch(err => console.log(err))
    }
  }

    return (
      <div className="password">
        <h2>Website: {data.web_address}</h2>
        <p>
          Password: {decrypted ? decrypted : data.password} 
          {decrypted ? <button onClick={() => setDecrypted('')}>Hide</button> : <button className='showPassword' onClick={show}>Show</button>}
        </p>
        {form && <Popup><PasswordForm form={setForm} show={show}/></Popup>}
      </div>
    )
  }
  
  export default Password