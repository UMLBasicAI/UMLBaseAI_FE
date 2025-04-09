import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'UMLBasicAI - UML Diagram Generator',
    description: 'Create, manage, and generate code from UML diagrams with AI assistance',
}

export default function RootPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome to UMLBasicAI</h1>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg p-6 bg-white">
                        <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
                        <p className="text-gray-600">
                            This is your starting point for the UMLBasicAI application. Here you can:
                        </p>
                        <ul className="list-disc list-inside mt-4 text-gray-600">
                            <li>Create and manage UML diagrams</li>
                            <li>Generate code from your diagrams</li>
                            <li>Collaborate with team members</li>
                            <li>Export and share your work</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    )
}
