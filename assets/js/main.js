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
   NOYS - اندازه‌گیری ارتفاع واقعی بخش بالایی سایدبار (عکس+بیو)
   تا بخش پایینی (موضوعات) هیچ‌وقت روش نیفته.
   ========================================================= */

function noysSyncSidebarHeight() {
  var top = document.querySelector('.sidebar-top');
  if (!top) return;
  var h = top.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--noys-sidebar-top-h', h + 'px');
}

window.addEventListener('load', noysSyncSidebarHeight);
window.addEventListener('resize', noysSyncSidebarHeight);

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
