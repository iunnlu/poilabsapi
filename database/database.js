const MongoClient = require('mongodb').MongoClient;

const dbConnectionUrl = "mongodb+srv://admin:5224667@poilabsapi-srl3o.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "poilabs_database";
const dbCollectionName = "points";

function initializeDatabase(successCallback, failureCallback) {
    MongoClient.connect(dbConnectionUrl, async (err, dbStatus) => {
        if (err) {
            console.log(`[MongoDB connection] ERROR: ${err}`);
            failureCallback(err);
        } else {
            const dbObject = dbStatus.db(dbName);
            const dbCollection = dbObject.collection(dbCollectionName);
            console.log("[MongoDB connection] SUCCESS");
            successCallback(dbCollection).then(() => {
                try {
                    dbStatus.close().then(() => console.log("Database successfuly closed!"));
                } catch (err) {
                    console.log("Error : ", err);
                }
            })
        }
    })
}

module.exports = { initializeDatabase };
