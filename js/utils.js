function translateWord(word) {
    const lower = word.toLowerCase();
    if (oldCzechDict[lower]) {
        let oldWord = oldCzechDict[lower];
        // Check endings
        for (const gender in endingsDict) {
            for (const modernEnd in endingsDict[gender]) {
                if (word.endsWith(modernEnd)) {
                    const newEnd = endingsDict[gender][modernEnd];
                    oldWord = oldWord.slice(0, -modernEnd.length) + newEnd;
                }
            }
        }
        return oldWord;
    }
    return word;
}

function translateText(text) {
    return text.split(/\b/).map(translateWord).join('');
}
