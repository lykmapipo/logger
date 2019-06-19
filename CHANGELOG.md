#### 0.3.4 (2019-06-19)

##### Chores

* **deps:**  force latest version & audit fix ([aa575d94](https://github.com/lykmapipo/logger/commit/aa575d94352959b5b8142b4ff3bd6ec04cb7f621))

#### 0.3.3 (2019-06-09)

##### Chores

* **deps:**  force latest version & audit fix ([d997f044](https://github.com/lykmapipo/logger/commit/d997f044ea56d346083b0b04b47a12867ddded3d))

#### 0.3.2 (2019-05-20)

##### Chores

* **deps:**  force latest version & audit fix ([9f929152](https://github.com/lykmapipo/logger/commit/9f9291528292be0e5640f89cab8c02c8bedc6a48))

#### 0.3.1 (2019-05-12)

##### Chores

* **deps:**
  *  force latest version & audit fix ([5cb3ca69](https://github.com/lykmapipo/logger/commit/5cb3ca69ac5f294d8553c27002ec51ce736ac74f))
  *  force latest versions & audif fix ([38900947](https://github.com/lykmapipo/logger/commit/389009471dae881ae17081cdbb6103030600a66b))

#### 0.3.0 (2019-05-02)

##### New Features

* **morgan:**  add morgan stream for express logging ([490426c5](https://github.com/lykmapipo/logger/commit/490426c517f28f22cd0b5022d139af8e27a96c23))
*  add ignored fields on logs ([4553f5a1](https://github.com/lykmapipo/logger/commit/4553f5a1e10d06906f077ba4b609f7d5d424d0bc))

##### Bug Fixes

* **morgan:**  trim message before log ([40d09ac0](https://github.com/lykmapipo/logger/commit/40d09ac082ddfd9da663c08127673708aee6d3ef))

#### 0.2.2 (2019-04-30)

##### Chores

* **.npmrc:**  prevent npm version to commit and tag version ([09858a09](https://github.com/lykmapipo/logger/commit/09858a09b0cd778ec173d93f69d755827d897f24))
* **deps:**  force latest version & audit fix ([9afaba82](https://github.com/lykmapipo/logger/commit/9afaba82e2f2bb5365916575c87510205cd3597d))

#### 0.2.1 (2019-04-14)

##### Chores

*  force latest dependencies ([64b38c4f](https://github.com/lykmapipo/logger/commit/64b38c4f3854481a34e56a7f88b5f69bc6a111cd))

#### 0.2.0 (2019-04-10)

##### New Features

*  use custom format with metadata ([1104681c](https://github.com/lykmapipo/logger/commit/1104681c798f9f352b483c7e2fb25907e4e2f727))

#### 0.1.0 (2019-04-10)

##### Chores

*  remove unused dependencies ([c40436de](https://github.com/lykmapipo/logger/commit/c40436dee7987b75057054ec473d40b99cc9f558))
*  initialize & setup ([637de623](https://github.com/lykmapipo/logger/commit/637de623a6c538659c5d54cbd0534222dbfd517c))

##### Documentation Changes

*  improve usage docs ([d446cc47](https://github.com/lykmapipo/logger/commit/d446cc47f0591e11834f2d094b7e156676df271a))
*  update usage ([a4eec48e](https://github.com/lykmapipo/logger/commit/a4eec48ecc8a9fd94c5057c416e1d22a1d6635a6))

##### New Features

*  wire console & daily file rotator transports ([409c0f68](https://github.com/lykmapipo/logger/commit/409c0f6800d58ec5f7324245490e05debc39a800))
*  add silly log utility ([68bf4f8d](https://github.com/lykmapipo/logger/commit/68bf4f8d06cc67e17cea7853d0a3497a35949ae2))
*  add debug log utility ([eb15e892](https://github.com/lykmapipo/logger/commit/eb15e892101bd03c150c8638983301314002d7e4))
*  add verbose log utility ([4434842d](https://github.com/lykmapipo/logger/commit/4434842d109588e2a83e9792389b2273fd78340e))
*  add info log utility ([430425ee](https://github.com/lykmapipo/logger/commit/430425ee51dc2f81f36932d192d29ed2bdd6e8a2))
*  add warn log utility ([52421f51](https://github.com/lykmapipo/logger/commit/52421f516f5631e9708a6d12b13be74f76bca990))
*  ensure error log level on logging error ([39e4df94](https://github.com/lykmapipo/logger/commit/39e4df9428da7f5c3d73f585aafcf741f95ad638))
*  add error log utility ([4a192da6](https://github.com/lykmapipo/logger/commit/4a192da66b97a2552d572c5833603ea7a31ce86a))
*  add log normalizer ([78558848](https://github.com/lykmapipo/logger/commit/78558848d20b61e9c95db77674820b2bed0ce76a))
*  add helper to check if logging is enabled ([9e43e684](https://github.com/lykmapipo/logger/commit/9e43e68459446a9663fb4a94ef4db38482cabc9a))
*  add createLogger and disposeLogger utilities ([553b7758](https://github.com/lykmapipo/logger/commit/553b775801ae8cee6ab896e5e581b1d8603be3b3))

##### Refactors

*  drop generic log helper ([6ff8496d](https://github.com/lykmapipo/logger/commit/6ff8496d5c70e6a5996219933984e024b76de7c6))
*  check for log level on logger ([85677608](https://github.com/lykmapipo/logger/commit/85677608a7579042d6031aa230ba04e72169a047))
*  add create winston logger factory ([18f9d3a0](https://github.com/lykmapipo/logger/commit/18f9d3a089aa4503d2a74169722794f5205c1e97))
*  extract logger log level to env variable ([c4228069](https://github.com/lykmapipo/logger/commit/c4228069a30e02d8da34d302963054616084e3d9))
*  improve jsdoc & test vars ([9b0bab49](https://github.com/lykmapipo/logger/commit/9b0bab49e1c040130e109068c6b074172024051d))

##### Code Style Changes

*  fix typos ([27629a75](https://github.com/lykmapipo/logger/commit/27629a75764d019e4549edbdef1b3cf346e14b34))
*  remove import on alternative examples ([846a2945](https://github.com/lykmapipo/logger/commit/846a2945701fa4fc08d15574affe24687226e2fb))
*  fix example identations ([04695251](https://github.com/lykmapipo/logger/commit/0469525120099876d9922ec4329a579f56b45378))
*  fix typos & arrangement ([8d408976](https://github.com/lykmapipo/logger/commit/8d40897673013162459f7231da67b0fffcf9cda5))

##### Tests

*  setup test env ([6e3c6578](https://github.com/lykmapipo/logger/commit/6e3c6578a8b9212fff28d8909276012f60f760ea))

