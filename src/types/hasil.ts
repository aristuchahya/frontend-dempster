// export interface Hasil {
//     nama : string
//     penyakit : string
//     nilai : number
// }

export interface Hasil {
user: {
    id: string
    name: string
  }
  diagnosis: {
    disease_code: string
    disease_name: string
    score: number
    level: string
    solution: string
  }
}