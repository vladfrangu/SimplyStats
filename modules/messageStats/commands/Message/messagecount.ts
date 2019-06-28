import { Command, CommandStore, KlasaMessage, util as KlasaUtil } from 'klasa';
import { TextChannel, CategoryChannel, MessageEmbed } from 'discord.js';
import { GuildSettings } from '../../../../core/bot/lib/types/GuildSettings';
import { TimeDuration, IndexTypes, IndexSearchResults, ChannelAggregation, EmbedColors } from '../../../../core/bot/lib/types/Constants';
import { ChannelQuery, normalizeString, normalizeTimeDuration } from '../../../../core/bot/lib/structures/Utils';
import { ApiResponse } from '@elastic/elasticsearch';

export default class extends Command {
	constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['messageCount', 'message-count', 'mc'],
			requiredSettings: [GuildSettings.MessageStatistics],
			runIn: ['text'],
			permissionLevel: 4,
			requiredPermissions: ['EMBED_LINKS'],
			usage: '[text:textChannel|category:categoryChannel] [h|d|w|m|y]',
		});
	}

	async run(message: KlasaMessage, [channel, filter = 'h']: [TextChannel | CategoryChannel, TimeDuration]) {
		const isCategory = channel instanceof CategoryChannel;
		const data: ApiResponse<IndexSearchResults<never, ChannelAggregation>> = await this.client.es.search({
			index: `${IndexTypes.MESSAGE_CREATE}-${message.guild!.id}`,
			body: ChannelQuery(filter, channel ? channel.id : undefined, isCategory),
			from: 0,
			size: 0,
		});

		const channelToCount = data.body.aggregations!.channelID.buckets.map((element) =>
			`${message.guild!.channels.get(element.key)!.toString()}\n└ **${element.doc_count}** ${normalizeString(element.doc_count, 'message')}`
		);

		const fieldChunks = KlasaUtil.chunk(channelToCount, 3);

		const embed = new MessageEmbed()
			.setTitle(`Most used ${isCategory ? 'categories' : 'channels'} in this server for the current ${normalizeTimeDuration(filter)}`)
			.setColor(EmbedColors.RESPONSE)
			.setFooter('Stats since last reset');

		for (const chunk of fieldChunks) embed.addField('\u200b', chunk.join('\n\n'), true);

		return message.send(embed);
	}
}
