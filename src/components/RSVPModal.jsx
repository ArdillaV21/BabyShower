import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Smartphone, MessageCircle } from 'lucide-react'

export default function RSVPModal({ isOpen, onClose }) {
    const [name, setName] = useState('')

    const handleConfirm = (e) => {
        e.preventDefault()
        if (!name.trim()) return

        const message = encodeURIComponent(`¡Hola! Confirmo asistencia al Baby Shower de Máximo. Soy ${name}.`)
        const whatsappUrl = `https://wa.me/3814754114?text=${message}`

        window.open(whatsappUrl, '_blank')
        onClose()
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
                        <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold">Confirmar Asistencia</h2>
                            <p className="text-slate-500 mt-2">
                                Ingresa tu nombre para enviar la confirmación por WhatsApp
                            </p>
                        </div>

                        <form onSubmit={handleConfirm} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Tu nombre
                                </label>
                                <input
                                    required
                                    autoFocus
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ej: Juan Pérez"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Smartphone className="w-5 h-5" />
                                Abrir WhatsApp
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
