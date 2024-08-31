import { CButton, CCol, CForm, CFormCheck, CModal, CModalBody, CModalFooter, CModalHeader, CRow } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { SYSTEM_PERMISSION } from 'src/commons/PermissionCommons';
import roleApi from 'src/service/RoleService';

function PermissionModal(props) {
  let { type, setShowModal, data } = props;
  const roleID = data?.selectedRows[0].roleID;
  const [show, setShow] = useState(false);
  const [listPermissionByRole, setListPermissionByRole] = useState([]);
  const [loading, setLoading] = useState(true); 
  useEffect(() => {
    type !== null ? setShow(true) : setShow(false);
  }, [type]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listData = await roleApi.getPermissionByRole(roleID);
        setListPermissionByRole(listData);
        setLoading(false); // Kết thúc quá trình tải
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    if (roleID) {
      fetchData();
    }
  }, [roleID]);

  const [checkboxes, setCheckboxes] = useState([]);

  useEffect(() => {
    if (!loading) {
      const dataPermission = listPermissionByRole && SYSTEM_PERMISSION.flatMap(group => (
        group.Permission.map((permission) => ({
          id: permission.PermissionID,
          isChecked: listPermissionByRole.includes(permission.PermissionID),
          label: permission.PermissionName,
          groupLabel: group.Label,
        }))
      ));
      setCheckboxes(dataPermission);
    }
  }, [listPermissionByRole, loading]); 

  const handleChange = (id) => {
    setCheckboxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, isChecked: !checkbox.isChecked } : checkbox
      )
    );
  };
  const handleSave =async () => {
    const listData = [];
    checkboxes.forEach(item => {
      if (item.isChecked) {
        listData.push(item.id)
      }
    });
    const modelValue = {
      RoleID: roleID,
      PermissionID:listData
    }
    const resultUpdate = await roleApi.createRoleToPermission(modelValue);
    if (resultUpdate) {
      setShow(false)
    }
    console.log('re',resultUpdate)

   
  }

  return (
    <CModal
      onClose={() => { setShow(false); setShowModal(null) }}
      visible={show}
      className='modal-xl'
    >
      <CModalHeader closeButton>{type} người dùng</CModalHeader>
      <CModalBody className='p-4'>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <CForm>
            {!!checkboxes && Array.from(new Set(checkboxes.map(item => item.groupLabel))).map((groupLabel, index) => (
              <React.Fragment key={index}>
                <CRow className='fs-5 fw-semibold'>{groupLabel}</CRow>
                <CRow className='d-flex justify-content-start m-1'>
                  {checkboxes
                    .filter(item => item.groupLabel === groupLabel)
                    .map(item => (
                      <CCol md="4" className='mt-2' key={item.id}>
                        <CFormCheck
                          id={item.id}
                          label={item.label}
                          checked={item.isChecked}
                          onClick={() => handleChange(item.id)}
                        />
                      </CCol>
                    ))}
                </CRow>
              </React.Fragment>
            ))}
          </CForm>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={()=>handleSave()}>Lưu</CButton>{' '}
        <CButton
          color="secondary"
          onClick={() => { setShow(false); setShowModal(null) }}
        >Đóng</CButton>
      </CModalFooter>
    </CModal>
  );
}

export default PermissionModal;
