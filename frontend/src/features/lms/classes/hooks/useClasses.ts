import { useState, useCallback } from "react"
import { useGetClasses } from "../api/class.api"

export function useClasses() {
  const [year, setYear] = useState("")
  const [term, setTerm] = useState("")
  const [status, setStatus] = useState("")
  const [search, setSearch] = useState("")

  const { data, isLoading, error } = useGetClasses({
    year: year || undefined,
    term: term || undefined,
    status: status || undefined,
    q: search || undefined,
  })

  const classes = data?.data ?? []
  const total = data?.total ?? 0

  const resetFilters = useCallback(() => {
    setYear("")
    setTerm("")
    setStatus("")
    setSearch("")
  }, [])

  return {
    classes,
    total,
    isLoading,
    error,
    year, setYear,
    term, setTerm,
    status, setStatus,
    search, setSearch,
    resetFilters,
  }
}
