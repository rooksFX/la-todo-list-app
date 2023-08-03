import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { AppContext } from '../../context/State';

import Spinner from '../../components/spinner/Spinner';

import './logout.scss';

const Logout = () => {
  const { logoutAction } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      if (logoutAction) logoutAction();
      navigate('/login');
    }, 1500);
  }, [])

  return (
    <div id="logout">
      <Spinner loadingMessage='Logging out...' />
    </div>
  )
}

export default Logout;