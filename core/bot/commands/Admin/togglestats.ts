import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';
import { StatsType, EmbedColors } from '../../lib/types/Constants';

// More types soon

export default class extends Command {
	constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Enable or disable specific statistics collections',
			permissionLevel: 4,
			runIn: ['text'],
			subcommands: true,
			usage: '<message>',
		});
	}

	async run(message: KlasaMessage, [type]: [StatsType]) {
		const oldValue = message.guild!.settings.get(`statistics.${type}`) as boolean;
		await message.guild!.settings.update(`statistics.${type}`, !oldValue);

		return message.send(
			new MessageEmbed()
				.setColor(EmbedColors.RESPONSE)
				.setDescription(`${oldValue ? 'Disabled' : 'Enabled'} ${type} stats logging for this server`)
		);
	}
}
