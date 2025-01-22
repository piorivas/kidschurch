import React, { useRef, useState } from 'react';

export default function HtmlDatePicker({ date, setDate, dateFormat }) {
  const selectRef = useRef(null);
  const [dateText, setDateText] = useState(date);
  const setFormatedDate = (pickerDate) => {
    const formatedDate = new Date(pickerDate).toLocaleDateString('en-US', dateFormat);
    setDateText(formatedDate);
    setDate(pickerDate);
  };
  return (
    <div className="flex flex-row gap-2 items-center justify-center">
      <h1  onClick={() => selectRef.current.click()}>{dateText}</h1>
      <input ref={selectRef} className='w-[30px] bg-sky-100/0 text-sky-400/0 cursor-pointer' type="date" onChange={(e)=>{setFormatedDate(e.target.value)}}/>
    </div>
  );
}