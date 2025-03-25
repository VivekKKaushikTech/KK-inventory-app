import React, { useState, useEffect } from 'react';
import {
  FaBell,
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaCheckCircle,
} from 'react-icons/fa';
import { Pencil, Bell, Trash2 } from 'lucide-react'; // ✅ Import Lucide Icons
import Header from '../components/Header'; // ✅ Import the Header component

const UserManagement = () => {
  const [employeeData, setEmployeeData] = useState(() => {
    const storedData = localStorage.getItem('dashboardUserData');
    return storedData ? JSON.parse(storedData) : {};
  });

  const [isAddUserCollapsed, setIsAddUserCollapsed] = useState(false);
  const [deleteUserIndex, setDeleteUserIndex] = useState(null);

  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  const [newUser, setNewUser] = useState({
    photo: '',
    name: '',
    designation: '',
    department: '',
    mobile: '',
    email: '',
    company: '',
    location: '',
    role: '',
    tasks: [],
  });

  const [roles] = useState(['Admin', 'Manager', 'Operator', 'Viewer']);
  const [tasks] = useState([
    'Weighing',
    'Reports',
    'Live Monitoring',
    'User Management',
  ]);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    const storedData = localStorage.getItem('dashboardUserData');
    if (storedData) {
      setEmployeeData(JSON.parse(storedData));
    }
  }, []);

  // ✅ Extract Employee Details dynamically
  const employeeName = employeeData?.employeeName || 'Unknown User';
  const employeeID = employeeData?.employeeID || '123456';
  const designation = employeeData?.designation || 'Operator';
  const userLat = employeeData?.lat ?? 'Unknown';
  const userLng = employeeData?.lng ?? 'Unknown';
  const employeePhoto =
    employeeData?.employeePhoto || '/assets/default-user.png';
  const currentTime = new Date();

  // ✅ Handle Input Change for New User
  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // ✅ Handle File Upload for Photo
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewUser({ ...newUser, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Add New User
  const addUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      alert('Name, Email, and Role are required!');
      return;
    }
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      return updatedUsers;
    });

    setNewUser({
      photo: '',
      name: '',
      designation: '',
      department: '',
      mobile: '',
      email: '',
      company: '',
      location: '',
      role: '',
      tasks: [],
    });
  };

  // ✅ Edit User
  const editUser = (index) => {
    setNewUser(users[index]);
    setSelectedUserIndex(index);
    setIsAddUserCollapsed(true);
  };

  // ✅ Update User
  const updateUser = () => {
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers];
      updatedUsers[selectedUserIndex] = newUser;
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      return updatedUsers;
    });
    setSelectedUserIndex(null);
    setNewUser({
      photo: '',
      name: '',
      designation: '',
      department: '',
      mobile: '',
      email: '',
      company: '',
      location: '',
      role: '',
      tasks: [],
    });
  };

  // ✅ Confirm Delete Function (Fix for Undefined Error)
  const confirmDeleteUser = (index) => {
    setDeleteUserIndex(index);
  };

  // ✅ Delete User
  const deleteUser = () => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.filter((_, i) => i !== deleteUserIndex);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      return updatedUsers;
    });
    setDeleteUserIndex(null); // Reset delete index after deletion
  };

  return (
    <div className='flex flex-col min-h-screen bg-white'>
      {/* ✅ Header Section */}
      <Header title='User Management' />

      <div className='flex-grow p-4'>
        {/* ✅ Toggle Button for Add User Section */}
        <button
          onClick={() => setIsAddUserCollapsed(!isAddUserCollapsed)}
          className='flex items-center justify-between w-full bg-gray-200 p-3 rounded-lg shadow-md hover:bg-gray-300 mt-6'>
          <span className='text-lg font-semibold text-orange-500'>
            {isAddUserCollapsed ? 'Close User Form' : 'Add New User'}
          </span>
          <span className='text-xl text-orange-500'>
            {isAddUserCollapsed ? '−' : '+'}
          </span>
        </button>

        {/* ✅ Add New User Section - Collapsible */}
        {isAddUserCollapsed && (
          <div className='mt-4 bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold text-orange-500 mb-4'>
              {selectedUserIndex !== null ? 'Edit User' : 'Add New User'}
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <input
                type='file'
                onChange={handlePhotoUpload}
                className='border p-2 rounded-lg'
              />
              <input
                type='text'
                name='name'
                value={newUser.name}
                onChange={handleInputChange}
                placeholder='Full Name'
                className='border p-2 rounded-lg'
              />
              <input
                type='text'
                name='designation'
                value={newUser.designation}
                onChange={handleInputChange}
                placeholder='Designation'
                className='border p-2 rounded-lg'
              />
              <input
                type='text'
                name='department'
                value={newUser.department}
                onChange={handleInputChange}
                placeholder='Department'
                className='border p-2 rounded-lg'
              />
              <input
                type='text'
                name='mobile'
                value={newUser.mobile}
                onChange={handleInputChange}
                placeholder='Mobile No.'
                className='border p-2 rounded-lg'
              />
              <input
                type='email'
                name='email'
                value={newUser.email}
                onChange={handleInputChange}
                placeholder='Email'
                className='border p-2 rounded-lg'
              />
              <select
                name='role'
                value={newUser.role}
                onChange={handleInputChange}
                className='border p-2 rounded-lg'>
                <option value=''>Select Role</option>
                {roles.map((role, index) => (
                  <option
                    key={index}
                    value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            {/* ✅ Buttons Section */}
            <div className='flex space-x-3 mt-4'>
              {selectedUserIndex !== null ? (
                <>
                  {/* ✅ Update User Button */}
                  <button
                    onClick={updateUser}
                    className='bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition'>
                    Update User
                  </button>

                  {/* ✅ Cancel Button */}
                  <button
                    onClick={() => {
                      setSelectedUserIndex(null); // Exit edit mode
                      setNewUser({
                        photo: '',
                        name: '',
                        designation: '',
                        department: '',
                        mobile: '',
                        email: '',
                        company: '',
                        location: '',
                        role: '',
                        tasks: [],
                      }); // Reset form to Add User mode
                    }}
                    className='bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition'>
                    Cancel
                  </button>
                </>
              ) : (
                /* ✅ Add User Button */
                <button
                  onClick={addUser}
                  className='bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition'>
                  Add User
                </button>
              )}
            </div>
          </div>
        )}
        <div className='flex-grow p-6'>
          {/* ✅ User Summary Section */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
            {[
              {
                label: 'Total Users',
                count: users.length,
                color: 'bg-blue-500',
              },
              {
                label: 'Admins',
                count: users.filter((u) => u.role === 'Admin').length,
                color: 'bg-red-500',
              },
              {
                label: 'Managers',
                count: users.filter((u) => u.role === 'Manager').length,
                color: 'bg-yellow-500',
              },
              {
                label: 'Operators',
                count: users.filter((u) => u.role === 'Operator').length,
                color: 'bg-green-500',
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`p-5 rounded-xl text-white shadow-md ${stat.color}`}>
                <h3 className='text-lg font-semibold'>{stat.label}</h3>
                <p className='text-2xl font-bold'>{stat.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ User List */}
        <div className='mt-6 bg-white p-6 rounded-xl shadow-md'>
          <h2 className='text-xl font-semibold text-orange-500'>User List</h2>
          {users.length === 0 ? (
            <p className='text-gray-500 text-center py-4'>
              No users added yet.
            </p>
          ) : (
            <div className='mt-4 overflow-x-auto'>
              <table className='w-full min-w-max border-collapse'>
                <thead>
                  <tr className='bg-gray-50'>
                    <th className='p-3 text-left text-gray-600'>Name</th>
                    <th className='p-3 text-left text-gray-600'>Role</th>
                    <th className='p-3 text-left text-gray-600'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={index}
                      className='border-b hover:bg-gray-100'>
                      <td className='p-3'>{user.name}</td>
                      <td className='p-3'>{user.role}</td>
                      <td className='p-3 flex space-x-2'>
                        <button
                          onClick={() => editUser(index)}
                          className='text-blue-500'>
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteUserIndex(index)}
                          className='text-red-500'>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* ✅ Delete Confirmation Modal */}
        {deleteUserIndex !== null && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white p-6 rounded-lg shadow-lg text-center w-96'>
              <h2 className='text-lg font-bold text-red-600 mb-4'>
                Confirm Deletion
              </h2>
              <p className='text-gray-700 mb-4'>
                Are you sure you want to delete this user?
              </p>
              <div className='flex justify-center space-x-4'>
                <button
                  onClick={deleteUser}
                  className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600'>
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteUserIndex(null)}
                  className='bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500'>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* ✅ Footer */}
      <footer className='w-full text-center py-4 bg-white-100 text-gray-600 text-sm mt-6 rounded-lg shadow-md'>
        © {new Date().getFullYear()} Kanta King Technologies Pvt Ltd. All rights
        reserved.
      </footer>
    </div>
  );
};

export default UserManagement;
