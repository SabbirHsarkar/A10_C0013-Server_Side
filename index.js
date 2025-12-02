
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express= require('express');
const cors= require('cors');
require('dotenv').config();

const port =3000;
const app=express();
app.use(cors());
app.use(express.json());



const uri = process.env.DB_URI;



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();

    const database=client.db('homeNest');
    const homeNest=database.collection('properties');

    //Post service to DB

    app.post('/properties',async(req,res)=>{
      const data=req.body;
      console.log(data);

      const result= await homeNest.insertOne(data);
      res.send(result);
      
    })
  //Get services from DB
  app.get('/properties',async(req,res)=>{
    const result= await homeNest.find().toArray();
    res.send(result);
  })

  app.get('/properties/:id',async(req,res)=>{
   
    const id=req.params
    console.log(id);

    const query ={_id: new ObjectId(id)}
    const result=await homeNest.findOne(query)
    res.send(result)
    
  })

  app.get('/my-properties',async(req,res)=>{

    const {email}= req.query
   const query={email:email}
   const result=await homeNest.find(query).toArray()
   res.send(result);
    
  })


   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{

    res.send('Hello Sabbir');
})

app.listen(port,()=>{
    console.log(`server is running ${port}`)
})
