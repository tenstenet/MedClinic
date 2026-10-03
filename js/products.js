// js/products.js

// ============ КАТАЛОГ ПРОДУКТОВ ============
// КБЖУ на 100 г
const PRODUCTS = [
  { id: 1,  name: 'Овсянка (сухая)',        calories: 350, protein: 12, fats: 6,  carbs: 60 },
  { id: 2,  name: 'Рис белый (сухой)',      calories: 344, protein: 7,  fats: 1,  carbs: 78 },
  { id: 3,  name: 'Рис бурый (сухой)',      calories: 337, protein: 8,  fats: 3,  carbs: 72 },
  { id: 4,  name: 'Гречка (сухая)',         calories: 343, protein: 13, fats: 3,  carbs: 72 },
  { id: 5,  name: 'Макароны (сухие)',       calories: 350, protein: 12, fats: 1,  carbs: 72 },
  { id: 6,  name: 'Булгур (сухой)',         calories: 342, protein: 12, fats: 1,  carbs: 76 },
  { id: 7,  name: 'Кускус (сухой)',         calories: 376, protein: 13, fats: 1,  carbs: 77 },

  { id: 10, name: 'Куриная грудка',         calories: 165, protein: 31, fats: 4,  carbs: 0 },
  { id: 11, name: 'Куриное бедро',          calories: 185, protein: 25, fats: 9,  carbs: 0 },
  { id: 12, name: 'Индейка (грудка)',       calories: 104, protein: 19, fats: 2,  carbs: 0 },
  { id: 13, name: 'Говядина',               calories: 187, protein: 26, fats: 9,  carbs: 0 },
  { id: 14, name: 'Свинина (шейка)',        calories: 343, protein: 16, fats: 31, carbs: 0 },
  { id: 15, name: 'Лосось',                 calories: 208, protein: 20, fats: 13, carbs: 0 },
  { id: 16, name: 'Треска',                 calories: 82,  protein: 18, fats: 1,  carbs: 0 },
  { id: 17, name: 'Тунец (консервы)',       calories: 116, protein: 25, fats: 1,  carbs: 0 },

  { id: 20, name: 'Яйцо куриное',           calories: 143, protein: 13, fats: 10, carbs: 1 },
  { id: 21, name: 'Молоко 2.5%',            calories: 52,  protein: 3,  fats: 3,  carbs: 5 },
  { id: 22, name: 'Творог 5%',              calories: 121, protein: 17, fats: 5,  carbs: 3 },
  { id: 23, name: 'Творог обезжиренный',    calories: 71,  protein: 18, fats: 0,  carbs: 1 },
  { id: 24, name: 'Кефир 1%',               calories: 40,  protein: 3,  fats: 1,  carbs: 4 },
  { id: 25, name: 'Сыр твердый',            calories: 380, protein: 24, fats: 30, carbs: 0 },
  { id: 26, name: 'Йогурт натуральный',     calories: 66,  protein: 4,  fats: 4,  carbs: 4 },

  { id: 30, name: 'Огурец',                 calories: 15,  protein: 1,  fats: 0,  carbs: 3 },
  { id: 31, name: 'Помидор',                calories: 18,  protein: 1,  fats: 0,  carbs: 4 },
  { id: 32, name: 'Брокколи',               calories: 34,  protein: 3,  fats: 0,  carbs: 7 },
  { id: 33, name: 'Морковь',                calories: 41,  protein: 1,  fats: 0,  carbs: 10 },
  { id: 34, name: 'Картофель',              calories: 77,  protein: 2,  fats: 0,  carbs: 17 },
  { id: 35, name: 'Капуста белокочанная',   calories: 25,  protein: 1,  fats: 0,  carbs: 6 },
  { id: 36, name: 'Перец болгарский',       calories: 27,  protein: 1,  fats: 0,  carbs: 6 },
  { id: 37, name: 'Лук репчатый',           calories: 40,  protein: 1,  fats: 0,  carbs: 9 },

  { id: 40, name: 'Яблоко',                 calories: 52,  protein: 0,  fats: 0,  carbs: 14 },
  { id: 41, name: 'Банан',                  calories: 89,  protein: 1,  fats: 0,  carbs: 23 },
  { id: 42, name: 'Апельсин',               calories: 47,  protein: 1,  fats: 0,  carbs: 12 },
  { id: 43, name: 'Груша',                  calories: 57,  protein: 0,  fats: 0,  carbs: 15 },
  { id: 44, name: 'Виноград',               calories: 69,  protein: 1,  fats: 0,  carbs: 18 },
  { id: 45, name: 'Клубника',               calories: 32,  protein: 1,  fats: 0,  carbs: 8 },
  { id: 46, name: 'Черника',                calories: 57,  protein: 1,  fats: 0,  carbs: 14 },

  { id: 50, name: 'Миндаль',                calories: 579, protein: 21, fats: 50, carbs: 22 },
  { id: 51, name: 'Грецкий орех',           calories: 654, protein: 15, fats: 65, carbs: 14 },
  { id: 52, name: 'Семечки подсолнечника',  calories: 584, protein: 21, fats: 51, carbs: 20 },

  { id: 60, name: 'Хлеб белый',             calories: 265, protein: 9,  fats: 3,  carbs: 49 },
  { id: 61, name: 'Хлеб ржаной',            calories: 250, protein: 7,  fats: 3,  carbs: 48 },
  { id: 62, name: 'Батон',                  calories: 264, protein: 8,  fats: 3,  carbs: 50 },

  { id: 70, name: 'Масло оливковое',        calories: 884, protein: 0,  fats: 100, carbs: 0 },
  { id: 71, name: 'Масло сливочное',        calories: 717, protein: 1,  fats: 81,  carbs: 0 },
  { id: 72, name: 'Сахар',                  calories: 387, protein: 0,  fats: 0,   carbs: 100 },
  { id: 73, name: 'Мёд',                    calories: 304, protein: 0,  fats: 0,   carbs: 82 },
  { id: 74, name: 'Шоколад темный',         calories: 546, protein: 5,  fats: 31,  carbs: 61 }
];

// ============ ИНИЦИАЛИЗАЦИЯ ============

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(location.search);
  const dateFromURL = urlParams.get('date') || todayISO();

  document.getElementById('back-link').href = `diary.html?date=${dateFromURL}`;

  const grid         = document.getElementById('products-grid');
  const searchInput  = document.getElementById('search');
  const emptySearch  = document.getElementById('empty-search');
  const gramsPanel   = document.getElementById('grams-panel');
  const selNameEl    = document.getElementById('selected-product-name');
  const selKbjuEl    = document.getElementById('selected-product-kbju');
  const gramsForm    = document.getElementById('grams-form');
  const gramsInput   = document.getElementById('grams-input');
  const preview      = document.getElementById('preview');
  const cancelBtn    = document.getElementById('cancel-selection');
  const toast        = document.getElementById('toast');

  let selectedProduct = null;

  // Первый рендер
  renderGrid(PRODUCTS);

  // Поиск
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(query));
    renderGrid(filtered);

    emptySearch.style.display = filtered.length === 0 ? 'block' : 'none';
    grid.style.display       = filtered.length === 0 ? 'none'  : 'grid';
  });

  // ============ РЕНДЕР СЕТКИ ============
  async function renderGrid(items) {
    let favIds = new Set();
    try {
      const favs = await API.getFavorites('product');
      favIds = new Set(favs.map(f => f.itemId));
    } catch (e) {
      console.warn('Не удалось загрузить избранное', e);
    }

    grid.innerHTML = items.map(p => {
      const isFav = favIds.has(p.id);
      return `
        <div class="product-card">
          <div class="product-card__head">
            <div class="product-card__name">${escapeHtml(p.name)}</div>
            <button type="button" class="product-card__fav ${isFav ? 'product-card__fav_active' : ''}"
                    data-id="${p.id}" aria-label="В избранное">★</button>
          </div>
          <div class="product-card__kbju">
            ${p.calories} ккал · Б ${p.protein} · Ж ${p.fats} · У ${p.carbs}
          </div>
          <div class="product-card__hint">на 100 г</div>
          <button type="button" class="button button_theme_green product-card__add" data-id="${p.id}">
            Добавить
          </button>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.product-card__add').forEach(btn => {
      btn.addEventListener('click', () => selectProduct(Number(btn.dataset.id)));
    });

    grid.querySelectorAll('.product-card__fav').forEach(btn => {
      btn.addEventListener('click', () => toggleFavorite(Number(btn.dataset.id), btn));
    });
  }

  // ============ ИЗБРАННОЕ ============
  async function toggleFavorite(productId, btnEl) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    try {
      const isFav = await API.isFavorite('product', productId);

      if (isFav) {
        await API.removeFavorite('product', productId);
        btnEl.classList.remove('product-card__fav_active');
        showToast('Убрано из избранного');
      } else {
        await API.addFavorite({
          type: 'product',
          itemId: product.id,
          name: product.name,
          calories: product.calories,
          protein: product.protein,
          fats: product.fats,
          carbs: product.carbs
        });
        btnEl.classList.add('product-card__fav_active');
        showToast('Добавлено в избранное');
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // ============ ВЫБОР ПРОДУКТА ============
  function selectProduct(productId) {
    selectedProduct = PRODUCTS.find(p => p.id === productId);
    if (!selectedProduct) return;

    selNameEl.textContent = selectedProduct.name;
    selKbjuEl.textContent = `На 100 г: ${selectedProduct.calories} ккал · Б ${selectedProduct.protein} · Ж ${selectedProduct.fats} · У ${selectedProduct.carbs}`;
    gramsInput.value = 100;

    updatePreview();
    gramsPanel.style.display = 'block';

    gramsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => gramsInput.focus({ preventScroll: true }), 400);
  }

  cancelBtn.addEventListener('click', () => {
    selectedProduct = null;
    gramsPanel.style.display = 'none';
  });

  function updatePreview() {
    if (!selectedProduct) return;
    const grams = Number(gramsInput.value) || 0;
    const f = grams / 100;

    preview.innerHTML = `
      <div class="grams-panel__preview-title">Итого за ${grams} г:</div>
      <div class="grams-panel__preview-values">
        <b>${Math.round(selectedProduct.calories * f)} ккал</b>
        · Б ${round1(selectedProduct.protein * f)}
        · Ж ${round1(selectedProduct.fats * f)}
        · У ${round1(selectedProduct.carbs * f)}
      </div>
    `;
  }

  gramsInput.addEventListener('input', updatePreview);

  // ============ ДОБАВЛЕНИЕ В ДНЕВНИК ============
  gramsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const grams = Number(gramsInput.value);
    const errEl = document.querySelector('[data-error-for="grams-input"]');
    errEl.textContent = '';
    gramsInput.classList.remove('form__input_error');

    if (!grams || grams <= 0) {
      errEl.textContent = 'Введите положительное число';
      gramsInput.classList.add('form__input_error');
      return;
    }

    const f = grams / 100;
    const meal = {
      type: 'product',
      date: dateFromURL,
      productId: selectedProduct.id,
      name: selectedProduct.name,
      grams: grams,
      calories: selectedProduct.calories * f,
      protein:  selectedProduct.protein  * f,
      fats:     selectedProduct.fats     * f,
      carbs:    selectedProduct.carbs    * f
    };

    try {
      await API.addMeal(meal);
      showToast('Добавлено в дневник');
      selectedProduct = null;
      gramsPanel.style.display = 'none';
    } catch (err) {
      alert(err.message);
    }
  });

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

  function round1(n) { return Math.round(n * 10) / 10; }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
});