import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import './scss/style.scss'
import Cookies from 'js-cookie';
import CommonToastContainer from './views/Nofitication/ToastNoti';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      loadingAuth: true,
    };
  }

  componentDidMount() {
    this.checkAuthentication();
  }

  checkAuthentication = () => {
    // const accessToken = Cookies.get('accessToken');  
    // const userId = Cookies.get('userId');        

    const accessToken = localStorage.getItem('accessToken');  // Lấy accessToken từ localStorage
    const userId = localStorage.getItem('userId');  

    console.log('Access Token:', accessToken);
    console.log('User ID:', userId);

    const isAuthenticated = !!(accessToken && userId); // Xác định giá trị true/false
    this.setState({ isAuthenticated, loadingAuth: false }); 
  }
   

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isAuthenticated !== this.state.isAuthenticated) {
      console.log('Authentication state changed:', this.state.isAuthenticated);
      this.checkAuthentication();  
    }
  }
  

  render() {
    const { isAuthenticated, loadingAuth } = this.state; 

    if (loadingAuth) {
      return <div>Loading...</div>;
    }
    return (
      <HashRouter>
        <Suspense fallback={loading}>
          <CommonToastContainer />
          <Routes>
            
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />

            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />

            <Route
              path="*"
              name="Home"
              element={isAuthenticated ? <DefaultLayout /> : <Navigate to="/login" />}
            />
          </Routes>
        </Suspense>
      </HashRouter>
    );
  }
}

export default App;

