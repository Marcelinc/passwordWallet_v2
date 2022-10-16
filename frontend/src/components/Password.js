import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../App'
import '../resources/css/Password.css'
import PasswordForm from './PasswordForm'
import Popup from './Popup'

function Password({data}) {

  const [decrypted,setDecrypted] = useState('')
  const [form,setForm] = useState(false)
  const authData = useContext(AuthContext)

  useEffect(() => {
    setDecrypted('')
  },[])

  const show = () => {
    if(!authData.password || authData.password === '')
      setForm(true)
    
    if(authData.password != ''){
      fetch(process.env.REACT_APP_SERVER+'/password/decrypt',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authData.token
        },
        body: JSON.stringify({password: data.password,userPassword: authData.password})
      })
      .then(res => res.json())
      .then(res => {
        if(res.message === 'Success')
          setDecrypted(res.data.decrypted)
      })
      .catch(err => console.log(err))
    }
  }

    return (
      <div className="password">
        <h2>Website: {data.website}</h2>
        <p>
          Password: {decrypted ? decrypted : data.password} 
          {decrypted ? <button onClick={() => setDecrypted('')}>Hide</button> : <button onClick={show}>Show</button>}
        </p>
        {form && <Popup><PasswordForm form={setForm} show={show}/></Popup>}
      </div>
    )
  }
  
  export default Password