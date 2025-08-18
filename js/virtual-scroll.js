// 仮想スクロール実装
// 大量のリストアイテムを効率的に表示するための仮想スクロール

class VirtualScroller {
    constructor(options) {
        this.container = options.container; // スクロールコンテナ
        this.itemHeight = options.itemHeight || 150; // 各アイテムの高さ
        this.bufferSize = options.bufferSize || 5; // バッファサイズ
        this.renderItem = options.renderItem; // アイテムレンダリング関数
        this.items = [];
        this.scrollTop = 0;
        this.containerHeight = 0;
        this.totalHeight = 0;
        this.startIndex = 0;
        this.endIndex = 0;
        this.scrollHandler = null;
        this.resizeHandler = null;
        this.rafId = null;
        
        this.init();
    }

    init() {
        if (!this.container) return;
        
        // コンテナのスタイル設定
        this.container.style.position = 'relative';
        this.container.style.overflow = 'auto';
        
        // スペーサー要素の作成
        this.spacer = document.createElement('div');
        this.spacer.style.position = 'absolute';
        this.spacer.style.top = '0';
        this.spacer.style.left = '0';
        this.spacer.style.width = '100%';
        this.spacer.style.pointerEvents = 'none';
        this.container.appendChild(this.spacer);
        
        // コンテンツ要素の作成
        this.content = document.createElement('div');
        this.content.style.position = 'relative';
        this.content.className = 'virtual-scroll-content';
        this.container.appendChild(this.content);
        
        // イベントリスナーの設定
        this.scrollHandler = this.throttle(() => this.onScroll(), 16);
        this.resizeHandler = this.debounce(() => this.onResize(), 100);
        
        this.container.addEventListener('scroll', this.scrollHandler);
        window.addEventListener('resize', this.resizeHandler);
        
        // 初期サイズの計算
        this.updateContainerHeight();
    }

    setItems(items) {
        this.items = items;
        this.totalHeight = items.length * this.itemHeight;
        this.spacer.style.height = `${this.totalHeight}px`;
        this.render();
    }

    updateContainerHeight() {
        this.containerHeight = this.container.offsetHeight;
        this.render();
    }

    onScroll() {
        this.scrollTop = this.container.scrollTop;
        this.render();
    }

    onResize() {
        this.updateContainerHeight();
    }

    render() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        
        this.rafId = requestAnimationFrame(() => {
            const visibleItemCount = Math.ceil(this.containerHeight / this.itemHeight);
            this.startIndex = Math.max(0, Math.floor(this.scrollTop / this.itemHeight) - this.bufferSize);
            this.endIndex = Math.min(
                this.items.length,
                this.startIndex + visibleItemCount + (this.bufferSize * 2)
            );
            
            // コンテンツをクリア
            this.content.innerHTML = '';
            
            // 表示範囲のアイテムをレンダリング
            for (let i = this.startIndex; i < this.endIndex; i++) {
                const item = this.items[i];
                const element = this.renderItem(item, i);
                
                // 位置の設定
                element.style.position = 'absolute';
                element.style.top = `${i * this.itemHeight}px`;
                element.style.left = '0';
                element.style.right = '0';
                element.style.height = `${this.itemHeight}px`;
                
                this.content.appendChild(element);
                
                // 遅延読み込み対象の画像があれば監視
                const lazyImages = element.querySelectorAll('img[data-src]');
                if (window.lazyImageLoader && lazyImages.length > 0) {
                    lazyImages.forEach(img => window.lazyImageLoader.observe(img));
                }
            }
        });
    }

    scrollToIndex(index) {
        const scrollTop = index * this.itemHeight;
        this.container.scrollTop = scrollTop;
    }

    destroy() {
        if (this.container) {
            this.container.removeEventListener('scroll', this.scrollHandler);
        }
        window.removeEventListener('resize', this.resizeHandler);
        
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        
        if (this.spacer && this.spacer.parentNode) {
            this.spacer.parentNode.removeChild(this.spacer);
        }
        
        if (this.content && this.content.parentNode) {
            this.content.parentNode.removeChild(this.content);
        }
    }

    // ユーティリティ関数
    throttle(func, wait) {
        let timeout;
        let previous = 0;
        
        return function executedFunction(...args) {
            const now = Date.now();
            const remaining = wait - (now - previous);
            
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                func.apply(this, args);
            } else if (!timeout) {
                timeout = setTimeout(() => {
                    previous = Date.now();
                    timeout = null;
                    func.apply(this, args);
                }, remaining);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// CSSクラスの追加
const virtualScrollStyles = `
    <style>
        .virtual-scroll-container {
            position: relative;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        }
        
        .virtual-scroll-content {
            position: relative;
            transform: translateZ(0); /* ハードウェアアクセラレーション */
        }
        
        /* スムーズスクロールの無効化（パフォーマンス向上） */
        .virtual-scroll-container.scrolling {
            scroll-behavior: auto !important;
        }
        
        /* スクロールバーのスタイル */
        .virtual-scroll-container::-webkit-scrollbar {
            width: 8px;
        }
        
        .virtual-scroll-container::-webkit-scrollbar-track {
            background: var(--md-sys-color-surface-variant);
        }
        
        .virtual-scroll-container::-webkit-scrollbar-thumb {
            background: var(--md-sys-color-outline-variant);
            border-radius: 4px;
        }
        
        .virtual-scroll-container::-webkit-scrollbar-thumb:hover {
            background: var(--md-sys-color-outline);
        }
    </style>
`;

// スタイルを追加
if (!document.getElementById('virtual-scroll-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'virtual-scroll-styles';
    styleElement.innerHTML = virtualScrollStyles;
    document.head.appendChild(styleElement.firstElementChild);
}

// エクスポート
window.VirtualScroller = VirtualScroller;