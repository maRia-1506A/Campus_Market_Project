import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Marketplace from '../pages/Marketplace';
import ProductDetails from '../pages/ProductDetails';
import SellItem from '../pages/SellItem';
import MyListings from '../pages/MyListings';
import Profile from '../pages/Profile';

import PrivateRoute from './PrivateRoute';
import ErrorPage from '../pages/ErrorPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            },
            {
                path: '/marketplace',
                element: <Marketplace />
            },
            {
                path: '/product/:id',
                element: <ProductDetails />
            },
            {
                path: '/sell',
                element: (
                    <PrivateRoute>
                        <SellItem />
                    </PrivateRoute>
                )
            },
            {
                path: '/my-listings',
                element: (
                    <PrivateRoute>
                        <MyListings />
                    </PrivateRoute>
                )
            },
            {
                path: '/profile',
                element: (
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                )
            }

        ]
    }
]);
export default router;