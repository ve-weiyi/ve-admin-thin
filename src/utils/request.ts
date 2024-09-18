import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from "axios";
import { ElMessage, ElNotification } from "element-plus";
import { useAdminStoreHook } from "@/store/blog/admin.ts";

import MD5 from "crypto-js/md5";
import { useRouter } from "vue-router";

function signWithSalt(message: string, salt: string): string {
  const saltedMessage = salt + message;
  return MD5(saltedMessage).toString();
}

function getTimestampInSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

const requests = axios.create({
  baseURL: "",
  timeout: 10000,
  // 请求头
  headers: {
    "Content-Type": "application/json;charset=UTF-8"
  }
});

const HeaderAuthorization = "Authorization";
const HeaderUid = "Uid";
const HeaderToken = "Token";
const HeaderTerminal = "Terminal";
const HeaderTimestamp = "Timestamp";

// 请求拦截器
requests.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 请求带token
    let dv = "device_id";
    let ts = getTimestampInSeconds().toString();
    const tk = useAdminStoreHook().getToken();
    const uid = useAdminStoreHook().getUid();
    if (tk) {
      config.headers = Object.assign({}, config.headers, {
        [HeaderAuthorization]: tk,
        [HeaderUid]: uid,
        [HeaderToken]: signWithSalt(dv, ts),
        [HeaderTerminal]: dv,
        [HeaderTimestamp]: ts
      });
    } else {
      // 未登录时的加密方式
      config.headers = Object.assign({}, config.headers, {
        [HeaderToken]: signWithSalt(dv, ts),
        [HeaderTerminal]: dv,
        [HeaderTimestamp]: ts
      });
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 配置响应拦截器
requests.interceptors.response.use(
  (response: AxiosResponse) => {
    switch (response.data.code) {
      case 200:
        break;
      case 400:
        ElNotification({
          title: "失败",
          message: response.data.message,
          type: "error"
        });
        break;
      case 403:
        useAdminStoreHook().removeToken();
        ElNotification({
          title: "登录过期",
          message: response.data.message,
          type: "error"
        });
        const router = useRouter();
        router.push("/login");
        break;
      default:
        ElNotification({
          title: "失败",
          message: response.data.message,
          type: "error"
        });
        break;
    }
    return response.data;
  },
  (error: AxiosError) => {
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substring(message.length - 3) + "异常";
    }
    ElMessage({
      message: message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

// 对外暴露
export default requests;
