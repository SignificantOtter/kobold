import { Message } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { EventData } from '../models/internal-models';
import { Trigger } from '../triggers';

import { Config } from '~/configurer';

export class TriggerHandler {
	private rateLimiter = new RateLimiter(
		Config.rateLimiting.triggers.amount,
		Config.rateLimiting.triggers.interval * 1000,
	);

	constructor(private triggers: Trigger[]) {}

	public async process(msg: Message): Promise<void> {
		// Find triggers caused by this message
		const triggers = this.triggers.filter((trigger) => {
			if (trigger.requireGuild && !msg.guild) {
				return false;
			}

			if (!trigger.triggered(msg)) {
				return false;
			}

			return true;
		});

		// If this message causes no triggers then return
		if (triggers.length === 0) {
			return;
		}

		// Check if user is rate limited
		const limited = this.rateLimiter.take(msg.author.id);
		if (limited) {
			return;
		}

		// TODO: Get data from database
		const data = new EventData();

		// Execute triggers
		for (const trigger of triggers) {
			// triggers are handled sequentially, not simultaneously
			// eslint-disable-next-line no-await-in-loop
			await trigger.execute(msg, data);
		}
	}
}
