'use client';

/**
 * Displays a price with the decimal part superscripted and smaller.
 * e.g. €79.99 → €79⁹⁹
 */
export default function Price({
    amount,
    className = '',
    size = 'base',
}: {
    amount: number;
    className?: string;
    size?: 'sm' | 'base' | 'lg' | 'xl';
}) {
    const formatted = amount.toFixed(2);
    const [whole, decimal] = formatted.split('.');

    const sizeStyles = {
        sm: { whole: 'text-sm', decimal: 'text-[9px]', symbol: 'text-sm' },
        base: { whole: 'text-base', decimal: 'text-[10px]', symbol: 'text-base' },
        lg: { whole: 'text-xl', decimal: 'text-xs', symbol: 'text-xl' },
        xl: { whole: 'text-3xl', decimal: 'text-sm', symbol: 'text-3xl' },
    };

    const s = sizeStyles[size];

    return (
        <span className={`inline-flex items-baseline font-bold ${className}`}>
            <span className={s.symbol}>€</span>
            <span className={s.whole}>{whole}</span>
            <span className={`${s.decimal} font-semibold -translate-y-[40%] ml-[1px]`}>{decimal}</span>
        </span>
    );
}
