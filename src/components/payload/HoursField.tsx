"use client";

import React, { useState, useEffect } from 'react';
import { useField } from '@payloadcms/ui';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { TimePicker } from '@/components/ui/time-picker';

interface TimeRange {
    open: string;
    close: string;
}

interface DaySchedule {
    enabled: boolean;
    ranges: TimeRange[];
}

interface HoursState {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
}

const defaultRange: TimeRange = { open: '09:00', close: '18:00' };

const dayNames: { [key in keyof HoursState]: string } = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
};

const HoursField: React.FC<any> = ({ path }) => {
    const { value, setValue } = useField<any>({ path });

    const [hoursState, setHoursState] = useState<HoursState>({
        monday: { enabled: true, ranges: [{ ...defaultRange }] },
        tuesday: { enabled: true, ranges: [{ ...defaultRange }] },
        wednesday: { enabled: true, ranges: [{ ...defaultRange }] },
        thursday: { enabled: true, ranges: [{ ...defaultRange }] },
        friday: { enabled: true, ranges: [{ ...defaultRange }] },
        saturday: { enabled: true, ranges: [{ open: '10:00', close: '20:00' }] },
        sunday: { enabled: false, ranges: [{ ...defaultRange }] },
    });

    // Parse existing JSON value into state
    useEffect(() => {
        if (value && Array.isArray(value)) {
            const newState: HoursState = {
                monday: { enabled: false, ranges: [{ ...defaultRange }] },
                tuesday: { enabled: false, ranges: [{ ...defaultRange }] },
                wednesday: { enabled: false, ranges: [{ ...defaultRange }] },
                thursday: { enabled: false, ranges: [{ ...defaultRange }] },
                friday: { enabled: false, ranges: [{ ...defaultRange }] },
                saturday: { enabled: false, ranges: [{ ...defaultRange }] },
                sunday: { enabled: false, ranges: [{ ...defaultRange }] },
            };

            value.forEach((item: any) => {
                const day = item.day.toLowerCase();
                const [open, close] = item.time.split(' - ');

                const dayMap: { [key: string]: keyof HoursState } = {
                    lunes: 'monday',
                    martes: 'tuesday',
                    miércoles: 'wednesday',
                    jueves: 'thursday',
                    viernes: 'friday',
                    sábado: 'saturday',
                    domingo: 'sunday',
                };

                const dayKey = dayMap[day];
                if (dayKey) {
                    newState[dayKey] = { enabled: true, ranges: [{ open, close }] };
                }
            });

            setHoursState(newState);
        }
    }, []);

    // Generate JSON from state
    const generateJSON = (state: HoursState) => {
        const result: Array<{ day: string; time: string }> = [];

        Object.entries(state).forEach(([key, schedule]) => {
            if (schedule.enabled && schedule.ranges.length > 0) {
                const range = schedule.ranges[0];
                result.push({
                    day: dayNames[key as keyof HoursState],
                    time: `${range.open} - ${range.close}`,
                });
            }
        });

        return result;
    };

    // Update state and propagate to Payload
    const updateState = (newState: HoursState) => {
        setHoursState(newState);
        const json = generateJSON(newState);
        setValue(json);
    };

    const handleDayToggle = (day: keyof HoursState) => {
        const newState = {
            ...hoursState,
            [day]: {
                ...hoursState[day],
                enabled: !hoursState[day].enabled,
            },
        };
        updateState(newState);
    };

    const handleTimeChange = (
        day: keyof HoursState,
        rangeIndex: number,
        field: 'open' | 'close',
        value: string
    ) => {
        const newState = { ...hoursState };
        newState[day].ranges[rangeIndex][field] = value;
        updateState(newState);
    };

    const DayRow = ({ day }: { day: keyof HoursState }) => {
        const schedule = hoursState[day];
        const range = schedule.ranges[0];

        return (
            <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-4 items-center py-3 px-4 rounded-lg hover:bg-accent/50 transition-colors">
                {/* Checkbox Column */}
                <Switch
                    checked={schedule.enabled}
                    onCheckedChange={() => handleDayToggle(day)}
                />

                {/* Day Column */}
                <Label className="text-sm font-medium">
                    {dayNames[day]}
                </Label>

                {/* Start Time Column */}
                {schedule.enabled ? (
                    <TimePicker
                        value={range.open}
                        onChange={(value) => handleTimeChange(day, 0, 'open', value)}
                        className="w-full"
                    />
                ) : (
                    <span className="text-sm text-muted-foreground italic">—</span>
                )}

                {/* End Time Column */}
                {schedule.enabled ? (
                    <TimePicker
                        value={range.close}
                        onChange={(value) => handleTimeChange(day, 0, 'close', value)}
                        className="w-full"
                    />
                ) : (
                    <span className="text-sm text-muted-foreground italic">Cerrado</span>
                )}
            </div>
        );
    };

    return (
        <div className="hours-field space-y-4">
            <div>
                <Label className="text-base font-semibold">Horarios de Operación</Label>
                <p className="text-sm text-muted-foreground mt-1">
                    Configure los horarios de apertura y cierre para cada día de la semana
                </p>
            </div>

            <Card className="p-2">
                {/* Header Row */}
                <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-4 px-4 py-2 border-b">
                    <div className="w-9" /> {/* Empty space for checkbox */}
                    <Label className="text-xs font-semibold text-muted-foreground">Día</Label>
                    <Label className="text-xs font-semibold text-muted-foreground">Apertura</Label>
                    <Label className="text-xs font-semibold text-muted-foreground">Cierre</Label>
                </div>

                {/* Day Rows */}
                <DayRow day="monday" />
                <DayRow day="tuesday" />
                <DayRow day="wednesday" />
                <DayRow day="thursday" />
                <DayRow day="friday" />
                <DayRow day="saturday" />
                <DayRow day="sunday" />
            </Card>
        </div>
    );
};

export default HoursField;
