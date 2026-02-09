import { Clock } from "lucide-react";

export interface ShopHour {
    day: string;
    time: string;
}

interface ShopHoursProps {
    hours: ShopHour[];
}

export function ShopHours({ hours }: ShopHoursProps) {
    if (!hours || !Array.isArray(hours) || hours.length === 0) return null;

    return (
        <div className="glass rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold">Horarios</h2>
            </div>

            <div className="space-y-3">
                {hours.map((schedule: ShopHour, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{schedule.day}</span>
                        <span className="text-sm font-bold">{schedule.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
