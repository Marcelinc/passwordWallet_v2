import './resources/css/App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import { createContext, useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';

export const AuthContext = createContext()

function App() {

  const [token,setToken] = useState(localStorage.getItem('userToken'))
  const [logged,setLogged] = useState(false)
  const [loading,setLoading] = useState(true)

  useEffect(() => {
    //Authentication
    setLoading(true)
    fetch(process.env.REACT_APP_SERVER+'/user/getMe',{
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.log(err))
    .finally(() => setLoading(false))
  },[token])

  return (
    !loading &&
    <Router>
      <AuthContext.Provider value={{token,setToken,logged,setLogged}}>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Routes>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
