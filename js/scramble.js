/**
 * Scramble Text Effect on Hover
 * 
 * Usage:
 * Add 'data-scramble' attribute to any element you want to scramble.
 * The script will automatically attach event listeners.
 */

class ScrambleText {
    constructor(element) {
        this.element = element;
        this.originalText = element.innerText;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.frame = 0;
        this.queue = [];
        this.resolve = null;
        this.frameRequest = null;

        this.update = this.update.bind(this);

        this.element.addEventListener('mouseenter', () => {
            this.setText(this.originalText);
        });
    }

    setText(newText) {
        // If already animating, do not restart to prevent infinite loop
        if (this.frameRequest) return Promise.resolve();

        const oldText = this.element.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);

        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }

        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];

            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }

        this.element.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
            this.frameRequest = null;
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    const questions = document.querySelectorAll('.faqtrigger .title-smaller.faq');
    questions.forEach(q => new ScrambleText(q));
});
