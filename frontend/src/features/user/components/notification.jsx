import React from 'react';

const SuccessIcon = () => (
    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
        <path d="m9 12 2 2 4-4"></path>
    </svg>
);

const ErrorIcon = () => (
    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18"></path>
        <path d="m6 6 12 12"></path>
    </svg>
);

const Notification = ({ message, title, type, onClose }) => {
    if (!message) return null;

    const isSuccess = type === 'success';

    // กำหนดสีและคลาสตาม Type
    const bgColor = isSuccess ? 'bg-teal-50 dark:bg-teal-800/30' : 'bg-red-50 dark:bg-red-800/30';
    const borderColor = isSuccess ? 'border-teal-500' : 'border-red-500';
    const iconColor = isSuccess ? 'text-teal-800 dark:text-teal-400' : 'text-red-800 dark:text-red-400';
    const iconBg = isSuccess ? 'bg-teal-200 border-teal-100 dark:bg-teal-800 dark:border-teal-900' : 'bg-red-200 border-red-100 dark:bg-red-800 dark:border-red-900';
    const borderStyle = isSuccess ? 'border-t-2' : 'border-s-4';

    return (
        <div 
            className={`${bgColor} ${borderStyle} ${borderColor} rounded-lg p-4 fixed top-4 right-4 z-50 w-full max-w-sm shadow-xl`} 
            role="alert"
        >
            <div className="flex">
                <div className="shrink-0">
                    <span className={`inline-flex justify-center items-center size-8 rounded-full border-4 ${iconBg} ${iconColor}`}>
                        {isSuccess ? <SuccessIcon /> : <ErrorIcon />}
                    </span>
                </div>
                <div className="ms-3">
                    <h3 className="text-gray-800 font-semibold dark:text-white">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-neutral-400">
                        {message}
                    </p>
                </div>
                {/* ปุ่มปิด (Optional) */}
                {onClose && (
                    <div className="ms-auto">
                        <button type="button" onClick={onClose} className="inline-flex flex-shrink-0 justify-center items-center size-5 rounded-lg text-gray-800 opacity-50 hover:opacity-100 dark:text-white">
                            &times;
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;