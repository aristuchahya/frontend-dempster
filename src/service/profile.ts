import * as z from "zod";
import { toast } from "vue-sonner";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import api from "@/lib/axios";
import { useRouter } from "vue-router";
import type { Profile } from "@/types/profile";
import { useUserStore } from "@/stores/user_store";
export default function useProfile() {
  const router = useRouter();
  const userStore = useUserStore();
  const userId = userStore.getUserId;

  const formSchema = toTypedSchema(
    z.object({
      nama: z.string().min(1, "Nama tidak boleh kosong"),
      jenis_kelamin: z.enum(["Laki-laki", "Perempuan"]),
      umur: z.number().min(1, "Umur tidak boleh kosong"),
      noip: z.string().min(1, "Nomor IP tidak boleh kosong"),
      tanggal: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
      whatsapp: z.string().min(1, "Nomor Whatsapp tidak boleh kosong"),
      nama_orangtua: z.string().min(1, "Nama Orangtua tidak boleh kosong"),
      prodi: z.string().min(1, "Program Studi tidak boleh kosong"),
      semester: z.string().min(1, "Semester tidak boleh kosong"),
      asuransi: z.string().min(1, "Asuransi tidak boleh kosong"),
    })
  );

  const { handleSubmit, resetForm, isSubmitting } = useForm<Profile>({
    validationSchema: formSchema,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await api.post("/user", { ...values, user_id: userId });

      toast.success("Profile Berhasil Ditambahkan");
      resetForm();
      await router.push("/pernyataan");
    } catch (error) {
      toast.error("Profile Gagal Ditambahkan");
    }
  });

  return {
    onSubmit,
    isSubmitting,
  };
}
