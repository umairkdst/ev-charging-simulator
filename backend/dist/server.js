"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const data_source_1 = require("./data-source");
const App_1 = require("./App");
const PORT = Number(process.env.PORT) || 4000;
data_source_1.AppDataSource.initialize()
    .then(() => {
    const app = (0, App_1.createApp)();
    app.listen(PORT, () => console.log(`API: http://localhost:${PORT}`));
})
    .catch((err) => {
    console.error("DB init failed:", err);
    process.exit(1);
});
