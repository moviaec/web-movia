/**
 * What a toast is saying, which is what picks its colours.
 *
 * Only the two cases a toast is for: something went through, or it did not. A
 * neutral notice is not a toast — it has no reason to disappear on its own.
 */
export type ToastTone = 'success' | 'error';
