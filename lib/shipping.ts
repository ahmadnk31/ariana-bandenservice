// Shipping rate configuration
// Rates based on typical GLS/DHL heavy parcel pricing from Belgium (~10-12kg per tire)

export interface ShippingRate {
    id: string;
    carrier: 'pickup' | 'dhl' | 'gls';
    method: 'pickup' | 'standard' | 'express';
    name: string;
    price: number;
    deliveryDays: string;
    description: string;
}

// Country-specific shipping rates
// Pickup is always free and only available for Belgium
const COUNTRY_RATES: Record<string, ShippingRate[]> = {
    BE: [
        {
            id: 'pickup',
            carrier: 'pickup',
            method: 'pickup',
            name: 'Pickup at Shop',
            price: 0,
            deliveryDays: '0',
            description: 'Pick up your order at our shop in Ghent - FREE',
        },
        {
            id: 'gls-standard',
            carrier: 'gls',
            method: 'standard',
            name: 'GLS Standard',
            price: 9.95,
            deliveryDays: '2-3',
            description: 'Delivered within 2-3 business days',
        },
        {
            id: 'gls-express',
            carrier: 'gls',
            method: 'express',
            name: 'GLS Express',
            price: 14.95,
            deliveryDays: '1-2',
            description: 'Delivered within 1-2 business days',
        },
        {
            id: 'dhl-standard',
            carrier: 'dhl',
            method: 'standard',
            name: 'DHL Standard',
            price: 12.95,
            deliveryDays: '2-3',
            description: 'Delivered within 2-3 business days',
        },
        {
            id: 'dhl-express',
            carrier: 'dhl',
            method: 'express',
            name: 'DHL Express',
            price: 19.95,
            deliveryDays: '1',
            description: 'Next business day delivery',
        },
    ],
    NL: [
        {
            id: 'gls-standard',
            carrier: 'gls',
            method: 'standard',
            name: 'GLS Standard',
            price: 12.95,
            deliveryDays: '2-4',
            description: 'Delivered within 2-4 business days',
        },
        {
            id: 'gls-express',
            carrier: 'gls',
            method: 'express',
            name: 'GLS Express',
            price: 17.95,
            deliveryDays: '1-2',
            description: 'Delivered within 1-2 business days',
        },
        {
            id: 'dhl-standard',
            carrier: 'dhl',
            method: 'standard',
            name: 'DHL Standard',
            price: 14.95,
            deliveryDays: '2-3',
            description: 'Delivered within 2-3 business days',
        },
        {
            id: 'dhl-express',
            carrier: 'dhl',
            method: 'express',
            name: 'DHL Express',
            price: 22.95,
            deliveryDays: '1',
            description: 'Next business day delivery',
        },
    ],
    LU: [
        {
            id: 'gls-standard',
            carrier: 'gls',
            method: 'standard',
            name: 'GLS Standard',
            price: 12.95,
            deliveryDays: '2-4',
            description: 'Delivered within 2-4 business days',
        },
        {
            id: 'gls-express',
            carrier: 'gls',
            method: 'express',
            name: 'GLS Express',
            price: 17.95,
            deliveryDays: '1-2',
            description: 'Delivered within 1-2 business days',
        },
        {
            id: 'dhl-standard',
            carrier: 'dhl',
            method: 'standard',
            name: 'DHL Standard',
            price: 14.95,
            deliveryDays: '2-3',
            description: 'Delivered within 2-3 business days',
        },
        {
            id: 'dhl-express',
            carrier: 'dhl',
            method: 'express',
            name: 'DHL Express',
            price: 22.95,
            deliveryDays: '1',
            description: 'Next business day delivery',
        },
    ],
    DE: [
        {
            id: 'gls-standard',
            carrier: 'gls',
            method: 'standard',
            name: 'GLS Standard',
            price: 14.95,
            deliveryDays: '3-5',
            description: 'Delivered within 3-5 business days',
        },
        {
            id: 'gls-express',
            carrier: 'gls',
            method: 'express',
            name: 'GLS Express',
            price: 19.95,
            deliveryDays: '2-3',
            description: 'Delivered within 2-3 business days',
        },
        {
            id: 'dhl-standard',
            carrier: 'dhl',
            method: 'standard',
            name: 'DHL Standard',
            price: 16.95,
            deliveryDays: '3-5',
            description: 'Delivered within 3-5 business days',
        },
        {
            id: 'dhl-express',
            carrier: 'dhl',
            method: 'express',
            name: 'DHL Express',
            price: 24.95,
            deliveryDays: '1-2',
            description: 'Delivered within 1-2 business days',
        },
    ],
    FR: [
        {
            id: 'gls-standard',
            carrier: 'gls',
            method: 'standard',
            name: 'GLS Standard',
            price: 16.95,
            deliveryDays: '3-5',
            description: 'Delivered within 3-5 business days',
        },
        {
            id: 'gls-express',
            carrier: 'gls',
            method: 'express',
            name: 'GLS Express',
            price: 24.95,
            deliveryDays: '2-3',
            description: 'Delivered within 2-3 business days',
        },
        {
            id: 'dhl-standard',
            carrier: 'dhl',
            method: 'standard',
            name: 'DHL Standard',
            price: 19.95,
            deliveryDays: '3-5',
            description: 'Delivered within 3-5 business days',
        },
        {
            id: 'dhl-express',
            carrier: 'dhl',
            method: 'express',
            name: 'DHL Express',
            price: 29.95,
            deliveryDays: '1-2',
            description: 'Delivered within 1-2 business days',
        },
    ],
};

// Countries we ship to
const SUPPORTED_COUNTRIES = ['BE', 'NL', 'DE', 'FR', 'LU'];

// Extra cost per additional tire (after the first)
// Reflects the added weight/volume per tire (~10-12kg each)
const EXTRA_TIRE_COST: Record<string, number> = {
    BE: 3.00,
    NL: 4.00,
    LU: 4.00,
    DE: 5.00,
    FR: 6.00,
};

export function getShippingRates(country: string = 'BE', tireCount: number = 1): ShippingRate[] {
    const code = country.toUpperCase();
    if (!SUPPORTED_COUNTRIES.includes(code)) {
        return [];
    }

    const baseRates = COUNTRY_RATES[code] || [];
    const extraTires = Math.max(0, tireCount - 1);
    const extraCost = extraTires * (EXTRA_TIRE_COST[code] || 4.00);

    // Scale non-pickup rates by tire count
    return baseRates.map(rate => {
        if (rate.carrier === 'pickup') return rate;
        return {
            ...rate,
            price: Math.round((rate.price + extraCost) * 100) / 100,
        };
    });
}

export function getShippingRateById(rateId: string, country: string = 'BE', tireCount: number = 1): ShippingRate | undefined {
    const rates = getShippingRates(country, tireCount);
    return rates.find(rate => rate.id === rateId);
}

export function getSupportedCountries() {
    return [
        { code: 'BE', name: 'Belgium' },
        { code: 'NL', name: 'Netherlands' },
        { code: 'DE', name: 'Germany' },
        { code: 'FR', name: 'France' },
        { code: 'LU', name: 'Luxembourg' },
    ];
}

// Generate order number
export function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `AB-${timestamp}-${random}`;
}
