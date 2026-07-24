export function getMostFrequentValues<T, K extends keyof T>(
    items: T[],
    groupBy: K
): T[K][] {
    const counts = new Map<T[K], number>();

    let maxCount = 0;
    let mostFrequent: T[K][] = [];

    for (const item of items) {
        const value = item[groupBy];

        const count = (counts.get(value) ?? 0) + 1;
        counts.set(value, count);

        if (count > maxCount) {
            maxCount = count;
            mostFrequent = [value];
        } else if (count === maxCount) {
            if (!mostFrequent.includes(value)) {
                mostFrequent.push(value);
            }
        }
    }

    return mostFrequent;
}
