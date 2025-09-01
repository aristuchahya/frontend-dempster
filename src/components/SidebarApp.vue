<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Sistem Prediksi Stok</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in filteredItems" :key="item.title">
              <SidebarMenuButton asChild>
                <router-link
                  v-if="item.title !== 'Logout'"
                  :to="item.url"
                  :class="
                    route.path === item.url
                      ? 'text-blue-500 font-bold'
                      : 'text-gray-700'
                  "
                >
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </router-link>
                <a
                  v-else
                  href="#"
                  @click.prevent="handleLogout"
                  class="text-gray-700"
                >
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

import { Home, LogOut, SquareActivity } from "lucide-vue-next";
import { useUserStore } from "@/stores/user_store";
import { computed } from "vue";

const route = useRoute();
const router = useRouter();
const useRole = useUserStore();
const role = useRole.getRole;
console.log(role);

const items = [
  {
    title: "Gangguan Mental",
    url: "/",
    icon: Home,
    role: "user",
  },
  {
    title: "Hasil Diagnosis",
    url: "/result",
    icon: SquareActivity,
    role: "user",
  },
  {
    title: "Data Gejala",
    url: "/gejala",
    icon: SquareActivity,
    role: "admin",
  },
  {
    title: "Data Aturan",
    url: "/aturan",
    icon: SquareActivity,
    role: "admin",
  },

  {
    title: "Logout",
    url: "#",
    icon: LogOut,
    role: "all",
  },
];

const filteredItems = computed(() => {
  return items.filter((item) => item.role === role || item.role === "all");
});

const handleLogout = () => {
  useRole.logout();
  // sessionStorage.removeItem("token");
  // sessionStorage.removeItem("user");
  router.push("/login");
};
</script>
<style lang=""></style>
