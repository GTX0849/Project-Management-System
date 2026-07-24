import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Pencil, Trash2, Loader2, User } from 'lucide-react';

const API_URL = 'http://localhost:3000/api/employees'

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    joinDate : ''
  })

  const [employees, setEmployees] = useState([])
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false);
  const [avatars, setAvatars] = useState({});

  useEffect(() => {
    fetchEmployees();
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await axios.get(API_URL)
      const formattedData = response.data.map((emp) => ({
        id: emp._id,
        fullName: emp.fullName,
        email: emp.email,
        role: emp.role,
        joinDate: emp.joinDate ? emp.joinDate.split('T')[0] : 'N/A',
      }))
      setEmployees(formattedData)

      formattedData.forEach((emp) => loadAvatar(emp.id, emp.fullName))
    } catch (error) {
      console.log('Error fetching employees:', error);      
    }
    finally {
      setLoading(false)
    }
  }

  const loadAvatar = async (id, name) => {
    try {
      const response = await axios.get(
        `https://api.dicebear.com/10.x/croodles/svg?seed=${encodeURIComponent(name)}`
      );
      setAvatars((prev) => ({ ...prev, [id]: response.data}))
    } catch (error) {
      console.log('Error Loading Data: ', error)
    }
  }

  const handleChange = (e) => {
    const {id, value} = e.target;
    setFormData((prev) => ({ ...prev, [id]: value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, {
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          joinDate: formData.joinDate
        })
        setEditId(null)
      }
      else{
        await axios.post(API_URL, {
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          joinDate: formData.joinDate
        })
      }

      setFormData({ fullName: '', email: '', password: '', role: '', joinDate: '' })
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Failed to save user.');
    }
  }

  const handleEdit = (emp) => {
    setFormData({
      fullName: formData.fullName,
      email: formData.email,
      password: '',
      role: formData.role,
      joinDate: formData.joinDate,
    })

    setEditId(emp.id)
    window.scrollTo({ top:0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you wanna delete this user?')) return; {
      try {
        await axios.delete(`${API_URL}/${id}`)
        fetchEmployees()
      } catch (error) {
        console.error('Error deleting employee: ', error)
      }
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center bg-bgMain text-textDark font-sans">
      {/* Registration Card Form */}
      <div className="w-full max-w-3xl bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-6 md:p-10 border border-gray-100 transition-shadow duration-300">
        <h1 className="text-3xl font-bold text-teal mb-2">Join the Workspace</h1>
        <p className="text-gray-600 mb-8">Register for the Project Management System.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="fullName">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                required
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-borderLight rounded-lg focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="email">
                Work Email
              </label>
              <input
                type="email"
                id="email"
                required
                placeholder="john@company.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-borderLight rounded-lg focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                required={!editId}
                minLength={8}
                placeholder="Min 8 characters"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-borderLight rounded-lg focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="role">
                System Role
              </label>
              <select
                id="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-borderLight rounded-lg focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors bg-white"
              >
                <option value="" disabled>
                  Select a role...
                </option>
                <option value="Project Manager">Project Manager</option>
                <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
                <option value="Stakeholder">Stakeholder</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="joinDate">
                Expected Joining Date
              </label>
              <input
                type="date"
                id="joinDate"
                required
                value={formData.joinDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-borderLight rounded-lg focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-teal text-white font-semibold rounded-lg shadow-sm hover:bg-tealDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal transition-colors"
          >
            {editId ? 'Update User' : 'Register User'}
          </button>
        </form>
      </div>

      {/* Employee List Section */}
      <ul className="mt-8 space-y-4 w-full max-w-3xl">
        {loading ? (
          <div className="flex justify-center p-6 text-teal">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : (
          employees.map((emp) => (
            <li
              key={emp.id}
              className="group p-5 bg-white border border-borderLight rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center w-full"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-borderLight overflow-hidden shrink-0">
                  {avatars[emp.id] ? (
                    <div
                      className="w-full h-full"
                      dangerouslySetInnerHTML={{ __html: avatars[emp.id] }}
                    />
                  ) : (
                    <User className="text-gray-400 w-6 h-6" />
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-lg font-bold text-gray-900">{emp.fullName}</p>
                  <div className="flex flex-wrap items-center gap-x-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4 text-teal" /> {emp.email}
                    </span>
                    <span className="hidden md:inline text-gray-300">|</span>
                    <span className="font-medium text-tealDark">{emp.role}</span>
                    <span className="hidden md:inline text-gray-300">|</span>
                    <span className="italic">Joined: {emp.joinDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(emp)}
                  className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(emp.id)}
                  className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App
