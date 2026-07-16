import React, { useState } from 'react'
import { TYPES } from '../constants/types'
import { IconX } from './Icons'

const emptyForm = { type: 'servidor', model: '', sn: '', sizeU: 1, startU: '' }

export default function DeviceModal({ rackSize, devices, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  // 1. Obtener todas las posiciones de rack que ya están ocupadas por otros equipos
  const getOccupiedUnits = () => {
    const occupiedSet = new Set()
    devices.forEach((d) => {
      for (let u = d.startU; u <= d.startU + d.sizeU - 1; u++) {
        occupiedSet.add(u)
      }
    })
    return occupiedSet
  }

  // 2. Algoritmo automático: Busca el primer espacio libre disponible de arriba hacia abajo
  const findFreeSlot = (sizeU) => {
    const occupied = getOccupiedUnits()
    for (let top = rackSize; top >= sizeU; top--) {
      const bottom = top - sizeU + 1
      let isFree = true
      // Comprobar si todas las U requeridas en este bloque están vacías
      for (let u = bottom; u <= top; u++) {
        if (occupied.has(u)) {
          isFree = false
          break
        }
      }
      if (isFree) return bottom
    }
    return null
  }

  // 3. Validador y procesador de envío de formulario
  const handleSubmit = (e) => {
    e.preventDefault()
    const model = form.model.trim()
    const sn = form.sn.trim()
    const sizeU = parseInt(form.sizeU, 10)

    // Validaciones básicas de campos
    if (!model) return setError('El modelo es obligatorio.')
    if (!sn) return setError('El número de serie es obligatorio.')
    if (!Number.isInteger(sizeU) || sizeU < 1) {
      return setError('El tamaño (U) debe ser un entero mayor a 0.')
    }
    if (sizeU > rackSize) {
      return setError('El equipo es más grande que la capacidad máxima del rack.')
    }

    let startU
    // Caso A: El usuario dejó la posición en "Auto" (vacía)
    if (form.startU === '' || form.startU === null) {
      startU = findFreeSlot(sizeU)
      if (startU === null) {
        return setError('No hay espacio libre continuo en el rack para este tamaño.')
      }
    } 
    // Caso B: El usuario asignó manualmente una posición específica
    else {
      startU = parseInt(form.startU, 10)
      if (!Number.isInteger(startU) || startU < 1 || startU + sizeU - 1 > rackSize) {
        return setError(`La posición debe estar entre 1 y ${rackSize}, y el equipo debe caber completo.`)
      }
      
      // Validar colisiones / solapamientos con otros equipos
      const occupied = getOccupiedUnits()
      for (let u = startU; u <= startU + sizeU - 1; u++) {
        if (occupied.has(u)) {
          return setError(`La unidad U${u} ya está ocupada por otro dispositivo.`)
        }
      }
    }

    // Instancia del nuevo dispositivo
    const newDevice = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      type: form.type,
      model,
      sn,
      sizeU,
      startU,
    }

    onSave(newDevice)
  }

  return (
    <div className="rackapp-modal-overlay" onClick={onClose}>
      <div className="rackapp-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Encabezado */}
        <div className="rackapp-modal-header">
          <h3 className="rackapp-modal-title">Agregar elemento al rack</h3>
          <button className="rackapp-modal-close" onClick={onClose}>
            <IconX />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {error && <div className="rackapp-error">{error}</div>}

          {/* Selector de Tipo de Equipo */}
          <div className="rackapp-field">
            <label>Tipo de equipo</label>
            <select 
              value={form.type} 
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {Object.entries(TYPES).map(([key, t]) => (
                <option key={key} value={key}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Input de Modelo */}
          <div className="rackapp-field">
            <label>Modelo</label>
            <input
              type="text"
              placeholder="p. ej. Dell PowerEdge R750"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              autoFocus
            />
          </div>

          {/* Input de Número de Serie */}
          <div className="rackapp-field">
            <label>Número de serie (S/N)</label>
            <input
              type="text"
              placeholder="p. ej. SN-8842A"
              value={form.sn}
              onChange={(e) => setForm({ ...form, sn: e.target.value })}
            />
          </div>

          {/* Inputs de tamaño y posición en paralelo */}
          <div className="rackapp-field-row">
            <div className="rackapp-field">
              <label>Tamaño (U)</label>
              <input
                type="number"
                min="1"
                max={rackSize}
                value={form.sizeU}
                onChange={(e) => setForm({ ...form, sizeU: e.target.value })}
              />
            </div>
            <div className="rackapp-field">
              <label>Posición (U) — opcional</label>
              <input
                type="number"
                min="1"
                max={rackSize}
                placeholder="Auto"
                value={form.startU}
                onChange={(e) => setForm({ ...form, startU: e.target.value })}
              />
            </div>
          </div>
          <p className="rackapp-hint">
            Si dejas la posición vacía, se coloca automáticamente en el primer espacio libre disponible.
          </p>

          {/* Botones de acción final */}
          <div className="rackapp-modal-actions">
            <button type="button" className="rackapp-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="rackapp-btn-primary">
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}