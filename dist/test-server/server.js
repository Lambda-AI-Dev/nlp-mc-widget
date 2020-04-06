const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
const port = process.env.PORT || 8000;

app.use(express.static("client/build"));
app.get("*", (request, response) => {
  response.sendFile(path.join(__dirname, "client", "build", "test.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
