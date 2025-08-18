// 人物詳細画面を安全にレンダリングする関数
function renderPersonDetailSafe(person, detailView) {
    // 既存の内容を安全にクリア
    while (detailView.firstChild) {
        detailView.removeChild(detailView.firstChild);
    }
    
    // ヘッダー作成
    const header = document.createElement('div');
    header.className = 'detail-header';
    
    // モバイル用戻るボタン
    if (window.innerWidth <= 768) {
        const backBtn = document.createElement('button');
        backBtn.className = 'btn-icon';
        backBtn.onclick = showEmptyState;
        backBtn.style.marginRight = '15px';
        backBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>';
        header.appendChild(backBtn);
    }
    
    // タイトル
    const h2 = document.createElement('h2');
    h2.style.flex = '1';
    h2.textContent = person.name || '新規人物';
    header.appendChild(h2);
    
    // ピン留めボタン
    const pinBtn = document.createElement('button');
    pinBtn.type = 'button';
    pinBtn.id = 'pinButton';
    pinBtn.className = `pin-button ${person.isPinned ? 'pinned' : ''}`;
    pinBtn.title = person.isPinned ? 'ピン留め解除' : 'ピン留め';
    pinBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M17 3v7c0 .55-.45 1-1 1h-3v1.82c.65.34 1.1.97 1.15 1.68H17c.55 0 1 .45 1 1s-.45 1-1 1h-2.95c-.22 1.25-1.35 2.19-2.68 2.19S9.15 17.75 8.93 16.5H7c-.55 0-1-.45-1-1s.45-1 1-1h2.93c.05-.71.5-1.34 1.15-1.68V12H8c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h8c.55 0 1 .45 1 1zm-2 1H9v6h6V4z"/></svg>';
    header.appendChild(pinBtn);
    
    detailView.appendChild(header);
    
    // フォーム作成
    const form = document.createElement('form');
    form.id = 'personForm';
    
    // 写真アップロードカード
    const photoCard = createFormCard();
    const photoUpload = createPhotoUpload(person.photo);
    photoCard.appendChild(photoUpload);
    form.appendChild(photoCard);
    
    // 基本情報カード
    const basicCard = createFormCard('基本情報');
    
    // 名前フィールド
    const nameGroup = createFormGroup('名前', 'text', 'name', person.name || '', 'name', '山田太郎');
    basicCard.appendChild(nameGroup);
    
    // 2列レイアウト（誕生日・関係性）
    const twoCol1 = document.createElement('div');
    twoCol1.className = 'two-column';
    
    // 誕生日フィールド
    const birthdayGroup = createBirthdayField(person.birthday);
    twoCol1.appendChild(birthdayGroup);
    
    // 関係性フィールド
    const relationshipGroup = createRelationshipField(person.relationship);
    twoCol1.appendChild(relationshipGroup);
    
    basicCard.appendChild(twoCol1);
    
    // 2列レイアウト（電話番号・LINE）
    const twoCol2 = document.createElement('div');
    twoCol2.className = 'two-column';
    
    // 電話番号フィールド
    const phoneGroup = createPhoneField(person.phone);
    twoCol2.appendChild(phoneGroup);
    
    // LINEフィールド
    const lineGroup = createLineField(person.line);
    twoCol2.appendChild(lineGroup);
    
    basicCard.appendChild(twoCol2);
    form.appendChild(basicCard);
    
    // 出会いと交流カード
    const meetingCard = createMeetingCard(person);
    form.appendChild(meetingCard);
    
    // 特徴と趣味カード
    const featuresCard = createFeaturesCard(person);
    form.appendChild(featuresCard);
    
    // 詳細情報カード
    const detailsCard = createDetailsCard(person);
    form.appendChild(detailsCard);
    
    // メモカード
    const notesCard = createNotesCard(person);
    form.appendChild(notesCard);
    
    detailView.appendChild(form);
    
    // 保存・削除ボタン
    const actions = createActionButtons(person.id);
    detailView.appendChild(actions);
    
    // イベントリスナーの設定
    setupDetailFormEventListeners(person);
}

// 各種ヘルパー関数
function createFormCard(title) {
    const card = document.createElement('div');
    card.className = 'form-card';
    if (title) {
        const h3 = document.createElement('h3');
        h3.textContent = title;
        card.appendChild(h3);
    }
    return card;
}

function createFormGroup(label, type, id, value, autocomplete, placeholder) {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    const labelEl = document.createElement('label');
    labelEl.setAttribute('for', id);
    labelEl.textContent = label;
    group.appendChild(labelEl);
    
    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.name = id;
    input.value = value;
    if (autocomplete) input.autocomplete = autocomplete;
    if (placeholder) input.placeholder = placeholder;
    group.appendChild(input);
    
    return group;
}

function createPhotoUpload(photoUrl) {
    const photoUpload = document.createElement('div');
    photoUpload.className = 'photo-upload';
    
    const preview = document.createElement('div');
    preview.className = 'photo-preview';
    preview.id = 'photoPreview';
    
    if (photoUrl) {
        // WebP対応のpicture要素を作成
        if (window.webPSupport) {
            const picture = webPSupport.createPictureElement(
                photoUrl,
                '写真',
                '',
                false // 遅延読み込みを無効化（即時表示）
            );
            const img = picture.querySelector('img');
            
            // 詳細画面では画像はすぐに表示（遅延読み込みなし）
            img.src = photoUrl;
            img.onclick = () => showFullscreenImage(photoUrl);
            
            preview.appendChild(picture);
        } else {
            const img = document.createElement('img');
            img.src = photoUrl;
            img.alt = '写真';
            img.onclick = () => showFullscreenImage(photoUrl);
            preview.appendChild(img);
        }
    } else {
        preview.innerHTML = '<svg viewBox="0 0 24 24" fill="#ccc" width="80" height="80"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
    }
    photoUpload.appendChild(preview);
    
    const uploadBtn = document.createElement('button');
    uploadBtn.type = 'button';
    uploadBtn.className = 'photo-upload-btn';
    uploadBtn.onclick = () => document.getElementById('photoInput').click();
    uploadBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>';
    photoUpload.appendChild(uploadBtn);
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'photoInput';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.onchange = handlePhotoUpload;
    photoUpload.appendChild(fileInput);
    
    return photoUpload;
}