document.getElementById('save').addEventListener('click', () => {
    const openai_key = document.getElementById('openai_key').value;
    chrome.storage.local.set({openai_key: openai_key}, () => {
        console.log('OpenAI key saved');
    });
});

// Load the saved OpenAI key when the options page is opened
chrome.storage.local.get('openai_key', data => {
    if (data.openai_key) {
        document.getElementById('openai_key').value = data.openai_key;
    }
});
