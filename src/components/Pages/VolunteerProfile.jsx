import { useEffect, useState } from "react";
import useDatabase from "../../hooks/useDatabase";
import DynamicModal from "../Modal/DynamicModal";

export const VolunteerProfile = () => {
    const dateFormat = { year: 'numeric', month: 'long', day: '2-digit' };
    const [isEditing, setIsEditing] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [name, setName] = useState("Loading...");
    const [id, setId] = useState('...');
    const [birthday, setBirthday] = useState("...");
    const { request } = useDatabase();
    const [showResetModal, setShowResetModal] = useState(false);
    const [loadingReset, setLoadingReset] = useState(false);
    const [dleader, setDleader] = useState("...");
    const [dleader_contact, setDleaderContact] = useState("...");
    const [contact, setContact] = useState("...");
    const [email, setEmail] = useState("...");
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '', closable: true });
    const [newPassword, setNewPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');

    useEffect(() => {
        const fetchVolunteer = async () => {
            try {
                const response = await request('users', 'GETPROFILE');
                const data = JSON.parse(response);
                console.log(data);
                setId(data.id);
                setName(data.name);
                setBirthday(new Date(data.birthday).toLocaleDateString('en-CA')); // Use 'en-CA' for ISO format (YYYY-MM-DD)
                setDleader(data.dleader);
                setDleaderContact(data.dleader_contact);
                setContact(data.contact);
                setEmail(data.email);
            } catch (error) {
                setModalContent({
                    title: 'Error',
                    message: error.message || 'An error occurred while fetching the data.',
                    closable: true
                });
                setShowModal(true);
                console.error("Failed to fetch data: ", error);
            }
        };
        fetchVolunteer();
    }, [isEditing]);

    const submitDetails = async () => {
        if (!isEditing) {
            setIsEditing(true);
            return;
        }
        try {
            setLoadingSave(true);
            console.log("Birtday upon submit: ", birthday);
            await request('users', 'UPDATEPROFILE', {
                id: id,
                name: name,
                dleader: dleader,
                dleader_contact: dleader_contact,
                birthday: birthday,
                contact: contact,
                email: email,
                username:email
            });
            setIsEditing(false);
            setLoadingSave(false);
        } catch (error) {
            setLoadingSave(false);
            setModalContent({
                title: 'Error',
                message: error.message || 'An error occurred while updating the data.',
                closable: true
            });
            setShowModal(true);
            console.error("Failed to update data: ", error);
        }
    }

    const resetPassword = async () => {
        if (newPassword !== retypePassword) {
            setModalContent({
                title: 'Error',
                message: "Passwords do not match",
                closable: true
            });
            setShowModal(true);
            return;
        }
        try {
            setLoadingReset(true);
            await request('users', 'CHANGEPASSWORD', { id: id, newPassword: newPassword });
            setShowResetModal(false);
            setLoadingReset(false);
            setModalContent({
                title: 'Success',
                message: "Password changed successfully",
                closable: true
            });
            setShowModal(true);
        } catch (error) {
            console.error("Failed to changed password: ", error);
            setLoadingReset(false);
        }
    };

    return (
        <>
        <form onSubmit={(e) => {
            e.preventDefault()
            submitDetails()
        }}>
            <div className="flex flex-col justify-start items-center bg-gray-100 text-gray-800 min-h-screen">
                <div className="relative flex flex-col items-center rounded-[20px] w-[400px] md:w-[600px] mx-auto my-4 p-4 bg-white bg-clip-border shadow-3xl shadow-shadow-500">
                    <div className="relative flex h-32 w-full justify-center rounded-xl bg-cover" >
                        <img src='https://i.ibb.co/Xsfsjmq/banner-ef572d78f29b0fee0a09.png' className="absolute flex h-32 w-full justify-center rounded-xl bg-cover" /> 
                        <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400">
                            <img className="h-full w-full rounded-full" src='https://i.ibb.co/tzyP5Cz/blank-profile-picture-973460-1280.png' alt="" />
                        </div>
                    </div> 
                    <div className="flex mt-16 space-x-3">
                        <button type="submit"
                            className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-gray-900 bg-cyan-100 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-blue-300"
                        >
                            {isEditing ? "Save" : "Edit"}
                            {loadingSave && (
                            <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowResetModal(true)}
                            className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-gray-900 bg-red-200 rounded-lg border border-gray-300 hover:bg-red-100 focus:ring-4 focus:ring-red-300"
                        >
                            Change Password
                            {loadingReset && (
                            <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            )}
                        </button>
                    </div>
                    <div className="mt-6 mx-8 gap-4 w-full flex flex-col items-start md:align-items:stretch">
                        <ul className="w-full divide-y rounded bg-gray-100 py-2 px-2 text-gray-600 shadow-sm hover:text-gray-700 hover:shadow">
                            <li className="flex items-center py-3 text-sm">
                                <span>Fullname</span>
                                <span className="ml-auto">
                                    { isEditing ? 
                                        <input type="text" placeholder="Contact" className="text-sm border-gray-300 border-b-2 focus:ring-4 focus:ring-blue-300"
                                            value={name} onChange={(e) => setName(e.target.value)}
                                        />
                                    : name }
                                </span>
                            </li>
                            <li className="flex items-center py-3 text-sm">
                                <span>Contact</span>
                                <span className="ml-auto">
                                    { isEditing ? 
                                        <input type="text" placeholder="Contact" className="text-sm border-gray-300 border-b-2 focus:ring-4 focus:ring-blue-300"
                                            value={contact} onChange={(e) => setContact(e.target.value)}
                                        />
                                    : contact }
                                </span>
                            </li>
                            <li className="flex items-center py-3 text-sm">
                                <span>Email</span>
                                <span className="ml-auto">
                                    { isEditing ? 
                                        <input type="email" placeholder="Email" className="text-sm border-gray-300 border-b-2 focus:ring-4 focus:ring-blue-300"
                                            value={email} onChange={(e) => setEmail(e.target.value)}
                                        />
                                    : email }
                                </span>
                            </li>
                            <li className="flex items-center py-3 text-sm">
                                <span>Birthday</span>
                                <span className="ml-auto">
                                    { isEditing ?
                                        <input type="date"
                                            value={birthday}
                                            onChange={(e)=>{setBirthday(e.target.value)}}
                                        /> 
                                    : birthday}
                                </span>
                            </li>
                            <li className="flex items-center py-3 text-sm">
                                <span>Dgroup Leader</span>
                                <span className="ml-auto">
                                    { isEditing ? 
                                        <input type="text" placeholder="Dgroup Leader" className="text-sm border-gray-300 border-b-2 focus:ring-4 focus:ring-blue-300"
                                            value={dleader} onChange={(e) => setDleader(e.target.value)}
                                        />
                                    : dleader }
                                </span>
                            </li>
                            <li className="flex items-center py-3 text-sm">
                                <span>DLeader Contact</span>
                                <span className="ml-auto">
                                    { isEditing ?
                                        <input type="text" placeholder="DLeader Contact" className="text-sm border-gray-300 border-b-2 focus:ring-4 focus:ring-blue-300"
                                            value={dleader_contact} onChange={(e) => setDleaderContact(e.target.value)}
                                        />
                                    : dleader_contact }
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>  
            </div>
        </form>
        {showResetModal && (
            <DynamicModal
                title="Change Password"
                message={
                    <form
                        className="space-y-4 md:space-y-6"
                        onSubmit={(e) => {
                            e.preventDefault();
                            resetPassword();
                        }}
                    >
                        <div>
                            <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900">
                                New Password
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                id="newPassword"
                                placeholder="••••••••"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="retypePassword" className="block mb-2 text-sm font-medium text-gray-900">
                                Retype Password
                            </label>
                            <input
                                type="password"
                                name="retypePassword"
                                id="retypePassword"
                                placeholder="••••••••"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                value={retypePassword}
                                onChange={(e) => setRetypePassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Reset Password
                        </button>
                    </form>
                }
                closable={true}
                onClose={() => setShowResetModal(false)}
            />
        )}
        {showModal && (
        <DynamicModal
            title={modalContent.title}
            message={modalContent.message}
            closable={modalContent.closable}
            onClose={() => setShowModal(false)}
        />
        )}
        </>
    );
};