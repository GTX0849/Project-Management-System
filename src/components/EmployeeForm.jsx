import { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeForm = ({ addEmployee, updateEmployee, editingEmployee, setEditingEmployee }) => {
  const [employee, setEmployee] = useState({
    name: '',
    post: '',
    salary: 0
  });

  useEffect(() => {
    if (editingEmployee) {
      setEmployee(editingEmployee);
    } else {
      setEmployee({ name: '', post: '', salary: 0 });
    }
  }, [editingEmployee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!employee.name || !employee.post || !employee.salary) {
      alert('All fields are required.');
      return;
    }

    if (editingEmployee) {
      updateEmployee(employee);
    } else {
      addEmployee(employee);
    }

    setEmployee({
      name: '',
      post: '',
      salary: 0
    })
  }
  const handleCancel = () => {
    setEditingEmployee(null);
    setEmployee({ name: '', post: '', salary: 0 });
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100 mt-10">
      <h2 className="text-xl font-semibold mb-6 border-b pb-2">
        {editingEmployee ? 'Edit Employee Record' : 'Add Employee Records'}
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end'>
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-1 text-sm font-medium text-gray-600">Name</label>
          <input
            type="text"
            name='name'
            id='name'
            value={employee.name}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="e.g. John Doe"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="post" className="mb-1 text-sm font-medium text-gray-600">Post</label>
          <input
            type="text"
            name='post'
            id='post'
            value={employee.post}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="e.g. Software Engineer"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="salary" className="mb-1 text-sm font-medium text-gray-600">Salary</label>
          <input
            type="number"
            name='salary'
            id='salary'
            value={employee.salary}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="e.g. 50000"
          />
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleSubmit}
            className="w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm"
          >
            {editingEmployee ? 'Update Employee' : 'Add Employee'}
          </button>
          {editingEmployee && (
            <button
              onClick={handleCancel}
              className="w-full px-6 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all shadow-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmployeeForm