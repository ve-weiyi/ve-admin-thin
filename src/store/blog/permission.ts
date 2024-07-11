import { constantRoutes } from "@/router";
import { defineStore } from "pinia";
import type { RouteRecordRaw } from "vue-router";
import { getUserMenusApi } from "@/api/account.ts";

/**
 * 权限
 */
export interface PermissionState {
  /**
   * 路由
   */
  routes: RouteRecordRaw[];
}

const modules = import.meta.glob("../../views/**/**.vue");

export const ParentView = () => import("../../components/ParentView/index.vue");
export const Layout = () => import("../../layouts/index.vue");

const filterAsyncRoutes = (routes: RouteRecordRaw[]) => {
  const res: RouteRecordRaw[] = [];
  routes.forEach(route => {
    const tmp = { ...route } as any;
    if (tmp.component === "Layout") {
      tmp.component = Layout;
    } else if (tmp.component === "ParentView") {
      tmp.component = ParentView;
    } else {
      Object.keys(modules).forEach(url => {
        if (url == `../../views${tmp.component}.vue`) {
          tmp.component = modules[url];
        }
      });
    }
    res.push(tmp);
    if (tmp.children) {
      tmp.children = filterAsyncRoutes(tmp.children);
    }
  });
  return res;
};

const usePermissionStore = defineStore({
  id: "permission",
  state: (): PermissionState => ({
    routes: []
  }),
  actions: {
    setRoutes(routes: RouteRecordRaw[]) {
      this.routes = constantRoutes.concat(routes);
    },
    generateRoutes(): Promise<RouteRecordRaw[]> {
      return new Promise((resolve, reject) => {
        getUserMenusApi()
          .then(res => {
            if (res.code == 200) {
              const asyncRoutes: any = res.data.list;
              const accessedRoutes = filterAsyncRoutes(asyncRoutes);
              this.setRoutes(accessedRoutes);
              resolve(accessedRoutes);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export default usePermissionStore;
