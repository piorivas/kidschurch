export default function DynamicModal({ title, message, closable, onClose }){
  return (
    <>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-40"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-h-full overflow-y-auto w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <p className="text-sm text-gray-500 mb-4">{message}</p>
          {closable && (
            <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg" onClick={onClose}>OK</button>
          )}
        </div>
      </div>
    </>
  );
}
