import { useEffect, useState } from "react";

const ChildLookUp = ({children, setId}) => {
    const [keyword, setKeyword] = useState('');
    const [filteredChildren, setFilteredChildren] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        setFilteredChildren(children.filter(child => 
            child.name.toLowerCase().includes(keyword.toLowerCase())
        ));
    }, [keyword, children]);

    return (
        <div className="relative">
            <label htmlFor="child" className="block mb-2 text-sm font-medium text-gray-900">Child</label>
            <input 
                value={keyword}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" 
                placeholder="Search keyword" 
                onChange={(e) => {
                    setKeyword(e.target.value)
                    setShowDropdown(e.target.value.length > 0);
                }} 
            />
            {showDropdown && (
                <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg overflow-auto max-h-60 mt-1">
                    {filteredChildren.map((child, index) => (
                        <li key={index} onClick={() => {
                            setId(child.id);
                            setKeyword(child.name);
                            setShowDropdown(false);
                        }} className="px-2 py-2 hover:bg-gray-200 cursor-pointer">{child.name}</li>
                    ))}
                </ul>
            )}
            {showDropdown && filteredChildren.length === 0 && (
                <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg flex justify-center items-center max-h-60 mt-1">
                    Child not found
                </div>
            )}
        </div>
    );
}

export default ChildLookUp;