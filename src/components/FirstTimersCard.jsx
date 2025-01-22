import { useEffect, useState } from "react";
import useDatabase from "../hooks/useDatabase";

export default function FirstTimersCard() {
    const { request } = useDatabase();
    const [firstTimers, setFirstTimers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchFirstTimers = async () => {
        setLoading(true);
        try {
            const response = await request('kids', 'GETFIRSTTIMERS', {
              date: new Date().toString()
            })
            let tempFirstTimers = [];
            JSON.parse(response).forEach((firstTimer) => {
                tempFirstTimers.push({
                    name: firstTimer.name,
                    group: firstTimer.level
                });
            });
            setFirstTimers(tempFirstTimers);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFirstTimers();
    }, []);
  return (
    <div className="w-full max-w-md p-4 m-8 bg-white border border-gray-200 rounded-lg shadow-lg sm:p-8">
        <div className="flex items-center mb-4 gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>

            <h5 className="text-xl font-bold leading-none text-gray-900">First Timers</h5>
            {loading ? (
                <div className="w-6 h-6 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
            )
            : (
                <a onClick={fetchFirstTimers} className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                    Refresh
                </a>
            )}
        </div>
        <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200">
                    {firstTimers.map((firstTimer, index) => (
                        <li className="py-3 sm:py-4" key={index}>
                        <div className="flex items-center ">
                            <div className="flex-shrink-0">
                                <img className="w-8 h-8 rounded-full" src="https://i.ibb.co/rw7qcCt/png-transparent-avatar-child-computer-icons-user-profile-smiling-boy-child-face-heroes-thumbnail.png" alt="Neil image" />
                            </div>
                            <div className="flex-1 min-w-0 ms-4">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {firstTimer.name}
                                </p>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900">
                                {firstTimer.group}
                            </div>
                        </div>
                    </li>
                    ))}
                </ul>
        </div>
    </div>

  );
}