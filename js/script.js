let bibleData = {};
let oldCzechDict = {};

// Load JSON file
async function loadJSON(url) {
    const res = await fetch(url);
    return res.json();
}

// Translate text word-by-word using dictionary
function translateWord(word) {
    const lower = word.toLowerCase();
    return oldCzechDict[lower] || word;
}

function translateText(text) {
    return text.split(/\b/).map(translateWord).join('');
}

// Render book links for navigation
function renderBookLinks() {
    const nav = document.getElementById('book-links');
    for (const book in bibleData) {
        const link = document.createElement('a');
        link.href = '#' + book;
        link.textContent = book;
        link.style.marginRight = '10px';
        nav.appendChild(link);
    }
}

// Render the Bible
function renderBible() {
    const container = document.getElementById('bible');
    for (const book in bibleData) {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book';
        bookDiv.id = book;

        const bookTitle = document.createElement('h2');
        bookTitle.textContent = book;
        bookDiv.appendChild(bookTitle);

        const chapters = bibleData[book];
        for (const chapter in chapters) {
            const chapDiv = document.createElement('div');
            chapDiv.className = 'chapter';
            chapDiv.id = book + '-' + chapter;

            const chapTitle = document.createElement('h3');
            chapTitle.textContent = "Kapitola " + chapter;
            chapDiv.appendChild(chapTitle);

            const verses = chapters[chapter];
            for (const verse in verses) {
                const verseDiv = document.createElement('div');
                verseDiv.className = 'verse';
                verseDiv.textContent = verse + ": " + translateText(verses[verse]);
                chapDiv.appendChild(verseDiv);
            }
            bookDiv.appendChild(chapDiv);
        }
        container.appendChild(bookDiv);
    }
}

// Setup search
function setupSearch() {
    const box = document.getElementById('searchBox');
    const results = document.getElementById('searchResults');

    box.addEventListener('input', () => {
        const query = box.value.toLowerCase();
        results.innerHTML = '';

        for (const book in bibleData) {
            for (const chapter in bibleData[book]) {
                for (const verse in bibleData[book][chapter]) {
                    const text = bibleData[book][chapter][verse].toLowerCase();
                    if (text.includes(query) || book.toLowerCase().includes(query)) {
                        const div = document.createElement('div');
                        div.innerHTML = `<a href="#${book}-${chapter}">${book} ${chapter}:${verse}</a> - ${translateText(bibleData[book][chapter][verse])}`;
                        results.appendChild(div);
                    }
                }
            }
        }
    });
}

// Initialize
async function init() {
    bibleData = await loadJSON('bible.json');
    oldCzechDict = await loadJSON('old_czech.json');

    renderBookLinks();
    renderBible();
    setupSearch();
}

init();
