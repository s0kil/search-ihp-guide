import esbuild from "esbuild"
import babel from "esbuild-plugin-babel"

const isProduction = process.env.NODE_ENV === "production"

esbuild
  .build({
    entryPoints: ["index.js"],
    bundle: true,
    minify: isProduction ? true : false,
    outfile: "build/main.js",
    plugins: [babel()],
    sourcemap: isProduction ? false : true,
    watch: isProduction ? false : true,
    target: "es2020",
    incremental: isProduction ? false : true,
  })
  .catch(() => process.exit(1))
