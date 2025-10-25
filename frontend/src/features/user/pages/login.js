import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/actions/userActions.js';
import AuthLayout from '../components/authlayout.js';
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
        if (!credentials.username || !credentials.password) return;

        dispatch(login(credentials));
    };

    return (
        <AuthLayout title="เข้าสู่ระบบ (Login)">
            {status === 'loading' && <p style={{ color: 'blue' }}>กำลังเข้าสู่ระบบ...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" disabled={status === 'loading'}>
                    {status === 'loading' ? 'กำลังดำเนินการ...' : 'เข้าสู่ระบบ'}
                </button>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;