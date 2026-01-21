export interface Device {
  id: number;
  name: string;
  category: string;
  image: string;
  video?: string;
  description: string;
  specifications: {
    [key: string]: string;
  };
  features: string[];
}

export const mockDevices: Device[] = [
  {
    id: 1,
    name: 'Smart Watch Pro X1',
    category: 'Đồng hồ thông minh',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'Đồng hồ thông minh cao cấp với màn hình AMOLED 1.4 inch, chống nước IP68, theo dõi sức khỏe 24/7 và hơn 50 chế độ thể thao.',
    specifications: {
      'Màn hình': 'AMOLED 1.4 inch, 454 x 454 pixels',
      'Pin': '450mAh, sử dụng 7 ngày',
      'Chống nước': 'IP68 (5ATM)',
      'Cảm biến': 'Nhịp tim, SpO2, Gia tốc, Con quay hồi chuyển',
      'Kết nối': 'Bluetooth 5.2, GPS, WiFi',
      'Hệ điều hành': 'Wear OS 3.0',
      'Trọng lượng': '45g',
      'Chất liệu': 'Nhôm hợp kim, kính cường lực'
    },
    features: [
      'Theo dõi nhịp tim liên tục',
      'Đo SpO2 và nhiệt độ cơ thể',
      'GPS tích hợp',
      'Thông báo thông minh',
      'Thanh toán không chạm',
      'Điều khiển nhạc từ xa'
    ]
  },
  {
    id: 2,
    name: 'Wireless Earbuds Ultra',
    category: 'Tai nghe không dây',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=600&fit=crop',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'Tai nghe true wireless với công nghệ chống ồn chủ động (ANC), chất lượng âm thanh Hi-Fi và pin 30 giờ.',
    specifications: {
      'Driver': '10mm Dynamic Driver',
      'Chống ồn': 'ANC chủ động, giảm ồn 35dB',
      'Pin': '7 giờ (tai nghe) + 23 giờ (hộp)',
      'Sạc': 'USB-C, Wireless Charging',
      'Kết nối': 'Bluetooth 5.3, AAC, aptX',
      'Mic': '6 microphones với ENC',
      'Chống nước': 'IPX5',
      'Trọng lượng': '5.2g mỗi bên'
    },
    features: [
      'Chống ồn chủ động (ANC)',
      'Chế độ Transparency',
      'Điều khiển cảm ứng',
      'Sạc không dây',
      'Chống nước IPX5',
      'Giảm tiếng ồn môi trường'
    ]
  },
  {
    id: 3,
    name: 'Smart Speaker AI',
    category: 'Loa thông minh',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=600&fit=crop',
    description: 'Loa thông minh với trợ lý AI tích hợp, chất lượng âm thanh 360° và điều khiển ngôi nhà thông minh.',
    specifications: {
      'Công suất': '30W RMS, 60W peak',
      'Driver': '2 tweeters + 1 woofer',
      'Tần số': '50Hz - 20kHz',
      'Kết nối': 'WiFi 6, Bluetooth 5.0, AUX',
      'Trợ lý': 'AI Voice Assistant tích hợp',
      'Mic': '6 microphones array',
      'Điều khiển': 'Cảm ứng, giọng nói',
      'Kích thước': '18 x 18 x 25 cm'
    },
    features: [
      'Âm thanh 360°',
      'Điều khiển nhà thông minh',
      'Phát nhạc đa phòng',
      'Hỗ trợ nhiều dịch vụ nhạc',
      'Điều khiển bằng giọng nói',
      'Kết nối WiFi và Bluetooth'
    ]
  },
  {
    id: 4,
    name: 'Action Camera 4K',
    category: 'Camera hành động',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'Camera hành động chuyên nghiệp quay video 4K@60fps, chống nước 30m, chống sốc và chống rung điện tử.',
    specifications: {
      'Video': '4K@60fps, 1080p@240fps',
      'Ảnh': '20MP, RAW support',
      'Chống nước': '30m không cần vỏ',
      'Ổn định': 'EIS 6 trục',
      'Màn hình': '2 inch LCD cảm ứng',
      'Pin': '1400mAh, quay 90 phút 4K',
      'Lưu trữ': 'MicroSD lên đến 256GB',
      'Kết nối': 'WiFi, Bluetooth, USB-C'
    },
    features: [
      'Quay video 4K@60fps',
      'Chống nước 30m',
      'Chống rung điện tử',
      'Time-lapse & Slow-motion',
      'Live streaming',
      'Điều khiển từ điện thoại'
    ]
  }
];
