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
            // console.log("Saved")
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
        console.log("inside save")
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
    let responseText = logo+'<script>var urls=' + gettUrlsStr(urls) + htmlTemplate;
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
        return; // is this safe? is empty list safer?
    }
    const base64Str = urlMap[query];
    let decoded = base64decode(base64Str);
    const urls = decoded.split(' ');
    return urls;
}

const saveUrlMap = function (base64Str) {
    const hash = md5(base64Str)
    urlMap[hash] = base64Str;
    console.log('saved: '+ hash+' : '+base64Str)
}

//create a server object:
http.createServer(handleRequest)
    .listen(8080); //the server object listens on port 8080


const htmlTemplate = "urls.forEach(urlOpen);function urlOpen(url, i){    window.open(url);}</script>"
 const logo = '<div class="block-content" style="width:200px;height:200px"><div class="block-logo"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 300.0000305175781 114.99004364013672" overflow="visible"><defs id="SvgjsDefs75208"></defs><g id="SvgjsG75209" transform="scale(2.057037536820972)" opacity="1"><g id="SvgjsG75210" class="zryDjjvqN" transform="translate(0, 0) scale(0.559008)" light-content="false" non-strokable="false" fill="#05f575"><path d="M24 0h76v76c0 13.255-10.745 24-24 24H0V24C0 10.745 10.745 0 24 0z"></path></g><g id="SvgjsG75211" class="yq9kRsZTWk" transform="translate(8.123866068625079, 7.2315966286717055) scale(0.39715149262443716)" light-content="true" non-strokable="false" fill="#ffffff"><path d="M94.071 15.294c-2.313-5.2-8.404-7.539-13.603-5.226-5.2 2.313-7.539 8.404-5.226 13.603.227.509.499.983.794 1.435l-27.545 24.37a11.418 11.418 0 0 0-4.023-2.27l1.12-6.317a6.463 6.463 0 0 0 3.451-1.229 6.5 6.5 0 1 0-9.08-1.43 6.46 6.46 0 0 0 2.675 2.134l-1.123 6.331c-.166-.007-.33-.025-.498-.025-2.266 0-4.374.671-6.152 1.813l-17.78-21.062a6.872 6.872 0 1 0-6.001 2.499 6.828 6.828 0 0 0 3.639-.647l17.854 21.148a11.367 11.367 0 0 0-2.984 7.672c0 .317.022.628.047.938l-11.701 2.543a5.606 5.606 0 0 0-3.374-2.775 5.623 5.623 0 1 0 3.79 6.991c.127-.428.195-.858.219-1.285l11.707-2.545a11.473 11.473 0 0 0 5.094 6.053L30.592 79.8a7.72 7.72 0 0 0-5.634 1.068 7.754 7.754 0 1 0 10.706 2.371 7.71 7.71 0 0 0-2.291-2.314l4.779-11.784a11.36 11.36 0 0 0 2.862.377c3.53 0 6.69-1.61 8.787-4.133l11.525 7.239a10.418 10.418 0 0 0-.218 7.94c2.048 5.399 8.085 8.116 13.484 6.068 5.399-2.048 8.116-8.085 6.068-13.484-2.048-5.399-8.085-8.116-13.484-6.068a10.407 10.407 0 0 0-4.255 3.002l-11.528-7.241a11.362 11.362 0 0 0-.905-11.127l27.535-24.36c2.923 2.459 7.098 3.2 10.822 1.543 5.2-2.313 7.539-8.403 5.226-13.603zM41.014 66.519c-4.646 0-8.425-3.779-8.425-8.425s3.779-8.424 8.425-8.424 8.425 3.779 8.425 8.424-3.78 8.425-8.425 8.425z"></path></g><g id="SvgjsG75212" class="text" transform="translate(108.8208, 47.3604) scale(1)" light-content="false" fill="#3b3b3b"><path d="M7.02 0L8.64 -38.82L-4.98 -38.82L-7.14 -32.88L-12.6 -19.14L-13.32 -19.14L-15.06 -33.3L-15.54 -38.82L-29.4 -38.82L-37.92 0L-27.9 0L-25.8 -12.9L-23.82 -21.66L-23.1 -21.66L-20.1 -3.66L-11.1 -3.66L-2.52 -21.66L-1.8 -21.66L-2.34 -11.76L-3.54 0Z M37.02 -8.94L36.48 -9.78L25.02 -9.78L25.26 -12.6L29.1 -38.82L16.92 -38.82L14.16 -11.4L12.18 0L35.28 0Z"></path></g></g></svg></div><div class="block-layer"></div></div>'

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