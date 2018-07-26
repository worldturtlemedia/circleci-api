import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import camelCase from "lodash.camelcase";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";
import builtins from "rollup-plugin-node-builtins";
import nodeGlobals from "rollup-plugin-node-globals";

const pkg = require("./package.json");

const libraryName = pkg.name;

const browserPlugins = [
  resolve({ browser: true }),
  commonjs(),
  json(),
  nodeGlobals(),
  builtins(),
  typescript({
    useTsconfigDeclarationDir: true,
    exclude: ["src/__mocks__/*.ts"]
  }),
  sourceMaps()
];

const nodePlugins = [
  json(),
  typescript({ useTsconfigDeclarationDir: true }),
  commonjs(),
  resolve(),
  sourceMaps()
];

const commonConfig = {
  input: `src/index.ts`,
  external: [],
  watch: {
    include: "src/**"
  }
};

const browserConfig = {
  ...commonConfig,
  output: {
    file: pkg.browser,
    name: camelCase(libraryName),
    format: "umd",
    sourcemap: true
  },
  plugins: browserPlugins
};

const nodeConfig = {
  ...commonConfig,
  output: [
    { file: pkg.module, format: "es", sourcemap: true },
    { file: pkg.main, format: "cjs", sourcemap: true }
  ],
  plugins: nodePlugins,
  external: [
    "os",
    "http",
    "https",
    "url",
    "assert",
    "stream",
    "tty",
    "util",
    "zlib"
  ]
};

export default [browserConfig, nodeConfig];
