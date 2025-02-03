import React, { useState, useEffect } from "react";
import useDatabase from "../../hooks/useDatabase";
import Reload from "../Reload";
import Search from "../Search";
import Toggle from "../Toggle";
import { Link } from "react-router-dom";

export const Volunteers = () => {
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
        <h1 className="text-2xl flex-grow md:flex-grow-0">Volunteers</h1>
        <Reload refreshData={refreshData} loading={loading} />
      </div>
      <div className="p-2 pt-5 gap-2 flex items-center w-full md:w-auto">
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