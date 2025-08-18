// XSS対策用の安全なレンダリング関数

// DOM要素を安全に作成する関数
function safeCreateElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
}

// 詳細ビューを安全にレンダリングする関数
function renderPersonDetailSafe(person, detailView) {
    // 既存の内容をクリア
    while (detailView.firstChild) {
        detailView.removeChild(detailView.firstChild);
    }
    
    // ヘッダーを作成
    const header = safeCreateElement('div', 'detail-header');
    
    // モバイル用の戻るボタン
    if (window.innerWidth <= 768) {
        const backBtn = safeCreateElement('button', 'btn-icon');
        backBtn.onclick = showEmptyState;
        backBtn.style.marginRight = '15px';
        backBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>';
        header.appendChild(backBtn);
    }
    
    // タイトル
    const title = safeCreateElement('h2');
    title.style.flex = '1';
    title.textContent = person.name || '新規人物';
    header.appendChild(title);
    
    // ピン留めボタン
    const pinBtn = safeCreateElement('button', `pin-button ${person.isPinned ? 'pinned' : ''}`);
    pinBtn.type = 'button';
    pinBtn.id = 'pinButton';
    pinBtn.title = person.isPinned ? 'ピン留め解除' : 'ピン留め';
    pinBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M17 3v7c0 .55-.45 1-1 1h-3v1.82c.65.34 1.1.97 1.15 1.68H17c.55 0 1 .45 1 1s-.45 1-1 1h-2.95c-.22 1.25-1.35 2.19-2.68 2.19S9.15 17.75 8.93 16.5H7c-.55 0-1-.45-1-1s.45-1 1-1h2.93c.05-.71.5-1.34 1.15-1.68V12H8c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h8c.55 0 1 .45 1 1zm-2 1H9v6h6V4z"/></svg>';
    header.appendChild(pinBtn);
    
    detailView.appendChild(header);
    
    // フォームを作成
    const form = safeCreateElement('form');
    form.id = 'personForm';
    
    // 各フィールドを安全に追加していく（例として基本情報のみ示す）
    const basicCard = createFormCard('基本情報', [
        createFormGroup('名前', 'text', 'name', person.name || '', 'name', '山田太郎')
    ]);
    form.appendChild(basicCard);
    
    detailView.appendChild(form);
    
    // イベントリスナーを再設定
    setupDetailViewEventListeners(person);
}

// フォームカードを作成
function createFormCard(title, formGroups) {
    const card = safeCreateElement('div', 'form-card');
    if (title) {
        const h3 = safeCreateElement('h3');
        h3.textContent = title;
        card.appendChild(h3);
    }
    formGroups.forEach(group => card.appendChild(group));
    return card;
}

// フォームグループを作成
function createFormGroup(label, type, id, value, autocomplete, placeholder) {
    const group = safeCreateElement('div', 'form-group');
    
    const labelEl = safeCreateElement('label');
    labelEl.setAttribute('for', id);
    labelEl.textContent = label;
    group.appendChild(labelEl);
    
    const input = safeCreateElement('input');
    input.type = type;
    input.id = id;
    input.name = id;
    input.value = value;
    if (autocomplete) input.autocomplete = autocomplete;
    if (placeholder) input.placeholder = placeholder;
    group.appendChild(input);
    
    return group;
}

// 写真プレビューを安全に更新
function updatePhotoPreviewSafe(photoUrl) {
    const preview = document.getElementById('photoPreview');
    while (preview.firstChild) {
        preview.removeChild(preview.firstChild);
    }
    
    if (photoUrl) {
        const img = safeCreateElement('img');
        img.src = photoUrl;
        img.alt = '写真';
        preview.appendChild(img);
    } else {
        preview.innerHTML = '<svg viewBox="0 0 24 24" fill="#ccc" width="80" height="80"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
    }
}