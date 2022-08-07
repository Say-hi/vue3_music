import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/recommend",
  },
  {
    name: "recommend",
    path: "/recommend",
    component: () => import("@/views/recommend.vue"),
    children: [
      {
        name: "album",
        path: ":id",
        component: () => import("@/views/album.vue"),
      },
    ],
  },
  {
    name: "search",
    path: "/search",
    component: () => import("@/views/search.vue"),
    children: [
        {
          name: "search-singer-detail",
          path: ":id",
          component: () => import("@/views/singer-detail.vue"),
        },
      ],
  },
  {
    name: "singer",
    path: "/singer",
    component: () => import("@/views/singer.vue"),
    children: [
      {
        name: "singer-detail",
        path: ":id",
        component: () => import("@/views/singer-detail.vue"),
      },
    ],
  },
  {
    name: "top-list",
    path: "/top-list",
    component: () => import("@/views/top-list.vue"),
    children: [
        {
          name: "top-detail",
          path: ":id",
          component: () => import("@/views/top-detail.vue"),
        },
      ],
  },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
