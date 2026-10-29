<div align="center">

  <h1>@owdproject/angular</h1>

  <p>
    <strong>Official Angular 17+ Adapter for Open Web Desktop.</strong><br /><br />
    Injectable <code>DesktopAdapterService</code> and RxJS-compatible observable<br />
    streams powered by <code>@owdproject/core</code>.
  </p>

  <br />

  <p>
    <a href="https://npmjs.com/package/@owdproject/angular"><img src="https://img.shields.io/npm/v/@owdproject/angular/alpha.svg?style=flat&colorA=020420&colorB=00DC82" alt="npm version" /></a>
    <a href="https://angular.dev"><img src="https://img.shields.io/badge/Angular-020420?logo=angular" alt="Angular" /></a>
    <a href="https://github.com/owdproject/core/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-00DC82.svg?style=flat&colorA=020420&colorB=00DC82" alt="License" /></a>
  </p>

</div>

---

## Overview

`@owdproject/angular` (`4.0.0-alpha.0`) provides `DesktopAdapterService` and `WindowManagerAdapterService` with RxJS-compatible `SubscribableStream` observables (`asStream()`, `windowAsStream()`) and W3C Pointer drag/resize helpers for Angular 17+ standalone components.

---

## Quick Start

```bash
pnpm add @owdproject/core@4.0.0-alpha.0 @owdproject/angular@4.0.0-alpha.0
```

```ts
import { DesktopAdapterService } from '@owdproject/angular'

const desktopService = new DesktopAdapterService()
desktopService.asStream().subscribe((snapshot) => {
  console.log('Open windows:', snapshot.windows.length)
})
```

---

## License

[MIT](https://opensource.org/licenses/MIT)
