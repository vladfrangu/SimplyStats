/* eslint-disable @typescript-eslint/camelcase,default-case */
import { TimeDuration } from '../types/Constants';

export const normalizeString = (count: number, value: string) => `${value}${count === 1 ? '' : 's'}`;

export const normalizeTimeDuration = (duration: TimeDuration) => {
	switch (duration) {
		case 'h': return 'hour';
		case 'd': return 'day';
		case 'w': return 'week';
		case 'm': return 'month';
		case 'y': return 'year';
	}
};

const MONTH_TO_FINISH_DATE = new Map([
	// Jan
	[0, 31],
	// Feb
	[1, 28],
	// March
	[2, 31],
	// April
	[3, 30],
	// May
	[4, 31],
	// June
	[5, 30],
	// July
	[6, 31],
	// Aug
	[7, 31],
	// Sept
	[8, 30],
	// Oct
	[9, 31],
	// Nov
	[10, 30],
	// Dev
	[11, 31],
]);

const generateCurrentGTE = (type: TimeDuration, next = false) => {
	const TIME = next ? '59:59.999' : '00:00.000';
	// Sunday = 0, Monday = 1;
	const STARTING_DAY = 1;
	const currentDate = new Date();
	switch (type) {
		case 'h': {
			return `${currentDate.getUTCFullYear()}-${(currentDate.getUTCMonth() + 1).toString().padStart(2, '0')}-${currentDate.getUTCDate()}T${currentDate.getUTCHours()}:${TIME}Z`;
		}
		case 'd': {
			return `${currentDate.getUTCFullYear()}-${(currentDate.getUTCMonth() + 1).toString().padStart(2, '0')}-${currentDate.getUTCDate()}T${next ? '23' : '00'}:${TIME}Z`;
		}
		case 'w': {
			const currentDay = currentDate.getUTCDate();
			const weekStart = new Date(currentDate.valueOf() - ((currentDay <= 0 ? 7 - STARTING_DAY : currentDay - STARTING_DAY) * 86400000));
			const weekEnd = new Date(weekStart.valueOf() + (6 * 86400000));
			return next ?
				`${weekEnd.getUTCFullYear()}-${weekEnd.getUTCMonth().toString().padStart(2, '0')}-${weekEnd.getUTCDate()}T23:${TIME}Z` :
				`${weekStart.getUTCFullYear()}-${weekStart.getUTCMonth().toString().padStart(2, '0')}-${weekStart.getUTCDate()}T00:${TIME}Z`;
		}
		case 'm': {
			const currentMonth = currentDate.getUTCMonth();
			const currentYear = currentDate.getUTCFullYear();
			let endDay = MONTH_TO_FINISH_DATE.get(currentMonth)!;
			if (currentMonth === 1 && !(currentYear % 4)) {
				if (!(currentYear % 400))
					endDay += 1;
			}
			return `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${next ? endDay : 1}T${next ? '23' : '00'}:${TIME}Z`;
		}
		case 'y': {
			return `${currentDate.getUTCFullYear()}-${next ? '12' : '01'}-${next ? '31' : '1'}T${next ? '23' : '00'}:${TIME}Z}`;
		}
	}
};

export const ChannelQuery = (timeDuration: TimeDuration, channelID?: string, category = false) => {
	const must: any[] = [
		{
			range: {
				timestamp: {
					format: 'strict_date_optional_time',
					gte: generateCurrentGTE(timeDuration),
					lte: generateCurrentGTE(timeDuration, true),
				},
			},
		},
	];

	if (channelID) {
		must.unshift({
			match: {
				[category ? 'categoryID' : 'channelID']: channelID,
			},
		});
	}

	return {
		sort: [
			{
				timestamp: {
					order: 'desc',
					unmapped_type: 'boolean',
				},
			},
		],
		query: {
			bool: {
				must,
				filter: [
					{
						match_all: {},
					},
				],
				should: [],
				must_not: [],
			},
		},
		aggs: {
			channelID: {
				terms: {
					field: 'channelID.keyword',
					size: 6,
					order: {
						_count: 'desc',
					},
				},
				aggs: {},
			},
		},
		stored_fields: [
			'*',
		],
		docvalue_fields: [
			{
				field: 'timestamp',
				format: 'date_time',
			},
		],
	};
};
