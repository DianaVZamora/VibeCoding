import React from 'react'
import { TYPES, UNIT_H } from '../constants/types'

export default function RackVisualizer({ rackSize, devices, usedU, pct }) {
  
  // 1. Construir las filas físicas del rack (de arriba hacia abajo)
  const rows = []
  let row = rackSize

  while (row >= 1) {
    // Buscamos si hay algún dispositivo que termine en la unidad actual
    const dev = devices.find((d) => row === d.startU + d.sizeU - 1)
    if (dev) {
      // Si existe, insertamos el componente completo y saltamos su altura en U
      rows.push({ kind: 'device', device: dev, top: row })
      row -= dev.sizeU
    } else {
      // Si no hay nada, agregamos una fila "U" vacía
      rows.push({ kind: 'empty', unit: row })
      row -= 1
    }
  }

  return (
    <div className="rackapp-side">
      {/* Indicador superior de capacidad / ocupación */}
      <div className="rackapp-util">
        <div className="rackapp-util-row">
          <span>Ocupación</span>
          <span>{usedU}U / {rackSize}U</span>
        </div>
        <div className="rackapp-util-track">
          {/* Barra de progreso con gradiente */}
          <div className="rackapp-util-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Estructura física del Rack */}
      <div className="rackapp-rack-frame">
        <div className="rackapp-rack-scroll">
          {rows.map((r) =>
            r.kind === 'device' ? (
              // Fila ocupada por un dispositivo real
              <div 
                className="rackapp-rack-row" 
                key={r.device.id} 
                style={{ height: r.device.sizeU * UNIT_H }}
              >
                {/* Riel izquierdo de montaje (orificios/holes) */}
                <div className="rackapp-rail">
                  {Array.from({ length: r.device.sizeU }).map((_, i) => (
                    <span className="rackapp-hole" key={i} />
                  ))}
                </div>

                {/* Chasis del equipo pintado con su color representativo */}
                <div
                  className="rackapp-device"
                  style={{ background: TYPES[r.device.type].color, color: TYPES[r.device.type].color }}
                >
                  {/* Efecto de rejilla de ventilación por CSS */}
                  <div className="rackapp-device-vents" />
                  {/* Pequeña luz LED de encendido */}
                  <span className="rackapp-device-led" />
                  
                  {/* Datos del hardware */}
                  <div className="rackapp-device-text">
                    <span className="rackapp-device-model">{r.device.model}</span>
                    <span className="rackapp-device-sub">
                      {r.device.sn} · U{r.device.startU}
                      {r.device.sizeU > 1 ? `–U${r.device.startU + r.device.sizeU - 1}` : ''}
                    </span>
                  </div>
                </div>

                {/* Riel derecho de montaje */}
                <div className="rackapp-rail">
                  {Array.from({ length: r.device.sizeU }).map((_, i) => (
                    <span className="rackapp-hole" key={i} />
                  ))}
                </div>
              </div>
            ) : (
              // Fila de espacio en blanco (U vacía)
              <div className="rackapp-rack-row" key={`u${r.unit}`} style={{ height: UNIT_H }}>
                <div className="rackapp-rail">
                  <span className="rackapp-hole" />
                </div>
                <div className="rackapp-slot">U{r.unit}</div>
                <div className="rackapp-rail">
                  <span className="rackapp-hole" />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}