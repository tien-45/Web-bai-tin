const form = document.getElementById('journalForm');
const entriesContainer = document.getElementById('entriesContainer');

// Load dữ liệu từ LocalStorage khi mở trang
function loadEntries() {
  const entries = JSON.parse(localStorage.getItem('entries') || '[]');
  entriesContainer.innerHTML = '';
  entries.reverse().forEach(entry => {
    displayEntry(entry);
  });
}

// Hiển thị 1 kỷ niệm
function displayEntry(entry) {
  const entryDiv = document.createElement('div');
  entryDiv.classList.add('entry');

  entryDiv.innerHTML = `
    <h3>${entry.name} (${entry.age} tuổi) - ${entry.date}</h3>
    <p>${entry.content}</p>
  `;

  if (entry.image) {
    const img = document.createElement('img');
    img.src = entry.image;
    entryDiv.appendChild(img);
  }

  entriesContainer.appendChild(entryDiv);
}

// Thêm kỷ niệm mới
form.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const date = document.getElementById('date').value;
  const content = document.getElementById('content').value;
  const imageFile = document.getElementById('image').files[0];

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function() {
      const imageData = reader.result;
      saveEntry({name, age, date, content, image: imageData});
    }
    reader.readAsDataURL(imageFile);
  } else {
    saveEntry({name, age, date, content, image: null});
  }

  form.reset();
});

// Lưu kỷ niệm vào LocalStorage và load lại
function saveEntry(entry) {
  const entries = JSON.parse(localStorage.getItem('entries') || '[]');
  entries.push(entry);
  localStorage.setItem('entries', JSON.stringify(entries));
  loadEntries();
}

// Load entries khi mở trang
loadEntries();