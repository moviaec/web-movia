import { formatMinorUnits, toDecimalAmount } from './money.utils';

describe('money utils', () => {
	it('turns minor units into a decimal string using the currency exponent', () => {
		expect(toDecimalAmount(3999, 2)).toBe('39.99');
		expect(toDecimalAmount(5, 2)).toBe('0.05');
		expect(toDecimalAmount(0, 2)).toBe('0.00');
		expect(toDecimalAmount(150000, 0)).toBe('150000');
	});

	it('formats a USD amount the way the Ecuadorian page prints it', () => {
		expect(formatMinorUnits(3999, 2, 'USD', 'es-EC')).toBe('$39,99');
	});
});
