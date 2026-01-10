/**
 * Shared Utility Functions for Makbuz and Faiz Hesaplama
 */

const Utils = {
    /**
     * Formats a number as Turkish Lira currency.
     * Uses Intl.NumberFormat for standard formatting.
     * @param {number} amount - The amount to format.
     * @returns {string} - Formatted currency string (e.g., "1.234,56 ₺").
     */
    formatCurrency: (amount) => {
        if (typeof amount !== 'number' || isNaN(amount)) {
            return '0,00 ₺';
        }
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    },

    /**
     * Formats a number as a decimal string with comma separator, without currency symbol.
     * Useful for input values.
     * @param {number} amount - The amount to format.
     * @returns {string} - Formatted string (e.g., "1.234,56").
     */
    formatNumber: (amount) => {
        if (typeof amount !== 'number' || isNaN(amount)) {
            return '0,00';
        }
        return new Intl.NumberFormat('tr-TR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    },

    /**
     * Parses a formatted currency string into a number.
     * Handles "1.234,56" format correctly.
     * @param {string} value - The string value to parse.
     * @returns {number} - The parsed number.
     */
    parseCurrency: (value) => {
        if (!value) return 0;
        // Remove all dots (thousands separators) and replace comma with dot (decimal separator)
        const cleanValue = value.toString().replace(/\./g, '').replace(',', '.');
        const parsed = parseFloat(cleanValue);
        return isNaN(parsed) ? 0 : parsed;
    },

    /**
     * Calculates the difference in days between two dates.
     * @deprecated Use DateUtils.calculateDayDifference instead.
     * @param {Date} date1 - First date.
     * @param {Date} date2 - Second date.
     * @returns {number} - Difference in days (absolute value).
     */
    calculateDayDifference: (date1, date2) => {
        console.warn('Utils.calculateDayDifference is deprecated. Use DateUtils.calculateDayDifference instead.');
        return DateUtils.calculateDayDifference(date1, date2);
    },

    /**
     * Sets up an input element to handle currency formatting automatically.
     * @param {HTMLInputElement} inputElement - The input element to attach listeners to.
     */
    /**
     * Sets up an input element to handle currency formatting automatically.
     * @deprecated Use InputMask class instead.
     * @param {HTMLInputElement} inputElement - The input element to attach listeners to.
     */
    setupCurrencyInput: (inputElement) => {
        console.warn('Utils.setupCurrencyInput is deprecated. Use InputMask.attach() instead.');
        // Legacy support or empty implementation if we fully switch
    }
};
