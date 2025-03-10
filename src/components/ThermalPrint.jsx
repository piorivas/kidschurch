
import { utils } from "../utils/Utilities";

export default function ThermalPrint({ id, name, level, timestamp}) {
    const query = {
        "id": id,
        "name": name,
        "level": level,
        "timestamp": timestamp
    };
    const url = "https://api.rivaschristianacademy.com/nxtgen/checkin/json?" + new URLSearchParams(query).toString();
    const os = utils.getMobileOperatingSystem().trim();
    const isIos = (os.toLowerCase().trim() === 'macos') ? true : false;
    const appLauncher = isIos ? "bprint://" : "my.bluetoothprint.scheme://";
    return (
        <span className="text-center pr-6">
            <a 
                className="text-cyan-700 font-medium" 
                href={appLauncher + url}
                target={isIos ? "_blank" : undefined}
                rel={isIos ? "noopener noreferrer" : undefined}
            >Print Stub</a>
        </span>
    );
}
