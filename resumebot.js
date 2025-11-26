// Load particles.js
particlesJS("particles-js", {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 800 } },
      color: { value: "#a970ff" },
      shape: { type: "circle" },
      opacity: { value: 0.3 },
      size: { value: 3 },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#a970ff",
        opacity: 0.2,
        width: 1
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        out_mode: "out"
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: true, mode: "push" }
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  });
  
  // OpenRouter API Key (replace with your real one)
  const apiKey = '';
  
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');
  
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = userInput.value.trim();
    if (!userMessage) return;
  
    // Display user message
    appendMessage(userMessage, 'user-message');
    userInput.value = '';
  
    // Call OpenRouter API
    const response = await getBotResponse(userMessage);
    appendMessage(response, 'bot-message');
  });
  
  function appendMessage(message, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = className;
    messageDiv.innerText = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  
  async function getBotResponse(message) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost/ai-resume-builder/',
          'X-Title': 'ResumeBot Chat'
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "user", content: message }]
        })
      });
      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      return "⚠️ Sorry, there was an error connecting to RésuméBot.";
    }
  }
  
