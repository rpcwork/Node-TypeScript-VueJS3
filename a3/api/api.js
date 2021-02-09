   /**
 * PAGE HITS API 
 * **********************************************************************************************
 * 
 * DESCRIPTION:
 * This API is used by the Counter component in the Page Hits Webapps
 * 
 * 
 * QUICKSTART HELP:
 *   - Log into the server at : 69.87.218.194
 *   - cd /root/rchaube/a3/api/;
 *   - npm run dev
 *   - Then in a browser hit: http://69.87.218.194:3000/getpagehits
 * 
 *
 * ENDPOINTS:
 * /getpagehits 
 * REQUEST:
 *  GET HTTP/1.1
 *  Content-Type: application/json
 *  Host: http://69.87.218.194:3000/texttoimage
 * 
 * RESPONSE
 *  [{ pagename: "Page 1", pagehits: 5}, { pagename: "Page 2", pagehits: 3}, { pagename: "Page 3", pagehits: 8}]
 *  or 
 *  { result: 'error', message: 'API unavailable for administrative maintenance. Our SRE Team is working to get this back online.' }
 * 
 * 
 * 
 * /incrementpagehit
 *  REQUEST:
 *  POST /incrementpagehit HTTP/1.1
 *  HOST: 69.87.218.194:3000
 *  Content-Type: application/json
 * 
 *  { 
 *      pagename: "Page 1", 
 *      pagehits: 5
 *  }
 * 
 *  RESPONSE
 *  { "result": "success", "page": ""Page 2"} or error
 *  or
 * { result: 'error', message: 'API unavailable for administrative maintenance. Our SRE Team is working to get this back online.' }
 * 
 * * * * * * * */

    var express = require("express");
    var cors = require('cors')
    var appapi = express();
    appapi.use(cors());
    appapi.use(express.json());
    
    try{
        // Assume that this is coming from the mongodb pages collection
        var rpagehits = [{ pagename: "Page 1", pagehits: 5}, { pagename: "Page 2", pagehits: 3}, { pagename: "Page 3", pagehits: 8}]; 

        // End point method gateways
        appapi.get('/getpagehits', (req, res) => res.send(rpagehits));
        
        appapi.post('/incrementpagehit', (req, res) => {
            const pagename = req.body.page;
            res.json({ result: 'success', page: pagename})
        
        });

        appapi.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    }catch(e) {
        if(e instanceof Error) {
            // To do: Log error stack to Sentry logging service for triage and notification
            // return error 
            res.json({ result: 'error', message: 'API unavailable for administrative maintenance. Our SRE Team is working to get this back online.' });
        }
        else {
            // To do: Log error stack to Sentry logging service for triage and notification
            // if error is of unknown type, throw it so that caller can handle it
            res.json({ result: 'error', message: 'API unavailable for administrative maintenance.  Our SRE Team is working to get this back online.' });
        }
    }