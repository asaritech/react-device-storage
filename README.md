# react-device-storage

An unified package for saving, reading and deleting data from/to sessionStorage, localStorage or cookies.
If user's device doesn't support sessionStorage and/or localStorage, the package uses cookies as a fallback.
Note it's designed for browsers only.

## Installation

`npm install --save react-device-storage`

## API

### cookies()

Enables using of cookies.

Returns `this`, so you can manipulate with data directly.

### localStorage()

Enables using of localStorage.

Returns `this`, so you can manipulate with data directly.

### sessionStorage()

Enables using of sessionStorage.

Returns `this`, so you can manipulate with data directly.

### save(key, value)

Saves data in selected storage. `key` should be a 'string', value may be whatever you want to store.

### read(key)

Reads data from selected storage.

### delete(key)

Deletes data from selected storage.

## Options

### cookieFallback
> Enable or disable cookies fallback **(boolean)**

### cookie
> Object of settings for cookies

#### cookie.path
> Cookie path<br />
> Use `/` as the path if you want your cookie to be accessible on all pages.<br />
> [default `/`]

#### cookie.maxAge
> Relative max age of the cookie from when the client receives it **(seconds)**
> [default `2592000` (30 days)]

#### cookie.domain
> Domain for the cookie<br />
> Use `https://*.yourdomain.com` if you want to access the cookie in all your subdomains.

#### cookie.secure
> Is only accessible through HTTPS? **(boolean)**

## Example

```js
import { Component } from 'react';
import DeviceStorage from 'react-device-storage';

import HelloWorld from './HelloWorld';

export default class MyApp extends Component {
  construct(props) {
    super(props);

    this.storage = new DeviceStorage({
      cookieFallback: true,
      cookie: {
        secure: true
      }
    }).localStorage();

    this.state = {
      name: this.storage.read('name')
    };
  }

  setName() {
    let name = 'User Name';

    this.storage.save('name', name);
    this.setState({
      name
    });
  }

  render() {
    return (
      <HelloWorld userName={this.state.name} onClick={this.setName.bind(this)} />
    );
  }
}
```

## Inspired by

- [react-cookie](https://www.npmjs.com/package/react-cookie)
- [react-localstorage](https://www.npmjs.com/package/react-localstorage)

## License

This code is released under the MIT license. Please see [LICENSE](https://github.com/asaritech/react-device-storage/blob/master/LICENSE) file for details.

## Contact

Reporting of any [issues](https://github.com/asaritech/react-device-storage/issues) are appreciated.

## Our projects

- Social Identity & Login Aggregator: [Ukey1](http://ukey.one)
- Ukey1 SDK for React: [ukey1-react-sdk](https://github.com/asaritech/ukey1-react-sdk/)
