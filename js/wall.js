// js/wall.js

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = API.getCurrentUser();
  if (!currentUser) return; // auth.js выкинет

  // Элементы
  const feed          = document.getElementById('posts-feed');
  const emptyFeed     = document.getElementById('empty-feed');
  const postForm      = document.getElementById('post-form');
  const postText      = document.getElementById('post-text');
  const postCounter   = document.getElementById('post-counter');
  const newPostAvatar = document.getElementById('new-post-avatar');
  const toast         = document.getElementById('toast');

  // Аватар в форме
  newPostAvatar.textContent = getInitials(currentUser.name || currentUser.email);

  // Счётчик символов
  postText.addEventListener('input', () => {
    postCounter.textContent = postText.value.length;
  });

  // Первый рендер
  loadPosts();

  // Сабмит поста
  postForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const text = postText.value.trim();
    if (text.length < 1) return;

    try {
      await API.createPost(text);
      postText.value = '';
      postCounter.textContent = '0';
      showToast('Пост опубликован');
      loadPosts();
    } catch (err) {
      alert(err.message);
    }
  });

  // ============ ЗАГРУЗКА И РЕНДЕР ============

  async function loadPosts() {
    try {
      const posts = await API.getPosts();

      if (posts.length === 0) {
        feed.innerHTML = '';
        emptyFeed.style.display = 'block';
        return;
      }

      emptyFeed.style.display = 'none';
      feed.innerHTML = posts.map(p => renderPost(p, currentUser)).join('');

      bindPostEvents();
    } catch (err) {
      console.error(err);
    }
  }

  function renderPost(post, me) {
    const isOwner    = post.authorEmail === me.email;
    const isLiked    = (post.likes || []).includes(me.email);
    const likesCount = (post.likes || []).length;
    const comments   = post.comments || [];

    return `
      <article class="post" data-post-id="${post.id}">
        <header class="post__head">
          <div class="post__avatar">${getInitials(post.authorName)}</div>
          <div class="post__author">
            <div class="post__author-name">${escapeHtml(post.authorName)}</div>
            <div class="post__date">${formatDate(post.createdAt)}</div>
          </div>
          ${isOwner ? `<button type="button" class="post__delete" data-action="delete" title="Удалить">×</button>` : ''}
        </header>

        <div class="post__text">${escapeHtml(post.text).replace(/\n/g, '<br>')}</div>

        <footer class="post__actions">
          <button type="button" class="post__action ${isLiked ? 'post__action_active' : ''}"
                  data-action="like">
            👍 <span>${likesCount}</span>
          </button>
          <button type="button" class="post__action" data-action="toggle-comments">
            💬 <span>${comments.length}</span>
          </button>
        </footer>

        <div class="post__comments" style="display:none;">
          <div class="post__comments-list">
            ${comments.map(c => renderComment(c)).join('')}
          </div>
          <form class="post__comment-form" data-action="comment-form">
            <input type="text" class="form__input post__comment-input"
                   placeholder="Написать комментарий..." maxlength="300" required>
            <button type="submit" class="button button_theme_green post__comment-submit">
              Отправить
            </button>
          </form>
        </div>
      </article>
    `;
  }

  function renderComment(c) {
    return `
      <div class="comment">
        <div class="comment__avatar">${getInitials(c.authorName)}</div>
        <div class="comment__body">
          <div class="comment__head">
            <span class="comment__author">${escapeHtml(c.authorName)}</span>
            <span class="comment__date">${formatDate(c.createdAt)}</span>
          </div>
          <div class="comment__text">${escapeHtml(c.text)}</div>
        </div>
      </div>
    `;
  }

  // ============ ОБРАБОТЧИКИ ============

  function bindPostEvents() {
    feed.querySelectorAll('.post').forEach(postEl => {
      const postId = Number(postEl.dataset.postId);

      // Лайк
      const likeBtn = postEl.querySelector('[data-action="like"]');
      likeBtn?.addEventListener('click', () => handleLike(postId));

      // Раскрыть комментарии
      const commentsBtn = postEl.querySelector('[data-action="toggle-comments"]');
      const commentsBox = postEl.querySelector('.post__comments');
      commentsBtn?.addEventListener('click', () => {
        const visible = commentsBox.style.display === 'block';
        commentsBox.style.display = visible ? 'none' : 'block';
      });

      // Удалить пост
      const deleteBtn = postEl.querySelector('[data-action="delete"]');
      deleteBtn?.addEventListener('click', () => handleDelete(postId));

      // Форма комментария
      const commentForm = postEl.querySelector('[data-action="comment-form"]');
      commentForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = commentForm.querySelector('.post__comment-input');
        handleComment(postId, input.value.trim(), input);
      });
    });
  }

  async function handleLike(postId) {
    try {
      await API.toggleLike(postId);
      loadPosts();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(postId) {
    if (!confirm('Удалить пост?')) return;
    try {
      await API.deletePost(postId);
      showToast('Пост удалён');
      loadPosts();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleComment(postId, text, inputEl) {
    if (!text) return;
    try {
      await API.addComment(postId, text);
      inputEl.value = '';
      showToast('Комментарий добавлен');
      loadPosts();
    } catch (err) {
      alert(err.message);
    }
  }

  // ============ УТИЛИТЫ ============

  function getInitials(name) {
    return String(name)
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('');
  }

  function formatDate(timestamp) {
    const d = new Date(timestamp);
    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMin < 1)    return 'только что';
    if (diffMin < 60)   return `${diffMin} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays < 7)   return `${diffDays} дн назад`;

    return d.toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  let toastTimer = null;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('toast_visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('toast_visible'), 2500);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
});