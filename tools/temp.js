const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const { promisify } = require('util');
const write = promisify(fs.writeFile);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const MODULE = process.argv[2] || '';

if (!MODULE) {
  console.log(
    'Module name is required, please use cli like ` npm run temp xxx `'
  );
  return;
}

const IMGPATH = path.join(__dirname, '../', '/src/assets/images/', MODULE);
const TEMPPATH = path.join(__dirname, '../', 'temp');
const COMNAME = MODULE.charAt(0).toUpperCase() + MODULE.slice(1);
const COMPATH = path.join(TEMPPATH, COMNAME);

const getjsCont = cont => {
  return `import React, { Component, Fragment } from 'react';
import styles from './${COMNAME}.module.css';

class ${COMNAME} extends Component {
  render() {
    return (
      <Fragment>
${cont}
      </Fragment>
    );
  }
}

export default ${COMNAME};
`;
};

const genCont = () => {
  const files = fs.readdirSync(IMGPATH);
  let css = '';
  let js = '';
  files.forEach((file, index) => {
    const filePath = path.join(IMGPATH, file);
    const name = file.split('.')[0];
    const dimensions = sizeOf(filePath);
    const { width, height } = dimensions;
    const cssCont = `.${name} {
  width: ${width}px;
  height: ${height}px;
  background: url('../assets/images/${MODULE}/${file}') center/contain no-repeat;
  position:absolute;
}\n`;
    css += cssCont;
    if (index === files.length - 1) {
      js += `\t\t\t\t<section className={styles.${name}} />`;
      return;
    }
    js += `\t\t\t\t<section className={styles.${name}} />\n`;
  });
  return { css, js: getjsCont(js) };
};

(async () => {
  await stat(TEMPPATH).catch(() => {
    mkdir(TEMPPATH);
  });
  await stat(COMPATH).catch(() => {
    mkdir(COMPATH);
  });
  const { css, js } = genCont();

  await write(path.join(COMPATH, `${COMNAME}.module.css`), css);
  await write(path.join(COMPATH, `${COMNAME}.js`), js);
})();
