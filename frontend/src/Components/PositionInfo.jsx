const PositionInfo = ({ position, waitTime, calculateArrivalTime }) => {
  return (
    <div>
      <p>Position: {position}</p>
      <p>Wait Time: {waitTime} minutes</p>
      <p>Estimated Arrival Time: {calculateArrivalTime}</p>
    </div>
  );
};

export default PositionInfo;
