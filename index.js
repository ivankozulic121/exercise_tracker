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

app.get('/api/users', async (req,res) => {
    const userList = await User.find({})
    //console.log("USER LIST:" + userList);
    return res.json(userList);
})


app.post('/api/users', async(req, res) =>{
    //const { username } = req.body
    console.log("REQUEST:" + JSON.stringify(req.body));
    const user = await User.create({username: req.body.username});
    console.log("USERNAME:" +  user.username);
    //await user.save();
    return res.json({"username":user.username, "_id": user._id});
    
})

app.post('/api/users/:_id/exercises', async(req,res)=>{
   const query = User.where({_id: req.params._id})
   const user = await query.findOne()

   if(user) {
    const exercise = await Exercise.create({user: user._id, username: user.username, description: req.body.description, duration: req.body.duration, date: req.body.date})
    return res.json({"_id": user._id, "username": user.username, "date": exercise.date, "duration": exercise.duration, "description": exercise.description});
   }

   else {
    return mongoose.Error.CastError;
   }
})
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users/:_id/exercises', async(req, res) =>{
  const query = User.where({_id: req.params._id})
  const userq = await query.findOne();
  //ovo popravi u jednu liniju sve
  console.log("U:" + userq);

  if(userq) {
    const query1 =  Exercise.where({user: userq._id})
    console.log("Q:" + query);
    
    //const count = await query1.countDocuments();

    const exercisesbyUser = await query1.find({});
    //mora await na count
    const count =  await Exercise.countDocuments({user: userq._id})

    console.log("E:" + exercisesbyUser + count );
    return res.json(exercisesbyUser);
  }

  else {
    return mongoose.Error.CastError;
   }
})

app.get('/api/users/:_id/logs', async(req, res) => {
  
  const user = await User.where({_id: req.params._id}).findOne();

  if (user) {
    const userExercises =  await Exercise.where({user: user._id}).find({}).select({_id:0, __v:0, user:0}); // _id:0 znaci da se selektuju sve kolone sem _id
    const numOfExercises = await Exercise.countDocuments({user: user._id})

    return res.json({username: user.username, count: numOfExercises, _id: user._id, log: userExercises})
  }
  else {
    return mongoose.Error.CastError;
  }
})





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
//const Log = mongoose.model('Log', new Schema({user:{type:mongoose.ObjectId, ref:'User'},count:0}))
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
