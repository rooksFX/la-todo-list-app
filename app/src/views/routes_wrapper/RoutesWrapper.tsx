import { Route, Routes } from 'react-router-dom'

import Board from '../board/Board'
import Home from '../home/Home'
import Login from '../login/Login'
import Logout from '../logout/Logout'
import Register from '../register/Register'

const RoutesWrapper = () => {
  return (
    <div className="routes">
      <Routes>
        <Route path='/' element={ <Home /> } />
        <Route path='/login' element={ <Login /> } />
        <Route path='/logout' element={ <Logout /> } />
        <Route path='/register' element={ <Register /> } />
        <Route path='/board' element={ <Board /> } />
      </Routes>
    </div>
  )
}

export default RoutesWrapper