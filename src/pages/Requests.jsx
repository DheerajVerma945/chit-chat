import React, { useState } from 'react';

const Requests = () => {
  const [showUserRequests, setShowUserRequests] = useState(true);

  return (
    <div className='flex flex-col items-center justify-start mt-16 pt-4 h-screen'>
      <div className="flex gap-4 mb-4 w-full mx-5">
        <button
          onClick={() => setShowUserRequests(true)}
          className={`w-1/2 ${
            showUserRequests ? 'bg-primary text-white' : 'bg-base-200 text-base-content'
          } py-2 px-4 rounded-lg transition-all`}
        >
          User Requests
        </button>
        <button
          onClick={() => setShowUserRequests(false)}
          className={`w-1/2 ${
            !showUserRequests ? 'bg-primary text-white' : 'bg-base-200 text-base-content'
          } py-2 px-4 rounded-lg transition-all`}
        >
          Group Requests
        </button>
      </div>

      {showUserRequests ? (
        <div>User requests content here</div>
      ) : (
        <div>Group requests content here</div>
      )}
    </div>
  );
};

export default Requests;
