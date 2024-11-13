import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
// manager
const auction = React.lazy(() => import('./views/Auction/AuctionManager'))
const user = React.lazy(() => import('./views/HumanResouce/UserManager'))
const role = React.lazy(() => import('./views/HumanResouce/RoleManager'))
const sales = React.lazy(() => import('./views/Minimart/Sale/SalesManager'))
const sales_return = React.lazy(() => import('./views/Minimart/SalesReturn'))
const product = React.lazy(() => import('./views/Product/ProductManager'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/auction', name: 'Đấu giá', element: auction },
  { path: '/user/manager', name: 'Nhân sự', element: user },
  { path: '/user/role', name: 'Phân quyền', element: role },
  { path: '/minimart/sales', name: 'Bán hàng', element: sales },
  { path: '/minimart/sale_return', name: 'Trả hàng', element: sales_return },
  { path: '/product', name: 'Sản phẩm', element: product },
]

export default routes
