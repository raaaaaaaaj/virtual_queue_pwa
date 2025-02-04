// import { useState, useEffect } from "react";
// import axios from "axios";
// // import { toast } from "react-hot-toast";
// import useSocket from "./useSocket";

// const usePositionUpdate = (name, fcmToken) => {
//   const [position, setPosition] = useState(null);
//   const { socket, isConnected } = useSocket();

//   useEffect(() => {
//     if (!isConnected) return;

//     const handlePositionUpdate = async ({
//       position: newPosition,
//       name: notifiedName,
//     }) => {
//       console.log("Position Update Received:", newPosition, notifiedName);
//       if (notifiedName === name) {
//         setPosition(newPosition);
//         if (newPosition < 5) {
//           try {
//             const response = await axios.post(
//               "http://localhost:8080/api/firebase/send",
//               {
//                 title: "Update!",
//                 body: `You are now ${newPosition}th!`,
//                 devicetoken: fcmToken,
//               },
//               {
//                 headers: {
//                   "Content-Type": "application/json",
//                 },
//               },
//             );

//             console.log("Success:", response.data);
//           } catch (error) {
//             console.error("Error:", error);
//           }
//         }
//       }
//     };

//     socket.on("positionUpdate", handlePositionUpdate);

//     return () => {
//       socket.off("positionUpdate", handlePositionUpdate);
//     };
//   }, [isConnected, socket, name, fcmToken]);

//   return position;
// };

// export default usePositionUpdate;
