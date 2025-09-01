import api from "@/lib/axios";
import type { Gejala } from "@/types/gejala";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { nextTick, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import z from "zod";

export default function useGejala() {
  const router = useRouter();
  const gejala = ref([] as Gejala[]);
  const isLoading = ref(false);
  const allResult = ref([]);

  const columns = [
    { key: "no", label: "No" },
    { key: "kd_gejala", label: "Kode", headClass: "w-[100px]" },
    { key: "nama", label: "Nama Gejala" },
    {
      key: "actions",
      label: "Actions",
      headClass: "w-[180px]",
      cellClass: "w-[180px]",
    },
  ];

  const fetchGejala = async () => {
    try {
      isLoading.value = true;
      const res = await api.get("/gejala");
      const dataIndex = res.data.map((item: Gejala, index: number) => ({
        no: index + 1,
        kd_gejala: item.kd_gejala,
        nama: item.nama,
      }));

      gejala.value = dataIndex;
      allResult.value = dataIndex;
      toast.success("Data Gejala berhasil diambil");
    } catch (error) {
      toast.error("Data Gejala masih kosong");
    }
  };

  const handleDelete = async (kode: string) => {
    try {
      await api.delete(`/gejala/${kode}`);
      gejala.value = gejala.value.filter((p) => p.kd_gejala !== kode);
      toast.success("Gejala Berhasil Dihapus");
      router.go(0);
    } catch (error) {
      toast.error("Gejala Gagal Dihapus");
    }
  };

  const submitFilter = (event: SubmitEvent) => {
    event.preventDefault();
    const keywords = ((event.target as any)[0].value as string)
      .trim()
      .toLowerCase()
      .split(" ");
    if (keywords.length === 0) {
      gejala.value = allResult.value;
      return;
    }
    gejala.value = allResult.value
      .map((product: any) => {
        return [`${product.kd_gejala} ${product.nama} `.toLowerCase(), product];
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
    fetchGejala();
  });

  const formSchema = toTypedSchema(
    z.object({
      file: z
        .any()
        .refine((file) => file instanceof File, "File wajib diunggah")
        .refine(
          (file) =>
            [
              "application/vnd.ms-excel",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ].includes(file?.type),
          "File harus Excel (.xls/.xlsx)"
        ),
    })
  );

  const { handleSubmit, isSubmitting } = useForm({
    validationSchema: formSchema,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const formData = new FormData();
      formData.append("file", values.file);
      await api.post("/gejala/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Berhasil menambahkan data latih");

      await nextTick();

      await router.push("/gejala");
    } catch (error) {
      toast.error(`Gagal mengirim data`, {
        description: `Error: ${error}`,
      });
    }
  });

  return {
    gejala,
    isLoading,
    columns,
    handleDelete,
    submitFilter,
    onSubmit,
    isSubmitting,
  };
}
