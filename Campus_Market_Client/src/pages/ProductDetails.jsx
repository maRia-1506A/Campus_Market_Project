import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import Loading from '../components/Loading';
import Swal from 'sweetalert2';

const ProductDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const { data: product, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:5001/products/${id}`);


            if (user && user.email !== response.data.sellerEmail) {
                await axios.post(`http://localhost:5001/products/${id}/view`, {
                    userEmail: user.email
                });
            }

            return response.data;
        }
    });

    const handleContactSeller = () => {
        if (!user) {
            Swal.fire({
                icon: 'warning',
                title: 'Login Required',
                text: 'Please login to contact the seller',
                confirmButtonText: 'Go to Login'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }

        if (user.email === product.sellerEmail) {
            Swal.fire({
                icon: 'info',
                title: 'This is your listing',
                text: 'You cannot contact yourself'
            });
            return;
        }

        Swal.fire({
            icon: 'info',
            title: 'Coming Soon!',
            text: 'Chat feature is under development. Contact seller via email for now.'
        });
    };

    if (isLoading) return <Loading />;

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
                    <button onClick={() => navigate('/marketplace')} className="btn btn-primary">
                        Back to Marketplace
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 py-8">
            <Helmet>
                <title>{product.title} - Campus Market</title>
            </Helmet>

            <div className="max-w-7xl mt-20 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-base-100">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-auto max-h-[600px] object-contain mx-auto"
                        />


                        <div className="absolute top-6 left-6">
                            <span className="bg-violet-600 text-white px-6 py-2 rounded-full font-medium">
                                {product.category}
                            </span>
                        </div>


                        <div className="absolute top-6 right-6">
                            <span className="bg-emerald-500 text-white px-6 py-2 rounded-full font-medium">
                                Available for Exchange
                            </span>
                        </div>
                    </div>


                    <div className="space-y-6">
                        <div className="bg-base-100 rounded-lg shadow-xl p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="badge badge-primary">{product.category}</span>
                                <span className="badge badge-secondary">{product.condition}</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
                            <p className="text-4xl font-bold text-primary mb-4">${product.price}</p>
                            <p className="text-gray-600 mb-6">{product.description}</p>

                            <button
                                onClick={handleContactSeller}
                                className="btn btn-primary btn-block btn-lg"
                            >
                                <FaEnvelope className="mr-2" />
                                Contact Seller
                            </button>
                        </div>


                        <div className="bg-base-100 rounded-lg shadow-xl p-6">
                            <h3 className="text-xl font-bold mb-4">Seller Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <FaUser className="text-primary" />
                                    <span>{product.sellerName}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaEnvelope className="text-primary" />
                                    <span>{product.sellerEmail}</span>
                                </div>
                                {product.location && (
                                    <div className="flex items-center gap-3">
                                        <FaMapMarkerAlt className="text-primary" />
                                        <span>{product.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className="bg-base-100 rounded-lg shadow-xl p-6">
                            <h3 className="text-xl font-bold mb-4">Additional Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-600">Condition</p>
                                    <p className="font-semibold">{product.condition}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Category</p>
                                    <p className="font-semibold">{product.category}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Posted</p>
                                    <p className="font-semibold">
                                        {new Date(product.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Views</p>
                                    <p className="font-semibold">{product.views || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
