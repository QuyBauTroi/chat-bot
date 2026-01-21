import type { Device } from '../data/devices';

interface DeviceDetailProps {
  device: Device;
  onBack: () => void;
}

export default function DeviceDetail({ device, onBack }: DeviceDetailProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-gray-600 hover:text-[#008C4F] transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Quay lại danh sách
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-linear-to-r from-[#008C4F]/10 to-[#008C4F]/5 p-6 border-b border-gray-200">
            <span className="text-sm text-[#008C4F] font-semibold">{device.category}</span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{device.name}</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Left Column - Media */}
            <div>
              {/* Image */}
              <div className="mb-6">
                <img
                  src={device.image}
                  alt={device.name}
                  className="w-full rounded-xl shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23ddd" width="800" height="600"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="24" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>

              {/* Video */}
              {device.video && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Video giới thiệu</h3>
                  <video
                    className="w-full rounded-xl shadow-md"
                    controls
                    poster={device.image}
                  >
                    <source src={device.video} type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ video tag.
                  </video>
                </div>
              )}
            </div>

            {/* Right Column - Information */}
            <div>
              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Mô tả</h2>
                <p className="text-gray-700 leading-relaxed">{device.description}</p>
              </div>

              {/* Specifications */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Thông số kỹ thuật</h2>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  {Object.entries(device.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start border-b border-gray-200 pb-2 last:border-0">
                      <span className="text-gray-600 font-medium flex-shrink-0 mr-4">{key}:</span>
                      <span className="text-gray-900 text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Tính năng</h2>
                <div className="grid grid-cols-1 gap-2">
                  {device.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start bg-gray-50 rounded-lg p-3"
                    >
                      <span className="w-2 h-2 bg-[#008C4F] rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
