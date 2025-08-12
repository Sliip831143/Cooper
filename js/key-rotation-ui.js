// キーローテーション管理UI
// 設定画面にキーローテーションの管理機能を追加

function addKeyRotationSettingsUI() {
    // 設定メニューにキーローテーション項目を追加
    const settingsMenu = document.getElementById('settingsMenu');
    if (!settingsMenu) return;

    // キーローテーション設定セクションを作成
    const rotationSection = document.createElement('div');
    rotationSection.className = 'settings-section';
    rotationSection.id = 'keyRotationSection';
    rotationSection.innerHTML = `
        <h3 style="margin: 20px 0 10px 0; font-size: 16px; color: #333;">
            🔐 暗号化キー管理
        </h3>
        <div id="rotationSettingsContent"></div>
    `;

    // 設定メニューの最後に追加
    const deleteAllSection = settingsMenu.querySelector('div:last-child');
    if (deleteAllSection && deleteAllSection.parentNode === settingsMenu) {
        settingsMenu.insertBefore(rotationSection, deleteAllSection);
    } else {
        // 最後の要素が見つからない場合は末尾に追加
        settingsMenu.appendChild(rotationSection);
    }

    // 設定内容を更新
    updateKeyRotationUI();
}

// キーローテーションUIを更新
function updateKeyRotationUI() {
    const user = getCurrentUser();
    if (!user) {
        // ログインしていない場合は表示しない
        const rotationSection = document.getElementById('keyRotationSection');
        if (rotationSection) {
            rotationSection.style.display = 'none';
        }
        return;
    }

    const contentDiv = document.getElementById('rotationSettingsContent');
    if (!contentDiv) return;

    const settings = keyRotationManager.getRotationSettings(user.uid);
    const lastRotationDate = settings.lastRotation ? new Date(settings.lastRotation) : null;
    const daysSinceRotation = lastRotationDate 
        ? Math.floor((new Date() - lastRotationDate) / (1000 * 60 * 60 * 24))
        : 0;

    // ステータス表示
    const statusColor = daysSinceRotation > settings.interval ? '#ff6b6b' : '#51cf66';
    const statusText = daysSinceRotation > settings.interval 
        ? '更新が推奨されます' 
        : '正常';

    contentDiv.innerHTML = `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="font-weight: bold;">ステータス</span>
                <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span>
            </div>
            <div style="font-size: 14px; color: #666;">
                <div style="margin-bottom: 5px;">
                    最終更新: ${lastRotationDate ? lastRotationDate.toLocaleDateString('ja-JP') : '未設定'}
                    ${daysSinceRotation > 0 ? `（${daysSinceRotation}日前）` : ''}
                </div>
                <div>
                    更新間隔: ${settings.interval}日ごと
                </div>
                ${settings.skipCount > 0 ? `<div style="color: #ff6b6b; margin-top: 5px;">スキップ回数: ${settings.skipCount}回</div>` : ''}
            </div>
        </div>

        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-size: 14px;">更新間隔の設定</label>
            <select id="rotationIntervalSelect" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                <option value="30" ${settings.interval === 30 ? 'selected' : ''}>30日（高セキュリティ）</option>
                <option value="60" ${settings.interval === 60 ? 'selected' : ''}>60日</option>
                <option value="90" ${settings.interval === 90 ? 'selected' : ''}>90日（推奨）</option>
                <option value="180" ${settings.interval === 180 ? 'selected' : ''}>180日</option>
                <option value="365" ${settings.interval === 365 ? 'selected' : ''}>365日（低セキュリティ）</option>
            </select>
        </div>

        <button onclick="manualKeyRotation()" style="
            width: 100%;
            padding: 10px;
            background: #1D9BF0;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            margin-bottom: 10px;
        ">
            今すぐキーを更新
        </button>

        ${settings.history.length > 0 ? `
            <details style="margin-top: 15px;">
                <summary style="cursor: pointer; font-size: 14px; color: #666;">更新履歴</summary>
                <div style="margin-top: 10px; font-size: 12px; color: #666;">
                    ${settings.history.slice(-5).reverse().map(h => `
                        <div style="margin-bottom: 5px;">
                            ${new Date(h.date).toLocaleDateString('ja-JP')} - 
                            ${h.method === 'automatic' ? '自動更新' : '手動更新'}
                        </div>
                    `).join('')}
                </div>
            </details>
        ` : ''}
    `;

    // イベントリスナーを設定
    const intervalSelect = document.getElementById('rotationIntervalSelect');
    if (intervalSelect) {
        intervalSelect.addEventListener('change', (e) => {
            const newInterval = parseInt(e.target.value);
            keyRotationManager.setRotationInterval(newInterval);
            alert(`更新間隔を${newInterval}日に設定しました。`);
            updateKeyRotationUI();
        });
    }

    // セクションを表示
    const rotationSection = document.getElementById('keyRotationSection');
    if (rotationSection) {
        rotationSection.style.display = 'block';
    }
}

// 手動キーローテーション
async function manualKeyRotation() {
    const user = getCurrentUser();
    if (!user) {
        alert('キーを更新するにはログインが必要です。');
        return;
    }

    await keyRotationManager.manualKeyRotation(user.uid);
    updateKeyRotationUI();
}

// 自動通知システム
class KeyRotationNotifier {
    constructor() {
        this.notificationKey = 'cooper_rotation_notification';
    }

    // 通知を表示すべきかチェック
    shouldShowNotification(userId, daysSinceRotation, interval) {
        // 期限の7日前から通知開始
        const daysUntilRotation = interval - daysSinceRotation;
        
        if (daysUntilRotation <= 7 && daysUntilRotation > 0) {
            const lastNotification = localStorage.getItem(`${this.notificationKey}_${userId}`);
            const today = new Date().toDateString();
            
            // 今日まだ通知していない場合
            if (lastNotification !== today) {
                localStorage.setItem(`${this.notificationKey}_${userId}`, today);
                return true;
            }
        }
        
        return false;
    }

    // 通知バナーを表示
    showRotationReminder(daysRemaining) {
        const banner = document.createElement('div');
        banner.id = 'rotationReminderBanner';
        banner.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fff3cd;
            border: 1px solid #ffeeba;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        
        banner.innerHTML = `
            <div style="display: flex; align-items: start;">
                <div style="margin-right: 10px; font-size: 20px;">🔐</div>
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 5px 0; font-size: 14px;">暗号化キーの更新</h4>
                    <p style="margin: 0 0 10px 0; font-size: 12px; color: #666;">
                        あと${daysRemaining}日で更新期限です。<br>
                        セキュリティ強化のため、定期的な更新を推奨します。
                    </p>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="manualKeyRotation(); document.getElementById('rotationReminderBanner').remove();" 
                                style="padding: 5px 10px; background: #1D9BF0; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">
                            今すぐ更新
                        </button>
                        <button onclick="document.getElementById('rotationReminderBanner').remove();" 
                                style="padding: 5px 10px; background: #e9ecef; color: #333; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">
                            後で
                        </button>
                    </div>
                </div>
                <button onclick="document.getElementById('rotationReminderBanner').remove();" 
                        style="background: none; border: none; font-size: 16px; cursor: pointer; padding: 0; margin-left: 10px;">
                    ×
                </button>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // 10秒後に自動で消える
        setTimeout(() => {
            if (document.getElementById('rotationReminderBanner')) {
                banner.remove();
            }
        }, 10000);
    }
}

// 通知システムのインスタンス
const rotationNotifier = new KeyRotationNotifier();

// スタイルを追加
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);