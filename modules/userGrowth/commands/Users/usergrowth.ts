import { Command, CommandStore, KlasaMessage } from 'klasa';
import { GuildSettings } from '../../../../core/bot/lib/types/GuildSettings';
import { TimeDuration, IndexTypes, IndexSearchResults, UserGrowthAggregation, EmbedColors } from '../../../../core/bot/lib/types/Constants';
import { UserGrowthQuery, normalizeTimeDuration, normalizeString } from '../../../../core/bot/lib/structures/Utils';
import { ApiResponse } from '@elastic/elasticsearch';
import { MessageEmbed } from 'discord.js';

export default class extends Command {
	constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['userGrowth', 'user-growth', 'ug'],
			description: "Shows how many users have joined in a period of time",
			permissionLevel: 4,
			requiredPermissions: ['EMBED_LINKS'],
			requiredSettings: [GuildSettings.MessageStatistics],
			runIn: ['text'],
			usage: '[h|d|m|y]',
		});
	}

	async run(message: KlasaMessage, [filter = 'h']: [TimeDuration]) {
		const data: ApiResponse<IndexSearchResults<never, UserGrowthAggregation>> = await this.client.es.search({
			index: `${IndexTypes.MEMBER_JOIN}-${message.guild!.id}`,
			body: UserGrowthQuery(filter),
			from: 0,
			size: 0,
		}).catch(() => {
			throw "You need to enable `userGrowth` stats collecting before you can use this, or a member hasn't joined yet!";
		});

		const { 2: { buckets: [entry] } } = data.body.aggregations!;

		const userCount = entry ? entry.doc_count : 0;

		return message.send(
			new MessageEmbed()
				.setColor(EmbedColors.RESPONSE)
				.setTitle(`Users joined in this ${normalizeTimeDuration(filter)}`)
				.setDescription(`**${userCount}** ${normalizeString(userCount, 'user')} joined`)
		);
	}
}
