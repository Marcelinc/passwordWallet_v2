import './resources/css/App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import { createContext, useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Loader from './components/Loader';
import '../src/resources/css/Forms.css';

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
        console.log(res.data)
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
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
        </Routes>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
