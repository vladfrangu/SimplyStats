import StatsClient from './lib/structures/StatsClient';
import { clientOptions, token } from '../../config';

// TODO: Use Raven?
const client = new StatsClient({ ...clientOptions, createPiecesFolders: false });

client.login(token)
	.catch((err) => {
		client.console.error(err);
	});
