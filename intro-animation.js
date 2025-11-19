/**
 * Intro Section Overlap Animation using GSAP ScrollTrigger
 * intro-sectionに重なりアニメーション効果を追加
 */

// GSAPプラグインを登録
gsap.registerPlugin(ScrollTrigger);

// ページ読み込み完了後に初期化
window.addEventListener('load', function() {
    console.log('Initializing intro section overlap animation...');

    // すべてのintro-sectionを取得（最後のセクションは除く）
    const introSections = document.querySelectorAll('.intro-section');

    // 最後のセクション以外にpin効果を適用
    introSections.forEach((section, index) => {
        // 最後のセクションは固定しない
        if (index === introSections.length - 1) {
            return;
        }

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
                console.log(`Intro section ${index + 1} pinned`);
            },
            onLeave: () => {
                console.log(`Intro section ${index + 1} unpinned`);
            }
        });
    });

    console.log(`Applied pin effect to ${introSections.length - 1} intro sections`);
});
