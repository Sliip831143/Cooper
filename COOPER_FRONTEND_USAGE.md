# COOPER_FRONTEND_USAGE.md

## Cooper PWA フロントエンドUI/UX改善実装ガイド

### 概要
このドキュメントは、COOPER_FRONTEND_AGENT.mdで提案された改善項目の具体的な実装方法を記載しています。

## 即座に実装可能な改善

### 1. タッチターゲットサイズの修正

#### 実装コード
```css
/* すべてのインタラクティブ要素に適用 */
button,
a,
input[type="checkbox"],
input[type="radio"],
.clickable {
    min-width: 44px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

/* 小さなアイコンボタンの調整 */
.btn-icon {
    width: 44px;
    height: 44px;
    padding: 10px;
    cursor: pointer;
    touch-action: manipulation; /* ダブルタップズーム防止 */
}

/* SNSボタンの改善 */
.sns-btn {
    min-width: 44px;
    min-height: 44px;
    margin: 4px;
    padding: 10px;
}
```

### 2. ARIAラベルの実装

#### フォーム要素の改善
```html
<!-- Before -->
<input type="text" id="name" placeholder="山田太郎">

<!-- After -->
<label for="name" class="form-label">名前</label>
<input 
    type="text" 
    id="name" 
    placeholder="山田太郎"
    aria-label="名前"
    aria-required="true"
    aria-describedby="name-help">
<span id="name-help" class="sr-only">フルネームを入力してください</span>
```

#### アイコンボタンの改善
```html
<!-- Before -->
<button class="btn-icon" onclick="handleSignIn()">
    <svg><!-- icon --></svg>
</button>

<!-- After -->
<button 
    class="btn-icon" 
    onclick="handleSignIn()"
    aria-label="Googleアカウントでサインイン"
    title="Googleアカウントでサインイン">
    <svg aria-hidden="true"><!-- icon --></svg>
</button>
```

### 3. フォーカスインジケーターの強化

```css
/* 見やすいフォーカススタイル */
:focus-visible {
    outline: 3px solid var(--md-sys-color-primary);
    outline-offset: 2px;
    border-radius: var(--md-sys-shape-corner-small);
    transition: outline-offset 0.1s ease;
}

/* ダークモード対応 */
[data-theme="dark"] :focus-visible {
    outline-color: var(--md-sys-color-primary);
    box-shadow: 0 0 0 4px rgba(141, 185, 243, 0.3);
}

/* フォーカストラップの実装 */
.modal:focus-visible,
.menu:focus-visible {
    outline: none;
}
```

### 4. スキップナビゲーションの追加

```html
<!-- index.htmlの最初に追加 -->
<a href="#main-content" class="skip-link">
    メインコンテンツへスキップ
</a>

<style>
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    padding: 8px 16px;
    text-decoration: none;
    border-radius: var(--md-sys-shape-corner-small);
    z-index: 10000;
    transition: top 0.3s ease;
}

.skip-link:focus {
    top: 8px;
    left: 8px;
}
</style>
```

## モダンUI実装

### 1. スケルトンローダーの実装

```javascript
// skeleton-loader.js
class SkeletonLoader {
    constructor() {
        this.template = `
            <div class="skeleton-container" role="status" aria-label="読み込み中">
                <div class="skeleton-item">
                    <div class="skeleton-avatar"></div>
                    <div class="skeleton-content">
                        <div class="skeleton-line skeleton-line-short"></div>
                        <div class="skeleton-line"></div>
                    </div>
                </div>
            </div>
        `;
    }

    show(container) {
        container.innerHTML = this.template.repeat(5);
        container.classList.add('loading');
    }

    hide(container) {
        container.classList.remove('loading');
    }
}

// 使用例
const loader = new SkeletonLoader();
const listContainer = document.getElementById('contactsList');

// データ読み込み前
loader.show(listContainer);

// データ読み込み後
getAllContactsSecure(userId).then(contacts => {
    loader.hide(listContainer);
    displayContacts(contacts);
});
```

### 2. リップルエフェクトの実装

```javascript
// ripple-effect.js
class RippleEffect {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.btn, .btn-icon');
            if (button) {
                this.createRipple(e, button);
            }
        });
    }

    createRipple(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }
}

// CSS
const rippleStyles = `
.btn, .btn-icon {
    position: relative;
    overflow: hidden;
}

.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;
```

### 3. グラスモーフィズムの適用

```css
/* メニューやモーダルに適用 */
.glass-morphism {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] .glass-morphism {
    background: rgba(28, 27, 31, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 適用例 */
.profile-menu,
.settings-menu,
.modal-content {
    @extend .glass-morphism;
    animation: fadeIn 0.3s ease;
}
```

## レスポンシブデザインの実装

### 1. モバイルファーストのグリッドシステム

```css
/* ベースグリッド（モバイル） */
.container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
}

/* タブレット（768px以上） */
@media (min-width: 768px) {
    .container {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        padding: 24px;
    }
}

/* デスクトップ（1024px以上） */
@media (min-width: 1024px) {
    .container {
        grid-template-columns: 360px 1fr;
        max-width: 1200px;
        margin: 0 auto;
    }
}
```

### 2. スワイプジェスチャーの実装

```javascript
// swipe-handler.js
class SwipeHandler {
    constructor(element, callbacks) {
        this.element = element;
        this.callbacks = callbacks;
        this.threshold = 50;
        this.restraint = 100;
        this.init();
    }

    init() {
        let startX, startY, distX, distY;

        this.element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
        }, { passive: true });

        this.element.addEventListener('touchmove', (e) => {
            distX = e.touches[0].pageX - startX;
            distY = e.touches[0].pageY - startY;
        }, { passive: true });

        this.element.addEventListener('touchend', () => {
            if (Math.abs(distX) >= this.threshold && Math.abs(distY) <= this.restraint) {
                if (distX > 0 && this.callbacks.onSwipeRight) {
                    this.callbacks.onSwipeRight();
                } else if (distX < 0 && this.callbacks.onSwipeLeft) {
                    this.callbacks.onSwipeLeft();
                }
            }
        }, { passive: true });
    }
}

// 使用例
const sidebar = document.querySelector('.sidebar');
new SwipeHandler(document.body, {
    onSwipeRight: () => {
        sidebar.classList.add('open');
    },
    onSwipeLeft: () => {
        sidebar.classList.remove('open');
    }
});
```

## パフォーマンス最適化

### 1. 画像の遅延読み込み

```javascript
// lazy-loading.js
class LazyImageLoader {
    constructor() {
        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                }
            });
        });
    }

    observe() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    loadImage(img) {
        img.src = img.dataset.src;
        img.onload = () => {
            img.classList.add('loaded');
            delete img.dataset.src;
        };
        this.imageObserver.unobserve(img);
    }
}

// 使用例
const lazyLoader = new LazyImageLoader();
lazyLoader.observe();
```

### 2. デバウンス処理

```javascript
// debounce.js
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 使用例
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', debounce((e) => {
    performSearch(e.target.value);
}, 300));
```

## テスト方法

### アクセシビリティテスト
```bash
# Lighthouse実行
npm install -g lighthouse
lighthouse https://coop-keeper.web.app --view

# axe-coreでのテスト
npm install axe-core
# ブラウザコンソールで実行
axe.run().then(results => console.log(results));
```

### スクリーンリーダーテスト
1. Windows: NVDA（無料）またはJAWS
2. macOS: VoiceOver（Command + F5）
3. iOS: VoiceOver（設定 > アクセシビリティ）
4. Android: TalkBack

### クロスブラウザテスト
1. デスクトップ: Chrome, Firefox, Edge, Safari
2. モバイル: iOS Safari, Chrome for Android
3. タブレット: iPadOS Safari, Android Chrome

## トラブルシューティング

### よくある問題と解決策

1. **タッチイベントが効かない**
   ```javascript
   // passive: trueを追加してパフォーマンス向上
   element.addEventListener('touchstart', handler, { passive: true });
   ```

2. **フォーカスが見えない**
   ```css
   /* :focusではなく:focus-visibleを使用 */
   button:focus-visible { outline: 3px solid blue; }
   ```

3. **モバイルでのズーム問題**
   ```css
   /* フォントサイズを16px以上に */
   input, select, textarea { font-size: 16px; }
   ```

---

最終更新: 2025年8月12日
作成者: Cooper Frontend UI/UX Implementation Guide