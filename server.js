///////////////////////////////
// DEPENDENCIES
////////////////////////////////


// get .env variables
    require("dotenv").config();

// pull PORT from .env, give default value of 3000
    const { PORT = 3000, DATABASE_URL } = process.env;

// import express
    const express = require("express");

// create application object
    const app = express();

// Import Mongoose
    const mongoose = require('mongoose')

// ===== Import Middleware == //
    const cors = require('cors')
    const morgan = require('morgan')


// ========= DB Connection ========= //

mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

// Connection Events
mongoose.connection
  .on("open", () => console.log("Your are connected to mongoose"))
  .on("close", () => console.log("Your are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

// ======== CheeseModel ========== //

const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image:String,
    
})

const Cheese = mongoose.model("Cheese", CheeseSchema);

// ====== M I D D L E W A R E ==== //
app.use(cors());
app.use(morgan('dev'));
app.use(express.json())





///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
  res.send("hello world");
});

// Index the Cheese
app.get('/cheese', async (req,res)=>{
    try {
        res.json(await Cheese.find({}));
    } catch (error){
        res.status(400).json(error);
    }
});

// Create the Cheese
app.post('/cheese', async(req,res)=>{
    try {
        res.json(await Cheese.create(req.body));
    } catch (error) {
        res.status(400).json(error)
    }
});

// Update the Cheese
app.put('/cheese/:id', async (req, res)=>{
    try {
        res.json(
            await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true})
        );
    } catch (error) {
        res.status(400).json(error)
    }
});

// Edit the Cheese
app.put('/cheese/edit/:id', async (req, res)=>{
    try {
        res.json(Cheese.findByIdAndUpdate(req.params.id, req.body, { }))
    } catch {
        res.status (400).json(error)
    }
});


// Destroy the Cheese 
app.delete('/cheese/:id', async (req, res) =>{
    try {
        res.json(await Cheese.findByIdAndRemove(req.params.id));
    } catch (error){
        res.status(400).json(error)
    }
})

// Show the Cheese 
app.get('/cheese/:id', async (req, res)=> {
    try {
        res.json(await Cheese.find(req.params.id));
    } catch (error){
        res.status(400).json(error)
    }
});


///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));