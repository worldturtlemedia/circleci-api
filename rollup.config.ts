import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import camelCase from "lodash.camelcase";
import typescript from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";
import builtins from "rollup-plugin-node-builtins";
import nodeGlobals from "rollup-plugin-node-globals";
import { terser } from "rollup-plugin-terser";

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
    exclude: ["src/__mocks__/*.ts"],
  }),
  sourceMaps(),
];

const nodePlugins = [
  json(),
  typescript({ useTsconfigDeclarationDir: true }),
  commonjs(),
  resolve(),
  sourceMaps(),
];

const commonConfig = {
  input: `src/index.ts`,
  external: [],
  watch: {
    include: "src/**",
  },
};

const browserConfig = {
  ...commonConfig,
  output: {
    file: pkg.browser.replace(".min.js", ".js"),
    name: camelCase(libraryName),
    format: "umd",
    sourcemap: true,
  },
  plugins: [...browserPlugins, sourceMaps()],
};

const minifiedBrowserConfig = {
  ...commonConfig,
  output: {
    ...browserConfig.output,
    file: pkg.browser,
  },
  plugins: [...browserPlugins, terser(), sourceMaps()],
};

const nodeConfig = {
  ...commonConfig,
  output: [
    { file: pkg.module, format: "es", sourcemap: true },
    { file: pkg.main, format: "cjs", sourcemap: true },
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
    "zlib",
  ],
};

export default [browserConfig, minifiedBrowserConfig, nodeConfig];
