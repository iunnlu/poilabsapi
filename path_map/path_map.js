const database = require('../database/database');

const Graph = require('node-dijkstra');
const route = new Graph();

function pathMap () {
    return new Promise((res, rej) => {
        database.initializeDatabase((dbCollection) => {   //Success Callback
            return new Promise((resolve, reject) => {
                dbCollection.find().toArray((err, result) => {
                    result.map(item => {
                        var itemObject = {};
                        if(item.navigation.segments != undefined){
                            item.navigation.segments.map(point => {
                                itemObject[point.id] = point.weight;
                            })
                            route.addNode(item.id, itemObject)
                        }
                    })
                    resolve('OK');
                })
            }).then(() => res('OK'))
        }, (err) => {   //Failure Callback
            console.log("Error : ", err);
        })
    }).then(() => {
        return route;
    })
}

module.exports = { pathMap };