/* global LanguageModel */

let inputNewMeaning;
let inputNewWord;
let buttonGenerateReading;
let aiReadingResult;

let session;

async function runPrompt(prompt, params) {
    try {
        if (!session) {
            session = await LanguageModel.create(params);
        }
        return session.prompt(prompt);
    } catch (e) {
        console.log('Prompt failed');
        console.error(e);
        console.log('Prompt:', prompt);
        // Reset session
        reset();
        throw e;
    }
}

async function reset() {
    if (session) {
        session.destroy();
    }
    session = null;
}

async function initDefaults() {
    inputNewMeaning = document.getElementById('new-meaning');
    inputNewWord = document.getElementById('new-word');
    buttonGenerateReading = document.getElementById('generate-reading-btn');
    aiReadingResult = document.getElementById('ai-reading-result');

    // chrome://flags/#prompt-api-for-gemini-nano
    if (typeof LanguageModel === 'undefined' || LanguageModel === undefined || await LanguageModel.availability() === "unavailable") {
        buttonGenerateReading.style.display = 'none';
        aiReadingResult.style.display = 'none';
        console.log('LanguageModel API is unavailable, enable Gemini Nano flag in chrome://flags/#prompt-api-for-gemini-nano'); 
        return;
    }

    const defaults = await LanguageModel.params();
    console.log('Model default:', defaults);
    if (!('LanguageModel' in self)) {
        console.log('LanguageModel not available');
        return;
    }

    if (buttonGenerateReading) {
        buttonGenerateReading.addEventListener('click', async () => {
            const meaning = inputNewMeaning.value.trim();
            aiReadingResult.textContent = '';
            if (!meaning) {
                aiReadingResult.textContent = 'Please enter a meaning first.';
                return;
            }
            aiReadingResult.textContent = 'Generating...';
            try {
                const params = {
                    initialPrompts: [
                        {
                            role: 'system',
                            content: 'You are an expert in the Ilimi constructed language. Ilimi is a constructed language based on the composition of syllables, each formed by combining one consonant and one vowel (CV). Each consonant and each vowel carries a core abstract meaning, and these meanings combine in each syllable to create an intuitive semantic unit. Words are built from one or more syllables, and their meaning can often be inferred from their components. The language is designed to be semantically transparent and aesthetically soft. The vowels and their meanings are: a = self / identity, e = relation / connection, i = thought / insight, o = world / external context. The consonants and their meanings are: m = change / motion, s = structure / form, t = time / sequence, d = knowledge / clarity, b = being / existence, p = action / will, l = emotion / feeling. The CV syllables and their meanings are: ma = personal change, me = relational change, mi = learning / growth, mo = environmental motion, sa = defined form, se = relational structure, si = pattern / logic, so = object / thing, ta = experienced time, te = ordered time, ti = anticipated time, to = time cycle, da = personal knowledge, de = shared knowledge, di = clarity of thought, do = recorded truth, ba = self / person, be = you / other person, bi = conscious being, bo = living thing, pa = decision / directed act, pe = cooperative action, pi = intentional act / effort, po = strong or forceful action, la = emotional self, le = emotional bond, li = intuition / insight, lo = ambient feeling / mood. Given an English meaning, generate a plausible Ilimi word (reading) using the language\'s phonetic and semantic rules. Only output the word, no explanation. Here are some examples : ilimi, sami, tami, bipi, lolo, lamimi, apadele, batiso, dapabome, etc. the word should only be composed of syllables and no other characters. No dashes, spaces, or other characters should be used.',
                        }

                    ],
                };
                const prompt = `Generate an Ilimi word for: "${meaning}"`;
                const response = await runPrompt(prompt, params);
                inputNewWord.value = response.trim();
                // Dispatch input event to update any listeners
                const event = new Event('input', { bubbles: true });
                inputNewWord.dispatchEvent(event);
                aiReadingResult.textContent = `Generated reading: ${inputNewWord.value}`;
            } catch (e) {
                aiReadingResult.textContent = 'Error generating reading.';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', initDefaults);