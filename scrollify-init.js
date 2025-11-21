/**
 * Parallax Section Scroll Controller using jQuery Scrollify
 * スムーズなセクションスクロール制御とカードアニメーション
 */

console.log('🔵 [scrollify-init.js] File loaded');
console.log('🔵 [scrollify-init.js] User Agent:', navigator.userAgent);
console.log('🔵 [scrollify-init.js] Screen size:', window.innerWidth + 'x' + window.innerHeight);

// ライブラリの読み込み確認
console.log('🔵 [scrollify-init.js] jQuery available:', typeof jQuery !== 'undefined');
if (typeof jQuery !== 'undefined') {
    console.log('🔵 [scrollify-init.js] jQuery version:', jQuery.fn.jquery);
    console.log('🔵 [scrollify-init.js] $.scrollify available:', typeof $.scrollify !== 'undefined');
}

// C. ブラウザの自動スクロール復元を無効化（最優先で実行）
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
    console.log('✅ [scrollify-init.js] scrollRestoration set to manual');
}

// D. URLハッシュを削除（常に一番上から開始）
if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname + window.location.search);
    console.log('✅ [scrollify-init.js] URL hash removed');
}

console.log('🔵 [scrollify-init.js] Waiting for DOMContentLoaded...');

$(function() {
    console.log('✅ [scrollify-init.js] jQuery ready (DOMContentLoaded)');
    console.log('🔵 [scrollify-init.js] .js-section count:', $('..js-section').length);
    // B. スクロール位置をリセット（ブラウザの復元を防ぐ）
    window.scrollTo(0, 0);

    // E. intro-section と detail-section の高さを動的に設定（古いブラウザ対応）
    // dvhをサポートしていないブラウザのためのフォールバック
    const setDynamicHeights = () => {
        const viewportHeight = window.innerHeight;

        // intro-sectionの高さを設定
        $('.intro-section').each(function() {
            $(this).css('height', viewportHeight + 'px');
        });

        // detail-sectionの高さを設定
        $('.detail-section').css('height', (viewportHeight + 100) + 'px');
    };

    // 初期設定
    setDynamicHeights();
    console.log('✅ [scrollify-init.js] Dynamic heights set');

    // 画面回転・リサイズ時に再計算
    $(window).on('resize orientationchange', setDynamicHeights);
    console.log('✅ [scrollify-init.js] Resize/orientation listeners added');

    const $allSections = $('.js-section');

    // Scrollify の設定
    const scrollifyOptions = {
        section: '.js-section',
        easing: 'swing',
        scrollSpeed: 600,
        scrollbars: true,
        setHeights: false,
        interstitialSection: ['.normal-scroll'],
        before: function(index, sections) {
            setCurrent(index);

            // 現在のセクションを取得
            const currentSection = $(sections[index]);
            const sectionName = currentSection.attr('data-section-name');

            // セクション情報に基づいてヘッダーを制御
            updateHeaderVisibility(sectionName);

            // カードアニメーションをスケジュール
            setTimeout(() => {
                fadeInCard(currentSection);
            }, 300);
        },
        afterRender: function() {
            setCurrent();
        }
    };

    // A. 画像読み込み完了後にScrollifyを初期化
    console.log('🔵 [scrollify-init.js] Registering window.load listener...');

    $(window).on('load', function() {
        console.log('🎉 [scrollify-init.js] window.load event fired!');
        console.log('🔵 [scrollify-init.js] $.scrollify available:', typeof $.scrollify !== 'undefined');

        if (typeof $.scrollify === 'undefined') {
            console.error('❌ [scrollify-init.js] $.scrollify is NOT available');
            return;
        }

        console.log('🔵 [scrollify-init.js] Initializing Scrollify with options:', scrollifyOptions);
        $.scrollify(scrollifyOptions);
        console.log('✅ [scrollify-init.js] Scrollify initialized successfully');

        // 初期化後もう一度スクロール位置をリセット
        window.scrollTo(0, 0);
        console.log('✅ [scrollify-init.js] Scroll position reset');
    });

    // タイムアウト検出用
    setTimeout(function() {
        console.warn('⚠️ [scrollify-init.js] 10 seconds passed, checking if load event fired...');
    }, 10000);

    /**
     * 現在のセクションにクラスを設定
     */
    function setCurrent(index = 0) {
        $allSections.removeClass('is-show');
        $allSections.eq(index).addClass('is-show');
    }

    /**
     * ヘッダーの表示/非表示を制御
     */
    function updateHeaderVisibility(sectionName) {
        // セクションごとのヘッダーを取得（各セクション内の最初のヘッダー）
        const $creationHeader = $('[data-section-name^="card1-"] .parallax-section__header').first();
        const $verificationHeader = $('[data-section-name^="card2-"] .parallax-section__header').first();
        const $actionHeader = $('[data-section-name^="card3-"] .parallax-section__header').first();
        const $enlargementHeader = $('[data-section-name^="card4-"] .parallax-section__header').first();

        // creation フェーズのカード (card1-4)
        const creationCards = ['card1-1', 'card1-2', 'card1-3', 'card1-4'];

        // verification フェーズのカード (card2-1~4)
        const verificationCards = ['card2-1', 'card2-2', 'card2-3', 'card2-4'];

        // action フェーズのカード (card3-1~4)
        const actionCards = ['card3-1', 'card3-2', 'card3-3', 'card3-4'];

        // enlargement フェーズのカード (card4-1~4)
        const enlargementCards = ['card4-1', 'card4-2', 'card4-3', 'card4-4'];

        // if (creationCards.includes(sectionName)) {
        //     $creationHeader.fadeIn(300);
        //     $verificationHeader.fadeOut(300);
        //     $actionHeader.fadeOut(300);
        //     $enlargementHeader.fadeOut(300);
        // } else if (verificationCards.includes(sectionName)) {
        //     $creationHeader.fadeOut(300);
        //     $verificationHeader.fadeIn(300);
        //     $actionHeader.fadeOut(300);
        //     $enlargementHeader.fadeOut(300);
        // } else if (actionCards.includes(sectionName)) {
        //     $creationHeader.fadeOut(300);
        //     $verificationHeader.fadeOut(300);
        //     $actionHeader.fadeIn(300);
        //     $enlargementHeader.fadeOut(300);
        // } else if (enlargementCards.includes(sectionName)) {
        //     $creationHeader.fadeOut(300);
        //     $verificationHeader.fadeOut(300);
        //     $actionHeader.fadeOut(300);
        //     $enlargementHeader.fadeIn(300);
        // }
    }

    /**
     * カードをフェードイン表示
     */
    function fadeInCard($section) {
        const $card = $section.find('.parallax-card, .card-content');

        if ($card.length === 0) {
            return;
        }

        // クラスをリセット
        $card.removeClass('card-visible');

        // reflow を強制
        $card[0].offsetHeight;

        // アニメーション実行
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                $card.addClass('card-visible');
            });
        });
    }

    /**
     * 初期ヘッダー状態を設定
     */
    function initializeHeaders() {
        $('.creation-header').hide();
        $('.verification-header').hide();
        $('.action-header').hide();
        $('.enlargement-header').hide();
    }

    // 初期化
    initializeHeaders();
    console.log('✅ [scrollify-init.js] Headers initialized');
    console.log('✅ [scrollify-init.js] jQuery ready function completed');
});
