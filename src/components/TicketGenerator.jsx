import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Share2, User, Camera, Sparkles } from 'lucide-react'
import { typography } from '../constants/designTokens'

const TEMPLATE_SRC = encodeURI('/images/image (58).png')

// Posición y tamaño del círculo de foto (relativo al arte FLISoL Guatemala; círculo azul central)
const PHOTO_CENTER_X = 0.514
const PHOTO_CENTER_Y = 0.4925
const PHOTO_RADIUS = 0.205 // un poco menor que 0.225; diámetro ~41 % del ancho
const PHOTO_BORDER_WIDTH = 0 // sin aro: el disco del afiche no lleva borde visible

// Tipografía / pill — calibrado para ancho de plantilla 3375 px; se escala con scale = w / LAYOUT_REF_WIDTH
const LAYOUT_REF_WIDTH = 3375
const NAME_PILL_HEIGHT = 222
const NAME_PILL_Y = 0.68
const NAME_FONT_SIZE = 145
const NAME_PILL_PADDING = 160

function TicketGenerator() {
  const [name, setName] = useState('')
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoImg, setPhotoImg] = useState(null)
  const [templateImg, setTemplateImg] = useState(null)
  /** Dimensiones naturales de la plantilla (canvas = estos px para PNG nítido) */
  const [templateSize, setTemplateSize] = useState(null)
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)

  // Precargar plantilla y fijar tamaño del canvas a la misma proporción que el PNG
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setTemplateImg(img)
      setTemplateSize({
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
    }
    img.src = TEMPLATE_SRC
  }, [])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      setPhotoPreview(ev.target.result)
      const img = new Image()
      img.onload = () => setPhotoImg(img)
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  const drawTicket = useCallback(
    (ctx, canvas) => {
      const w = canvas.width
      const h = canvas.height
      const scale = w / LAYOUT_REF_WIDTH
      const borderW = PHOTO_BORDER_WIDTH * scale
      const pillH = NAME_PILL_HEIGHT * scale
      const nameFontSize = NAME_FONT_SIZE * scale
      const pillPad = NAME_PILL_PADDING * scale

      ctx.clearRect(0, 0, w, h)

      // Dibujar plantilla de fondo
      if (templateImg) {
        ctx.drawImage(templateImg, 0, 0, w, h)
      }

      // Dibujar foto del usuario en círculo (o avatar placeholder)
      const cx = w * PHOTO_CENTER_X
      const cy = h * PHOTO_CENTER_Y
      const r = w * PHOTO_RADIUS

      if (photoImg) {
        // Recortar la foto en forma circular
        ctx.save()
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.clip()

        // Calcular recorte cuadrado centrado de la foto original
        const { width: imgW, height: imgH } = photoImg
        const side = Math.min(imgW, imgH)
        const sx = (imgW - side) / 2
        const sy = (imgH - side) / 2

        ctx.drawImage(photoImg, sx, sy, side, side, cx - r, cy - r, r * 2, r * 2)
        ctx.restore()
      } else {
        // --- Avatar placeholder premium ---
        ctx.save()
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.clip()

        // Fondo con gradiente radial sutil
        const bgGrad = ctx.createRadialGradient(cx, cy - r * 0.3, 0, cx, cy, r * 1.1)
        bgGrad.addColorStop(0, 'rgba(60, 50, 80, 0.92)')
        bgGrad.addColorStop(0.6, 'rgba(35, 30, 55, 0.95)')
        bgGrad.addColorStop(1, 'rgba(18, 15, 30, 0.98)')
        ctx.fillStyle = bgGrad
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2)

        // Silueta — gradiente blanco suave
        const silGrad = ctx.createLinearGradient(cx, cy - r * 0.6, cx, cy + r * 0.95)
        silGrad.addColorStop(0, 'rgba(255,255,255,0.38)')
        silGrad.addColorStop(1, 'rgba(255,255,255,0.18)')
        ctx.fillStyle = silGrad

        // Cabeza — proporción natural
        const headR = r * 0.24
        const headCY = cy - r * 0.22
        ctx.beginPath()
        ctx.arc(cx, headCY, headR, 0, Math.PI * 2)
        ctx.fill()

        // Cuello
        const neckW = headR * 0.55
        const neckTop = headCY + headR * 0.85
        const neckBot = headCY + headR * 1.45
        ctx.beginPath()
        ctx.moveTo(cx - neckW, neckTop)
        ctx.lineTo(cx - neckW, neckBot)
        ctx.lineTo(cx + neckW, neckBot)
        ctx.lineTo(cx + neckW, neckTop)
        ctx.fill()

        // Hombros y torso — curva suave tipo campana
        const shoulderW = r * 0.78
        const shoulderY = cy + r * 0.18
        const torsoBot = cy + r * 1.1
        ctx.beginPath()
        ctx.moveTo(cx - shoulderW, torsoBot)
        ctx.quadraticCurveTo(cx - shoulderW, shoulderY, cx - neckW, neckBot)
        ctx.lineTo(cx + neckW, neckBot)
        ctx.quadraticCurveTo(cx + shoulderW, shoulderY, cx + shoulderW, torsoBot)
        ctx.lineTo(cx - shoulderW, torsoBot)
        ctx.fill()

        ctx.restore()

        // Anillo punteado interior como guía visual
        ctx.save()
        ctx.beginPath()
        ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2)
        ctx.setLineDash([r * 0.06, r * 0.06])
        ctx.strokeStyle = 'rgba(255,255,255,0.15)'
        ctx.lineWidth = r * 0.015
        ctx.stroke()
        ctx.setLineDash([])
        ctx.restore()

        // Ícono de cámara pequeño debajo de la silueta
        ctx.save()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const iconSize = r * 0.16
        const iconY = cy + r * 0.62
        // Cuerpo de la cámara
        const camW = iconSize * 1.4
        const camH = iconSize * 0.9
        const camX = cx - camW / 2
        const camY2 = iconY - camH / 2
        ctx.fillStyle = 'rgba(255,255,255,0.25)'
        ctx.beginPath()
        ctx.roundRect(camX, camY2, camW, camH, iconSize * 0.15)
        ctx.fill()
        // Lente
        ctx.beginPath()
        ctx.arc(cx, iconY, iconSize * 0.28, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(255,255,255,0.45)'
        ctx.lineWidth = iconSize * 0.09
        ctx.stroke()
        // Flash (rectángulo superior)
        const flashW = camW * 0.25
        const flashH = camH * 0.2
        ctx.fillStyle = 'rgba(255,255,255,0.25)'
        ctx.fillRect(cx - flashW * 0.1, camY2 - flashH, flashW, flashH)
        ctx.restore()
      }

      // Borde opcional alrededor del círculo (PHOTO_BORDER_WIDTH > 0 en refs de diseño)
      if (borderW > 0) {
        ctx.beginPath()
        ctx.arc(cx, cy, r + borderW / 2, 0, Math.PI * 2)
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = borderW
        ctx.stroke()
      }

      // Dibujar nombre en pill
      const pillY = h * NAME_PILL_Y
      const displayName = name || 'Tu Nombre'

      ctx.font = `bold ${nameFontSize}px Outfit, sans-serif`
      ctx.textAlign = 'center'

      const metrics = ctx.measureText(displayName)
      const textWidth = metrics.width + pillPad
      const pillX = (w - textWidth) / 2

      // Fondo blanco redondeado
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.roundRect(pillX, pillY - pillH / 2, textWidth, pillH, pillH / 2)
      ctx.fill()

      // Texto negro con centrado vertical matemático exacto
      ctx.fillStyle = '#000000'
      ctx.textBaseline = 'alphabetic'
      // Calcula el centro midiendo la distancia real desde la línea base hasta la parte superior de las letras
      const yOffset = (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2
      ctx.fillText(displayName, w / 2, pillY + yOffset)
    },
    [name, photoImg, templateImg],
  )

  // Redibujar canvas cuando cambian los datos
  useEffect(() => {
    if (canvasRef.current && templateSize) {
      const ctx = canvasRef.current.getContext('2d')
      drawTicket(ctx, canvasRef.current)
    }
  }, [drawTicket, templateSize])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.download = 'pase-flisol-utp-2026.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  const handleShare = () => {
    handleDownload()

    alert('¡Imagen descargada! En LinkedIn, adjunta tu imagen.')

    const shareText = `Este 25 de abril asistiré al FLISoL UTP 2026, un evento organizado por LEAD UTP que reúne a la comunidad tecnológica en la Universidad Tecnológica del Perú para aprender, compartir y conectar alrededor del software libre. 🚀

Quiero invitarlos a ser parte de este evento pensado para estudiantes, profesionales y entusiastas de la tecnología.

Exploraremos diversas temáticas vinculadas al software libre y tecnologías open source, como:

🎮 Videojuegos
🔐 Hacking ético
💻 Desarrollo web
🤝 Comunidad y desarrollo profesional
🤖 IA generativa
⚡ Edge AI y hardware abierto

☕ Además, habrá coffee break y networking para ampliar tu red de contactos, dinámicas y sorteos.

📍 UTP Torre Arequipa
📅 Sábado 25 de abril
🕘 9:00 a. m. – 6:00 p. m.
🎟️ Entrada gratuita

👉 Regístrate aquí: https://luma.com/0h6u3mp6

Gracias a LEAD UTP por impulsar este tipo de espacios que fortalecen la comunidad tech. 🙌

#FLISOLUTP #LEADUTP #OpenSource #SoftwareLibre #Tecnología #InteligenciaArtificial`
    const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText)}`
    window.open(linkedinUrl, '_blank')
  }

  return (
    <section id="generar-pase">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-10"
          >
            <div className="space-y-4">
              <h2 className={typography.sectionTitle}>
                Genera tu pase a <br />
                <span className="text-flisol-orange">FLISoL UTP 2026</span>
              </h2>
              <p className="text-zinc-400 text-base max-w-md">
                Sube tu foto, personaliza tu entrada y compártela en tus redes sociales para que todos sepan que serás parte del evento.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-bold text-zinc-300">
                  <Camera className="h-4 w-4 text-flisol-orange" />
                  Sube tu mejor foto
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative h-32 w-full cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed border-white/10 bg-white/5 transition-all hover:border-flisol-orange/50 hover:bg-white/10"
                >
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-zinc-500 group-hover:text-zinc-300">
                    <Sparkles className="h-6 w-6" />
                    <span className="text-sm font-medium">Click para seleccionar</span>
                  </div>
                  {photoPreview && (
                    <img src={photoPreview} className="absolute inset-0 h-full w-full object-cover opacity-40 blur-sm" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  <User className="h-3 w-3" /> Nombre
                </label>
                <input
                  type="text"
                  maxLength={30}
                  placeholder="Ej. Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white outline-none focus:border-flisol-orange/50 focus:ring-1 focus:ring-flisol-orange/20 transition-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleDownload}
                  disabled={!name}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-flisol-orange px-8 py-4 text-sm font-bold text-white shadow-glow transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
                >
                  <Download className="h-5 w-5" />
                  Obtener Pase
                </button>
                <button
                  onClick={handleShare}
                  disabled={!name}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5"
                >
                  <Share2 className="h-5 w-5" />
                  Compartir
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 relative w-full flex flex-col items-center"
          >
            <div className="absolute -inset-10 bg-flisol-orange/20 blur-[100px] opacity-30 animate-pulse pointer-events-none" />
            <div className="relative w-full max-w-[min(22rem,calc(90vw))] sm:max-w-[min(26rem,calc(90vw))] rounded-[2.5rem] border border-white/10 bg-zinc-900/80 p-3 sm:p-4 backdrop-blur-2xl shadow-2xl">
              {templateSize ? (
                <canvas
                  ref={canvasRef}
                  width={templateSize.width}
                  height={templateSize.height}
                  className="block h-auto w-full rounded-[2rem] shadow-glow-purple"
                />
              ) : (
                <div className="flex aspect-[210/297] min-h-[200px] w-full items-center justify-center rounded-[2rem] bg-white/5 px-6 py-16">
                  <span className="text-sm text-zinc-500">Cargando plantilla…</span>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default TicketGenerator
