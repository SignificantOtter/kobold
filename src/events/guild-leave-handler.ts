import { Guild } from 'discord.js';

import { Logger } from '../services';
import { EventHandler } from './event-handler';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Logs = require('../../lang/logs.json');

export class GuildLeaveHandler implements EventHandler {
	public async process(guild: Guild): Promise<void> {
		Logger.info(
			Logs.info.guildLeft.replaceAll('{GUILD_NAME}', guild.name).replaceAll('{GUILD_ID}', guild.id),
		);
	}
}
