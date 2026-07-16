import React from 'react'

// Icono para servidores (representa dos bahías de rack con leds)
export const IconServer = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <rect x="3" y="4" width="18" height="6" rx="1" />
    <rect x="3" y="14" width="18" height="6" rx="1" />
    <circle cx="7" cy="7" r="0.6" fill="currentColor" />
    <circle cx="7" cy="17" r="0.6" fill="currentColor" />
  </svg>
)

// Icono para switches de red (representa puertos ethernet alineados)
export const IconSwitch = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <rect x="3" y="8" width="18" height="8" rx="1" />
    <line x1="6" y1="8" x2="6" y2="16" />
    <line x1="9" y1="8" x2="9" y2="16" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="15" y1="8" x2="15" y2="16" />
    <line x1="18" y1="8" x2="18" y2="16" />
  </svg>
)

// Icono para patch panels (puertos circulares de parcheo)
export const IconPatch = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <rect x="3" y="9" width="18" height="6" rx="1" />
    {[5, 8, 11, 14, 17].map((x) => (
      <circle key={x} cx={x} cy="12" r="0.9" fill="currentColor" stroke="none" />
    ))}
  </svg>
)

// Icono para las PDU verticales/horizontales (tomas de corriente alineadas)
export const IconPdu = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <rect x="9" y="3" width="6" height="18" rx="1" />
    <circle cx="12" cy="7" r="0.6" fill="currentColor" />
    <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    <circle cx="12" cy="17" r="0.6" fill="currentColor" />
  </svg>
)

// Icono genérico para otros tipos de hardware
export const IconBox = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <rect x="4" y="6" width="16" height="13" rx="1" />
    <line x1="4" y1="10" x2="20" y2="10" />
  </svg>
)

// Icono de suma (+) para botones de acción
export const IconPlus = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

// Icono de cierre (X) para modales
export const IconX = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
)

// Icono de papelera de reciclaje para eliminar componentes
export const IconTrash = (p) => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <line x1="4" y1="7" x2="20" y2="7" />
    <path d="M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13" />
    <line x1="9" y1="7" x2="9" y2="4" />
    <line x1="15" y1="7" x2="15" y2="4" />
    <line x1="9" y1="4" x2="15" y2="4" />
  </svg>
)