const express = require('express');
const login = require('./app.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async  (req, res) => {
         let { username, password, scopes, clientid, domain, region, type  } = req.query;

	if(username && password && scopes && clientid && domain && region && type ){

	let url = await login.app( req.query  );
	res.send(url) 
	   
	 }else{   
		 res.sendStatus(400)
	 }	
	});

app.listen(PORT, () => console.log(`Server listening in port ${PORT}`))

/*
(async ()=> { 
	let url = await login.app( { username:"abdoharib", password:"Ah68121140", scopes:"scopes/user",clientid:"2ufuuh1rb1m5ji4bkie6l1u36u"  }  );
	console.log(url)

})()
*/
