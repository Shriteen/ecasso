export function getMostFrequentValue<T, K extends keyof T>(
    items: T[],
    groupBy: K
): T[K] | undefined {
    const counts = new Map<T[K], number>();

    let mostFrequent: T[K] | undefined;
    let maxCount = 0;

    for (const item of items) {
	const value = item[groupBy];

	const count = (counts.get(value) ?? 0) + 1;
	counts.set(value, count);

	if (count > maxCount) {
	    maxCount = count;
	    mostFrequent = value;
	}
    }

    return mostFrequent;
}
