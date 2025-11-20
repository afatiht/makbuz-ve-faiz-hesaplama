/**
 * Input Mask Utility
 * Handles input masking and formatting for currency and other types.
 */
class InputMask {
    constructor(element, options = {}) {
        this.element = element;
        this.options = Object.assign({
            locale: 'tr-TR',
            currency: 'TRY',
            decimalPlaces: 2,
            type: 'currency' // 'currency' or 'number'
        }, options);

        this.init();
    }

    init() {
        this.element.addEventListener('input', this.handleInput.bind(this));
        this.element.addEventListener('keydown', this.handleKeydown.bind(this));
        this.element.addEventListener('blur', this.handleBlur.bind(this));
        this.element.addEventListener('focus', this.handleFocus.bind(this));
    }

    handleInput(e) {
        // Store cursor position
        const start = this.element.selectionStart;
        const oldLen = this.element.value.length;

        // Remove non-numeric characters except comma
        let value = this.element.value.replace(/[^\d,]/g, '');

        // Ensure only one comma
        const parts = value.split(',');
        if (parts.length > 2) {
            value = parts[0] + ',' + parts.slice(1).join('');
        }

        // Limit decimal places
        if (parts.length > 1) {
            parts[1] = parts[1].substring(0, this.options.decimalPlaces);
            value = parts[0] + ',' + parts[1];
        }

        // Format thousands with dots
        const parts2 = value.split(',');
        parts2[0] = parts2[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        this.element.value = parts2.join(',');

        // Restore cursor position (approximate)
        const newLen = this.element.value.length;
        const offset = newLen - oldLen;
        this.element.setSelectionRange(start + offset, start + offset);
    }

    handleKeydown(e) {
        const allowedKeys = [
            'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',
            'Home', 'End', 'Enter', ',', '.'
        ];

        if (allowedKeys.includes(e.key) ||
            (e.ctrlKey || e.metaKey) || // Allow copy/paste
            /^\d$/.test(e.key)) { // Allow numbers

            // Handle dot as comma
            if (e.key === '.') {
                e.preventDefault();
                if (!this.element.value.includes(',')) {
                    // Insert comma at cursor
                    const start = this.element.selectionStart;
                    const end = this.element.selectionEnd;
                    this.element.value = this.element.value.substring(0, start) + ',' + this.element.value.substring(end);
                    this.element.setSelectionRange(start + 1, start + 1);
                    // Trigger input event to format
                    this.element.dispatchEvent(new Event('input'));
                }
            }
            return;
        }
        e.preventDefault();
    }

    handleBlur(e) {
        // Optional: Format on blur (e.g., add decimals if missing)
        let value = this.element.value;
        if (!value) return;

        if (this.options.type === 'currency' || this.options.type === 'number') {
            // If it ends with a comma, remove it or add zeros? Let's add zeros if it's a number
            if (value.indexOf(',') === -1) {
                value += ',00';
            } else {
                const parts = value.split(',');
                if (parts[1].length === 0) value += '00';
                else if (parts[1].length === 1) value += '0';
            }
            this.element.value = value;
        }
    }

    handleFocus(e) {
        // Select all on focus for easier editing
        this.element.select();
    }

    /**
     * Static method to attach mask to an element
     */
    static attach(element, options) {
        return new InputMask(element, options);
    }
}
