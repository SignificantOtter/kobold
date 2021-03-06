import { ErrorRequestHandler } from 'express';
import { Logger } from '../services';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Logs = require('../../lang/logs.json');

export function handleError(): ErrorRequestHandler {
	return (error, req, res) => {
		Logger.error(
			Logs.error.apiRequest.replaceAll('{HTTP_METHOD}', req.method).replaceAll('{URL}', req.url),
			error,
		);
		res.status(500).json({ error: true, message: error.message });
	};
}
