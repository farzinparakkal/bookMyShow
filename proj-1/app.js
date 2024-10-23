import express from "express";
import Router from "./router.js";
import connection from "./connection.js";
import dotenv from 'dotenv'

dotenv.config()

const app = express();


app.use(express.json({limit:"50mb"}));
app.use(express.static('frontend'));
app.use('/api', Router);


connection().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`server started at http://localhost:${process.env.PORT}`);
    });
}).catch((error) => {
    console.log(error);
});
