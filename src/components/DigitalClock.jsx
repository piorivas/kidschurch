import { useEffect, useState } from "react";

function DigitalClock(){
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    function formatTime() {
        let hours = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        const meridiem = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12 || 12;
        
        return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)} ${meridiem}`;
    }

    function padZero(num) {
        return num < 10 ? `0${num}` : num;
    }

    return (
        <div className="w-full flex justify-center items-center h-fit text-gray-500 font-semibold">
            <div className="my-8">
                <span className="text-5xl">{formatTime()}</span>
            </div>
        </div>
    );
}

export default DigitalClock;