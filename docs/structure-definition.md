# HTML/CSS構造の定義

このドキュメントでは、プロジェクト内で使用される用語と構造を明確に定義します。

## 用語の定義

### 1. セクション (Section)
**HTML要素:** `<section class="parallax-section">`

**定義:**
- 新規事業プロセスの各フェーズを表す大きなまとまり
- 4つ存在: Creation, Verification, Action, Enlargement
- セクション番号: 01, 02, 03, 04

**バリアント:**
- `.parallax-section--light`: 白背景セクション（01, 03）
- `.parallax-section--dark`: 青背景セクション（02, 04）

**構造:**
```html
<section class="parallax-section parallax-section--light">
  <div class="parallax-container">
    <!-- 複数のparallax-item -->
  </div>
  <!-- ::after疑似要素で余白 -->
</section>
```

---

### 2. コンテナ (Container)
**HTML要素:** `<div class="parallax-container">`

**定義:**
- セクション内のコンテンツをラップする容器
- 最大幅を制限し、中央揃えにする役割
- `max-width: 1120px`, `margin: 0 auto`

---

### 3. アイテム (Item)
**HTML要素:** `<div class="parallax-item">`

**定義:**
- ヘッダーとカードをセットにしたまとまり
- `position: sticky`で画面上部に固定される
- 1セクションに通常4つのアイテムが存在

**特徴:**
- 最初のアイテムにはヘッダー（セクションタイトル）が含まれる
- 2つ目以降のアイテムには`padding-top: 300px`が適用される

**構造:**
```html
<div class="parallax-item">
  <header class="parallax-section__header">...</header> <!-- 1つ目のみ -->
  <article class="parallax-card">...</article>
</div>
```

---

### 4. ヘッダー (Header)
**HTML要素:** `<header class="parallax-section__header">`

**定義:**
- 各セクションの最初のアイテムに含まれる
- セクション番号、セクション名、タイトル、説明文を表示
- `position: sticky`のアイテム内に配置されるため、カードと一緒に固定される

**含まれる要素:**
- `.parallax-section__number`: セクション番号（例: "01."）
- `.parallax-section__name`: セクション名（例: "creation"）
- `.parallax-section__title`: タイトル（例: "新規事業の創造"）
- `.parallax-section__description`: 説明文

**構造:**
```html
<header class="parallax-section__header">
  <div class="parallax-section__label">
    <span class="parallax-section__number">01.</span>
    <h3 class="parallax-section__name">creation</h3>
  </div>
  <div class="parallax-section__title-wrapper">
    <h4 class="parallax-section__title">新規事業の創造</h4>
    <p class="parallax-section__description">説明文...</p>
  </div>
</header>
```

---

### 5. カード (Card)
**HTML要素:** `<article class="parallax-card">`

**定義:**
- 個別のステップや内容を表示する最小単位
- 1セクションに4枚のカードが存在
- アイコン画像と説明文を含む

**構造:**
```html
<article class="parallax-card">
  <figure class="parallax-card__icon">
    <img src="./assets/creation-01.gif" alt="...">
  </figure>
  <div class="parallax-card__content">
    <h4 class="parallax-card__title">課題発見</h4>
    <p class="parallax-card__text">市場を徹底的に調べる</p>
    <!-- 複数のpタグ -->
  </div>
</article>
```

**含まれる要素:**
- `.parallax-card__icon`: GIFアイコン画像
- `.parallax-card__content`: テキストコンテンツ
- `.parallax-card__title`: カードタイトル
- `.parallax-card__text`: 説明文（複数行）

---

## 階層構造の全体像

```
セクション (Section)
  └─ コンテナ (Container)
      └─ アイテム (Item) × 4
          ├─ ヘッダー (Header) ※1つ目のみ
          └─ カード (Card)
  └─ ::after疑似要素（余白）
```

---

## 具体例：Section 01 (Creation)

```
parallax-section (Section 01)
  ├─ parallax-container
  │   ├─ parallax-item 1
  │   │   ├─ parallax-section__header (ヘッダー: "01. creation 新規事業の創造")
  │   │   └─ parallax-card (カード1: 課題発見)
  │   │
  │   ├─ parallax-item 2
  │   │   └─ parallax-card (カード2: トレンド分析)
  │   │
  │   ├─ parallax-item 3
  │   │   └─ parallax-card (カード3: アイデア創出)
  │   │
  │   └─ parallax-item 4
  │       └─ parallax-card (カード4: 仮説設定)
  │
  └─ ::after (セクション間の余白 ~100vh)
```

---

## スクロールとSticky固定の仕組み

### Stickyが適用される単位
**`parallax-item`に`position: sticky`が適用**

```css
.parallax-section .parallax-item {
    position: sticky;
    top: 0;
}
```

- アイテム（ヘッダー+カード）が1つの単位として固定される
- スクロールすると次のアイテムが下から上がってきて、前のアイテムを押し出す

### カード間の余白
**`padding-top: 300px`で次のカードを押し下げ**

```css
.parallax-section .parallax-item:not(:first-child) {
    padding-top: var(--item-spacing);  /* 300px */
}
```

- 2つ目以降のアイテムに適用
- 次のカードを画面外で待機させる

### セクション間の余白
**`::after`疑似要素で次のセクションを押し下げ**

```css
.parallax-section--light::after {
    content: '';
    display: block;
    height: var(--light-section-bottom-gap);  /* ~100vh */
    background: var(--section-background);
}
```

- セクションの末尾に追加
- 次のセクション全体を画面外に押し下げて待機させる

---

## Scrollifyのターゲット

**現在の設定:**
```javascript
$.scrollify({
  section: ".parallax-card",  // カード単位でスクロール
  scrollSpeed: 800,
  setHeights: false  // 既存の高さを維持
});
```

- Scrollifyは`.parallax-card`（カード）をターゲットにしている
- 1スクロールで1カードずつ進む
- CSSのstickyとScrollifyが組み合わさって、スナップスクロール効果を実現

---

## 数値のまとめ

| 要素 | 数 |
|-----|---|
| セクション | 4個 (01～04) |
| 1セクション内のアイテム | 4個 |
| 1セクション内のカード | 4枚 |
| 全体のカード総数 | 16枚 (4セクション × 4カード) |
| カード間の余白 | 300px (`padding-top`) |
| セクション間の余白 | ~100vh (`::after`) |

---

## 視覚的な図解

```
┌─────────────────────────────────────┐
│  ビューポート (画面)                    │
├─────────────────────────────────────┤ ← top: 0
│                                     │
│  [parallax-item 1] ← sticky固定      │
│  ┌─────────────────────────────┐   │
│  │ Header: 01. Creation        │   │
│  │ Card 1: 課題発見             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ↓ padding-top: 300px               │
│                                     │
│  [parallax-item 2]                  │
│  ┌─────────────────────────────┐   │
│  │ Card 2: トレンド分析          │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
      ↓ 画面外で待機

  [parallax-item 3]
  Card 3: アイデア創出

  [parallax-item 4]
  Card 4: 仮説設定

  ↓ ::after余白 (~100vh)

  ─────────────────────────
  [Section 02] 全体が待機中
  ─────────────────────────
  [parallax-item 1]
  Header: 02. Verification
  Card 1: 市場調査

  ...
```

---

## まとめ

- **セクション**: 4つのフェーズ（01～04）
- **アイテム**: ヘッダー+カードのセット（sticky固定される単位）
- **カード**: 個別のコンテンツ（Scrollifyのターゲット）
- **`padding-top: 300px`**: カード間の余白
- **`::after`**: セクション間の余白（~100vh）

この定義に基づいて、今後の議論を進めます。
