import { Link, NavLink } from 'react-router-dom';
import { FaShoppingBag, FaPlus, FaEnvelope, FaUser } from "react-icons/fa";
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';

const Navbar = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, logout!"
        }).then((result) => {
            if (result.isConfirmed) {
                logout().then(() => {
                    Swal.fire({
                        icon: "success",
                        text: "Logged Out successfully!",
                        timer: 1500,
                        showConfirmButton: false
                    });
                }).catch(error => {
                    console.error(error);
                });
            }
        });
    }
    const navLinks = (
        <>
            <li><NavLink to="/" className={({ isActive }) =>
                isActive ? 'text-primary font-bold' : ''}>Home</NavLink></li>
            <li><NavLink to="/marketplace" className={({ isActive }) =>
                isActive ? 'text-primary font-bold' : ''}>MarketPlace</NavLink></li>

            {user && (
                <>
                    <li><NavLink to="/sell" className={({ isActive }) =>
                        isActive ? 'text-primary font-bold' : ''}><FaPlus>Sell Item</FaPlus></NavLink></li>
                    <li><NavLink to="/my-listings" className={({ isActive }) =>
                        isActive ? 'text-primary font-bold' : ''}>My Listings</NavLink></li>
                    <li><NavLink to="/messages" className={({ isActive }) =>
                        isActive ? 'text-primary font-bold' : ''}><FaEnvelope className='inline mr-1'>Messages</FaEnvelope></NavLink></li>
                </>
            )}
        </>
    );

    return (
        <div className="navbar bg-base-100 shadow-lg px-4 lg:px-8">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {navLinks}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost normal-case text-xl">
                    <FaShoppingBag className="text-primary mr-2" />
                    <span className="font-bold">Campus<span className="text-primary">Market</span></span>
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2">
                    {navLinks}
                </ul>
            </div>
            <div className="navbar-end gap-2">
                {user ? (
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img src={user.photoURL || 'https://via.placeholder.com/150'} alt="User" />
                            </div>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li className="menu-title">
                                <span>{user.displayName || 'User'}</span>
                            </li>
                            <li><Link to="/profile"><FaUser className="inline mr-1" />Profile</Link></li>
                            <li><a onClick={handleLogout}>Logout</a></li>
                        </ul>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-ghost">Login</Link>
                        <Link to="/register" className="btn btn-primary">Register</Link>
                    </>
                )}
            </div>
        </div>
    )
};
