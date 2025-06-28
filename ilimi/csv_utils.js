
// Pure CSV utilities for import/export. No UI or app state logic here!

/**
 * Parse CSV text into an array of {word, meaning} objects.
 * Throws if no valid entries found.
 */
export function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) {
        throw new Error('CSV file is empty.');
    }
    // Detect header (case-insensitive, must contain both 'word' and 'meaning')
    let startIdx = 0;
    const header = lines[0].toLowerCase();
    if (header.includes('word') && header.includes('meaning')) {
        startIdx = 1;
    }
    const result = [];
    for (let i = startIdx; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const [word, ...meaningParts] = line.split(',');
        if (!word || word.trim() === '') continue;
        const meaning = meaningParts.join(',').trim();
        if (word.trim() === '' && meaning === '') continue;
        result.push({ word: word.trim(), meaning });
    }
    if (result.length === 0) {
        throw new Error('No valid entries found in CSV.');
    }
    return result;
}

/**
 * Convert an array of {word, meaning} objects to CSV string.
 * Deduplicates by word (case-insensitive, trimmed).
 */
export function vocabArrayToCSV(vocabArray) {
    const seen = new Set();
    const deduped = [];
    for (const entry of vocabArray) {
        const key = (entry.word || '').trim().toLowerCase();
        if (key && !seen.has(key)) {
            seen.add(key);
            deduped.push(entry);
        }
    }
    let csv = 'word,meaning\n';
    deduped.forEach(entry => {
        let word = (entry.word || '').replace(/\r?\n/g, ' ').replace(/"/g, '""');
        let meaning = (entry.meaning || '').replace(/\r?\n/g, ' ').replace(/"/g, '""');
        if (word.includes(',') || word.includes('"')) {
            word = '"' + word + '"';
        }
        if (meaning.includes(',') || meaning.includes('"')) {
            meaning = '"' + meaning + '"';
        }
        csv += `${word},${meaning}\n`;
    });
    return csv;
}