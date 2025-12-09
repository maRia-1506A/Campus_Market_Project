import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaGoogle, FaEnvelope, FaLock } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signIn, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const form = location.state?.form?.pathname || '/';

    //email login func
    const onSubmit = async (data) => {
        try {
            await signIn(data.email, data.password);

            Swal.fire({
                icon: "success",
                title: "Login Succeessful!",
                text: "Welcom back to Campus Market",
                showConfirmButton: false,
                timer: 1500
            });

            navigate(form, { replace: true });
        } catch (error) {
            console.error("Login error:", error);
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: error.message || "Invalid email or password"
            });
        }
    };

    // google sign in func 
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
                title: "Login Succeessful!",
                showConfirmButton: false,
                timer: 1500
            });

            navigate(form, { replace: true });
        } catch (error) {
            console.error("Google sign-in error:", error);
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: error.message || "Invalid email or password"
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 py-12 px-4">
            <Helmet>
                <title>Login - Campus Market</title>
            </Helmet>

            <div className="card w-full max-w-md shadow-2xl bg-base-100">
                <div className="card-body">
                    <h2 className="text-3xl font-bold text-center mb-6">Welcome Back!</h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Email Field */}
                        <div className="form-control">
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

                        {/* Password Field */}
                        <div className="form-control mt-4">
                            <label className="label">
                                <span className="label-text font-semibold">Password</span>
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-4 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="input input-bordered w-full pl-10"
                                    {...register('password', { required: 'Password is required' })}
                                />
                            </div>
                            {errors.password && (
                                <span className="text-error text-sm mt-1">{errors.password.message}</span>
                            )}
                            <label className="label">
                                <a href="#" className="label-text-alt link link-hover text-primary">
                                    Forgot password?
                                </a>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary">
                                Login
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="divider">OR</div>

                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleSignIn}
                        className="btn btn-outline w-full"
                    >
                        <FaGoogle className="mr-2" />
                        Continue with Google
                    </button>

                    {/* Register Link */}
                    <p className="text-center mt-4">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary font-semibold hover:underline">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;