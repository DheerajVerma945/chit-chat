import React, { useState } from "react";
import { useUserStore } from "../../store/useUserStore";
import toast from "react-hot-toast";

const GroupRequests = () => {
  const { groupRequestsUser, reviewGroupRequestUser } = useUserStore();
  const [currReq, setCurrReq] = useState(null);
  const [status,setStatus] = useState("");

  const handleAccept = async (req) => {
    setCurrReq(req._id);
    setStatus("accepted")
    try {
      await reviewGroupRequestUser("accepted", req._id, req.groupId);
      toast.success("Request accepted successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setCurrReq(null);
      setStatus("");
    }
  };

  const handleReject = async (req) => {
    setCurrReq(req._id);
    setStatus("rejected");
    try {
      await reviewGroupRequestUser("rejected", req._id, req.groupId);
      toast.success("Request rejected successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setCurrReq(null);
      setStatus("");
    }
  };


  if (!groupRequestsUser || groupRequestsUser.length === 0)
    return (
      <div className="h-screen flex items-center justify-center">
        No group requests at the moment
      </div>
    );

  return (
    <div className="w-full p-5">
      {groupRequestsUser.map((request) => (
        <div
          key={request._id}
          className="flex items-center justify-between p-4 bg-base-100 rounded-lg shadow-md mb-4"
        >
          <div className="flex items-center gap-4">
            <img
              src={request.senderId.profilePic}
              alt={request.senderId.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{request.senderId.fullName}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              className={`btn btn-success btn-sm ${
                currReq === request._id && status === "accepted" ? "loading bg-success" : ""
              }`}
              onClick={() => handleAccept(request)}
            >
              Accept
            </button>
            <button
              className={`btn btn-error btn-sm ${
                currReq === request._id && status === "rejected" ? "loading bg-error" : ""
              }`}
              onClick={() => handleReject(request)}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupRequests;
