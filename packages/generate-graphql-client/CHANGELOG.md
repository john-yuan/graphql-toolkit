# Changelog

## 2.2.0 (January 9, 2025)

### Features

- Use `as const` to define the operation type in the generated typescript file.
- Add `factoryName` option to specify the generated factory function name.

## 2.1.0 (August 26, 2024)

### Features

- Add `skipTypename` option to skip the `__typename` field.
- Add `markTypenameAsOptional` option to mark the `__typename` field as optional.

## 2.0.1 (August 26, 2024)

### Bugfix

- Mark `__typename` as non-null.

## 2.0.0 (August 23, 2024)

### Breaking Changes

- **Nullable Type Handling**: Introduced `null` union for types that are nullable.
  - **Old Behavior**:
    - Nullable properties were generated as `{ name?: TypeName }`.
    - Arrays of nullable elements were generated as `ElementType[]`.
    - The return type of nullable types was generated as `ReturnType`.
  - **New Behavior**:
    - Nullable properties are now generated as `{ name?: TypeName | null }`.
    - Arrays of nullable elements are now generated as `(ElementType | null)[]`.
    - The return type of nullable types is now generated as `ReturnType | null`.
  - **Migration**: Ensure all uses of the generated nullable types are null-checked.
