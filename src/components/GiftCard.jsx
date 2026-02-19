import { motion } from 'framer-motion'
import { Gift, CheckCircle2, Package, Bath, Shirt, ToyBrick, ShoppingBag, Baby } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export default function GiftCard({ gift, onReserve }) {
    const isReserved = !!gift.reserved_by

    const getIcon = (name) => {
        const lowercaseName = name.toLowerCase()
        if (lowercaseName.includes('bolso')) return <ShoppingBag className="w-8 h-8" />
        if (lowercaseName.includes('bañera')) return <Bath className="w-8 h-8" />
        if (lowercaseName.includes('pañal')) return <Baby className="w-8 h-8" />
        if (lowercaseName.includes('ropa') || lowercaseName.includes('ropita')) return <Shirt className="w-8 h-8" />
        if (lowercaseName.includes('juguete')) return <ToyBrick className="w-8 h-8" />
        if (lowercaseName.includes('manta')) return <Package className="w-8 h-8" />
        return <Gift className="w-8 h-8" />
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={!isReserved ? { y: -5, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" } : {}}
            className={cn(
                "bg-white p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center transition-all duration-300 relative",
                isReserved && "opacity-60 grayscale-[0.5]"
            )}
        >
            {gift.quantity_needed > 1 && !isReserved && (
                <span className="absolute top-4 right-4 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-lg">
                    Faltan {gift.quantity_needed - (gift.quantity_reserved || 0)}
                </span>
            )}

            <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors",
                isReserved
                    ? "bg-slate-100 text-slate-400"
                    : gift.is_priority
                        ? "bg-pink-100 text-secondary"
                        : "bg-blue-100 text-primary"
            )}>
                {isReserved ? <CheckCircle2 className="w-8 h-8" /> : getIcon(gift.name)}
            </div>

            <h3 className="font-bold text-lg mb-1">{gift.name}</h3>
            <p className="text-sm text-slate-500 mb-6">{gift.description}</p>

            {isReserved ? (
                <div className="mt-auto w-full">
                    <button
                        disabled
                        className="w-full bg-slate-200 text-slate-500 py-3 rounded-2xl font-semibold cursor-not-allowed"
                    >
                        Reservado por {gift.reserved_by}
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => onReserve(gift)}
                    className={cn(
                        "mt-auto w-full py-3 rounded-2xl font-semibold transition-all shadow-md active:scale-95",
                        gift.is_priority
                            ? "bg-secondary hover:bg-pink-600 text-white shadow-pink-200"
                            : "bg-primary hover:bg-blue-600 text-white shadow-blue-200"
                    )}
                >
                    {gift.quantity_needed > 1 ? `Aportar` : 'Seleccionar'}
                </button>
            )}
        </motion.div>
    )
}
