
# Hooked App

Application Template for [Thin Hook Preprocessor](https://github.com/t2ym/thin-hook)


## Table of Contents

- [Hooked App](#hooked-app)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
  - [Customization \& Configuration](#customization--configuration)
    - [Switch to the Lit app](#switch-to-the-lit-app)
    - [Change the app hostname](#change-the-app-hostname)
    - [Change the app version](#change-the-app-version)
  - [Notes](#notes)
  - [License](#license)

## Features

- App Template for [Thin Hook Preprocessor](https://github.com/t2ym/thin-hook)
- Apps
  - React app in TypeScript (default)
  - Lit app in TypeScript

## Getting Started

1. Prerequisites

- Linux OS (Ubuntu recommended)
- Node.js
- Google Chrome for Linux
- openssl
- nginx (for test)

2. Clone the Repo

```sh
git clone https://github.com/t2ym/hooked-app

```

3. Install Dependencies

```sh
cd hooked-app
npm run preinstall # download the thin-hook package via npm pack
npm install 
npm install # optional dependencies
```

4. Install Certificates

Optionally, you can copy trusted certificates for an existing thin-hook project to `keys/demoCA/` instead of generating and installing them

```sh
npm run build:monitor # build the monitor mode server
# Input an empty password for the generated client certificate

google-chrome &
# Navigate to chrome://settings/certificates
# Import the generated demo root CA
#   hooked-app/keys/demoCA/demoCA.crt 
# at Authorities tab in Manage Certificates pane
# Import the generated client certificate 
#   hooked-app/keys/demoCA/client.pfx 
# at Your certificates tab in Manage Certificates pane

npm run start:monitor # start the monitor mode server
# Open https://localhost:8080/ and 
# Check if the certificate for the site is trusted
# Ctrl-C to shutdown the monitor server
```

5. Test

```sh
# Start the monitor mode server
npm run start:monitor
```
- In another terminal
```sh
npm run test:browser
# Chrome browser opens
# Click ▶ to start the test
# Close the browser to quit the test:browser script
```
```sh
# Non-interactive test
npm test
```

6. Build

```sh
npm run build
```

7. Start the Server

```sh
npm run start
```

8. Open the App

```sh
google-chrome https://localhost:8080/ &
```

9. Open the empty skeleton of Validation Console

```sh
google-chrome https://localhost:8082/ &
# Select the client certificate
```

## Customization & Configuration

### Switch to the Lit app
- Change the value of `this.path.raw` as `raw-lit` by setting the array index from `1` to `0`

### Change the app hostname
- Set the environment variable `SERVER_HOST` as the server hostname

### Change the app version
- Update the value of `this["generate-version"].version`, or
- Select the version generation scheme at `this["generate-version"].schema`

## Notes
- The example modular access policies at `config/policy/` are still experimental
  - Monolithic policies are recommended
- The libraries at `compat-lib` are old and have to be updated

## License

[BSD-2-Clause](LICENSE.md)
