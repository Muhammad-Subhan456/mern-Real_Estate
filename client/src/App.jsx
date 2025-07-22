import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import SignUp from './pages/SignUp'
import About from './pages/About'
import Signin from "./pages/Signin"
import Profile from "./pages/Profile"
import Header from './assets/components/Header'
import PrivateRoute from './assets/components/privateRoute'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/updateListing'
export default function App() {
  return <BrowserRouter>
   <Header/>
    <Routes>
      <Route path='/' element ={<Home/>} ></Route>
      <Route path='/sign-in' element ={<Signin/>} ></Route>
      <Route path='/sign-up' element ={<SignUp/>} ></Route>
      <Route path='/about' element ={<About/>} ></Route>
      <Route element ={<PrivateRoute/>} >
        <Route path='/profile' element ={<Profile/>}/>
        <Route path='/create-listing' element ={<CreateListing/>}/>
        <Route path='/update-listing/:listingId' element ={<UpdateListing/>}/>
      </Route>

    </Routes>
  </BrowserRouter>
}
