import { useState } from 'react'
import './App.css'
import DeviceList from './components/DeviceList'
import DeviceDetail from './components/DeviceDetail'
import ChatBotWidget from './components/ChatBotWidget'
import type { Device } from './data/devices'

function App() {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device)
  }

  const handleBack = () => {
    setSelectedDevice(null)
  }

  return (
    <>
      {selectedDevice ? (
        <DeviceDetail device={selectedDevice} onBack={handleBack} />
      ) : (
        <DeviceList onDeviceClick={handleDeviceClick} />
      )}
      <ChatBotWidget />
    </>
  )
}

export default App
