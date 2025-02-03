import React, { useState, useEffect } from "react";
import useDatabase from "../../hooks/useDatabase";
import Reload from "../Reload";
import Search from "../Search";
import DatePicker from "../HtmlDatePicker";
import { useNavigate, useParams } from "react-router-dom";
import { AttendanceCheckIn } from "./AttendanceCheckIn";
import ThermalPrint from "../ThermalPrint";

export const Attendance = () => {
  const access = JSON.parse(window.localStorage.getItem('nxtgen.access'));
  const { date: paramDate, service: paramService, level:paramLevel } = useParams();
  const services = {
      "First Service" : {
          label: "First Service",
          value: "09:00:00 AM",
          startRange: "07:30:00 AM",
          endRange: "10:30:00 AM"
      },
      "Second Service" : {
          label: "Second Service",
          value: "12:00:00 PM",
          startRange: "10:30:00 AM",
          endRange: "01:30:00 PM"
      },
      "Third Service" : {
          label: "Third Service",
          value: "03:00:00 PM",
          startRange: "01:30:00 PM",
          endRange: "04:30:00 PM"
      },
      // For testing only
      // "Fourth Service" : {
      //     label: "Fourth Service",
      //     value: "07:00:00 PM",
      //     startRange: "05:30:00 PM",
      //     endRange: "08:30:00 PM"
      // }
  };
  const levels = ["Age 0-3", "Age 4-6", "Age 7-9", "Age 10-12"];
  const dateFormat = { year: 'numeric', month: 'long', day: '2-digit' };
  const [date, setDate] = useState(paramDate ?? new Date().toLocaleDateString('en-US', dateFormat));
  const [level, setLevel] = useState(paramLevel ?? levels[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [kids, setKids] = useState([]);
  const [filteredKids, setFilteredKids] = useState([]);
  const [service, setService] = useState(paramService ?? services["First Service"].label);
  const [loading, setLoading] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const { request } = useDatabase();
  const navigate = useNavigate();
  var counter = 0;

  const setFormatedDate = (date) => {
    setDate(new Date(date).toLocaleDateString('en-US', dateFormat));
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      setKids([]);
      const response = await request('logs_kids', 'GETALL', {
        date: date,
        level: level
      })
      const parsedData = JSON.parse(response);
      let serviceData = parsedData.filter(data => {
          let dummyDate = 'January 1, 1970 ';
          let time = new Date(dummyDate + data.time);
          let timeFrom = new Date(dummyDate + services[service].startRange);
          let timeTo = new Date(dummyDate + services[service].endRange);

          return time >= timeFrom && time <= timeTo;
      });
      setKids(serviceData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data: ", error);
    }
  };

  useEffect(() => {
    refreshData();
  }, [date, level, service]);

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
      <div className="p-2 gap-4 flex items-center w-full md:w-auto text-md md:text-xl lg:text-2xl">
        <DatePicker date={date} setDate={setFormatedDate} dateFormat={dateFormat}/>
        <div className="bg-white rounded-2xl p-1">
          <select className="appearance-none bg-white/0 focus:outline-none"
            value={level} onChange={(e) => setLevel(e.target.value)}
          >
            {levels.map((level, index) => (
                <option className="text-center" key={index} value={level}>{level}</option>
            ))}
          </select>
        </div>
        <div className="bg-white rounded-2xl p-1">
          <select className="appearance-none bg-white/0 focus:outline-none"
            value={service} onChange={(e) => setService(e.target.value)}>
              {Object.keys(services).map((service, index) => (
                  <option className="text-center" key={index} value={service}>{service}</option>
              ))}
          </select>
        </div>
      </div>
      <div className="p-2 flex gap-2 items-center w-full md:w-auto">
        <svg onClick={() => {
            navigate(`/attendance/print/date/${encodeURIComponent(date)}/service/${encodeURIComponent(service)}/level/${encodeURIComponent(level)}`);
          }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:text-cyan-500 cursor-pointer">
          <title>Print Attendance</title>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
        </svg>
        <Reload refreshData={refreshData} loading={loading} className="m-2"/>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
    </div>
    
    {access?.logs_kids?.includes('create') && (
      <div className="fixed bottom-5 right-5 justify-center">
        <button onClick={() => setShowCheckIn(true)} className="bg-cyan-500 flex flex-row gap-2 text-white px-5 py-2 rounded-full hover:bg-cyan-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
          </svg>
          Check In
        </button>
      </div>
    )}

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
            <td className="p-3 text-sm text-gray-700 whitespace-nowrap flex justify-between">
              <span>{log.name}</span> 
              <ThermalPrint id={log.id} name={log.name} level={log.level} timestamp={log.timestamp} />
            </td>
            <td className="p-3 text-sm text-gray-700 whitespace-nowrap hidden md:table-cell">{log.nickname}</td>
            <td className="p-3 text-sm text-gray-700 whitespace-nowrap hidden md:table-cell">{log.parent}</td>
            <td className="p-3 text-sm text-gray-700 whitespace-nowrap hidden md:table-cell">{log.parent_contact}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
    {showCheckIn && (
      <AttendanceCheckIn date={date} service={service} onClose={() => setShowCheckIn(false)} />
    )} 
  </div>
  )
}