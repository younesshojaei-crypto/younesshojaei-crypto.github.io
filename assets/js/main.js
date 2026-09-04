/* =========================================================
   NOYS - MAIN JS
   Lightbox for article images (cover image + inline images)
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  var selectors = [
    '.article-page .page-cover-image img',
    '.article-page .post-markdown-body img'
  ];

  var images = document.querySelectorAll(selectors.join(','));

  if (!images.length) {
    return;
  }

  var overlay = document.createElement('div');
  overlay.className = 'noys-lightbox';
  overlay.innerHTML = '<img class="noys-lightbox-img" alt="">';
  document.body.appendChild(overlay);

  var lightboxImg = overlay.querySelector('.noys-lightbox-img');

  function openLightbox(src, alt) {
    lightboxImg.setAttribute('src', src);
    lightboxImg.setAttribute('alt', alt || '');
    overlay.classList.add('is-open');
    document.body.classList.add('noys-lightbox-active');
  }

  function closeLightbox() {
    overlay.classList.remove('is-open');
    document.body.classList.remove('noys-lightbox-active');
  }

  images.forEach(function (img) {
    img.addEventListener('click', function () {
      openLightbox(img.getAttribute('src'), img.getAttribute('alt'));
    });
  });

  overlay.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });

});

/* =========================================================
   NOYS - جستجوی زنده (توی نوار شناور بالا)
   با یک بار fetch کردن search-index.json (که جکیل خودش از
   روی تمام پست‌ها می‌سازه)، روی عنوان/دسته/تگ فیلتر می‌کنه.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  var toggleBtn = document.getElementById('noysSearchToggle');
  var panel = document.getElementById('noysSearchPanel');
  var input = document.getElementById('noysSearchInput');
  var resultsBox = document.getElementById('noysSearchResults');

  if (!toggleBtn || !panel || !input || !resultsBox) return;

  var searchData = null;
  var searchDataPromise = null;

  function loadSearchData() {
    if (searchDataPromise) return searchDataPromise;

    searchDataPromise = fetch(
      (window.NOYS_BASEURL || '') + '/search-index.json'
    )
      .then(function (res) { return res.json(); })
      .then(function (data) {
        searchData = data;
        return data;
      })
      .catch(function () {
        searchData = [];
        return [];
      });

    return searchDataPromise;
  }

  function renderResults(items, query) {
    if (!items.length) {
      resultsBox.innerHTML =
        '<p class="noys-search-empty">چیزی برای «' +
        query +
        '» پیدا نشد.</p>';
      return;
    }

    resultsBox.innerHTML = items
      .slice(0, 8)
      .map(function (item) {
        return (
          '<a class="noys-search-result" href="' +
          item.url +
          '">' +
          '<img src="' +
          item.img +
          '" alt="" loading="lazy">' +
          '<span class="noys-search-result-text">' +
          '<span class="noys-search-result-title">' +
          item.title +
          '</span>' +
          '<span class="noys-search-result-meta">' +
          (item.isPodcast ? 'پادکست' : 'مجله') +
          ' · ' +
          item.date +
          '</span>' +
          '</span>' +
          '</a>'
        );
      })
      .join('');
  }

  function runSearch(query) {
    query = (query || '').trim();

    if (!query) {
      resultsBox.innerHTML = '';
      return;
    }

    loadSearchData().then(function (data) {
      var q = query.toLowerCase();

      var filtered = data.filter(function (item) {
        var haystack = [
          item.title,
          item.excerpt,
          (item.categories || []).join(' '),
          (item.tags || []).join(' ')
        ]
          .join(' ')
          .toLowerCase();

        return haystack.indexOf(q) !== -1;
      });

      renderResults(filtered, query);
    });
  }

  function openSearch() {
    panel.hidden = false;
    loadSearchData();
    window.setTimeout(function () {
      input.focus();
    }, 50);
  }

  function closeSearch() {
    panel.hidden = true;
  }

  toggleBtn.addEventListener('click', function () {
    if (panel.hidden) {
      openSearch();
    } else {
      closeSearch();
    }
  });

  input.addEventListener('input', function () {
    runSearch(input.value);
  });

  document.addEventListener('click', function (e) {
    var nav = document.getElementById('noysFloatNav');
    if (nav && !nav.contains(e.target)) {
      closeSearch();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeSearch();
    }
  });
});

/* =========================================================
   NOYS - سوییچ حالت روشن/تاریک
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  var toggleBtn = document.querySelector('.noys-theme-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', function () {
    var html = document.documentElement;
    var current = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var next = current === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', next);

    try {
      localStorage.setItem('noys-theme', next);
    } catch (e) {}
  });
});
