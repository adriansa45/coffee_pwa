"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TimePickerProps {
    value: string
    onChange: (value: string) => void
    label?: string
    className?: string
}

export function TimePicker({ value, onChange, label, className }: TimePickerProps) {
    const [hours, setHours] = React.useState("09")
    const [minutes, setMinutes] = React.useState("00")

    React.useEffect(() => {
        if (value) {
            const [h, m] = value.split(":")
            setHours(h || "09")
            setMinutes(m || "00")
        }
    }, [value])

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 2)
        const numVal = parseInt(val) || 0
        const clampedVal = Math.min(23, Math.max(0, numVal))
        const formatted = clampedVal.toString().padStart(2, "0")
        setHours(formatted)
        onChange(`${formatted}:${minutes}`)
    }

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 2)
        const numVal = parseInt(val) || 0
        const clampedVal = Math.min(59, Math.max(0, numVal))
        const formatted = clampedVal.toString().padStart(2, "0")
        setMinutes(formatted)
        onChange(`${hours}:${formatted}`)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <Clock className="mr-2 h-4 w-4" />
                    {value || "Seleccionar hora"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
                <div className="space-y-2">
                    {label && <Label className="text-sm font-medium">{label}</Label>}
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="hours" className="text-xs text-muted-foreground">
                                Horas
                            </Label>
                            <Input
                                id="hours"
                                type="text"
                                inputMode="numeric"
                                value={hours}
                                onChange={handleHoursChange}
                                className="w-16 text-center"
                                maxLength={2}
                            />
                        </div>
                        <span className="text-2xl font-bold mt-5">:</span>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="minutes" className="text-xs text-muted-foreground">
                                Minutos
                            </Label>
                            <Input
                                id="minutes"
                                type="text"
                                inputMode="numeric"
                                value={minutes}
                                onChange={handleMinutesChange}
                                className="w-16 text-center"
                                maxLength={2}
                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
