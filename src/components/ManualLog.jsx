import { useEffect, useState } from "react";
import ChildLookUp from "./ChildLookUp";
import useDatabase from "./../hooks/useDatabase";

export default function ManualLog({ onLog }) {
    const [id, setId] = useState('');
    const [children, setChildren] = useState([]);
    const { request } = useDatabase();

    const submitForm = async (action) => {
        onLog(`Filler Text||kids||${action}||${id}`);
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
        <div className="w-full rounded overflow-visible shadow-lg w-full p-4">
            <form className="space-y-4">
                <div className="gap-4 flex flex-col">
                    <div className="space-y-4 md:space-y-6">
                        <div>
                            <ChildLookUp children={children} setId={setId} />
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button
                        type="button"
                        className={`w-full md:w-fit text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                        onClick={() => {
                            submitForm('Check-in');
                        }}
                    >
                        Check-In
                    </button>
                    <button
                        type="button"
                        className={`w-full md:w-fit text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                        onClick={() => {
                            submitForm('Check-out');
                        }}
                    >
                        Check-Out
                    </button>
                </div>
            </form>
        </div>
    );
}