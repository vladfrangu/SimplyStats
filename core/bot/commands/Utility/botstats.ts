import { Command, KlasaMessage, Duration } from 'klasa';
import { MessageEmbed } from 'discord.js';
import { EmbedColors } from '../../lib/types/Constants';
import * as packageJSON from '../../../../package.json';

export default class extends Command {
	aliases = ['invite'];
	description = 'Get a few stats about our bot!';

	async run(message: KlasaMessage) {
		const embed = new MessageEmbed()
			.setColor(EmbedColors.INFO)
			.setAuthor(this.client.user!.tag, this.client.user!.displayAvatarURL())
			.setDescription(`A simple bot to get in-depth stats about your servers!\n\nInvite the bot by going [here](${this.client.invite})`)
			.setFooter(`v${packageJSON.version} :: The bot is still WIP as we perfect it for you!`);
		embed
			.addField('Guilds', `**${this.client.guilds.size}**`, true)
			.addField('Uptime', Duration.toNow(Date.now() - (process.uptime() * 1000)), true)
			.addField('Memory Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`, true)
			.addBlankField(true)
			.addField('Shard Info', `Shard **${this.client.options.shards}**/${this.client.options.totalShardCount}`, true)
			.addBlankField(true);
		return message.send(embed);
	}
}
