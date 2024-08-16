import './resources/css/App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import { createContext, useEffect, useState, useRef } from 'react';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Loader from './components/Loader/Loader';
import '../src/resources/css/Forms.css';
import '../src/resources/css/Popup.css';

export const AuthContext = createContext();
export const MessagePopupContext = createContext();
export const MESSAGE_POPUP_TIMER = 3000;

function App() {

  const [token,setToken] = useState('')
  const [logged,setLogged] = useState(false)
  const [loading,setLoading] = useState(true)
  const [password,setPassword] = useState('')
  const [login,setLogin] = useState('')
  const [isHmac,setIsHmac] = useState(false)

  const [popupMessage,setPopupMessage] = useState('');
  const [isActivePopupMessage,setIsActivePopupMessage] = useState(false);
  const popupTimeout = useRef(null);

  const triggerPopup = () => {
    if(popupTimeout.current){
      clearInterval(popupTimeout.current);
    }
    setIsActivePopupMessage(true);
    popupTimeout.current = setTimeout(() => {
      setIsActivePopupMessage(false);
      popupTimeout.current = null;
    },MESSAGE_POPUP_TIMER)
  }


  useEffect(() => {
    setLogged(false)
    setToken(localStorage.getItem('userToken'))
    setPassword('')
    //Authentication
    setLoading(true)
    fetch(process.env.REACT_APP_SERVER+'/user/getMe',{
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('userToken'),
        'Access-Control-Allow-Origin': '*'
      }
    })
    .then(res => res.json())
    .then(res => {
      if(res.message === 'Authorized'){
        setLogin(res.data.login)
        setIsHmac(res.data.isHmac)
        setLogged(true)
        //console.log(res.data)
      }
    })
    .catch(err => console.log(err))
    .finally(() => setLoading(false))
  },[])

  return (
    loading ? <div className='container app'>
      <Loader/>
    </div> :
    <Router>
      <AuthContext.Provider value={{token,setToken,logged,setLogged,password,setPassword,login,setLogin,isHmac,setIsHmac}}>
        <MessagePopupContext.Provider value={{'message': popupMessage,'setMessage':setPopupMessage,'isActive':isActivePopupMessage,'setIsActive':triggerPopup}}>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
        </Routes>
        </MessagePopupContext.Provider>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
