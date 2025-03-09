const NUMBER_FORMAT: Intl.NumberFormatOptions = {
  notation: 'compact',
  compactDisplay: 'short',
  style: 'decimal',
  currency: undefined,
};

const DEFAULT_CURRENCY = 'USD';

const CURRENCY_FORMAT: Intl.NumberFormatOptions = {
  notation: 'compact',
  compactDisplay: 'short',
  style: 'currency',
  currency: DEFAULT_CURRENCY,
};

export function formatNumber(num?: number) {
  if (!num) {
    return;
  }

  return format(num, NUMBER_FORMAT);
}

export function formatCurrency(num?: number) {
  if (!num) {
    return;
  }
  return format(num, CURRENCY_FORMAT);
}

function format(num: number, formatOptions: Intl.NumberFormatOptions) {
  const formatter = new Intl.NumberFormat('en-US', formatOptions);
  return formatter.format(num);
}
