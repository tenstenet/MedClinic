// js/profile.js

document.addEventListener('DOMContentLoaded', () => {
  const user = API.getCurrentUser();
  if (!user) return; // auth.js уже выкинет

  // Элементы
  const avatarEl    = document.getElementById('profile-avatar');
  const nameEl      = document.getElementById('profile-name');
  const emailEl     = document.getElementById('profile-email');
  const sinceEl     = document.getElementById('profile-since');
  const form        = document.getElementById('profile-form');
  const nameInput   = document.getElementById('edit-name');
  const toast       = document.getElementById('toast');

  // Заполняем карточку
  renderUser(user);
  loadStats();

  // Сабмит формы
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const newName = nameInput.value.trim();

    if (newName.length < 2) {
      showError('edit-name', 'Введите имя и фамилию');
      return;
    }

    try {
      // Обновляем currentUser
      const updated = { ...user, name: newName };
      localStorage.setItem('currentUser', JSON.stringify(updated));

      // Обновляем также в списке "users" (если есть)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const idx = users.findIndex(u => u.email === user.email);
      if (idx !== -1) {
        users[idx].name = newName;
        localStorage.setItem('users', JSON.stringify(users));
      }

      renderUser(updated);
      showToast('Имя сохранено');
    } catch (err) {
      alert(err.message);
    }
  });

  // ============ РЕНДЕР ============

  function renderUser(u) {
    const displayName = u.name || u.email.split('@')[0];
    nameEl.textContent  = displayName;
    emailEl.textContent = u.email;
    avatarEl.textContent = getInitials(displayName);
    nameInput.value = displayName;

    if (u.registeredAt) {
      const d = new Date(u.registeredAt);
      sinceEl.textContent = `Аккаунт создан: ${d.toLocaleDateString('ru-RU')}`;
    } else {
      sinceEl.textContent = '';
    }
  }

  async function loadStats() {
    try {
      // Все приёмы пищи пользователя
      const allMeals = await getAllMeals();

      const favorites = await API.getFavorites();

      // Уникальные дни
      const days = new Set(allMeals.map(m => m.date));

      document.getElementById('stat-meals').textContent     = allMeals.length;
      document.getElementById('stat-favorites').textContent = favorites.length;
      document.getElementById('stat-days').textContent      = days.size;
    } catch (err) {
      console.error(err);
    }
  }

  // Получаем все приёмы пищи (не только за день)
  async function getAllMeals() {
    if (typeof USE_MOCK !== 'undefined' && USE_MOCK) {
      return JSON.parse(localStorage.getItem('meals') || '[]');
    }
    // Когда будет бэк — сделаем отдельный API.getAllMeals()
    const res = await fetch('/api/meals/all', { credentials: 'include' });
    if (!res.ok) return [];
    return res.json();
  }

  // ============ ВСПОМОГАТЕЛЬНЫЕ ============

  function getInitials(name) {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('');
  }

  function showError(id, message) {
    const input = document.getElementById(id);
    const error = document.querySelector(`[data-error-for="${id}"]`);
    if (input) input.classList.add('form__input_error');
    if (error) error.textContent = message;
  }

  function clearErrors() {
    document.querySelectorAll('.form__error').forEach(el => el.textContent = '');
    document.querySelectorAll('.form__input_error').forEach(el => el.classList.remove('form__input_error'));
  }

  let toastTimer = null;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('toast_visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('toast_visible'), 2500);
  }
});