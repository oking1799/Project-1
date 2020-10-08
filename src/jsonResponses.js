const locations = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const addLocation = (request, response, body) => {
  const responseJSON = {
    message: 'A Name, Latitude and Longitude are required',
  };

  console.log(body);

  if (!body.name || !body.latitude || !body.longitude) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (locations[body.name]) {   //check for update
    responseCode = 204;
  } else {
    locations[body.name] = {};
  }

  locations[body.name].name = body.name
  locations[body.name].latitude = body.latitude;
  locations[body.name].longitude = body.longitude;
  locations[body.name].rating = body.rating;
  locations[body.name].review = body.review;
  

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

const getLocation = (request, response, query) => {
  console.log(`query:${query}`);
  if(query){                                  //if url has a query
      if(locations[query]){                   //if query is the name of a valid location
        const responseJSON = locations[query];       //set GET response to that location
        return respondJSON(request, response, 200, responseJSON);
      }
    return notFound(request, response);       //if no query match is found send 404
  }else{
  const responseJSON = {                      //if no query return all locations
    locations,
  };
  return respondJSON(request, response, 200, responseJSON);
} 
};

const getLocationMeta = (request, response) => respondJSONMeta(request, response, 200);

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found!',
    id: 'notFound',
  };
  return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  notFound,
  notFoundMeta,
  addLocation,
  getLocation,
  getLocationMeta,

};
