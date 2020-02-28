const express = require('express');
const router = express.Router();

const database = require('../database/database');
const path_map = require('../path_map/path_map');

var allMap = {};

path_map.pathMap().then((route) => {
    allMap = route;
})

router.get('/childs', (req, res) => {
    database.initializeDatabase((dbCollection) => {   //Success Callback
        return new Promise((resolve, reject) => {
            dbCollection.find({ 'navigation.properties.isVisibleOnList': true }).toArray((err, result) => {
                const array = [];
                result.map(item => {
                    array.push({
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        location: item.location
                    })
                })
                res.send(array);
                resolve('OK');
            })
        })
    }, (err) => {   //Failure Callback
        console.log("Error : ", err);
        res.json({
            error: "Database connection error."
        })
    })
})

router.get('/route', (req, res) => {
    var resultArray = [];
    var prevPath, nextPath = "";
    const from = req.query.from;
    const to = req.query.to;
    const shortestPathMap = allMap.path(from, to, { cost: true });
    console.log(shortestPathMap);
    database.initializeDatabase((dbCollection) => {   //Success Callback
        return new Promise((resolve, reject) => {
            try {
                shortestPathMap.path.map((item, index) => {
                    if (index === 0) {
                        prevPath = item;
                    } else {
                        dbCollection.find({ id: prevPath }).toArray((err, result) => {
                            nextPath = item;
                            result[0].navigation.segments.map(resultItem => {
                                if (resultItem.id === nextPath) {
                                    resultArray = [...resultArray, {
                                        id: result[0].id,
                                        weight: resultItem.weight
                                    }]
                                }
                            })
                            if ((index + 1) === shortestPathMap.path.length) {
                                resultArray = [...resultArray, {
                                    id: prevPath,
                                }]
                                console.log(resultArray)
                                res.json({
                                    dist: shortestPathMap.cost,
                                    route: resultArray
                                })
                                resolve('OK');
                            }
                        })
                        prevPath = item;
                    }
                })
            } catch (e) {
                console.log(e);
                res.json({
                    error: "The shortest path could not be calculated. Please check the parameters."
                })
                resolve('OK');
            }
        })
    }, (err) => {   //Failure Callback
        console.log("Error : ", err);
        res.json({
            error: "Database connection error."
        })
    })


})

module.exports = router;