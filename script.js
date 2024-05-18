let profilePictureUrl = '';

document.addEventListener('DOMContentLoaded', () => {
  const savedUsername = localStorage.getItem('username');
  const savedProfilePicture = localStorage.getItem('profilePicture');
  const savedDescription = localStorage.getItem('description');
  const savedMessages = JSON.parse(localStorage.getItem('messages')) || [];

  if (savedUsername) document.getElementById('usernameInputSettings').value = savedUsername;
  if (savedProfilePicture) {
    profilePictureUrl = savedProfilePicture;
    document.getElementById('userPhoto').src = savedProfilePicture;
  }
  if (savedDescription) document.getElementById('descriptionInputSettings').value = savedDescription;

  const messagesContainer = document.getElementById('messages');
  savedMessages.forEach(message => {
    messagesContainer.innerHTML += `
      <div class="message">
        <img src="${message.picture || 'https://via.placeholder.com/40'}" alt="Profile Picture" onclick="viewProfile('${message.username}', '${message.picture}', '${message.description}')">
        <div>
          <div class="username" onclick="viewProfile('${message.username}', '${message.picture}', '${message.description}')">${message.username}</div>
          <div>${message.text.replace(/\n/g, '<br>')}</div>
          <div class="timestamp">${message.timestamp}</div>
        </div>
      </div>`;
  });
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Start in chat view
  toggleView('chat');
});

function toggleView(view) {
  document.querySelectorAll('.settings, .chat, .profile').forEach(el => el.classList.remove('active'));
  document.getElementById(view).classList.add('active');
  if (view === 'profile') updateProfileView();
}

function previewProfilePicture() {
  const file = document.getElementById('profilePictureInput').files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      profilePictureUrl = reader.result;
      document.getElementById('userPhoto').src = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

function saveSettings() {
  const username = document.getElementById('usernameInputSettings').value.trim();
  const description = document.getElementById('descriptionInputSettings').value.trim();
  if (username) {
    localStorage.setItem('username', username);
    localStorage.setItem('profilePicture', profilePictureUrl);
    localStorage.setItem('description', description);
    alert('Configurações salvas!');
  }
}

function sendMessage() {
  const username = localStorage.getItem('username') || 'Anonymous';
  const messageInput = document.getElementById('messageInput');
  const messageText = messageInput.value.trim();
  if (!messageText) return;
  const now = new Date();
  const message = {
    username: username,
    picture: profilePictureUrl,
    description: localStorage.getItem('description'),
    text: messageText,
    timestamp: now.toLocaleString(),
  };

  const messagesContainer = document.getElementById('messages');
  messagesContainer.innerHTML += `
    <div class="message">
      <img src="${message.picture || 'https://via.placeholder.com/40'}" alt="Profile Picture" onclick="viewProfile('${message.username}', '${message.picture}', '${message.description}')">
      <div>
        <div class="username" onclick="viewProfile('${message.username}', '${message.picture}', '${message.description}')">${message.username}</div>
        <div>${message.text.replace(/\n/g, '<br>')}</div>
        <div class="timestamp">${message.timestamp}</div>
      </div>
    </div>`;
  messageInput.value = '';
  document.getElementById('charCount').textContent = '0/500';
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  const savedMessages = JSON.parse(localStorage.getItem('messages')) || [];
  savedMessages.push(message);
  localStorage.setItem('messages', JSON.stringify(savedMessages));
}

function deleteMessages() {
  localStorage.removeItem('messages');
  document.getElementById('messages').innerHTML = '';
}

document.getElementById('messageInput').addEventListener('input', () => {
  const charCount = document.getElementById('messageInput').value.length;
  document.getElementById('charCount').textContent = `${charCount}/500`;
});

function viewProfile(username, picture, description) {
  document.getElementById('profileUsername').textContent = username;
  document.getElementById('profilePicture').src = picture || 'https://via.placeholder.com/100';
  document.getElementById('profileDescription').textContent = description || 'No description available';
  toggleView('profile');
}

function updateProfileView() {
  const username = localStorage.getItem('username') || 'Anonymous';
  const profilePicture = localStorage.getItem('profilePicture') || 'https://via.placeholder.com/100';
  const description = localStorage.getItem('description') || 'No description available';

  document.getElementById('profileUsername').textContent = username;
  document.getElementById('profilePicture').src = profilePicture;
  document.getElementById('profileDescription').textContent = description;
        }
function deleteAllMessages() {
  localStorage.removeItem('messages');
  document.getElementById('messages').innerHTML = '';
}
