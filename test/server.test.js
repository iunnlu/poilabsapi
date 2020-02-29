const app = require('../server');
const database = require('../database/database');
const chai = require('chai');
const chaiHttp = require("chai-http");
const { expect } = chai;

chai.use(chaiHttp);
describe('Server!', () => {
    it("Testing / endpoint", done => {
        chai
            .request(app)
            .get("/")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text)
                    .to.have.equals('Welcome to poilabs api!')
                    .to.be.a('string')
                done();
            })
    })
})

describe('Routes!', () => {
    var resultArray = [];
    const from = "b2d5a04f-f2d8-452d-829e-24db16737e17";
    const to = "f3bc0c08-81f2-4cf2-b6f2-c9ea88e284cc";
    before((done) => {
        database.initializeDatabase((dbCollection) => {
            return new Promise((resolve, reject) => {
                dbCollection.find({ 'navigation.properties.isVisibleOnList': true }).toArray((err, result) => {
                    result.map(item => {
                        resultArray.push({
                            id: item.id,
                            title: item.title,
                            description: item.description,
                            location: item.location
                        })
                    })
                    resolve('OK');
                    done();
                })
            })
        }, (err) => {
            console.log(err)
        })
    })
    it("Testing /api/childs endpoint", done => {
        chai
            .request(app)
            .get("/api/childs")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.result)
                    .to.deep.equal(resultArray)
                    .to.be.a('array')
                done();
            })
    })
    it("Testing /api/route endpoint", done => {
        chai
            .request(app)
            .get(`/api/route?from=${from}&to=${to}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.route)
                    .to.deep.equal([
                        { id: 'b2d5a04f-f2d8-452d-829e-24db16737e17', weight: 7 },
                        { id: '10e4e046-05f2-4ebc-92bb-0ad7313a936c', weight: 4.5 },
                        { id: 'f3bc0c08-81f2-4cf2-b6f2-c9ea88e284cc' }
                    ])
                    .to.be.a('array');
                expect(res.body.dist)
                    .have.equals(11.5)
                done();
            })
    })
})
