import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-base-200 text-base-content mt-20">
            <div className="footer p-10 max-w-7xl mx-auto">
                <aside>
                    <h2 className="text-2xl font-bold">Campus<span className="text-primary">Market</span></h2>
                    <p className="mt-2">
                        Your trusted student marketplace<br />
                        Buy, sell, and exchange with ease
                    </p>
                    <div className="flex gap-4 mt-4">
                        <a href="#" className="text-2xl hover:text-primary transition"><FaFacebook /></a>
                        <a href="#" className="text-2xl hover:text-primary transition"><FaTwitter /></a>
                        <a href="#" className="text-2xl hover:text-primary transition"><FaInstagram /></a>
                        <a href="#" className="text-2xl hover:text-primary transition"><FaLinkedin /></a>
                    </div>
                </aside>
                <nav>
                    <header className="footer-title">Quick Links</header>
                    <Link to="/" className="link link-hover">Home</Link>
                    <Link to="/marketplace" className="link link-hover">Marketplace</Link>
                    <Link to="/sell" className="link link-hover">Sell Item</Link>
                    <Link to="/my-listings" className="link link-hover">My Listings</Link>
                </nav>
                <nav>
                    <header className="footer-title">Support</header>
                    <a className="link link-hover">Help Center</a>
                    <a className="link link-hover">Safety Tips</a>
                    <a className="link link-hover">Terms of Service</a>
                    <a className="link link-hover">Privacy Policy</a>
                </nav>
                <nav>
                    <header className="footer-title">Contact</header>
                    <a className="link link-hover">support@campusmarket.com</a>
                    <a className="link link-hover">+1 (555) 123-4567</a>
                    <a className="link link-hover">Report an Issue</a>
                </nav>
            </div>
            <div className="footer footer-center p-4 bg-base-300 text-base-content">
                <aside>
                    <p>Copyright © {new Date().getFullYear()} - All rights reserved by Campus Market</p>
                </aside>
            </div>
        </footer>
    );
};

export default Footer;
