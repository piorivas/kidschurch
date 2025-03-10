import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useDatabase from "../../hooks/useDatabase";
import moment from "moment";
import DynamicModal from "../Modal/DynamicModal";

export const KidDetails = () => {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const dateFormat = { year: 'numeric', month: 'long', day: '2-digit' };
    const params = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [name, setName] = useState("Loading...");
    const [nickname, setNickname] = useState("...");
    const [parent, setParent] = useState("...");
    const [parent_contact, setParentContact] = useState("...");
    const [birthday, setBirthday] = useState("...");
    const [status, setStatus] = useState("...");
    const [level, setLevel] = useState("...");
    const [joined, setJoined] = useState("...");
    const [lastActive, setLastActive] = useState("...");
    const [logCount, setLogCount] = useState(0);
    const { id } = params;
    const { request } = useDatabase();

    useEffect(() => {
        const fetchKid = async () => {
            try {
                const response = await request('kids', 'GET', {id: id});
                const data = JSON.parse(response);
                setName(data.name);
                setNickname(data.nickname);
                setParent(data.parent);
                setParentContact(data.parent_contact);
                setBirthday(data.birthday);
                setStatus(data.status);
                setLevel(data.level);
                setJoined(data.timestamp);
            } catch (error) {
                console.warning("Error updating kids details: ", error);
            }
        };
        const fetchLastLog = async () => {
            try {
                const response = await request('logs_kids', 'GETLAST', {id: id});
                const data = JSON.parse(response);
                if (!data) {
                    setLastActive("Never");
                    return;
                }
                setLastActive(moment(data.timestamp).fromNow());
            } catch (error) {
                console.warning("Error fetching last log: ", error);
            }
        };
        const fetchLogCount = async () => {
            try {
                const response = await request('logs_kids', 'GETCOUNT', {id: id});
                setLogCount(response);
            } catch (error) {
                console.warning("Error fetching log count: ", error);
            }
        };
        fetchKid();
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
            await request('kids', 'UPDATE', {
                id: id,
                name: name,
                nickname: nickname,
                parent: parent,
                parent_contact: parent_contact,
                birthday: birthday
            });
            setIsEditing(false);
            setLoadingSave(false);
        } catch (error) {
            console.error("Failed to update data: ", error);
        }
    }

    const updateStatus = async () => {
        try {
            setLoadingStatus(true);
            const newStatus = ('Active' === status) ? 'Inactive' : 'Active';
            await request('kids', 'UPDATE', {
                id: id,
                status: newStatus
            });
            setStatus(newStatus);
            setLoadingStatus(false);
        } catch (error) {
            console.error("Failed to update data: ", error);
        }
    }

    const setFomatedDate = (date) => {
        setBirthday(new Date(date).toLocaleDateString('en-US', dateFormat));
    }

    const deleteKid = async () => {
        try {
            await request('kids', 'DELETE', {id: id});
            navigate('/kids');
        }
        catch (error) {
            console.error("Failed to delete kid: ", error);
        }
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            submitDetails()
        }}>
            <div className="flex flex-col justify-start items-center bg-gray-100 text-gray-800 min-h-screen">
                <div className="relative flex flex-col items-center rounded-[20px] w-[400px] mx-auto my-4 p-4 bg-white bg-clip-border shadow-3xl shadow-shadow-500">
                    <div className="relative flex h-32 w-full justify-center rounded-xl bg-cover" >
                        <img src='https://i.ibb.co/b7N43Sg/gradient-hexagonal-background-23-2148932756.jpg' className="absolute flex h-32 w-full justify-center rounded-xl bg-cover" /> 
                        <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400">
                            <img className="h-full w-full rounded-full" src='https://i.ibb.co/rw7qcCt/png-transparent-avatar-child-computer-icons-user-profile-smiling-boy-child-face-heroes-thumbnail.png' alt="" />
                        </div>
                    </div> 
                    <div className="mt-16 flex gap-10 md:!gap-14">
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-base text-navy-700">{logCount}</p>
                            <p className="text-xs font-normal text-gray-600">Check Ins</p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-base text-navy-700">{level}</p>
                            <p className="text-xs font-normal text-gray-600">level</p>
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
                        <p className="text-base font-normal text-gray-600">
                            {isEditing ?
                                <input type="text" placeholder="Nickname" className="text-base font-normal text-gray-600 border-gray-300 border-b-2 focus:ring-4 focus:ring-blue-300"
                                    value={nickname} onChange={(e) => setNickname(e.target.value)}
                                />
                            : nickname}</p>
                    </div>
                    <ul className="w-11/12 mt-3 divide-y rounded bg-gray-100 py-2 px-3 text-gray-600 shadow-sm hover:text-gray-700 hover:shadow">
                        <li className="flex items-center py-3 text-sm">
                            <span>Birthday</span>
                            <span className="ml-auto">
                                { isEditing ?
                                    <input type="date"
                                        value={moment(birthday).format('YYYY-MM-DD')}
                                        onChange={(e)=>{setBirthday(e.target.value)}}
                                    /> 
                                : birthday}
                            </span>
                        </li>
                        <li className="flex items-center py-3 text-sm">
                            <span>Parent/Guardian</span>
                            <span className="ml-auto">
                                { isEditing ? 
                                    <input type="text" placeholder="Parent/Guardian" className="text-sm border-gray-300 border-b-2 focus:ring-4 focus:ring-blue-300"
                                        value={parent} onChange={(e) => setParent(e.target.value)}
                                    />
                                : parent }
                            </span>
                        </li>
                        <li className="flex items-center py-3 text-sm">
                            <span>Contact</span>
                            <span className="ml-auto">
                                { isEditing ?
                                    <input type="text" placeholder="Contact" className="text-sm border-gray-300 border-b-2 focus:ring-4 focus:ring-blue-300"
                                        value={parent_contact} onChange={(e) => setParentContact(e.target.value)}
                                    />
                                : parent_contact }
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
                        <a
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
                        </a>
                        <a
                            onClick={() => {setShowDeleteModal(true)}}
                            className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-gray-900 bg-red-100 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-blue-300"
                        >
                            Delete
                        </a>
                    </div>
                </div>  
                { showDeleteModal && (
                    <DynamicModal title="Delete Kid" message="Are you sure you want to delete this kid?" closable={true} onClose={() => setShowDeleteModal(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                        <p className="text-lg text-red">Permanently remove this Kids information in Records. This action cannot be undone.</p>
                        <div className="flex justify-end">
                            <button className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={() => deleteKid()}>Delete</button>
                        </div>
                    </DynamicModal>
                )}
            </div>
        </form>
    );
};