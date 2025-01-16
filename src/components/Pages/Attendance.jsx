import React, { useState, useEffect, useRef } from "react";
import useDatabase from "../../hooks/useDatabase";
import Reload from "../Reload";
import Search from "../Search";
import DatePicker from "../HtmlDatePicker";

export const Attendance = () => {
  const dateFormat = { year: 'numeric', month: 'long', day: '2-digit' };
  // const [date, setDate] = useState(new Date().toLocaleDateString('en-US', dateFormat));
  //for demo purposes, set the date to a fixed date
  const [date, setDate] = useState('December 23, 2024');
  const [level, setLevel] = useState("Age 0-3");
  const selectRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [kids, setKids] = useState([]);
  const [filteredKids, setFilteredKids] = useState([]);
  const [loading, setLoading] = useState(false);
  const { request } = useDatabase();
  var counter = 0;

  const setFormatedDate = (date) => {
    setDate(new Date(date).toLocaleDateString('en-US', dateFormat));
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const response = await request('logs_kids', 'GETALL', {
        date: date,
        level: level
      })
      const parsedData = JSON.parse(response);
      setKids(parsedData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data: ", error);
    }
  };

  useEffect(() => {
    refreshData();
  }, [date, level]);

  useEffect(() => {
    counter = 0;
    setFilteredKids(kids.filter(kid =>
      (
        kid.name.toLowerCase().includes(searchTerm.toLowerCase()) 
        || kid.parent.toLowerCase().includes(searchTerm.toLowerCase())
        || kid.nickname.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ));
  }, [searchTerm, kids]);

  return (
  <div className="min-h-screen bg-gray-100">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="p-2 gap-4 flex items-center w-full md:w-auto text-lg md:text-2xl">
        <DatePicker date={date} setDate={setFormatedDate} dateFormat={dateFormat}/>
        <div className="relative items-center">
          <div className="text-lg md:text-2xl">
            <select ref={selectRef} className="appearance-none bg-gray-100/0 pl-1 pr-8 focus:outline-none"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="Age 0-3">Age 0-3</option>
              <option value="Age 4-6">Age 4-6</option>
              <option value="Age 7-9">Age 7-9</option>
              <option value="Age 10-12">Age 10-12</option>
            </select>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
            className="absolute size-6 m-1 text-gray-500 cursor-pointer right-0 top-0"
            onClick={() => selectRef.current.click()}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" onClick={() => selectRef.current.click()}/>
          </svg>
        </div>
      </div>
      <div className="p-2 flex gap-2 items-center w-full md:w-auto">
        <Reload refreshData={refreshData} loading={loading} className="m-2"/>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
    </div>

    <div className="overflow-auto rounded-lg shadow">
      <table className="w-full">
        <thead className="bg-gray-50 border-b-2 border-gray-200">
        <tr>
          <th className="w-8 p-3 text-sm font-semibold tracking-wide text-left">#</th>
          <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">Check In</th>
          <th className="p-3 text-sm font-semibold tracking-wide text-left">Child</th>
          <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left hidden md:table-cell">Nickname</th>
          <th className="p-3 text-sm font-semibold tracking-wide text-left hidden md:table-cell">Parent/Guardian</th>
          <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left hidden md:table-cell">Contact</th>
        </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
        {filteredKids.map((log) => (
          <tr className={counter++ % 2 === 0 ? "bg-gray-50" : "bg-white"} key={log.time}>
            <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{counter}</td>
            <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{log.time}</td>
            <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{log.id + ' | ' + log.name}</td>
            <td className="p-3 text-sm text-gray-700 whitespace-nowrap hidden md:table-cell">{log.nickname}</td>
            <td className="p-3 text-sm text-gray-700 whitespace-nowrap hidden md:table-cell">{log.parent}</td>
            <td className="p-3 text-sm text-gray-700 whitespace-nowrap hidden md:table-cell">{log.parent_contact}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  </div>
  )
}