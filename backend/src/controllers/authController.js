const checkAuth = (req, res) => {
  // Simulate an authenticated user
  res.json({
    isAuthenticated: true,
    user: {
      id: "123",
      name: "John Doe",
    },
  });
};

module.exports = { checkAuth };
