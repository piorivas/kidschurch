import { useEffect, useState } from "react";
import DatePicker from "./HtmlDatePicker";
import useDatabase from "../hooks/useDatabase";

export default function StatisticsCard() {
    const dateFormat = { year: 'numeric', month: 'long', day: '2-digit' };
    const dataReset = {
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
    const [totalAttendance, setTotalAttendance] = useState(0);
    const [date, setDate] = useState(new Date().toLocaleDateString('en-US', dateFormat));
    const [service, setService] = useState("First Service");
    const [loading, setLoading] = useState(false);
    const { request } = useDatabase();
    const [statData, setStatData] = useState(dataReset);
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
        "Fourth Service" : {
            label: "Fourth Service",
            value: "07:00:00 PM",
            startRange: "05:30:00 PM",
            endRange: "08:30:00 PM"
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await request('logs_kids', 'GETALL', {
              date: date,
              action: 'Check-in'
            })
            const parsedData = JSON.parse(response);
            console.log('logs_kids parsed data', parsedData);
            let serviceData = parsedData.filter(data => {
                let dummyDate = 'January 1, 1970 ';
                let time = new Date(dummyDate + data.time);
                let timeFrom = new Date(dummyDate + services[service].startRange);
                let timeTo = new Date(dummyDate + services[service].endRange);

                return time >= timeFrom && time <= timeTo;
            });
            console.log('filtered', serviceData);
            var tempStatData = dataReset;
            console.log('tempStatData reset', tempStatData);
            serviceData.forEach(data => {
                if (tempStatData[data.level]) {
                    console.log('exists in tempStatData', data.level);
                    tempStatData[data.level].total += 1;
                    console.log('tempStatData increment', tempStatData[data.level].total);  
                    if (data.firstTimer) {
                        tempStatData[data.level].firstTimers += 1;
                    }
                }
            });
            console.log('tempStatData after tally', tempStatData);
            const responseUsers = await request('logs_users', 'GETALL', {date: date});
            const parsedUsers = JSON.parse(responseUsers);
            console.log(parsedUsers);
            let serviceUsers = parsedUsers.filter(user => {
                return user.time >= services[service].startRange && user.time <= services[service].endRange;
            });
            console.log(serviceUsers);
            serviceUsers.forEach(user => {
                if (tempStatData[user.level]) {
                    tempStatData[user.level].lifeshapers += 1;
                }
            });
            console.log(tempStatData);
            setStatData(tempStatData);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Failed to fetch data: ", error);
        }
    };
    
    const setFormatedDate = (date) => {
      setDate(new Date(date).toLocaleDateString('en-US', dateFormat));
    };

    useEffect(() => {
        fetchData();
    }, [date, service]);

    useEffect(() => {
        let total = 0;
        Object.values(statData).forEach(data => {
            total += data.total;
        });
        setTotalAttendance(total);
    },[statData]);

    return (
        <div className="">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl text-gray-500 sm:text-4xl">
                        Total Attendance : {totalAttendance}
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-3 text-2xl text-gray-600 sm:mt-4  ">
                        <div className="justify-center">
                            <DatePicker date={date} setDate={setFormatedDate} dateFormat={dateFormat}/>
                        </div> 
                        <div className="hidden sm:block">| </div>
                        <select className="bg-gray-50" name="service" id="selService" onChange={(e) => setService(e.target.value)}>
                            {Object.keys(services).map((service, index) => (
                                <option key={index} value={service}>{service}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="mt-10 pb-1">
                <div className="relative">
                    <div className="absolute inset-0 h-1/2 bg-gray-50"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <dl className="rounded-xl bg-white shadow-lg sm:flex sm:flex-row sm:rounded-2xl justify-center">
                                {Object.keys(statData).map((data, index) => (
                                    <div key={index} className="flex flex-col border-b-2 border-b border-gray-200 p-6 text-center md:border-r md:border-r-2 md:w-56">
                                        <dd className="text-5xl font-bold text-gray-500">{statData[data].total}</dd>
                                        <dt className="mt-2 text-lg leading-6 font-medium text-gray-500">{statData[data].level}</dt>
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
            {loading && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-500">Loading...</h2>
                    </div>
                </div>
            )}
        </div>
    );
}