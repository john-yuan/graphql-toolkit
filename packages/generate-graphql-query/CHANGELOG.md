# Changelog

## 3.0.0-rc.1 (February 5, 2025)

### Breaking changes

#### 1. Fragment definition

The keyword used to specify the type when defining a fragment changes from `$on` to `$onType`.

Old usage:

```ts
// before v3.0.0-rc.1
generateQuery({
  fragments: {
    userFields: {
      $on: 'User',
      id: true,
      name: true
    }
  }
})
```

New usage:

```ts
// >= v3.0.0-rc.1
generateQuery({
  fragments: {
    userFields: {
      $onType: 'User',
      id: true,
      name: true
    }
  }
})
```

#### 2. Using fragments

The keyword `$fragments` has been removed since `v3.0.0-rc.1`. Instead we use the keyword `$on` and `$spread` to use fragments.

Old usage:

```ts
// before v3.0.0-rc.1
generateQuery({
  query: {
    countries: {
      $fragments: [
        { spread: 'countriesFragment' },
        {
          inline: {
            $on: 'Country',
            code: true,
            name: true
          }
        }
      ]
    }
  }
})
```

New usage:

```ts
// >= v3.0.0-rc.1
generateQuery({
  query: {
    countries: {
      $spread: 'countriesFragment',
      $on: {
        Country: {
          code: true,
          name: true
        }
      }
    }
  }
})
```
