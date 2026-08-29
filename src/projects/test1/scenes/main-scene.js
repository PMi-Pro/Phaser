//import { Scene, GameObjects } from "../libs/phaser.esm.min.js"; // Build Vite
import { Scene, GameObjects, Math, Display } from "phaser"; // Intellisense
import { GM } from "../game.js"; // GameManager

const Pool = {
  scene: null,
  objects: [],
  free: 0,

  init(scene, size = 0) {
    this.scene = scene;

    for (let i = 0; i < size; i++) {
      this.free++;
      const obj = scene.matter.add.image(-1000, -1000, "crate");
      scene.matter.world.remove(obj.body);
      obj.setActive(false).setVisible(false);
      obj.setBounce(0.9);
      obj.setTint(Display.Color.RandomRGB(100).color);
      //obj.setCollidesWith([]);
      //obj.setVelocity(0, 0);
      //obj.setAngularVelocity(0);
      //obj.setStatic(true);
      this.objects.push(obj);
    }
  },

  set(obj) {
    this.free++;
    this.scene.matter.world.remove(obj.body);
    obj.setActive(false).setVisible(false);
    //obj.setCollidesWith([]);
    //obj.setVelocity(0, 0);
    //obj.setAngularVelocity(0);
    //obj.setStatic(true);
  },

  get(x = 0, y = 0, rotation = 0) {
    let obj = this.objects.find(i => !i.active);
    if (obj == null) {
      obj = this.scene.matter.add.image(x, y, "crate");
      obj.setBounce(0.9);
      obj.setTint(Display.Color.RandomRGB(100).color);
      this.objects.push(obj);
      return obj;
    }
    this.free--;
    this.scene.matter.world.add(obj.body);
    obj.setActive(true).setVisible(true);
    obj.setPosition(x, y);
    obj.setRotation(rotation);
    obj.setVelocity(0, 0);
    obj.setAngularVelocity(0);
    //obj.setCollidesWith(1);
    //obj.setStatic(false);
    return obj;
  }
};

/*const utils = {
  controls: {
    left: false,
    right: false,
    jump: false
  }
};*/



///// ===== SCENE ===== \\\\\

export class MainScene extends Scene {
  constructor() {
    super('scene1');
    this.fps = document.getElementById('fps');
    this.objects = [];
  }

  init() {
    this.matter.world.setGravity(0, 0.8);
    this.matter.world.setBounds(0, 0, GM.width, GM.height, 1000);
    this.matter.add.mouseSpring();
  }

  preload() {
    this.load.image("crate", GM.devAssetsPath + "/assets/images/crate.png");
  }

  create() {
    Pool.init(this);

    this.input.on('pointerdown', (pointer) => {
      /*
      //const rect = this.add.rectangle(pointer.worldX, pointer.worldY, 50, 50, Display.Color.RandomRGB(100).color);
      //const obj = this.matter.add.gameObject(rect);
      const obj = this.matter.add.image(pointer.worldX, pointer.worldY, "crate");
      //obj.rotation = Math.FloatBetween(0, 1);
      obj.setScale(Math.FloatBetween(0.5, 1));
      obj.setBounce(0.9);
      //obj.setTint(Display.Color.RandomRGB(100).color);
      //obj.setSleepThreshold(100);
      //obj.setSleepThreshold(-1);
      //obj.setCollidesWith([]);
      //obj.setSleepStartEvent(true, true);
      //this.objects.push(obj);
      obj.setAngularVelocity
      */
      const obj = Pool.get(pointer.worldX, pointer.worldY);
      if (obj) {
        obj.setScale(0.8);
        obj.setSleepStartEvent(true, true);
        obj.setSleepThreshold(100);
        this.objects.push(obj);
      }
    });

    this.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
      /*event.pairs.forEach((obj, idx) => {
        if (obj.bodyB.gameObject.name == "enemy")
          obj.bodyB.gameObject.destroy();
      });*/
    });

    this.matter.world.on('sleepstart', (event) => {
      const obj = event.source;
      const idx = this.objects.indexOf(obj.gameObject);
      if (idx !== -1) {
        this.objects.splice(idx, 1);
        Pool.set(obj.gameObject);
      }
      //obj.gameObject.destroy();
    });

    /*this.time.addEvent({
      delay: 30, repeat: 2, callback: () => {
        const rect = this.add.rectangle(Math.Between(0, GM.width), 0, Math.Between(20, 50), Math.Between(20, 20), Display.Color.RandomRGB(100).color);
        //const obj = this.matter.add.image(Math.Between(0, GM.width), Math.Between(0, GM.height), "crate");
        const obj = this.matter.add.gameObject(rect);
        obj.rotation = Math.FloatBetween(0, 1);
        //obj.setScale(Math.FloatBetween(0.2, 0.5));
        obj.setBounce(0.5);
        //obj.setTint(Display.Color.RandomRGB(100).color);
        obj.setSleepThreshold(100);
        //obj.setCollidesWith([]);
        obj.setSleepStartEvent(true, true);
        this.objects.push(obj);
      }
    });*/

    const btn = this.matter.add.image(100, 100, 'crate');
    btn.setScale(0.8);
    //btn.setBody({ type: 'circle', radius: 50 });
    //btn.setScrollFactor(0);
    btn.setInteractive();
    //btn.addListener('pointerout', () => this.matter.world.setGravity(0, 0), this);
    btn.setDepth(1000);
    btn.setSleepThreshold(100);
    btn.setTint(0xffff00);
    //this.objects.push(btn);

    this.cameras.main.setBounds(0, 0, GM.width, GM.height);
    this.cameras.main.startFollow(btn);
  }

  update(time, delta) {
    this.fps.innerText = `Fps: ${this.game.loop.actualFps.toFixed(1)} - Pool: ${Pool.free} - All: ${Pool.objects.length}`;
  }
}
