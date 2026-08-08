import { useEffect, useState } from 'react'
import './App.css'
import EmployeeForm from './components/EmployeeForm.jsx'
import axios from 'axios'

function App() {

  const API_URL = "http://localhost:3000/api/employees"
  const [employee, setEmployee] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL)
      setEmployee(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  const addEmployee = async (newEmployee) => {
    try {
      await axios.post(API_URL, newEmployee);
      fetchEmployees();
      alert("Employee added successfully");
    } catch (error) {
      console.log(error);
    }
  }

  const editEmployee = (emp) => {
    setEditingEmployee(emp);
  }

  const updateEmployee = async (updatedEmployee) => {
    try {
      await axios.put(`${API_URL}/${updatedEmployee.id}`, updatedEmployee);
      fetchEmployees();
      setEditingEmployee(null);
      alert("Employee updated successfully");
    } catch (error) {
      console.log(error);
    }
  }

  const deleteEmployee = async (emp) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete(`${API_URL}/${emp.id}`);
      fetchEmployees();
      alert("Employee deleted successfully");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <>
      <div className='min-h-screen bg-slate-700 p-6 flex flex-col items-center'>
        <h2 className='text-white text-4xl mb-6'>Employee Management System</h2>

        <EmployeeForm 
          addEmployee={addEmployee} 
          updateEmployee={updateEmployee} 
          editingEmployee={editingEmployee} 
          setEditingEmployee={setEditingEmployee}
        />

        <div className='mt-10 bg-white p-6 rounded-lg shadow-sm border border-gray-100 w-full max-w-4xl'>
          {employee.length === 0 ? (
            <p className='text-gray-500'>No employees added yet.</p>
          ) : (
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Post</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Salary</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {employee.map((emp, index) => (
                  <tr key={index}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>{emp.name}</div>
                      <div className='flex gap-2 mt-2'>
                        <button className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all' onClick={() => editEmployee(emp)}>Edit</button>
                        <button className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all' onClick={() => deleteEmployee(emp)}>Delete</button>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{emp.post}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{emp.salary}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}

export default App
