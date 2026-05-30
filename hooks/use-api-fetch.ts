"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useCallback } from "react"

/**
 * Devuelve una función `apiFetch` idéntica a `fetch` pero que adjunta
 * automáticamente el token de acceso de Privy en la cabecera Authorization.
 */
export function useApiFetch() {
  const { getAccessToken } = usePrivy()

  return useCallback(
    async (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
      const token = await getAccessToken()
      const headers = new Headers(init.headers)
      if (token) headers.set("Authorization", `Bearer ${token}`)
      return fetch(input, { ...init, headers })
    },
    [getAccessToken],
  )
}
