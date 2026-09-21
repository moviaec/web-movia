/**
 * Any value that can appear inside a JSON-LD document.
 *
 * It is written out instead of using `unknown` or `object` because the whole point is
 * that the structured data has to SERIALISE: `JSON.stringify` of anything that fits
 * this type is valid JSON, and anything that does not fit —a `Date`, a function, a
 * signal— would not be. `any` is banned in this project and would not have said this.
 */
export type JsonLdValue = string | number | boolean | null | readonly JsonLdValue[] | { readonly [key: string]: JsonLdValue };

/**
 * One structured data block, the object that goes inside a `<script type="application/ld+json">`.
 *
 * `Record` y no una firma de índice escrita a mano porque lo exige el lint
 * (`consistent-indexed-object-style`), y `type` y no `interface` porque este archivo es
 * un `.type.ts` y solo contiene tipos (`RULES.md` regla 21). `JsonLdValue`, en cambio,
 * SÍ lleva la firma de índice: con `Record` TypeScript no puede resolver la recursión y
 * responde TS2456, «el alias se referencia a sí mismo». El lint no la marca ahí porque
 * es un miembro de una unión y no el cuerpo entero del alias.
 */
export type JsonLdNode = Readonly<Record<string, JsonLdValue>>;
