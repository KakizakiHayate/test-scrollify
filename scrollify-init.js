$(function() {
  // jQueryとScrollifyの読み込み確認
  console.log('jQuery version:', $.fn.jquery);
  console.log('Scrollify loaded:', typeof $.scrollify);

  if (typeof $.scrollify !== 'function') {
    console.error('Scrollify is not loaded properly!');
    return;
  }

  // デバイスの種類を判定
  var isMobile = $(window).width() <= 750;

  // Scrollifyを初期化（全デバイスで有効）
  $.scrollify({
    section: ".parallax-card",
    scrollSpeed: isMobile ? 600 : 800,
    scrollbars: true,
    setHeights: false,  // 重要: 既存の高さを維持
    updateHash: false,
    touchScroll: true,
    easing: "easeOutExpo",
    offset: 0,
    before: function(index, sections) {
      // スクロール前の処理（必要に応じて追加）
    },
    after: function(index, sections) {
      // スクロール後の処理（必要に応じて追加）
    },
    afterResize: function() {
      // リサイズ後の処理（必要に応じて追加）
    },
    afterRender: function() {
      // レンダリング後の処理（必要に応じて追加）
    }
  });

  // リサイズ時の処理
  var resizeTimer;
  $(window).on('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Scrollifyを再初期化
      $.scrollify.destroy();

      var isMobile = $(window).width() <= 750;
      $.scrollify({
        section: ".parallax-card",
        scrollSpeed: isMobile ? 600 : 800,
        scrollbars: true,
        setHeights: false,
        updateHash: false,
        touchScroll: true,
        easing: "easeOutExpo",
        offset: 0
      });
    }, 250); // デバウンス処理（250ms）
  });
});
