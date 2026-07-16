import React, { useState } from 'react'
import { TYPES, UNIT_H } from '../constants/types'

export default function RackVisualizer({ rackSize, devices, usedU, pct, onMoveDevice }) {
  // Estado opcional para dar un feedback visual de "ranura activa" cuando arrastras encima de ella
  const [dragOverUnit, setDragOverUnit] = useState(null)

  // 1. Construir las filas físicas del rack (de arriba hacia abajo)
  const rows = []
  let row = rackSize

  while (row >= 1) {
    const dev = devices.find((d) => row === d.startU + d.sizeU - 1)
    if (dev) {
      rows.push({ kind: 'device', device: dev, top: row })
      row -= dev.sizeU
    } else {
      rows.push({ kind: 'empty', unit: row })
      row -= 1
    }
  }

  // --- Handlers de Drag and Drop ---
  const handleDragStart = (e, deviceId) => {
    // Almacena el ID del componente que se va a mover
    e.dataTransfer.setData('text/plain', deviceId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, unit) => {
    // Prevenir el comportamiento por defecto es OBLIGATORIO para permitir el "Drop"
    e.preventDefault()
    setDragOverUnit(unit)
  }

  const handleDragLeave = () => {
    setDragOverUnit(null)
  }

  const handleDrop = (e, targetUnit) => {
    e.preventDefault()
    setDragOverUnit(null)
    const deviceId = e.dataTransfer.getData('text/plain')
    if (deviceId && onMoveDevice) {
      onMoveDevice(deviceId, targetUnit)
    }
  }

  return (
    <div className="rackapp-side">
      {/* Indicador superior de capacidad / ocupación */}
      <div className="rackapp-util">
        <div className="rackapp-util-row">
          <span>Ocupación (Arrastra los componentes para moverlos)</span>
          <span>{usedU}U / {rackSize}U</span>
        </div>
        <div className="rackapp-util-track">
          <div className="rackapp-util-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Estructura física del Rack */}
      <div className="rackapp-rack-frame">
        <div className="rackapp-rack-scroll">
          {rows.map((r) =>
            r.kind === 'device' ? (
              // DISPOSITIVO ARRASTRABLE
              <div 
                className="rackapp-rack-row" 
                key={r.device.id} 
                style={{ height: r.device.sizeU * UNIT_H }}
              >
                <div className="rackapp-rail">
                  {Array.from({ length: r.device.sizeU }).map((_, i) => (
                    <span className="rackapp-hole" key={i} />
                  ))}
                </div>

                <div
                  className="rackapp-device"
                  draggable="true" // Habilita que el elemento se pueda arrastrar
                  onDragStart={(e) => handleDragStart(e, r.device.id)}
                  style={{ 
                    background: TYPES[r.device.type].color, 
                    color: TYPES[r.device.type].color,
                    cursor: 'grab' // Cambia el cursor para indicar que es arrastrable
                  }}
                  onDragEnd={() => setDragOverUnit(null)}
                >
                  <div className="rackapp-device-vents" />
                  <span className="rackapp-device-led" />
                  
                  <div className="rackapp-device-text">
                    <span className="rackapp-device-model">{r.device.model}</span>
                    <span className="rackapp-device-sub">
                      {r.device.sn} · U{r.device.startU}
                      {r.device.sizeU > 1 ? `–U${r.device.startU + r.device.sizeU - 1}` : ''}
                    </span>
                  </div>
                </div>

                <div className="rackapp-rail">
                  {Array.from({ length: r.device.sizeU }).map((_, i) => (
                    <span className="rackapp-hole" key={i} />
                  ))}
                </div>
              </div>
            ) : (
              // RANURA VACÍA (ZONA DE SOLTAR)
              <div 
                className="rackapp-rack-row" 
                key={`u${r.unit}`} 
                style={{ 
                  height: UNIT_H,
                  // Si estamos arrastrando sobre esta ranura, pintamos un borde o color sutil
                  backgroundColor: dragOverUnit === r.unit ? '#232B38' : 'transparent',
                  transition: 'background-color 0.15s ease'
                }}
                onDragOver={(e) => handleDragOver(e, r.unit)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, r.unit)}
              >
                <div className="rackapp-rail">
                  <span className="rackapp-hole" />
                </div>
                <div className="rackapp-slot" style={{ color: dragOverUnit === r.unit ? '#F2A73B' : '#4A5568' }}>
                  U{r.unit} {dragOverUnit === r.unit ? '← Soltar aquí' : ''}
                </div>
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