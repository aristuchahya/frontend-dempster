import FormGejala from "@/components/form-data/FormGejala.vue";
import FormPertanyaan from "@/components/form-data/FormPertanyaan.vue";

import FormProfile from "@/components/form-data/FormProfile.vue";

import DataAturan from "@/components/table-data/DataAturan.vue";
import DataGejala from "@/components/table-data/DataGejala.vue";
import DataPenyakit from "@/components/table-data/DataPenyakit.vue";
import Process from "@/components/table-data/Process.vue";
import Result from "@/components/table-data/Result.vue";
import Login from "@/pages/auth/Login.vue";
import Register from "@/pages/auth/Register.vue";
import Layout from "@/pages/Layout.vue";

import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: Layout,
    meta: {
      requiresAuth: true,
      role: ["admin", "user"],
    },
    children: [
      {
        path: "profile",
        component: FormProfile,
        meta: {
          role: ["user"],
        },
      },
      {
        path: "pertanyaan",
        component: FormPertanyaan,
        meta: {
          role: ["user"],
        },
      },
      {
        path: "process",
        component: Process,
        meta: {
          role: ["user"],
        },
      },
      {
        path: "result",
        component: Result,
        meta: {
          role: ["user"],
        },
      },
      {
        path: "gejala",
        component: DataGejala,
        meta: {
          role: ["admin"],
        },
      },
      {
        path: "form-gejala",
        component: FormGejala,
        meta: {
          role: ["admin"],
        },
      },
      {
        path: "aturan",
        component: DataAturan,
        meta: {
          role: ["admin"],
        },
      },
      {
        path: "",
        component: DataPenyakit,
      },
    ],
  },

  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/form",
    component: Layout,
    children: [
      {
        path: "profile",
        component: FormProfile,
      },
      {
        path: "pertanyaan",
        component: FormPertanyaan,
      },
      {
        path: "gejala",
        component: DataGejala,
      },
      {
        path: "aturan",
        component: DataAturan,
      },
      {
        path: "penyakit",
        component: DataPenyakit,
      },
      {
        path: "result",
        component: Result,
      },
      {
        path: "process",
        component: Process,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const token = sessionStorage.getItem("token");
  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
});

export default router;
