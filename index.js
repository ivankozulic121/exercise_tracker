const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));


app.use(cors())
app.use(express.static('public'))


app.post('/api/users', async(req, res) =>{
    //const { username } = req.body
    console.log("REQUEST:" + JSON.stringify(req.body));
    const user = await User.create({username: req.body.username});
    console.log("USERNAME:" +  user.username);
    //await user.save();
    return res.json({"username":user.username, "_id": user._id});
    
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});





// Replace the uri string with your connection string.
/*const uri = "mongodb+srv://ivankozulic121:mungosilustica@cluster0.6wklnye.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const client = new MongoClient(uri);
async function run() {
  try {
    const database = client.db('ex_tracker');
    const movies = database.collection('exercises');
    // Query for a movie that has the title 'Back to the Future'
    const query = { title: 'Back to the Future' };
    const movie = await movies.findOne(query);
    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);*/


//const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uri = "mongodb://127.0.0.1:27017/local";
const Teacher = mongoose.model('Teacher', new Schema({first_name: String, last_name: String, work_years: Number}))
const Exercise = mongoose.model('Exercise', new Schema({user: {type:mongoose.ObjectId, ref:'User'}, description: String, duration: Number, date:Date}))
const User = mongoose.model('User', new Schema({username: String}))
//const teacher1 = new Teacher({first_name: 'Predo', last_name: 'Predic', work_years: 6})
//Teacher.create({first_name: 'Predo', last_name: 'Predic', work_years: 6})
const connectDB = async () => {
  try {
    const conn = await mongoose.connect((uri), {
      useNewUrlParser: true,                                  
    });
    console.log(`MongoDB Connected: {conn.connection.host}`);
    //const Teacher = await conn.model('Teacher', new Schema({first_name: String, last_name: String, work_years: Number}))
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
connectDB();

//const { MongoClient } = require("mongodb");
// Connection URI
/*const uri =
  "mongodb://127.0.0.1:27017/";
// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    await listDatabases(client);
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

async function listDatabases(client){
  const dbList = await client.db().admin().listDatabases();
  console.log(dbList);
}
/*{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}*/



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

//module.exports = mongoose.model("Teacher", Teacher)
