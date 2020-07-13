const request = require('request');

const API_URL = 'https://accounts.spotify.com/api/token';
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

module.exports = (params) => {
	return new Promise((resolve, reject) => {
		request.post(
			API_URL,
			{
				form: params,
				headers: {
					Authorization: 'Basic ' + new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
				},
				json: true
			},
			(err, resp) => (err ? reject(err) : resolve(resp))
		);
	})
		.then((resp) => {
			if (resp.statusCode != 200) {
				return Promise.reject({
					statusCode: resp.statusCode,
					body: resp.body
				});
			}
			return Promise.resolve(resp.body);
		})
		.catch((err) => {
			console.log(err);
			return Promise.reject({
				statusCode: 500,
				body: JSON.stringify({})
			});
		});
};
