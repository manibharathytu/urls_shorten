var http = require('http');
var md5 = require('md5');
const {
    base64encode,
    base64decode
} = require('nodejs-base64');
var pickle = require('pickle');
var fs = require('fs')

let urlMap = new Map()

const fetchDB = function () {
    fs.readFile('pickle_db', function (err, data) {
        pickle.loads(data, function (dataLoaded) {
            urlMap = dataLoaded;
        })
    })
}
fetchDB();

const syncDB = function () {
    pickle.dumps(urlMap, function (pickled) {
        fs.writeFile('pickle_db', pickled, function (err) {
            if (err) console.log("Saving error");
            console.log("Saved")
        })
    })
}
setInterval(syncDB, 60000);

const handleRequest = function (req, res) {

    // res.write("<script>var urls=['https://www.google.com/search?q=youtube&oq=yout&aqs=chrome.1.69i57j0l6j5.1870j0j7&sourceid=chrome&ie=UTF-8','https://www.google.com/search?q=mani&oq=mani+&aqs=chrome..69i57j69i60l2.845j0j7&sourceid=chrome&ie=UTF-8','https://www.google.com/search?q=god&oq=god&aqs=chrome..69i57l2j69i59j69i60l3.1752j0j7&sourceid=chrome&ie=UTF-8','https://chrome.google.com/webstore/detail/dotvpn-%E2%80%94-a-better-way-to/kpiecbcckbofpmkkkdibbllpinceiihk?hl=en'];urls.forEach(urlOpen);function urlOpen(url, i){    window.open(url);}</script>")
    //     res.end(); //end the response
    //     return;
        const path = String(req.url);
    if (path.startsWith('/save/')) {
        const base64Str = path.substring(6, path.length)
        saveUrlMap(base64Str);
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*'
        });

        res.write('saved'); //write a response to the client
        res.end(); //end the response
        return;
    }
    query = path.substring(1, path.length)
    const urls = getUrls(query)
    let responseText = '<script>var urls=' + gettUrlsStr(urls) + htmlTemplate;
    if (!urls) {
        responseText += "Not found"
    }
    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*'
    });

    res.write(responseText); //write a response to the client
    res.end(); //end the response
}

const getUrls = function (query) {
    if (!urlMap[query]) {
        return;
    }
    const base64Str = urlMap[query];
    let decoded = base64decode(base64Str);
    const urls = decoded.split(' ');
    return urls;
}

const saveUrlMap = function (base64Str) {
    const hash = md5(base64Str)
    urlMap[hash] = base64Str;
}

//create a server object:
http.createServer(handleRequest)
    .listen(80); //the server object listens on port 8080


const htmlTemplate = "urls.forEach(urlOpen);function urlOpen(url, i){    window.open(url);}</script>"

const gettUrlsStr = function (urls) {
    let urlStr = "["
    for (i in urls) {
        urlStr += "'"
        urlStr += urls[i]
        urlStr += "',"
    }
    urlStr = urlStr.substring(0, urlStr.length - 1)
    urlStr += "];";
    return urlStr;
}