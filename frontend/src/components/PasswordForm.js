import { useContext, useState } from "react"
import { AuthContext } from "../App"

function PasswordForm({form,show}) {

    const [password,setPassword] = useState('')
    const authData = useContext(AuthContext)

    const changePassword = () => {
        if(password != ''){
            authData.setPassword(password)
            form(false)
            //show()
        }
            
    }

  return (
    <div className="form passwordForm">
        <label className="formElem">
            <p>Enter your password</p>
            <input type='password' value={password} onChange={e => setPassword(e.target.value)}/>
        </label>
        <button className="submit" onClick={changePassword}>Submit</button>
        <button className="submit" onClick={() => form(false)}>Cancel</button>
    </div>
  )
}

export default PasswordForm