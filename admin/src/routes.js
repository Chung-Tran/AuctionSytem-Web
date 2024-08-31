import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
// manager
const user = React.lazy(() => import('./views/HumanResouce/UserManager'))
const role = React.lazy(() => import('./views/HumanResouce/RoleManager'))
const sales = React.lazy(() => import('./views/Minimart/Sale/SalesManager'))
const sales_return = React.lazy(() => import('./views/Minimart/SalesReturn'))
const product = React.lazy(() => import('./views/Product/ProductManager'));
const inventory_import = React.lazy(() => import('./views/Inventory Import/ImportManager'));
const inventory_check = React.lazy(() => import('./views/Inventory Check/CheckManager'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/user/manager', name: 'Nhân sự', element: user },
  { path: '/user/role', name: 'Phân quyền', element: role },
  { path: '/minimart/sales', name: 'Bán hàng', element: sales },
  { path: '/minimart/sale_return', name: 'Trả hàng', element: sales_return },
  { path: '/product', name: 'Sản phẩm', element: product },
  { path: '/inventory_import', name: 'Sản phẩm', element: inventory_import },
  { path: '/inventory_check', name: 'Sản phẩm', element: inventory_check },
]

export default routes
