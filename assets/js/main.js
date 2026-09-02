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
