interface ShopActionProps {
    onClick?: () => void;
    label?: string;
}

export function ShopAction({ onClick, label = "Registrar Visita" }: ShopActionProps) {
    return (
        <button
            onClick={onClick}
            className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-3xl font-bold text-lg transition-all duration-300 active:scale-95 shadow-lg shadow-primary/20"
        >
            {label}
        </button>
    );
}
