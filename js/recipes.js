// js/recipes.js

// ============ КАТАЛОГ РЕЦЕПТОВ ============
// КБЖУ указаны НА ПОРЦИЮ (1 порция)
const RECIPES = [
  {
    id: 1,
    name: 'Овсяноблин с творогом',
    description: 'Овсянка, яйцо, творог, зелень',
    calories: 320, protein: 25, fats: 10, carbs: 30
  },
  {
    id: 2,
    name: 'Греческий салат',
    description: 'Огурец, помидор, сыр фета, оливки, масло',
    calories: 280, protein: 8,  fats: 22, carbs: 10
  },
  {
    id: 3,
    name: 'Куриное филе с овощами',
    description: 'Курица, брокколи, перец, лук',
    calories: 340, protein: 42, fats: 10, carbs: 15
  },
  {
    id: 4,
    name: 'Творожная запеканка',
    description: 'Творог, яйцо, мёд, изюм',
    calories: 260, protein: 22, fats: 8,  carbs: 25
  },
  {
    id: 5,
    name: 'Смузи с бананом и клубникой',
    description: 'Банан, клубника, йогурт, мёд',
    calories: 210, protein: 6,  fats: 3,  carbs: 40
  },
  {
    id: 6,
    name: 'Лосось с рисом',
    description: 'Лосось, рис, лимон, зелень',
    calories: 480, protein: 32, fats: 18, carbs: 45
  },
  {
    id: 7,
    name: 'Омлет с овощами',
    description: 'Яйца, помидор, перец, зелень',
    calories: 240, protein: 18, fats: 16, carbs: 6
  },
  {
    id: 8,
    name: 'Киноа с овощами',
    description: 'Киноа, брокколи, морковь, масло',
    calories: 350, protein: 12, fats: 12, carbs: 50
  },
  {
    id: 9,
    name: 'Индейка с гречкой',
    description: 'Индейка, гречка, лук, морковь',
    calories: 420, protein: 38, fats: 8,  carbs: 48
  },
  {
    id: 10,
    name: 'Салат с тунцом',
    description: 'Тунец, яйцо, огурец, листья салата',
    calories: 230, protein: 28, fats: 10, carbs: 5
  },
  {
    id: 11,
    name: 'Протеиновые панкейки',
    description: 'Овсянка, яйцо, банан, протеин',
    calories: 380, protein: 30, fats: 8,  carbs: 45
  },
  {
    id: 12,
    name: 'Тыквенный суп-пюре',
    description: 'Тыква, морковь, лук, сливки',
    calories: 190, protein: 4,  fats: 8,  carbs: 26
  },
  {
    id: 13,
    name: 'Котлеты из индейки на пару',
    description: 'Фарш индейки, лук, яйцо',
    calories: 250, protein: 30, fats: 10, carbs: 5
  },
  {
    id: 14,
    name: 'Шоколадный смузи с овсянкой',
    description: 'Какао, банан, овсянка, молоко',
    calories: 320, protein: 10, fats: 8,  carbs: 52
  },
  {
    id: 15,
    name: 'Запечённые овощи с сыром',
    description: 'Кабачок, баклажан, перец, сыр',
    calories: 270, protein: 12, fats: 16, carbs: 20
  }
];

// ============ ИНИЦИАЛИЗАЦИЯ ============

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(location.search);
  const dateFromURL = urlParams.get('date') || todayISO();

  document.getElementById('back-link').href = `diary.html?date=${dateFromURL}`;

  const grid        = document.getElementById('recipes-grid');
  const searchInput = document.getElementById('search');
  const emptySearch = document.getElementById('empty-search');
  const toast       = document.getElementById('toast');

  // Первый рендер
  renderGrid(RECIPES);

  // Поиск
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = RECIPES.filter(r => r.name.toLowerCase().includes(query));
    renderGrid(filtered);

    emptySearch.style.display = filtered.length === 0 ? 'block' : 'none';
    grid.style.display       = filtered.length === 0 ? 'none'  : 'grid';
  });

  // ============ РЕНДЕР СЕТКИ ============

  async function renderGrid(items) {
    let favIds = new Set();
    try {
      const favs = await API.getFavorites('recipe');
      favIds = new Set(favs.map(f => f.itemId));
    } catch (e) {
      console.warn('Не удалось загрузить избранное', e);
    }

    grid.innerHTML = items.map(r => {
      const isFav = favIds.has(r.id);
      return `
        <div class="product-card">
          <div class="product-card__head">
            <div class="product-card__name">${escapeHtml(r.name)}</div>
            <button type="button" class="product-card__fav ${isFav ? 'product-card__fav_active' : ''}"
                    data-id="${r.id}" aria-label="В избранное">★</button>
          </div>
          <div class="product-card__kbju">
            ${r.calories} ккал · Б ${r.protein} · Ж ${r.fats} · У ${r.carbs}
          </div>
          <div class="product-card__hint">${escapeHtml(r.description)}</div>
          <button type="button" class="button button_theme_green product-card__add" data-id="${r.id}">
            Добавить в дневник
          </button>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.product-card__add').forEach(btn => {
      btn.addEventListener('click', () => addRecipe(Number(btn.dataset.id)));
    });

    grid.querySelectorAll('.product-card__fav').forEach(btn => {
      btn.addEventListener('click', () => toggleFavorite(Number(btn.dataset.id), btn));
    });
  }

  // ============ ИЗБРАННОЕ ============

  async function toggleFavorite(recipeId, btnEl) {
    const recipe = RECIPES.find(r => r.id === recipeId);
    if (!recipe) return;

    try {
      const isFav = await API.isFavorite('recipe', recipeId);

      if (isFav) {
        await API.removeFavorite('recipe', recipeId);
        btnEl.classList.remove('product-card__fav_active');
        showToast('Убрано из избранного');
      } else {
        await API.addFavorite({
          type: 'recipe',
          itemId: recipe.id,
          name: recipe.name,
          calories: recipe.calories,
          protein: recipe.protein,
          fats: recipe.fats,
          carbs: recipe.carbs,
          description: recipe.description
        });
        btnEl.classList.add('product-card__fav_active');
        showToast('Добавлено в избранное');
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // ============ ДОБАВЛЕНИЕ В ДНЕВНИК ============

  async function addRecipe(recipeId) {
    const recipe = RECIPES.find(r => r.id === recipeId);
    if (!recipe) return;

    const meal = {
      type: 'recipe',
      date: dateFromURL,
      recipeId: recipe.id,
      name: recipe.name,
      calories: recipe.calories,
      protein:  recipe.protein,
      fats:     recipe.fats,
      carbs:    recipe.carbs
    };

    try {
      await API.addMeal(meal);
      showToast('Добавлено в дневник');
    } catch (err) {
      alert(err.message);
    }
  }

  // ============ TOAST ============

  let toastTimer = null;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('toast_visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('toast_visible'), 2500);
  }

  // ============ УТИЛИТЫ ============

  function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
});