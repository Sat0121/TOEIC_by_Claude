// js/progress.js

const Progress = {
    getProgress() {
        const progress = localStorage.getItem('toeicProgress');
        return progress ? JSON.parse(progress) : {
            completedDays: [],
            totalProgress: 0
        };
    },

    saveProgress(data) {
        localStorage.setItem('toeicProgress', JSON.stringify(data));
    },

    isDayCompleted(day) {
        const progress = this.getProgress();
        return progress.completedDays.includes(day);
    },

    markDayAsCompleted(day) {
        const progress = this.getProgress();
        if (!progress.completedDays.includes(day)) {
            progress.completedDays.push(day);
            progress.totalProgress = (progress.completedDays.length / 7) * 100;
            this.saveProgress(progress);
        }
        this.updateAllProgressDisplays();
    },

    calculateProgress() {
        const progress = this.getProgress();
        return progress.totalProgress;
    },

    resetProgress() {
        localStorage.removeItem('toeicProgress');
        this.updateAllProgressDisplays();
        // ページをリロード
        window.location.reload();
    },

    updateAllProgressDisplays() {
        const progress = this.getProgress();
        const percentage = progress.totalProgress;
        
        // 進捗テキストの更新
        const progressText = document.getElementById('progressPercentage');
        if (progressText) {
            progressText.textContent = Math.round(percentage);
        }

        // プログレスバーの更新
        const progressBar = document.querySelector('.total-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // 進捗表示の初期更新
    Progress.updateAllProgressDisplays();

    // 現在のページがコンテンツページかどうかを確認
    const currentPage = window.location.pathname;
    const dayMatch = currentPage.match(/day(\d+)\.html$/);
    
    if (dayMatch) {
        const dayNumber = dayMatch[1];
        const completeButton = document.createElement('div');
        completeButton.classList.add('complete-button-container');
        
        const isCompleted = Progress.isDayCompleted(dayNumber);
        completeButton.innerHTML = `
            <button class="action-button ${isCompleted ? 'completed' : ''}" 
                    ${isCompleted ? 'disabled' : ''}>
                <span class="button-text">${isCompleted ? '学習完了済み' : 'このレッスンを完了とする'}</span>
                ${isCompleted ? '<span class="check-icon">✓</span>' : ''}
            </button>
        `;
        
        completeButton.querySelector('button').addEventListener('click', function() {
            Progress.markDayAsCompleted(dayNumber);
            this.classList.add('completed');
            this.disabled = true;
            this.innerHTML = '<span class="button-text">学習完了済み</span><span class="check-icon">✓</span>';
        });

        document.querySelector('.container').insertBefore(
            completeButton, 
            document.querySelector('.answer')
        );
    }

    // リセットボタンの追加（全ページ共通）
    const resetButton = document.createElement('button');
    resetButton.classList.add('reset-button');
    resetButton.textContent = '進捗をリセット';
    resetButton.addEventListener('click', function() {
        if (confirm('進捗をリセットしてもよろしいですか？')) {
            Progress.resetProgress();
        }
    });

    const progressContainer = document.querySelector('.progress-text');
    if (progressContainer) {
        progressContainer.appendChild(resetButton);
    }
});