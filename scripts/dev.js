const esbuild = require("esbuild");
const { nodeExternalsPlugin } = require("esbuild-node-externals");
const { spawn } = require("child_process");
const chokidar = require("chokidar");

let nodeProcess = null;

// Kill the process
function killProcess() {
  if (nodeProcess) {
    nodeProcess.kill();
    nodeProcess = null;
  }
}

// Start the application
function startApp() {
  nodeProcess = spawn("node", ["dist/index.js"], { stdio: "inherit" });
  console.log("App started!");
}

// Development build
async function devBuild() {
  try {
    await esbuild.build({
      entryPoints: ["src/index.ts"],
      bundle: true,
      platform: "node",
      target: "node16",
      outdir: "dist",
      sourcemap: true,
      plugins: [nodeExternalsPlugin()],
      define: {
        "process.env.NODE_ENV": '"development"',
      },
    });
    console.log("Build completed");

    // Restart the application
    killProcess();
    startApp();
  } catch (error) {
    console.error("Build failed:", error);
  }
}

// Watch for file changes
chokidar
  .watch("src", {
    persistent: true,
    ignoreInitial: true,
    depth: Infinity,
  })
  .on("all", (event, path) => {
    console.log(`${event}: ${path}`);
    devBuild();
  });

// Initial build and start
devBuild();

// Handle process termination
process.on("SIGINT", () => {
  killProcess();
  process.exit(0);
});
