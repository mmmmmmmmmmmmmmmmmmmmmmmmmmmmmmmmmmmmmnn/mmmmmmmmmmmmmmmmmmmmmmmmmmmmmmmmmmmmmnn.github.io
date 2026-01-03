const fs = require('fs');

// Load modern Czech Bible JSON
const bible = JSON.parse(fs.readFileSync('bible.json', 'utf-8'));

// Helper: split text into words (keeps punctuation separate)
function extractWords(text) {
    return text.split(/\b/).map(w => w.trim()).filter(w => w.length > 0);
}

// Step 1: Extract all unique words
const wordSet = new Set();
for (const book in bible) {
    for (const chapter in bible[book]) {
        for (const verse in bible[book][chapter]) {
            const words = extractWords(bible[book][chapter][verse]);
            words.forEach(word => wordSet.add(word));
        }
    }
}

// Step 2: Define common modern → Bohemian word substitutions
const commonSubstitutions = {
    "počátku": "počátok",
    "stvořil": "stvoril",
    "nebe": "niebe",
    "země": "zemja",
    "zemí": "zemjou",
    "pustá": "opuštěná",
    "prázdná": "prázdna",
    "tma": "temnota",
    "byla": "byť",
    "nad": "nade",
    "a": "i",
    "Bůh": "Bůh"
};

// Step 3: Define basic ending rules (simplified)
// This will replace modern endings with Bohemian endings
const endingRules = [
    { from: "y$", to: "i" },    // např. "dobry" → "dobri"
    { from: "á$", to: "a" },    // "krásná" → "krásna"
    { from: "é$", to: "ě" },    // "velké" → "velké" → "velké" (Bohemian uses ě)
    { from: "í$", to: "i" }     // "silní" → "silni"
];

// Step 4: Generate old Czech dictionary
const oldCzechDict = {};

wordSet.forEach(word => {
    // Keep punctuation as is
    if (!/^[\p{L}]+$/u.test(word)) {
        oldCzechDict[word] = word;
        return;
    }

    // Apply common substitutions first
    if (commonSubstitutions[word.toLowerCase()]) {
        oldCzechDict[word] = commonSubstitutions[word.toLowerCase()];
        return;
    }

    // Apply ending rules
    let transformed = word;
    endingRules.forEach(rule => {
        const regex = new RegExp(rule.from, 'i');
        transformed = transformed.replace(regex, rule.to);
    });

    oldCzechDict[word] = transformed;
});

// Step 5: Save dictionary as JSON
fs.writeFileSync('old_czech.json', JSON.stringify(oldCzechDict, null, 2), 'utf-8');
console.log(`Generated old_czech.json with ${Object.keys(oldCzechDict).length} entries.`);
