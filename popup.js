let isPrinting = false;

document.getElementById('send').addEventListener('click', sendUserInput);

// Trigger send button with enter key
document.getElementById('userInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendUserInput();
    }
});

function sendUserInput() {
    if (isPrinting) return; // Don't allow another message until current is fully printed

    const userInput = document.getElementById('userInput').value;

    if (userInput.trim() === '') return; // Prevent sending empty messages

    document.getElementById('userInput').value = '';  // Clear the input field

    // Display the user's message immediately
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<p class="message userMessage">${userInput}</p>`;

    // Hide the API key note
    document.getElementById('api-key-note').style.display = 'none';

    // Disable userInput and send button while AI is printing
    document.getElementById('userInput').disabled = true;
    document.getElementById('send').disabled = true;

    chrome.runtime.sendMessage({message: 'generate_text', userInput: userInput}, response => {
        // Display the AI's response word by word
        let words = response.data.split(' ');
        let aiMessageElement = document.createElement('p');
        aiMessageElement.classList.add('message', 'aiMessage');
        messagesDiv.appendChild(aiMessageElement);

        isPrinting = true;

        let i = 0;
        let intervalId = setInterval(() => {
            if (i < words.length) {
                aiMessageElement.textContent += words[i] + ' ';
                i++;
            } else {
                clearInterval(intervalId);
                isPrinting = false;
                // Re-enable userInput and send button after AI has finished printing
                document.getElementById('userInput').disabled = false;
                document.getElementById('send').disabled = false;
            }
        }, 80);  // Adjust the speed of "streaming" here
    });
}
