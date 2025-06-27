// ilimi_language.js
// All main JS logic for Ilimi Language Site

// --- Meanings dictionary ---
const meanings = {
    a: 'self / identity',
    e: 'relation / connection',
    i: 'thought / mind',
    o: 'world / external',
    ma: 'self-growth (becoming)',
    me: 'mutual change (exchange)',
    mi: 'realization (learning)',
    mo: 'natural evolution (progress)',
    sa: 'personal form (identity)',
    se: 'structure in relation (link)',
    si: 'pattern recognition (logic)',
    so: 'external structure (object)',
    ta: 'lived time (memory)',
    te: 'cause/effect (sequence)',
    ti: 'anticipated time (focus)',
    to: 'flow of time (cycle)',
    da: 'personal knowledge (belief)',
    de: 'shared knowledge (teaching)',
    di: 'deep thought (wisdom)',
    do: 'accumulated truth (archive)',
    ba: 'inner being (individual)',
    be: 'connected being (you)',
    bi: 'conscious life (awareness)',
    bo: 'external life (others)',
    pa: 'intent / will',
    pe: 'influence / persuasion',
    pi: 'precise action (strategy)',
    po: 'force in reality (impact)',
    la: 'feeling from within (emotion)',
    le: 'emotional bond (empathy)',
    li: 'subtle insight (intuition)',
    lo: 'ambient emotion (atmosphere)'
};

// --- Utility functions ---
function annotateWord(word) {
    const syllables = [];
    for (let i = 0; i < word.length;) {
        let match = '';
        if (i < word.length - 1 && meanings[word.substring(i, i + 2)]) {
            match = word.substring(i, i + 2);
            i += 2;
        } else if (meanings[word[i]]) {
            match = word[i];
            i += 1;
        } else {
            match = word[i];
            i += 1;
        }
        syllables.push(`<span data-tooltip="${meanings[match] || 'Unknown'}">${match}</span>`);
    }
    return syllables.join('');
}

function getSyllableMeaningsList(word) {
    let i = 0;
    const sylls = [];
    while (i < word.length) {
        let match = '';
        if (i < word.length - 1 && meanings[word.substring(i, i + 2)]) {
            match = word.substring(i, i + 2);
            i += 2;
        } else if (meanings[word[i]]) {
            match = word[i];
            i += 1;
        } else {
            match = word[i];
            i += 1;
        }
        sylls.push(match);
    }
    return sylls.map(s => meanings[s] || '?').join('<br/>');
}

function parseCSV(text) {
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
        // Optionally allow empty meaning, but skip if both are empty
        if (word.trim() === '' && meaning === '') continue;
        result.push({ word: word.trim(), meaning });
    }
    if (result.length === 0) {
        throw new Error('No valid entries found in CSV.');
    }
    return result;
}

// --- Tooltip logic ---
let tooltip;

function setupTooltip() {
    tooltip = document.createElement('div');
    tooltip.className = 'floating-tooltip';
    document.body.appendChild(tooltip);
}

function showTooltip(e) {
    const text = e.target.getAttribute('data-tooltip');
    if (!text) return;
    tooltip.textContent = text;
    tooltip.classList.add('visible');
    const rect = e.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    let top = rect.bottom + 8;
    let left = rect.left + (rect.width - tooltipRect.width) / 2;
    if (left < 8) left = 8;
    if (left + tooltipRect.width > window.innerWidth)
        left = window.innerWidth - tooltipRect.width - 8;
    if (top + tooltipRect.height > window.innerHeight)
        top = rect.top - tooltipRect.height - 8;
    if (top < 8) top = 8;
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
}

function hideTooltip() {
    tooltip.classList.remove('visible');
}

function attachTooltipEvents() {
    document.querySelectorAll('.vocab-list span[data-tooltip], #syllable-words-list span[data-tooltip]').forEach(span => {
        span.addEventListener('mouseenter', showTooltip);
        span.addEventListener('mousemove', showTooltip);
        span.addEventListener('mouseleave', hideTooltip);
    });
}

// --- Add Word Section Logic ---
let addedWords = [];
let vocabFromCSV = [];
const csvPath = "default_vocab.csv";

function setupAddWordSection() {
    const newWordInput = document.getElementById('new-word');
    const newMeaningInput = document.getElementById('new-meaning');
    const syllableAnnotation = document.getElementById('syllable-annotation');
    const addWordForm = document.getElementById('add-word-form');
    const addWordMsg = document.getElementById('add-word-message');
    if (newWordInput && syllableAnnotation) {
        newWordInput.addEventListener('input', function () {
            const word = newWordInput.value.trim();
            if (word) {
                const meaningList = getSyllableMeaningsList(word);
                syllableAnnotation.innerHTML = `<div style="margin-top:0.2em;font-size:0.97em;color:#333;">${meaningList}</div>`;
            } else {
                syllableAnnotation.innerHTML = '';
            }
            attachTooltipEvents();
        });
    }
    if (addWordForm) {
        addWordForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const word = newWordInput.value.trim();
            const meaning = newMeaningInput.value.trim();
            if (!word || !meaning) {
                addWordMsg.textContent = 'Please enter both a word and its meaning.';
                addWordMsg.style.color = '#b00';
                return;
            }
            const exists = Array.from(document.querySelectorAll('.vocab-list .word')).some(el => el.textContent.trim().toLowerCase() === word.toLowerCase()) ||
                addedWords.some(w => w.word.toLowerCase() === word.toLowerCase());
            if (exists) {
                addWordMsg.textContent = 'That word is already in the vocabulary list.';
                addWordMsg.style.color = '#b00';
                return;
            }
            addedWords.push({ word, meaning });
            renderVocabList();
            attachSyllableClickEvents();
            // If fileHandle is set, auto-save to file
            if (typeof fileHandle !== 'undefined' && fileHandle) {
                try {
                    const allVocab = [...vocabFromCSV, ...addedWords];
                    const seen = new Set();
                    const deduped = [];
                    for (const entry of allVocab) {
                        const key = (entry.word || '').trim().toLowerCase();
                        if (key && !seen.has(key)) {
                            seen.add(key);
                            deduped.push(entry);
                        }
                    }
                    let csv = 'word,meaning\n';
                    deduped.forEach(entry => {
                        let w = (entry.word || '').replace(/\r?\n/g, ' ').replace(/"/g, '""');
                        let m = (entry.meaning || '').replace(/\r?\n/g, ' ').replace(/"/g, '""');
                        if (w.includes(',') || w.includes('"')) w = '"' + w + '"';
                        if (m.includes(',') || m.includes('"')) m = '"' + m + '"';
                        csv += `${w},${m}\n`;
                    });
                    const writable = await fileHandle.createWritable();
                    await writable.write(csv);
                    await writable.close();
                    addWordMsg.textContent = `Word "${word}" added and saved to file!`;
                    addWordMsg.style.color = '#228b22';
                } catch (err) {
                    addWordMsg.textContent = `Word "${word}" added, but failed to save: ${err.message}`;
                    addWordMsg.style.color = '#b00';
                }
            } else {
                addWordMsg.textContent = `Word "${word}" added! (Not saved to CSV)`;
                addWordMsg.style.color = '#228b22';
            }
            addWordForm.reset();
            syllableAnnotation.innerHTML = '';
        });
    }
}

// --- CSV Import/Export & File System Access ---
function showMsg(msg, success) {
    const exportMsg = document.getElementById('export-csv-msg');
    if (exportMsg) {
        exportMsg.textContent = msg;
        exportMsg.style.color = success ? '#228b22' : '#b00';
        setTimeout(() => { exportMsg.textContent = ''; }, 2500);
    }
}

function importVocabFromCSVFile(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        try {
            const parsed = parseCSV(text);
            // Remove from addedWords any that are present in the imported CSV (case-insensitive)
            const importedWords = new Set(parsed.map(entry => (entry.word || '').trim().toLowerCase()));
            addedWords = addedWords.filter(entry => !importedWords.has((entry.word || '').trim().toLowerCase()));
            vocabFromCSV = parsed;
            renderVocabList();
            attachSyllableClickEvents();
            showMsg('Vocabulary loaded from CSV!', true);
            console.log('CSV import successful:', parsed);
        } catch (err) {
            showMsg('Failed to load CSV: ' + err.message, false);
            console.error('CSV import error:', err);
        }
    };
    reader.readAsText(file);
}

function exportVocabToCSV() {
    // Merge and deduplicate by word (case-insensitive, trimmed)
    const allVocab = [...vocabFromCSV, ...addedWords];
    const seen = new Set();
    const deduped = [];
    for (const entry of allVocab) {
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
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ilimi_vocabulary_export.csv';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

let fileHandle = null;
function setupCSVButtons() {
    const exportBtn = document.getElementById('export-csv-btn');
    if (exportBtn) {
        exportBtn.onclick = function () {
            exportVocabToCSV();
            showMsg('CSV file exported!', true);
        };
    }
    const importInput = document.getElementById('import-csv-input');
    if (importInput) {
        importInput.addEventListener('change', function (e) {
            if (importInput.files && importInput.files[0]) {
                importVocabFromCSVFile(importInput.files[0]);
                importInput.value = '';
            }
        });
    }

    // Add Open/Edit CSV button
    let openEditBtn = document.getElementById('open-edit-csv-btn');
    if (!openEditBtn) {
        openEditBtn = document.createElement('button');
        openEditBtn.id = 'open-edit-csv-btn';
        openEditBtn.textContent = 'Open/Edit CSV File';
        openEditBtn.style = 'background:#4b0082;color:#fff;font-weight:bold;padding:0.45em 1.1em;border:none;border-radius:4px;font-size:1em;cursor:pointer;';
        const csvControls = document.querySelector('.csv-controls');
        if (csvControls) {
            csvControls.insertBefore(openEditBtn, csvControls.firstChild);
        } else {
            // fallback: insert after exportBtnEl if found
            const exportBtnEl = document.getElementById('export-csv-btn');
            if (exportBtnEl && exportBtnEl.parentNode) {
                exportBtnEl.parentNode.insertBefore(openEditBtn, exportBtnEl);
            }
        }
    }

    // Add Save to File button (hidden by default)
    let saveFileBtn = document.getElementById('save-csv-file-btn');
    if (!saveFileBtn) {
        saveFileBtn = document.createElement('button');
        saveFileBtn.id = 'save-csv-file-btn';
        saveFileBtn.textContent = 'Save to File';
        saveFileBtn.style = 'background:#228b22;color:#fff;font-weight:bold;padding:0.45em 1.1em;border:none;border-radius:4px;font-size:1em;cursor:pointer;display:none;margin-left:0.7em;';
        openEditBtn.parentNode.insertBefore(saveFileBtn, openEditBtn.nextSibling);
    }

    openEditBtn.onclick = async function () {
        if (!window.showOpenFilePicker) {
            showMsg('File System Access API not supported in this browser.', false);
            return;
        }
        try {
            const [handle] = await window.showOpenFilePicker({
                types: [{
                    description: 'CSV Files',
                    accept: { 'text/csv': ['.csv'] }
                }],
                excludeAcceptAllOption: false,
                multiple: false
            });
            fileHandle = handle;
            const file = await handle.getFile();
            const text = await file.text();
            const parsed = parseCSV(text);
            // Remove from addedWords any that are present in the imported CSV (case-insensitive)
            const importedWords = new Set(parsed.map(entry => (entry.word || '').trim().toLowerCase()));
            addedWords = addedWords.filter(entry => !importedWords.has((entry.word || '').trim().toLowerCase()));
            vocabFromCSV = parsed;
            renderVocabList();
            attachSyllableClickEvents();
            showMsg('CSV file loaded for editing!', true);
            saveFileBtn.style.display = '';
        } catch (err) {
            showMsg('Failed to open file: ' + err.message, false);
        }
    };

    saveFileBtn.onclick = async function () {
        if (!fileHandle) {
            showMsg('No file open to save.', false);
            return;
        }
        try {
            const allVocab = [...vocabFromCSV, ...addedWords];
            const seen = new Set();
            const deduped = [];
            for (const entry of allVocab) {
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
            const writable = await fileHandle.createWritable();
            await writable.write(csv);
            await writable.close();
            showMsg('Saved to file!', true);
        } catch (err) {
            showMsg('Failed to save: ' + err.message, false);
        }
    };
}

function setupAddWordMinimize() {
    const section = document.getElementById('add-word-section');
    const toggleBtn = document.getElementById('add-word-toggle');
    section.classList.add('add-word-minimized');
    toggleBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        section.classList.toggle('add-word-minimized');
        if (section.classList.contains('add-word-minimized')) {
            toggleBtn.innerHTML = '&#x25B2;';
        } else {
            toggleBtn.innerHTML = '&#x25BC;';
        }
    });
    document.getElementById('add-word-header').addEventListener('click', function (e) {
        if (e.target !== toggleBtn) toggleBtn.click();
    });
}

// --- Fix: Move syllable badges below words on mobile ---
(function () {
    var style = document.createElement('style');
    style.innerHTML = `@media (max-width: 700px) { .syllable-badge { position: static !important; margin: 0.2em auto 0.1em auto !important; top: auto !important; right: auto !important; } }`;
    document.head.appendChild(style);
})();

function renderVocabList() {
    const vocabDiv = document.querySelector('.vocab-list');
    const consonants = ['m', 's', 't', 'd', 'b', 'p', 'l'];
    const consonantMeanings = {
        m: 'change',
        s: 'structure',
        t: 'time',
        d: 'knowledge',
        b: 'being',
        p: 'action',
        l: 'emotion'
    };
    const groups = { m: [], s: [], t: [], d: [], b: [], p: [], l: [] };
    const allVocab = [...vocabFromCSV, ...addedWords];
    allVocab.forEach(entry => {
        const match = entry.word.match(/[mstdbpl]/i);
        const key = match ? match[0].toLowerCase() : null;
        if (key && groups[key]) {
            groups[key].push(entry);
        }
    });
    let html = '<div style="display:flex;gap:1.5em;flex-wrap:wrap;">';
    consonants.forEach(c => {
        html += `<div style="flex:1 1 0;min-width:170px;">
            <strong style=\"color:#4b0082;font-size:1.1em;\">${c.toUpperCase()}</strong>
            <span style=\"color:#666;font-size:0.98em;margin-left:0.4em;\">(${consonantMeanings[c]})</span>
            <div>`;
        if (groups[c].length > 0) {
            groups[c].forEach(entry => {
                html += `<p><span class=\"word\">${entry.word}</span> – ${entry.meaning}</p>`;
            });
        } else {
            html += '<p style="color:#aaa;">(none)</p>';
        }
        html += '</div></div>';
    });
    html += '</div>';
    vocabDiv.innerHTML = html;
    document.querySelectorAll('.word').forEach(el => {
        el.innerHTML = annotateWord(el.textContent);
    });
    attachTooltipEvents();
    updateMeaningTable();
}

function updateMeaningTable() {
    const meaningTable = document.getElementById('meaning-table');
    if (meaningTable) {
        const consonants = ['', 'm', 's', 't', 'd', 'b', 'p', 'l'];
        const vowels = ['a', 'e', 'i', 'o'];
        const allSylls = [];
        for (const c of consonants) for (const v of vowels) allSylls.push(c + v);
        const all2SyllWords = [];
        for (const s1 of allSylls) {
            for (const s2 of allSylls) {
                if (s1.length === 2 && s2.length === 2) {
                    all2SyllWords.push(s1 + s2);
                }
            }
        }
        function getAllUsed2SyllWords() {
            const used = new Set();
            document.querySelectorAll('.vocab-list .word').forEach(el => {
                const w = el.textContent.trim().toLowerCase();
                for (let i = 0; i <= w.length - 4; i++) {
                    const sub = w.slice(i, i + 4);
                    if (sub.length === 4) used.add(sub);
                }
            });
            return used;
        }
        function getUnusedCount(syllable) {
            const used2Syll = getAllUsed2SyllWords();
            return all2SyllWords.filter(w => !used2Syll.has(w) && w.includes(syllable)).length;
        }
        function getUsedWordCount(syllable) {
            let count = 0;
            document.querySelectorAll('.vocab-list .word').forEach(el => {
                const w = el.textContent.trim().toLowerCase();
                if (w.includes(syllable)) count++;
            });
            return count;
        }
        for (let row of meaningTable.tBodies[0].rows) {
            for (let i = 1; i < row.cells.length; i++) {
                const cell = row.cells[i];
                const text = cell.textContent.trim();
                if (meanings[text]) {
                    // Only show used badge (green)
                    const usedBadge = `<span class="syllable-badge" style="position:absolute;top:6px;right:10px;background:#b6f5b6;color:#228b22;font-size:0.85em;font-weight:bold;border-radius:1em;padding:0.1em 0.7em 0.1em 0.7em;z-index:2;box-shadow:0 2px 8px rgba(34,139,34,0.13);border:1.5px solid #b6f5b6;pointer-events:none;">${getUsedWordCount(text)}</span>`;
                    cell.style.position = 'relative';
                    cell.innerHTML = `<div class="table-cell-clickable" data-syllable="${text}" style="position:relative;cursor:pointer;">${usedBadge}<span class="table-syllable" style="color:#4b0082;font-weight:bold;">${text}</span><span class="table-meaning">${meanings[text]}</span></div>`;
                } else {
                    cell.style.position = '';
                }
            }
        }
        attachSyllableClickEvents();
    }
}

function attachSyllableClickEvents() {
    document.querySelectorAll('.table-cell-clickable').forEach(cellDiv => {
        cellDiv.addEventListener('click', function () {
            const syllable = this.getAttribute('data-syllable');
            const listDiv = document.getElementById('syllable-words-list');
            // If already open for this syllable, close it
            if (listDiv && listDiv.getAttribute('data-syllable') === syllable && listDiv.innerHTML.trim() !== '') {
                listDiv.innerHTML = '';
                listDiv.removeAttribute('data-syllable');
            } else {
                showWordsWithSyllable(syllable);
                if (listDiv) listDiv.setAttribute('data-syllable', syllable);
            }
        });
    });
}

function highlightSyllableInWordWithTooltips(word, syllable) {
    let result = '';
    for (let i = 0; i < word.length;) {
        if (i < word.length - 1 && word.substring(i, i + 2) === syllable) {
            const meaning = meanings[syllable] || '';
            result += `<span data-tooltip="${meaning}" style="background: #ffe066; color: #222; border-radius: 3px; padding: 0 2px; border-bottom: 1px dotted #666; cursor: help;">${syllable}</span>`;
            i += 2;
        } else if (word[i] === syllable && syllable.length === 1) {
            const meaning = meanings[syllable] || '';
            result += `<span data-tooltip="${meaning}" style="background: #ffe066; color: #222; border-radius: 3px; padding: 0 2px; border-bottom: 1px dotted #666; cursor: help;">${syllable}</span>`;
            i += 1;
        } else if (i < word.length - 1 && meanings[word.substring(i, i + 2)]) {
            const chunk = word.substring(i, i + 2);
            const meaning = meanings[chunk] || '';
            result += `<span data-tooltip="${meaning}" style="border-bottom: 1px dotted #666; cursor: help;">${chunk}</span>`;
            i += 2;
        } else if (meanings[word[i]]) {
            const meaning = meanings[word[i]] || '';
            result += `<span data-tooltip="${meaning}" style="border-bottom: 1px dotted #666; cursor: help;">${word[i]}</span>`;
            i += 1;
        } else {
            result += word[i];
            i += 1;
        }
    }
    return result;
}

function showWordsWithSyllable(syllable) {
    const listDiv = document.getElementById('syllable-words-list');
    const matches = [];
    document.querySelectorAll('.vocab-list p').forEach(p => {
        const word = p.querySelector('.word').textContent.trim();
        if (word.includes(syllable)) {
            const highlighted = highlightSyllableInWordWithTooltips(word, syllable);
            const def = p.textContent.replace(word, '').replace(/^(	*–	*)/, '– ');
            matches.push(`<li><span style="font-weight:bold;">${highlighted}</span> ${def}</li>`);
        }
    });
    const used2Syll = new Set();
    document.querySelectorAll('.vocab-list .word').forEach(el => {
        const w = el.textContent.trim().toLowerCase();
        for (let i = 0; i <= w.length - 4; i++) {
            const sub = w.slice(i, i + 4);
            if (sub.length === 4) used2Syll.add(sub);
        }
    });
    const consonants = ['', 'm', 's', 't', 'd', 'b', 'p', 'l'];
    const vowels = ['a', 'e', 'i', 'o'];
    const allSylls = [];
    for (const c of consonants) for (const v of vowels) allSylls.push(c + v);
    const all2SyllWords = [];
    for (const s1 of allSylls) {
        for (const s2 of allSylls) {
            if (s1.length === 2 && s2.length === 2) {
                all2SyllWords.push(s1 + s2);
            }
        }
    }
    const unused = all2SyllWords.filter(w => !used2Syll.has(w) && w.includes(syllable));
    function getSyllableMeanings(word) {
        const s1 = word.slice(0, 2);
        const s2 = word.slice(2, 4);
        const m1 = meanings[s1] ? `${s1}: ${meanings[s1]}` : `${s1}: ?`;
        const m2 = meanings[s2] ? `${s2}: ${meanings[s2]}` : `${s2}: ?`;
        return `(${m1}, ${m2})`;
    }
    let unusedSection = '';
    if (unused.length > 0) {
        unusedSection = `<div style="margin-top:1.5em;"><strong>Unused 2-syllable words containing "<span style=\"color:#4b0082\">${syllable}</span>":</strong><ul style="margin:0.5em 0 0 1.5em;">${unused.map(s => `<li><code class=\"unused-word\" style=\"cursor:pointer;text-decoration:underline dotted #4b0082;\" title=\"Add this word\">${s}</code> <span style=\"color:#666;font-size:0.95em;\">${getSyllableMeanings(s)}</span></li>`).join('')}</ul></div>`;
    } else {
        unusedSection = `<div style=\"margin-top:1.5em;\"><strong>No unused 2-syllable words containing \"<span style=\\"color:#4b0082\\">${syllable}</span>\".</strong></div>`;
    }
    setTimeout(() => {
        document.querySelectorAll('.unused-word').forEach(el => {
            el.addEventListener('click', function (e) {
                const section = document.getElementById('add-word-section');
                // Support both CTA and legacy toggle
                const cta = document.getElementById('add-word-cta');
                const toggleBtn = document.getElementById('add-word-toggle');
                if (section.classList.contains('add-word-minimized')) {
                    if (cta) {
                        cta.click();
                    } else if (toggleBtn) {
                        toggleBtn.click();
                    }
                }
                const wordInput = document.getElementById('new-word');
                if (wordInput) {
                    wordInput.value = this.textContent;
                    wordInput.dispatchEvent(new Event('input', { bubbles: true }));
                    wordInput.focus();
                }
            });
        });
    }, 0);
    const closeBtn = `<button id="close-syllable-list" style="float:right;background:none;border:none;font-size:1.2em;cursor:pointer;color:#4b0082;" title="Close">&times;</button>`;
    if (matches.length > 0) {
        listDiv.innerHTML = `<div style="margin:1em 0 1em 0;padding:1em;background:#f9f6ff;border:1px solid #e6e6fa;border-radius:6px;position:relative;">
      ${closeBtn}
      <strong>Words containing "<span style="color:#4b0082">${syllable}</span>":</strong>
      <ul style="margin:0.5em 0 0 1.5em;">${matches.join('')}</ul>
      ${unusedSection}
    </div>`;
    } else {
        listDiv.innerHTML = `<div style="margin:1em 0 1em 0;padding:1em;background:#f9f6ff;border:1px solid #e6e6fa;border-radius:6px;position:relative;">
      ${closeBtn}
      <strong>No words found containing "<span style="color:#4b0082">${syllable}</span>".</strong>
      ${unusedSection}
    </div>`;
    }
    const close = document.getElementById('close-syllable-list');
    if (close) close.onclick = () => { listDiv.innerHTML = ''; };
    attachTooltipEvents();
}

// --- Add Word CTA open/close logic ---
function setupAddWordCTA() {
    const section = document.getElementById('add-word-section');
    const cta = document.getElementById('add-word-cta');
    const closeBtn = document.getElementById('add-word-close');
    function openPanel() {
        section.classList.remove('add-word-minimized');
        setTimeout(() => {
            const wordInput = document.getElementById('new-word');
            if (wordInput) wordInput.focus();
        }, 200);
    }
    function closePanel() {
        section.classList.add('add-word-minimized');
    }
    if (cta) cta.addEventListener('click', openPanel);
    if (closeBtn) closeBtn.addEventListener('click', closePanel);
    document.addEventListener('keydown', function (e) {
        if (!section.classList.contains('add-word-minimized') && (e.key === 'Escape' || e.key === 'Esc')) {
            closePanel();
        }
    });
}

// --- Initialization ---
function ilimiInit() {
    setupTooltip();
    setupAddWordSection();
    setupCSVButtons();
    setupAddWordCTA();
    fetch(csvPath)
        .then(res => res.text())
        .then(text => {
            vocabFromCSV = parseCSV(text);
            renderVocabList();
        });
    attachTooltipEvents();
    attachSyllableClickEvents();
}

document.addEventListener('DOMContentLoaded', ilimiInit);
