import React, { useEffect, useContext, useState } from 'react'
import { AuthContext } from '../App'

function SharePasswordForm({form,passwordId}) {

    const authData = useContext(AuthContext)
    const [users,setUsers] = useState([])
    const [message,setMessage]= useState('')

    useEffect(() => {
        fetch(process.env.REACT_APP_SERVER+'/user/getAll',{
            headers: {
                'Authorization': 'Bearer ' + authData.token,
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res =>{
            if(res.message === 'Success'){
                setUsers(res.users)
            }
        })
        .catch(err => console.log(err))
    },[])

    const share = (receiverId) => {
        console.log(receiverId)
        console.log(passwordId)
        fetch(process.env.REACT_APP_SERVER+'/password/share',{
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authData.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({passwordId,receiverId}) 
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            setMessage(res.message)
        })
        .catch(err => console.log(err))
      }

  return (
    <div className='shareForm'>
        <h1>Share password</h1>
        <div>
            {users.length > 0 ? users.map(u => <p key={u._id} className='userToShare'>
                {u.login}
                <button onClick={() => share(u._id)}>Share</button>
            </p>) : <p>There are no other users</p>}
        </div>
        <p id='message' style={{color: 'red'}}>{message}</p>
        <button onClick={() => form(false)}>Cancel</button>
    </div>
  )
}

export default SharePasswordForm