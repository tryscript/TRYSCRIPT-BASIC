const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const finale = require('finale-rest')
var DataTypes = require('sequelize/lib/data-types');
var path = require('path');
var fs = require('fs');

let app = express()
app.use(cors())
app.use(bodyParser.json())



//perform worst with lines above 
//app.use(function (req, res) {
//  res.set('Cache-control', 'private')
//})

app.get('/',(req, res) => {
  console.log('LOGGED')
  // attempt two 
  res.set('Cache-control', 'max-age=0, must-revalidate')
  res.send('get was accessed !')

 

})

app.get('/files',(req, res) => {
  console.log('LOGGED')
  res.send('files was accessed !')
})


////pp.post('/upload',(req, res) => {
  //console.log('file uploaded')
 // res.set({
   // "Content-Type": "multipart/form-data"
 // })
  
  //res.send('file was uploaded')
  //res.send(res)
//})


//let database = new Sequelize({
// For ease of this tutorial, we are going to use SQLite to limit dependencies
let database =  new Sequelize({
  dialect: 'sqlite',
  storage: './WorkWaveData.sqlite'

})



// Define our Post model
// id, createdAt, and updatedAt are added by sequelize automatically
let point = database.define('points', {
  title: Sequelize.STRING,
  body: Sequelize.TEXT,
  type :{ type: DataTypes.STRING, allowNull: false,},
  startTime:Sequelize.NUMBER,
  EndTime:Sequelize.NUMBER,
/// below two values can be deleted in next db reset 
  timeValueT: Sequelize.DECIMAL,
  timeValueNUMC:Sequelize.INTEGER,
  // these three are most important values 
  ManualTime:Sequelize.INTEGER,
  Difference: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    validate: {
      len: [2,80] 
                },
    get() {
      return   ((+new Date(this.EndTime) - +new Date(this.startTime))/3600000) ; 
 
    },
    set(value) {
      throw new Error('Do not try to set the `Difference` value!');
    },

  },
  NUMCircles: {
    type: DataTypes.VIRTUAL,
    get() {
      if (  (  this.ManualTime !== null) ) {
        {  return   this.ManualTime/2 ; }
      }

      else if (  ( ((+new Date(this.EndTime) - +new Date(this.startTime)))/3600000 ) > 80.0 ) {
        {  return   " error visual log , time value > 80 hours" ; }
      }
      else if ( (  ( ((+new Date(this.EndTime) - +new Date(this.startTime)))/3600000 ) > 2.0) ){
        return   ((+new Date(this.EndTime) - +new Date(this.startTime))/7200000) ; 
      }
      else if ( (  ( ((+new Date(this.EndTime) - +new Date(this.startTime)))/3600000 ) == 2.0) ){
        return   ((+new Date(this.EndTime) - +new Date(this.startTime))/7200000) ; 
      }
      else {  return   " error visual log , time value is less than 2 hours" ; }
    
    },
    set(value) {
      throw new Error('Do not try to set the `Difference` value!');
    }
  }
})





let Rhythm = database.define('Rhythms', {
  title: Sequelize.STRING,
  body: Sequelize.TEXT,
  type :Sequelize.STRING,
})



let cluster = database.define('clusters', {
  ClusterTitle: Sequelize.STRING,})


let topic = database.define('topics', {
  ClusterTitle: Sequelize.TEXT,
  ClusterTopic: Sequelize.STRING,
  TopicDetails: Sequelize.STRING,
  TopicMObjecive: Sequelize.STRING,
})

  let workwave = database.define('wwaves', {
    WaveTitle: Sequelize.STRING,
    ClusterTitle: Sequelize.TEXT,
    ClusterTopic: Sequelize.STRING,
  })

    

// Testing assoications impact on app save 

//each Cluster HasMany topic 
//topic belong to cluster
//Topic HasMany workwave
//workwave BelongsTo topic
//workwave HasMany Points
//point belongs to workwave


// points are not being sent yet ?
//cluster.hasMany(topic);
//topic.belongsTo(cluster); 
//topic.hasMany(workwave);
//workwave.hasMany(point);






// Initialize finale
finale.initialize({
  app: app,
  sequelize: database
})

// Create the dynamic REST resource for our Point model
let PointResource = finale.resource({
  model: point,workwave,
  endpoints: ['/points' , '/points/:id','/waves','/waves/:id']
})

let RhythmResource = finale.resource({
  model: Rhythm,
  endpoints: ['/Rhythms' , '/Rhythms/:id',]
})

let ClusterResource = finale.resource({
  model: cluster, 
  endpoints: [ '/clusters','/clusters/:id'  ]
})

let TopicResource = finale.resource({
  model: topic, cluster,
  endpoints: ['/topics','/topics/:id' , '/clusters','/clusters/:id' ]
})

let WaveResource = finale.resource({
  model: workwave,topic, cluster,
  endpoints: ['/waves','/waves/:id','/topics','/topics/:id' , '/clusters','/clusters/:id' ]
})


//  download data 


app.get('/points',(req, res) => {
  if( req.url === "/download") {
  console.log('downloaded accessed ')
  // attempt two 
  res.set('Cache-control', 'max-age=0, must-revalidate')
  res.send('downloaded  was accessed !')

 
res.writeHead(200, {
  'Content-Type': 'application/json-my-attachment',
  "content-disposition": "attachment; filename=\"myjsonfile.json\""
});

var jsonObj =  {"item ":"vanilla icecream "}; 
res.send(JSON.stringify(jsonObj));
  }
  else {
    var filePath = req.url;
    filePath = (filePath === "/") ? "index.html" : filePath;
    filePath = path.join(__dirname, "public", filePath);
    console.log(filePath);
    fs.stat(filePath, function (err, stat) {
        if(!err) {
            res.sendFile(filePath);
        } else {
            res.writeHead(404);
            res.end("file not found");
        }
    });
  }

})








// Resets the database and launches the express app on :8081

 // .sync({ force: true })
 database.sync().then(() => {
    app.listen( 8081, () => {
      console.log('listening to port localhost:8081')
      console.log( "is the endTime SELECTED");
    })
  })