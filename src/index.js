const express = require("express");
const app = express();
//const quotes = require("./quotes.json");
const userRouter = require("../routes/userRoutes");
const noteRouter = require("../routes/noteRoutes");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const mongoose = require("mongoose");

app.use(express.json()); //convert request body to json

//Access these api from anywhere
app.use(cors());


//middleware implementention
// app.use((req, res, next)=>{
//     console.log("HTTP Method - " + req.method + " , URL - " + req.url);
//     next();
// });

app.use("/users", userRouter);
app.use("/note", noteRouter);

app.get("/", (req, res)=>{
    res.send("Notes API From Sujoy");
});

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    app.listen(PORT, ()=>{
        console.log("Server started on port no : " + PORT);
    });
})
.catch((error)=>{
    console.log(error)
});

// app.get("/quote", (req,res)=>{
//     res.status(200).json(quotes);
// });

// app.get("/random", (req,res)=>{
//     let index = Math.floor(Math.random()*quotes.length)
//     let quote = quotes[index];
//     res.status(200).json(quote);
// });

