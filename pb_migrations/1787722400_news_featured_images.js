// Canonical featured images from https://lumotive.com/news/ pages 1–5,
// captured 2026-10-27. The downloaded files retain the source format and pixels;
// the previous 1200×675 images were not the live site's featured artwork.
// Media entries without an image on Lumotive itself remain unchanged, even
// when their title duplicates a press release. No external publisher OG images
// are imported. Older image-less Lumotive releases also remain unchanged.
// The source URL beside each record documents the exact image replacement.
const NEWS_FEATURED_IMAGES = [
  {
    "id": "s02v2tbkwnqhggv",
    "slug": "lumotives-lcm-optical-semiconductor-platform-enables-first-solid-state-180-dtof-lidar-at-30-fps",
    "source": "https://lumotive.com/wp-content/uploads/2026/04/IMG_9388-1-copy-2.png",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotives-lcm-optical-semiconductor-platform-enables-first-solid-state-180-dtof-lidar-at-30-fps.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotives-lcm-optical-semiconductor-platform-enables-first-solid-state-180-dtof-lidar-at-30-fps.png"
    }
  },
  {
    "id": "l1vcd0gzeezekbt",
    "slug": "lumotive-creates-worlds-first-2d-photonic-beamforming-semiconductor",
    "source": "https://lumotive.com/wp-content/uploads/2026/03/OCS-small-ports-v4-n-lasers-copy.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/img/home-2d-photonic-news.webp"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-creates-worlds-first-2d-photonic-beamforming-semiconductor.jpg"
    }
  },
  {
    "id": "ljwofl63n5ibxjz",
    "slug": "lumotive-expands-global-footprint-and-adds-key-leaders-amid-growing-demand-for-programmable-optical-semiconductors",
    "source": "https://lumotive.com/wp-content/uploads/2025/02/Lumotive-PR-logo.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-expands-global-footprint-and-adds-key-leaders-amid-growing-demand-for-programmable-optical-semiconductors.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-expands-global-footprint-and-adds-key-leaders-amid-growing-demand-for-programmable-optical-semiconductors.jpg"
    }
  },
  {
    "id": "teq6wqx5bycj63a",
    "slug": "amazon-and-ithca-invest-in-lumotive",
    "source": "https://lumotive.com/wp-content/uploads/2025/07/Amazon-ITHCA.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/amazon-and-ithca-invest-in-lumotive.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/amazon-and-ithca-invest-in-lumotive.jpg"
    }
  },
  {
    "id": "prirp8av0002mu6",
    "slug": "solidvue-and-lumotive-collaborate-to-advance-next-generation-lidar-systems",
    "source": "https://lumotive.com/wp-content/uploads/2025/07/Solidvue.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/solidvue-and-lumotive-collaborate-to-advance-next-generation-lidar-systems.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/solidvue-and-lumotive-collaborate-to-advance-next-generation-lidar-systems.jpg"
    }
  },
  {
    "id": "jr95d6ucuy9kyvt",
    "slug": "namuga-unveils-stella-2-compact-solid-state-lidar-powered-by-lumotive-at-embedded-vision-summit",
    "source": "https://lumotive.com/wp-content/uploads/2025/05/Lumotive.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/namuga-unveils-stella-2-compact-solid-state-lidar-powered-by-lumotive-at-embedded-vision-summit.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/namuga-unveils-stella-2-compact-solid-state-lidar-powered-by-lumotive-at-embedded-vision-summit.jpg"
    }
  },
  {
    "id": "k46n13re6vva68w",
    "slug": "lumotive-powers-e-photonics-launch-of-software-defined-lidar-solutions-for-its-applications-at-its-spain",
    "source": "https://lumotive.com/wp-content/uploads/2025/02/E-Photonics.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-powers-e-photonics-launch-of-software-defined-lidar-solutions-for-its-applications-at-its-spain.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-powers-e-photonics-launch-of-software-defined-lidar-solutions-for-its-applications-at-its-spain.jpg"
    }
  },
  {
    "id": "ipr4sg560g5ji2m",
    "slug": "lumotive-raises-45-million-to-expand-sales-of-programmable-optical-semiconductors",
    "source": "https://lumotive.com/wp-content/uploads/2025/02/Lumotive-PR-logo.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-raises-45-million-to-expand-sales-of-programmable-optical-semiconductors.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-raises-45-million-to-expand-sales-of-programmable-optical-semiconductors.jpg"
    }
  },
  {
    "id": "ctdcvde3arj8idx",
    "slug": "e-photonics-launches-lidar-based-3d-sensing-solutions-powered-by-lumotive",
    "source": "https://lumotive.com/wp-content/uploads/2025/02/E-Photonics.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/e-photonics-launches-lidar-based-3d-sensing-solutions-powered-by-lumotive.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/e-photonics-launches-lidar-based-3d-sensing-solutions-powered-by-lumotive.jpg"
    }
  },
  {
    "id": "5lhluxb8i0ex74f",
    "slug": "lumotive-introduces-transformative-advanced-3d-sensing-utilizing-sonys-sensors-at-ces-2025",
    "source": "https://lumotive.com/wp-content/uploads/2024/10/IMG_4641-2-copy.png",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-introduces-transformative-advanced-3d-sensing-utilizing-sonys-sensors-at-ces-2025.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-introduces-transformative-advanced-3d-sensing-utilizing-sonys-sensors-at-ces-2025.png"
    }
  },
  {
    "id": "ny5exvkzsj3809q",
    "slug": "namuga-launches-next-generation-3d-sensing-solutions-powered-by-lumotive",
    "source": "https://lumotive.com/wp-content/uploads/2022/10/M30_thumb.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/namuga-launches-next-generation-3d-sensing-solutions-powered-by-lumotive.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/namuga-launches-next-generation-3d-sensing-solutions-powered-by-lumotive.jpg"
    }
  },
  {
    "id": "24ib1ho57hmpn8a",
    "slug": "multicoreware-and-lumotive-announce-collaboration-designed-to-advance-3d-sensing-and-lidar-technology",
    "source": "https://lumotive.com/wp-content/uploads/2024/12/Multicoreware.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/multicoreware-and-lumotive-announce-collaboration-designed-to-advance-3d-sensing-and-lidar-technology.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/multicoreware-and-lumotive-announce-collaboration-designed-to-advance-3d-sensing-and-lidar-technology.jpg"
    }
  },
  {
    "id": "sycc11b503tqq66",
    "slug": "lumotive-and-lattice-semiconductor-to-demo-chip-based-beam-steering-for-3d-sensing-at-devcon-2024",
    "source": "https://lumotive.com/wp-content/uploads/2024/12/Lattice.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-and-lattice-semiconductor-to-demo-chip-based-beam-steering-for-3d-sensing-at-devcon-2024.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-and-lattice-semiconductor-to-demo-chip-based-beam-steering-for-3d-sensing-at-devcon-2024.jpg"
    }
  },
  {
    "id": "2u0fc3ebqz5xhtd",
    "slug": "lumotive-unveils-md41-development-kit-elevating-3d-sensing-with-enhanced-flexibility-and-efficiency",
    "source": "https://lumotive.com/wp-content/uploads/2024/10/IMG_4770-Edit-1-copy_web.png",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-unveils-md41-development-kit-elevating-3d-sensing-with-enhanced-flexibility-and-efficiency.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-unveils-md41-development-kit-elevating-3d-sensing-with-enhanced-flexibility-and-efficiency.png"
    }
  },
  {
    "id": "bvdjlgsjp7ta2a9",
    "slug": "lumotive-unveils-md42-development-kit-boosting-3d-sensing-innovation",
    "source": "https://lumotive.com/wp-content/uploads/2024/10/IMG_4715-copy_web-copy.png",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-unveils-md42-development-kit-boosting-3d-sensing-innovation.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-unveils-md42-development-kit-boosting-3d-sensing-innovation.png"
    }
  },
  {
    "id": "fcvi34dmwb0ca2g",
    "slug": "lumotive-unveils-groundbreaking-open-development-platform-odp-moves-to-democratize-the-future-of-3d-sensing",
    "source": "https://lumotive.com/wp-content/uploads/2024/09/ODP-Exploded-View_v2.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-unveils-groundbreaking-open-development-platform-odp-moves-to-democratize-the-future-of-3d-sensing.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-unveils-groundbreaking-open-development-platform-odp-moves-to-democratize-the-future-of-3d-sensing.jpg"
    }
  },
  {
    "id": "d1utru76engj4i6",
    "slug": "lumotive-and-hokuyo-announce-commercial-release-of-worlds-first-3d-lidar-sensor-with-true-solid-state-beam-steering",
    "source": "https://lumotive.com/wp-content/uploads/2024/06/YLM-10LX_2.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-and-hokuyo-announce-commercial-release-of-worlds-first-3d-lidar-sensor-with-true-solid-state-beam-steering.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-and-hokuyo-announce-commercial-release-of-worlds-first-3d-lidar-sensor-with-true-solid-state-beam-steering.jpg"
    }
  },
  {
    "id": "9r3h8levfqjgjrp",
    "slug": "skywater-and-lumotive-announce-qualification-and-production-start-for-worlds-first-commercially-available-optical-beamforming-chip",
    "source": "https://lumotive.com/wp-content/uploads/2024/05/Skywater.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/skywater-and-lumotive-announce-qualification-and-production-start-for-worlds-first-commercially-available-optical-beamforming-chip.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/skywater-and-lumotive-announce-qualification-and-production-start-for-worlds-first-commercially-available-optical-beamforming-chip.jpg"
    }
  },
  {
    "id": "bcb98ydgwkjwd2h",
    "slug": "lumotive-partners-with-leading-electronics-distributor-edom-to-accelerate-solid-state-lidar-adoption-in-taiwan",
    "source": "https://lumotive.com/wp-content/uploads/2024/04/Edom.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-partners-with-leading-electronics-distributor-edom-to-accelerate-solid-state-lidar-adoption-in-taiwan.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-partners-with-leading-electronics-distributor-edom-to-accelerate-solid-state-lidar-adoption-in-taiwan.jpg"
    }
  },
  {
    "id": "25sgzw7wgivk4f1",
    "slug": "lumotive-to-speak-at-26th-annual-needham-growth-conference",
    "source": "https://lumotive.com/wp-content/uploads/2024/01/Needham-thumb.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-to-speak-at-26th-annual-needham-growth-conference.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-to-speak-at-26th-annual-needham-growth-conference.jpg"
    }
  },
  {
    "id": "1fjgmvu1dq8l2ww",
    "slug": "lumotive-joins-with-tech-leaders-to-demo-digital-beam-steering-at-ces-2024",
    "source": "https://lumotive.com/wp-content/uploads/2024/01/CES-thumb.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-joins-with-tech-leaders-to-demo-digital-beam-steering-at-ces-2024.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-joins-with-tech-leaders-to-demo-digital-beam-steering-at-ces-2024.jpg"
    }
  },
  {
    "id": "j8b2vtm68wo22iz",
    "slug": "experience-lumotives-award-winning-digital-beam-steering-technology-at-ces-2024",
    "source": "https://lumotive.com/wp-content/uploads/2023/12/CESawards-thumb.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/experience-lumotives-award-winning-digital-beam-steering-technology-at-ces-2024.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/experience-lumotives-award-winning-digital-beam-steering-technology-at-ces-2024.jpg"
    }
  },
  {
    "id": "7qe3er3jydlgf4g",
    "slug": "lumotive-named-to-fast-companys-next-big-things-in-tech-2023",
    "source": "https://lumotive.com/wp-content/uploads/2023/12/FastCompany_thumb.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-named-to-fast-companys-next-big-things-in-tech-2023.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-named-to-fast-companys-next-big-things-in-tech-2023.jpg"
    }
  },
  {
    "id": "nf007rqnb7suva9",
    "slug": "lumotive-extends-global-reach-announces-new-sales-and-distribution-partners-worldwide",
    "source": "https://lumotive.com/wp-content/uploads/2023/11/LM10-thumb.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-extends-global-reach-announces-new-sales-and-distribution-partners-worldwide.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-extends-global-reach-announces-new-sales-and-distribution-partners-worldwide.jpg"
    }
  },
  {
    "id": "0hyqnj6zbh2w10t",
    "slug": "lumotive-launches-the-worlds-first-commercially-available-optical-beam-steering-semiconductor",
    "source": "https://lumotive.com/wp-content/uploads/2023/08/LM10-thumb2.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-launches-the-worlds-first-commercially-available-optical-beam-steering-semiconductor.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-launches-the-worlds-first-commercially-available-optical-beam-steering-semiconductor.jpg"
    }
  },
  {
    "id": "el6hi855ht8u05k",
    "slug": "namuga-selects-lumotive-to-build-next-gen-3d-sensing-solutions",
    "source": "https://lumotive.com/wp-content/uploads/2023/07/Namuga-thumb2.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/namuga-selects-lumotive-to-build-next-gen-3d-sensing-solutions.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/namuga-selects-lumotive-to-build-next-gen-3d-sensing-solutions.jpg"
    }
  },
  {
    "id": "bun4hce43bglplj",
    "slug": "lumotive-partners-with-hokuyo-to-revolutionize-3d-lidar-sensing-for-industrial-automation",
    "source": "https://lumotive.com/wp-content/uploads/2023/06/Hokuyo_thumb.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-partners-with-hokuyo-to-revolutionize-3d-lidar-sensing-for-industrial-automation.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-partners-with-hokuyo-to-revolutionize-3d-lidar-sensing-for-industrial-automation.jpg"
    }
  },
  {
    "id": "855gbq1m8apkd3v",
    "slug": "lumotive-and-gpixel-demonstrate-innovative-lidar-reference-design-to-enable-faster-adoption-of-next-generation-3d-sensors",
    "source": "https://lumotive.com/wp-content/uploads/2023/01/Gpixel_thumb.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-and-gpixel-demonstrate-innovative-lidar-reference-design-to-enable-faster-adoption-of-next-generation-3d-sensors.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-and-gpixel-demonstrate-innovative-lidar-reference-design-to-enable-faster-adoption-of-next-generation-3d-sensors.jpg"
    }
  },
  {
    "id": "7fnt8jqygmnff4j",
    "slug": "lumotive-and-lumentum-introduce-innovative-reference-design-to-enable-faster-adoption-of-next-generation-3d-lidar-solutions",
    "source": "https://lumotive.com/wp-content/uploads/2023/01/Lumentum_thumb.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-and-lumentum-introduce-innovative-reference-design-to-enable-faster-adoption-of-next-generation-3d-lidar-solutions.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-and-lumentum-introduce-innovative-reference-design-to-enable-faster-adoption-of-next-generation-3d-lidar-solutions.jpg"
    }
  },
  {
    "id": "juhm7fdkou1mvga",
    "slug": "lumotive-and-axibo-partner-to-bring-solid-state-3d-lidar-sensing-to-photography-and-cinematography-automation",
    "source": "https://lumotive.com/wp-content/uploads/2023/01/Axibo_thumb-1.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-and-axibo-partner-to-bring-solid-state-3d-lidar-sensing-to-photography-and-cinematography-automation.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-and-axibo-partner-to-bring-solid-state-3d-lidar-sensing-to-photography-and-cinematography-automation.jpg"
    }
  },
  {
    "id": "jxtragihbz1dk2l",
    "slug": "lumotive-adds-new-investments-from-usaa-and-uniquest-to-a-strategic-funding-round-led-by-samsung-ventures",
    "source": "https://lumotive.com/wp-content/uploads/2023/01/USAAUniquest_thumb.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-adds-new-investments-from-usaa-and-uniquest-to-a-strategic-funding-round-led-by-samsung-ventures.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-adds-new-investments-from-usaa-and-uniquest-to-a-strategic-funding-round-led-by-samsung-ventures.jpg"
    }
  },
  {
    "id": "2ytuxp39wbl9ei8",
    "slug": "lumotive-and-gpixel-jointly-unveil-m30-lidar-sensor-reference-design-platform-for-high-volume-mobility-and-industrial-applications",
    "source": "https://lumotive.com/wp-content/uploads/2022/10/M30_thumb.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-and-gpixel-jointly-unveil-m30-lidar-sensor-reference-design-platform-for-high-volume-mobility-and-industrial-applications.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-and-gpixel-jointly-unveil-m30-lidar-sensor-reference-design-platform-for-high-volume-mobility-and-industrial-applications.jpg"
    }
  },
  {
    "id": "4rb1ux3g1xzc457",
    "slug": "lumotive-closes-strategic-funding-round-led-by-samsung-ventures",
    "source": "https://lumotive.com/wp-content/uploads/2022/08/Samsung_thumb.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-closes-strategic-funding-round-led-by-samsung-ventures.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-closes-strategic-funding-round-led-by-samsung-ventures.jpg"
    }
  },
  {
    "id": "olahs53uu068eqm",
    "slug": "lumotive-expands-lidar-technology-access-program-to-include-its-patented-light-control-metasurface-lcm-beam-steering-chips-and-reference-designs",
    "source": "https://lumotive.com/wp-content/uploads/2022/05/LCM_thumb.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-expands-lidar-technology-access-program-to-include-its-patented-light-control-metasurface-lcm-beam-steering-chips-and-reference-designs.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-expands-lidar-technology-access-program-to-include-its-patented-light-control-metasurface-lcm-beam-steering-chips-and-reference-designs.jpg"
    }
  },
  {
    "id": "r3qu91m346x7naa",
    "slug": "lumotive-enhances-leadership-team-expands-its-headquarters-at-a-larger-facility",
    "source": "https://lumotive.com/wp-content/uploads/2022/05/Team_thumb.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-enhances-leadership-team-expands-its-headquarters-at-a-larger-facility.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-enhances-leadership-team-expands-its-headquarters-at-a-larger-facility.jpg"
    }
  },
  {
    "id": "939tczp37h8wb8l",
    "slug": "lumotive-and-zkw-group-jointly-demonstrate-vehicle-headlight-with-integrated-functional-lidar-at-ces-2022",
    "source": "https://lumotive.com/wp-content/uploads/2022/01/ZKW_thumb.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-and-zkw-group-jointly-demonstrate-vehicle-headlight-with-integrated-functional-lidar-at-ces-2022.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-and-zkw-group-jointly-demonstrate-vehicle-headlight-with-integrated-functional-lidar-at-ces-2022.jpg"
    }
  },
  {
    "id": "42um4nss33f0vh1",
    "slug": "lumotive-introduces-open-lidar-api-to-accelerate-market-adoption-of-software-defined-solid-state-lidar-2-0-solutions",
    "source": "https://lumotive.com/wp-content/uploads/2022/01/OpenLidarAPI_thumb.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-introduces-open-lidar-api-to-accelerate-market-adoption-of-software-defined-solid-state-lidar-2-0-solutions.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-introduces-open-lidar-api-to-accelerate-market-adoption-of-software-defined-solid-state-lidar-2-0-solutions.jpg"
    }
  },
  {
    "id": "fnzh6hfr0fgvmx3",
    "slug": "consumer-technology-association-recognizes-lumotive-with-two-ces-2022-innovation-awards",
    "source": "https://lumotive.com/wp-content/uploads/2021/11/CES-thumb.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/consumer-technology-association-recognizes-lumotive-with-two-ces-2022-innovation-awards.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/consumer-technology-association-recognizes-lumotive-with-two-ces-2022-innovation-awards.jpg"
    }
  },
  {
    "id": "qu8m8m06uaga23l",
    "slug": "lumotive-names-dr-sam-heidari-as-ceo-to-lead-lidar-innovators-next-stage-of-growth",
    "source": "https://lumotive.com/wp-content/uploads/2021/10/Sam_thumb.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-names-dr-sam-heidari-as-ceo-to-lead-lidar-innovators-next-stage-of-growth.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-names-dr-sam-heidari-as-ceo-to-lead-lidar-innovators-next-stage-of-growth.jpg"
    }
  },
  {
    "id": "514452avrymoqcx",
    "slug": "lumotive-wins-best-of-sensors-2021-startup-of-the-year-award",
    "source": "https://lumotive.com/wp-content/uploads/2021/09/startup_thumb.jpg",
    "before": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-wins-best-of-sensors-2021-startup-of-the-year-award.jpg"
    },
    "after": {
      "kind": "url",
      "value": "/lumotive/news/lumotive-wins-best-of-sensors-2021-startup-of-the-year-award.jpg"
    }
  },
  {
    "id": "w7i9oum4losf4d5",
    "slug": "media-amazon-backs-programmable-optics-startup-lumotive",
    "source": "https://lumotive.com/wp-content/uploads/2025/07/TechCrunch.png",
    "before": null,
    "after": {
      "kind": "url",
      "value": "/lumotive/news/media-amazon-backs-programmable-optics-startup-lumotive.png"
    }
  },
  {
    "id": "m0ld28d6semca5a",
    "slug": "media-lumotive-bucks-ai-trend-by-raising-45-million-for-optical-chips",
    "source": "https://lumotive.com/wp-content/uploads/2025/03/WSJ.png",
    "before": null,
    "after": {
      "kind": "url",
      "value": "/lumotive/news/media-lumotive-bucks-ai-trend-by-raising-45-million-for-optical-chips.png"
    }
  },
  {
    "id": "c1vnm9py37epse9",
    "slug": "media-lumotive-unveils-md41-development-kit-elevating-3d-sensing-with-enhanced-flexibility-and-efficiency",
    "source": "https://lumotive.com/wp-content/uploads/2025/03/Yahoo-Finance.png",
    "before": null,
    "after": {
      "kind": "url",
      "value": "/lumotive/news/media-lumotive-unveils-md41-development-kit-elevating-3d-sensing-with-enhanced-flexibility-and-efficiency.png"
    }
  },
  {
    "id": "86krv6trg1tjc42",
    "slug": "media-2024-innovators-awards-meet-the-honorees",
    "source": "https://lumotive.com/wp-content/uploads/2025/03/Laser-Focus-World_2.png",
    "before": null,
    "after": {
      "kind": "url",
      "value": "/lumotive/news/media-2024-innovators-awards-meet-the-honorees.png"
    }
  }
]

// Compare JSON structurally: PocketBase may reorder object keys on save.
function newsImageEqual(a, b) {
 if (a === b) return true
 if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false
 const keys = Object.keys(a).sort()
 const other = Object.keys(b).sort()
 if (keys.length !== other.length) return false
 return keys.every((key, index) => key === other[index] && newsImageEqual(a[key], b[key]))
}

// Posts are found by slug, not record id: ids differ between databases.
// A post that is missing, or whose cover was edited since, is left alone
// rather than aborting the batch (PocketBase applies pending migrations
// together, so one throw would roll back every other content change).
function updateNewsFeaturedImages(app, reverse) {
 for (const change of NEWS_FEATURED_IMAGES) {
  let record
  try { record = app.findFirstRecordByFilter('posts', 'slug = {:slug}', { slug: change.slug }) }
  catch { continue }
  const expected = reverse ? change.after : change.before
  const target = reverse ? change.before : change.after
  let current
  try { current = JSON.parse(record.getString('coverImage') || 'null') }
  catch { continue }
  if (!newsImageEqual(current, expected) || newsImageEqual(expected, target)) continue
  record.set('coverImage', target)
  app.save(record)
 }
}

migrate(
 (app) => updateNewsFeaturedImages(app, false),
 (app) => updateNewsFeaturedImages(app, true)
)
