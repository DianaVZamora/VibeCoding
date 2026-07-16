import { useState } from 'react'
import { IconPlus } from './components/Icons'
import DeviceTable from './components/DeviceTable'
import RackVisualizer from './components/RackVisualizer'
import DeviceModal from './components/DeviceModal'

function App() {
  const [rackSize, setRackSize] = useState(42)
  const [devices, setDevices] = useState([])
  const [showModal, setShowModal] = useState(false)

  // 1. Acciones de alteración del estado global
  const handleAddDevice = (newDevice) => {
    // Al añadir un equipo, reordenamos la lista de arriba hacia abajo basándonos en startU
    setDevices((prev) => [...prev, newDevice].sort((a, b) => b.startU - a.startU))
    setShowModal(false)
  }

  const handleRemoveDevice = (id) => {
    setDevices((prev) => prev.filter((d) => d.id !== id))
  }

  const handleMoveDevice = (deviceId, newStartU) => {
    setDevices((prev) => {
      const targetDevice = prev.find((d) => d.id === deviceId)
      if (!targetDevice) return prev

      // Validar que el dispositivo no se salga por arriba del rack
      if (newStartU + targetDevice.sizeU - 1 > rackSize) return prev

      // Validar colisiones con otros dispositivos (excluyendo el que estamos moviendo)
      const occupiedUnits = new Set()
      prev.forEach((d) => {
        if (d.id === deviceId) return
        for (let u = d.startU; u <= d.startU + d.sizeU - 1; u++) {
          occupiedUnits.add(u)
        }
      })

      for (let u = newStartU; u <= newStartU + targetDevice.sizeU - 1; u++) {
        if (occupiedUnits.has(u)) return prev // Hay colisión, cancelar movimiento
      }

      // Si todo está libre, actualizar la posición del dispositivo
      const updated = prev.map((d) => 
        d.id === deviceId ? { ...d, startU: newStartU } : d
      )
      
      // Volver a ordenar para que la renderización física se mantenga consistente
      return updated.sort((a, b) => b.startU - a.startU)
    })
  }

  // 2. Cálculos globales de utilidad y porcentajes de espacio usado
  const usedU = devices.reduce((acc, d) => acc + d.sizeU, 0)
  const pct = Math.min(100, Math.round((usedU / rackSize) * 100))

  return (
    <div className="rackapp">
      {/* Mantenemos tus estilos aislados en la etiqueta style */}
      <style>{`
        .rackapp {
          min-height: 100vh;
          background: #0B0E14;
          color: #E7ECF3;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          padding: 32px;
          box-sizing: border-box;
        }
        .rackapp * { box-sizing: border-box; }
        .rackapp-header { margin-bottom: 24px; display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .rackapp-title { font-size: 22px; font-weight: 700; letter-spacing: 0.2px; margin: 0; }
        .rackapp-title span { color: #F2A73B; }
        .rackapp-subtitle { color: #7C8798; font-size: 13px; margin-top: 4px; }
        .rackapp-size-field { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #9AA5B4; }
        .rackapp-size-field input {
          width: 64px; background: #131820; border: 1px solid #232B38; color: #E7ECF3;
          border-radius: 6px; padding: 6px 8px; font-size: 13px; font-family: inherit;
        }
        .rackapp-layout { display: grid; grid-template-columns: 1fr 380px; gap: 24px; align-items: start; }
        @media (max-width: 900px) { .rackapp-layout { grid-template-columns: 1fr; } }

        .rackapp-panel { background: #131820; border: 1px solid #232B38; border-radius: 12px; padding: 18px; }
        .rackapp-panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .rackapp-panel-title { font-size: 14px; font-weight: 600; color: #E7ECF3; margin: 0; }
        .rackapp-count { font-size: 12px; color: #7C8798; background: #0B0E14; border: 1px solid #232B38; padding: 2px 8px; border-radius: 999px; }

        .rackapp-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .rackapp-table th {
          text-align: left; font-weight: 600; color: #7C8798; font-size: 11px; text-transform: uppercase;
          letter-spacing: 0.06em; padding: 0 10px 10px 10px; border-bottom: 1px solid #232B38;
        }
        .rackapp-table td { padding: 10px; border-bottom: 1px solid #1B222D; vertical-align: middle; }
        .rackapp-table tr:last-child td { border-bottom: none; }
        .rackapp-type-cell { display: flex; align-items: center; gap: 8px; white-space: nowrap; }
        .rackapp-type-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
        .rackapp-mono { font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace; font-size: 12.5px; color: #C7D0DC; }
        .rackapp-del-btn {
          background: transparent; border: none; color: #7C8798; cursor: pointer; padding: 6px;
          border-radius: 6px; display: inline-flex; transition: color .15s, background .15s;
        }
        .rackapp-del-btn:hover { color: #F26D6D; background: #1B222D; }

        .rackapp-empty-state { text-align: center; color: #7C8798; font-size: 13px; padding: 32px 12px; }

        .rackapp-side { display: flex; flex-direction: column; gap: 16px; }
        .rackapp-add-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: #F2A73B; color: #1A1400; border: none; border-radius: 10px;
          padding: 12px 16px; font-size: 14px; font-weight: 700; cursor: pointer;
          transition: filter .15s;
        }
        .rackapp-add-btn:hover { filter: brightness(1.08); }

        .rackapp-util { font-size: 12px; color: #9AA5B4; }
        .rackapp-util-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
        .rackapp-util-track { width: 100%; height: 6px; border-radius: 999px; background: #232B38; overflow: hidden; }
        .rackapp-util-fill { height: 100%; background: linear-gradient(90deg, #F2A73B, #4EA8DE); border-radius: 999px; }

        .rackapp-rack-frame { background: #0F141C; border: 1px solid #232B38; border-radius: 10px; padding: 10px 0; }
        .rackapp-rack-scroll { max-height: 560px; overflow-y: auto; }
        .rackapp-rack-row { display: flex; align-items: stretch; }
        .rackapp-rail {
          width: 14px; flex-shrink: 0; display: flex; flex-direction: column; align-items: center;
          justify-content: space-evenly; background: #0B0E14;
        }
        .rackapp-hole { width: 3px; height: 3px; border-radius: 50%; background: #2C3A4C; }

        .rackapp-slot {
          width: 100%; flex: 1; display: flex; align-items: center; padding-left: 10px;
          border-bottom: 1px dashed #1B222D; color: #4A5568; font-size: 10px;
          font-family: "SFMono-Regular", Consolas, Menlo, monospace;
        }
        .rackapp-device {
          flex: 1; margin: 1px 6px; border-radius: 5px; display: flex; align-items: center;
          gap: 8px; padding: 0 10px; position: relative; overflow: hidden;
        }
        .rackapp-device-vents {
          position: absolute; inset: 0; opacity: 0.15;
          background-image: repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 8px);
          pointer-events: none;
        }
        .rackapp-device-led { width: 6px; height: 6px; border-radius: 50%; background: #7CFFB2; box-shadow: 0 0 4px #7CFFB2; flex-shrink: 0; }
        .rackapp-device-text { display: flex; flex-direction: column; line-height: 1.2; overflow: hidden; z-index: 1; }
        .rackapp-device-model { font-size: 12px; font-weight: 700; color: #0B0E14; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .rackapp-device-sub { font-size: 10px; color: rgba(11,14,20,0.7); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: "SFMono-Regular", Consolas, Menlo, monospace; }

        .rackapp-modal-overlay {
          position: fixed; inset: 0; background: rgba(6,8,12,0.7); backdrop-filter: blur(2px);
          display: flex; align-items: center; justify-content: center; z-index: 50; padding: 16px;
        }
        .rackapp-modal {
          width: 100%; max-width: 420px; background: #131820; border: 1px solid #232B38;
          border-radius: 14px; padding: 22px;
        }
        .rackapp-modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
        .rackapp-modal-title { font-size: 15px; font-weight: 700; margin: 0; }
        .rackapp-modal-close { background: transparent; border: none; color: #7C8798; cursor: pointer; padding: 4px; }
        .rackapp-field { margin-bottom: 14px; }
        .rackapp-field label { display: block; font-size: 12px; color: #9AA5B4; margin-bottom: 6px; }
        .rackapp-field input, .rackapp-field select {
          width: 100%; background: #0B0E14; border: 1px solid #232B38; color: #E7ECF3;
          border-radius: 8px; padding: 9px 10px; font-size: 13px; font-family: inherit;
        }
        .rackapp-field-row { display: flex; gap: 12px; }
        .rackapp-field-row .rackapp-field { flex: 1; }
        .rackapp-hint { font-size: 11px; color: #5A6577; margin-top: 5px; }
        .rackapp-error { background: #2A1414; border: 1px solid #4A2323; color: #F2A0A0; font-size: 12.5px; padding: 8px 10px; border-radius: 8px; margin-bottom: 14px; }
        .rackapp-modal-actions { display: flex; gap: 10px; margin-top: 20px; }
        .rackapp-btn-secondary, .rackapp-btn-primary {
          flex: 1; padding: 10px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid transparent;
        }
        .rackapp-btn-secondary { background: transparent; border-color: #232B38; color: #C7D0DC; }
        .rackapp-btn-primary { background: #F2A73B; color: #1A1400; }
      `}</style>

      {/* Cabecera Principal */}
      <header className="rackapp-header">
        <div>
          <h1 className="rackapp-title">Inventario de <span>Rack</span></h1>
          <p className="rackapp-subtitle">Administra switches, servidores y demás equipo montado en el rack.</p>
        </div>
        <div className="rackapp-size-field">
          Tamaño del rack:
          <input
            type="number"
            min="1"
            max="60"
            value={rackSize}
            onChange={(e) => setRackSize(Math.max(1, Math.min(60, parseInt(e.target.value, 10) || 1)))}
          />
          U
        </div>
      </header>

      {/* Grid de diseño en dos columnas */}
      <div className="rackapp-layout">
        {/* Izquierda: Listado descriptivo del inventario */}
        <DeviceTable 
          devices={devices} 
          onRemoveDevice={handleRemoveDevice} 
        />

        {/* Derecha: Botón interactivo + Visualizador físico */}
        <div className="rackapp-side">
          <button className="rackapp-add-btn" onClick={() => setShowModal(true)}>
            <IconPlus /> Agregar elemento
          </button>

          <RackVisualizer 
            rackSize={rackSize} 
            devices={devices} 
            usedU={usedU} 
            pct={pct} 
            onMoveDevice={handleMoveDevice}
          />
        </div>
      </div>

      {/* Modal interactivo */}
      {showModal && (
        <DeviceModal
          rackSize={rackSize}
          devices={devices}
          onClose={() => setShowModal(false)}
          onSave={handleAddDevice}
        />
      )}
    </div>
  )
}

export default App