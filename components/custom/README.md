# Custom components

Ready-made components copied from [theme-kit](https://github.com/sinanptm/theme-kit). They are built on the shadcn/Radix primitives in `components/ui/` and use the Nordic theme colours automatically.

**Check this list before building any new UI.** Use these components first and only build something new when nothing here fits.

## Importing

`~/` is a shortcut for `components/custom/`. Every component is a default export.

```tsx
import CustomInput from "~/form-elements/CustomInput";
import ConfirmationDialog from "~/ConfirmationDialog";
```

All of them are client components (`"use client"`), so they can be used straight from Server Components.

## Already set up in `app/layout.tsx`

| Provider | Needed by |
|---|---|
| `ThemeProvider` (next-themes, `class` strategy) | Dark mode, `Toaster` |
| `NuqsAdapter` | `CustomPagination` (keeps `?page=` and `?pageSize=` in the URL) |
| `<Toaster />` (sonner) | `CopyButton`, or any `toast()` call |

A page that uses `CustomPagination` must wrap it in `<Suspense>`, because it reads the URL search params.

---

## Form fields (`~/form-elements/*`)

Every form field shares the props from `BaseFormFieldProps` (`types/custom.ts`):

| Prop | What it does |
|---|---|
| `label` | Label above the field |
| `required` | Shows a `*` next to the label |
| `hint`, `showHint`, `hintclass` | Small hint text |
| `description` | Helper text below the field |
| `error` | Error message (also styles the field as invalid) |
| `disabled` | Disables the field |
| `className` | Classes for the field |
| `wrapperClass` | Classes for the wrapper |

| Component | Use it for | Key props |
|---|---|---|
| `CustomInput` | Text, email, number, password (has a show/hide eye button) | All `<input>` props |
| `CustomTextArea` | Multi-line text | All `<textarea>` props, `resize` |
| `CustomSelect` | Dropdown | `options` (`string[]` or `{ value, label, disabled? }[]`), `name` (for form submits), `value` / `defaultValue`, `onValueChange`, `placeholder`, `icon`, `creatable`, `onCreateOption`, `maxHeight` |
| `MultipleSelector` | Multi-select with search and tags | `options`, `value` / `defaultOptions`, `onChange(Option[])`, `onValueChange(string[])`, `maxSelected`, `groupBy`, `creatable`, `onSearch` (async), `searchable` |
| `CustomCheckbox` | One checkbox | `checked` / `defaultChecked`, `onCheckedChange` |
| `CustomSwitch` | On/off toggle | `checked` / `defaultChecked`, `onCheckedChange` |
| `CustomRadioGroup` | Pick one option | `options` (`{ value, label, description?, disabled? }[]`), `value` / `defaultValue`, `onValueChange`, `orientation` |
| `CustomDatePicker` | Date, or date + time | `value` / `defaultValue`, `onSelect`, `placeholder`, `startMonth`, `endMonth`, `disabledDates`, `includeTime`, `minuteStep` |
| `CustomFileInput` | File upload with preview | `maxSize` (MB), `allowedTypes`, `showPreview`, plus `<input>` props |
| `SubmitButton` | Form submit button with a spinner | `isLoading`, plus all `Button` props |
| `FormFieldWrapper` | Wrapping your own control in the same label/error layout | `children: (id, describedBy) => ReactNode` |

```tsx
<CustomInput label="Email" type="email" required error={errors.email} />
<CustomSelect label="Size" options={["S", "M", "L"]} onValueChange={setSize} />
<SubmitButton isLoading={pending}>Save</SubmitButton>
```

## Other components (`~/*`)

| Component | Use it for | Key props |
|---|---|---|
| `ConfirmationDialog` | "Are you sure?" popups | `isOpen`, `onClose`, `onConfirm(reason?)`, `title`, `description`, `confirmText`, `cancelText`, `confirmVariant`, `loading`, `requireReason` |
| `CopyButton` | Copy text with a tooltip and a toast | `text`, `successMessage`, `variant`, `size`, `copiedDuration` |
| `CustomBreadcrumb` | Breadcrumbs that collapse into a dropdown when long | `items` (`{ label, href?, isCurrentPage? }[]`), `isLoading`, `collapseAt`, `currentClassName` |
| `CustomPagination` | Page numbers plus a page-size picker, stored in the URL | `totalPages`, `paginationItemsToDisplay`, `pageSizeOptions`, `showPageInfo`, `showPageSizeSelector` |
| `CustomSearchInput` | Search box | `variant` (`"debounced"` or `"submit"`), `onSearch`, `onClear`, `debounceMs` |
| `LoadingOverlay` | Full-screen loading spinner | `isLoading` |
| `TooltipWrapper` | Adding a tooltip to anything | `content`, `duration` (delay in ms), `onClick` |
| `CustomTable` | Not built yet (a placeholder in theme-kit) | — |

```tsx
<ConfirmationDialog
  isOpen={open}
  onClose={() => setOpen(false)}
  onConfirm={removeItem}
  title="Remove item?"
  confirmVariant="destructive"
/>
```

## Related hooks

- `@/hooks/pagination/usePaginationState`: reads and sets `page` and `pageSize` in the URL (via nuqs). Use the same values when fetching data.
- `@/hooks/pagination/usePagination`: works out which page numbers and ellipses to show.
- `@/hooks/useIsMobile`: `true` below 768px.

## Button variants

`components/ui/button.tsx` comes from theme-kit and adds two extra variants, `success` and `warning`, plus a `preventDefault` prop. The `ButtonVariants` type is exported for props like `confirmVariant`.
