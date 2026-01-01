import api from "@/lib/axios";
import type { Hasil } from "@/types/hasil";
import { onMounted, ref } from "vue";
import { toast } from "vue-sonner";

export default function useHasil() {
    const hasil = ref([] as Hasil[])
    const isLoading = ref(false)
    const allResult = ref([])

    const columns = [
        { key: "no", label: "No" },
        { key: "name", label: "Nama" },
        { key: "disease_name", label: "Penyakit" },
        { key: "score", label: "Nilai" },
    ]

    const fetchHasil = async () => {
        isLoading.value = true;
        try {
            // const res = await api.get("/diagnosis");
            const res = await api.get("/diagnosis/get_all_result")
            const json_res = res.data 
            const dataIndex = json_res.map((item: Hasil, index: number) => ({
                no: index + 1,
                name: item.user.name,
                disease_name: item.diagnosis.disease_name,
                score: item.diagnosis.score
            }))

            hasil.value = dataIndex;
            allResult.value = dataIndex;
            toast.success("Data Hasil berhasil diambil");

        } catch (error) {
            toast.error("Data Hasil masih kosong");
        }
    }

    const submitFilter = (event: SubmitEvent) => {
    event.preventDefault();
    const keywords = ((event.target as any)[0].value as string)
      .trim()
      .toLowerCase()
      .split(" ");
    if (keywords.length === 0) {
      hasil.value = allResult.value;
      return;
    }
    hasil.value = allResult.value
      .map((product: any) => {
        return [`${product.name} ${product.disease_name} `.toLowerCase(), product];
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
        fetchHasil()
    })

    return {
        hasil,
        isLoading,
        columns,
        submitFilter
    }
}