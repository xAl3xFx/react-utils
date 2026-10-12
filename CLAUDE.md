# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`@xal3xfx/react-utils` — a React library of Formik + PrimeReact (v10) form helpers, published to npm. React, PrimeReact, Formik, moment-timezone and yup are **peer dependencies**. Package manager is Bun; the toolchain is `tsdx` 2.0 (wraps bunchee for builds, vitest for tests, oxlint/oxfmt). Output is dual ESM/CJS in `dist/`.

## Commands

```bash
bun install
bun run dev            # tsdx dev (watch build)
bun run build          # tsdx build -> dist/
bun run test           # vitest (jsdom, globals; picks up test/**/*.test.{ts,tsx})
bunx vitest run test/index.test.tsx -t "name"   # single file / test
bun run lint | typecheck | format | format:check
```

CI (`.github/workflows`) runs lint → typecheck → test → build.

`example/` is a separate Vite app (own `package.json`, `cd example && bun install && bun run dev`) for trying components manually; it is not part of the published package.

## Architecture

Public API is whatever `src/index.tsx` re-exports: `UtilService`, `DynamicForm`, and the field prop types. Two generations of form helpers coexist:

- **`src/dynamicForm/DynamicForm.tsx` (current)** — a compound-component object `DynamicForm.{Root, InputText, Dropdown, Calendar, Number, MultiSelect, Password, FormButtons, Array, useDynamicForm}`. `Root` calls `useFormik` and provides the result through both Formik's `FormikProvider` and our own `DynamicFormContext` (`src/context/DynamicFormContext.tsx`); fields read formik state via `useDynamicForm()`, which throws outside a `Root`. All fields render through `FieldWrapper` (label + touched/error message). Field prop types are `CustomFieldProps & <PrimeReact props>`. To add a field, add a `*Comp`, register it in the `DynamicForm` export object, and export its prop type from `src/index.tsx`.
- **`src/util-service.tsx` (`UtilService`)** — older static-class helper API (`fieldUtils(formik)` returns field-rendering helpers, dropdown option generators, global config via `setLocale`/`setIntlFormatter`/`setOptionValue`/`setOptionLabel`/`setPrimeflexVersion`). It holds global static state that affects rendering.
- **`src/deprecated/`** — `DynamicForm_deprecated` / `DynamicFieldset_deprecated`; kept for compatibility, not exported from the index. Don't extend.

Note: `FieldWrapper` looks up errors with `formik.touched[name]` / `formik.errors[name]` directly, so nested/array field names (e.g. `items.0.name`) are not resolved via lodash-style paths there.

## Gotchas

- `test/index.test.tsx` is leftover tsdx template (imports a nonexistent `Thing` from `../src`) and will fail until replaced.
- The README is also the generic tsdx template and doesn't describe this library.
- The repo uses 4-space indentation in `src/`; match the surrounding file.
