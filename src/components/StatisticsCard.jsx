import { useEffect, useState } from "react";
import DatePicker from "./HtmlDatePicker";
import useDatabase from "../hooks/useDatabase";
import { useNavigate } from "react-router-dom";
import Reload from "./Reload";
import { toast, Toaster } from "sonner";
import moment from "moment";

export default function StatisticsCard() {
    const { request } = useDatabase();
    const getReset = () => {
        return {
            "Age 0-3": {
                level: "Age 0-3",
                total: 0,
                firstTimers: 0,
                lifeshapers: 0
            },
            "Age 4-6": {
                level: "Age 4-6",
                total: 0,
                firstTimers: 0,
                lifeshapers: 0
            },
            "Age 7-9": {
                level: "Age 7-9",
                total: 0,
                firstTimers: 0,
                lifeshapers: 0
            },
            "Age 10-12": {
                level: "Age 10-12",
                total: 0,
                firstTimers: 0,
                lifeshapers: 0
            }
        };
    };
    const services = {
        "First Service": {
            label: "First Service",
            value: "09:00:00 AM",
            startRange: "07:30:00 AM",
            endRange: "10:30:00 AM"
        },
        "Second Service": {
            label: "Second Service",
            value: "12:00:00 PM",
            startRange: "10:30:00 AM",
            endRange: "01:30:00 PM"
        },
        "Third Service": {
            label: "Third Service",
            value: "03:00:00 PM",
            startRange: "01:30:00 PM",
            endRange: "04:30:00 PM"
        }
    };
    const currentService = Object.values(services).find(service => {
        const startTime = moment(service.startRange, "hh:mm:ss A");
        const endTime = moment(service.endRange, "hh:mm:ss A");
        const currentTime = moment(new Date(), "hh:mm:ss A");
        return currentTime.isBetween(startTime, endTime);
    });
    const dateFormat = { year: 'numeric', month: 'long', day: '2-digit' };
    const [totalAttendance, setTotalAttendance] = useState(0);
    const [date, setDate] = useState(new Date().toLocaleDateString('en-US', dateFormat));
    const [service, setService] = useState((currentService && currentService.label) || "First Service");
    const [kidsLogs, setKidsLogs] = useState([]);
    const [volunteerLogs, setVolunteerLogs] = useState([]);
    const [firstTimers, setFirstTimers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statData, setStatData] = useState(getReset());
    const navigate = useNavigate();

    const fetchKidsLogs = async () => {
        try {
            const response = await request('logs_kids', 'GETALL', {
                date: date,
                action: 'Check-in'
            });
            const parsedData = JSON.parse(response);
            let serviceData = parsedData.filter(data => {
                let dummyDate = 'January 1, 1970 ';
                let time = new Date(dummyDate + data.time);
                let timeFrom = new Date(dummyDate + services[service].startRange);
                let timeTo = new Date(dummyDate + services[service].endRange);
                return time >= timeFrom && time <= timeTo;
            });
            setKidsLogs(serviceData);
        } catch (error) {
            toast.error("Failed to fetch kids logs: " + error);
        }
    };

    const fetchVolunteerLogs = async () => {
        try {
            const responseVolunteers = await request('logs_users', 'GETALL', { date: date });
            const parsedVolunteers = JSON.parse(responseVolunteers);
            let serviceVolunteers = parsedVolunteers.filter(user => {
                return user.time >= services[service].startRange && user.time <= services[service].endRange;
            });
            setVolunteerLogs(serviceVolunteers);
        } catch (error) {
            toast.error("Failed to fetch volunteer logs: " + error);
        }
    };

    const fetchFirstTimers = async () => {
        try {
            const response = await request('kids', 'GETALL');
            const parsedData = JSON.parse(response);
            let firstTimers = parsedData.filter(data => {
                return moment(data.timestamp).isSame(date, 'day');
            });
            setFirstTimers(firstTimers);
        } catch (error) {
            toast.error("Failed to fetch first timers: " + error);
        }
    };

    const updateData = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchKidsLogs(), fetchVolunteerLogs(), fetchFirstTimers()]);
        } catch (error) {
            toast.error("Failed to fetch data: " + error);
        }
        setLoading(false);
    };

    useEffect(() => {
        let tempStatData = getReset();
        let total = 0;
        kidsLogs.forEach(kidData => {
            if (tempStatData[kidData.level]) {
                total++;
                tempStatData[kidData.level].total += 1;
                firstTimers.forEach(firstTimerData => {
                    if (firstTimerData.id === kidData.id) {
                        tempStatData[kidData.level].firstTimers += 1;
                    }
                });
            }
        });
        volunteerLogs.forEach(user => {
            if (tempStatData[user.level]) {
                tempStatData[user.level].lifeshapers += 1;
            }
        });
        setTotalAttendance(total);
        setStatData(tempStatData);
    }, [kidsLogs, volunteerLogs, firstTimers]);

    useEffect(() => {
        updateData();
    }, [date, service]);

    const openAttendance = (level) => () => {
        navigate(`/attendance/date/${encodeURIComponent(date)}/service/${encodeURIComponent(service)}/level/${encodeURIComponent(level)}`);
    };

    const setFormatedDate = (date) => {
        setDate(new Date(date).toLocaleDateString('en-US', dateFormat));
    };

    return (
        <div className="">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl text-gray-500 sm:text-4xl">
                        Total Attendance : {totalAttendance}
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-3 text-2xl text-gray-600 sm:mt-4  ">
                        <div className="justify-center">
                            <DatePicker date={date} setDate={setFormatedDate} dateFormat={dateFormat} />
                        </div>
                        <div className="hidden sm:block">| </div>
                        <select className="bg-gray-50" name="service" id="selService" onChange={(e) => setService(e.target.value)}>
                            {Object.keys(services).map((service, index) => (
                                <option key={index} value={service}>{service}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-3 flex justify-center items-center gap-4">
                        <Reload refreshData={updateData} loading={loading} className="m-2" />
                        <button
                            onClick={() => navigate('/scanner')}
                            className="p-2 px-4 bg-cyan-500 hover:bg-cyan-400 text-white rounded-full text-sm flex items-center"
                        >Scanner</button>
                    </div>
                </div>
            </div>
            <div className="mt-4 pb-1">
                <div className="relative">
                    <div className="absolute inset-0 h-1/2 bg-gray-50"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <dl className="rounded-xl bg-white shadow-lg sm:flex sm:flex-row sm:rounded-2xl justify-center">
                                {Object.keys(statData).map((data, index) => (
                                    <div key={index} className="flex flex-col border-b-2 border-b border-gray-200 p-6 text-center md:border-r md:border-r-2 md:w-56">
                                        <dd className="text-5xl font-bold text-gray-500 hover:text-cyan-800 cursor-pointer " onClick={openAttendance(statData[data].level)}>{statData[data].total}</dd>
                                        <dt className="mt-2 text-lg leading-6 font-medium text-gray-500 hover:text-cyan-800 cursor-pointer " onClick={openAttendance(statData[data].level)}>{statData[data].level}</dt>
                                        <div className="mt-2 flex items-center justify-center text-sm text-gray-500">
                                            <span className="inline-flex items-center"> First Timers </span>
                                            <span className="inline-block bg-gray-200 rounded-full px-3 py-0.5 text-xs font-medium leading-4 text-gray-800 ml-2">{statData[data].firstTimers}</span>
                                        </div>
                                        <div className="mt-2 flex items-center justify-center text-sm text-gray-500">
                                            <span className="inline-flex items-center"> Lifeshapers</span>
                                            <span className="inline-block bg-gray-200 rounded-full px-3 py-0.5 text-xs font-medium leading-4 text-gray-800 ml-2">{statData[data].lifeshapers}</span>
                                        </div>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    );
}