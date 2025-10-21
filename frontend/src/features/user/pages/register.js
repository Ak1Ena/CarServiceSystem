import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/actions/userActions';
import UserForm from '../components/userform';
import AuthContainer from '../components/authlayout';
// import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '', email: '', password: '',
        name: '', phone: '', address: ''
    });

    const dispatch = useDispatch();
    const { status, error, isRegistered } = useSelector((state) => state.user);
    // const navigate = useNavigate();

    useEffect(() => {
        if (isRegistered && status === 'idle') {
            alert('ลงทะเบียนสำเร็จ! คุณสามารถเข้าสู่ระบบได้แล้ว');
            // navigate('/login'); 
        }
    }, [isRegistered, status]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(register(formData));
    };

    return (
        <AuthContainer title="สมัครสมาชิก (Register)">
            {status === 'loading' && <p style={{ color: 'blue' }}>กำลังลงทะเบียน...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            <UserForm
                formData={formData}
                handleChange={handleChange}
                onSubmit={handleSubmit}
                buttonText="ลงทะเบียน"
                isRegister={true}
            />
        </AuthContainer>
    );
};

export default RegisterPage;