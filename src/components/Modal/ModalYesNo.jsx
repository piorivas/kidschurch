import React from "react";

const ModalYesNo = ({ message, onYes, onNo }) => {
  return (
    <>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-40"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-h-full overflow-y-auto w-full max-w-md">
          <div className="text-sm text-gray-500 mb-4">{message}</div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onYes}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            >
              Yes
            </button>
            <button
              onClick={onNo}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalYesNo;
