import api from "@/lib/axios";
import type { Aturan } from "@/types/aturan";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { nextTick, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import z from "zod";

export default function useAturan() {
  const router = useRouter();
  const aturan = ref([] as Aturan[]);
  const isLoading = ref(false);
  const allResult = ref([]);

  const columns = [
    { key: "no", label: "No" },
    { key: "category", label: "Kategori", headClass: "w-[100px]" },
    { key: "min_score", label: "Skor Minimal" },
    { key: "max_score", label: "Skor Maksimal", headClass: "w-[100px]" },
    { key: "level", label: "Tingkat" },
    {
      key: "actions",
      label: "Actions",
      headClass: "w-[180px]",
      cellClass: "w-[180px]",
    },
  ];

  const fetchAturan = async () => {
    isLoading.value = true;
    try {
      const res = await api.get("/admin/rules");
      const dataIndex = res.data.map((item: Aturan, index: number) => ({
        no: index + 1,
        category: item.category,
        min_score: item.min_score,
        max_score: item.max_score,
        level: item.level,
        
      }));

      aturan.value = dataIndex;
      allResult.value = dataIndex;
      toast.success("Data Aturan berhasil diambil");
    } catch (error) {
      toast.error("Data Aturan masih kosong");
    }
  };

  const handleDelete = async (kode: string) => {
    try {
      await api.delete(`/admin/rule/${kode}`);
      aturan.value = aturan.value.filter((p) => p.id !== kode);
      toast.success("Aturan Berhasil Dihapus");
      router.go(0);
    } catch (error) {
      toast.error("Aturan Gagal Dihapus");
    }
  };

  const submitFilter = (event: SubmitEvent) => {
    event.preventDefault();
    const keywords = ((event.target as any)[0].value as string)
      .trim()
      .toLowerCase()
      .split(" ");
    if (keywords.length === 0) {
      aturan.value = allResult.value;
      return;
    }
    aturan.value = allResult.value
      .map((product: any) => {
        return [
          `${product.category} ${product.min_score} ${product.max_score} ${product.level} `.toLowerCase(),
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
    fetchAturan();
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
      await api.post("/aturan/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Berhasil menambahkan data latih");

      await nextTick();

      await router.push("/aturan");
    } catch (error) {
      toast.error(`Gagal mengirim data`, {
        description: `Error: ${error}`,
      });
    }
  });

  return {
    aturan,
    isLoading,
    columns,
    handleDelete,
    submitFilter,
    isSubmitting,
    onSubmit,
  };
}
