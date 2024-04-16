import {useContext, useEffect, useState} from 'react'
import { AuthContext } from '../../App'
import '../../resources/css/PasswordForm.css'
import LoaderDots from '../LoaderDots'
function AddPasswordForm({form,passwords,setPasswords}) {

    const [password,setPassword] = useState('')
    const [web_address,setWebAddress] = useState('')
    const [login,setLogin] = useState('')
    const [description,setDesc] = useState('')

    const [webAdressList,setWebAdressList] = useState([])
    const [loadingData,setLoadingData] = useState(true)
    const [creatingPassword,setCreatingPassword] = useState(false)

    const [message,setMessage] = useState('')
    const authData = useContext(AuthContext)

    useEffect(() => {
        fetch(process.env.REACT_APP_SERVER+'/websites/getAll',{
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
        .then(res => res.json())
        .then(res => {
            //console.log(res.websites)
            if(res.message === 'Success'){
                setWebAdressList(res.websites);
                setWebAddress(res.websites[0]);
            } else{

            }
        })
        .finally(() => {
            setLoadingData(false)
        })
    },[])

    const addPassword = () => {
        console.log(web_address)
        if(validateCreatePasswordForm()){
            setCreatingPassword(true);
            setMessage('Creating password...');
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
                    //console.log('res: ',res)
                    setPasswords([res.data,...passwords]);
                    form(false);
                } else {
                    setMessage(res.message);
                }
                    
            })
            .catch(err => console.log(err))
            .finally(() => {
                setCreatingPassword(false);
            })
        } else{
            setMessage('Enter your password')
        }
    }

    const validateCreatePasswordForm = () => {
        let validate = true;
        if(!password)
            validate = false;
        return validate;
    }

  return (
    loadingData ? <LoaderDots/> : 
    <>
        <h2 className='popup-header'>Add password</h2>
        <section className='form passwordForm'> 
            <label className="formElem">
                <p>Password</p>
                <input type='password' value={password} onChange={e => setPassword(e.target.value)}/>
            </label>
            <label className="formElem">
                <p>Web Address</p>
                <select value={web_address} onChange={e => setWebAddress(e.target.value)} className='formElem'>
                    {webAdressList.map(addr => <option value={addr._id} key={addr._id}>{addr.name}</option>)}
                </select>
            </label>
            <label className="formElem">
                <p>Login (Optional)</p>
                <input type='text' value={login} onChange={e => setLogin(e.target.value)}/>
            </label>
            <label className="formElem">
                <p>Description (Optional)</p>
                <input type='text' value={description} onChange={e => setDesc(e.target.value)}/>
            </label>
            <p className='appMessage'>{message}</p>
            <button className="submit" onClick={addPassword}>Add</button>
            <button className="submit" onClick={() => form(false)}>Cancel</button>
        </section>
    </>
  )
}

export default AddPasswordForm