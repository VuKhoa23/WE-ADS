const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [106.7221713156813, 10.794929507221397],
      },
      properties: {
        ads: [{
          adId : 0,
          adType: "Trụ bảng hiflex",
          adScale: "6.5m x 10.4m",
          adName: "Landmark 81",
          adImages: [
            {
              url: "https://brandcom.vn/wp-content/uploads/2020/09/quang-cao-truyen-hinh-1-1080x675.jpg",
            }
          ],
        },
        {
          adId : 1,
          adType: "Trụ treo băng rôn dọc",
          adScale: "2.5m x 5.4m",
          adName: "Landmark 82",
          adPlanned: 1,
          adImages: [
            {
              url: "https://brandcom.vn/wp-content/uploads/2020/09/quang-cao-truyen-hinh-1-1080x675.jpg",
            },
            {
              url: "https://d32q3bqti6sa3p.cloudfront.net/uploads/tang-phieu-quang-cao-google-ho-tro-doanh-nghiep-banner-xs-1645434534.jpg",
            },
          ],
        },
        ],
        ward: "22",
        district: "Binh Thanh",
        adPlanned: 1,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [106.71841681609948, 10.786080361035175],
      },
      properties: {
        ads: [{
          adType: "Trụ treo băng rôn dọc",
          adScale: "2.5m x 5.4m",
          adName: "Cầu Thủ Thiêm",
          adImages: [
            {
              url: "https://brandcom.vn/wp-content/uploads/2020/09/quang-cao-truyen-hinh-1-1080x675.jpg",
            },
            {
              url: "https://d32q3bqti6sa3p.cloudfront.net/uploads/tang-phieu-quang-cao-google-ho-tro-doanh-nghiep-banner-xs-1645434534.jpg",
            },
          ],
        }
        ],
        ward: "Da Kao",
        district: "1",
        adPlanned: 0,

      },
    }
  ],
};
