/**
 * State of a form that sends data out.
 *
 * `idle` before anything happens, `sending` while the request is in flight (the
 * submit button stays disabled), and then `success` or `error`, which is what
 * the inline feedback reads.
 */
export type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';
