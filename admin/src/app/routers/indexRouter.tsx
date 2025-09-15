import React from 'react'
import Layout from "../comp/layouts/Layout";
import DashBoard from '../pages/DashBoard';
import Category from '../pages/category/Category';
import Book from '../pages/book/Book';
import Student from '../pages/student/Student';
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
        { path: 'dashboard', element: <RoleGuard role="ADMIN"> <DashBoard /> </RoleGuard> },
        { path: 'category', element: <RoleGuard role="ADMIN"><Category /></RoleGuard>  },
        { path: 'book', element: <RoleGuard role="ADMIN"><Book /> </RoleGuard> },
        { path: 'student', element: <RoleGuard role="ADMIN"><Student /> </RoleGuard> },
        { path: 'order', element: <RoleGuard role="ADMIN"><Order /></RoleGuard>  },
        { path: 'returnbook', element: <RoleGuard role="ADMIN"><Return /></RoleGuard> },
        { path: 'banner', element: <RoleGuard role="ADMIN"><Banner /></RoleGuard> },
        { path: 'contact', element: <RoleGuard role="ADMIN"><Contact /></RoleGuard> },
        { path: 'about', element: <RoleGuard role="ADMIN"><About /></RoleGuard> },
        { path: 'notification', element: <RoleGuard role="ADMIN"><Notification /></RoleGuard> },
        { path: 'feedback', element: <RoleGuard role="ADMIN"><FeedBack /></RoleGuard> }
    ],
};