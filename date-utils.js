/**
 * Date Utility Functions
 * Provides helper methods for date calculations and formatting.
 */
const DateUtils = {
    /**
     * Adds days to a given date.
     * @param {Date} date - The starting date.
     * @param {number} days - Number of days to add.
     * @returns {Date} - The new date.
     */
    addDays: (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },

    /**
     * Checks if a date is a weekend (Saturday or Sunday).
     * @param {Date} date - The date to check.
     * @returns {boolean} - True if weekend, false otherwise.
     */
    isWeekend: (date) => {
        const day = date.getDay();
        return day === 0 || day === 6; // 0: Sunday, 6: Saturday
    },

    /**
     * Calculates the number of business days between two dates.
     * @param {Date} startDate - The start date.
     * @param {Date} endDate - The end date.
     * @returns {number} - Number of business days.
     */
    calculateBusinessDays: (startDate, endDate) => {
        let count = 0;
        let curDate = new Date(startDate);
        const end = new Date(endDate);

        // Normalize times to avoid partial day issues
        curDate.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        while (curDate < end) {
            const dayOfWeek = curDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                count++;
            }
            curDate.setDate(curDate.getDate() + 1);
        }
        return count;
    },

    /**
     * Formats a date using Intl.DateTimeFormat.
     * @param {Date} date - The date to format.
     * @param {string} locale - The locale string (default: 'tr-TR').
     * @returns {string} - Formatted date string.
     */
    formatDate: (date, locale = 'tr-TR') => {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    },

    /**
     * Calculates the difference in days between two dates.
     * @param {Date} date1 - First date.
     * @param {Date} date2 - Second date.
     * @returns {number} - Difference in days (absolute value).
     */
    calculateDayDifference: (date1, date2) => {
        const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
        // Reset time parts to ensure we count full days
        const d1 = new Date(date1);
        d1.setHours(0, 0, 0, 0);
        const d2 = new Date(date2);
        d2.setHours(0, 0, 0, 0);

        return Math.round(Math.abs((d1 - d2) / oneDay));
    }
};
