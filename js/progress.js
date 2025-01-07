// js/progress.js

// 進捗状況の管理
const Progress = {
    // 進捗データの取得
    getProgress() {
        const progress = localStorage.getItem('toeicProgress');
        return progress ? JSON.parse(progress) : {
            completedDays: [],
            totalProgress: 0
        };
    },

    // 進捗データの保存
    saveProgress(data) {
        localStorage.setItem('toeicProgress', JSON.stringify(data));
    },

    // 特定の日の完了状態を取得
    isDayCompleted(day) {
        const progress = this.getProgress();
        return progress.completedDays.includes(day);
    },

    // 特定の日を完了としてマーク
    markDayAsCompleted(day) {
        const progress = this.getProgress();
        if (!progress.completedDays.includes(day)) {
            progress.completedDays.push(day);
            progress.totalProgress = (progress.completedDays.length / 7) * 100;
            this.saveProgress(progress);
        }
    },

    // 進捗率の計算
    calculateProgress() {
        const progress = this.getProgress();
        return progress.totalProgress;
    }
};

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', function() {
    // 現在のページがコンテンツページかどうかを確認
    const currentPage = window.location.pathname;
    const dayMatch = currentPage.match(/day(\d+)\.html$/);
    
    if (dayMatch) {
        const dayNumber = dayMatch[1];
        const completeButton = document.createElement('button');
        completeButton.classList.add('complete-button');
        completeButton.textContent = Progress.isDayCompleted(dayNumber) 
            ? '学習完了済み' 
            : 'このレッスンを完了とする';
        
        completeButton.addEventListener('click', function() {
            Progress.markDayAsCompleted(dayNumber);
            completeButton.textContent = '学習完了済み';
            completeButton.disabled = true;
        });

        document.querySelector('.container').appendChild(completeButton);
    }
    // ランディングページの場合、プログレスバーを更新
    else if (currentPage.endsWith('index.html') || currentPage === '/') {
        const progress = Progress.getProgress();
        progress.completedDays.forEach(day => {
            const progressBar = document.querySelector(`.day-${day} .progress-bar`);
            if (progressBar) {
                progressBar.style.width = '100%';
            }
        });

        const totalProgress = document.querySelector('.total-progress-bar');
        if (totalProgress) {
            totalProgress.style.width = `${Progress.calculateProgress()}%`;
        }
    }
});
