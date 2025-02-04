const RoleToggle = ({ role, toggleRole }) => (
  <div className="role-toggle">
    <span>Customer</span>
    <div
      className={`slider ${role === "admin" ? "active" : ""}`}
      onClick={toggleRole}
    ></div>
    <span>Admin</span>
  </div>
);

export default RoleToggle;
