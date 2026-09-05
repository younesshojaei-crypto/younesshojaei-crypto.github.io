/* =========================================================
   NOYS - نقشه‌ی تعاملی جهان
   با موس روی هر کشور: اگه اون کشور مطلب داشته باشه، کشور
   هایلایت/برجسته می‌شه و یک باکس شناور با عکس + اسم مطلب/مطلب‌های
   مربوط به همون کشور نمایش داده می‌شه.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  var wrap = document.getElementById('noysWorldMapWrap');
  var svg = document.getElementById('noys-world-map-svg');
  var dataScript = document.getElementById('noysCountryData');
  var tooltip = document.getElementById('noysWorldTooltip');
  var tooltipCountry = document.getElementById('noysWorldTooltipCountry');
  var tooltipItems = document.getElementById('noysWorldTooltipItems');

  if (!wrap || !svg || !dataScript || !tooltip) return;

  var countryData = {};
  try {
    var parsed = JSON.parse(dataScript.textContent) || [];

    /* داده‌ها ممکنه به‌صورت آرایه‌ای از رکوردها بیاد (هر کدوم با
       فیلد code)، یا مستقیم یک آبجکت کلیدشده با کد کشور باشه.
       این‌جا هر دو حالت رو پشتیبانی می‌کنیم و در نهایت یک آبجکت
       می‌سازیم که با کد کشور (مثلاً "IQ") قابل دسترسیه. */
    if (Array.isArray(parsed)) {
      parsed.forEach(function (entry) {
        if (entry && entry.code) {
          countryData[entry.code] = entry;
        }
      });
    } else {
      countryData = parsed;
    }
  } catch (e) {
    countryData = {};
  }

  var countryCodes = Object.keys(countryData);
  if (!countryCodes.length) return;

  countryCodes.forEach(function (code) {
    var path = svg.querySelector('#' + CSS.escape(code));
    if (path) {
      path.classList.add('has-content');
    }
  });

  var activePath = null;

  function showTooltip(code, path, evt) {
    var entry = countryData[code];
    if (!entry) return;

    tooltipCountry.textContent = entry.name || code;

    tooltipItems.innerHTML = entry.items
      .slice(0, 3)
      .map(function (item) {
        return (
          '<a class="noys-world-tooltip-item" href="' +
          item.url +
          '">' +
          '<img src="' +
          item.img +
          '" alt="" loading="lazy">' +
          '<span class="noys-world-tooltip-item-title">' +
          item.title +
          '</span>' +
          '</a>'
        );
      })
      .join('');

    tooltip.hidden = false;
    positionTooltip(evt);
  }

  function hideTooltip() {
    tooltip.hidden = true;
    if (activePath) {
      activePath.classList.remove('is-active');
      activePath = null;
    }
  }

  function positionTooltip(evt) {
    var wrapRect = wrap.getBoundingClientRect();
    var x = evt.clientX - wrapRect.left;
    var y = evt.clientY - wrapRect.top;

    tooltip.style.left = x + 'px';
    tooltip.style.top = y - 10 + 'px';
  }

  svg.addEventListener('mousemove', function (evt) {
    var path = evt.target.closest('path');
    if (!path) return;

    var code = path.id;

    if (!countryData[code]) {
      if (!path.classList.contains('has-content')) {
        hideTooltip();
      }
      return;
    }

    if (activePath !== path) {
      if (activePath) activePath.classList.remove('is-active');
      path.classList.add('is-active');
      activePath = path;
    }

    showTooltip(code, path, evt);
  });

  svg.addEventListener('mouseleave', hideTooltip);
});
