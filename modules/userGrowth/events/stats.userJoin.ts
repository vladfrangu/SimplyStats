import { Event } from 'klasa';
import { GuildMember } from 'discord.js';
import { GuildSettings } from '../../../core/bot/lib/types/GuildSettings';
import * as uuid4 from 'uuid/v4';
import { IndexTypes } from '../../../core/bot/lib/types/Constants';

export default class extends Event {
	event = 'guildMemberAdd';

	async run(member: GuildMember) {
		const userGrowthEnabled = member.guild.settings.get(GuildSettings.UserGrowthStatistics) as GuildSettings.UserGrowthStatistics;

		if (!userGrowthEnabled) return null;

		await this.client.es.index({
			id: uuid4(),
			index: `${IndexTypes.MEMBER_JOIN}-${member.guild.id}`,
			body: {
				memberCount: member.guild.memberCount,
				joined: member.user.id,
				timestamp: new Date().toISOString(),
			},
		});

		return null;
	}
}
