import { app } from "./app";

const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL;

app.listen(PORT, () =>
  console.log(`API listening at PORT ${BASE_URL}:${PORT}`)
);