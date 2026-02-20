import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Baby, Moon, Sun, Smartphone, Clipboard, Check, MapPin, Clock } from 'lucide-react'
import confetti from 'canvas-confetti'
import { supabase } from './lib/supabase'
import GiftCard from './components/GiftCard'
import ReservationModal from './components/ReservationModal'
import RSVPModal from './components/RSVPModal'

const INITIAL_GIFTS = [
  { id: 1, name: 'Bolso Maternal', description: 'Para llevar todo lo de Máximo', is_priority: true, quantity_needed: 1, quantity_reserved: 0 },
  { id: 2, name: 'Cambiador', description: 'Práctico y portátil', is_priority: false, quantity_needed: 1, quantity_reserved: 0 },
  { id: 3, name: 'Bañera', description: 'Para sus primeros baños', is_priority: true, quantity_needed: 1, quantity_reserved: 0 },
  { id: 4, name: 'Ositos de algodón', description: 'Ropita cómoda y suave', is_priority: false, quantity_needed: 3, quantity_reserved: 0 },
  { id: 5, name: 'Batitas y Medio osito', description: 'Indispensables para el día a día', is_priority: false, quantity_needed: 3, quantity_reserved: 0 },
  { id: 6, name: 'Manta polar', description: 'Para que no pase frío', is_priority: false, quantity_needed: 1, quantity_reserved: 0 },
  { id: 7, name: 'Toallón', description: 'Con capucha, 100% algodón', is_priority: false, quantity_needed: 1, quantity_reserved: 0 },
  { id: 8, name: 'Pañales Pequeños', description: 'Talle P', is_priority: true, quantity_needed: 10, quantity_reserved: 0 },
  { id: 9, name: 'Pañales Medianos', description: 'Talle M', is_priority: true, quantity_needed: 10, quantity_reserved: 0 },
  { id: 10, name: 'Mamadera Avent', description: 'Calidad superior para su alimentación', is_priority: false, quantity_needed: 1, quantity_reserved: 0 },
  { id: 11, name: 'Set de Higiene', description: 'Corta uñas, saca moco y tijera', is_priority: false, quantity_needed: 1, quantity_reserved: 0 },
  { id: 12, name: 'Conjunto de algodón', description: 'Buzo y pantalón suave', is_priority: false, quantity_needed: 2, quantity_reserved: 0 },
  { id: 13, name: 'Saca leche', description: 'Ayuda práctica para mamá', is_priority: false, quantity_needed: 1, quantity_reserved: 0 },
  { id: 14, name: 'Conjunto polar', description: 'Buzo y pantalón abrigado', is_priority: false, quantity_needed: 2, quantity_reserved: 0 },
  { id: 15, name: 'Chupete y porta chupete', description: 'Sus primeros accesorios', is_priority: false, quantity_needed: 2, quantity_reserved: 0 },
  { id: 16, name: 'Babero y toalla de mano', description: 'Set para comer limpio', is_priority: false, quantity_needed: 3, quantity_reserved: 0 },
  { id: 17, name: 'Set de Baño', description: 'Champú, crema, jabón y esponja', is_priority: false, quantity_needed: 1, quantity_reserved: 0 },
  { id: 18, name: 'Toallitas y óleo', description: 'Set de limpieza esencial', is_priority: true, quantity_needed: 3, quantity_reserved: 0 },
  { id: 19, name: 'Talco y perfume', description: 'Para que esté siempre olorosito', is_priority: false, quantity_needed: 3, quantity_reserved: 0 },
  { id: 20, name: 'Pañalera', description: 'Organizador de pañales', is_priority: false, quantity_needed: 1, quantity_reserved: 0 },
]

export default function App() {
  const [gifts, setGifts] = useState(INITIAL_GIFTS)
  const [selectedGift, setSelectedGift] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRSVPOpen, setIsRSVPOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Sync with Supabase if available
    if (supabase) {
      fetchGifts()
      const subscription = supabase
        .channel('gifts_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'gifts' }, fetchGifts)
        .subscribe()

      return () => {
        supabase.removeChannel(subscription)
      }
    }
  }, [])

  const fetchGifts = async () => {
    const { data, error } = await supabase.from('gifts').select('*').order('id', { ascending: true })
    if (data) setGifts(data)
  }

  const handleReserve = (gift) => {
    setSelectedGift(gift)
    setIsModalOpen(true)
  }

  const confirmReservation = async (giftId, userName, selectedQuantity) => {
    if (supabase) {
      // Obtener el estado actual del regalo
      const { data: currentGift } = await supabase
        .from('gifts')
        .select('*')
        .eq('id', giftId)
        .single()

      if (currentGift) {
        const newQuantityReserved = (currentGift.quantity_reserved || 0) + selectedQuantity
        const currentReservedBy = currentGift.reserved_by ? currentGift.reserved_by + ', ' : ''
        const newReservedBy = currentReservedBy + userName

        const { error } = await supabase
          .from('gifts')
          .update({
            reserved_by: newReservedBy,
            quantity_reserved: newQuantityReserved
          })
          .eq('id', giftId)

        if (error) alert('Error al reservar. Intenta de nuevo.')
      }
    } else {
      // Mock update
      setGifts(prev => prev.map(g => {
        if (g.id === giftId) {
          const newQuantityReserved = (g.quantity_reserved || 0) + selectedQuantity
          const currentReservedBy = g.reserved_by ? g.reserved_by + ', ' : ''
          return {
            ...g,
            reserved_by: currentReservedBy + userName,
            quantity_reserved: newQuantityReserved
          }
        }
        return g
      }))
    }

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#EC4899', '#FFFFFF']
    })
  }


  const copyAlias = () => {
    navigator.clipboard.writeText('gabialbornoz135')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="min-h-screen font-body bg-background-light text-slate-800 transition-colors duration-300">

        {/* Navigation */}
        <nav className="fixed w-full z-50 glass px-6 py-4 flex justify-between items-center transition-all">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-display text-2xl text-primary">Máximo</span>
          </div>
          <div className="flex gap-4 items-center">
            <a
              className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md text-sm active:scale-95"
              href="#asistencia"
            >
              Confirmar
            </a>
          </div>
        </nav>

        {/* Hero */}
        <header className="relative pt-24 pb-16 px-6 hero-pattern">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex justify-center gap-4 text-4xl"
            >
              <Heart className="text-secondary animate-bounce" />
              <Baby className="text-primary animate-bounce delay-150" />
              <Heart className="text-secondary animate-bounce delay-300" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="font-display text-5xl md:text-7xl mb-4 text-slate-900 leading-tight"
            >
              La dulce espera está por terminar
            </motion.h1>

            <p className="text-xl md:text-2xl font-light mb-6 max-w-2xl mx-auto italic opacity-80">
              Te invitamos al baby shower de nuestro príncipe <span className="font-accent text-primary">Máximo</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 px-4">
              {[
                { src: "/1.jpeg", caption: "Primera ecografía" },
                { src: "/2.jpeg", caption: "Nuestro pequeño" },
                { src: "/3.jpeg", caption: "¡Te esperamos!" }
              ].map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, rotate: i === 0 ? -3 : i === 1 ? 0 : 3 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: i === 0 ? -3 : i === 1 ? 0 : 3 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="bg-white p-3 pb-8 shadow-2xl rounded-sm hover:rotate-0 hover:scale-105 transition-all duration-500 cursor-pointer group"
                >
                  <div className="overflow-hidden bg-slate-100 aspect-[4/5] mb-4">
                    <img
                      src={img.src}
                      alt={img.caption}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <p className="font-display text-xl text-slate-500">{img.caption}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </header>

        {/* Story Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
              <img
                alt="Gabi y pareja"
                className="relative z-10 w-full rounded-3xl shadow-2xl"
                src="/4.jpeg"
              />
              <div className="absolute -bottom-6 -right-6 glass p-6 rounded-2xl shadow-lg z-20">
                <p className="font-display text-2xl text-secondary">Te amamos mucho</p>
              </div>
            </div>
            <div>
              <h2 className="font-display text-4xl mb-6 text-primary">Nuestra Alegría</h2>
              <p className="text-lg mb-8 leading-relaxed opacity-90">
                Estamos muy felices de compartir este momento tan especial con ustedes. Máximo llegará pronto para llenar nuestros días de luz y queremos que seas parte de su primera gran fiesta.
              </p>

              <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-primary" />
                  Regalo en Efectivo
                </h3>
                <p className="text-sm opacity-80 mb-4 text-slate-600">Si deseas hacernos una contribución:</p>
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-blue-200">
                  <span className="font-mono font-bold text-primary">gabialbornoz135</span>
                  <button
                    onClick={copyAlias}
                    className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-primary transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gifts Section */}
        <section className="py-20 px-6" id="regalos">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-5xl mb-4 text-slate-900">Lista de Regalos</h2>
              <p className="text-slate-500">Elige un detalle para el pequeño Máximo (Se marcará como reservado)</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {gifts.map(gift => (
                <GiftCard
                  key={gift.id}
                  gift={gift}
                  onReserve={handleReserve}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="py-20 px-6 bg-white" id="ubicacion">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center gap-6 mb-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center">
                  <MapPin className="w-8 h-8" />
                </div>
                <p className="font-bold text-slate-900">San Miguel de Tucumán</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-pink-50 text-secondary rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8" />
                </div>
                <p className="font-bold text-slate-900">17:30 a 21:30hs</p>
              </div>
            </div>

            <h2 className="font-display text-5xl mb-6 text-slate-900">¿Cuándo y Dónde?</h2>
            <p className="text-2xl text-primary font-bold mb-10">
              Sábado 14 de Marzo
            </p>

            <a
              href="https://maps.app.goo.gl/gwrfLbTVN796TbxZ6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95"
            >
              Ver ubicación en Google Maps
            </a>
          </div>
        </section>

        {/* RSVP Section */}
        <section className="py-20 px-6 bg-slate-50" id="asistencia">
          <div className="max-w-4xl mx-auto glass p-10 md:p-16 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-2xl"></div>

            <h2 className="font-display text-5xl mb-6 relative z-10">¿Nos acompañás?</h2>
            <p className="text-lg mb-10 text-slate-600 relative z-10">
              Por favor, confirmanos tu asistencia antes de la fecha para poder organizar todo con amor.
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center relative z-10">
              <button
                onClick={() => setIsRSVPOpen(true)}
                className="group flex items-center gap-4 bg-white p-6 rounded-3xl shadow-md border border-slate-100 hover:scale-105 transition-all w-full md:w-auto text-left"
              >
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                  <Smartphone />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-slate-400">WhatsApp</p>
                  <p className="text-xl font-bold tracking-tight">381 4754114</p>
                </div>
              </button>
              <button
                onClick={() => setIsRSVPOpen(true)}
                className="bg-primary text-white px-10 py-6 rounded-3xl font-bold text-xl hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all w-full md:w-auto active:scale-95"
              >
                Confirmar Asistencia
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 text-center border-t border-slate-100">
          <p className="font-display text-3xl text-primary mb-4">Máximo</p>
          <p className="text-sm text-slate-400 italic">"Te amamos mucho... tus papis"</p>
          <div className="mt-8 flex justify-center gap-6 opacity-30">
            <Heart className="w-5 h-5" />
            <Baby className="w-5 h-5" />
            <Heart className="w-5 h-5" />
          </div>
        </footer>

        <ReservationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          gift={selectedGift}
          onConfirm={confirmReservation}
        />

        <RSVPModal
          isOpen={isRSVPOpen}
          onClose={() => setIsRSVPOpen(false)}
        />
      </div>
    </div>
  )
}
