import DetailStoreModule from '@/components/core/modules/Admin/Stores/DetailStore'
import React from 'react'
import { Suspense } from 'react'

export default function DetailStorePage() {
    return (
        <Suspense>
            <DetailStoreModule />
        </Suspense>
    )
}
