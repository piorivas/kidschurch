
export default function LoadingModal() {
  return (
    <div className="z-20 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-60">
      <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-lg">
        <svg className="w-6 h-6 mr-3 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>Loading...</span>
      </div>
    </div>
  );
};