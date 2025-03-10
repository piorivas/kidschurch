export default function Logs({ logs, loading }) {

  return (
    <div className="flex flex-col md:ml-8">
      { loading && 
      <div className="flex justify-center items-start w-full mt-8 md:max-w-lg md:justify-start">
        <div className="p-5 bg-blue-200 rounded-lg">
          <h1 className="text-lg font-medium text-cyan-700">Loading...</h1>
        </div>
      </div>
      }
      {logs.map((log, index) => (
        <div className="flex justify-center items-start w-full mt-8 md:max-w-lg md:justify-start">
          <div className="p-5 bg-blue-200 rounded-lg">
            {Object.entries(log).map(([label, value]) => {
              
              return (
                <>
                  {
                    label === 'anchorLink' ? (
                      <div className="pt-2 text-center">
                        <a
                          className="text-cyan-700 font-medium"
                          href={value.link}
                          target={value.target ? value.target : undefined} // Conditional target
                          rel={value.rel ? value.rel : undefined}         // Conditional rel
                        >
                          {value.label}
                        </a>
                      </div>
                    ) : label === 'header' ? (
                      <h1 className="text-lg font-bold text-cyan-700">{value}</h1>
                    ) : (
                      <p>
                        <strong>{label.charAt(0).toUpperCase() + label.slice(1)}:</strong> {value}
                      </p>
                    )
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