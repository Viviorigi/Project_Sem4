import React from 'react'
import Layout from "../comp/layouts/Layout";
import DashBoard from '../pages/DashBoard';
import Category from '../pages/category/Category';
import Product from '../pages/product/Product';
import Student from '../pages/customer/Customer';
import Order from '../pages/order/Order';
import Return from '../pages/return/Return';
import AuthGuard from '../guard/AuthGuard';
import RoleGuard from '../guard/roleGuard';
import About from '../pages/about/About';
import FeedBack from '../pages/feedback/FeedBack';
import PostCategory from '../pages/postCategory/PostCategory';
import Post from '../pages/post/Post'; 

// import Notification from '../pages/notification/Notification';

export const indexRouter: any = {
    path: '',
    element: (
        <AuthGuard><Layout /></AuthGuard>
    ),
    children: [
        { path: 'dashboard', element: <DashBoard /> },
        { path: 'category', element: <Category /> },
        { path: 'product', element: <Product /> },
        { path: 'customer', element: <Student /> },
        { path: 'order', element: <Order /> },
        { path: 'returnbook', element: <Return /> },
        { path: 'postCategory', element: <PostCategory /> },
        { path: 'post', element: <Post /> },     
        { path: 'about', element: <About /> },
        // { path: 'notification', element: <Notification /> },
        { path: 'feedback', element: <FeedBack /> }
    ],
};
