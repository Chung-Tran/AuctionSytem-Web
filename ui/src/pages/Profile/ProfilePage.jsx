'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Upload, message, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { AppContext } from '../../AppContext';
import ProfileService from '../../services/ProfileService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { openNotify } from '../../commons/MethodsCommons';

const ProfilePage = () => {
  const { user } = useContext(AppContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { userId } = user;
        const fetchedData = await ProfileService.getById(userId);
        setUserData(fetchedData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
  
    if (user && user.userId) {
      fetchUserData();
    }
  }, [user?.userId]);

  const [fileList, setFileList] = useState([]);

  // Yup validation schema
  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string().required('Phone Number is required'),
    username: Yup.string().required('Username is required'),
    address: Yup.string().required('Address is required'),
    idNumber: Yup.string().required('ID Number is required'),
  });

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const columns = [
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: 'Auction Date',
      dataIndex: 'auctionDate',
      key: 'auctionDate',
    },
    {
      title: 'Winning Bid',
      dataIndex: 'winningBid',
      key: 'winningBid',
      render: (text) => `$${text.toFixed(2)}`,
    },
  ];

  const data = [
    {
      key: '1',
      itemName: 'Antique Vase',
      auctionDate: '2023-09-15',
      winningBid: 1500.0,
    },
    {
      key: '2',
      itemName: 'Vintage Watch',
      auctionDate: '2023-09-20',
      winningBid: 2300.5,
    },
    {
      key: '3',
      itemName: 'Rare Coin Collection',
      auctionDate: '2023-09-25',
      winningBid: 5000.0,
    },
  ];
  console.log(userData)
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit User Profile</h1>

      <Formik
        enableReinitialize={true} 
        initialValues={{
          fullName: userData ? userData.fullName : '',
          email: userData ? userData.email : '',
          phone: userData ? userData.phoneNumber : '',
          username: userData ? userData.username : '',
          address: userData ? userData.address : '',
          idNumber: userData ? userData.idNumber : '',
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const updated = await ProfileService.updateProfile(values);
            if (updated) {
              openNotify('success', 'Update information successfully');
            } else {
              openNotify('error', 'Update information failed. Try again!');
            }
          } catch (error) {
            openNotify('error', 'Update information failed. Try again!');
            console.error("Update profile error:", error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            {/* Upload Avatar */}
            <div className="mb-6">
              <label className="block text-lg font-bold mb-2">Upload Avatar</label>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleUploadChange}
                maxCount={1}
              >
                {fileList.length < 1 && (
                  <div>
                    <UploadOutlined style={{ fontSize: '24px' }} />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-lg font-bold">Full Name</label>
                <Field
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <ErrorMessage name="fullName" component="div" className="text-red-600" />
              </div>

              <div>
                <label className="block text-lg font-bold">Email</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <ErrorMessage name="email" component="div" className="text-red-600" />
              </div>

              <div>
                <label className="block text-lg font-bold">Phone Number</label>
                <Field
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <ErrorMessage name="phone" component="div" className="text-red-600" />
              </div>

              <div>
                <label className="block text-lg font-bold">Username</label>
                <Field
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <ErrorMessage name="username" component="div" className="text-red-600" />
              </div>

              <div>
                <label className="block text-lg font-bold">Address</label>
                <Field
                  as="textarea"
                  name="address"
                  placeholder="Address"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <ErrorMessage name="address" component="div" className="text-red-600" />
              </div>

              <div>
                <label className="block text-lg font-bold">ID Number</label>
                <Field
                  type="text"
                  name="idNumber"
                  placeholder="ID Number"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <ErrorMessage name="idNumber" component="div" className="text-red-600" />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Profile'}
            </button>
          </Form>
        )}
      </Formik>

      {/* Auctioned Items Table */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Successfully Auctioned Items</h2>
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
    </div>
  );
};

export default ProfilePage;
