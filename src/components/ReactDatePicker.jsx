import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

export default function ReactDatePicker({ date, setDate}) {
  const [isOpen, setIsOpen] = useState(false);
  const handleIconClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-row gap-2 items-center flex-grow md:flex-grow-0">
      <h1 className="cursor-pointer" onClick={handleIconClick}>{date}</h1>
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
          className="size-6 text-gray-500 cursor-pointer"
          onClick={handleIconClick}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
        {isOpen && (
          <div className="fixed left-2">
          <DatePicker
            selected={date}
            onChange={(date) => {
              setDate(date);
              setIsOpen(false);
            }}
            onClickOutside={() => setIsOpen(false)}
            inline
            dateFormat="MMMM dd, yyyy"
          />
          </div>
        )}
      </div>
    </div>
  );
}