import { useEffect, useState } from "react";
import useDatabase from "../hooks/useDatabase";

export default function BirthdayCard() {
    const { request } = useDatabase();
    const [celebrants, setCelebrants] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCelebrants = async () => {
        setLoading(true);
        try {
            const date = new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit'
            });
            const response = await request('kids', 'GETBDAY', {
              date: date,
            })
            let tempCelebrants = [];
            JSON.parse(response).forEach((celebrant) => {
                tempCelebrants.push({
                    name: celebrant.name,
                    group: celebrant.level,
                    dob: celebrant.birthday
                });
            });
            setCelebrants(tempCelebrants);
            const responseUsers = await request('users', 'GETBDAY', {
              date: date,
            })
            JSON.parse(responseUsers).forEach((celebrant) => {
                tempCelebrants.push({
                    name: celebrant.name,
                    group: "Lifeshaper",
                    dob: celebrant.birthday
                });
            });
            setCelebrants(tempCelebrants);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCelebrants();
    }, []);
  return (
    <div className="w-full max-w-md p-4 m-8 bg-white border border-gray-200 rounded-lg shadow-lg sm:p-8">
        <div className="flex items-center mb-4 gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z" />
        </svg>

            <h5 className="text-xl font-bold leading-none text-gray-900">Birthday Celebrants</h5>
            {loading ? (
                <div className="w-6 h-6 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
            )
            : (
                <a onClick={fetchCelebrants} className="text-sm font-medium text-blue-600 hover:underline ">
                    Refresh
                </a>
            )}
        </div>
        <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200">
                    {celebrants.map((celebrant, index) => (
                        <li key={index} className="py-3 sm:py-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <img className="w-8 h-8 rounded-full" src="https://i.ibb.co/rw7qcCt/png-transparent-avatar-child-computer-icons-user-profile-smiling-boy-child-face-heroes-thumbnail.png" alt="profile image" />
                                </div>
                                <div className="flex-1 min-w-0 ms-4">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {celebrant.name}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                        {celebrant.dob}
                                    </p>
                                </div>
                                <div className="inline-flex items-center text-base font-semibold text-gray-900">
                                    {celebrant.group}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
        </div>
    </div>

  );
}