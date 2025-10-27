import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../userSlice';
import AuthLayout from '../components/authlayout'; 
// import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({
        username: '', 
        password: ''
    });

    const dispatch = useDispatch();
    const { status, error, user } = useSelector((state) => state.user);
    // const navigate = useNavigate();

    useEffect(() => {
        if (status === 'success' && user) {
            alert(`ยินดีต้อนรับ, ${user.name || user.username}!`);
            // navigate('/home'); 
        }
    }, [status, user]);

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
        <AuthLayout title="Login to your account">
            {status === 'loading' && <p className="text-blue-500 text-center mb-3">กำลังเข้าสู่ระบบ...</p>}
            {error && <p className="text-red-500 text-center mb-3">Error: {error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    {/* ใช้ name="username" และ Placeholder "Username" */}
                    <input
                        type="text"
                        name="username"
                        placeholder="Username" 
                        value={credentials.username}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                        className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-200 disabled:opacity-50"
                >
                    Sign in with username
                </button>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;