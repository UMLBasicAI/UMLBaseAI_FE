'use client'

import React, { useReducer } from 'react'
import { ChevronDown, MapPin } from 'lucide-react'
import { cn } from '@/libs/utils'

export type SelectorState = {
    isOpen: boolean
    selectedValue: string | null | undefined
}

const initialState: SelectorState = {
    isOpen: false,
    selectedValue: undefined,
}

export const SelectorActions = {
    TOGGLE_DROPDOWN: 'TOGGLE_DROPDOWN',
    SELECT_OPTION: 'SELECT_OPTION',
}

function reducer(
    state: SelectorState,
    action: { type: string; payload?: string },
): SelectorState {
    switch (action.type) {
        case SelectorActions.TOGGLE_DROPDOWN:
            return { ...state, isOpen: !state.isOpen }
        case SelectorActions.SELECT_OPTION:
            return { ...state, selectedValue: action.payload, isOpen: false }
        default:
            return state
    }
}

type SelectorProps = {
    lable?: string
    options: { label: string; value: string }[]
    defaultValue?: string
    placeholder?: string
    prefix?: React.ReactNode | React.JSX.Element | string | null
}
export default function Selector({
    lable,
    options = [],
    defaultValue,
    placeholder,
    prefix,
}: SelectorProps) {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <div className="relative w-full max-w-[300px]">
            {/* Main Button */}
            <button
                onClick={() => dispatch({ type: 'TOGGLE_DROPDOWN' })}
                className="flex w-full items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-left shadow-sm"
            >
                <div>
                    {prefix && (
                        prefix
                    )}
                </div>
                <div className="flex-1">
                    <div className="text-xs text-neutral-500">{lable}</div>
                    <div
                        className={cn('text-sm', {
                            'text-neutral-500': !state.selectedValue,
                        })}
                    >
                        {state.selectedValue
                            ? state.selectedValue
                            : placeholder}
                    </div>
                </div>
                <ChevronDown
                    className={`h-4 w-4 text-neutral-400 transition-transform ${
                        state.isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {/* Dropdown Menu */}
            {state.isOpen && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-neutral-100 bg-white/95 p-1 shadow-lg backdrop-blur-sm">
                    <div className="space-y-1 p-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() =>
                                    dispatch({
                                        type: 'SELECT_OPTION',
                                        payload: option.label,
                                    })
                                }
                                className={`flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-neutral-100 ${
                                    state.selectedValue === option.label
                                        ? 'bg-orange-50 text-orange-500'
                                        : 'text-neutral-700'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
