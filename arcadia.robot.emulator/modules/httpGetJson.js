const http = require('http');
const https = require('https');
const uid2 = require('uid2');

var x = {
	getJson:getJson,
	get:get
}

module.exports = x;

function get(url) {
	if (url.startsWith('https')) return getHttps(url);
	return getJson(url);
}

function getJson(url) {
	console.log(url);
	return new Promise((resolve, reject)=>{
		const correlationId = uid2(36);
		http.get(url, { headers: { correlation: correlationId } }, (res) => {
		  const { statusCode } = res;
		  const contentType = res.headers['content-type'];

		  let error;
		  if (statusCode !== 200) {
		    error = new Error('Request Failed.\n' +
		                      `Status Code: ${statusCode}`);
		  } else if (!/^application\/json/.test(contentType)) {
		    error = new Error('Invalid content-type.\n' +
		                      `Expected application/json but received ${contentType}`);
		  }
		  if (error) {
		    console.error(error.message);
		    res.resume();
		    reject(error.message);
		  }

		  res.setEncoding('utf8');
		  let rawData = '';
		  res.on('data', (chunk) => { rawData += chunk; });
		  res.on('end', () => {
		    try {
		      const parsedData = JSON.parse(rawData);
		      resolve(parsedData);
		    } catch (e) {
		      console.error(e.message);
		      reject(e.message);
		    }
		  });
		}).on('error', (e) => {
		  console.error(`Got error: ${e.message}`);
		  reject(e.message);
		});
	});
}

function getHttps(url) {
	console.log(url);
	return new Promise((resolve, reject)=>{
		https.get(url,(res) => {
			let body = "";
			res.on("data", (chunk) => {
				body += chunk;
			});

			res.on("end", () => {
			try {
					console.log(`Resp: ${body}`);
					let jsonRes = JSON.parse(body);
					resolve(jsonRes)
				} catch (error) {
					reject(error.message);
				};
		 	});

		}).on("error", (error) => {
			reject(error.message);
		});
	});
}