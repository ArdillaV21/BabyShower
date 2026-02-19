import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart } from 'lucide-react'

export default function ReservationModal({ isOpen, onClose, gift, onConfirm }) {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim()) return

        setLoading(true)
        try {
            await onConfirm(gift.id, name)

            // Notificar por WhatsApp
            const message = encodeURIComponent(`¡Hola! Te aviso que ya reservé "${gift.name}" para el Baby Shower de Máximo. Soy ${name}.`)
            const whatsappUrl = `https://wa.me/3814754114?text=${message}`

            // Pequeño delay para que se guarde bien y se vea la animación del botón si la hay
            setTimeout(() => {
                window.open(whatsappUrl, '_blank')
            }, 500)

            setName('')
            onClose()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-[2rem] p-8 shadow-2xl z-[70] overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary" />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-8 h-8 text-secondary fill-secondary" />
                            </div>
                            <h2 className="text-2xl font-bold">¡Muchas gracias!</h2>
                            <p className="text-slate-500 mt-2">
                                Estás reservando: <span className="font-bold text-slate-900">{gift?.name}</span>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Tu nombre completo
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ej: María García"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !name.trim()}
                                className="w-full bg-primary hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:grayscale"
                            >
                                {loading ? 'Reservando...' : 'Confirmar Reserva'}
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
