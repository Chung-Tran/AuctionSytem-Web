import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormLabel,
  CCol,
  CFormInput,
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import employeeAPI from 'src/service/EmployeeService';
import { toast } from 'react-toastify';

const RegistrationDialog = ({ isOpen, toggle }) => {
  const navigate = useNavigate();
 
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordError, setShowPasswordError] = useState(false);

  // const [showDialog, setShowDialog] = useState(isOpen);

  const handleCreate = async (values) => {
    console.log("Submitted Values:", values); 
    if (!values.username || !values.password) {
      toast.error("Email và mật khẩu bắt buộc nhập");
      setPasswordError('Email và mật khẩu bắt buộc nhập');
      return;
    }
    else if (values.password !== values['re-password']) {
      setShowPasswordError(true);
      setPasswordError('Mật khẩu không trùng khớp');
      // return;
    }
    try {
      const result = await employeeAPI.create({
        fullName: values.fullName,
        username: values.username,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        rolePermission: values.rolePermission,
      });
      console.log('result',result)  
      if (result.success) {
        // toast.success("Đăng kí thành công");
        toggle();
        // dispatch(setPermission(result.data.listPermission));
        localStorage.setItem("permission", JSON.stringify(result.data.listPermission));
        localStorage.setItem("userinfo", JSON.stringify(result.data));
      } else {
        toast.error(result.message || "Đăng kí thất bại");
      }
    } catch (error) {
        console.error("Error logging in:", error.message);
        toast.error(`Đăng kí thất bại !`);
    }
  };
  
  const formik=useFormik(
    {
      initialValues: {
        fullName: '',
        username: '',
        email: '',
        password:'',
        phoneNumber: '',
        status: '',
        rolePermission: '66f7729a0fe0c277bc99ca86',
      },
      onSubmit: values => {
        handleCreate(values)
      },
    }
  )

  useEffect(() => {
    if (passwordError) {
      setShowPasswordError(true);
      const timer = setTimeout(() => {
        setShowPasswordError(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [passwordError]);

  return (
    <CModal visible={isOpen}>
      <CModalHeader onClick={toggle}>Register Now!</CModalHeader>
      <CModalBody>
        <CForm onSubmit={formik.handleSubmit}>
          <CCol>
            <CFormLabel>Full Name</CFormLabel>
            <CFormInput type="text" placeholder="Enter full name" name='fullName' onChange={formik.handleChange}/>
          </CCol>
          <CCol>
            <CFormLabel>Username</CFormLabel>
            <CFormInput type="text" placeholder="Enter username" name='username' onChange={formik.handleChange}/>
          </CCol>
          <CCol>
            <CFormLabel>Email</CFormLabel>
            <CFormInput type="email" placeholder="Enter email" name='email' onChange={formik.handleChange}/>
          </CCol>
          <CCol>
            <CFormLabel>Password</CFormLabel>
            <CFormInput type="password" placeholder="Enter password" name='password' onChange={formik.handleChange}/>
          </CCol>
          <CCol>
            <CFormLabel>Comfirm Password</CFormLabel>
            <CFormInput type="password" placeholder="Re-Enter password" name='re-password' onChange={formik.handleChange}/>
          </CCol>
          {showPasswordError && (
            <CCol>
              <div style={{ color: 'red' }}>{passwordError}</div>
            </CCol>
          )}
          <CCol>
            <CFormLabel>Phone Number</CFormLabel>
            <CFormInput type="text" placeholder="Enter phone number" name='phoneNumber' onChange={formik.handleChange}/>
          </CCol>
          <CModalFooter>
            <CButton color="primary" className="px-4" type='submit' >Register</CButton>
            <CButton color="secondary" onClick={toggle}>Cancel</CButton>
          </CModalFooter>
        </CForm>
      </CModalBody>
      
    </CModal>
  );
};

export default RegistrationDialog;

