
let data = JSON.parse(localStorage.getItem('myStash')) || [];
let currentTab = 'home';

const types = {
  notes: '✎ Notes',
  reminders: '⏰ Reminders',
  trinkets: '💿 Trinkets',
  wishlist: '☆ Wishlist'
};

function save() {
  localStorage.setItem('myStash', JSON.stringify(data));
  render();
}

function showTab(tab) {
  currentTab = tab;
  document.getElementById('pageTitle').textContent =
    tab === 'home' ? 'Your little collection ✿' : types[tab];
  render();
}

function addItem() {
  const title = document.getElementById('itemTitle').value.trim();
  const content = document.getElementById('itemContent').value.trim();
  const date = document.getElementById('itemDate').value;

  if (!title) return alert('Give your item a title first!');

  let type = currentTab === 'home' ? 'notes' : currentTab;

  data.unshift({
    id: Date.now(),
    title,
    content,
    date,
    type
  });

  document.getElementById('itemTitle').value = '';
  document.getElementById('itemContent').value = '';
  document.getElementById('itemDate').value = '';

  save();
}

function deleteItem(id) {
  if (confirm('Remove this from your stash?')) {
    data = data.filter(item => item.id !== id);
    save();
  }
}

function render() {
  const query = document.getElementById('search').value.toLowerCase();

  document.getElementById('noteCount').textContent =
    data.filter(x => x.type === 'notes').length;
  document.getElementById('reminderCount').textContent =
    data.filter(x => x.type === 'reminders').length;
  document.getElementById('trinketCount').textContent =
    data.filter(x => x.type === 'trinkets').length;
  document.getElementById('wishCount').textContent =
    data.filter(x => x.type === 'wishlist').length;

  const filtered = data.filter(x =>
    (currentTab === 'home' || x.type === currentTab) &&
    (x.title + x.content).toLowerCase().includes(query)
  );

  document.getElementById('items').innerHTML =
    filtered.length ? filtered.map(x => `
      <article class="item">
        <button class="delete" onclick="deleteItem(${x.id})">×</button>
        <h3>${escapeHTML(x.title)}</h3>
        <p>${escapeHTML(x.content || 'A little something to remember ♡')}</p>
        <small>${types[x.type]} ${x.date ? ' • ' + x.date : ''}</small>
      </article>
    `).join('') :
    '<div class="empty">✧ Nothing here yet. Add something cute! ✧</div>';
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[c]);
}

render();
