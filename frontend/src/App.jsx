import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'http://127.0.0.1:8000/api/students/'

function App() {
  const [students, setStudents] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [course, setCourse] = useState('')
  const [age, setAge] = useState('')
  const [editId, setEditId] = useState(null)

  const getStudents = async () => {
    try {
      const response = await axios.get(API_URL)
      setStudents(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getStudents()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const studentData = {
      name,
      email,
      course,
      age: Number(age)
    }

    try {
      if (editId) {
        await axios.put(API_URL + editId + '/', studentData)
      } else {
        await axios.post(API_URL, studentData)
      }

      setName('')
      setEmail('')
      setCourse('')
      setAge('')
      setEditId(null)

      await getStudents()
    } catch (error) {
      alert(JSON.stringify(error.response?.data || error.message))
    }
  }

  const handleEdit = (student) => {
    setName(student.name)
    setEmail(student.email)
    setCourse(student.course)
    setAge(student.age)
    setEditId(student.id)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      try {
        await axios.delete(API_URL + id + '/')
        await getStudents()
      } catch (error) {
        alert('Unable to delete student')
      }
    }
  }

  return (
    <div className="container">
      <h1>Student Management System</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Enter Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Enter Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />

        <button type="submit">
          {editId ? 'Update Student' : 'Add Student'}
        </button>
      </form>

      <h2>Student Records</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.course}</td>
              <td>{student.age}</td>
              <td>
                <button type="button" onClick={() => handleEdit(student)}>
                  Edit
                </button>

                <button type="button" onClick={() => handleDelete(student.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App