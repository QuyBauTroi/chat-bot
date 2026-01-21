import { mockDevices } from '../data/devices';
import type { Device } from '../data/devices';

interface DeviceListProps {
  onDeviceClick: (device: Device) => void;
}

export default function DeviceList({ onDeviceClick }: DeviceListProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Danh Sách Thiết Bị</h1>
          <p className="text-gray-600">Tra cứu thông tin kỹ thuật các thiết bị</p>
        </div>

        {/* Device Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockDevices.map((device) => (
            <div
              key={device.id}
              onClick={() => onDeviceClick(device)}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={device.image}
                  alt={device.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>

              {/* Device Name */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 text-center">{device.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
