export default function Search({searchTerm, setSearchTerm}) {
  return (
    <input 
        type="text" 
        placeholder="Type keyword to search..." 
        className="p-2 border border-gray-300 rounded text-sm flex-grow md:flex-grow-0" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
    />
  )
}