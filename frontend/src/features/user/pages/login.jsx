import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link }  from 'react-router-dom';
import { login } from '../userSlice';
import AuthLayout from '../components/authlayout'; 
import Notification from '../components/notification';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({
        username: '', 
        password: ''
    });

    const dispatch = useDispatch();
    const { status, error, user } = useSelector((state) => state.user);
    const [Message, setMessage] = useState(null);

        // จัดการ Redirect
    useEffect(() => {
        if (status === 'error' && error) {
            setMessage({ title: 'Login Failed!', text: error, type: 'error' });
            setTimeout(() => setMessage(null), 5000);
        }
        
        if (status === 'success' && user) {
            setMessage({ title: 'Welcome Back!', text: `Login Successful, ${user.username}`, type: 'success' });
            
            setTimeout(() => {
            }, 2000);
        }
    }, [status,error, user, navigator]);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // ส่ง username และ password ที่กรอกโดยตรง
        const loginData = {
            username: credentials.username, 
            password: credentials.password
        };
        
        if (!loginData.username || !loginData.password) return;

        dispatch(login(loginData));
    };

    return (
        <>
            <Notification 
                message={Message?.text} 
                title={Message?.title} 
                type={Message?.type} 
                onClose={() => setMessage(null)} 
            />

            <AuthLayout title="Login to your account">
                {status === 'loading' && <p className="text-blue-500 text-center mb-3">กำลังเข้าสู่ระบบ...</p>}
                {error && <p className="text-red-500 text-center mb-3">Error: {error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username" 
                            value={credentials.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-200 disabled:opacity-50"
                    >
                        Sign in
                    </button>
                </form>

                <div className="text-center mt-4 text-sm">
                <span className="text-gray-500 mr-1">Not registered?</span>
                <Link to="/register" className="text-red-600 font-semibold hover:text-red-700 transition duration-150">
                    Create an account
                </Link>
            </div>

            </AuthLayout>
        </>
    );
};

export default LoginPage;