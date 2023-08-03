import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.scss';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
      const session_token = localStorage.getItem('session_token');
      if (!session_token) {
        navigate('/login');
      }
      else {
        navigate('/board');
      }
  }, [])

  return ''
}

export default Home