const cors = require("cors");

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://192.168.0.105:5173",
    "http://localhost:4173",
  ],
};

module.exports = cors(corsOptions);
