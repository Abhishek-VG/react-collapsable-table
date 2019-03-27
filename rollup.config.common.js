// helps in importing json
import json from "rollup-plugin-json";

// helps in resolving node modules
import resolve from "rollup-plugin-node-resolve";

// for babel configuration
import babel from "rollup-plugin-babel";

// converts cjs to es
import commonjs from "rollup-plugin-commonjs";

// this will insert the styles into style tag in html
import postcss from "rollup-plugin-postcss";

// emits image files which are in form of data url
import url from "rollup-plugin-url";

// helps in importing image files
import image from "rollup-plugin-img";

export const commonPlugins = [
  // resolves the modules
  resolve(),
  // helps in importing json files
  json(),
  // helps in importing image/svg files
  url({
    limit: 1, // inline files < 10k, copy files > 10k
    include: ["**/*.svg"], // defaults to .svg, .png, .jpg and .gif files
    emitFiles: true // defaults to true,
  }),
  /**
   * imports image into the bundle as data url
   * if size in below mentioned limit, else will
   * emit the file outside
   */
  image({
    limit: 10000,
    output: "dist"
  }),
  // injects css into html
  postcss({
    extensions: [".css"]
  }),
  // helps in configuring babel into the project
  babel({
    exclude: "node_modules/**"
  }),
  // helps in converting commonjs to es
  commonjs(),
];
