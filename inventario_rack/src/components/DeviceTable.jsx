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
              <th>Posición</th>
              <th>Tamaño</th>
              <th>Tipo</th>
              <th>Modelo</th>
              <th>S/N</th>
              <th>IP</th>       {/* NUEVA COLUMNA */}
              <th>Admin</th>    {/* NUEVA COLUMNA */}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => {
              const t = TYPES[d.type]
              const top = d.startU + d.sizeU - 1
              
              // Aseguramos que la URL tenga un formato que el navegador entienda como link externo
              let formattedUrl = d.adminUrl ? d.adminUrl.trim() : ''
              if (formattedUrl && !/^https?:\/\//i.test(formattedUrl)) {
                formattedUrl = `http://${formattedUrl}`
              }
              
              return (
                <tr key={d.id}>
                  {/* Rango de unidades ocupadas (ej: U5-U6 o solo U5) */}
                  <td className="rackapp-mono">
                    {d.sizeU > 1 ? `U${d.startU}–U${top}` : `U${d.startU}`}
                  </td>

                  {/* Tamaño en U */}
                  <td>{d.sizeU}U</td>

                  {/* Celda Tipo: Punto de color identificativo + Etiqueta */}
                  <td>
                    <div className="rackapp-type-cell">
                      <span className="rackapp-type-dot" style={{ background: t.color }} />
                      {t.label}
                    </div>
                  </td>

                  {/* Modelo */}
                  <td>{d.model}</td>

                  {/* Formato monoespacio para mejorar la lectura de números de serie */}
                  <td className="rackapp-mono">{d.sn}</td>

                  {/* IP: Se muestra en un tag gris sutil o una raya si está vacía */}
                  <td>
                    {d.ip ? (
                      <code style={{ 
                        background: '#2d3748', 
                        color: '#cbd5e0', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        fontFamily: 'monospace'
                      }}>
                        {d.ip}
                      </code>
                    ) : (
                      <span style={{ color: '#4a5568' }}>—</span>
                    )}
                  </td>

                  {/* Admin: Botón directo que se abre en otra pestaña */}
                  <td>
                    {formattedUrl ? (
                      <a 
                        href={formattedUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 8px',
                          background: '#3182ce',
                          color: 'white',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}
                      >
                        Ir ↗
                      </a>
                    ) : (
                      <span style={{ color: '#4a5568' }}>—</span>
                    )}
                  </td>

                  {/* Botón de eliminación */}
                  <td>
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