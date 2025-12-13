// Shipping rate configuration
// Using fixed rates initially - can be replaced with real-time carrier API later

export interface ShippingRate {
    id: string;
    carrier: 'pickup' | 'dhl' | 'gls';
    method: 'pickup' | 'standard' | 'express';
    name: string;
    price: number;
    deliveryDays: string;
    description: string;
}

// Fixed shipping rates for Belgium and Netherlands
const SHIPPING_RATES: ShippingRate[] = [
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
];

// Countries we ship to
const SUPPORTED_COUNTRIES = ['BE', 'NL', 'DE', 'FR', 'LU'];

export function getShippingRates(country: string = 'BE'): ShippingRate[] {
    if (!SUPPORTED_COUNTRIES.includes(country.toUpperCase())) {
        return [];
    }

    // For now, return same rates for all supported countries
    // In future, can adjust based on country
    return SHIPPING_RATES;
}

export function getShippingRateById(rateId: string): ShippingRate | undefined {
    return SHIPPING_RATES.find(rate => rate.id === rateId);
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
