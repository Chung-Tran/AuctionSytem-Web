import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilWatch,
  cibProcesswire,
  cilUser,
  cilStorage,
  cibAppStore
  
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const permissionValue = JSON.parse(localStorage.getItem('permission')) || [];

const hasPermission = (permission) => permissionValue.includes(permission);

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Bán hàng',
  },
  {
    component: CNavItem,
    name: 'Bán hàng',
    to: '/minimart/sales',
    icon: <CIcon icon={cibAppStore} customClassName="nav-icon" />,

  },
  {
    component: CNavItem,
    name: 'Trả hàng',
    to: '/minimart/sale_return',
    icon: <CIcon icon={cibAppStore} customClassName="nav-icon" />,
    disabled: hasPermission([22,23,24,25]),
  },
  {
    component: CNavTitle,
    name: 'Nhân sự',
  },
  {
    component: CNavItem,
    name: 'Quản lí người dùng',
    to: '/user/manager',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    disabled: hasPermission([1,2,3,4]),
  },
  {
    component: CNavItem,
    name: 'Phân quyền',
    to: '/user/role',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    disabled: hasPermission([5,6,7,8]),
  },
  {
    component: CNavTitle,
    name: 'Sản phẩm',
  },
  {
    component: CNavGroup,
    name: 'Quản lí sản phẩm',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Sản phẩm',
        to: '/product',
      },
    ],
    disabled: hasPermission([10,11,12,13]),
  },
  {
    component: CNavGroup,
    name: 'Quản lí thông số',
    to: '/buttons',
    icon: <CIcon icon={cibProcesswire} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Hãng',
        to: '/branch',
      },
      {
        component: CNavItem,
        name: 'Chất liệu dây',
        to: '/strap_material',
      },
      {
        component: CNavItem,
        name: 'Kích thước mặt số',
        to: '/dialsize',
      },
      {
        component: CNavItem,
        name: 'Mức chống nước',
        to: '/water_resistance',
      },
      {
        component: CNavItem,
        name: 'Hình dạng mặt số',
        to: '/dialshape',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Kho',
  },
  {
    component: CNavItem,
    name: 'Nhập kho',
    to: '/inventory_import',
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Kiểm kho',
  //   to: '/inventory_check',
  //   icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
  // },
  {
    component: CNavTitle,
    name: 'Khuyến mãi',
  },
  {
    component: CNavItem,
    name: 'Voucher',
    to: '/promotion',
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'CRM',
  },
  {
    component: CNavItem,
    name: 'Đối tác',
    to: '/partner',
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavGroup,
  //   name: 'Pages',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Login',
  //       to: '/login',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Register',
  //       to: '/register',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 404',
  //       to: '/404',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 500',
  //       to: '/500',
  //     },
  //   ],
  // },
]

export default _nav
