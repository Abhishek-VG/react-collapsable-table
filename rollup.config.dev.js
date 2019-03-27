// Serve bundle
import serve from "rollup-plugin-serve";

// helps in page refresh/broswer refresh when any code change detected
import livereload from "rollup-plugin-livereload";

// Replace strings in files while bundling them.
import replace from "rollup-plugin-replace";

// minifies generated es bundle.
import { terser } from "rollup-plugin-terser";

// injects the bundle into html and runs the code.
import htmlTemplate from "rollup-plugin-generate-html-template";

// copies assets to the output folder
import copy from "rollup-copy-plugin";

import { commonPlugins } from "./rollup.config.common";

export default {
  // entry of rollup
  input: "src/index.js",
  // output of rollup
  output: {
    file: "dev/bundle.js",
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    ...commonPlugins,
    // takes html and injects the bundled script
    htmlTemplate({
      template: "public/index.html",
      target: "dev/index.html"
    }),
    //copies assets to the output folder
    copy({
      "public/favicon.png": "dev/favicon.png"
    }),
    // helps insetting env value which triggers optimization of react code
    replace({
      "process.env.NODE_ENV": JSON.stringify("development")
    }),
    terser({
      sourcemap: true
    }),
    //servers file like webpack-dev-server
    serve({ contentBase: "dev", open: true, port: 8087 }),
    // helps in live reloading
    livereload({ watch: "dev" })
  ]
};
