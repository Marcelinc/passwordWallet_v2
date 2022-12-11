import './resources/css/App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import { createContext, useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';

export const AuthContext = createContext()

function App() {

  const [token,setToken] = useState('')
  const [logged,setLogged] = useState(false)
  const [loading,setLoading] = useState(true)
  const [password,setPassword] = useState('')
  const [login,setLogin] = useState('')
  const [isHmac,setIsHmac] = useState(false)

  useEffect(() => {
    setLogged(false)
    setToken(localStorage.getItem('userToken'))
    setPassword('')
    //Authentication
    setLoading(true)
    fetch(process.env.REACT_APP_SERVER+'/user/getMe',{
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('userToken')
      }
    })
    .then(res => res.json())
    .then(res => {
      if(res.message === 'Authorized'){
        setLogin(res.data.login)
        setIsHmac(res.data.isHmac)
        setLogged(true)
        console.log(res.data)
      }
    })
    .catch(err => console.log(err))
    .finally(() => setLoading(false))
  },[])

  return (
    !loading &&
    <Router>
      <AuthContext.Provider value={{token,setToken,logged,setLogged,password,setPassword,login,isHmac}}>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/login' element={<LoginPage/>}/>
        </Routes>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
