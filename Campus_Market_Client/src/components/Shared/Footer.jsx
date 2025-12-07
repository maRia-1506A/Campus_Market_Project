import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-base-200 text-base-content mt-20">
            <div className="max-w-7xl mx-auto p-10 flex flex-col md:flex-row justify-between gap-10">
                <div className="md:w-1/3">
                    <h2 className="text-2xl font-bold">
                        Campus<span className="text-primary">Market</span>
                    </h2>
                    <p className="mt-2">
                        Your trusted student marketplace<br />
                        Buy, sell, and exchange with ease
                    </p>

                    <div className="flex gap-4 mt-4 text-2xl">
                        <FaFacebook className="cursor-pointer hover:text-primary" />
                        <FaTwitter className="cursor-pointer hover:text-primary" />
                        <FaInstagram className="cursor-pointer hover:text-primary" />
                        <FaLinkedin className="cursor-pointer hover:text-primary" />
                    </div>
                </div>

                <div>
                    <h3 className="footer-title font-bold">Quick Links</h3>
                    <ul className="flex flex-col gap-2 mt-2">
                        <Link to="/" className="link link-hover">Home</Link>
                        <Link to="/marketplace" className="link link-hover">Marketplace</Link>
                        <Link to="/sell" className="link link-hover">Sell Item</Link>
                        <Link to="/my-listings" className="link link-hover">My Listings</Link>
                    </ul>
                </div>

                <div>
                    <h3 className="footer-title font-bold">Support</h3>
                    <ul className="flex flex-col gap-2 mt-2">
                        <a className="link link-hover">Help Center</a>
                        <a className="link link-hover">Safety Tips</a>
                        <a className="link link-hover">Terms of Service</a>
                        <a className="link link-hover">Privacy Policy</a>
                    </ul>
                </div>

                <div>
                    <h3 className="footer-title font-bold">Contact</h3>
                    <ul className="flex flex-col gap-2 mt-2">
                        <a className="link link-hover">support@campusmarket.com</a>
                        <a className="link link-hover">+8809611838874</a>
                        <a className="link link-hover">Report an Issue</a>
                    </ul>
                </div>
            </div>

            <div className="text-center p-4 bg-base-300">
                <p>
                    © {new Date().getFullYear()} Campus Market — All Rights Reserved
                </p>
            </div>
        </footer>
    );
};

export default Footer;
