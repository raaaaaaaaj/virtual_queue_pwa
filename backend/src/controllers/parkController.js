let parkInfo = {
  center: { lat: 40.7128, lng: -74.006 }, // Example coordinates
  radius: 1000, // Example radius in meters
};

const getParkInfo = (req, res) => {
  res.status(200).json(parkInfo);
};

const saveParkInfo = (req, res) => {
  parkInfo = req.body;
  res.status(200).json({ message: "Park info saved successfully" });
};

module.exports = { getParkInfo, saveParkInfo };
