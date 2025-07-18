import { useState } from 'react'
import reactLogo from './assets/react.svg'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import viteLogo from '/vite.svg'
import './App.css'
import Pdf from './Pages/Pdf'
import store from './redux/store'
import {Provider} from 'react-redux'
import Login from './Pages/Login'
import Register from './Pages/Register'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Provider store={store}>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Pdf/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
      </BrowserRouter>
      </Provider>
    </div>
  )
}

export default App
