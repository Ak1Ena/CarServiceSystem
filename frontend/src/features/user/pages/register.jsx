import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../userSlice';
import AuthLayout from '../components/authlayout'; 
// import { useNavigate } from 'react-router-dom';


// Step 1: Create your ID (First Name, Last Name, Email, Password, PHONE)
const Step1ID = ({ formData, handleChange, nextStep }) => (
    <div className="space-y-4">
        <div className="flex space-x-4">
            <input type="text" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} required className="w-1/2 px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
            <input type="text" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} required className="w-1/2 px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        
        <input type="text" name="username" placeholder="Username (for login)" value={formData.username} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
        
        <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
        <button onClick={nextStep} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-200">Continue</button>
    </div>
);

// Step 2: Setup Address
const Step2Address = ({ formData, handleChange, prevStep, nextStep }) => (
    <div className="space-y-4">
        <div className="flex space-x-4">
            <input type="text" name="addressHouseNo" placeholder="บ้านเลขที่" value={formData.addressHouseNo} onChange={handleChange} required className="w-1/2 px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
            <input type="text" name="addressProvince" placeholder="จังหวัด" value={formData.addressProvince} onChange={handleChange} required className="w-1/2 px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <textarea name="addressDetail" placeholder="ข้อมูลเพิ่มเติม" value={formData.addressDetail} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" rows="3"></textarea>
        
        <div className="flex space-x-4 mt-6">
            <button onClick={prevStep} className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition duration-200">Back</button>
            <button onClick={nextStep} className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-200">Continue</button>
        </div>
    </div>
);

// Step 3: Role Choosing
const Step3Role = ({ formData, handleChange, prevStep, handleSubmit, status }) => (
    <div className="space-y-6">
        <p className="text-gray-600 text-center">What is your role?</p>
        <div className="flex justify-center space-x-6">
            <label className={`w-1/2 p-4 text-center border-2 rounded-lg cursor-pointer transition duration-200 ${formData.userRole === 'RENTER' ? 'bg-gray-200 border-red-500' : 'bg-gray-50 border-gray-300'}`}>
                <input type="radio" name="userRole" value="RENTER" checked={formData.userRole === 'RENTER'} onChange={handleChange} className="hidden" required />
                <p className="font-semibold">Customer (Renter)</p>
            </label>
            <label className={`w-1/2 p-4 text-center border-2 rounded-lg cursor-pointer transition duration-200 ${formData.userRole === 'OWNER' ? 'bg-gray-200 border-red-500' : 'bg-gray-50 border-gray-300'}`}>
                <input type="radio" name="userRole" value="OWNER" checked={formData.userRole === 'OWNER'} onChange={handleChange} className="hidden" required />
                <p className="font-semibold">Owner</p>
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
        addressDetail: '', 

        // Step 3 Field
        userRole: 'RENTER',
    });

    const dispatch = useDispatch();
    const { status, error, isRegistered } = useSelector((state) => state.user);

    // ... (useEffect, handleChange, nextStep, prevStep functions)
    
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
            // Backend fields (Username ต้องไม่ว่าง)
            username: formData.username,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            
            // รวม First/Last name เป็น name
            name: `${formData.firstName} ${formData.lastName}`,
            
            address: `${formData.addressHouseNo}, ${formData.addressProvince}, ${formData.addressDetail}`,
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
        <AuthLayout title={title}>
            {error && <p className="text-red-500 text-center mb-3">Error: {error}</p>}
            {renderStep()}
        </AuthLayout>
    );
};

export default RegisterPage;