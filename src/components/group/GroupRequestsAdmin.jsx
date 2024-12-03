import React, { useEffect, useState } from "react";
import { groupRequestAdminStore } from "../../store/useGroupRequestAdminStore";
import { UserPlus2, X } from "lucide-react";

const GroupRequestsAdmin = () => {
  const {
    setShowGroupRequestsAdmin,
    adminGroupRequests,
    getGroupRequestsAdmin,
    isGroupRequestsAdminLoading,
  } = groupRequestAdminStore();

  const [currUser, setCurrUser] = useState(null);

  const handleAccept = (id) => {
    setCurrUser(id);
    console.log("Accepted the req");
    setTimeout(() => {
      setCurrUser(null);
    }, 15000);
  };

  const handleReject = (id) => {
    setCurrUser(id);
    console.log("Rejected the req");
    setTimeout(() => {
      setCurrUser(null);
    }, 15000);
  };

  useEffect(() => {
    getGroupRequestsAdmin();
  }, []);

  return (
    <div className="fixed inset-0 bg-base-300 bg-opacity-50 z-40 flex justify-center items-center">
      <div className="relative bg-base-100 p-6 rounded-xl max-w-lg w-full shadow-lg">
        <button
          onClick={() => setShowGroupRequestsAdmin(false)}
          className="absolute top-2 right-2 hover:text-error"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-center text-lg font-bold mb-6">Group Requests</h2>
        <div className="space-y-6">
          {isGroupRequestsAdminLoading ? (
            <div className="flex items-center justify-center h-16">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : adminGroupRequests.length > 0 ? (
            adminGroupRequests.map((request) => (
              <div
                key={request._id}
                className="flex justify-between items-center p-4 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={request.profilePic}
                    alt={request.fullName}
                    className="w-12 h-12 rounded-full object-cover border border-base-300"
                  />
                  <span className="text-sm font-medium text-base-content">
                    {request.fullName}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className={`btn btn-success btn-sm ${
                      currUser === request._id ? "loading" : ""
                    }`}
                    onClick={() => handleAccept(request._id)}
                  >
                    {currUser !== request._id && (
                      <>
                        <UserPlus2 className="w-4 h-4" />
                        Accept
                      </>
                    )}
                  </button>
                  <button
                    className={`btn btn-error btn-sm ${
                      currUser === request._id ? "loading" : ""
                    }`}
                    onClick={() => handleReject(request._id)}
                  >
                    {currUser !== request._id && "Reject"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-base-content">
              No requests at the moment
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupRequestsAdmin;
