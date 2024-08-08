import { GameCtx } from "./gameCtx";

export function patrol(speed = 60, dir = 1) {
  return {
    id: "patrol",
    require: ["pos", "area"],
    add() {
      this.on("collide", (obj, col) => {
        if (col.isLeft() || col.isRight()) {
          dir = -dir;
        }
      });
    },
    update() {
      this.move(speed * dir, 0);
    },
  };
}

export function big() {
  let timer = 0;
  let isBig = false;
  let destScale = 1.5;
  return {
    id: "big",
    require: ["scale"],
    update() {
      if (isBig) {
        timer -= GameCtx.dt();
        if (timer <= 0) {
          this.smallify();
        }
      }
      this.scale = this.scale.lerp(GameCtx.vec2(destScale), GameCtx.dt() * 6);
    },
    isBig() {
      return isBig;
    },
    smallify() {
      destScale = 1.5;
      timer = 0;
      isBig = false;
    },
    biggify(time) {
      destScale = 2;
      timer = time;
      isBig = true;
    },
  };
}
