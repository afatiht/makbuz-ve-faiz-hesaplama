/**
 * TCMB EVDS Service
 * Handles interaction with the Central Bank of the Republic of Turkey API.
 */
const TCMBService = {
    API_URL: 'https://evds2.tcmb.gov.tr/service/evds',
    // Using corsproxy.io which supports header forwarding
    PROXY_URL: 'https://corsproxy.io/?',

    /**
     * Saves the API key to local storage.
     * @param {string} key - The API key.
     */
    saveApiKey: (key) => {
        localStorage.setItem('tcmb_api_key', key);
    },

    /**
     * Retrieves the API key from local storage.
     * @returns {string|null} - The API key or null if not found.
     */
    getApiKey: () => {
        return 'C1lU3HUclC';
    },

    /**
     * Fetches data from the EVDS API using multiple proxies for reliability.
     * @param {string} seriesCode - The series code to fetch.
     * @param {string} startDate - Start date in DD-MM-YYYY format.
     * @param {string} endDate - End date in DD-MM-YYYY format.
     * @returns {Promise<Object>} - The API response.
     */
    fetchData: async (seriesCode, startDate, endDate) => {
        const key = TCMBService.getApiKey();
        if (!key) {
            throw new Error('API Key not found. Please configure it in settings.');
        }

        // Target URL with Key in query params (safest for proxies)
        const targetUrl = `${TCMBService.API_URL}/series=${seriesCode}&startDate=${startDate}&endDate=${endDate}&type=json&key=${key}`;

        // List of proxies to try in order
        const proxies = [
            {
                name: 'AllOrigins',
                url: (target) => `https://api.allorigins.win/get?url=${encodeURIComponent(target)}`,
                parser: (data) => {
                    if (!data.contents) throw new Error('No content from AllOrigins');
                    return JSON.parse(data.contents);
                }
            },
            {
                name: 'CodeTabs',
                url: (target) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(target)}`,
                parser: (data) => data // CodeTabs returns JSON directly
            },
            {
                name: 'CorsProxy',
                url: (target) => `https://corsproxy.io/?${encodeURIComponent(target)}`,
                parser: (data) => data
            }
        ];

        let lastError = null;

        for (const proxy of proxies) {
            try {
                console.log(`Trying proxy: ${proxy.name}`);
                const proxyUrl = proxy.url(targetUrl);

                const response = await fetch(proxyUrl);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status} from ${proxy.name}`);
                }

                const rawData = await response.json();
                const data = proxy.parser(rawData);

                // Check if EVDS returned an internal error (sometimes returns 200 OK but with error message)
                if (data.totalCount === 0 && !data.items) {
                    // This might be valid empty data, or an error. 
                    // EVDS usually returns 'items' array.
                }

                return data; // Success!

            } catch (error) {
                console.warn(`Proxy ${proxy.name} failed:`, error);
                lastError = error;
                // Continue to next proxy
            }
        }

        // If all proxies failed
        throw new Error(`All proxies failed. Last error: ${lastError.message}`);
    },

    /**
     * Fetches the latest available interest rates for common series.
     * @returns {Promise<Array>} - List of interest rates.
     */
    getCommonRates: async () => {
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);

        const formatDate = (date) => {
            const d = date.getDate().toString().padStart(2, '0');
            const m = (date.getMonth() + 1).toString().padStart(2, '0');
            const y = date.getFullYear();
            return `${d}-${m}-${y}`;
        };

        const startDate = formatDate(oneMonthAgo);
        const endDate = formatDate(today);

        // Common Interest Rate Series Codes
        // TP.KTF10: TCMB Politika Faizi (1 Hafta Vadeli Repo)
        // TP.AVANS.YILLIK: Avans İşlemlerinde Uygulanan Faiz Oranı
        // TP.REESKONT.YILLIK: Reeskont İşlemlerinde Uygulanan İskonto Faiz Oranı
        const seriesCodes = 'TP.KTF10-TP.AVANS.YILLIK-TP.REESKONT.YILLIK';

        try {
            const data = await TCMBService.fetchData(seriesCodes, startDate, endDate);

            if (!data.items || data.items.length === 0) {
                return [];
            }

            // Get the latest item
            const latestItem = data.items[data.items.length - 1];

            const rates = [];

            if (latestItem['TP_KTF10']) {
                rates.push({
                    name: 'TCMB Politika Faizi (1 Hafta Repo)',
                    value: parseFloat(latestItem['TP_KTF10']),
                    date: latestItem['Tarih']
                });
            }
            if (latestItem['TP_AVANS_YILLIK']) {
                rates.push({
                    name: 'Avans Faizi',
                    value: parseFloat(latestItem['TP_AVANS_YILLIK']),
                    date: latestItem['Tarih']
                });
            }
            if (latestItem['TP_REESKONT_YILLIK']) {
                rates.push({
                    name: 'Reeskont Faizi',
                    value: parseFloat(latestItem['TP_REESKONT_YILLIK']),
                    date: latestItem['Tarih']
                });
            }

            return rates;
        } catch (error) {
            throw error;
        }
    }
};
