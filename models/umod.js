var MongoDB		= require('mongodb').MongoClient;
var Mongourl	= "mongodb://localhost:27017/mydb";

MongoDB.connect(Mongourl, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});