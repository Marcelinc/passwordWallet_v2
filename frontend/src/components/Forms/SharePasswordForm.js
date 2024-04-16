import React, { useEffect, useContext, useState } from 'react'
import { AuthContext } from '../../App'
import LoaderDots from '../LoaderDots';

function SharePasswordForm({form,passwordId}) {

    const authData = useContext(AuthContext)
    const [users,setUsers] = useState([])
    const [loadingUsers,setLoadingUsers] = useState(true);
    const [message,setMessage]= useState('')

    useEffect(() => {
        fetch(process.env.REACT_APP_SERVER+'/user/getAll',{
            headers: {
                'Authorization': 'Bearer ' + authData.token,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
        .then(res => res.json())
        .then(res =>{
            if(res.message === 'Success'){
                setUsers(res.users)
            }
        })
        .catch(err => console.log(err))
        .finally(() => setLoadingUsers(false));
    },[authData])

    const sharePassword = (receiverId) => {
        setMessage('Sharing password...')
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
            console.log(res.message);
            setMessage(res.message)
        })
        .catch(err => console.log(err))
      }

    const exitSharePasswordForm = () => {
        setMessage('');
        form(false);
    }

  return (
    <div className='shareForm'>
        <h1 className='popup-header'>Share password</h1>
        {loadingUsers ? <LoaderDots/> : <div className='user-list'>
            {users.length > 0 ? users.map(u => <p key={u._id} className='userToShare'>
                {u.login}
                <button onClick={() => sharePassword(u._id)} className='share-bttn'>Share</button>
            </p>) : <p>There are no other users</p>}
        </div>}
        <p className='appMessage'>{message}</p>
        <button onClick={exitSharePasswordForm} className='submit'>Cancel</button>
    </div>
  )
}

export default SharePasswordForm