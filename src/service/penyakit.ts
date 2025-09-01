import api from "@/lib/axios";
import type { Penyakit } from "@/types/penyakit";
import { onMounted, ref } from "vue";
import { toast } from "vue-sonner";

export default function usePenyakit() {
  const penyakit = ref([] as Penyakit[]);
  const isLoading = ref(false);

  const fetchPenyakit = async () => {
    isLoading.value = true;
    try {
      const res = await api.get("/penyakit");
      penyakit.value = res.data;
      toast.success("Data Penyakit berhasil diambil");
    } catch (error) {
      toast.error("Data Penyakit masih kosong");
    }
  };

  onMounted(() => {
    fetchPenyakit();
  });

  return {
    penyakit,
    isLoading,
    fetchPenyakit,
  };
}
