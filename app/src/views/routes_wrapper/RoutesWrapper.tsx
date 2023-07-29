import { Route, Routes } from 'react-router-dom'
import Home from '../home/Home'
import Login from '../login/Login'
import Signup from '../signup/Signup'
import Board from '../board/Board'

const RoutesWrapper = () => {
  return (
    <div className="routes">
      <Routes>
        <Route path='/' element={ <Home /> } />
        <Route path='/login' element={ <Login /> } />
        <Route path='/signup' element={ <Signup /> } />
        <Route path='/board' element={ <Board /> } />
      </Routes>
    </div>
  )
}

export default RoutesWrapper