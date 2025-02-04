const PositionInfo = ({ position, calculateArrivalTime }) => (
  <div className="position-info">
    <p>Your current position: {position}</p>
    <p>Estimated arrival time: {calculateArrivalTime(position)}</p>
  </div>
);

export default PositionInfo;
