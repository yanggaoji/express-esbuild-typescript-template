const esbuild = require("esbuild");
const { nodeExternalsPlugin } = require("esbuild-node-externals");
const { spawn } = require("child_process");
const chokidar = require("chokidar");

let nodeProcess = null;

// 终止进程
function killProcess() {
  if (nodeProcess) {
    nodeProcess.kill();
    nodeProcess = null;
  }
}

// 启动应用
function startApp() {
  nodeProcess = spawn("node", ["dist/index.js"], { stdio: "inherit" });
  console.log("App started!");
}

// 开发构建
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

    // 重启应用
    killProcess();
    startApp();
  } catch (error) {
    console.error("Build failed:", error);
  }
}

// 监听文件变化
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

// 初始构建并启动
devBuild();

// 处理进程终止
process.on("SIGINT", () => {
  killProcess();
  process.exit(0);
});
