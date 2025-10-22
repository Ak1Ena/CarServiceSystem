import { useNavigate } from 'react-router-dom'
function PaymentCard({title, desc, id}) {
    const nav = useNavigate();
    const handleClick = (paymentId) => {
        nav(`/payments/${paymentId}`);
    }
    return (
        <div
            className="flex justify-between items-center bg-white rounded-lg p-5 shadow-md"
        >
            <div>
                <h2 className="font-semibold text-red-700">{title}</h2>
                <p className="text-sm text-gray-700">{desc}</p>
            </div>
            <button className="bg-red-700 hover:bg-red-800 text-white text-sm font-medium px-5 py-2 rounded-md transition" onClick={() => handleClick(id)}>
                Confirm Payment
            </button>
        </div>
    );
}
export default PaymentCard