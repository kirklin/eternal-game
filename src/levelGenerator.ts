import axios from "axios";
import { GameCtx } from "./gameCtx";
import { patrol } from "./components";

export class LevelGenerator {
  private static instance: LevelGenerator;

  private constructor() {}

  public static getInstance(): LevelGenerator {
    if (!LevelGenerator.instance) {
      LevelGenerator.instance = new LevelGenerator();
    }
    return LevelGenerator.instance;
  }

  public generateLevel(difficulty: number): string[] {
    // 基本的关卡生成逻辑
    const level = [
      "                        $$$                  ^^ >               ",
      "       ====    =========    ====     ============================",
      "   $                   #         ==                             ",
      " ===== ^ ^ ^ ^ ================       ==     $$    ===          ",
      "                                  ======     ==    $$$   #      ",
      "     ====     $$$     ====                =========== =====     ",
      "                           ====     > >                    === @",
      "===================================================================",
    ];

    return level;
  }

  public async generateLevelWithAI(difficulty: number): Promise<string[]> {
    try {
      const apiKey = import.meta.env.VITE_DIFY_API_KEY; // 从环境变量获取API密钥
      if (!apiKey) {
        throw new Error("DIFY_API_KEY not found in environment variables");
      }
      const response = await axios.post("https://api.dify.ai/v1/completion-messages", {
        inputs: {
          query: `Generate a platform game level with difficulty ${difficulty}.`,
        },
        response_mode: "blocking",
        user: "game_user", // 可以根据需要修改用户标识
      }, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 30000, // 设置30秒超时
      });
      // 检查响应数据
      if (!response.data || !response.data.answer) {
        throw new Error("Invalid response from API");
      }
      // 假设API返回的数据结构中包含生成的关卡
      // 解析 answer 字段中的 JSON 字符串
      let parsedAnswer;
      try {
        parsedAnswer = JSON.parse(response.data.answer);
      } catch (parseError) {
        console.error("Error parsing API response:", parseError);
        throw new Error("Failed to parse API response");
      }

      if (!parsedAnswer || !Array.isArray(parsedAnswer.level)) {
        throw new Error("Invalid level data in API response");
      }
      // 获取生成的关卡
      const generatedLevel = parsedAnswer.level;

      console.log(generatedLevel);
      return generatedLevel;
      // return this.generateLevel(difficulty);
    } catch (error) {
      console.error("Error generating level with AI:", error);
      return this.generateLevel(difficulty);
    }
  }
}

export const levelConf = {
  tileWidth: 64,
  tileHeight: 64,
  tiles: {
    "=": () => [
      GameCtx.sprite("grass"),
      GameCtx.area({ shape: new GameCtx.Rect(GameCtx.vec2(0, 0), 64, 50) }),
      GameCtx.body({ isStatic: true }),
      GameCtx.anchor("bot"),
      GameCtx.offscreen({ hide: true }),
      "platform",
    ],
    "-": () => [
      GameCtx.sprite("grass2"),
      GameCtx.area({ shape: new GameCtx.Rect(GameCtx.vec2(0, 0), 64, 50) }),
      GameCtx.body({ isStatic: true }),
      GameCtx.offscreen({ hide: true }),
      GameCtx.anchor("bot"),
      "platform",
    ],
    "$": () => [
      GameCtx.sprite("cake"),
      GameCtx.area(),
      GameCtx.scale(2),
      GameCtx.pos(0, -9),
      GameCtx.anchor("bot"),
      GameCtx.offscreen({ hide: true }),
      "cake",
    ],
    "%": () => [
      GameCtx.sprite("prize"),
      GameCtx.area(),
      GameCtx.body({ isStatic: true }),
      GameCtx.anchor("bot"),
      GameCtx.offscreen({ hide: true }),
      "prize",
    ],
    "^": () => [
      GameCtx.sprite("spike"),
      GameCtx.area(),
      GameCtx.body({ isStatic: true }),
      GameCtx.anchor("bot"),
      GameCtx.offscreen({ hide: true }),
      "danger",
    ],
    "#": () => [
      GameCtx.sprite("star"),
      GameCtx.scale(3),
      GameCtx.area(),
      GameCtx.anchor("bot"),
      GameCtx.body(),
      GameCtx.offscreen({ hide: true }),
      "star",
    ],
    ">": () => [
      GameCtx.sprite("monster", {
        anim: "run",
      }),
      GameCtx.area(),
      GameCtx.anchor("bot"),
      GameCtx.body(),
      patrol(),
      GameCtx.offscreen({ hide: true }),
      "enemy",
    ],
    "*": () => [
      GameCtx.sprite("monster", {
        anim: "jump",
      }),
      GameCtx.area(),
      GameCtx.anchor("bot"),
      GameCtx.body(),
      patrol(),
      GameCtx.offscreen({ hide: true }),
      "enemy",
    ],
    "@": () => [
      GameCtx.sprite("portal"),
      GameCtx.area({ scale: 0.5 }),
      GameCtx.anchor("bot"),
      GameCtx.pos(0, -12),
      GameCtx.offscreen({ hide: true }),
      "portal",
    ],
  },
};
