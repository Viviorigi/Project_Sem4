import { Suspense } from 'react';
import './App.css';
import './assets/css/unicons.css';
import { Navigate, useRoutes } from 'react-router-dom';
import { indexRouter } from './app/routers/indexRouter';
import NotPermission from './app/pages/NotPermission';
import NotFound from './app/pages/NotFound';
import Login from './app/pages/authentication/Login';
import ForgotPassword from './app/pages/authentication/ForgotPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assets/css/spinner.css';
export const spinner = (
  <div className="progress-spinner text-center">
    <div className="swm-loader"></div>
  </div>
);
function App() {
  let router = useRoutes([
    { path: 'not-permission', element: <NotPermission /> }, //403
    { path: '/', element: <Navigate to="dashboard" replace /> },
    indexRouter,
    { path: '*', element: <NotFound /> } ,//404
    { path: 'login', element: <Login /> },
    { path: 'forgot-password', element: <ForgotPassword /> }
  ]);
  
  return (
    
    <div className="App">
      <ToastContainer></ToastContainer>
      <Suspense fallback={spinner}>{router}</Suspense>
    </div>

  );
}

export default App;
