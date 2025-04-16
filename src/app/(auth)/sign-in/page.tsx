import SignIn from '@/components/modules/SignIn'
import webStorageClient from '@/utils/webStorageClient'
import { redirect } from 'next/navigation'

function Page() {
    const userToken = webStorageClient.getToken()
    if (userToken) {
        redirect('/chat')
    }
    return <SignIn />
}

export default Page
