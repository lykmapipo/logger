#### isLoggingEnabled() 

check if logging is enabled






##### Examples

```javascript

import { isLoggingEnabled } from '@lykmapipo/logger';
const enabled = isLoggingEnabled();
//=> true
```


##### Returns


- `Boolean`  whether logging is enabled



#### canLog(level) 

check if logging is enabled and logger has log level




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| level | `String`  | valid log level | &nbsp; |




##### Examples

```javascript

import { canLog } from '@lykmapipo/logger';
const can = canLog('error');
//=> true
```


##### Returns


- `Boolean`  whether log level can be logged



#### createWinstonLogger()  *private method*

create winston logger instance






##### Examples

```javascript

import { createWinstonLogger } from '@lykmapipo/logger';
const logger = createWinstonLogger();
//=> DerivedLogger {}
```


##### Returns


- `Object`  A new instance of winston logger



#### createLogger([customLogger])  *private method*

create logger instance if not exists




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| customLogger | `Object`  | custom logger to use | *Optional* |




##### Examples

```javascript

import { createLogger } from '@lykmapipo/logger';
const logger = createLogger();
//=> Logger {}

const logger = createLogger(customLogger);
//=> Logger {}
```


##### Returns


- `Object`  A new instance of of logger



#### disposeLogger() 

reset current logger instance in use






##### Examples

```javascript

import { disposeLogger } from '@lykmapipo/logger';
const logger = disposeLogger();
//=> null
```


##### Returns


- `Void`



#### normalizeLog(log) 

normalize log structure to simple logger-able object




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| log | `Object` `Error`  | valid log object | &nbsp; |




##### Examples

```javascript

import { normalizeLog } from '@lykmapipo/logger';
const log = normalizeLog(log);
//=> { level: 'info', timestamp: '2019-04-10T13:37:35.643Z', ...}

const log = normalizeLog(error);
//=> { level: 'error', timestamp: '2019-04-10T13:37:35.643Z', ...}
```


##### Returns


- `Object`  normalized log object



#### error(log) 

log error




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| log | `Error`  | valid error log | &nbsp; |




##### Examples

```javascript

import { error } from '@lykmapipo/logger';
const log = error(log);
//=> { level: 'error', timestamp: '2019-04-10T13:37:35.643Z', ...}
```


##### Returns


- `Object`  normalized error log object



#### warn(log) 

log warn




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| log | `Object`  | valid warn log | &nbsp; |




##### Examples

```javascript

import { warn } from '@lykmapipo/logger';
const log = warn(log);
//=> { level: 'warn', timestamp: '2019-04-10T13:37:35.643Z', ...}
```


##### Returns


- `Object`  normalized warn log object



#### info(log) 

log info




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| log | `Object`  | valid info log | &nbsp; |




##### Examples

```javascript

import { info } from '@lykmapipo/logger';
const log = info(log);
//=> { level: 'info', timestamp: '2019-04-10T13:37:35.643Z', ...}
```


##### Returns


- `Object`  normalized info log object



#### verbose(log) 

log verbose




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| log | `Object`  | valid verbose log | &nbsp; |




##### Examples

```javascript

import { verbose } from '@lykmapipo/logger';
const log = verbose(log);
//=> { level: 'verbose', timestamp: '2019-04-10T13:37:35.643Z', ...}
```


##### Returns


- `Object`  normalized verbose log object



#### debug(log) 

log debug




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| log | `Object`  | valid debug log | &nbsp; |




##### Examples

```javascript

import { debug } from '@lykmapipo/logger';
const log = debug(log);
//=> { level: 'debug', timestamp: '2019-04-10T13:37:35.643Z', ...}
```


##### Returns


- `Object`  normalized debug log object



#### silly(log) 

log silly




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| log | `Object`  | valid silly log | &nbsp; |




##### Examples

```javascript

import { silly } from '@lykmapipo/logger';
const log = silly(log);
//=> { level: 'silly', timestamp: '2019-04-10T13:37:35.643Z', ...}
```


##### Returns


- `Object`  normalized silly log object



#### stream() 

expose log stream for use with morgan logger






##### Examples

```javascript

import { stream } from '@lykmapipo/logger';
import morgan from 'morgan';

app.use(morgan('combined'), { stream });
//=> { level: 'info', timestamp: '2019-04-10T13:37:35.643Z', ...}
```


##### Returns


- `Object`  normalized stream log object




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
