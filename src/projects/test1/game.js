//import { AUTO, WEBGL, CANVAS, Scale, Game, Math } from "./libs/phaser.esm.min.js"; // Build Vite
import { AUTO, Scale, Game, Math } from "phaser"; // Intellisense
import { MainScene } from "./scenes/main-scene.js";

///// GAME MANAGER \\\\\
export const GM = new class {
  // Class dùng chung
  width = innerWidth;
  height = innerHeight;
  devAssetsPath = "/public"; // Thay bằng "" khi build Vite
};

///// CONFIG GAME \\\\\
const config = {
  type: AUTO,
  backgroundColor: "black",
  pixelArt: true,

  //render: { antialias: true },

  input: { activePointers: 3 }, // Bật cảm ứng 3 điểm (đa điểm)

  scale: {
    mode: Scale.FIT,
    //autoCenter: Phaser.Scale.CENTER_BOTH, // Đặt screen giữa màn hình
    width: GM.width,
    height: GM.height,
  },

  physics: {
    default: "matter", // Sử dụng vật lý matter
    matter: {
      gravity: { y: 0 },
      enableSleeping: true,
      debug: false, // Bật gỡ lỗi
    },
  },

  scene: [MainScene], // Mảng hoặc đối tượng scene
};

///// START \\\\\
new Game(config);

// Fix v2 nè