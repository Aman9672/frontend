import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios' 
export const AuthContext = createContext()


const AuthProvider = ({ children }) => {
  const [error, setError] = useState('')
  const [logintoken, setLogintoken] = useState(localStorage.getItem('cespl_admin_token'))
  const [userData, setUserData] = useState(null); 
  const [verifiedToken, setverifiedToken] = useState(null); 
  const storeTokenToLocal = (token) => {
    localStorage.setItem('cespl_admin_token', token)
  }

  const logoutUser = () => {
    setLogintoken('')
    return localStorage.removeItem('cespl_admin_token')
  }

  //   to get currentyly loged user data

  const userAuthantication = async () => {
    try {
      const token = localStorage.getItem('cespl_admin_token');
      if (!token) {
        throw new Error('No token found');
      }
  
      const response = await axios.get('/api/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        }, 
      });
  
      setUserData(response.data.msg);
      setverifiedToken(response.data.token);
   
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to authenticate user.');
      }
    }
  };

  useEffect(() => {
    userAuthantication()
  }, []);

  return (
    <AuthContext.Provider value={{ storeTokenToLocal, logoutUser,userData,verifiedToken}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const AuthContextValue = useContext(AuthContext)
  if (!AuthContextValue) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return AuthContextValue
}

export default AuthProvider
