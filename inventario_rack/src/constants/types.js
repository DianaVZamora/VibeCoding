import { IconServer, IconSwitch, IconPatch, IconPdu, IconBox } from '../components/Icons'

// Diccionario de configuración de equipos. 
// Permite añadir nuevos tipos fácilmente sin tocar el código de los componentes.
export const TYPES = {
  servidor: { label: 'Servidor', color: '#34D399', Icon: IconServer },
  switch: { label: 'Switch', color: '#4EA8DE', Icon: IconSwitch },
  patch: { label: 'Patch panel', color: '#F2A73B', Icon: IconPatch },
  pdu: { label: 'PDU', color: '#A78BFA', Icon: IconPdu },
  otro: { label: 'Otro', color: '#94A3B8', Icon: IconBox },
}

// Alto estándar de una unidad de rack (U) en píxeles para el renderizado dinámico del CSS
export const UNIT_H = 22