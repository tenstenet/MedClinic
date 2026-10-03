// js/api.js
//
// Слой работы с данными.
// СЕЙЧАС: localStorage (mock).
// ПОТОМ: заменишь тела методов на fetch('/api/...') — вызовы в других файлах не изменятся.

const USE_MOCK = true; // ← переключишь на false, когда появится сервер

const API = {

  // ==================== ПОЛЬЗОВАТЕЛИ ====================

  async register({ name, email, password }) {
    if (USE_MOCK) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      if (users.find(u => u.email === email)) {
        throw new Error('Пользователь с таким email уже существует');
      }

      const user = { id: Date.now(), name, email, password };
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
      this._setSession(user);
      return this._safe(user);
    }

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Ошибка регистрации');

    const user = await res.json();
    this._setSession(user);
    return user;
  },

  async login({ email, password }) {
    if (USE_MOCK) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) throw new Error('Неверный email или пароль');

      this._setSession(user);
      return this._safe(user);
    }

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Неверный email или пароль');

    const user = await res.json();
    this._setSession(user);
    return user;
  },

  async logout() {
    if (USE_MOCK) {
      localStorage.removeItem('currentUser');
      return;
    }

    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      // даже если сервер недоступен — чистим локально
    }
    localStorage.removeItem('currentUser');
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  },

  // ==================== ДНЕВНИК (ПРИЁМЫ ПИЩИ) ====================

  async getMeals(date) {
    if (USE_MOCK) {
      const all = JSON.parse(localStorage.getItem('meals') || '[]');
      return all.filter(m => m.date === date);
    }

    const res = await fetch(`/api/meals?date=${date}`, { credentials: 'include' });
    if (!res.ok) throw new Error('Не удалось загрузить приёмы пищи');
    return res.json();
  },

  async addMeal(meal) {
    if (USE_MOCK) {
      const all = JSON.parse(localStorage.getItem('meals') || '[]');
      const newMeal = { ...meal, id: Date.now() };
      all.push(newMeal);
      localStorage.setItem('meals', JSON.stringify(all));
      return newMeal;
    }

    const res = await fetch('/api/meals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(meal)
    });
    if (!res.ok) throw new Error('Не удалось добавить приём пищи');
    return res.json();
  },

  async deleteMeal(id) {
    if (USE_MOCK) {
      const all = JSON.parse(localStorage.getItem('meals') || '[]');
      localStorage.setItem('meals', JSON.stringify(all.filter(m => m.id !== id)));
      return;
    }

    const res = await fetch(`/api/meals/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Не удалось удалить');
  },

  // ==================== ПРОФИЛЬ ====================

  async getProfile() {
    if (USE_MOCK) {
      return JSON.parse(localStorage.getItem('profile') || 'null');
    }

    const res = await fetch('/api/profile', { credentials: 'include' });
    if (!res.ok) return null;
    return res.json();
  },

  async saveProfile(profile) {
    if (USE_MOCK) {
      localStorage.setItem('profile', JSON.stringify(profile));
      return profile;
    }

    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(profile)
    });
    if (!res.ok) throw new Error('Не удалось сохранить профиль');
    return res.json();
  },

  // ==================== ИЗБРАННОЕ ====================
  // item = {
  //   type: 'product' | 'recipe',
  //   itemId: number,
  //   name: string,
  //   calories, protein, fats, carbs: number,
  //   description?: string  // для рецептов
  // }

  async getFavorites(type) {
    // type: 'product' | 'recipe' | undefined (undefined = все)
    if (USE_MOCK) {
      const all = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (!type) return all;
      return all.filter(f => f.type === type);
    }

    const url = type ? `/api/favorites?type=${type}` : '/api/favorites';
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) throw new Error('Не удалось загрузить избранное');
    return res.json();
  },

  async addFavorite(item) {
    if (USE_MOCK) {
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      const exists = favs.find(f => f.type === item.type && f.itemId === item.itemId);
      if (exists) return; // уже в избранном — ничего не делаем

      favs.push(item);
      localStorage.setItem('favorites', JSON.stringify(favs));
      return;
    }

    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Не удалось добавить в избранное');
  },

  async removeFavorite(type, itemId) {
    if (USE_MOCK) {
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      const filtered = favs.filter(f => !(f.type === type && f.itemId === itemId));
      localStorage.setItem('favorites', JSON.stringify(filtered));
      return;
    }

    const res = await fetch(`/api/favorites/${type}/${itemId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Не удалось убрать из избранного');
  },

  async isFavorite(type, itemId) {
    const favs = await this.getFavorites(type);
    return favs.some(f => f.itemId === itemId);
  },

    // ==================== СТЕНА ====================

  async getPosts() {
    if (USE_MOCK) {
      const all = JSON.parse(localStorage.getItem('posts') || '[]');
      // Свежие сверху
      return all.sort((a, b) => b.createdAt - a.createdAt);
    }

    const res = await fetch('/api/posts', { credentials: 'include' });
    if (!res.ok) throw new Error('Не удалось загрузить посты');
    return res.json();
  },

  async createPost(text) {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Нужно войти');

    const post = {
      id: Date.now(),
      authorEmail: user.email,
      authorName: user.name || user.email.split('@')[0],
      text: text,
      createdAt: Date.now(),
      likes: [],        // массив email тех, кто лайкнул
      comments: []      // {id, authorEmail, authorName, text, createdAt}
    };

    if (USE_MOCK) {
      const all = JSON.parse(localStorage.getItem('posts') || '[]');
      all.push(post);
      localStorage.setItem('posts', JSON.stringify(all));
      return post;
    }

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error('Не удалось создать пост');
    return res.json();
  },

  async deletePost(postId) {
    if (USE_MOCK) {
      const all = JSON.parse(localStorage.getItem('posts') || '[]');
      const filtered = all.filter(p => p.id !== postId);
      localStorage.setItem('posts', JSON.stringify(filtered));
      return;
    }

    const res = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Не удалось удалить пост');
  },

  async toggleLike(postId) {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Нужно войти');

    if (USE_MOCK) {
      const all = JSON.parse(localStorage.getItem('posts') || '[]');
      const post = all.find(p => p.id === postId);
      if (!post) throw new Error('Пост не найден');

      post.likes = post.likes || [];
      const idx = post.likes.indexOf(user.email);

      if (idx === -1) {
        post.likes.push(user.email);
      } else {
        post.likes.splice(idx, 1);
      }

      localStorage.setItem('posts', JSON.stringify(all));
      return post;
    }

    const res = await fetch(`/api/posts/${postId}/like`, {
      method: 'POST',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Не удалось поставить реакцию');
    return res.json();
  },

  async addComment(postId, text) {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Нужно войти');

    const comment = {
      id: Date.now(),
      authorEmail: user.email,
      authorName: user.name || user.email.split('@')[0],
      text: text,
      createdAt: Date.now()
    };

    if (USE_MOCK) {
      const all = JSON.parse(localStorage.getItem('posts') || '[]');
      const post = all.find(p => p.id === postId);
      if (!post) throw new Error('Пост не найден');

      post.comments = post.comments || [];
      post.comments.push(comment);
      localStorage.setItem('posts', JSON.stringify(all));
      return comment;
    }

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error('Не удалось добавить комментарий');
    return res.json();
  },
  
  // ==================== СЛУЖЕБНОЕ ====================

  _setSession(user) {
    const { password, ...safe } = user;
    localStorage.setItem('currentUser', JSON.stringify(safe));
  },

  _safe(user) {
    const { password, ...safe } = user;
    return safe;
  }
};

window.API = API;