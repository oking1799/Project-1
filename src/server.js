const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
// const mapHandler = require('./map.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/main.css': htmlHandler.getCSS,
    '/getLocation': jsonHandler.getLocation,
    '/notReal': jsonHandler.notFound,
  },
  HEAD: {
    '/getLocation': jsonHandler.getLocationMeta,
    '/notReal': jsonHandler.notFoundMeta,
  },
};

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addLocation') {
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addLocation(request, response, bodyParams);
    });
  }
};

const handleGet = (request, response, parsedUrl) => {
  if (urlStruct[request.method][parsedUrl.pathname]) {
    let query = GetUrlParameter('query', parsedUrl);
    urlStruct[request.method][parsedUrl.pathname](request, response, query);
  } else {
    jsonHandler.notFound(request, response);
  }
};

function GetUrlParameter(name, parsedUrl){  //from https://davidwalsh.name/query-string-javascript, used to get a url query 
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  let results = regex.exec(parsedUrl.search);
  console.log(`Results: ${results}`)
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
