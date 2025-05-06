const esbuild = require("esbuild");
const { nodeExternalsPlugin } = require("esbuild-node-externals");

async function build() {
  try {
    await esbuild.build({
      entryPoints: ["src/index.ts"],
      bundle: true,
      platform: "node",
      target: "node16",
      outdir: "dist",
      sourcemap: true,
      minify: process.env.NODE_ENV === "production",
      plugins: [nodeExternalsPlugin()],
      define: {
        "process.env.NODE_ENV": `"${process.env.NODE_ENV || "development"}"`,
      },
    });
    console.log("Build completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build();
