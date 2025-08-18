// 画像の遅延読み込み実装
// Intersection Observer APIを使用して、画像が画面に表示される直前に読み込みを開始

class LazyImageLoader {
    constructor() {
        this.imageObserver = null;
        this.init();
    }

    init() {
        // Intersection Observerの設定
        const options = {
            root: null, // ビューポートをルートとする
            rootMargin: '50px', // 画像が表示される50px前から読み込み開始
            threshold: 0.01 // 1%でも見えたらトリガー
        };

        this.imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);
    }

    loadImage(img) {
        // data-srcから実際のsrcに画像URLを設定
        const src = img.getAttribute('data-src');
        if (!src) return;

        // 画像の読み込み
        const tempImg = new Image();
        tempImg.onload = () => {
            img.src = src;
            img.classList.add('lazy-loaded');
            img.removeAttribute('data-src');
            
            // フェードインアニメーション
            requestAnimationFrame(() => {
                img.classList.add('lazy-fade-in');
            });
        };
        
        tempImg.onerror = () => {
            console.error('画像の読み込みに失敗しました:', src);
            // デフォルト画像を設定
            img.src = './icons/default-avatar.svg';
            img.classList.add('lazy-error');
        };
        
        tempImg.src = src;
    }

    observe(img) {
        if (this.imageObserver && img) {
            this.imageObserver.observe(img);
        }
    }

    observeAll(selector = 'img[data-src]') {
        const images = document.querySelectorAll(selector);
        images.forEach(img => this.observe(img));
    }

    disconnect() {
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
    }
}

// CSSクラスの追加
const lazyLoadStyles = `
    <style>
        img[data-src] {
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }
        
        img.lazy-loaded {
            opacity: 1;
        }
        
        img.lazy-fade-in {
            animation: lazyFadeIn 0.3s ease-in-out;
        }
        
        @keyframes lazyFadeIn {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        /* プレースホルダー画像のスタイル */
        .lazy-placeholder {
            background: var(--md-sys-color-surface-variant);
            background-image: linear-gradient(
                90deg,
                var(--md-sys-color-surface-variant) 0%,
                var(--md-sys-color-surface) 50%,
                var(--md-sys-color-surface-variant) 100%
            );
            background-size: 200% 100%;
            animation: lazyShimmer 1.5s infinite;
        }
        
        @keyframes lazyShimmer {
            0% {
                background-position: -100% 0;
            }
            100% {
                background-position: 100% 0;
            }
        }
    </style>
`;

// スタイルを追加
if (!document.getElementById('lazy-load-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'lazy-load-styles';
    styleElement.innerHTML = lazyLoadStyles;
    document.head.appendChild(styleElement.firstElementChild);
}

// グローバルインスタンスの作成
const lazyImageLoader = new LazyImageLoader();

// エクスポート
window.lazyImageLoader = lazyImageLoader;