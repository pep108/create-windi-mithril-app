### Installation

```
yarn
```

### Start Dev Server
```
yarn start
```

### Build Prod Version

```
yarn build

yarn preview
```

### Deployment

Edit the config in gulpfile.js. Then you can run:

```
yarn deploy-dev
```
or
```
yarn deploy-prod
```

### Using the Form

See /src/views/Login/LoginForm.jsx for a complete example.

### Using the InputField

Ensure that you pass formi to the InputField to take advantage of default value, input & error behavior. To override the default behavior, just pass in your own value, oninput or error attributes or omit the formi attribute all together.
```
<InputField
  formi={formi}
  label='Email'
  name='email'
  placeholder='jake@example.com'
  type='email'
/>
```

### Features:

* Rendering & Routing via [mithril](https://mithril.js.org)
* ES6 Support via [babel](https://babeljs.io/) (v7)
* Utility CSS via [windicss](https://windicss.org/)
* Form Support via [powerform](https://github.com/ludbek/powerform), custom Formi wrapper and reusable form components
* Lightening Fast Build via [vitejs](https://vitejs.dev/)
* Beautiful Icons via [feather](https://feathericons.com/)
* AWS Deployment via [gulp](https://gulpjs.com/)
* Linting via [standardJS](https://standardjs.com)
* Light and Dark modes

