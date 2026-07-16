import React from 'react'
import { TYPES } from '../constants/types'
import { IconTrash } from './Icons'

export default function DeviceTable({ devices, onRemoveDevice }) {
  return (
    <div className="rackapp-panel">
      <div className="rackapp-panel-header">
        <h2 className="rackapp-panel-title">Componentes del rack</h2>
        {/* Contador dinámico de equipos */}
        <span className="rackapp-count">
          {devices.length} equipo{devices.length !== 1 ? 's' : ''}
        </span>
      </div>

      {devices.length === 0 ? (
        // Estado vacío amigable
        <div className="rackapp-empty-state">
          Aún no hay equipo registrado. Agrega el primero con el botón de la derecha.
        </div>
      ) : (
        <table className="rackapp-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Modelo</th>
              <th>N/S</th>
              <th>U</th>
              <th>Posición</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => {
              const t = TYPES[d.type]
              const top = d.startU + d.sizeU - 1
              
              return (
                <tr key={d.id}>
                  {/* Celda Tipo: Punto de color identificativo + Etiqueta */}
                  <td>
                    <div className="rackapp-type-cell">
                      <span className="rackapp-type-dot" style={{ background: t.color }} />
                      {t.label}
                    </div>
                  </td>
                  <td>{d.model}</td>
                  {/* Formato monoespacio para mejorar la lectura de números de serie */}
                  <td className="rackapp-mono">{d.sn}</td>
                  <td>{d.sizeU}U</td>
                  {/* Rango de unidades ocupadas (ej: U5-U6 o solo U5) */}
                  <td className="rackapp-mono">
                    {d.sizeU > 1 ? `U${d.startU}–U${top}` : `U${d.startU}`}
                  </td>
                  <td>
                    {/* Botón de eliminación */}
                    <button 
                      className="rackapp-del-btn" 
                      onClick={() => onRemoveDevice(d.id)} 
                      title="Eliminar"
                    >
                      <IconTrash />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}