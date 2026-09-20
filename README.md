# web-movia

Landing pública de Movía: SPA estática en Angular 22 + Tailwind CSS 4, sin backend.

Las convenciones de código y las reglas del agente viven en `.claude/CLAUDE.md` y `.claude/RULES.md`; el setup del proyecto, en `.claude/SETUP.md`.

## Requisitos

Node `>=22.12.0` (fijado en `.nvmrc`).

```bash
npm install
```

## Servidor de desarrollo

```bash
npm start
```

Abre `http://localhost:4200/`. La aplicación recarga sola al guardar cualquier archivo fuente.

## Comandos

| Comando              | Qué hace                                     |
| -------------------- | -------------------------------------------- |
| `npm start`          | Servidor de desarrollo (`ng serve`)          |
| `npm run build:prod` | Build de producción en `dist/`               |
| `npm run lint`       | ESLint sobre `src/**/*.ts` y `src/**/*.html` |
| `npm run test`       | Tests unitarios con Vitest                   |
| `npm run format`     | Prettier sobre `src/`                        |

## Generar componentes

```bash
ng generate component features/<domain>/<page>
```

Nunca con `--inline-template` ni `--inline-style`: cada componente son archivos hermanos `.ts` + `.html` (`.claude/RULES.md`, regla 19).
