export default function Logs({ logs }) {

  return (
    <div className="flex flex-col md:ml-8">
      {logs.map((log, index) => (
        <div key={index} className="flex justify-center items-start w-full mt-8 md:max-w-lg md:justify-start">
          <div className="p-5 bg-blue-200 rounded-lg">
            {Object.entries(log).map(([label, value]) => {
              
              return (
                <> 
                  {
                    label === 'anchorLink' ? <div className="pt-2 text-center"><a className="text-cyan-700 font-medium" href={value.link}>{value.label}</a></div>:
                    label === 'header' ? <h1 className="text-lg font-bold text-cyan-700">{value}</h1>:
                     <p><strong>{label.charAt(0).toUpperCase() + label.slice(1)}:</strong> {value}</p>
                  }
                  
                </>
              
              )
            })}
          </div>
        </div>
      ))}
    </div>
  );
}