import React from 'react'
import { Navigate, Route ,Routes} from 'react-router'
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CallPage from "./pages/CallPage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import toast,{Toaster} from "react-hot-toast";
import { useQuery } from '@tanstack/react-query';
import axios from "axios";
import { axiosInstance } from './lib/axios.js';

const App = () => {

  const {data:authData,idLoading,error}=useQuery({
    queryKey:["authUser"],
    queryFn:async ()=>{
      const res=await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry:false, //auth check
  });

  const authUser=authData?.user;

  if (idLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Checking authentication...
      </div>
    );
  }

  return ( 
    <div  className="h-screen" data-theme="coffee">
      {/* <button onClick={()=>toast.success("hello world!")} className='btn'>create a toast</button> */}
      <Routes>
        <Route path="/" element={authUser ? <HomePage/>:<Navigate to="/login" />}/>
        <Route path="/signup" element={!authUser ? <SignUpPage/>:<Navigate to="/" />}/>
        <Route path="/login" element={!authUser ? <LoginPage/>:<Navigate to="/" />}/>
        <Route path="/notification" element={authUser ? <NotificationPage/>:<Navigate to="/login" />}/>
        <Route path="/chat" element={authUser ? <ChatPage/>:<Navigate to="/login" />}/>
        <Route path="/call" element={authUser ? <CallPage/>:<Navigate to="/login" />}/>
        <Route path="/onboarding" element={authUser ? <OnboardingPage/>:<Navigate to="/login" />}/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
