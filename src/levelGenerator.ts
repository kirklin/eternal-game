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
    // const level = [
    //   "                                                                        ",
    //   "                            $$                                         ",
    //   "                      ----      ----                           $$      ",
    //   "            $$    ---                ---                   ----        ",
    //   "        ----   --                        ---            ----            ",
    //   "  $$  --     --                             -----    ----          $$   ",
    //   "    --    --                                     ----            --   # ",
    //   " --    --          ^^    >    %%    >    ^^                   --      %%",
    //   "-    --        ----  ----    --  ----    --  ----          --        -- ",
    //   "   --        --                                   ----    --        --   ",
    //   " --        --                                         ----        --     ",
    //   "-        --                                               ------  @      ",
    //   "========================================================================",
    //   "                                                                        "
    // ]
    return level;
  }

  public async generateLevelWithAI(difficulty: number): Promise<string[]> {
    try {
      const apiKey = import.meta.env.VITE_DIFY_API_KEY; // 从环境变量获取 API 密钥
      if (!apiKey) {
        throw new Error("API 密钥未在环境变量中找到");
      }

      const apiEndpoint = "https://api.dify.ai/v1/workflows/run";
      const apiRequestData = {
        inputs: {
          query: `Generate a platform game level with difficulty ${difficulty * 10}.`,
        },
        response_mode: "blocking",
        user: "game_user", // 可根据需要修改用户标识
      };
      const apiRequestConfig = {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 30000, // 设置 30 秒超时
      };

      const response = await axios.post(apiEndpoint, apiRequestData, apiRequestConfig);

      if (!response.data || !response.data.data) {
        throw new Error("API 返回的响应无效");
      }

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(response.data.data.outputs.text);
      } catch (parseError) {
        console.error("解析 API 响应时出错:", parseError);
        throw new Error("解析 API 响应失败");
      }

      if (!parsedResponse || !Array.isArray(parsedResponse.level)) {
        throw new Error("API 响应中的关卡数据无效");
      }

      const generatedLevel = parsedResponse.level;
      console.log(generatedLevel);
      return generatedLevel;
    } catch (error) {
      console.error("使用 AI 生成关卡时出错:", error);
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
