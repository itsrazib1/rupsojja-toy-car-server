const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middelware

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4hmio3i.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

const carCollection = client.db('carZone').collection('cars');
const cartCollection = client.db('carZone').collection('cart');

app.get('/cars', async(req , res) => {
    const carsor = carCollection.find();
    const result = await carsor.toArray();

    res.send(result);
})

app.get('/cars/:id', async(req , res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id) }

const options = {
    projection: {name: 1 ,Price: 1 ,_id: 1,url: 1,Sellername: 1,Subcategory: 1,quantity: 1,Rating: 1,description:1,},
};

    const result = await carCollection.findOne(query,options );
    res.send(result);
})


// booking

app.get('/cart', async(req, res) => {
let query = {};
if(req.query?.email){
    query = {email: req.query.email}
}
    const result = await cartCollection.find(query).toArray();
    res.send(result);
  });
  
app.post('/toys',async (req,res)=>{
  const newToys = req.body;
  console.log(newToys);
  const result = await carCollection.insertOne(newToys);
  res.send(result);

})




app.post('/cart',async (req,res) => {
    const cart = req.body;
    console.log(cart);
    const result = await cartCollection.insertOne(cart);
    res.send(result);
});

app.delete('/cart/:id',async (req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await cartCollection.deleteOne(query);
  res.send(result);
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/' , (req,res) => {
    res.send('RTCS Is Running')
})

app.listen(port , () => {
    console.log(`RTCS is Running on port ${port} `);
})