## Install

> npm install @jaocer/hoster

## Usage

use config like this

```js
const config = {
    "127.0.0.1": [
        "localhost",
        "www.google.com"
    ],
    "127.0.0.2":[
        "www.youtube.com"
    ]
}
```

and you can set 

```js
hoster(config,callback)
// it is same 
hoster(config, true, callback)
```

or unset domain

```js
hoster(config, false, callback)
```
