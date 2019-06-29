import StatsClient from './lib/structures/StatsClient';
import { clientOptions, token } from '../../config';
import { KlasaClient } from 'klasa';
import { Permissions } from 'discord.js';

StatsClient.defaultGuildSchema
	.add('statistics', (statistics) => statistics
		.add('message', 'boolean')
		.add('emojis', 'boolean')
		.add('userGrowth', 'boolean')
	);

KlasaClient.defaultPermissionLevels
	.add(4, ({ member }) => {
		if (!member) throw 'You can only run this in a guild!';
		return member.permissions.has(Permissions.FLAGS.MANAGE_GUILD);
	}, { fetch: true });

// Use Raven?
const client = new StatsClient({
	...clientOptions,
	createPiecesFolders: false,
	restTimeOffset: 0,
});

client.login(token)
	.catch((err) => {
		client.console.error(err);
		process.exit(-1);
	});
