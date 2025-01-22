import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useDatabase from "../../hooks/useDatabase";
import ModalLogin from "../Modal/ModalLogin";
import HtmlDatePicker from "../HtmlDatePicker";
import useReports from "../../hooks/useReports";

export const AttendancePrint = () => {
    const { generateReport, getPdfUrl } = useReports();
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
    const [service, setService] = useState(paramService ?? services["First Service"].label);
    const [loading, setLoading] = useState(false);
    const [loadingPdf, setLoadingPdf] = useState(false);
    const { request } = useDatabase();
    const [showLoginModal, setShowLoginModal] = useState(false);

    const setFormatedDate = (date) => {
        setDate(new Date(date).toLocaleDateString('en-US', dateFormat));
      };
    const generate = async () => {
        try {
            setLoading(true);
            await generateReport({
                date: date,
                level: level,
                service: service
            });
            setLoading(false);
            document.getElementById('slides-iframe').src += '';
        } catch (error) {
            console.error('error message' + error.message);
            if (error.message === 'Error: Unauthorized') {
                setShowLoginModal(true);
            }
            setLoading(false);
        }
    }

    const print = async () => {
        try {
            setLoadingPdf(true);
            window.open(await getPdfUrl(), '_blank');
            setLoadingPdf(false);
        } catch (error) {
            console.error('error message' + error.message);
            if (error.message === 'Error: Unauthorized') {
                setShowLoginModal(true);
            }
            setLoadingPdf(false);
        }
    }
    useEffect(() => {
        generate();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="p-2 pt-5 gap-2 flex items-center w-full md:w-auto">
                    <h1 className="text-2xl flex-grow md:flex-grow-0">Kid's Attendance Report</h1>
                </div>
            </div>
            <div className="p-2 pt-5 gap-2 flex items-center justify-center w-full md:w-auto">
                <form className="flex flex-col items-center gap-2 md:flex-row" onSubmit={(e) => {e.preventDefault()}}>
                    <div className="flex items-center gap-2">
                        <HtmlDatePicker date={date} setDate={setFormatedDate} dateFormat={dateFormat}/>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-white rounded-2xl p-1">
                          <select className="appearance-none bg-white/0 focus:outline-none"
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                          >
                            {levels.map((level, index) => (
                                <option className="text-center" key={index} value={level}>{level}</option>
                            ))}
                          </select>
                        </div>
                        <div className="bg-white rounded-2xl p-1">
                          <select className="appearance-none bg-white/0 focus:outline-none"
                            name="service" id="selService" onChange={(e) => setService(e.target.value)}>
                              {Object.keys(services).map((service, index) => (
                                  <option className="text-center" key={index} value={service}>{service}</option>
                              ))}
                          </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="submit" onClick={(e) => generate()} className="bg-cyan-500 hover:bg-cyan-400 text-white rounded-full p-1 px-4 ml-2 flex flex-row items-center">
                            Generate
                            {loading && (
                            <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            )}
                        </button>
                        <button type="submit" onClick={(e) => print()} className="bg-cyan-500 hover:bg-cyan-400 text-white rounded-full p-1 px-4 ml-2 flex flex-row items-center">
                            Print
                            {loadingPdf && (
                            <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            )}
                        </button>
                    </div>
                </form>
            </div>
            <div className="p-2 pt-5 gap-2 flex items-center justify-center w-full md:w-auto">
                <iframe 
                    id="slides-iframe"
                    src="https://docs.google.com/presentation/d/e/2PACX-1vTeGRhiLdPXUcdYGzJSYdt5HkgCVutnccx6IU9anP77rmFy78hIaE75I6pkI273Bj7ASmMx8x0tSMmk/embed?start=false&loop=false&delayms=60000" 
                    frameBorder="0" width="792" height="1157" allowFullScreen={true} mozallowfullscreen="true" webkitallowfullscreen="true">
                </iframe>
            </div>
            {showLoginModal && <ModalLogin isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />}
        </div>
    );
}