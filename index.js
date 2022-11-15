const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config()

app.use(cors())
app.use(express.json())

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rbojs1n.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri);

// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

async function run(){
  try{
     const serviceCollection = client.db("myServiceCollection").collection("services")
     const reviewCollection = client.db("myServiceCollection").collection("reviews")


     app.get("/services", async (req, res)=>{
      const cursor = serviceCollection.find({}).limit(3)
      const services =await cursor.toArray()
      res.send(services)
     })
     app.get("/allServices", async (req, res)=>{
      const cursor = serviceCollection.find({})
      const allServices =await cursor.toArray()
      res.send(allServices)
     })

     app.get("/services/:id", async(req, res)=>{
      const id = req.params.id
      const query = {_id: ObjectId(id)}
      const service =await serviceCollection.findOne(query)
      res.send(service)
     })


     app.get("/reviews", async(req, res)=>{
      console.log(req.query);
      let query = {}

      if(req.query.email){
        query = {
          email: req.query.email
        }
      }

      const cursor = reviewCollection.find(query)
      const reviews =await cursor.toArray()
      res.send(reviews)
     })

     app.post("/reviews", async(req, res)=>{
      const review = req.body;
      const addReview = await reviewCollection.insertOne(review)
      res.send(addReview);
     })


  }
  finally{

  }

}
run().catch(error=>console.error(error))



app.get("/", (req, res)=>{
  res.send("my server is running")
})

app.listen(port, ()=>{
  console.log(`web server is running${port}`);
})