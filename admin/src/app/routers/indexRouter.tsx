import React from 'react'
import Layout from "../comp/layouts/Layout";
import DashBoard from '../pages/DashBoard';
import Category from '../pages/category/Category';
import Book from '../pages/book/Book';
import Student from '../pages/customer/Customer';
import Order from '../pages/order/Order';
import Return from '../pages/return/Return';
import AuthGuard from '../guard/AuthGuard';
import RoleGuard from '../guard/roleGuard';
import Banner from '../pages/banner/Banner';
import Contact from '../pages/contact/Contact';
import About from '../pages/about/About';
import FeedBack from '../pages/feedback/FeedBack';
import Notification from '../pages/notification/Notification';
export const indexRouter: any = {
    path: '',
    element: (
        <AuthGuard><Layout /> </AuthGuard>
    ),
    children: [
        { path: 'dashboard', element:  <DashBoard />  },
        { path: 'category', element: <Category />  },
        { path: 'book', element: <Book />  },
        { path: 'customer', element: <Student />  },
        { path: 'order', element: <Order />  },
        { path: 'returnbook', element: <Return /> },
        { path: 'banner', element: <Banner /> },
        { path: 'contact', element: <Contact /> },
        { path: 'about', element: <About /> },
        { path: 'notification', element: <Notification /> },
        { path: 'feedback', element: <FeedBack /> }
    ],
};