// WebP形式対応
// WebP形式をサポートするブラウザでは、自動的にWebP画像を使用

class WebPSupport {
    constructor() {
        this.isSupported = null;
        this.supportPromise = this.checkSupport();
    }

    // WebPサポートをチェック
    async checkSupport() {
        if (this.isSupported !== null) {
            return this.isSupported;
        }

        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                this.isSupported = webP.height === 2;
                resolve(this.isSupported);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    // 画像URLをWebP形式に変換
    convertToWebP(url) {
        if (!url || typeof url !== 'string') return url;
        
        // すでにWebP形式の場合はそのまま返す
        if (url.endsWith('.webp')) return url;
        
        // データURLの場合はそのまま返す
        if (url.startsWith('data:')) return url;
        
        // Firebase StorageのURLの場合
        if (url.includes('firebasestorage.googleapis.com')) {
            // クエリパラメータを追加してWebP形式を要求
            const separator = url.includes('?') ? '&' : '?';
            return `${url}${separator}alt=media&format=webp`;
        }
        
        // その他のURLの場合は拡張子を.webpに変更
        return url.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
    }

    // picture要素を生成（フォールバック付き）
    createPictureElement(src, alt = '', className = '', lazyLoad = true) {
        const picture = document.createElement('picture');
        
        // WebPソース
        const webpSource = document.createElement('source');
        webpSource.type = 'image/webp';
        webpSource.srcset = this.convertToWebP(src);
        if (lazyLoad) {
            webpSource.setAttribute('data-srcset', this.convertToWebP(src));
        }
        
        // オリジナル形式のソース（フォールバック）
        const originalSource = document.createElement('source');
        const extension = src.match(/\.(jpg|jpeg|png|gif)$/i);
        if (extension) {
            const format = extension[1].toLowerCase();
            const mimeType = format === 'jpg' ? 'jpeg' : format;
            originalSource.type = `image/${mimeType}`;
            originalSource.srcset = src;
            if (lazyLoad) {
                originalSource.setAttribute('data-srcset', src);
            }
        }
        
        // img要素（フォールバック）
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        if (className) img.className = className;
        
        // 遅延読み込み対応（lazyLoadがtrueの場合のみ）
        if (lazyLoad) {
            img.setAttribute('data-src', src);
            img.loading = 'lazy';
        }
        
        // picture要素に追加
        picture.appendChild(webpSource);
        if (extension) picture.appendChild(originalSource);
        picture.appendChild(img);
        
        return picture;
    }

    // 既存のimg要素をpicture要素に置き換え
    async replaceImageWithPicture(img) {
        const isWebPSupported = await this.supportPromise;
        
        // WebPがサポートされていない場合は何もしない
        if (!isWebPSupported) return img;
        
        const src = img.src || img.getAttribute('data-src');
        if (!src) return img;
        
        // picture要素を作成
        const picture = this.createPictureElement(
            src,
            img.alt,
            img.className
        );
        
        // その他の属性をコピー
        Array.from(img.attributes).forEach(attr => {
            if (!['src', 'alt', 'class', 'data-src'].includes(attr.name)) {
                picture.querySelector('img').setAttribute(attr.name, attr.value);
            }
        });
        
        // DOM内で置き換え
        if (img.parentNode) {
            img.parentNode.replaceChild(picture, img);
        }
        
        return picture;
    }

    // 画像アップロード時の変換処理
    async convertImageToWebP(file, quality = 0.85) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const img = new Image();
                
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    
                    // WebP形式に変換
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error('WebP変換に失敗しました'));
                            }
                        },
                        'image/webp',
                        quality
                    );
                };
                
                img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
                img.src = e.target.result;
            };
            
            reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
            reader.readAsDataURL(file);
        });
    }

    // サイズ最適化付きのWebP変換
    async optimizeAndConvertToWebP(file, maxWidth = 1200, maxHeight = 1200, quality = 0.85) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const img = new Image();
                
                img.onload = () => {
                    // アスペクト比を維持しながらリサイズ
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > maxWidth || height > maxHeight) {
                        const aspectRatio = width / height;
                        
                        if (width > height) {
                            width = maxWidth;
                            height = width / aspectRatio;
                        } else {
                            height = maxHeight;
                            width = height * aspectRatio;
                        }
                    }
                    
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // WebP形式に変換
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                resolve({
                                    blob,
                                    width,
                                    height,
                                    originalWidth: img.width,
                                    originalHeight: img.height,
                                    sizeReduction: ((file.size - blob.size) / file.size * 100).toFixed(1)
                                });
                            } else {
                                reject(new Error('WebP変換に失敗しました'));
                            }
                        },
                        'image/webp',
                        quality
                    );
                };
                
                img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
                img.src = e.target.result;
            };
            
            reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
            reader.readAsDataURL(file);
        });
    }
}

// グローバルインスタンスの作成
const webPSupport = new WebPSupport();

// エクスポート
window.webPSupport = webPSupport;