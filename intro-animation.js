/**
 * Intro Section Overlap Animation using GSAP ScrollTrigger
 * intro-sectionに重なりアニメーション効果を追加
 */

console.log('🟢 [intro-animation.js] File loaded');
console.log('🟢 [intro-animation.js] User Agent:', navigator.userAgent);
console.log('🟢 [intro-animation.js] Screen size:', window.innerWidth + 'x' + window.innerHeight);

// ライブラリの読み込み確認
console.log('🟢 [intro-animation.js] gsap available:', typeof gsap !== 'undefined');
if (typeof gsap !== 'undefined') {
    console.log('🟢 [intro-animation.js] GSAP version:', gsap.version);
}
console.log('🟢 [intro-animation.js] ScrollTrigger available:', typeof ScrollTrigger !== 'undefined');

// GSAPプラグインを登録
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    console.log('✅ [intro-animation.js] ScrollTrigger plugin registered');
} else {
    console.error('❌ [intro-animation.js] Cannot register ScrollTrigger - gsap or ScrollTrigger not available');
}

// ページ読み込み完了後に初期化
console.log('🟢 [intro-animation.js] Registering window.load listener...');

window.addEventListener('load', function() {
    console.log('🎉 [intro-animation.js] window.load event fired!');
    console.log('🟢 [intro-animation.js] Starting initialization...');

    // すべてのintro-sectionを取得（最後のセクションは除く）
    const introSections = document.querySelectorAll('.intro-section');
    console.log('🟢 [intro-animation.js] Found intro sections:', introSections.length);

    // 最後のセクション以外にpin効果を適用
    introSections.forEach((section, index) => {
        // 最後のセクションは固定しない
        if (index === introSections.length - 1) {
            console.log('🟢 [intro-animation.js] Skipping last section (index:', index, ')');
            return;
        }

        console.log('🟢 [intro-animation.js] Creating ScrollTrigger for section', index + 1);

        try {
            ScrollTrigger.create({
                trigger: section,
                start: 'top top',
                end: 'bottom top',
                pin: true,
                pinSpacing: false,
                markers: false, // デバッグ用（本番ではfalse）
                id: `intro-pin-${index + 1}`,
                // Scrollifyとの競合を避けるための設定
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onEnter: () => {
                    console.log(`🟢 [intro-animation.js] Section ${index + 1} pinned`);
                },
                onLeave: () => {
                    console.log(`🟢 [intro-animation.js] Section ${index + 1} unpinned`);
                }
            });
            console.log('✅ [intro-animation.js] ScrollTrigger created for section', index + 1);
        } catch (error) {
            console.error('❌ [intro-animation.js] Error creating ScrollTrigger for section', index + 1, ':', error);
        }
    });

    console.log(`✅ [intro-animation.js] Applied pin effect to ${introSections.length - 1} intro sections`);
    console.log('✅ [intro-animation.js] Initialization completed');
});

// タイムアウト検出用
setTimeout(function() {
    console.warn('⚠️ [intro-animation.js] 10 seconds passed, checking if load event fired...');
}, 10000);
