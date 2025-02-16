import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Search, Send } from 'lucide-react';
import './admin_home.css';

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  //FETCH ALL USERS FROM DB
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/fetch-all-users'); 
        const userData = response.data.Items;

        const formattedUsers = userData.map((user) => ({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          createdDate: user.user_created, 
        }));

        setUsers(formattedUsers);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  // DELETE 
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://127.0.0.1:8000/delete-user/${userId}`);
        
        if (response.status === 200) {
          // Remove the user from the local state
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
          alert('User deleted successfully!');
        } else {
          alert('Failed to delete user. Please try again.');
        }
      } catch (err) {
        console.error('Error deleting user:', err);
        alert(`Failed to delete user: ${err.message}`);
      }
    }
  };

  //REVERSE STRING
const handleReverseString = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/reverse-alphabets/', { "input_string": inputText });
    setOutputText(response.data.result);
  } catch (error) {
    console.error('Error reversing string:', error);
    setOutputText('Error processing request');
  }
};



  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading...</div>;  //
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="user-dashboard">
      <div className="header">
        <h1>User Management</h1>
        <p>Manage and monitor user accounts</p>
      </div>

      <div className="actions-bar">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="users-table">
        <div className="table">
          <table>
            <thead className="table-header">
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="table-cell">#{user.id}</td>
                  <td className="table-cell">{user.firstName}</td>
                  <td className="table-cell">{user.lastName}</td>
                  <td className="table-cell">{user.email}</td>
                  <td className="table-cell">
                    {/* {new Date(user.createdDate).toLocaleString()}  */}
                    {user.createdDate}
                  </td>
                  <td className="table-cell">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="delete-button"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="empty-state">
          <p>No users found matching your search.</p>
        </div>
      )}

      <div className="reverse-string"> 
        <div className="header-two">
          <h1>String Reverse</h1>
          <p>Type a string to reverse its characters</p> 
          <p>
            Input : <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} />
          </p>
          <button onClick={handleReverseString} className='send-button'><Send/></button>
          <p>Output : {outputText}</p>

        </div>

      </div>

    </div>
  );
};

export default UserDashboard;
