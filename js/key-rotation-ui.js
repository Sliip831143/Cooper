// キーローテーション管理UI
// 設定画面にキーローテーションの管理機能を追加

function addKeyRotationSettingsUI() {
    // キーローテーション設定は初期化時に作成済みなので、何もしない
    // updateKeyRotationUI() で内容を更新するのみ
}

// キーローテーションUIを更新
function updateKeyRotationUI() {
    const user = getCurrentUser();
    const contentDiv = document.getElementById('rotationSettingsContent');
    if (!contentDiv) return;
    
    if (!user) {
        // ログインしていない場合は空にする
        contentDiv.innerHTML = '';
        return;
    }

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
        <div style="background: var(--md-sys-color-surface-container-low); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="font-weight: bold; color: var(--md-sys-color-on-surface);">ステータス</span>
                <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span>
            </div>
            <div style="font-size: 14px; color: var(--md-sys-color-on-surface-variant);">
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

        <div style="margin-bottom: 15px; padding: 0 15px;">
            <label style="display: block; margin-bottom: 5px; font-size: 14px; color: var(--md-sys-color-on-surface-variant);">更新間隔の設定</label>
            <select id="rotationIntervalSelect" class="form-select" style="
                width: 100%;
                padding: 16px;
                padding-right: 40px;
                border: 1px solid var(--md-sys-color-outline-variant);
                border-radius: var(--md-sys-shape-corner-small);
                font-size: 16px;
                background-color: var(--md-sys-color-surface);
                color: var(--md-sys-color-on-surface);
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                background-image: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%225%22 viewBox=%220 0 10 5%22%3E%3Cpath fill=%22%235f6368%22 d=%22M0 0l5 5 5-5z%22/%3E%3C/svg%3E');
                background-repeat: no-repeat;
                background-position: right 16px center;
                background-size: 10px 5px;
                cursor: pointer;
                transition: all 0.2s ease;
            " onfocus="this.style.borderColor='var(--md-sys-color-primary)'; this.style.borderWidth='2px'; this.style.padding='15px'; this.style.paddingRight='39px';" onblur="this.style.borderColor='var(--md-sys-color-outline-variant)'; this.style.borderWidth='1px'; this.style.padding='16px'; this.style.paddingRight='40px';">
                <option value="30" ${settings.interval === 30 ? 'selected' : ''}>30日（高セキュリティ）</option>
                <option value="60" ${settings.interval === 60 ? 'selected' : ''}>60日</option>
                <option value="90" ${settings.interval === 90 ? 'selected' : ''}>90日（推奨）</option>
                <option value="180" ${settings.interval === 180 ? 'selected' : ''}>180日</option>
                <option value="365" ${settings.interval === 365 ? 'selected' : ''}>365日（低セキュリティ）</option>
            </select>
        </div>

        <div style="padding: 0 15px; margin-bottom: 15px;">
            <button onclick="manualKeyRotation()" class="btn btn-primary" style="width: 100%;">
                今すぐキーを更新
            </button>
        </div>

        ${settings.history.length > 0 ? `
            <details style="margin-top: 15px;">
                <summary style="cursor: pointer; font-size: 14px; color: var(--md-sys-color-on-surface-variant);">更新履歴</summary>
                <div style="margin-top: 10px; font-size: 12px; color: var(--md-sys-color-on-surface-variant);">
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