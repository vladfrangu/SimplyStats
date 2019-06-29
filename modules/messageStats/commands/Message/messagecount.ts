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
			description: "Shows the servers's messages sent so far",
			permissionLevel: 4,
			requiredPermissions: ['EMBED_LINKS'],
			requiredSettings: [GuildSettings.MessageStatistics],
			runIn: ['text'],
			usage: '[categories] [text:textChannel|category:categoryChannel] [h|d|m|y]',
			usageDelim: ' ',
		});
	}

	async run(message: KlasaMessage, [categories, channel, filter = 'h']: ['categories', TextChannel | CategoryChannel, TimeDuration]) {
		const isCategory = channel instanceof CategoryChannel;
		const data: ApiResponse<IndexSearchResults<never, ChannelAggregation>> = await this.client.es.search({
			index: `${IndexTypes.MESSAGE_CREATE}-${message.guild!.id}`,
			body: ChannelQuery(filter, channel ? channel.id : undefined, isCategory, Boolean(categories)),
			from: 0,
			size: 0,
		}).catch(() => {
			throw "You need to enable `message` stats collecting before you can use this, or a message hasn't been received yet!";
		});

		const channelToCount = data.body.aggregations![categories ? 'categoryID' : 'channelID'].buckets.map((element) =>
			`${message.guild!.channels.get(element.key)!.toString()}\n└ **${element.doc_count}** ${normalizeString(element.doc_count, 'message')}`
		);

		const fieldChunks = KlasaUtil.chunk(channelToCount, 3);

		const embed = new MessageEmbed()
			.setColor(EmbedColors.RESPONSE);

		if (channel) {
			const [element] = data.body.aggregations!.channelID.buckets;
			embed.setTitle(`Messages sent in the selected ${isCategory ? 'category' : 'text'} channel during this ${normalizeTimeDuration(filter)}`);
			embed.setDescription(`There were ${element ? element.doc_count : 0} ${normalizeString(element ? element.doc_count : 0, 'message')} sent in **${message.guild!.channels.get(element ? element.key : channel.id)!.name}**`);
		} else {
			embed.setTitle(`Most used ${categories ? 'categories' : 'channels'} in this server for the current ${normalizeTimeDuration(filter)}`);
			for (const chunk of fieldChunks) embed.addField('\u200b', chunk.join('\n\n'), true);
		}

		return message.send(embed);
	}
}
