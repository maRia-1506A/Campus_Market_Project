import { Link, NavLink } from "react-router-dom";
import { FaShoppingBag, FaPlus, FaUser } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const Navbar = () => {
  const { user, logOut } = useAuth();

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        logOut()
          .then(() => {
            Swal.fire({
              icon: "success",
              text: "Logged out!",
              timer: 1500,
              showConfirmButton: false,
            });
          })
          .catch(console.error);
      }
    });
  };

  const activeClass = ({ isActive }) =>
    isActive ? "text-primary font-bold" : "";

  return (
    <div className="navbar bg-base-100 shadow-lg px-4 lg:px-8 fixed top-0 left-0 w-full z-50">

      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>

          <ul tabIndex={0} className="menu dropdown-content bg-base-100 p-2 mt-3 shadow rounded-box w-52 z-50">
            <li><NavLink to="/" className={activeClass}>Home</NavLink></li>
            <li><NavLink to="/marketplace" className={activeClass}>Marketplace</NavLink></li>

            {user && (
              <>
                <li><NavLink to="/sell" className={activeClass}><FaPlus className="inline mr-1" />Sell</NavLink></li>
                <li><NavLink to="/my-listings" className={activeClass}>My Listings</NavLink></li>
              </>
            )}
          </ul>
        </div>

        <Link to="/" className="btn btn-ghost text-xl font-bold">
          <FaShoppingBag className="text-primary mr-2" />
          Campus Market
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-4">
          <li><NavLink to="/" className={activeClass}>Home</NavLink></li>
          <li><NavLink to="/marketplace" className={activeClass}>Marketplace</NavLink></li>

          {user && (
            <>
              <li><NavLink to="/sell" className={activeClass}><FaPlus className="inline mr-1" />Sell</NavLink></li>
              <li><NavLink to="/my-listings" className={activeClass}>My Listings</NavLink></li>
            </>
          )}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={user.photoURL || "https://via.placeholder.com/150"} alt="User" />
              </div>
            </label>

            <ul tabIndex={0} className="menu dropdown-content bg-base-100 p-2 shadow rounded-box w-52 mt-3 z-50">
              <li className="menu-title">
                <span>{user.displayName || "User"}</span>
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
  );
};

export default Navbar;
