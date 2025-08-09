// 画像圧縮ユーティリティ

// 画像を圧縮してFirestoreに保存可能なサイズにする
async function compressImage(imageDataUrl, maxSizeKB = 500) {
    // 初期品質設定
    let quality = 0.9;
    let compressedDataUrl = imageDataUrl;
    
    // 画像をリサイズ
    compressedDataUrl = await resizeImage(compressedDataUrl, 800, 800);
    
    // サイズをチェックして品質を調整
    while (getDataUrlSize(compressedDataUrl) > maxSizeKB * 1024 && quality > 0.1) {
        compressedDataUrl = await adjustImageQuality(compressedDataUrl, quality);
        quality -= 0.1;
    }
    
    // それでも大きすぎる場合は、さらに小さくリサイズ
    if (getDataUrlSize(compressedDataUrl) > maxSizeKB * 1024) {
        compressedDataUrl = await resizeImage(compressedDataUrl, 400, 400);
        compressedDataUrl = await adjustImageQuality(compressedDataUrl, 0.7);
    }
    
    // 最終的にまだ大きい場合は、最小サイズにリサイズ
    if (getDataUrlSize(compressedDataUrl) > maxSizeKB * 1024) {
        compressedDataUrl = await resizeImage(compressedDataUrl, 200, 200);
        compressedDataUrl = await adjustImageQuality(compressedDataUrl, 0.5);
    }
    
    return compressedDataUrl;
}

// 画像をリサイズ
async function resizeImage(imageDataUrl, maxWidth, maxHeight) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            let width = img.width;
            let height = img.height;
            
            // アスペクト比を保ちながらリサイズ
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = Math.floor(width * ratio);
                height = Math.floor(height * ratio);
            }
            
            // Canvasでリサイズ
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            // アンチエイリアスを有効にして高品質なリサイズ
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
            
            // JPEGとして出力
            const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            resolve(resizedDataUrl);
        };
        img.src = imageDataUrl;
    });
}

// 画像の品質を調整
async function adjustImageQuality(imageDataUrl, quality) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // 指定された品質でJPEGとして出力
            const adjustedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(adjustedDataUrl);
        };
        img.src = imageDataUrl;
    });
}

// DataURLのサイズを取得（バイト単位）
function getDataUrlSize(dataUrl) {
    const base64 = dataUrl.split(',')[1];
    const padding = (base64.match(/=/g) || []).length;
    return base64.length * 0.75 - padding;
}

// ファイル選択時の処理
async function handleImageSelect(file) {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            reject(new Error('画像ファイルを選択してください'));
            return;
        }
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const originalDataUrl = e.target.result;
                const originalSizeKB = getDataUrlSize(originalDataUrl) / 1024;
                
                console.log(`元の画像サイズ: ${originalSizeKB.toFixed(2)} KB`);
                
                // 圧縮処理
                const compressedDataUrl = await compressImage(originalDataUrl);
                const compressedSizeKB = getDataUrlSize(compressedDataUrl) / 1024;
                
                console.log(`圧縮後のサイズ: ${compressedSizeKB.toFixed(2)} KB`);
                console.log(`圧縮率: ${((1 - compressedSizeKB / originalSizeKB) * 100).toFixed(1)}%`);
                
                resolve(compressedDataUrl);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
        reader.readAsDataURL(file);
    });
}