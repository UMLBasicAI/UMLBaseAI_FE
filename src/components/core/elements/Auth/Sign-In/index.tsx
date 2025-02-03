import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@nextui-org/react'
import React from 'react'

type TProps = {
    isOpen: boolean
    onClose: () => void
    onOpenChange: () => void
}

export default function SignInModal({
    isOpen,
    onClose,
    onOpenChange,
}: TProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onOpenChange={onOpenChange}
            closeButton={false}>
            <ModalContent>
                <ModalHeader></ModalHeader>
                <ModalBody>
                    <div>
                        <Button>SignIn</Button>
                        <Button>Cancel</Button>
                    </div>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    )
}
