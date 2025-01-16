import React, { useState, useEffect } from 'react';

const JsonEditor = ({ initialData, editable = true, onChange }) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleToggle = (category, action) => {
    if (!editable) return;

    const updatedCategory = data[category].includes(action)
      ? data[category].filter(item => item !== action)
      : [...data[category], action];

    const updatedData = {
      ...data,
      [category]: updatedCategory
    };

    setData(updatedData);
    if (onChange) {
      onChange(updatedData);
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-gray-100 rounded-md p-4 md:h-full">
        <h2 className="flex-grow md:flex-grow-0 text-center">Access</h2>
        <div className="flex flex-wrap justify-center items-center pt-2 gap-2 border-t-2">
        {Object.keys(data).map(category => (
            <div key={category} className="gap-1 justify-center w-24">
            <h3 className="justify-center text-gray-900 justify-center text-center">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            <ul className="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
                {["view", "create", "update", "delete"].map(action => (
                <li key={action} className="w-full border-b border-gray-200 rounded-t-lg">
                    <div className="flex items-center ps-3">
                    <input
                        id={`${category}-${action}-checkbox`}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:outline-none"
                        checked={data[category].includes(action)}
                        onChange={() => handleToggle(category, action)}
                        disabled={!editable}
                    />
                    <label htmlFor={`${category}-${action}-checkbox`} className="w-full py-1 ms-2 text-xs font-medium text-gray-900">{action.charAt(0).toUpperCase() + action.slice(1)}</label>
                    </div>
                </li>
                ))}
            </ul>
            </div>
        ))}
        </div>
    </div>
  );
};

export default JsonEditor;
