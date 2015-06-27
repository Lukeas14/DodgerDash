var bunyan = require('bunyan'),
	log = bunyan.createLogger({
		name: 'dodgerDash'
	});

module.exports = log;