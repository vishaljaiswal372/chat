import React from 'react'
import { Route ,Routes} from 'react-router'
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CallPage from "./pages/CallPage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import toast,{Toaster} from "react-hot-toast";

const App = () => {
  return ( 
    <div  className="h-screen" data-theme="coffee">
      <button onClick={()=>toast.success("hello world!")} className='btn'>create a toast</button>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/signup" element={<SignUpPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/notification" element={<NotificationPage/>}/>
        <Route path="/chat" element={<ChatPage/>}/>
        <Route path="/call" element={<CallPage/>}/>
        <Route path="/onboarding" element={<OnboardingPage/>}/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
