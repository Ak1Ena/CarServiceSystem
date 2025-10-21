function PaymentList() {
    return (
        <div className="p-4 min-h-screen bg-[#222121]">
            <div className="max-w-[1200px] mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">
                    Payment Management
                </h1>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <p className="text-gray-700">This is the Payment List page.</p>
                    <p className="text-gray-600 mt-2">
                        Here you can view and manage all payments.
                    </p>
                </div>
            </div>
        </div>

    )
}
export default PaymentList;