# Use Pino with Google Cloud Logging

This package provides a [simple configuration][] to use with [Pino][] to make it
adhere to Google Cloud Logging [structured logging][].

[simple configuration]: src/main.ts
[pino]: https://github.com/pinojs/pino
[structured logging]: https://cloud.google.com/logging/docs/structured-logging

## Quickstart

```bash
yarn add pino-cloud-logging
```

When you initialize your Pino logging instance, you'll use our `gcpLogOptions`.

```typescript
import Pino from 'pino';
import { gcpLogOptions } from 'pino-cloud-logging';

const logger = Pino(gcpLogOptions());

logger.info('Hello 👋');
```

You can extend the configuration provided by this package like this:

```typescript
gcpLogOptions({
  level: 'INFO',
  // Options can be found here:
  // https://github.com/pinojs/pino/blob/master/docs/api.md#options
});
```

You can also provide some of the default context like this:

```typescript
gcpLogOptions(
  {
    /* ... */
  },
  { serviceName: 'hello-world', version: '2020-01-01' },
);
```

If you want to provide `insertId` (or any other runtime data), you can add those
with the `mixin` function.

```typescript
gcpLogOptions(
  {
    /* ... */
  },
  { mixin: () => ({ insertId: randomUUID() }) },
);
```

Or even provide context from OpenTelemetry.

```typescript
import { context, getSpan } from '@opentelemetry/api';
gcpLogOptions(
  {
    /* ... */
  },
  { mixin: () => getSpan(context.active())?.context() ?? {} },
);
```
