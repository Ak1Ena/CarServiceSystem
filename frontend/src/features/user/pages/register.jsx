import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../userSlice';
import AuthLayout from '../components/authlayout'; 
import { useNavigate } from 'react-router-dom';
import Notification from '../components/notification';

// Step 1: Create your ID
const Step1ID = ({ formData, handleChange, nextStep }) => (
    <div className="space-y-4">
        <div className="flex space-x-4">
            <input 
                type="text" 
                name="firstName" 
                placeholder="First name" 
                value={formData.firstName} 
                onChange={handleChange} 
                required 
                className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <input 
                type="text" 
                name="lastName" 
                placeholder="Last name" 
                value={formData.lastName} 
                onChange={handleChange} 
                required 
                className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" 
            />
        </div>
        
        <input 
            type="text" 
            name="username" 
            placeholder="Username (for login)" 
            value={formData.username} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" 
        />
        
        <input 
            type="tel" 
            name="phone" 
            placeholder="Phone Number" 
            value={formData.phone} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
        <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
        <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" 
        />
        <button onClick={nextStep} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-200">Continue</button>
    </div>
);

// Step 2: Setup Address
const Step2Address = ({ formData, handleChange, prevStep, nextStep }) => (
    <div className="space-y-4">
        <div className="flex space-x-4">
           
            <input 
                type="text" 
                name="addressHouseNo" 
                placeholder="เลขที่" 
                value={formData.addressHouseNo} 
                onChange={handleChange} 
                required 
                className="w-1/2 px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
            />
            
            <input 
                type="text" 
                name="addressProvince" 
                placeholder="จังหวัด" 
                value={formData.addressProvince} 
                onChange={handleChange} 
                required 
                className="w-1/2 px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
            />
        </div>

        <div className="flex space-x-4">

            <input 
                type="text" 
                name="addressDistrict" 
                placeholder="อำเภอ" 
                value={formData.addressDistrict} 
                onChange={handleChange} 
                required 
                className="w-1/2 px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
            />
            
            <input 
                type="text" 
                name="addressSubDistrict" 
                placeholder="ตำบล" 
                value={formData.addressSubDistrict} 
                onChange={handleChange} 
                required 
                className="w-1/2 px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
            />
        </div>
        
        <input 
            type="text" 
            name="addressZipCode" 
            placeholder="รหัสไปรษณีย์" 
            value={formData.addressZipCode} 
            onChange={handleChange} 
            required 
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
        />

        <textarea 
            name="addressDetail" 
            placeholder="ข้อมูลเพิ่มเติม (เช่น ชื่ออาคาร หรือรายละเอียดซอย)" 
            value={formData.addressDetail} 
            onChange={handleChange} 
            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" 
            rows="3">
        </textarea>
        
        <div className="flex space-x-4 mt-6">
            <button onClick={prevStep} className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition duration-200">Back</button>
            <button onClick={nextStep} className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-200">Continue</button>
        </div>
    </div>
);


// Step 3: Role Choosing
const Step3Role = ({ formData, handleChange, prevStep, handleSubmit, status }) => (
    <div className="space-y-6">
      
        <div className="flex flex-col space-y-4 items-center">
            
            <label className={`w-full max-w-xs p-4 border-2 rounded-lg cursor-pointer transition duration-200 
                ${formData.userRole === 'RENTER' ? 'border-red-500' : 'border-gray-200'} 
                flex items-center justify-center`}>
                <input type="radio" name="userRole" value="RENTER" checked={formData.userRole === 'RENTER'} onChange={handleChange} className="hidden" required />
                <p className="font-semibold text-center w-full">Renter</p>
            </label>
            
            <label className={`w-full max-w-xs p-4 border-2 rounded-lg cursor-pointer transition duration-200 
                ${formData.userRole === 'OWNER' ? 'border-red-500' : 'border-gray-200'} 
                flex items-center justify-center`}>
                <input type="radio" name="userRole" value="OWNER" checked={formData.userRole === 'OWNER'} onChange={handleChange} className="hidden" required />
                <p className="font-semibold text-center w-full">Owner</p>
            </label>
            
        </div>
        
        <div className="flex space-x-4 mt-6">
            <button onClick={prevStep} className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition duration-200">Back</button>
            <button 
                onClick={handleSubmit} 
                disabled={status === 'loading'}
                className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-200 disabled:opacity-50"
            >
                {status === 'loading' ? 'Registering...' : 'Register'}
            </button>
        </div>
    </div>
);


// === Register Page Main Component ===
const RegisterPage = () => {
    const [step, setStep] = useState(1);
    const [Message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        // Step 1 Fields
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        username: '', 
        phone: '',
        
        // Step 2 Fields
        addressHouseNo: '',
        addressProvince: '',
        addressDistrict: '',
        addressSubDistrict: '',
        addressZipCode: '',
        addressDetail: '',

        // Step 3 Field
        userRole: 'RENTER',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error, isRegistered } = useSelector((state) => state.user);

    // จัดการ Redirect
    useEffect(() => {
        if (status === 'error' && error) {
            setMessage({ title: 'Registration Failed!', text: error, type: 'error' });
            setTimeout(() => setMessage(null), 5000);
        }
        
        if (isRegistered) {
            setMessage({ title: 'Success!', text: "Registration Successful!", type: 'success' });

            // Redirect หลังแจ้งเตือน
            setTimeout(() => {
                navigate('/users/login');
            }, 2000); 
        }
    }, [status, error, isRegistered, navigate]); // ตรวจสอบสถานะ
    
    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 1. รวมข้อมูล (Mapping to UserDto/Entity)
        const userDto = {
            // Backend fields 
            username: formData.username,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            
            name: `${formData.firstName} ${formData.lastName}`,
            address: `เลขที่ ${formData.addressHouseNo}, ต.${formData.addressSubDistrict}, อ.${formData.addressDistrict}, จ.${formData.addressProvince} ${formData.addressZipCode}. ${formData.addressDetail}`,
            userRole: formData.userRole,
        };
        
        // 2. Dispatch Action
        dispatch(register(userDto));
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1ID formData={formData} handleChange={handleChange} nextStep={nextStep} />;
            case 2:
                return <Step2Address formData={formData} handleChange={handleChange} prevStep={prevStep} nextStep={nextStep} />;
            case 3:
                return <Step3Role formData={formData} handleChange={handleChange} prevStep={prevStep} handleSubmit={handleSubmit} status={status} />;
            default:
                return null;
        }
    };

    let title = "";
    if (step === 1) title = "Create your ID";
    else if (step === 2) title = "Setup Address";
    else if (step === 3) title = "What your role?";

    return (
        <>
            <Notification 
                message={Message?.text} 
                title={Message?.title} 
                type={Message?.type} 
                onClose={() => setMessage(null)} 
            />

            <AuthLayout title={title}>
                {renderStep()}
            </AuthLayout>
        </>
    );
};

export default RegisterPage;