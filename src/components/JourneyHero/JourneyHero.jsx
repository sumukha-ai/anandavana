import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Sparkles, HeartHandshake, ShieldCheck } from "lucide-react";
import styles from "./JourneyHero.module.css";
import guruImg from "../../../assets/sheshachalaru_lingu.jpg.jpeg";

import frame0001 from "../../../assets/frames/frame-0001.webp";
import frame0002 from "../../../assets/frames/frame-0002.webp";
import frame0003 from "../../../assets/frames/frame-0003.webp";
import frame0004 from "../../../assets/frames/frame-0004.webp";
import frame0005 from "../../../assets/frames/frame-0005.webp";
import frame0006 from "../../../assets/frames/frame-0006.webp";
import frame0007 from "../../../assets/frames/frame-0007.webp";
import frame0008 from "../../../assets/frames/frame-0008.webp";
import frame0009 from "../../../assets/frames/frame-0009.webp";
import frame0010 from "../../../assets/frames/frame-0010.webp";
import frame0011 from "../../../assets/frames/frame-0011.webp";
import frame0012 from "../../../assets/frames/frame-0012.webp";
import frame0013 from "../../../assets/frames/frame-0013.webp";
import frame0014 from "../../../assets/frames/frame-0014.webp";
import frame0015 from "../../../assets/frames/frame-0015.webp";
import frame0016 from "../../../assets/frames/frame-0016.webp";
import frame0017 from "../../../assets/frames/frame-0017.webp";
import frame0018 from "../../../assets/frames/frame-0018.webp";
import frame0019 from "../../../assets/frames/frame-0019.webp";
import frame0020 from "../../../assets/frames/frame-0020.webp";
import frame0021 from "../../../assets/frames/frame-0021.webp";
import frame0022 from "../../../assets/frames/frame-0022.webp";
import frame0023 from "../../../assets/frames/frame-0023.webp";
import frame0024 from "../../../assets/frames/frame-0024.webp";
import frame0025 from "../../../assets/frames/frame-0025.webp";
import frame0026 from "../../../assets/frames/frame-0026.webp";
import frame0027 from "../../../assets/frames/frame-0027.webp";
import frame0028 from "../../../assets/frames/frame-0028.webp";
import frame0029 from "../../../assets/frames/frame-0029.webp";
import frame0030 from "../../../assets/frames/frame-0030.webp";
import frame0031 from "../../../assets/frames/frame-0031.webp";
import frame0032 from "../../../assets/frames/frame-0032.webp";
import frame0033 from "../../../assets/frames/frame-0033.webp";
import frame0034 from "../../../assets/frames/frame-0034.webp";
import frame0035 from "../../../assets/frames/frame-0035.webp";
import frame0036 from "../../../assets/frames/frame-0036.webp";
import frame0037 from "../../../assets/frames/frame-0037.webp";
import frame0038 from "../../../assets/frames/frame-0038.webp";
import frame0039 from "../../../assets/frames/frame-0039.webp";
import frame0040 from "../../../assets/frames/frame-0040.webp";
import frame0041 from "../../../assets/frames/frame-0041.webp";
import frame0042 from "../../../assets/frames/frame-0042.webp";
import frame0043 from "../../../assets/frames/frame-0043.webp";
import frame0044 from "../../../assets/frames/frame-0044.webp";
import frame0045 from "../../../assets/frames/frame-0045.webp";
import frame0046 from "../../../assets/frames/frame-0046.webp";
import frame0047 from "../../../assets/frames/frame-0047.webp";
import frame0048 from "../../../assets/frames/frame-0048.webp";
import frame0049 from "../../../assets/frames/frame-0049.webp";
import frame0050 from "../../../assets/frames/frame-0050.webp";
import frame0051 from "../../../assets/frames/frame-0051.webp";
import frame0052 from "../../../assets/frames/frame-0052.webp";
import frame0053 from "../../../assets/frames/frame-0053.webp";
import frame0054 from "../../../assets/frames/frame-0054.webp";
import frame0055 from "../../../assets/frames/frame-0055.webp";
import frame0056 from "../../../assets/frames/frame-0056.webp";
import frame0057 from "../../../assets/frames/frame-0057.webp";
import frame0058 from "../../../assets/frames/frame-0058.webp";
import frame0059 from "../../../assets/frames/frame-0059.webp";
import frame0060 from "../../../assets/frames/frame-0060.webp";
import frame0061 from "../../../assets/frames/frame-0061.webp";
import frame0062 from "../../../assets/frames/frame-0062.webp";
import frame0063 from "../../../assets/frames/frame-0063.webp";
import frame0064 from "../../../assets/frames/frame-0064.webp";
import frame0065 from "../../../assets/frames/frame-0065.webp";
import frame0066 from "../../../assets/frames/frame-0066.webp";
import frame0067 from "../../../assets/frames/frame-0067.webp";
import frame0068 from "../../../assets/frames/frame-0068.webp";
import frame0069 from "../../../assets/frames/frame-0069.webp";
import frame0070 from "../../../assets/frames/frame-0070.webp";
import frame0071 from "../../../assets/frames/frame-0071.webp";
import frame0072 from "../../../assets/frames/frame-0072.webp";
import frame0073 from "../../../assets/frames/frame-0073.webp";
import frame0074 from "../../../assets/frames/frame-0074.webp";
import frame0075 from "../../../assets/frames/frame-0075.webp";
import frame0076 from "../../../assets/frames/frame-0076.webp";
import frame0077 from "../../../assets/frames/frame-0077.webp";
import frame0078 from "../../../assets/frames/frame-0078.webp";
import frame0079 from "../../../assets/frames/frame-0079.webp";
import frame0080 from "../../../assets/frames/frame-0080.webp";
import frame0081 from "../../../assets/frames/frame-0081.webp";
import frame0082 from "../../../assets/frames/frame-0082.webp";
import frame0083 from "../../../assets/frames/frame-0083.webp";
import frame0084 from "../../../assets/frames/frame-0084.webp";
import frame0085 from "../../../assets/frames/frame-0085.webp";
import frame0086 from "../../../assets/frames/frame-0086.webp";
import frame0087 from "../../../assets/frames/frame-0087.webp";
import frame0088 from "../../../assets/frames/frame-0088.webp";
import frame0089 from "../../../assets/frames/frame-0089.webp";
import frame0090 from "../../../assets/frames/frame-0090.webp";
import frame0091 from "../../../assets/frames/frame-0091.webp";
import frame0092 from "../../../assets/frames/frame-0092.webp";
import frame0093 from "../../../assets/frames/frame-0093.webp";
import frame0094 from "../../../assets/frames/frame-0094.webp";
import frame0095 from "../../../assets/frames/frame-0095.webp";
import frame0096 from "../../../assets/frames/frame-0096.webp";
import frame0097 from "../../../assets/frames/frame-0097.webp";
import frame0098 from "../../../assets/frames/frame-0098.webp";
import frame0099 from "../../../assets/frames/frame-0099.webp";
import frame0100 from "../../../assets/frames/frame-0100.webp";
import frame0101 from "../../../assets/frames/frame-0101.webp";
import frame0102 from "../../../assets/frames/frame-0102.webp";
import frame0103 from "../../../assets/frames/frame-0103.webp";
import frame0104 from "../../../assets/frames/frame-0104.webp";
import frame0105 from "../../../assets/frames/frame-0105.webp";
import frame0106 from "../../../assets/frames/frame-0106.webp";
import frame0107 from "../../../assets/frames/frame-0107.webp";
import frame0108 from "../../../assets/frames/frame-0108.webp";
import frame0109 from "../../../assets/frames/frame-0109.webp";
import frame0110 from "../../../assets/frames/frame-0110.webp";
import frame0111 from "../../../assets/frames/frame-0111.webp";
import frame0112 from "../../../assets/frames/frame-0112.webp";
import frame0113 from "../../../assets/frames/frame-0113.webp";
import frame0114 from "../../../assets/frames/frame-0114.webp";
import frame0115 from "../../../assets/frames/frame-0115.webp";
import frame0116 from "../../../assets/frames/frame-0116.webp";
import frame0117 from "../../../assets/frames/frame-0117.webp";
import frame0118 from "../../../assets/frames/frame-0118.webp";
import frame0119 from "../../../assets/frames/frame-0119.webp";
import frame0120 from "../../../assets/frames/frame-0120.webp";
import frame0121 from "../../../assets/frames/frame-0121.webp";
import frame0122 from "../../../assets/frames/frame-0122.webp";
import frame0123 from "../../../assets/frames/frame-0123.webp";
import frame0124 from "../../../assets/frames/frame-0124.webp";
import frame0125 from "../../../assets/frames/frame-0125.webp";
import frame0126 from "../../../assets/frames/frame-0126.webp";
import frame0127 from "../../../assets/frames/frame-0127.webp";
import frame0128 from "../../../assets/frames/frame-0128.webp";
import frame0129 from "../../../assets/frames/frame-0129.webp";
import frame0130 from "../../../assets/frames/frame-0130.webp";
import frame0131 from "../../../assets/frames/frame-0131.webp";
import frame0132 from "../../../assets/frames/frame-0132.webp";
import frame0133 from "../../../assets/frames/frame-0133.webp";
import frame0134 from "../../../assets/frames/frame-0134.webp";
import frame0135 from "../../../assets/frames/frame-0135.webp";
import frame0136 from "../../../assets/frames/frame-0136.webp";
import frame0137 from "../../../assets/frames/frame-0137.webp";
import frame0138 from "../../../assets/frames/frame-0138.webp";
import frame0139 from "../../../assets/frames/frame-0139.webp";
import frame0140 from "../../../assets/frames/frame-0140.webp";
import frame0141 from "../../../assets/frames/frame-0141.webp";
import frame0142 from "../../../assets/frames/frame-0142.webp";
import frame0143 from "../../../assets/frames/frame-0143.webp";
import frame0144 from "../../../assets/frames/frame-0144.webp";
import frame0145 from "../../../assets/frames/frame-0145.webp";
import frame0146 from "../../../assets/frames/frame-0146.webp";
import frame0147 from "../../../assets/frames/frame-0147.webp";
import frame0148 from "../../../assets/frames/frame-0148.webp";
import frame0149 from "../../../assets/frames/frame-0149.webp";
import frame0150 from "../../../assets/frames/frame-0150.webp";
import frame0151 from "../../../assets/frames/frame-0151.webp";
import frame0152 from "../../../assets/frames/frame-0152.webp";
import frame0153 from "../../../assets/frames/frame-0153.webp";
import frame0154 from "../../../assets/frames/frame-0154.webp";
import frame0155 from "../../../assets/frames/frame-0155.webp";
import frame0156 from "../../../assets/frames/frame-0156.webp";
import frame0157 from "../../../assets/frames/frame-0157.webp";
import frame0158 from "../../../assets/frames/frame-0158.webp";
import frame0159 from "../../../assets/frames/frame-0159.webp";
import frame0160 from "../../../assets/frames/frame-0160.webp";
import frame0161 from "../../../assets/frames/frame-0161.webp";
import frame0162 from "../../../assets/frames/frame-0162.webp";
import frame0163 from "../../../assets/frames/frame-0163.webp";
import frame0164 from "../../../assets/frames/frame-0164.webp";
import frame0165 from "../../../assets/frames/frame-0165.webp";
import frame0166 from "../../../assets/frames/frame-0166.webp";
import frame0167 from "../../../assets/frames/frame-0167.webp";
import frame0168 from "../../../assets/frames/frame-0168.webp";
import frame0169 from "../../../assets/frames/frame-0169.webp";
import frame0170 from "../../../assets/frames/frame-0170.webp";
import frame0171 from "../../../assets/frames/frame-0171.webp";
import frame0172 from "../../../assets/frames/frame-0172.webp";
import frame0173 from "../../../assets/frames/frame-0173.webp";
import frame0174 from "../../../assets/frames/frame-0174.webp";
import frame0175 from "../../../assets/frames/frame-0175.webp";
import frame0176 from "../../../assets/frames/frame-0176.webp";
import frame0177 from "../../../assets/frames/frame-0177.webp";
import frame0178 from "../../../assets/frames/frame-0178.webp";
import frame0179 from "../../../assets/frames/frame-0179.webp";

gsap.registerPlugin(ScrollTrigger);

// PUT ALL IMPORTED FRAMES HERE IN ORDER
const FRAME_IMAGES = [
  frame0001,frame0002,frame0003,frame0004,frame0005,frame0006,frame0007,frame0008,frame0009,frame0010,
  frame0011,frame0012,frame0013,frame0014,frame0015,frame0016,frame0017,frame0018,frame0019,frame0020,
  frame0021,frame0022,frame0023,frame0024,frame0025,frame0026,frame0027,frame0028,frame0029,frame0030,
  frame0031,frame0032,frame0033,frame0034,frame0035,frame0036,frame0037,frame0038,frame0039,frame0040,
  frame0041,frame0042,frame0043,frame0044,frame0045,frame0046,frame0047,frame0048,frame0049,frame0050,
  frame0051,frame0052,frame0053,frame0054,frame0055,frame0056,frame0057,frame0058,frame0059,frame0060,
  frame0061,frame0062,frame0063,frame0064,frame0065,frame0066,frame0067,frame0068,frame0069,frame0070,
  frame0071,frame0072,frame0073,frame0074,frame0075,frame0076,frame0077,frame0078,frame0079,frame0080,
  frame0081,frame0082,frame0083,frame0084,frame0085,frame0086,frame0087,frame0088,frame0089,frame0090,
  frame0091,frame0092,frame0093,frame0094,frame0095,frame0096,frame0097,frame0098,frame0099,frame0100,
  frame0101,frame0102,frame0103,frame0104,frame0105,frame0106,frame0107,frame0108,frame0109,frame0110,
  frame0111,frame0112,frame0113,frame0114,frame0115,frame0116,frame0117,frame0118,frame0119,frame0120,
  frame0121,frame0122,frame0123,frame0124,frame0125,frame0126,frame0127,frame0128,frame0129,frame0130,
  frame0131,frame0132,frame0133,frame0134,frame0135,frame0136,frame0137,frame0138,frame0139,frame0140,
  frame0141,frame0142,frame0143,frame0144,frame0145,frame0146,frame0147,frame0148,frame0149,frame0150,
  frame0151,frame0152,frame0153,frame0154,frame0155,frame0156,frame0157,frame0158,frame0159,frame0160,
  frame0161,frame0162,frame0163,frame0164,frame0165,frame0166,frame0167,frame0168,frame0169,frame0170,
  frame0171,frame0172,frame0173,frame0174,frame0175,frame0176,frame0177,frame0178,frame0179
];

const CONTENT = {
  en: {
    topLine: "SRI KSHETRA",
    bottomLine: "ANANDAVANA",
    guruAlt: "Guru of Sri Kshetra Anandavana",
    kicker: "About Section",
    title: "The spirit of Anandavana",
    subtitle:
      "A holy space where compassion, guidance, peace, and divine nearness are deeply felt.",
    contentLabel: "Divine Abode",
    mainText:
      "Anandavana, the sacred abode of Sri Sheshachala Sadguru, is a unique and holy place. It is known for offering Annadana and spiritual wisdom to all. It is a place where spiritual seekers find guidance and progress, and where thousands of devotees are inspired to move closer to God and Divinity. The Gurus of this land provide comfort and protection to those in distress, helping weak and troubled people become strong and confident.",
    points: [
      {
        title: "Spiritual Guidance",
        text: "Seekers find direction, progress, and a deeper path toward divine awareness.",
        icon: Sparkles,
      },
      {
        title: "Annadana & Compassion",
        text: "Service, nourishment, and care are offered with humility and devotion to all.",
        icon: HeartHandshake,
      },
      {
        title: "Hope & Protection",
        text: "Those carrying sorrow and struggle find reassurance, strength, and peace in the Sadguru’s presence.",
        icon: ShieldCheck,
      },
    ],
    outro: "Welcome inside Anandavana",
  },
  kn: {
    topLine: "ಶ್ರೀ ಕ್ಷೇತ್ರ",
    bottomLine: "ಆನಂದವನ",
    guruAlt: "ಶ್ರೀ ಕ್ಷೇತ್ರ ಆನಂದವನದ ಗುರು",
    kicker: "ಸಂಸ್ಥಾನದ ಬಗ್ಗೆ",
    title: "ಆನಂದವನದ ಆತ್ಮಸ್ಪರ್ಶಿ ಮಹಿಮೆ",
    subtitle:
      "ಕರುಣೆ, ಮಾರ್ಗದರ್ಶನ, ಶಾಂತಿ ಮತ್ತು ದೈವಿಕ ಸಾನ್ನಿಧ್ಯವು ಆಳವಾಗಿ ಅನುಭವವಾಗುವ ಪವಿತ್ರ ತಾಣ.",
    contentLabel: "ದಿವ್ಯ ನಿವಾಸ",
    mainText:
      "ಶ್ರೀ ಶೇಷಾಚಲ ಸದ್ಗುರುಗಳ ಪವಿತ್ರ ನಿವಾಸವಾದ ಆನಂದವನವು ವಿಶಿಷ್ಟವಾದ ದೈವಿಕ ಕ್ಷೇತ್ರವಾಗಿದೆ. ಇಲ್ಲಿ ಎಲ್ಲರಿಗೂ ಅನ್ನದಾನ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಜ್ಞಾನವನ್ನು ದಾನ ಮಾಡಲಾಗುತ್ತದೆ. ಇದು ಆಧ್ಯಾತ್ಮಿಕ ಸಾಧಕರು ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಆತ್ಮೋನ್ನತಿಯನ್ನು ಪಡೆಯುವ ಸ್ಥಳವಾಗಿದ್ದು, ಸಾವಿರಾರು ಭಕ್ತರು ದೇವತ್ವದತ್ತ ಇನ್ನಷ್ಟು ಸಮೀಪಗೊಳ್ಳಲು ಪ್ರೇರಣೆಯನ್ನು ಪಡೆಯುವ ಪವಿತ್ರ ನೆಲೆಯಾಗಿದೆ.",
    points: [
      {
        title: "ಆಧ್ಯಾತ್ಮಿಕ ಮಾರ್ಗದರ್ಶನ",
        text: "ಸಾಧಕರು ದೈವಿಕ ಚೇತನದತ್ತ ಸಾಗಲು ದಿಕ್ಕು, ಬೆಳವಣಿಗೆ ಮತ್ತು ಗಂಭೀರವಾದ ಮಾರ್ಗವನ್ನು ಇಲ್ಲಿ ಕಂಡುಕೊಳ್ಳುತ್ತಾರೆ.",
        icon: Sparkles,
      },
      {
        title: "ಅನ್ನದಾನ ಮತ್ತು ಕರುಣೆ",
        text: "ಸೇವೆ, ಆಹಾರ ಮತ್ತು ಕಾಳಜಿಯನ್ನು ವಿನಯಭಾವದಿಂದ ಹಾಗೂ ಭಕ್ತಿಯಿಂದ ಎಲ್ಲರಿಗೂ ಅರ್ಪಿಸಲಾಗುತ್ತದೆ.",
        icon: HeartHandshake,
      },
      {
        title: "ಆಶೆ ಮತ್ತು ರಕ್ಷಣೆ",
        text: "ದುಃಖ ಮತ್ತು ಹೋರಾಟವನ್ನು ಹೊತ್ತುಕೊಂಡವರು ಸದ್ಗುರುವಿನ ಸಾನ್ನಿಧ್ಯದಲ್ಲಿ ಧೈರ್ಯ, ಶಕ್ತಿ ಮತ್ತು ಶಾಂತಿಯನ್ನು ಪಡೆಯುತ್ತಾರೆ.",
        icon: ShieldCheck,
      },
    ],
    outro: "ಆನಂದವನದ ಒಳಗಡೆಗೆ ಸ್ವಾಗತ",
  },
};

const STAGES = [
  { key: "hero", start: 0, end: 0.18 },
  { key: "intro", start: 0.18, end: 0.43 },
  { key: "points", start: 0.43, end: 0.84 },
  { key: "outro", start: 0.84, end: 1 },
];

export default function JourneyHero() {
  const { lang } = useParams();
  const language = lang === "kn" ? "kn" : "en";
  const content = CONTENT[language];

  const wrapperRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);

  const [activeStage, setActiveStage] = useState("hero");
  const [sequenceReady, setSequenceReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const pinTarget = pinRef.current;
    const canvas = canvasRef.current;

    if (!wrapper || !pinTarget || !canvas || FRAME_IMAGES.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let destroyed = false;
    let tween = null;
    let resizeRaf = null;
    let stageTimer = null;
    let currentStage = "hero";

    const images = new Array(FRAME_IMAGES.length);
    const playhead = { frame: 0 };

    const setStageSafely = (progress) => {
      const nextStage =
        STAGES.find((stage) => progress >= stage.start && progress < stage.end)?.key ||
        "outro";

      if (nextStage !== currentStage) {
        currentStage = nextStage;
        clearTimeout(stageTimer);
        stageTimer = setTimeout(() => {
          if (!destroyed) setActiveStage(nextStage);
        }, 30);
      }
    };

    const drawCoverFrame = (img) => {
      if (!img) return;

      const rect = canvas.getBoundingClientRect();
      const canvasWidth = rect.width;
      const canvasHeight = rect.height;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const imageAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = canvasWidth / canvasHeight;

      let drawWidth = 0;
      let drawHeight = 0;
      let offsetX = 0;
      let offsetY = 0;

      if (imageAspect > canvasAspect) {
        drawHeight = canvasHeight;
        drawWidth = drawHeight * imageAspect;
        offsetX = (canvasWidth - drawWidth) / 2;
      } else {
        drawWidth = canvasWidth;
        drawHeight = drawWidth / imageAspect;
        offsetY = (canvasHeight - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const drawContainFrame = (img) => {
      if (!img) return;

      const rect = canvas.getBoundingClientRect();
      const canvasWidth = rect.width;
      const canvasHeight = rect.height;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const scale = Math.min(
        canvasWidth / img.naturalWidth,
        canvasHeight / img.naturalHeight
      );

  const drawWidth = img.naturalWidth * scale;
  const drawHeight = img.naturalHeight * scale;

  const offsetX = (canvasWidth - drawWidth) / 2;
  const offsetY = (canvasHeight - drawHeight) / 2;

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
};

    const drawFrame = (index) => {
      const img = images[Math.round(index)];
      if (!img) return;
      drawCoverFrame(img);
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      drawFrame(playhead.frame);
    };

    const preloadImages = async () => {
      let loaded = 0;

      await Promise.all(
        FRAME_IMAGES.map((src, index) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;

            img.onload = () => {
              images[index] = img;
              loaded += 1;
              if (!destroyed) {
                setLoadingProgress(Math.round((loaded / FRAME_IMAGES.length) * 100));
              }
              resolve();
            };

            img.onerror = reject;
          });
        })
      );
    };

    const initSequence = () => {
      if (destroyed) return;

      resizeCanvas();
      drawFrame(0);
      setSequenceReady(true);

      tween = gsap.to(playhead, {
        frame: FRAME_IMAGES.length - 1,
        snap: "frame",
        ease: "none",
        onUpdate: () => {
          drawFrame(playhead.frame);
          const progress = tween?.scrollTrigger?.progress ?? 0;
          setStageSafely(progress);
        },
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          pin: pinTarget,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.refresh();
    };

    preloadImages()
      .then(() => {
        if (!destroyed) initSequence();
      })
      .catch((error) => {
        console.error("Failed to preload sequence images:", error);
      });

    const handleResize = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        resizeCanvas();
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      destroyed = true;
      clearTimeout(stageTimer);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", handleResize);
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, []);

  return (
    <section
      ref={wrapperRef}
      className={styles.scrollWrapper}
      aria-label="Journey through Anandavana"
    >
      <div ref={pinRef} className={styles.pinStage}>
        <canvas
          ref={canvasRef}
          className={styles.bgCanvas}
          aria-hidden="true"
        />

        <div className={styles.overlay}></div>
        <div className={styles.texture}></div>

        <div className={styles.guruBadge}>
          <div className={styles.guruCircle}>
            <img
              src={guruImg}
              alt={content.guruAlt}
              className={styles.guruImage}
            />
          </div>
        </div>

        {!sequenceReady && (
          <div className={styles.loadingState}>
            <div className={styles.loadingInner}>
              <span className={styles.loadingKicker}>
                Preparing Journey {loadingProgress}%
              </span>
              <div className={styles.loadingBar}>
                <span
                  className={styles.loadingProgress}
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div
          className={`${styles.contentBlock} ${styles.heroBlock} ${
            activeStage === "hero" ? styles.visible : styles.hidden
          }`}
          lang={language}
        >
          <div className={styles.heroContent}>
            <h2 className={styles.topLine}>{content.topLine}</h2>
            <h1 className={styles.bottomLine}>{content.bottomLine}</h1>
          </div>
        </div>

        <div
          className={`${styles.contentBlock} ${styles.introBlock} ${
            activeStage === "intro" ? styles.visible : styles.hidden
          }`}
          lang={language}
        >
          <div className={styles.introContent}>
            <span className={styles.kicker}>{content.kicker}</span>
            <h2 className={styles.aboutTitle}>{content.title}</h2>
            <p className={styles.subtitle}>{content.subtitle}</p>
          </div>
        </div>

        <div
          className={`${styles.contentBlock} ${styles.pointsBlock} ${
            activeStage === "points" ? styles.visible : styles.hidden
          }`}
          lang={language}
        >
          {/* <div className={styles.textCard}>
            <div className={styles.contentIntro}>
              <span className={styles.contentLabel}>{content.contentLabel}</span>
              <p className={styles.mainText}>{content.mainText}</p>
            </div>

            <div className={styles.pointsGrid}>
              {content.points.map((point, index) => {
                const Icon = point.icon;
                return (
                  <div className={styles.pointCard} key={index}>
                    <div className={styles.iconWrap}>
                      <Icon size={20} strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className={styles.pointTitle}>{point.title}</h3>
                      <p className={styles.pointText}>{point.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div> */}
        </div>

        <div
          className={`${styles.contentBlock} ${styles.outroBlock} ${
            activeStage === "outro" ? styles.visible : styles.hidden
          }`}
          lang={language}
        >
          <p className={styles.outroText}>{content.outro}</p>
        </div>
      </div>
    </section>
  );
}