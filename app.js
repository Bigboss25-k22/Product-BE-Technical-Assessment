require("dotenv").config();

const express = require("express");
const db = require("./config/db");
const route = require("./routes");
const models = require("./models");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');


const app = express();
const port = process.env.PORT || 8081;

// Kết nối và đồng bộ cơ sở dữ liệu
db.authenticate()
    .then(() => {
        console.log("Database connected successfully!");
        // Sync tất cả các models với database
        return db.sync(); // Chỉ tạo bảng nếu chưa tồn tại
    })
    .then(() => {
        console.log("Database synchronized successfully!");
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err);
    });

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Định tuyến
route(app);

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});