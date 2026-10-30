import path from "path";
import { defineConfig, loadEnv } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginLess } from "@rsbuild/plugin-less";
import { pluginTypeCheck } from "@rsbuild/plugin-type-check";
import { pluginSvgr } from "@rsbuild/plugin-svgr";

const { publicVars, rawPublicVars } = loadEnv({ prefixes: ["REACT_APP_"] });

export default defineConfig({
  plugins: [pluginReact(), pluginLess(), pluginTypeCheck(), pluginSvgr({ mixedImport: true })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  source: {
    entry: {
      index: "./src/main.tsx",
    },
    define: {
      ...publicVars,
      "process.env": JSON.stringify(rawPublicVars),
    },
  },
  html: {
    template: "./index.html",
    templateParameters: {
      assetPrefix: "",
    },
    favicon: "./public/logo.svg",
  },
  output: {
    distPath: {
      root: "build",
    },
  },
  server: {
    port: 5137,
  },
  tools: {
    postcss: (postcssConfig, { addPlugins }) => {
      addPlugins([
        ["@tailwindcss/postcss", {}],
        ["autoprefixer", {}],
      ]);
      return postcssConfig;
    },
  },
});