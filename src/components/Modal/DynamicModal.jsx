import React from "react";

export default function DynamicModal({ title, message, closable, onClose }){
  return (
    <>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-40"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-h-full overflow-y-auto w-full max-w-md">
          <div className="flex justify-between mb-4" onClick={onClose}>
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            {closable && (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>)}
          </div>
          <div className="text-sm text-gray-500 mb-4">{message}</div>
        </div>
      </div>
    </>
  );
}
