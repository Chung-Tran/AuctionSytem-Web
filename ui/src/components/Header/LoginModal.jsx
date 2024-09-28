import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'react-tabs/style/react-tabs.css';
import { XIcon, Eye, EyeOff } from 'lucide-react';

const InputField = ({ label, name, type = 'text', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <Field
          id={name}
          name={name}
          type={inputType}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-0"
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
          </button>
        )}
      </div>
      <ErrorMessage name={name} component="div" className="mt-1 text-sm text-red-600" />
    </div>
  );
};

const Button = ({ children, ...props }) => (
  <button
    {...props}
    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    {children}
  </button>
);

const LoginModal = ({ isOpen, setIsOpen }) => {
  const [showOtp, setShowOtp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  if (!isOpen) return null;

  const signupSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm your password'),
    phone: Yup.string().matches(/^[0-9]+$/, 'Phone number is not valid').required('Phone number is required'),
    otp: Yup.string().required('OTP is required'),
    agreement: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
  });

  const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    otp: showOtp ? Yup.string().required('OTP is required') : Yup.string(),
  });

  return (
    <div className="fixed inset-0 mt-auto flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          onClick={() => setIsOpen(false)}
        >
          <XIcon className="h-6 w-6" />
        </button>

        <Tabs>
          <TabList className="flex space-x-4 mb-6 border-b border-gray-200">
            <Tab
              selectedClassName="border-b-2 border-blue-600 text-blue-600"
              className="px-4 py-2 cursor-pointer font-medium text-gray-600 focus:outline-none"
            >
              {isForgotPassword ? 'Forgot Password' : 'Login'}
            </Tab>
            <Tab
              selectedClassName="border-b-2 border-blue-600 text-blue-600"
              className="px-4 py-2 cursor-pointer font-medium text-gray-600 focus:outline-none"
            >
              Sign Up
            </Tab>
          </TabList>

          <TabPanel>
            {!isForgotPassword ? (
              <Formik
                initialValues={{ login: '', password: '' }}
                onSubmit={(values) => console.log(values)}
              >
                <Form className="space-y-4">
                  <InputField label="Email or Phone" name="login" />
                  <InputField label="Password" name="password" type="password" />
                  <Button type="submit">Login</Button>
                </Form>
              </Formik>
            ) : (
              <Formik
                initialValues={{ email: '', otp: '' }}
                validationSchema={forgotPasswordSchema}
                onSubmit={(values) => {
                  if (!showOtp) {
                    setShowOtp(true);
                  } else {
                    console.log(values);
                  }
                }}
              >
                <Form className="space-y-4">
                  <InputField label="Email" name="email" type="email" />
                  {showOtp && <InputField label="OTP" name="otp" />}
                  <Button type="submit">{showOtp ? 'Verify OTP' : 'Send OTP'}</Button>
                </Form>
              </Formik>
            )}
            <div className="text-sm mt-4 text-center">
              <span
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => setIsForgotPassword(!isForgotPassword)}
              >
                {isForgotPassword ? 'Back to Login' : 'Forgot Password?'}
              </span>
            </div>
          </TabPanel>

          <TabPanel>
            <Formik
              initialValues={{
                fullName: '',
                email: '',
                password: '',
                confirmPassword: '',
                phone: '',
                otp: '',
                agreement: false,
              }}
              validationSchema={signupSchema}
              onSubmit={(values) => console.log(values)}
            >
              {({ values, setFieldValue }) => (
                <Form className="space-y-4">
                  <InputField label="Full Name" name="fullName" />
                  <div className="relative">
                    <InputField label="Email" name="email" type="email" />
                    <button
                      type="button"
                      className="absolute right-2 top-8 bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 text-sm"
                      onClick={() => {
                        // Logic to send OTP
                        console.log('Sending OTP to', values.email);
                      }}
                    >
                      Send OTP
                    </button>
                  </div>
                  <InputField label="Phone Number" name="phone" />
                  <InputField label="OTP" name="otp" />
                  <InputField label="Password" name="password" type="password" />
                  <InputField label="Confirm Password" name="confirmPassword" type="password" />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="agreement"
                      name="agreement"
                      checked={values.agreement}
                      onChange={() => setFieldValue('agreement', !values.agreement)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="agreement" className="ml-2 block text-sm text-gray-900">
                      I agree to the terms and conditions
                    </label>
                  </div>
                  <ErrorMessage name="agreement" component="div" className="mt-1 text-sm text-red-600" />
                  <Button type="submit">Sign Up</Button>
                </Form>
              )}
            </Formik>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default LoginModal;