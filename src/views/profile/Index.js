import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast, ToastContainer, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CFormCheck,
  CRow,
} from '@coreui/react'

const Index = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    isAdmin: false,
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('cespl_admin_token')
        const userResponse = await axios.get('/api/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const userData = userResponse.data.msg
        setUserData(userData)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setUserData({
      ...userData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (e.currentTarget.checkValidity()) {
      const response = await axios.post('/api/auth/profile-submit', { userData })
      if (response) {
        try {
          toast.info(response.data.message, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          })
          setUserData({
            ...userData,
            password: '', // Clear the password field
          })
        } catch (error) {
            console.error(error);
            
          toast.error('An error occurred while updating profile.', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          })
        }
      }
    } else {
      e.stopPropagation()
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3 needs-validation" onSubmit={handleSubmit}>
              <CCol md={6}>
                <CFormLabel htmlFor="name">Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  required
                />
                <CFormFeedback invalid>Please provide a name.</CFormFeedback>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="email">Email</CFormLabel>
                <CFormInput
                  type="text"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                  readOnly
                />
                <CFormFeedback invalid>Please provide an email.</CFormFeedback>
              </CCol>
              <CCol md={12}>
                <CFormLabel htmlFor="password">Password</CFormLabel>
                <CFormInput type="text" id="password" name="password" onChange={handleChange} />
                <CFormFeedback invalid>Please provide a password.</CFormFeedback>
              </CCol>
              <CCol md={12}>
                <CFormCheck
                  id="isAdmin"
                  name="isAdmin"
                  label="Is Admin"
                  checked={userData.isAdmin}
                  onChange={handleChange}
                />
              </CCol>
              <CCol xs={12}>
                <CButton className="me-2" color="primary" type="submit">
                  Submit form
                </CButton>
                <Link to="/dashboard" className="btn btn-primary">
                  Cancel
                </Link>
              </CCol>
            </CForm>
            <ToastContainer />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Index
