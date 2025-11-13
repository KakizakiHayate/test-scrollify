# Scrollify 実装計画

## 概要

このドキュメントでは、parallax-cardセクションにScrollifyライブラリを統合し、1スクロールで1カードずつ進む動作を実装する計画をまとめます。

## 現状分析

### 現在の構造

- **セクション数**: 4つ（Creation, Verification, Action, Enlargement）
- **カード総数**: 16枚（各セクション4枚ずつ）
- **現在の動作**: 通常のスクロール（連続スクロール）
- **使用している要素**: `.parallax-card`

### 各セクションのカード

1. **01. Creation** (parallax-section--light)
   - 課題発見
   - トレンド分析
   - アイデア創出
   - 仮説設定

2. **02. Verification** (parallax-section--dark)
   - 市場調査
   - 顧客インタビュー
   - MVP開発
   - 仮説検証

3. **03. Action** (parallax-section--light)
   - ビジネスモデル設計
   - PoC
   - 改善とピボット
   - 資金・人材確保

4. **04. Enlargement** (parallax-section--dark)
   - 本格ローンチ
   - KPI設計と管理
   - 組織化
   - 持続的改善

## Scrollify とは

Scrollifyは、ページを複数のセクションに分割し、マウスホイールやタッチスワイプで1セクションずつスムーズにスクロールさせるjQueryプラグインです。

### 主な機能

- スナップスクロール（指定要素に吸着）
- スムーズなアニメーション
- キーボード対応（矢印キー、PgUp/PgDn）
- マウスホイール対応
- タッチデバイス対応
- レスポンシブ対応

## 実装計画

### 1. 準備フェーズ

#### 1.1 ライブラリの導入

**必要なライブラリ:**
- jQuery（Scrollifyの依存関係）
- Scrollify本体

**導入方法（CDN）:**
```html
<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<!-- Scrollify -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollify/1.0.21/jquery.scrollify.min.js"></script>
```

**導入場所:** `index.html` の `</body>` タグの直前

#### 1.2 HTML構造の確認

**現在の構造:**
```html
<section class="parallax-section">
  <div class="parallax-container">
    <div class="parallax-item">
      <header class="parallax-section__header">...</header>
      <article class="parallax-card">...</article>
    </div>
  </div>
</section>
```

**変更の必要性:** なし（`.parallax-card`をScrollifyのターゲットとして使用可能）

### 2. Scrollify初期化

#### 2.1 基本的な設定

**JavaScriptファイル:** `scrollify-init.js`を新規作成

```javascript
$(function() {
  $.scrollify({
    section: ".parallax-card",
    scrollSpeed: 800,
    scrollbars: true,
    standardScrollElements: "",
    setHeights: false,
    updateHash: false,
    touchScroll: true,
    before: function(index, sections) {
      // スクロール前の処理
    },
    after: function(index, sections) {
      // スクロール後の処理
    },
    afterResize: function() {
      // リサイズ後の処理
    },
    afterRender: function() {
      // レンダリング後の処理
    }
  });
});
```

#### 2.2 設定パラメータの詳細

| パラメータ | 値 | 説明 |
|----------|-----|------|
| `section` | `".parallax-card"` | スクロール対象の要素 |
| `scrollSpeed` | `800` | スクロール速度（ミリ秒） |
| `scrollbars` | `true` | スクロールバーを表示 |
| `setHeights` | `false` | 高さを自動設定しない |
| `updateHash` | `false` | URLハッシュを更新しない |
| `touchScroll` | `true` | タッチスクロール有効 |

### 3. レスポンシブ対応

#### 3.1 全デバイスでScrollifyを有効化

PC、タブレット、モバイル全てのデバイスでScrollifyを有効にします。
デバイスごとにスクロール速度やオプションを最適化します。

```javascript
$(function() {
  // デバイスの種類を判定
  var isMobile = $(window).width() <= 768;

  // Scrollifyを初期化（全デバイスで有効）
  $.scrollify({
    section: ".parallax-card",
    scrollSpeed: isMobile ? 600 : 800, // モバイルは少し速く
    scrollbars: true,
    setHeights: false,
    updateHash: false,
    touchScroll: true,
    easing: "easeOutExpo",
    offset: 0
  });

  // リサイズ時の処理
  var resizeTimer;
  $(window).on('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Scrollifyを再初期化
      $.scrollify.destroy();

      var isMobile = $(window).width() <= 768;
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
    }, 250); // デバウンス処理
  });
});
```

#### 3.2 モバイル固有の調整

モバイルデバイスでの最適化ポイント:
- スクロール速度を速めに設定（600ms）
- タッチスクロールを有効化
- オフセット調整でヘッダー等に対応

### 4. CSS調整

#### 4.1 既存デザインの維持

**重要:** カードの高さやレイアウトは一切変更しません。
既存のデザイン（PC/SP共に）を完全に維持したまま、Scrollifyのスクロール動作だけを適用します。

**style.cssへの追加: なし**

既存のCSSはそのまま維持:
- PC: 横並びレイアウト、既存の高さ
- SP: 縦並びレイアウト、左ボーダー、既存の高さ、画像44%

**Scrollifyの設定で対応:**
```javascript
$.scrollify({
  section: ".parallax-card",
  scrollSpeed: isMobile ? 600 : 800,
  scrollbars: true,
  setHeights: false,  // ← 重要: 高さを自動設定しない
  updateHash: false,
  touchScroll: true,
  easing: "easeOutExpo",
  offset: 0
});
```

`setHeights: false` により、Scrollifyはカードの既存の高さを尊重し、
スナップスクロールの動作だけを提供します。

#### 4.2 既存スタイルとの競合回避

**確認が必要な既存スタイル:**
- `.parallax-item` の `position: sticky` → Scrollifyと競合する可能性（要検証）
- `.parallax-section` の padding/margin → そのまま維持
- カードの高さ設定 → 変更なし（既存のまま）

**既存スタイルは全て維持:**
- PC: すべての既存スタイルをそのまま
- SP: すべての既存スタイルをそのまま
  - カードレイアウト: `flex-direction: column;`
  - ボーダー: `border-left: 2px solid;`
  - パディング: `padding: 0 0 0 20px;`
  - 画像サイズ: `width: 44%;`
  - テキスト順序: `order: 1;`（上部配置）
  - 画像順序: `order: 2;`（下部配置）

### 5. 実装手順

#### ステップ1: ライブラリの追加

1. `index.html` に jQuery と Scrollify の CDN を追加
2. `scrollify-init.js` ファイルを作成
3. `index.html` に `scrollify-init.js` をリンク

#### ステップ2: 初期設定

1. 基本的なScrollify設定を実装
2. ブラウザで動作確認（PC）
3. スクロール速度やアニメーションを調整

#### ステップ3: レスポンシブ対応

1. デバイス判定ロジックを追加（全デバイスで有効化）
2. デバイスごとのスクロール速度最適化
3. リサイズ時の処理を実装
4. モバイル・タブレット・PCで動作確認

#### ステップ4: CSS調整

1. CSSの変更は不要（既存デザインをそのまま維持）
2. 既存スタイルとの競合を確認
3. 特にSPの縦並びデザインが崩れていないか確認
4. PCの横並びデザインが崩れていないか確認

#### ステップ5: 最終調整

1. 全デバイスで動作確認
2. パフォーマンステスト
3. 必要に応じて最適化

### 6. 考慮事項

#### 6.1 パフォーマンス

- 16枚のカードがあるため、スクロール処理が重くなる可能性
- 必要に応じて、画像の遅延読み込みを検討
- アニメーションの最適化

#### 6.2 ユーザビリティ

- スクロールバーの表示/非表示
- キーボード操作の対応
- アクセシビリティへの配慮
- モバイルでのタッチ操作の快適性
- スワイプジェスチャーとの競合回避

#### 6.3 既存機能との互換性

- パララックス効果との共存
- 青背景セクションのアニメーション
- カードフェードインアニメーション

### 7. テスト計画

#### 7.1 機能テスト

- [ ] マウスホイールでのスクロール
- [ ] タッチスワイプでのスクロール
- [ ] キーボード操作（矢印キー）
- [ ] スクロールバーでの操作
- [ ] レスポンシブ動作（PC/タブレット/モバイル）

#### 7.2 ブラウザテスト

- [ ] Chrome（最新版）- PC/SP
- [ ] Firefox（最新版）- PC/SP
- [ ] Safari（最新版）- PC/SP
- [ ] Edge（最新版）- PC/SP
- [ ] モバイルブラウザ（iOS Safari, Android Chrome）
  - [ ] SPデザイン（縦並び）が維持されているか
  - [ ] Scrollifyが正常に動作するか

#### 7.3 パフォーマンステスト

- [ ] スクロールの滑らかさ
- [ ] メモリ使用量
- [ ] CPU使用率
- [ ] 初回ロード時間

### 8. 代替案・オプション

#### 8.1 Scrollify以外のライブラリ

- **fullPage.js**: より多機能だが重い
- **AOS (Animate On Scroll)**: 軽量だがスナップスクロールは別途実装が必要
- **Intersection Observer API**: ネイティブJavaScript（カスタム実装が必要）

#### 8.2 カスタム実装

Scrollifyを使わず、Intersection Observer APIとCSS Scroll Snapを組み合わせた実装も検討可能。

```css
.parallax-container {
  scroll-snap-type: y mandatory;
}

.parallax-card {
  scroll-snap-align: start;
}
```

### 9. スケジュール

| フェーズ | タスク | 所要時間 |
|---------|--------|---------|
| Phase 1 | ライブラリ導入・基本実装 | 1-2時間 |
| Phase 2 | レスポンシブ対応 | 1時間 |
| Phase 3 | CSS調整・デザイン調整 | 1-2時間 |
| Phase 4 | テスト・デバッグ | 2-3時間 |
| Phase 5 | 最適化・最終調整 | 1時間 |

**合計見積もり時間:** 6-9時間

### 10. 成果物

- `scrollify-init.js`: Scrollify初期化スクリプト
- `style.css`: Scrollify用のCSS調整を追加
- `index.html`: ライブラリのリンクを追加
- このドキュメントの更新（実装結果の記録）

## 次のステップ

1. この計画をレビュー
2. 承認後、Phase 1から実装開始
3. 各フェーズ完了後、動作確認とレビュー
4. 問題があれば計画を修正

## 参考リンク

- [Scrollify 公式GitHub](https://github.com/lukehaas/Scrollify)
- [Scrollify デモ](https://projects.lukehaas.me/scrollify/)
- [jQuery 公式サイト](https://jquery.com/)
- [CSS Scroll Snap MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scroll_Snap)
