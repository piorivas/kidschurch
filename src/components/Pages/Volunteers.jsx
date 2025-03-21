import React, { useState, useEffect } from "react";
import useDatabase from "../../hooks/useDatabase";
import Reload from "../Reload";
import Search from "../Search";
import Toggle from "../Toggle";
import { Link, useNavigate } from "react-router-dom";

export const Volunteers = () => {
  const navigate = useNavigate();
  var access = JSON.parse(window.localStorage.getItem('nxtgen.access'));
  // access = {users: ['view','update','create','delete'], kids: ['view'], attendance: ['view'], scanner: ['view']};
  const [searchTerm, setSearchTerm] = useState("");
  const [showActive, setShowActive] = useState(true);
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { request } = useDatabase();

  const refreshData = async () => {
    try {
      setLoading(true);
      const response = await request('users', 'GETALL', {});
      const parsedData = JSON.parse(response);
      setVolunteers(parsedData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data: ", error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    setFilteredVolunteers(volunteers.filter(volunteer =>
      volunteer.name.toLowerCase().includes(searchTerm.toLowerCase())
      && (showActive ? volunteer.status === "Active" : true)
    ));
  }, [searchTerm, showActive, volunteers]);

  return (
  <div className="min-h-screen bg-gray-100">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="p-2 pt-5 gap-2 flex items-center w-full md:w-auto">
        <h1 className="text-2xl flex-grow md:flex-grow-0">Volunteer Management</h1>
        <Reload refreshData={refreshData} loading={loading} />
      </div>
      <div className="p-2 pt-5 gap-2 flex items-center w-full md:w-auto">
        <svg onClick={() => {navigate('/volunteers/print')}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:text-cyan-500 cursor-pointer">
          <title>Print IDs</title>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
        </svg>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Toggle showActive={showActive} setShowActive={setShowActive} label="Active" />
      </div>
    </div>

    {access?.users?.includes('create') && (
      <div className="fixed bottom-5 right-5 justify-center">
        <Link to="/signup" className="bg-cyan-500 flex flex-row gap-2 text-white px-5 py-2 rounded-full hover:bg-cyan-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
          </svg>
          Add
        </Link>
      </div>
    )}

    <div className="overflow-auto rounded-lg shadow hidden md:block">
      <table className="w-full">
        <thead className="bg-gray-50 border-b-2 border-gray-200">
        <tr>
          <th className="w-16 p-3 text-sm font-semibold tracking-wide text-left">ID</th>
          <th className="p-3 text-sm font-semibold tracking-wide text-left">Name</th>
          <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">Group</th>
          <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">Role</th>
          <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">Contact</th>
          <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">Status</th>
        </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
        {filteredVolunteers.map((volunteer) => (
          <tr className={volunteer.id % 2 === 0 ? "bg-gray-50" : "bg-white"} key={volunteer.id}>
            <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{volunteer.id}</td>
            <td className="p-3 text-sm text-cyan-700 whitespace-nowrap hover:text-cyan-500">
              <Link to={`/volunteers/${volunteer.id}`}>{volunteer.name}</Link>
            </td>
            <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{volunteer.level}</td>
            <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{volunteer.role}</td>
            <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{volunteer.contact}</td>
            <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
              <span className={`p-1.5 text-xs font-medium uppercase tracking-wider ${volunteer.status === 'Active' ? 'text-green-800 bg-green-200' : 'text-gray-800 bg-gray-200'} rounded-lg bg-opacity-50`}>{volunteer.status}</span>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden">
      {filteredVolunteers.map((volunteer) => (
        <div className="bg-white space-y-2 p-4 m-2 rounded-lg shadow" key={volunteer.id}>
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex flex-row bg-orange-200 rounded-lg py-1 px-2">ID {volunteer.id}</div>
            <div className="text-cyan-700 text-lg font-medium flex-grow">
              <Link to={`/volunteers/${volunteer.id}`}>{volunteer.nickname}</Link></div>
            <div>
              <span className={`p-1.5 text-xs font-medium uppercase tracking-wider ${volunteer.status === 'Active' ? 'text-green-800 bg-green-200' : 'text-gray-800 bg-gray-200'} rounded-lg bg-opacity-50`}>{volunteer.status}</span>
            </div>
          </div>
          <div className="text-md text-orange-500 "><Link to={`/volunteers/${volunteer.id}`}>{volunteer.name}</Link></div>
          <div className="text-md text-gray-700">{volunteer.contact}</div>
          <div className="text-sm text-gray-700">{volunteer.role} | {volunteer.level}</div>
        </div>
      ))}
    </div>
  </div>
  );
}