import { Command, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';
import { EmbedColors } from '../../lib/types/Constants';
import * as packageJSON from '../../../../package.json';

export default class extends Command {
	description = 'Ping pong, the bot is on, but does it respond?';

	async run(message: KlasaMessage) {
		const msg = await message.send(
			new MessageEmbed()
				.setColor(EmbedColors.WAITING)
				.setDescription('Ping? 🏓')
		) as KlasaMessage;

		return message.send(
			new MessageEmbed()
				.setColor(EmbedColors.RESPONSE)
				.setDescription(`Pong! SimplyStats v${packageJSON.version}`)
				.addField('REST Delay:', `**${((msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)) | 0}**ms`, true)
				.addField('Bot Heartbeat 💗', `**${this.client.ws.ping | 0}**ms`, true)
		);
	}
}
