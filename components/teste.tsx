import { useEffect, useState } from "react"

export default function Teste() {
  const [data, setData] = useState(null)

  // useEffect roda depois que o componente carrega
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/hello")
        if (!response.ok) {
          throw new Error("Erro na requisição")
        }

        const json = await response.json() // ← precisa do await aqui!
        console.log(json)
        setData(json)
      } catch (err) {
        console.error("Erro ao buscar dados da API:", err)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <p>{data ? data.message : "Carregando..."}</p>
    </div>
  )
}
