export default function Toggle({showActive, setShowActive, label}) {
    return (
        <label className="flex items-center cursor-pointer text-sm">
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={showActive}
              onChange={() => setShowActive(!showActive)}
            />
            <div className="block bg-gray-200 w-14 h-8 rounded-full"></div>
            <div className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition ${showActive ? 'transform translate-x-full bg-cyan-500' : 'bg-white'}`}></div>
          </div>
          <span className="ml-3 text-gray-700">{label}</span>
        </label>
    )
}