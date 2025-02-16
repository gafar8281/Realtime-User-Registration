import './user_page.css'; 
import { useLocation } from 'react-router-dom';

const UserPage = () => {
    const location = useLocation();
    const firstName = location.state?.firstName || 'Guest';
  return (
    <div className="username-page">
      <div className="header">
        <h1>User Profile</h1>
        <p>Welcome to your profile page, {firstName}!!</p>
      </div>

    </div>
  );
};

export default UserPage;