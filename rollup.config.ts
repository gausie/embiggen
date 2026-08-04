import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import type { RollupOptions } from "rollup";

const watch = process.argv.includes("--watch") || process.argv.includes("-w");

const baseSettings = {
  output: {
    dir: "dist/scripts/gain",
    format: "cjs",
    exports: "auto",
    chunkFileNames: "_[name].js",
  },

  // Provided by the KoLmafia runtime; everything else (libram) is bundled.
  external: ["kolmafia"],

  plugins: [
    resolve({
      extensions: [".js", ".ts"],
    }),

    commonjs(),

    babel({
      babelHelpers: "bundled",
      extensions: [".js", ".ts"],
      babelrc: false,
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              rhino: "1.8.0",
            },
          },
        ],
        "@babel/preset-typescript",
      ],
    }),
  ],

  watch: watch ? { clearScreen: false } : undefined,
} satisfies RollupOptions;

export default [{ gain: "src/main.ts" }].map((input) => ({
  input,
  ...baseSettings,
}));
