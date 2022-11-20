
# Bucket List React App

## Summarised file structure
This is a summarised version, not all files are shown below.
```
├── .github
│   └── workflows
│       ├── npm_test_workflow.yaml
│       └── prettier_workflow.yaml
├── public
│   ├── default192.png
│   ├── index.html
├── src
│   ├── auth
│   ├── axios
│   ├── components
│   ├── images
│   ├── pages
│   ├── styles
│   ├── tests
│   │   ├── __snapshots__
│   ├── themes
│   ├── validation
│   ├── App.js
│   ├── Globals.js
│   ├── index.js
├── .env
├── package.json
```

 - **.github**
	 - Automated tests run on push to github repo
 - **public**
	- Logos and icons for browser
	- Index.html - template that html is inserted into
	- Other information used by the browser
 - **src**
	-  The react source code
	- **auth**: frontend authentication functionality
	- **axios**: instance for sending fetch requests to the backend
	- **components**: abstracted react UI components used throughout the site
	- **image**: local images used by website
	- **pages**: all react pages
	- **style**: css style files used by all react elements
	- **tests**: jest unit tests
		- **\_\_snapshots__**: snapshots for tests to compare against
	- **themes**: theme information and functionality
	- **validation**: form validation functionality
	- **App.js**: the app element that is rendered
	- **Globals.js**: globally used information
	- **index**: entry point of the react app
 -  **.env**: environment variables 
	- ***(Not in repo, must be configured manually)***
- **package.json**: dependencies and scripts

## Getting started
### Required dependencies:

 - node: https://nodejs.org/en/
 - node package manager: https://www.npmjs.com/
### Installing other dependencies:
 - The other dependencies are defined in `package.json` and `package-lock.json`
 - To install them run `npm install` in terminal

### Configuring environment variables:

 - Create .env file at root of folder
 - Put the following in the .env file (replacing information between the <> with your relevant information):
  ```
 REACT_APP_BACKEND_URL=<backendUrl>
REACT_APP_MAPS_API_KEY=<APIkey>
 ```
 
 - Where:
	 - backendUrl: is the url where the backend is being hosted *(note that the backend url should be the subdomain of the reverse proxy. See backend README for more details)*
	 - APIkey: is the key obtained from google API https://developers.google.com/maps


Alternatively, configure this through your host/deployment provider

## Available Scripts
In the project directory, you can run:
  

### `npm start`


Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

  

The page will reload when you make changes.

You may also see any lint errors in the console.

  

### `npm test`

  

Launches the test runner in the interactive watch mode.

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

  ### `npx prettier --write .`
  Runs prettier code formatting on all files that aren't being ignored.

### `npm run build`

  

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

  

The build is minified and the filenames include the hashes.

Your app is ready to be deployed!

  

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

  

### `npm run eject`

  

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

  

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

  

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

  

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

  

## Learn More

  

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

  

To learn React, check out the [React documentation](https://reactjs.org/).