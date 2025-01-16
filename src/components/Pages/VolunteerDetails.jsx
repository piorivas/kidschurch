import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useDatabase from "../../hooks/useDatabase";
import moment from "moment";
import ModalYesNo from "../Modal/ModalYesNo"; // Import the ModalYesNo component
import JsonEditor from "../JsonEditor";
import DynamicModal from "../Modal/DynamicModal";

export const VolunteerDetails = () => {
    const dateFormat = { year: 'numeric', month: 'long', day: '2-digit' };
    const params = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [name, setName] = useState("Loading...");
    const [birthday, setBirthday] = useState("...");
    const [status, setStatus] = useState("...");
    const [level, setLevel] = useState("...");
    const [joined, setJoined] = useState("...");
    const [lastActive, setLastActive] = useState("...");
    const [logCount, setLogCount] = useState(0);
    const { id } = params;
    const { request } = useDatabase();
    const [showResetModal, setShowResetModal] = useState(false);
    const [loadingReset, setLoadingReset] = useState(false);
    const [dleader, setDleader] = useState("...");
    const [dleader_contact, setDleaderContact] = useState("...");
    const [contact, setContact] = useState("...");
    const [email, setEmail] = useState("...");
    const [role, setRole] = useState("Teacher");
    const [access, setAccess] = useState({"kids": [], "users": [], "logs": []});
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '', closable: true });

    const messageBox = (message, title = '', closable = true) => {
        setModalContent({ title: title, message: message, closable: closable });
        setShowModal(true);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await request('users', 'GET', {id: id});
                const data = JSON.parse(response);
                setName(data.name);
                setBirthday(new Date(data.birthday).toLocaleDateString('en-CA')); // Use 'en-CA' for ISO format (YYYY-MM-DD)
                setDleader(data.dleader);
                setDleaderContact(data.dleader_contact);
                setStatus(data.status);
                setLevel(data.level);
                setJoined(data.timestamp);
                setContact(data.contact);
                setEmail(data.email);
                setRole(data.role);
                setAccess(JSON.parse(data.access) || access);
            } catch (error) {
                messageBox(error.message || 'An error occurred while fetching the data.');
            }
        };
        const fetchLastLog = async () => {
            try {
                const response = await request('logs_users', 'GETLAST', {id: id});
                const data = JSON.parse(response);
                if (!data) {
                    setLastActive("Never");
                    return;
                }
                setLastActive(moment(data.timestamp).fromNow());
            } catch (error) {
                messageBox(error.message || 'An error occurred while fetching the data.');
            }
        };
        const fetchLogCount = async () => {
            try {
                const response = await request('logs_users', 'GETCOUNT', {id: id});
                setLogCount(response);
            } catch (error) {
                messageBox(error.message || 'An error occurred while fetching the data.');
            }
        };
        fetchUser();
        fetchLastLog();
        fetchLogCount();
    }, [isEditing]);

    const submitDetails = async () => {
        if (!isEditing) {
            setIsEditing(true);
            return;
        }
        try {
            setLoadingSave(true);
            await request('users', 'UPDATEUNIQUE', {
                id: id,
                name: name,
                dleader: dleader,
                dleader_contact: dleader_contact,
                birthday: birthday,
                contact: contact,
                email: email,
                role: role,
                level: level,
                access: JSON.stringify(access),
                index: 'email'
            });
            setIsEditing(false);
            setLoadingSave(false);
        } catch (error) {
            setLoadingSave(false);
            messageBox(error.message || 'An error occurred while updating the data.');
        }
    }

    const updateStatus = async () => {
        try {
            setLoadingStatus(true);
            const newStatus = ('Active' === status) ? 'Inactive' : 'Active';
            await request('users', 'UPDATE', {
                id: id,
                status: newStatus
            });
            setStatus(newStatus);
            setLoadingStatus(false);
        } catch (error) {
            setLoadingStatus(false);
            messageBox(error.message || 'An error occurred while updating the data.');
        }
    }

    const setFomatedDate = (date) => {
        const localDate = new Date(date);
        setBirthday(localDate.toLocaleDateString('en-CA')); // Use 'en-CA' for ISO format (YYYY-MM-DD)
    }

    const resetPassword = async () => {
        try {
            setLoadingReset(true);
            await request('users', 'RESETPASSWORD', { id: id });
            setShowResetModal(false);
            setLoadingReset(false);
            setModalContent({
                title: 'Success',
                message: 'Password reset successfully to default password[1234].',
                closable: true
            });
            setShowModal(true);
        } catch (error) {
            setLoadingReset(false);
            messageBox(error.message || 'An error occurred while resetting the password.');
        }
    };

    return (
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
                    <div className="mt-16 flex gap-10 md:!gap-14">
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-base text-navy-700">{logCount}</p>
                            <p className="text-xs font-normal text-gray-600">Check Ins</p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-base text-navy-700">{isEditing ? 
                                    <select className="text-sm border-gray-300 border-b-2 focus:ring-4 focus:ring-blue-300"
                                        value={level} onChange={(e) => setLevel(e.target.value)}
                                    >
                                        <option value="Age 0-3">Age 0-3</option>
                                        <option value="Age 4-6">Age 4-6</option>
                                        <option value="Age 7-9">Age 7-9</option>
                                        <option value="Age 10-12">Age 10-12</option>
                                        <option value="Age 10-12">Volunteer Support</option>
                                    </select>
                                : level }</p>
                            <p className="text-xs font-normal text-gray-600">Group</p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-base text-navy-700">{status}</p>
                            <p className="text-xs font-normal text-gray-600">Status</p>
                        </div>
                    </div>
                    <div className="mt-6 mb-2 flex flex-col items-center">
                        <h4 className="text-xl font-bold text-navy-700">
                            {isEditing ?
                                <input type="text" placeholder="Name" className="text-xl font-bold text-navy-700 border-gray-300 border-b-2 focus:ring-4 focus:ring-blue-300"
                                    value={name} onChange={(e) => setName(e.target.value)} 
                                /> 
                            : name}
                        </h4>
                    </div>
                    <div className="flex mt-4 space-x-3 lg:mt-6">
                        <button type="submit"
                            className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-blue-300"
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
                            onClick={() => {updateStatus()}}
                            className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-gray-900 bg-gray-200 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-blue-300"
                        >
                            { ('Active' === status) ? 'Set Inactive' : 'Set Active' }
                            {loadingStatus && (
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
                            Reset Password
                            {loadingReset && (
                            <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            )}
                        </button>
                    </div>
                    <div className="mt-6 mx-8 gap-4 w-full flex flex-col md:flex-row items-start md:align-items:stretch">
                        <ul className="w-full md:w-1/2 divide-y rounded bg-gray-100 py-2 px-2 text-gray-600 shadow-sm hover:text-gray-700 hover:shadow">
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
                                <span>Role</span>
                                <span className="ml-auto">
                                    { isEditing ? 
                                        <select className="text-sm border-gray-300 border-b-2 focus:ring-4 focus:ring-blue-300"
                                            value={role} onChange={(e) => setRole(e.target.value)}
                                        >
                                            <option value="Teacher">Teacher</option>
                                            <option value="Marchall">Marshall</option>
                                            <option value="Leader">Leader</option>
                                            <option value="Observer">Observer</option>
                                        </select>
                                    : role }
                                </span>
                            </li>
                            <li className="flex items-center py-3 text-sm">
                                <span>Birthday</span>
                                <span className="ml-auto">
                                    { isEditing ?
                                        <input type="date"
                                            value={birthday}
                                            onChange={(e)=>{setFomatedDate(e.target.value)}}
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
                            <li className="flex items-center py-3 text-sm">
                                <span>Joined</span>
                                <span className="ml-auto">{joined}</span>
                            </li>
                            <li className="flex items-center py-3 text-sm">
                                <span>Last Active</span>
                                <span className="ml-auto">{lastActive}</span>
                            </li>
                        </ul>
                        <div className="w-full md:w-1/2 md:h-[374px]">
                            <JsonEditor initialData={access} editable={isEditing} onChange={setAccess} />
                        </div>
                    </div>
                </div>  
            </div>
            {showResetModal && (
                <ModalYesNo
                    message="Are you sure you want to reset the password?"
                    onYes={() => {setShowResetModal(false); resetPassword();}}
                    onNo={() => setShowResetModal(false)}
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
        </form>
    );
};