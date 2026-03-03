import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { createApp } from "./App";

const PORT = Number(process.env.PORT) || 4000;

AppDataSource.initialize()
  .then(() => {
    const app = createApp();
    app.listen(PORT, () => console.log(`API: http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("DB init failed:", err);
    process.exit(1);
  });
