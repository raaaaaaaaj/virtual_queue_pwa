// import { useState, useEffect, useCallback } from "react";
// import useSocket from "../Hooks/useSocket";
// import { useAuth } from "../Hooks/useAuth";
// import QueueContext from "./QueueContext";

// export const QueueProvider = ({ children }) => {
//   const [joinedQueues, setJoinedQueues] = useState([]);
//   const { socket, isConnected } = useSocket();
//   const { user } = useAuth();

//   const handleQueueUpdate = useCallback((updatedQueue) => {
//     setJoinedQueues((prevQueues) =>
//       prevQueues.map((queue) =>
//         queue.rideId === updatedQueue.rideId
//           ? { ...queue, ...updatedQueue }
//           : queue,
//       ),
//     );
//   }, []);

//   useEffect(() => {
//     if (!isConnected || !user) return;

//     socket.on("queueUpdate", handleQueueUpdate);

//     return () => {
//       socket.off("queueUpdate", handleQueueUpdate);
//     };
//   }, [isConnected, socket, user, handleQueueUpdate]);

//   const joinQueue = (ride) => {
//     setJoinedQueues((prevQueues) => [
//       ...prevQueues,
//       {
//         rideId: ride.id,
//         rideName: ride.name,
//         position: null,
//         waitTime: null,
//         arrivalTime: null,
//       },
//     ]);
//   };

//   const leaveQueue = (rideId) => {
//     setJoinedQueues((prevQueues) =>
//       prevQueues.filter((q) => q.rideId !== rideId),
//     );
//   };

//   const calculateArrivalTime = (position, avgProcessingTime) => {
//     if (!avgProcessingTime) return null;

//     const now = new Date();
//     const waitTime = position * avgProcessingTime;
//     const arrivalTime = new Date(now.getTime() + waitTime * 60000);

//     const formatTime = (date) => {
//       let hours = date.getHours();
//       const minutes = date.getMinutes();
//       const ampm = hours >= 12 ? "PM" : "AM";
//       hours = hours % 12;
//       hours = hours ? hours : 12;
//       const strMinutes = minutes < 10 ? "0" + minutes : minutes;
//       return `${hours}:${strMinutes} ${ampm}`;
//     };

//     return formatTime(arrivalTime);
//   };

//   return (
//     <QueueContext.Provider
//       value={{ joinedQueues, joinQueue, leaveQueue, calculateArrivalTime }}
//     >
//       {children}
//     </QueueContext.Provider>
//   );
// };
