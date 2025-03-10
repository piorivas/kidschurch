import moment from "moment";
import { useEffect, useState } from "react";
import ChildLookUp from "../ChildLookUp";
import { utils } from "../../utils/Utilities";
import useDatabase from "../../hooks/useDatabase";

export const AttendanceCheckIn = ({ date:paramDate , service:paramService, onClose }) => {
    const [service, setService] = useState(paramService ?? "First Service");
    const [date, setDate] = useState(paramDate ? new Date(paramDate) : new Date());
    const [id, setId] = useState('');
    const [children, setChildren] = useState([]);
    const { request } = useDatabase();
    const [loading, setLoading] = useState(false);

    const services = {
        "First Service" : {
            label: "First Service",
            value: "09:00:00 AM",
            startRange: "07:30:00 AM",
            endRange: "10:30:00 AM"
        },
        "Second Service" : {
            label: "Second Service",
            value: "12:00:00 PM",
            startRange: "10:30:00 AM",
            endRange: "01:30:00 PM"
        },
        "Third Service" : {
            label: "Third Service",
            value: "03:00:00 PM",
            startRange: "01:30:00 PM",
            endRange: "04:30:00 PM"
        },
        // For testing only
        // "Fourth Service" : {
        //     label: "Fourth Service",
        //     value: "07:00:00 PM",
        //     startRange: "05:30:00 PM",
        //     endRange: "08:30:00 PM"
        // }
    };

    const submitForm = async () => {
        try {
            if (id === '') {
                throw new Error('Select a child');
            }
            setLoading(true);
            const data = JSON.parse(await request('kids', 'GET', {id: id}));
            if (!data.name) {
                setLoading(false);
                throw new Error("Kids data not found");
            }
            await request('logs_kids', 'CREATE', {
                ...data,
                action: 'Check-in',
                date: new Date(date).toLocaleDateString('en-US', utils.dateFormat),
                time: services[service].value,
                timestamp: moment(date).format('M/D/YYYY, ') + services[service].value,
                service: services[service].label,
            });
            setLoading(false);
            onClose();
            printStub({
                id : data.id,
                name: data.name,
                level: data.level,
                timestamp: moment(date).format('M/D/YYYY, ') + services[service].value
            });
        } catch (error) {
            setLoading(false);
            console.error(error);
            throw error;
        }
    };

    const fetchChildren = async () => {
        try {
            const response = await request('kids', 'GETALL', {});
            setChildren(JSON.parse(response));
        } catch (error) {
            console.error("Failed to fetch data: ", error);
        }
    };

    useEffect(() => {
        fetchChildren();
    }, []);

    return (
        <>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-40"></div>
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="relative bg-white p-4 rounded-lg shadow-lg max-h-full overflow-visible w-full max-w-sm">
                <div className="flex justify-between mb-4" onClick={onClose}>
                    <h1 className="pb-3 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Check In
                    </h1>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </div>
                <form className="space-y-4" onSubmit={
                    (e) => {
                        e.preventDefault();
                        submitForm();
                    }
                }>
                    <div className="gap-4 flex flex-col">
                        <div className="space-y-4 md:space-y-6">
                            <div>
                                <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900">Date</label>
                                <input 
                                    type="date" 
                                    name="date" 
                                    id="date" 
                                    value={moment(date).format('YYYY-MM-DD')} 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" 
                                    required 
                                    onChange={(e) => setDate(new Date(e.target.value))}
                                />
                            </div>
                            <div>
                                <label htmlFor="service" className="block mb-2 text-sm font-medium text-gray-900">Service</label>
                                <select name="service" id="service" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required
                                value={service} onChange={(e) => setService(e.target.value)}>
                                    {Object.keys(services).map((service, index) => (
                                        <option key={index} value={service}>{service}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <ChildLookUp children={children} setId={setId} />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="w-full md:w-fit text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Submit</button>
                </form>
            </div>
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
            )}
        </div>
        </>
    );
}