import { getPluginsList } from "./build/plugins";
import { exclude, include } from "./build/optimize";
import { type ConfigEnv, loadEnv, type UserConfigExport } from "vite";
import {
  __APP_INFO__,
  alias,
  pathResolve,
  root,
  wrapperEnv
} from "./build/utils";

export default ({ mode }: ConfigEnv): UserConfigExport => {
  const { VITE_CDN, VITE_PORT, VITE_COMPRESSION, VITE_PUBLIC_PATH } =
    wrapperEnv(loadEnv(mode, root));
  const env = loadEnv(mode, root);
  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias
    },
    /**
     * 本地开发服务，也可以配置接口代理
     * @see https://cn.vitejs.dev/config/#server-proxy
     */
    server: {
      /** 是否开启 HTTPS */
      // https: false,
      /** 设置 host: true 才可以使用 Network 的形式，以 IP 访问项目 */
      host: true, // host: "0.0.0.0"
      /** 端口号 */
      port: 9091,
      /** 是否自动打开浏览器 */
      open: false,
      /** 跨域设置允许 */
      cors: true,
      /** 端口被占用时，是否直接退出 */
      strictPort: false,
      /** 接口代理 */
      proxy: {
        // mock代理
        "/mock": {
          target: env.VITE_MOCK_PROXY_URL,
          ws: false,
          changeOrigin: true,
          rewrite: path => path.replace("", "")
        },
        // 前缀
        "/admin_api": {
          target: env.VITE_API_PROXY_URL, // 代理后的地址 =target/path
          ws: true,
          /** 是否允许跨域 */
          changeOrigin: true,
          rewrite: path => path.replace("", ""),
          bypass(req, res, options) {
            const proxyURL = options.target + options.rewrite(req.url);
            console.log("proxyURL", proxyURL);
            res.setHeader("x-req-proxyURL", proxyURL); // 设置响应头可以看到
          }
        }
      }
    },
    plugins: getPluginsList(VITE_CDN, VITE_COMPRESSION),
    // https://cn.vitejs.dev/config/dep-optimization-options.html#dep-optimization-options
    optimizeDeps: {
      include,
      exclude
    },
    build: {
      // https://cn.vitejs.dev/guide/build.html#browser-compatibility
      target: "es2015",
      sourcemap: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 4000,
      /** 打包文件的输出目录,默认值为 dist */
      outDir: env.VITE_BUILD_OUTPUT_DIR,
      /** 打包后静态资源目录 */
      assetsDir: "assets",
      rollupOptions: {
        input: {
          index: pathResolve("./index.html", import.meta.url)
        },
        // 静态资源分类打包
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]"
        }
      }
    },
    /** 混淆器 */
    esbuild: false,
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    }
  };
};
