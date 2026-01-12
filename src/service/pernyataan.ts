import api from "@/lib/axios";
import { useResultStore } from "@/stores/result";

import type { Pernyataan } from "@/types/pernyataan";
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

export default function usePernyataan() {
    const statements = ref([] as Pernyataan[])
    const selectedAnswers = ref<Record<string, number>>({})
    const result = ref(null)
    const isLoading = ref(false)
    const router = useRouter()
    
    const isSubmitting = ref(false);


    const userStore = useResultStore()


    const fetchStatements = async () => {
        try {
            const res = await api.get(`/admin/questions`)
            statements.value = res.data
            toast.success("Data pernyataan berhasil diambil")

        } catch (error) {
            toast.error("Data pernyataan gagal diambil")
        }
    }

    fetchStatements()

    const answerByStatement = computed(() => {
    const map: Record<string, { value: number; label: string }[]> = {}

    for (const s of statements.value) {
        map[s.id] = [
        { value: 0, label: "Tidak Pernah" },
        { value: 1, label: "Kadang-kadang" },
        { value: 2, label: "Sering" },
        { value: 3, label: "Sangat Sering" },
        ]
    }

    return map
    })

    const submitDiagnosis = async () => {
        if (
            Object.keys(selectedAnswers.value).length !==
            statements.value.length
        ) {
            toast.error("Semua pernyataan wajib dijawab")
            return
        }

        isSubmitting.value = true

        try {
            const payload = {
            user_id: userStore.id,
            answers: Object.entries(selectedAnswers.value).map(
                ([question_code, value]) => ({
                question_code,
                value
                })
            ),
            }

            await api.post("/assesment", payload)

            toast.success("Diagnosis berhasil")

            selectedAnswers.value = {} // ✅ AMAN
            // userStore.clear()

            router.push("/result")
        } catch (error) {
            console.error(error)
            toast.error("Diagnosis gagal")
        } finally {
            isSubmitting.value = false
        }
        }


    return {
    statements,
    answerByStatement,
    selectedAnswers,
    result,
    isLoading,
    submitDiagnosis,
    isSubmitting
    }
}

// const fetchAnswers = async () => {
// try {
//     const res = await api.get("/diagnosis/get_answers")

//     const grouped: Record<string, any[]> = {}

//     for (const ans of res.data) {
//     if (!grouped[ans.statement_id]) {
//         grouped[ans.statement_id] = []
//     }
//     grouped[ans.statement_id].push(ans)
//     }

//     answerByStatement.value = grouped
// } catch (error) {
//     toast.error("Data pilihan jawaban gagal diambil")
// }
// }

// const submitDiagnosis = async () => {
// try {
//     isLoading.value = true

//     const payload = {
//     user_id: userId,
//     answers: selectedAnswers.value
//     }

//     const res = await api.post("/diagnosis/get_diagnosis", payload)
//     result.value = res.data

//     toast.success("Berhasil mendapatkan hasil diagnosis")
//     setTimeout(() => {
//         router.push("/result")
//     })
// } catch (error) {
//     toast.error("Gagal mendapatkan hasil diagnosis")
// } finally {
//     isLoading.value = false
// }
// }


// onMounted(async () => {
// isLoading.value = true
// await Promise.all([fetchStatements(), fetchAnswers()])
// isLoading.value = false
// })