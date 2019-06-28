export const IndexTypes = {
	MESSAGE_CREATE: 'message_create',
} as const;

export const EmbedColors = {
	RESPONSE: 0x43B581,
} as const;

export type TimeDuration = 'h' | 'd' | 'w' | 'm' | 'y';

export interface IndexSearchResults<T = any, TAggrResults extends any = undefined> {
	took: number;
	timed_out: boolean;
	_shards: { total: number; successful: number; skipped: number; failed: number };
	hits: { total: { value: number; relation: string }; max_score: number | null; hits: T[] };
	aggregations?: TAggrResults;
}

export interface ChannelAggregation {
	channelID: {
		doc_count_error_upper_bound: number;
		sum_other_doc_count: number;
		buckets: Array<{ key: string; doc_count: number }>;
	};
}
