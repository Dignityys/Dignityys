let profilePictureUrl = '';
let lastOnline = new Date().toLocaleString();

document.addEventListener('DOMContentLoaded', () => {
  const savedUsername = localStorage.getItem('username');
  const savedProfilePicture = localStorage.getItem('profilePicture');
  const savedDescription = localStorage.getItem('description');
  const savedLastOnline = localStorage.getItem('lastOnline');
  const savedMessages = JSON.parse(localStorage.getItem('messages')) || [];

  if (savedUsername) document.getElementById('usernameInputSettings').value = savedUsername;
  if (savedProfilePicture) {
    profilePictureUrl = savedProfilePicture;
    document.getElementById('userPhoto').src = savedProfilePicture;
  }
  if (savedDescription) document.getElementById('descriptionInputSettings').value = savedDescription;
  if (savedLastOnline) lastOnline = savedLastOnline;

  const messagesContainer = document.getElementById('messages');
  savedMessages.forEach(message => {
    messagesContainer.innerHTML += `
      <div class="message">
        <img src="${message.picture || 'https://via.placeholder.com/40'}" alt="Profile Picture" onclick="viewProfile('${message.username}', '${message.picture}', '${message.description}', '${message.lastOnline}')">
        <div>
          <div class="username" onclick="viewProfile('${message.username}', '${message.picture}', '${message.description}', '${message.lastOnline}')">${message.username}</div>
          <div>${message.text.replace(/\n/g, '<br>')}</div>
          <div class="timestamp">${message.timestamp}</div>
        </div>
      </div>`;
  });
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
    localStorage.setItem('lastOnline', lastOnline);
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
    lastOnline: lastOnline,
  };

  const messagesContainer = document.getElementById('messages');
  messagesContainer.innerHTML += `
    <div class="message">
      <img src="${profilePictureUrl || 'https://via.placeholder.com/40'}" alt="Profile Picture" onclick="viewProfile('${username}', '${profilePictureUrl}', '${localStorage.getItem('description')}', '${lastOnline}')">
      <div>
        <div class="username" onclick="viewProfile('${username}', '${profilePictureUrl}', '${localStorage.getItem('description')}', '${lastOnline}')">${username}</div>
        <div>${messageText.replace(/\n/g, '<br>')}</div>
        <div class="timestamp">${message.timestamp}</div>
      </div>
    </div>`;
  messageInput.value = '';
  document.getElementById('charCount').textContent = '0/500';
  messageInput.focus();
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  const savedMessages = JSON.parse(localStorage.getItem('messages')) || [];
  savedMessages.push(message);
  localStorage.setItem('messages', JSON.stringify(savedMessages));
}

function viewProfile(username, picture, description, lastOnline) {
  document.getElementById('profileUsername').textContent = username;
  document.getElementById('profilePicture').src = picture || 'https://via.placeholder.com/100';
  document.getElementById('profileDescription').textContent = description || 'No description provided.';
  document.getElementById('profileLastOnline').textContent = `Last online: ${lastOnline}`;
  toggleView('profile');
}

document.getElementById('messageInput').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    if (event.shiftKey) {
      const start = this.selectionStart;
      const end = this.selectionEnd;
      this.value = this.value.substring(0, start) + '\n' + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 1;
    } else {
      event.preventDefault();
      sendMessage();
    }
  }
  document.getElementById('charCount').textContent = `${this.value.length}/500`;
});
