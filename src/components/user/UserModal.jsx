import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUsers } from '../../redux/userDataSlice';
import { closeModal } from '../../redux/modalSlice';
import useClickOutside from '../../hooks/useClickOutside';

const UserModal = ({ handleLoginAsUser }) => {
  const users = useSelector(selectUsers);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  

  const handleClose = () => {
    dispatch(closeModal());
  };

  const modalRef = useClickOutside(handleClose);

  const handleRowClick = (userId) => {
    handleLoginAsUser(userId);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div ref={modalRef} className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">მომხმარებლები</h2>
          <button onClick={handleClose} className="hover:text-gray-200 focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="შეიყვანეთ მომხმარებლის სახელი"
              className="w-full p-2 border border-gray-300 rounded outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Table */}
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                <th className="border border-gray-300 px-4 py-2 text-left">User Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    onClick={() => handleRowClick(user.id)}
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.username}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center p-4">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
