 export default function ThermalPrint({ id, name, level, timestamp}) {
    const query = {
        "id": id,
        "name": name,
        "level": level,
        "timestamp": timestamp
    };
    const url = "https://api.rivaschristianacademy.com/nxtgen/checkin/json?" + new URLSearchParams(query).toString();
    return (
        <span className="text-center pr-6">
            <a className="text-cyan-700 font-medium" href={"my.bluetoothprint.scheme://" + url}>Print Stub</a>
        </span>
    );
}
