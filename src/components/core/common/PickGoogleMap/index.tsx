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

const containerStyle = {
    width: '100%',
    height: '400px',
}

//default is HCM city
const defaultCenter = {
    lat: 10.762622,
    lng: 106.660172,
}

export default function PickGoogleMap({
    isOpen,
    onClose,
    onOpenChange,
}: TProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onOpenChange={onOpenChange}
            size="5xl"
        >
            <ModalContent>
                <ModalHeader>Google Map</ModalHeader>
                <ModalBody>Oke</ModalBody>
                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    )
}
