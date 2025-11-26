<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kỷ niệm K28</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>Kỷ niệm K28</h1>
  </header>

  <main>
    <section class="entry-form">
      <h2>Ghi lại kỷ niệm</h2>
      <form id="journalForm">
        <input type="text" id="name" placeholder="Tên của bạn" required>
        <input type="number" id="age" placeholder="Tuổi" required>
        <input type="date" id="date" required>
        <textarea id="content" placeholder="Nhập suy nghĩ, kỷ niệm..." required></textarea>
        <input type="file" id="image" accept="image/*">
        <button type="submit">Thêm kỷ niệm</button>
      </form>
    </section>

    <section class="entries">
      <h2>Các kỷ niệm</h2>
      <div id="entriesContainer">
        <!-- Các kỷ niệm sẽ hiển thị ở đây -->
      </div>
    </section>
  </main>

  <script src="script.js"></script>
</body>
</html>
body {
  font-family: Arial, sans-serif;
  background-color: #e0f7fa; /* xanh nước nhạt */
  color: #006064; /* xanh đậm */
  margin: 0;
  padding: 0;
}

header {
  text-align: center;
  background-color: #00acc1;
  color: white;
  padding: 1rem 0;
}

h1, h2 {
  margin: 0.5rem 0;
}

main {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.entry-form, .entries {
  background-color: #b2ebf2;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 2rem;
}

input, textarea, button {
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #006064;
  box-sizing: border-box;
}

button {
  background-color: #00acc1;
  color: white;
  font-weight: bold;
  cursor: pointer;
  border: none;
}

button:hover {
  background-color: #00838f;
}

.entry {
  border-bottom: 1px solid #006064;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
}

.entry img {
  max-width: 100%;
  margin-top: 0.5rem;
  border-radius: 5px;
}
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
