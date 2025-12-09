import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaGoogle, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

const Register = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const { createUser, updateUserProfile, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const result = await createUser(data.email, data.password);

            await updateUserProfile(data.name, '');

            const userInfo = {
                name: data.name,
                email: result.user.email,
                avatar: result.user.photoURL,
                phone: '',
                university: '',
                status: 'offline',
                createdAt: new Date()
            };

            const response = await axios.post('http://localhost:5001/users', userInfo);

            if (response.data.insertedId || response.data.message === 'user already exists') {
                Swal.fire({
                    icon: "success",
                    title: "Registration Succeessful!",
                    text: "Welcom to Campus Market",
                    timer: 2000
                });
                navigate('/');
            }
        } catch (error) {
            console.error("Google sign-in error:", error);
            Swal.fire({
                icon: "error",
                title: "Registration Failed",
                text: error.message || "Invalid email or password"
            });
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithGoogle();
            const userInfo = {
                name: result.user.displayName,
                email: result.user.email,
                avatar: result.user.photoURL,
                phone: '',
                university: '',
                status: 'online',
                createdAt: new Date()
            };
            await axios.post('http://localhost:5001/users', userInfo);
            Swal.fire({
                icon: "success",
                title: "Login Successful!",
                showConfirmButton: false,
                timer: 1500
            });
            navigate('/');
        } catch (error) {
            console.error("Google sign-in error:", error);
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: error.message
            });
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 py-12 px-4">
            <Helmet>
                <title>Register - Campus Market</title>
            </Helmet>

            <div className="card w-full max-w-md shadow-2xl bg-base-100">
                <div className="card-body">
                    <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Full Name</span>
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="input input-bordered w-full pl-10"
                                    {...register('name', { required: 'Name is required' })}
                                />
                            </div>
                            {errors.name && (
                                <span className="text-error text-sm mt-1">{errors.name.message}</span>
                            )}
                        </div>


                        <div className="form-control mt-4">
                            <label className="label">
                                <span className="label-text font-semibold">Email</span>
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="your.email@university.edu"
                                    className="input input-bordered w-full pl-10"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                />
                            </div>
                            {errors.email && (
                                <span className="text-error text-sm mt-1">{errors.email.message}</span>
                            )}
                        </div>


                        <div className="form-control mt-4">
                            <label className="label">
                                <span className="label-text font-semibold">Password</span>
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-4 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="Create a strong password"
                                    className="input input-bordered w-full pl-10"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        },
                                        pattern: {
                                            value: /(?=.*[A-Z])(?=.*[a-z])/,
                                            message: 'Password must have uppercase and lowercase letters'
                                        }
                                    })}
                                />
                            </div>
                            {errors.password && (
                                <span className="text-error text-sm mt-1">{errors.password.message}</span>
                            )}
                        </div>


                        <div className="form-control mt-4">
                            <label className="label">
                                <span className="label-text font-semibold">Confirm Password</span>
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-4 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="Confirm your password"
                                    className="input input-bordered w-full pl-10"
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: value =>
                                            value === watch('password') || 'Passwords do not match'
                                    })}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <span className="text-error text-sm mt-1">{errors.confirmPassword.message}</span>
                            )}
                        </div>


                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary">
                                Register
                            </button>
                        </div>
                    </form>


                    <div className="divider">OR</div>


                    <button
                        onClick={handleGoogleSignIn}
                        className="btn btn-outline w-full"
                    >
                        <FaGoogle className="mr-2" />
                        Continue with Google
                    </button>


                    <p className="text-center mt-4">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-semibold hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;