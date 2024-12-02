
const { MongoClient} = require('mongodb');

let dbConnection;
let uri = 'mongodb+srv://Mitch:iamthebest.@andy.kf1hg09.mongodb.net/GAM_App?retryWrites=true&w=majority&appName=Andy';

//'mongodb+srv://Miriam:Mongoatlas2.0@projectcluster.yu5it3n.mongodb.net/GAM_App?retryWrites=true&w=majority&appName=ProjectCluster';
//mongodb+srv://Miriam:Mongoatlas2.0@projectcluster.yu5it3n.mongodb.net/?retryWrites=true&w=majority&appName=ProjectCluster';

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(uri)
        .then((client) => {
            dbConnection = client.db()
            return cb()
        })
        .catch((err) => {
            console.log(err)
            return cb(err)
        })
    },
    getDb: () => dbConnection
};