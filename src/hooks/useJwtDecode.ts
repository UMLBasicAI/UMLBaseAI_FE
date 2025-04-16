import webStorageClient from '@/utils/webStorageClient'
import { jwtDecode, JwtPayload } from 'jwt-decode'
import { useEffect, useState } from 'react'
export interface AppJwtPayload extends JwtPayload {}

export const useJwtDecode = () => {
    const [decoded, setDecoded] = useState<{ sub: string; jti: string } | null>(
        null,
    )

    useEffect(() => {
        const token = webStorageClient.getToken()
        if (token) {
            try {
                const decoded = jwtDecode<AppJwtPayload>(token)
                const { sub, jti } = decoded
                setDecoded({ sub: sub ?? '', jti: jti ?? '' })
            } catch (error) {
                setDecoded(null);
            }
        }
    }, [])
    
    return decoded
}
