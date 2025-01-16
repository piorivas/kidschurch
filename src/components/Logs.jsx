export default function Logs({ logs }) {
  return (
    <div id="logs" className="flex flex-col md:ml-8">
      {logs.map((log) => (
        <div key={log.timestamp} className="flex justify-center items-start w-full mt-8 md:max-w-lg md:justify-start">
          <div className="p-5 bg-blue-200 rounded-lg">
            {Object.entries(log).map(([label, value]) => (
              <p key={label}><strong>{label.charAt(0).toUpperCase() + label.slice(1)}:</strong> {value}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}