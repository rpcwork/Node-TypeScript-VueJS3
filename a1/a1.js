/**
 * TEXT TO IMAGE API
 * **********************************************************************************************
 * 
 * DESCRIPTION:
 * The solution presents a test to image API available at: http://69.87.218.194:3000/texttoimage 
 * (please see instructions on how to start server before testing it)
 * First, it makes a POST request to projectnametor.p.rapidapi.com and gets a requested number of words. 
 * Then, it makes a POST to img4me.p.rapidapi.com with body containing the above words and gets back a URL of the image 
 * containing the above words.
 * 
 * 
 * QUICKSTART HELP:
 *   - Log into the server at : 69.87.218.194
 *   - cd /root/rchaube/a1;
 *   - npm run dev
 *   - Then in a browser hit: http://69.87.218.194:3000/texttoimage
 * 
 *
 * REQUEST: 
 *  GET HTTP/1.1
 *  Content-Type: application/json
 *  Host: http://69.87.218.194:3000/texttoimage
 * 
 * 
 * RESPONSE: (expect for mocha/chai assert test validation)
 * 
 *   [
 *       {"words":"frank fumbling fabulous famous flowery fine furtive fast frightened finger"},
 *       {"imageurl":"http://img4me.com/XH6i.png"}
 *  ]
 * 
 * * * * * * * */


/**
 * Function: callGetWordsAPI()
 * 
 * @param none 
 * @response: {JSON containing words or error}
 * 
 * Makes https call to external API projectnametor.p.rapidapi.com
 */
function callGetWordsAPI() {
    return new Promise((resolve, reject) => {
            
            // prepare https call
            const http = require('https')

            // specify options
            const options = {
                "method": "GET",
                "hostname": "projectnametor.p.rapidapi.com",
                "port": null,
                "path": "/?atg=10",
                "headers": {
                    "content-type": "application/json",
                    "x-rapidapi-key": "3038d2c940msh46f89ca6d8375d6p1c6597jsn9b6ef5652d4f",
                    "x-rapidapi-host": "projectnametor.p.rapidapi.com",
                    "useQueryString": true
                }
            };
            
            // launch https request
            const req = http.request(options, res => {
                var body = [];
                res.on('data', (chunk) => {
                    body.push(chunk);
                }).on('end', () => {
                    body = Buffer.concat(body).toString();
                    resolve(body);
                }).on('error', 
                    error => {
                        // display for demo
                        console.log(error);
                        // show proper message to APi caller
                        res.json({ result: 'error', message: 'Problem encountered while reading response from Get Words API. API unavailable for administrative maintenance. Our SRE Team is working to rectify the issue.' });
                        // will be caught by fallthrough sentry block
                        //throw new Error("Error logging to Sentry " + error.stack);
                });
            })

            // handle errors
            req.on('error', error => {
                // display for demo
                console.log(error);
                // show proper message to APi caller
                res.json({ result: 'error', message: 'Problem encountered with dependent Get Words API. API unavailable for administrative maintenance. Our SRE Team is working to get this back online.' });
                // will be caught by fallthrough sentry block
                // throw new Error("Error logging to Sentry " + error.stack);
                
            })

            req.end()       

    });
}

/**
 * Function: callTextToimageAPI()
 * 
 * @param required {string} inputstr The input string to convert to text
 * @response {string} URL of the created image 
 * 
 * Makes https call to external API img4me.p.rapidapi.com
 */
function callTextToimageAPI(inputstr) {
    return new Promise((resolve, reject) => {

        // prepare https call
        const qs = require("querystring");
        const http = require("https");

        // specify options
        const options = {
            "method": "GET",
            "hostname": "img4me.p.rapidapi.com",
            "port": null,
            "path": "/?text=" + encodeURIComponent(inputstr) + "&fcolor=000000&bcolor=FFFFFF&font=trebuchet&size=12&type=png",
            "headers": {
                "x-rapidapi-key": "3038d2c940msh46f89ca6d8375d6p1c6597jsn9b6ef5652d4f",
                "x-rapidapi-host": "img4me.p.rapidapi.com",
                "useQueryString": true
            }
        };  

        // launch https request
        const req = http.request(options, res => {
            var body = [];
            res.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(body).toString();
                resolve(body);
            }).on('error', 
                error => {
                    // display for demo
                    console.log(error);
                    // show proper message to APi caller
                    res.json({ result: 'error', message: 'Problem encountered while reading response from Text 2 Image API. API unavailable for administrative maintenance. Our SRE Team is working to rectify the issue.' });
                    // will be caught by fallthrough sentry block
                    //throw new Error("Error logging to Sentry " + error.stack);
                })
        });

        // handle errors
        req.on('error', error => {
            // display for demo
            console.log(error);
            // show proper message to APi caller
            res.json({ result: 'error', message: 'Problem encountered with dependent  Text 2 Image API. API unavailable for administrative maintenance. Our SRE Team is working to get this back online.' });
            // will be caught by fallthrough sentry block
            //throw new Error("Error logging to Sentry " + error.stack);
        })

        req.end()       

    });
}


/**
 * Main app
 * * * * * * * */
// Sentry error logging service boilerplate
// import * as Sentry from "@sentry/node";
// Sentry.init({ dsn: "https://examplePublicKey@o0.ingest.sentry.io/0" });

var express = require("express");
var app = express();    

/* Sentry Boilerplate
app.use(
    Sentry.Handlers.requestHandler({
        serverName: false,
        user: ["email"],
    })
);
app.use(
        Sentry.Handlers.errorHandler({
            shouldHandleError(error) {
            // Capture all 404 and 500 errors
            if (error.status === 404 || error.status === 500) {
                return true;
            }
            return false;
            },
        })
);
// Fallthrough Senrty error handler block
app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
    res.send(JSON.stringify({ result: 'error', message: 'API unavailable for administrative maintenance. Our SRE Team is working to get this back online.' }));
});
*/

let resultstr = null;

// API entry point
app.get("/texttoimage", (req, res, next) => {
    res.setHeader('X-Powered-By', 'Ironman');
    res.setHeader('Content-Type', 'application/json');
    
    // Call the get words API and chain the call into the text to image API
    callGetWordsAPI()
    .then( quoteresult => { 
        const resultparsed = JSON.parse(quoteresult);
        resultstr = resultparsed["data"].join(' ');
        return callTextToimageAPI(resultstr)
    }).then( scresult => {
        // preapre response for called 
        var jresponse = [
            {"result" : "success"},
            {"words": resultstr},
            {"imageurl" : scresult}
        ];
        // send response
        res.send(JSON.stringify(jresponse));
    }).catch((error) => {
        // display for demo
        console.log(error);
        // show proper message to APi caller
        res.json({ result: 'error', message: 'API unavailable for administrative maintenance. Our SRE Team is working to get this back online.' });
        // will be caught by fallthrough sentry block
        //throw new Error("Error logging to Sentry " + error.stack);
    });

});

// Launch the app
app.listen(3000, () => {
    // To do: Send event reports of service being started to ELK Logging space
    console.log("Server running on port 3000");
});
    
