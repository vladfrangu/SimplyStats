import { Monitor, KlasaMessage } from 'klasa';
import { TextChannel } from 'discord.js';
import { GuildSettings } from '../../../core/bot/lib/types/GuildSettings';
import { IndexTypes } from '../../../core/bot/lib/types/Constants';

export default class MessageStats extends Monitor {
	ignoreBots = true;
	ignoreEdits = true;
	ignoreOthers = false;
	ignoreSelf = true;
	ignoreWebhooks = true;

	async run(message: KlasaMessage) {
		if (!message.guild) return null;

		const statsEnabled = message.guild.settings.get(GuildSettings.MessageStatistics) as GuildSettings.MessageStatistics;

		// Don't log stats for guilds that don't have them enabled
		if (!statsEnabled) return null;

		const { channel } = message as { channel: TextChannel };

		await this.client.es.index({
			id: message.id,
			index: `${IndexTypes.MESSAGE_CREATE}-${message.guild.id}`,
			body: {
				channelID: channel.id,
				categoryID: channel.parentID,
				timestamp: message.createdAt.toISOString(),
			},
		});

		return null;
	}
}
