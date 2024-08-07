import { useContext, useState } from "react"
import PasswordForm from "../Forms/PasswordForm"
import SharePasswordForm from "../Forms/SharePasswordForm"
import Popup from "../Popups/Popup"

const SharedPassword = ({data,mode}) => {

    const [decrypted,setDecrypted] = useState('')
    const [notAllowed,setNotAllowed] = useState(false);
    const [form,setForm] = useState(false)
    const [shareForm,setShareForm] = useState(false);

    const showPassword = () => {

    }

  return (
    <div className="password">
        <h2>Website: {data.sh.id_password.web_address.name}</h2>
        <p className='website-info'>
          <span className="sharedOwner">Shared from: {data.sh.id_owner.login}</span>
          Login: {data.sh.id_password.login ? data.sh.id_password.login : 'Not set'}
          <span className="sharedPassword">
          Password: {decrypted ? decrypted : data.sh.id_password.password} 
          </span>
        </p>
        {decrypted ? <button onClick={() => setDecrypted('')}>Hide</button> : <button className='showPassword' onClick={showPassword} disabled={mode === 'Read'}>Show</button>}
        {form && <Popup><PasswordForm form={setForm} show={showPassword}/></Popup>}
      </div>
  )
}

export default SharedPassword