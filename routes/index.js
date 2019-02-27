var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/v1/actors', function(req, res, next) {
  const apiService = req.app.locals.apiService;
  const oauth = req.app.locals.oauth2;

  if(oauth.credentials.access_token == null){
    res.json({
      error: "No bearer token",
      msg: "Run /users/login first"
    });
  }else{
    let datos = apiService.get({
      url: `https://proindiemusic-backend.mybluemix.net/api/v1/artist`,
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${oauth.credentials.access_token}`
      }
    }).then((respuesta) => {
      res.json(respuesta);
    });
  }
});

/* Add Media page. */
router.post('/v1/media', function(req, res, next) {
  const apiService = req.app.locals.apiService;
  const oauth = req.app.locals.oauth2;
  const uuid = req.body.uuid;

  console.log(oauth.credentials.access_token);

  if(oauth.credentials.access_token == null){
    res.json({
      error: "No bearer token",
      msg: "Run /users/login first"
    });
  }else {

    /*let val = {
      "followers": 4391455,
      "channel": "https://www.facebook.com/metallicatv",
      "verified": true,
      "type": "facebook",
      "artistUuid": "f5463dca-a7cf-4a25-88e5-8ad74fe8005c",
    }*/

    let val = {
      "followers": req.body.followers,
      "channel": req.body.channel,
      "verified": req.body.verified,
      "type": req.body.type,
      "artistUuid": req.body.artistUuid,
    }

    let datos = apiService.post({
      url: `https://proindiemusic-backend.mybluemix.net/api/v1/artist/${val.artistUuid}/media`,
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${oauth.credentials.access_token}`
      },
      params: JSON.stringify(val)
    }).then((respuesta) => {
      res.json(respuesta);
    });
  }
});


module.exports = router;
