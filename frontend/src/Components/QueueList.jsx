const QueueList = ({ queue }) => (
  <div className="queue-list">
    <h3>Queue</h3>
    <ul>
      {Array.isArray(queue) &&
        queue.map((customer, index) => (
          <li key={index}>
            {customer.userId} - Party Size: {customer.party_size} - Position:{" "}
            {customer.position}
          </li>
        ))}
    </ul>
  </div>
);

export default QueueList;
