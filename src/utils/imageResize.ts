// src/utils/imageResize.ts
//
// FIX (fotos não persistiam): as fotos eram convertidas para base64 em
// resolução total (uma foto de câmara de telemóvel facilmente tem vários MB).
// Isso estourava:
//   1) o limite de tamanho de pedido da API (falha silenciosa no servidor)
//   2) o limite do localStorage do browser (~5-10MB no total), sobretudo
//      grave no telemóvel — explicando por que lá nem chegava a persistir
//      localmente.
//
// Esta função redimensiona a imagem num <canvas> antes de gerar o base64,
// garantindo que qualquer foto fica sempre pequena (tipicamente dezenas de
// KB), independentemente do tamanho original.

export function resizeImageToDataUrl(
  file: File,
  maxDim = 800,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          } else {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas 2D not supported'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = ev.target?.result as string
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
