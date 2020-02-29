const chai = require('chai');
const database = require('../database/database');
const {expect} = chai;

describe('Database!', () => {
    it("Testing database", () => {
        database.initializeDatabase((dbCollection) => {
            return new Promise((resolve, reject) => {
                dbCollection.findOne({ id: "b2d5a04f-f2d8-452d-829e-24db16737e17" }).then(result => {
                    expect(result)
                        .to.be.a('Object')
                    expect(result.title)
                        .to.be.a('string')
                        .to.equal('Zara')
                    expect(result.navigation.segments)
                        .to.be.a('array')
                    expect(result.navigation.properties.isVisibleOnList)
                        .to.be.a('boolean')
                        .to.equal(false)
                })
                resolve('OK');
            })
        }, (err) => {
            console.log(err)
        })
    })
})
