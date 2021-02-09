var expect  = require('chai').expect;
var request = require('request');

const url = 'http://69.87.218.194:3000/texttoimage';
const wrongurl = 'http://69.87.218.194:3000/texttoimageWRONG';

// Be sure to start the api server before running tests and then run 
// npm test
it('Testing non existent method', function(done) {
    request(wrongurl, function(error, response, body) {
        expect(response.statusCode).to.equal(404);
        done();
    });
});

it('Testing API status', function(done) {
    request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});


it('Test API response', function(done) {
    request( url , function(error, response, body) {
        var jsonbody = JSON.parse(response.body);
        expect(jsonbody[0]['result']).to.equals("success");
        done();
    });
});


// Test jsonbody[0]['url'] is a valid  url that returns image

// test jsonbody[0]['words'] contains words