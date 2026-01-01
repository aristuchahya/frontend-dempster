import api from "@/lib/axios";
import type { Penyakit } from "@/types/penyakit";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

export default function usePenyakit() {
  const router = useRouter();
  const penyakit = ref([] as Penyakit[]);
  const isLoading = ref(false);
  const allResult = ref([]);
  const penyakit_col = ref([] as Penyakit[]);

  const columns = [
    { key: "no", label: "No" },
    { key: "code", label: "Kode", headClass: "w-[100px]" },
    { key: "name", label: "Nama Penyakit" },
    { key: "solution", label: "Solusi" },
    {
      key: "actions",
      label: "Actions",
      headClass: "w-[180px]",
      cellClass: "w-[180px]",
    },
  ];

  const fetchPenyakit = async () => {
    isLoading.value = true;
    try {
      // const res = await api.get("/penyakit");
      const res = await api.get("/diagnosis/get_diseases")
      penyakit.value = res.data;
      toast.success("Data Penyakit berhasil diambil");
    } catch (error) {
      toast.error("Data Penyakit masih kosong");
    }
  };

  const fetchColoumn = async () => {
    try {
      isLoading.value = true;
      const res = await api.get("/diagnosis/get_diseases");
      const dataIndex = res.data.map((item: Penyakit, index: number) => ({
        no: index + 1,
        code: item.code,
        name: item.name,
        solution: item.solution,
      }));

      penyakit_col.value = dataIndex;
      allResult.value = dataIndex;
      toast.success("Data Penyakit berhasil diambil");
    } catch (error) {
      toast.error("Data Penyakit masih kosong");
    }
  };

  const handleDelete = async (kode: string) => {
    try {
      await api.delete(`/diagnosis/delete_disease/${kode}`);
      penyakit.value = penyakit.value.filter((p) => p.code !== kode);
      toast.success("Penyakit Berhasil Dihapus");
      router.go(0);
    } catch (error) {
      toast.error("Penyakit Gagal Dihapus");
    }
  };

  const submitFilter = (event: SubmitEvent) => {
    event.preventDefault();
    const keywords = ((event.target as any)[0].value as string)
      .trim()
      .toLowerCase()
      .split(" ");
    if (keywords.length === 0) {
      penyakit.value = allResult.value;
      return;
    }
    penyakit.value = allResult.value
      .map((product: any) => {
        return [
          `${product.kd_penyakit} ${product.nama} ${product.deskripsi} ${product.solusi} `.toLowerCase(),
          product,
        ];
      })
      .filter(([strMatch]) => {
        let matchAll = false;
        for (const keyword of keywords) {
          console.log(strMatch, keyword);
          if (strMatch.includes(keyword)) {
            matchAll = true;
          } else {
            matchAll = false;
            break;
          }
        }
        return matchAll;
      })
      .map((i) => i[1]);
  };

  onMounted(() => {
    fetchPenyakit();
    fetchColoumn();
  });

  return {
    penyakit,
    isLoading,
    fetchPenyakit,
    submitFilter,
    handleDelete,
    columns,
    penyakit_col,
  };
}
