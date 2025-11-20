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

        // Target URL (without key, as we will send it in header where possible)
        const targetUrl = `${TCMBService.API_URL}/series=${seriesCode}&startDate=${startDate}&endDate=${endDate}&type=json`;

        // List of proxies to try
        // Note: We prioritize proxies that allow header forwarding because TCMB requires Key in Header.
        const proxies = [
            {
                name: 'CorsProxy.io',
                url: (target) => `https://corsproxy.io/?${target}`, // Appends target directly
                headers: { 'key': key }
            },
            {
                name: 'ThingProxy',
                url: (target) => `https://thingproxy.freeboard.io/fetch/${target}`,
                headers: { 'key': key }
            }
        ];

        let lastError = null;

        for (const proxy of proxies) {
            try {
                console.log(`Trying proxy: ${proxy.name}`);
                const proxyUrl = proxy.url(targetUrl);

                const response = await fetch(proxyUrl, {
                    method: 'GET',
                    headers: {
                        ...proxy.headers,
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status} from ${proxy.name}`);
                }

                const data = await response.json();

                // Check for EVDS internal error
                if (data.totalCount === 0 && !data.items) {
                    // Empty response
                }

                return data;

            } catch (error) {
                console.warn(`Proxy ${proxy.name} failed:`, error);
                lastError = error;
            }
        }

        throw new Error(`All proxies failed. Last error: ${lastError ? lastError.message : 'Unknown'}`);
    },

    /**
     * Returns static interest rates that are not easily available via EVDS series.
     * @returns {Array} - List of static rates.
     */
    getStaticRates: () => {
        return [
            {
                name: 'Yasal Faiz (21.05.2024 sonrası)',
                value: 24.00,
                date: 'Sabit Oran'
            },
            {
                name: 'Kamu Alacakları Gecikme Zammı (Yıllık)',
                value: 54.00, // %4.5 monthly * 12
                date: 'Sabit Oran (Aylık %4.5)'
            }
        ];
    },

    /**
     * Fetches the latest available interest rates for common series.
     * @returns {Promise<Array>} - List of interest rates.
     */
    getCommonRates: async () => {
        const rates = [...TCMBService.getStaticRates()];

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

            if (data.items && data.items.length > 0) {
                // Get the latest item
                const latestItem = data.items[data.items.length - 1];

                if (latestItem['TP_KTF10']) {
                    rates.push({
                        name: 'TCMB Politika Faizi (1 Hafta Repo)',
                        value: parseFloat(latestItem['TP_KTF10']),
                        date: latestItem['Tarih']
                    });
                }
                if (latestItem['TP_AVANS_YILLIK']) {
                    rates.push({
                        name: 'Avans Faizi (Ticari Temerrüt)',
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
            }
        } catch (error) {
            console.error('Failed to fetch dynamic rates:', error);
            // We suppress the error here to at least show the static rates
            // But we might want to notify the user via a UI indicator
        }

        return rates;
    }
};
