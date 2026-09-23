/**
 * Turns an amount in the minor unit of its currency into its decimal value, as text.
 *
 * It works on the currency's own number of decimals and never assumes two: `3999`
 * with exponent 2 is `'39.99'`, and `3999` with exponent 0 (COP) is `'3999'`. Text
 * and not a `number` because this is what schema.org reads, and a float would
 * print `39.989999…` for some amounts.
 *
 * @param amount Amount in the minor unit (`3999`).
 * @param exponent Decimals of the currency (`2` for USD).
 * @returns The amount as a decimal string with a dot (`'39.99'`).
 */
export function toDecimalAmount(amount: number, exponent: number): string {
	if (exponent === 0) return String(amount);

	const digits = String(Math.abs(amount)).padStart(exponent + 1, '0');
	const sign = amount < 0 ? '-' : '';

	return `${sign}${digits.slice(0, -exponent)}.${digits.slice(-exponent)}`;
}

/**
 * Formats an amount in the minor unit of its currency the way the page prints it.
 *
 * @param amount Amount in the minor unit (`3999`).
 * @param exponent Decimals of the currency (`2` for USD).
 * @param currencyCode ISO 4217 code (`USD`).
 * @param locale Locale to format with (`es-EC` prints `$39,99`).
 * @returns The formatted price, currency symbol included.
 */
export function formatMinorUnits(amount: number, exponent: number, currencyCode: string, locale: string): string {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: currencyCode,
		minimumFractionDigits: exponent,
		maximumFractionDigits: exponent
	}).format(Number(toDecimalAmount(amount, exponent)));
}
