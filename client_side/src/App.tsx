import UserDashboard from "./components/admin_home";
import RegistrationForm from "./components/register"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserPage from "./components/user_page";



function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistrationForm/>}/>
        <Route path="/admin-page" element={<UserDashboard/>}/>
        <Route path="/user-page" element={<UserPage/>}/>
      </Routes>
    </Router>

  )
}

export default App
