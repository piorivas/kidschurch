import { useEffect, useState } from "react";
import useDatabase from "../../hooks/useDatabase";
import ChildLookUp from "../ChildLookUp";

export const KidDelete = () => {
    const [id, setId] = useState('');
    const [children, setChildren] = useState([]);
    const { request } = useDatabase();

    const submitForm = async (action) => {
        try{
            await request('for_delete', 'DELETEREQEST', { id:id, entity: 'kids' });
            alert('Your request has been submitted. We will contact you personaly via your contact information for further verification.');
        } catch (error) {
            console.error("Failed to submit request: ", error);
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
        <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                        Kid's Data Deletion Request'
                    </h1>
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
                                    submitForm();
                                }}
                            >
                                Submit Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </section>
    );
}