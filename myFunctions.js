/* ============================================================
   myFunctions.js  – All JS / jQuery for the project
   ============================================================ */

$(document).ready(function () {

  /* ── active nav link ── */
  var page = location.pathname.split('/').pop() || 'home.html';
  $('.navbar-nav a').each(function () {
    if ($(this).attr('href') === page) $(this).addClass('active');
  });

  /* ============================================================
     MEALS PAGE – toggle detail rows
  ============================================================ */
  $(document).on('click', '.btn-detail', function () {
    var target = $(this).data('target');
    var $row   = $('#' + target);
    if ($row.is(':visible')) {
      $row.slideUp(280);
      $(this).removeClass('open').text('إظهار');
    } else {
      $row.slideDown(320);
      $(this).addClass('open').text('إخفاء');
    }
  });

  /* ============================================================
     MEALS PAGE – Continue button
  ============================================================ */
  $('#btn-continue').on('click', function () {
    if ($('.meal-checkbox:checked').length === 0) {
      alert('الرجاء اختيار وجبة واحدة على الأقل قبل المتابعة');
      return;
    }
    $('#order-form').slideDown(420);
    $('html,body').animate({ scrollTop: $('#order-form').offset().top - 30 }, 600);
  });

  /* ============================================================
     VALIDATION HELPERS
  ============================================================ */

  /* Full name: English letters + exactly one space */
  function validName(v) {
    if (v === '') return true;  // optional
    return /^[A-Za-z]+\s[A-Za-z]+$/.test(v.trim());
  }

  /* Bank account: exactly 6 digits (may start with 0) */
  function validAccount(v) {
    return /^\d{6}$/.test(v.trim()); // required
  }

  /* Date yyyy-mm-dd */
  function validDate(v) {
    if (v === '') return true;  // optional
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
    var d = new Date(v);
    return !isNaN(d.getTime());
  }

  /* Mobile: Syriatel 09(3|4|5|6|8|9)XXXXXXX  |  MTN 09(0|1|2)XXXXXXX */
  function validMobile(v) {
    if (v === '') return true;  // optional
    return /^09[012345689]\d{7}$/.test(v.trim());
  }

  function markOk($inp, $msg) {
    $inp.removeClass('input-error');
    $msg.removeClass('show');
  }

  function markErr($inp, $msg, txt) {
    $inp.addClass('input-error');
    $msg.text(txt).addClass('show');
  }

  /* ============================================================
     FORM SUBMIT
  ============================================================ */
  $('#btn-submit').on('click', function (e) {
    e.preventDefault();
    var ok = true;

    var name    = $('#inp-name').val().trim();
    var account = $('#inp-account').val().trim();
    var date    = $('#inp-date').val().trim();
    var mobile  = $('#inp-mobile').val().trim();

    if (!validName(name)) {
      markErr($('#inp-name'), $('#err-name'),
        'يجب أن يكون الاسم بالإنكليزية: اسم + مسافة + كنية (حروف فقط)');
      ok = false;
    } else { markOk($('#inp-name'), $('#err-name')); }

    if (!validAccount(account)) {
      markErr($('#inp-account'), $('#err-account'),
        'رقم الحساب المصرفي مطلوب ويجب أن يكون 6 أرقام بالضبط (مثال: 055555)');
      ok = false;
    } else { markOk($('#inp-account'), $('#err-account')); }

    if (!validDate(date)) {
      markErr($('#inp-date'), $('#err-date'),
        'يرجى إدخال تاريخ صحيح بالصيغة yyyy-mm-dd (مثال: 2026-05-10)');
      ok = false;
    } else { markOk($('#inp-date'), $('#err-date')); }

    if (!validMobile(mobile)) {
      markErr($('#inp-mobile'), $('#err-mobile'),
        'يجب أن يطابق رقم شبكة Syriatel أو MTN (مثال: 0991234567)');
      ok = false;
    } else { markOk($('#inp-mobile'), $('#err-mobile')); }

    if (!ok) return;

    /* ── build order summary ── */
    var items = [], total = 0;

    $('.meal-checkbox:checked').each(function () {
      var $tr   = $(this).closest('tr');
      var code  = $tr.find('.meal-code').text();
      var mname = $tr.find('.meal-name').text();
      var price = parseInt($tr.find('.meal-price-val').val(), 10);
      items.push({ code: code, name: mname, price: price });
      total += price;
    });

    var tax = Math.round(total * 0.10);
    var net = total - tax;

    var rows = '';
    $.each(items, function (i, m) {
      rows += '<tr><td>' + m.code + '</td><td>' + m.name +
              '</td><td>' + m.price.toLocaleString() + ' ل.س</td></tr>';
    });

    $('#sum-rows').html(rows);
    $('#sum-total').text(total.toLocaleString() + ' ل.س');
    $('#sum-tax').text(tax.toLocaleString()   + ' ل.س');
    $('#sum-net').text(net.toLocaleString()   + ' ل.س');

    $('#modal-overlay').addClass('show');
  });

  /* ── close modal ── */
  $('#modal-close, #modal-overlay').on('click', function (e) {
    if (e.target === this || $(e.target).is('#modal-close'))
      $('#modal-overlay').removeClass('show');
  });

});
