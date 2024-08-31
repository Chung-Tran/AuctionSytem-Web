import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import authApi from 'src/service/AuthService'
import { ToastContainer, toast } from 'react-toastify'
import { useFormik } from 'formik'
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux'

const Login = () => {
  const navigate = useNavigate();
  const [loginSuccess, setLoginSuccess] = useState(false);

 
  const handleLogin = async (values) => {

    if (!values.Email || !values.Password) {
      toast.error("Email và mật khẩu bắt buộc nhập");
      return;
    }
    const result = await authApi.login(values);
      console.log('result',result)
      if (result.success) {
        toast.success("Đăng nhập thành công");
        setLoginSuccess(true);
        // dispatch(setPermission(result.data.listPermission));
        localStorage.setItem("permission", JSON.stringify(result.data.listPermission));
        localStorage.setItem("userinfo", JSON.stringify(result.data));
        checkCookie()
      }
  }
  const checkCookie = () => {
    const userData = Cookies.get('user');
    if (userData) {
      console.log('login sucess');
      navigate('/')
    }
  };
  
 
  const formik=useFormik(
    {
      initialValues: {
        Email: '',
        Password:''
      },
      onSubmit: values => {
        handleLogin(values)
      },
  }
  )
  useEffect(() => {
    checkCookie()
  }, [loginSuccess])
  console.log('render')
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={formik.handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Username" autoComplete="username" name='Email' onChange={formik.handleChange} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        name='Password'
                        onChange={formik.handleChange}

                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type='submit' >
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
