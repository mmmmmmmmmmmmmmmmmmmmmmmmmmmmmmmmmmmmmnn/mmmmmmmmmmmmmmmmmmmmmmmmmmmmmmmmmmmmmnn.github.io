const fs = require('fs');

// Load modern Czech Bible JSON
const bible = JSON.parse(fs.readFileSync('bible.json', 'utf-8'));

// Helper: split text into words
function extractWords(text) {
    return text.split(/\b/).map(w => w.trim()).filter(w => w.length > 0);
}

// Extract all unique words from the Bible
const wordSet = new Set();

for (const book in bible) {
    for (const chapter in bible[book]) {
        for (const verse in bible[book][chapter]) {
            const words = extractWords(bible[book][chapter][verse]);
            words.forEach(word => wordSet.add(word));
        }
    }
}

// Create initial dictionary mapping modern → Bohemian (copy words for now)
const dict = {};
wordSet.forEach(word => {
    dict[word] = word; // initially identical, replace later with old Czech manually or rules
});

// Save dictionary to JSON
fs.writeFileSync('old_czech.json', JSON.stringify(dict, null, 2), 'utf-8');

console.log(`Extracted ${wordSet.size} unique words. Dictionary saved as old_czech.json`);
