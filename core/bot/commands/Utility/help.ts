/* eslint-disable @typescript-eslint/indent */
import { Command, RichDisplay, util as KlasaUtil, CommandStore, ReactionHandler, KlasaMessage } from 'klasa';
import { MessageEmbed, Permissions, TextChannel } from 'discord.js';

const PERMISSIONS_RICHDISPLAY = new Permissions([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.ADD_REACTIONS]);
const time = 1000 * 60 * 3;

export default class extends Command {
	handlers: Map<string, ReactionHandler>;
	constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['commands', 'cmd', 'cmds'],
			guarded: true,
			description: (language) => language.get('COMMAND_HELP_DESCRIPTION'),
			usage: '(Command:command)',
		});

		this.createCustomResolver('command', (arg, possible, message) => {
			if (!arg || arg === '') return undefined;
			return this.client.arguments.get('command').run(arg, possible, message);
		});

		// Cache the handlers
		this.handlers = new Map();
	}

	async run(message: KlasaMessage, [command]: [Command]) {
		if (command) {
			return message.sendMessage([
				`= ${command.name} = `,
				KlasaUtil.isFunction(command.description) ? command.description(message.language) : command.description,
				message.language.get('COMMAND_HELP_USAGE', command.usage.fullUsage(message)),
				message.language.get('COMMAND_HELP_EXTENDED'),
				KlasaUtil.isFunction(command.extendedHelp) ? command.extendedHelp(message.language) : command.extendedHelp,
			], { code: 'asciidoc' });
		}

		if (!('all' in message.flags) && message.guild && (message.channel as TextChannel).permissionsFor(this.client.user!)!.has(PERMISSIONS_RICHDISPLAY)) {
			// Finish the previous handler
			const previousHandler = this.handlers.get(message.author!.id);
			if (previousHandler) previousHandler.stop();

			const handler = await (await this.buildDisplay(message)).run(await message.send('Loading Commands...') as KlasaMessage, {
				filter: (_reaction, user) => user.id === message.author!.id,
				time,
			});
			handler.on('end', () => this.handlers.delete(message.author!.id));
			this.handlers.set(message.author!.id, handler);
			return null;
		}

		return message.author!.send(await this.buildHelp(message), { split: { char: '\n' } })
			.then<KlasaMessage | KlasaMessage[] | null>(() => {
				if (message.channel.type !== 'dm')
					return message.sendMessage(message.language.get('COMMAND_HELP_DM'));
				return null;
			})
			.catch<KlasaMessage | KlasaMessage[] | null>(() => {
				if (message.channel.type !== 'dm')
					return message.sendMessage(message.language.get('COMMAND_HELP_NODM'));
				return null;
			});
	}

	async buildHelp(message: KlasaMessage) {
		const commands = await this._fetchCommands(message);
		const prefix = message.guildSettings.get('prefix') as string;

		const helpMessage = [];
		for (const [category, list] of commands)
			helpMessage.push(`**${category} Commands**:\n`, list.map(this.formatCommand.bind(this, message, prefix, false)).join('\n'), '');


		return helpMessage.join('\n');
	}

	async buildDisplay(message: KlasaMessage) {
		const commands = await this._fetchCommands(message);
		const prefix = message.guildSettings.get('prefix') as string;
		const display = new RichDisplay();
		const color = message.member!.displayColor;
		for (const [category, list] of commands) {
			display.addPage(new MessageEmbed()
				.setTitle(`${category} Commands`)
				.setColor(color)
				.setDescription(list.map(this.formatCommand.bind(this, message, prefix, true)).join('\n'))
			);
		}

		return display;
	}

	formatCommand(message: KlasaMessage, prefix: string, richDisplay: boolean, command: Command) {
		const description = KlasaUtil.isFunction(command.description) ? command.description(message.language) : command.description;
		return richDisplay ? `• ${prefix}${command.name} → ${description}` : `• **${prefix}${command.name}** → ${description}`;
	}

	async _fetchCommands(message: KlasaMessage) {
		const run = this.client.inhibitors.run.bind(this.client.inhibitors, message);
		const commands = new Map();
		await Promise.all(this.client.commands.map((command) => run(command, true)
			.then(() => {
				const category = commands.get(command.category);
				if (category) category.push(command);
				else commands.set(command.category, [command]);
			}).catch(() => {
				// noop
			})
		));

		return commands;
	}
}
