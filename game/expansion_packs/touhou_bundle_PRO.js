/* PRO 拡張パック — 東方Project（統合パック Bundle Schema 4 / Toolkit 1.12.0 以降）
 * 東方Projectの二次創作です（非公式・非営利）。原作: 上海アリス幻樂団（ZUN）。上海アリス幻樂団様とは関係ありません。
 * キャラクター・スペルカード名などの権利は原作者に帰属します。原作の画像・音楽・文章は使っていません。
 * ゲームの「拡張パック」画面で「東方Project」を追加するか、「データ管理 → 統合JSを読み込む」で読み込んでください。
 *
 * 収録: 仲間にできるキャラクター42人（ユニットは敵として出るときの強化版37体と敵専用の9体を含めて88体）／作戦12本（紅霧・春雪・永夜・風神録・地霊殿・星蓮船・神霊廟の異変＋EX＋宴会）／アイテム10種／研究4種／地形6種
 * 設計メモ:
 *   - 基準は一般歩兵 HP3000 / ATK500 / DEF0 / MOB500 / ACC500。はじめは霊夢と魔理沙だけ。異変を解決すると、その異変のキャラクターが仲間になる。
 *   - スペルカードは「1戦闘の使用回数」がある強力な武装。霊夢のお札は「妖怪」タグの相手によく効く。
 *   - 蓬莱人（永琳・輝夜・妹紅）は倒れても耐える。吸血鬼はHPを吸い、毎TURN再生する。
 *   - データは統合メーカー（combined_maker.html）で読み込み・確認して書き出したものです。
 *   - 会話文と説明はゲーム用に書き下ろしたもので、原作の文章ではありません。研究「八雲の式」「守矢の分社」はゲームオリジナルです。
 */
window.VAIS_BUNDLE_PACK = {
  "format": "VAIS_OUTER_OPS_BUNDLE_PACK",
  "schemaVersion": 4,
  "packId": "touhou",
  "packName": "東方Project 拡張パック（二次創作）",
  "units": [
    {
      "id": "th-u-reimu",
      "name": "博麗霊夢",
      "role": "楽園の素敵な巫女",
      "pilot": "",
      "mark": "霊",
      "tags": [
        "生身",
        "人間",
        "巫女",
        "博麗神社",
        "自機"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-reimu-fly",
          "name": "空を飛ぶ程度の能力",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 12,
          "chance": 45,
          "maxUses": 0,
          "note": "何ものにも縛られず、ふわりと攻撃をかわす。"
        },
        {
          "id": "th-s-reimu-kan",
          "name": "博麗の勘",
          "trigger": "before_attack",
          "effect": "hit_up_pt",
          "value": 10,
          "chance": 100,
          "maxUses": 0,
          "note": "理屈ではなく勘で当てる。"
        }
      ],
      "weapons": [
        {
          "name": "ホーミングアミュレット",
          "attackType": "ranged",
          "damageType": "special",
          "note": "相手を追いかけるお札。妖怪によく効く。",
          "powerPct": 95,
          "accuracyPt": 35,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.4,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 34,
          "effects": [
            {
              "timing": "before",
              "effect": "tag_damage_up_pct",
              "value": 25,
              "tag": "妖怪"
            }
          ]
        },
        {
          "name": "パスウェイジョンニードル",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "退魔の針を連射する。",
          "powerPct": 110,
          "accuracyPt": 10,
          "critPt": 5,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 3,
          "hitsMax": 6,
          "hitPowerPct": 22
        },
        {
          "name": "霊符「夢想封印」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "色とりどりの光弾が相手を追う、博麗の巫女の代名詞。",
          "powerPct": 150,
          "accuracyPt": 40,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 120,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff6688",
          "effects": [
            {
              "timing": "before",
              "effect": "tag_damage_up_pct",
              "value": 25,
              "tag": "妖怪"
            }
          ]
        },
        {
          "name": "神霊「夢想封印 瞬」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "瞬時に放つ高威力の封印。",
          "powerPct": 240,
          "accuracyPt": 30,
          "critPt": 10,
          "targetCount": 1,
          "weight": 0.7,
          "minDamage": 200,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#ffffff"
        }
      ],
      "hp": 4300,
      "atk": 720,
      "def": 40,
      "mob": 780,
      "acc": 820,
      "row": "front",
      "growth": {
        "hp": 140,
        "atk": 22,
        "def": 3,
        "mob": 18,
        "acc": 22
      },
      "skillTree": [
        {
          "id": "th-n-reimu-1",
          "skill": {
            "id": "th-s-reimu-barrier",
            "name": "二重結界",
            "trigger": "battle_start",
            "effect": "shield",
            "value": 600,
            "chance": 100,
            "maxUses": 1,
            "note": "結界で仲間を守る。",
            "target": "allies"
          },
          "cost": 1,
          "minLevel": 2,
          "requires": []
        },
        {
          "id": "th-n-reimu-2",
          "skill": {
            "id": "th-s-reimu-seal",
            "name": "封魔陣",
            "trigger": "after_attack",
            "effect": "def_down_pct",
            "value": 15,
            "chance": 40,
            "maxUses": 0,
            "note": "相手の守りを封じる。",
            "target": "opponent",
            "duration": 2
          },
          "cost": 2,
          "minLevel": 4,
          "requires": [
            "th-n-reimu-1"
          ]
        },
        {
          "id": "th-n-reimu-3",
          "skill": {
            "id": "th-s-reimu-tensei",
            "name": "夢想天生",
            "trigger": "on_death",
            "effect": "guts",
            "value": 1,
            "chance": 100,
            "maxUses": 1,
            "note": "あらゆるものから宙に浮き、倒されない。1戦闘1回。"
          },
          "cost": 3,
          "minLevel": 7,
          "requires": [
            "th-n-reimu-2"
          ]
        }
      ],
      "crew": "none"
    },
    {
      "id": "th-u-marisa",
      "name": "霧雨魔理沙",
      "role": "普通の魔法使い",
      "pilot": "",
      "mark": "魔",
      "tags": [
        "生身",
        "人間",
        "魔法使い",
        "自機"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-marisa-power",
          "name": "弾幕はパワー",
          "trigger": "before_attack",
          "effect": "damage_up_pct",
          "value": 12,
          "chance": 50,
          "maxUses": 0,
          "note": "火力で押し切る。"
        },
        {
          "id": "th-s-marisa-effort",
          "name": "努力の魔法使い",
          "trigger": "turn_end",
          "effect": "atk_up_pct",
          "value": 5,
          "chance": 100,
          "maxUses": 0,
          "note": "戦いながら工夫を重ねる。",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "name": "マジックミサイル",
          "attackType": "ranged",
          "damageType": "special",
          "note": "星形の魔力弾を撃ち込む。",
          "powerPct": 120,
          "accuracyPt": 10,
          "critPt": 8,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 60,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 45
        },
        {
          "name": "イリュージョンレーザー",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "細いレーザーで薙ぎ払う。",
          "powerPct": 115,
          "accuracyPt": 25,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "恋符「マスタースパーク」",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "ミニ八卦炉から放つ極太の光線。弾幕はパワーだ。",
          "powerPct": 290,
          "accuracyPt": 15,
          "critPt": 10,
          "targetCount": 2,
          "weight": 0.9,
          "minDamage": 240,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ffe066",
          "effects": [
            {
              "timing": "before",
              "effect": "def_pierce_pct",
              "value": 25
            }
          ]
        },
        {
          "name": "星符「ドラゴンメテオ」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "星の雨を降らせる。",
          "powerPct": 170,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 4,
          "weight": 0.7,
          "minDamage": 120,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#99ccff"
        }
      ],
      "hp": 3900,
      "atk": 800,
      "def": 20,
      "mob": 760,
      "acc": 740,
      "row": "back",
      "growth": {
        "hp": 120,
        "atk": 26,
        "def": 2,
        "mob": 18,
        "acc": 18
      },
      "skillTree": [
        {
          "id": "th-n-marisa-1",
          "skill": {
            "id": "th-s-marisa-broom",
            "name": "箒で急加速",
            "trigger": "battle_start",
            "effect": "mob_up_pct",
            "value": 20,
            "chance": 100,
            "maxUses": 1,
            "note": "",
            "duration": 3
          },
          "cost": 1,
          "minLevel": 2,
          "requires": []
        },
        {
          "id": "th-n-marisa-2",
          "skill": {
            "id": "th-s-marisa-steal",
            "name": "借りていくぜ",
            "trigger": "on_kill",
            "effect": "atk_up_pct",
            "value": 15,
            "chance": 100,
            "maxUses": 0,
            "note": "倒した相手の魔法から学ぶ。",
            "duration": 3
          },
          "cost": 2,
          "minLevel": 4,
          "requires": [
            "th-n-marisa-1"
          ]
        },
        {
          "id": "th-n-marisa-3",
          "skill": {
            "id": "th-s-marisa-final",
            "name": "魔砲「ファイナルスパーク」",
            "trigger": "on_crit",
            "effect": "extra_action",
            "value": 0,
            "chance": 100,
            "maxUses": 1,
            "note": "会心の一撃からもう一発。"
          },
          "cost": 3,
          "minLevel": 7,
          "requires": [
            "th-n-marisa-2"
          ]
        }
      ],
      "crew": "none"
    },
    {
      "id": "th-u-fairy",
      "name": "妖精",
      "role": "いたずら好きの妖精",
      "pilot": "",
      "mark": "妖",
      "tags": [
        "生身",
        "妖精"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [],
      "weapons": [
        {
          "name": "小弾",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 20,
          "hitsMin": 1,
          "hitsMax": 3,
          "hitPowerPct": 45
        }
      ],
      "hp": 1700,
      "atk": 330,
      "def": 0,
      "mob": 680,
      "acc": 450,
      "exp": 60,
      "crew": "none"
    },
    {
      "id": "th-u-maid",
      "name": "妖精メイド",
      "role": "紅魔館のメイド",
      "pilot": "",
      "mark": "メ",
      "tags": [
        "生身",
        "妖精",
        "紅魔館"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [],
      "weapons": [
        {
          "name": "ナイフ弾",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 105,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 25,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 40
        }
      ],
      "hp": 2300,
      "atk": 390,
      "def": 10,
      "mob": 620,
      "acc": 480,
      "exp": 90,
      "crew": "none"
    },
    {
      "id": "th-u-kedama",
      "name": "毛玉",
      "role": "ふわふわの毛玉",
      "pilot": "",
      "mark": "毛",
      "tags": [
        "生身",
        "妖怪"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [],
      "weapons": [
        {
          "name": "体当たり",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 20,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 1500,
      "atk": 300,
      "def": 0,
      "mob": 480,
      "acc": 420,
      "exp": 50,
      "crew": "none"
    },
    {
      "id": "th-u-ghost",
      "name": "幽霊",
      "role": "冥界の幽霊",
      "pilot": "",
      "mark": "幽",
      "tags": [
        "生身",
        "霊"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-ghost-thin",
          "name": "実体のない身体",
          "trigger": "when_targeted",
          "effect": "weapon_resist_pct",
          "value": 20,
          "chance": 100,
          "maxUses": 0,
          "note": "",
          "resistType": "physical"
        }
      ],
      "weapons": [
        {
          "name": "霊弾",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 105,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 25,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 60
        }
      ],
      "hp": 2000,
      "atk": 360,
      "def": 0,
      "mob": 650,
      "acc": 470,
      "exp": 80,
      "crew": "none"
    },
    {
      "id": "th-u-usagi",
      "name": "妖怪兎",
      "role": "迷いの竹林の兎",
      "pilot": "",
      "mark": "兎",
      "tags": [
        "生身",
        "妖怪",
        "兎",
        "永遠亭"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [],
      "weapons": [
        {
          "name": "跳ね弾",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 25,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 40
        }
      ],
      "hp": 2100,
      "atk": 400,
      "def": 10,
      "mob": 760,
      "acc": 500,
      "exp": 90,
      "crew": "none"
    },
    {
      "id": "th-u-hakuro",
      "name": "白狼天狗",
      "role": "山の哨戒天狗",
      "pilot": "",
      "mark": "白",
      "tags": [
        "生身",
        "天狗",
        "妖怪",
        "妖怪の山"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [],
      "weapons": [
        {
          "name": "大太刀",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 10,
          "critPt": 5,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 50,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "盾構え",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 80,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.6,
          "minDamage": 30,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 3000,
      "atk": 480,
      "def": 40,
      "mob": 640,
      "acc": 560,
      "row": "front",
      "exp": 140,
      "crew": "none"
    },
    {
      "id": "th-u-onryo",
      "name": "怨霊",
      "role": "地底に溜まる怨霊",
      "pilot": "",
      "mark": "怨",
      "tags": [
        "生身",
        "霊",
        "怨霊"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-onryo-grudge",
          "name": "怨念",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 3,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "怨念弾",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 1,
          "hitsMax": 3,
          "hitPowerPct": 40,
          "effects": [
            {
              "timing": "after",
              "effect": "atk_down_pct",
              "value": 10,
              "when": "hit",
              "duration": 2
            }
          ]
        }
      ],
      "hp": 2500,
      "atk": 430,
      "def": 0,
      "mob": 560,
      "acc": 500,
      "exp": 130,
      "crew": "none"
    },
    {
      "id": "th-u-shinrei",
      "name": "神霊",
      "role": "欲が形になった霊",
      "pilot": "",
      "mark": "神",
      "tags": [
        "生身",
        "霊"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [],
      "weapons": [
        {
          "name": "欲の光",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 25,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 60
        }
      ],
      "hp": 1900,
      "atk": 380,
      "def": 0,
      "mob": 600,
      "acc": 520,
      "exp": 100,
      "crew": "none"
    },
    {
      "id": "th-u-rumia",
      "name": "ルーミア",
      "role": "宵闇の妖怪",
      "pilot": "",
      "mark": "ル",
      "tags": [
        "生身",
        "妖怪"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-rumia-dark",
          "name": "闇を操る程度の能力",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 10,
          "chance": 100,
          "maxUses": 0,
          "note": "闇をまとって姿をくらます。"
        }
      ],
      "weapons": [
        {
          "name": "ナイトバード",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 105,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 40
        },
        {
          "name": "月符「ムーンライトレイ」",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 2,
          "weight": 0.9,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2
        },
        {
          "name": "闇符「ディマーケイション」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 2,
          "weight": 0.7,
          "minDamage": 50,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "acc_down_pct",
              "value": 15,
              "when": "hit",
              "duration": 2
            }
          ]
        }
      ],
      "hp": 3200,
      "atk": 560,
      "def": 0,
      "mob": 640,
      "acc": 560,
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-01",
        "note": "霧の湖の異変を解決すると、ルーミアが神社に遊びに来るようになる。"
      }
    },
    {
      "id": "th-u-cirno",
      "name": "チルノ",
      "role": "湖上の氷精",
      "pilot": "",
      "mark": "チ",
      "tags": [
        "生身",
        "妖精",
        "氷"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-cirno-cold",
          "name": "冷気を操る程度の能力",
          "trigger": "after_attack",
          "effect": "mob_down_pct",
          "value": 10,
          "chance": 40,
          "maxUses": 0,
          "note": "",
          "target": "opponent",
          "duration": 2
        },
        {
          "id": "th-s-cirno-strong",
          "name": "最強の妖精",
          "trigger": "battle_start",
          "effect": "atk_up_pct",
          "value": 10,
          "chance": 100,
          "maxUses": 1,
          "note": "根拠のない自信で力が湧く。",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "name": "アイシクルショット",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 105,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 32
        },
        {
          "name": "氷符「アイシクルフォール」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 70,
          "usesPerBattle": 2,
          "fxColor": "#99e6ff"
        },
        {
          "name": "凍符「パーフェクトフリーズ」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "弾をまとめて凍らせる。",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.6,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#cceeff",
          "effects": [
            {
              "timing": "after",
              "effect": "stun",
              "value": 1,
              "chance": 25,
              "when": "hit",
              "duration": 1
            }
          ]
        }
      ],
      "hp": 3000,
      "atk": 610,
      "def": 10,
      "mob": 720,
      "acc": 520,
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-01",
        "note": "霧の湖の異変を解決すると、チルノが勝負を挑みに来て、そのまま居着く。"
      }
    },
    {
      "id": "th-u-meiling",
      "name": "紅美鈴",
      "role": "華人小娘",
      "pilot": "",
      "mark": "美",
      "tags": [
        "生身",
        "妖怪",
        "紅魔館",
        "武術"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-meiling-ki",
          "name": "気を使う程度の能力",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 4,
          "chance": 100,
          "maxUses": 0,
          "note": "気の流れを整えて回復する。"
        },
        {
          "id": "th-s-meiling-gate",
          "name": "紅魔館の門番",
          "trigger": "battle_start",
          "effect": "taunt",
          "value": 40,
          "chance": 100,
          "maxUses": 1,
          "note": "門の前に立ちはだかる。",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "name": "星気「星脈地転弾」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "気を込めた拳。",
          "powerPct": 160,
          "accuracyPt": 15,
          "critPt": 8,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "彩符「彩光乱舞」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 60,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 40,
          "usesPerBattle": 2,
          "fxColor": "#ff99cc"
        },
        {
          "name": "華符「芳華絢爛」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 2,
          "weight": 0.8,
          "minDamage": 50,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 5200,
      "atk": 640,
      "def": 80,
      "mob": 600,
      "acc": 560,
      "row": "front",
      "growth": {
        "hp": 170,
        "atk": 20,
        "def": 4,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-02",
        "note": "紅霧異変を解決すると、紅魔館の面々が協力してくれる。"
      }
    },
    {
      "id": "th-u-patchouli",
      "name": "パチュリー・ノーレッジ",
      "role": "動かない大図書館",
      "pilot": "",
      "mark": "パ",
      "tags": [
        "生身",
        "魔法使い",
        "紅魔館"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-patchouli-seven",
          "name": "火水木金土日月を操る程度の能力",
          "trigger": "before_attack",
          "effect": "damage_up_pct",
          "value": 12,
          "chance": 100,
          "maxUses": 0,
          "note": "七つの属性の魔法を使い分ける。"
        },
        {
          "id": "th-s-patchouli-asthma",
          "name": "喘息持ち",
          "trigger": "battle_start",
          "effect": "mob_down_pct",
          "value": 10,
          "chance": 100,
          "maxUses": 1,
          "note": "体が弱く、動くのは苦手。",
          "duration": 2
        }
      ],
      "weapons": [
        {
          "name": "火符「アグニシャイン」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff7733",
          "effects": [
            {
              "timing": "after",
              "effect": "burn",
              "value": 120,
              "when": "hit",
              "duration": 2
            }
          ]
        },
        {
          "name": "水符「プリンセスウンディネ」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 50,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 35
        },
        {
          "name": "日符「ロイヤルフレア」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "小さな太陽を生み出す大魔法。",
          "powerPct": 260,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 4,
          "weight": 0.6,
          "minDamage": 200,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#ffcc33"
        }
      ],
      "hp": 3300,
      "atk": 870,
      "def": 10,
      "mob": 420,
      "acc": 720,
      "row": "back",
      "growth": {
        "hp": 100,
        "atk": 28,
        "def": 1,
        "mob": 10,
        "acc": 22
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-02",
        "note": "紅霧異変を解決すると、紅魔館の面々が協力してくれる。"
      }
    },
    {
      "id": "th-u-sakuya",
      "name": "十六夜咲夜",
      "role": "完全で瀟洒な従者",
      "pilot": "",
      "mark": "咲",
      "tags": [
        "生身",
        "人間",
        "紅魔館",
        "メイド"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-sakuya-time",
          "name": "時間を操る程度の能力",
          "trigger": "battle_start",
          "effect": "extra_action",
          "value": 0,
          "chance": 100,
          "maxUses": 1,
          "note": "時を止めて先に動く。"
        },
        {
          "id": "th-s-sakuya-perfect",
          "name": "完全で瀟洒",
          "trigger": "on_crit",
          "effect": "extra_action",
          "value": 0,
          "chance": 100,
          "maxUses": 1,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "奇術「ミスディレクション」",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "銀のナイフを死角から投げる。",
          "powerPct": 120,
          "accuracyPt": 20,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 40,
          "hitsMin": 3,
          "hitsMax": 6,
          "hitPowerPct": 24
        },
        {
          "name": "幻世「ザ・ワールド」",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "時を止めてナイフを配置する。",
          "powerPct": 170,
          "accuracyPt": 30,
          "critPt": 15,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 100,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 45,
          "usesPerBattle": 2,
          "fxColor": "#c0c0ff"
        },
        {
          "name": "メイド秘技「殺人ドール」",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 2,
          "weight": 0.8,
          "minDamage": 60,
          "hitsMin": 2,
          "hitsMax": 2,
          "hitPowerPct": 55
        }
      ],
      "hp": 3800,
      "atk": 730,
      "def": 30,
      "mob": 820,
      "acc": 860,
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 18,
        "acc": 22
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-02",
        "note": "紅霧異変を解決すると、紅魔館の面々が協力してくれる。"
      }
    },
    {
      "id": "th-u-remilia",
      "name": "レミリア・スカーレット",
      "role": "永遠に紅い幼き月",
      "pilot": "",
      "mark": "レ",
      "tags": [
        "生身",
        "吸血鬼",
        "妖怪",
        "紅魔館"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-remilia-fate",
          "name": "運命を操る程度の能力",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": "当たらない運命にしてしまう。"
        },
        {
          "id": "th-s-remilia-vamp",
          "name": "吸血鬼の再生力",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 4,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "神槍「スピア・ザ・グングニル」",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "紅い魔力の槍を投げ放つ。",
          "powerPct": 240,
          "accuracyPt": 25,
          "critPt": 15,
          "targetCount": 1,
          "weight": 0.9,
          "minDamage": 200,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff3344",
          "effects": [
            {
              "timing": "before",
              "effect": "def_pierce_pct",
              "value": 30
            }
          ]
        },
        {
          "name": "紅符「スカーレットシュート」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1.2,
          "minDamage": 70,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 45
        },
        {
          "name": "夜王「ドラキュラクレイドル」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "体当たりで吸血する。",
          "powerPct": 160,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "drain_pct",
              "value": 30,
              "when": "hit"
            }
          ]
        }
      ],
      "hp": 5800,
      "atk": 900,
      "def": 60,
      "mob": 760,
      "acc": 740,
      "growth": {
        "hp": 150,
        "atk": 24,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-02",
        "note": "紅霧異変を解決すると、紅魔館の面々が協力してくれる。"
      }
    },
    {
      "id": "th-u-flandre",
      "name": "フランドール・スカーレット",
      "role": "悪魔の妹",
      "pilot": "",
      "mark": "フ",
      "tags": [
        "生身",
        "吸血鬼",
        "妖怪",
        "紅魔館"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-flandre-break",
          "name": "ありとあらゆるものを破壊する程度の能力",
          "trigger": "before_attack",
          "effect": "def_pierce_pct",
          "value": 20,
          "chance": 100,
          "maxUses": 0,
          "note": "ものの「目」を握りつぶす。"
        },
        {
          "id": "th-s-flandre-vamp",
          "name": "吸血鬼の再生力",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 4,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "禁忌「レーヴァテイン」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 220,
          "accuracyPt": 10,
          "critPt": 15,
          "targetCount": 2,
          "weight": 0.9,
          "minDamage": 180,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff5500",
          "effects": [
            {
              "timing": "before",
              "effect": "def_pierce_pct",
              "value": 40
            }
          ]
        },
        {
          "name": "禁忌「フォーオブアカインド」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "4人に分身して撃つ。",
          "powerPct": 140,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 60,
          "hitsMin": 4,
          "hitsMax": 4,
          "hitPowerPct": 30
        },
        {
          "name": "QED「495年の波紋」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 160,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 6,
          "weight": 0.6,
          "minDamage": 100,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#ff66ff"
        }
      ],
      "hp": 5200,
      "atk": 1050,
      "def": 40,
      "mob": 780,
      "acc": 700,
      "growth": {
        "hp": 120,
        "atk": 28,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-03",
        "note": "地下に閉じこもっていた悪魔の妹が、外に興味を持つようになる。"
      }
    },
    {
      "id": "th-u-alice",
      "name": "アリス・マーガトロイド",
      "role": "七色の人形使い",
      "pilot": "",
      "mark": "ア",
      "tags": [
        "生身",
        "魔法使い",
        "人形使い"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-alice-doll",
          "name": "人形を操る程度の能力",
          "trigger": "battle_start",
          "effect": "shield",
          "value": 900,
          "chance": 100,
          "maxUses": 1,
          "note": "人形を盾にする。"
        },
        {
          "id": "th-s-alice-cool",
          "name": "都会派の魔法",
          "trigger": "before_attack",
          "effect": "hit_up_pt",
          "value": 10,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "蒼符「博愛の仏蘭西人形」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 115,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 40,
          "hitsMin": 3,
          "hitsMax": 5,
          "hitPowerPct": 26
        },
        {
          "name": "咒詛「首吊り蓬莱人形」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#99aaff"
        },
        {
          "name": "紅符「紅毛の和蘭人形」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 125,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 2,
          "weight": 0.8,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 3600,
      "atk": 700,
      "def": 30,
      "mob": 620,
      "acc": 780,
      "row": "back",
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-04",
        "note": "春雪異変を解決すると、冥界と縁のあった者たちが手を貸してくれる。"
      }
    },
    {
      "id": "th-u-prism",
      "name": "プリズムリバー三姉妹",
      "role": "騒霊楽団",
      "pilot": "",
      "mark": "楽",
      "tags": [
        "生身",
        "騒霊",
        "霊"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-prism-concert",
          "name": "手を使わずに楽器を演奏する程度の能力",
          "trigger": "battle_start",
          "effect": "atk_up_pct",
          "value": 10,
          "chance": 100,
          "maxUses": 1,
          "note": "演奏で仲間を盛り上げる。",
          "target": "allies",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "name": "騒符「ライブポルターガイスト」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "三人の合奏が辺りを揺らす。",
          "powerPct": 130,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 4,
          "weight": 0.9,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ffaa55"
        },
        {
          "name": "弦楽「嵐のアンサンブル」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 35
        }
      ],
      "hp": 4600,
      "atk": 640,
      "def": 20,
      "mob": 640,
      "acc": 640,
      "row": "back",
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-04",
        "note": "春雪異変を解決すると、冥界と縁のあった者たちが手を貸してくれる。"
      }
    },
    {
      "id": "th-u-youmu",
      "name": "魂魄妖夢",
      "role": "半人半霊の庭師",
      "pilot": "",
      "mark": "妖",
      "tags": [
        "生身",
        "半人半霊",
        "剣士",
        "白玉楼"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-youmu-half",
          "name": "半霊",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 10,
          "chance": 50,
          "maxUses": 0,
          "note": "半霊が身代わりになる。"
        },
        {
          "id": "th-s-youmu-sword",
          "name": "剣術を扱う程度の能力",
          "trigger": "on_crit",
          "effect": "extra_action",
          "value": 0,
          "chance": 100,
          "maxUses": 1,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "楼観剣",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 15,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 70
        },
        {
          "name": "人符「現世斬」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "一瞬で間合いを詰めて斬る。",
          "powerPct": 170,
          "accuracyPt": 20,
          "critPt": 15,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "断命剣「冥想斬」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 250,
          "accuracyPt": 10,
          "critPt": 10,
          "targetCount": 1,
          "weight": 0.9,
          "minDamage": 200,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#88ffcc",
          "effects": [
            {
              "timing": "before",
              "effect": "def_pierce_pct",
              "value": 30
            }
          ]
        }
      ],
      "hp": 4100,
      "atk": 830,
      "def": 40,
      "mob": 800,
      "acc": 760,
      "row": "front",
      "growth": {
        "hp": 120,
        "atk": 24,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-04",
        "note": "春雪異変を解決すると、冥界と縁のあった者たちが手を貸してくれる。"
      }
    },
    {
      "id": "th-u-yuyuko",
      "name": "西行寺幽々子",
      "role": "幽冥楼閣の亡霊少女",
      "pilot": "",
      "mark": "幽",
      "tags": [
        "生身",
        "亡霊",
        "霊",
        "白玉楼"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-yuyuko-death",
          "name": "死を操る程度の能力",
          "trigger": "before_attack",
          "effect": "crit_up_pt",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": "死へ誘う蝶。"
        },
        {
          "id": "th-s-yuyuko-ghost",
          "name": "亡霊の身体",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "亡郷「亡我郷」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1.2,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "atk_down_pct",
              "value": 10,
              "when": "hit",
              "duration": 2
            }
          ]
        },
        {
          "name": "華霊「バタフライディルージョン」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 20,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 50,
          "hitsMin": 3,
          "hitsMax": 5,
          "hitPowerPct": 28
        },
        {
          "name": "桜符「完全なる墨染の桜」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 200,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 5,
          "weight": 0.6,
          "minDamage": 150,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#ffb7d5"
        }
      ],
      "hp": 6200,
      "atk": 860,
      "def": 40,
      "mob": 600,
      "acc": 760,
      "row": "back",
      "growth": {
        "hp": 150,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-04",
        "note": "春雪異変を解決すると、冥界と縁のあった者たちが手を貸してくれる。"
      }
    },
    {
      "id": "th-u-ran",
      "name": "八雲藍",
      "role": "すきま妖怪の式",
      "pilot": "",
      "mark": "藍",
      "tags": [
        "生身",
        "妖怪",
        "式神",
        "狐"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-ran-shiki",
          "name": "式神を使う程度の能力",
          "trigger": "battle_start",
          "effect": "atk_up_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "duration": 3
        },
        {
          "id": "th-s-ran-calc",
          "name": "式の計算",
          "trigger": "before_attack",
          "effect": "hit_up_pt",
          "value": 12,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "式神「十二神将の宴」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 4,
          "weight": 0.9,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ffdd55"
        },
        {
          "name": "式輝「狐狸妖怪レーザー」",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 20,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1.2,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "式神「仙狐思念」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 50,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 35
        }
      ],
      "hp": 5400,
      "atk": 900,
      "def": 50,
      "mob": 780,
      "acc": 780,
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-04",
        "note": "春雪異変を解決すると、冥界と縁のあった者たちが手を貸してくれる。"
      }
    },
    {
      "id": "th-u-yukari",
      "name": "八雲紫",
      "role": "神隠しの主犯",
      "pilot": "",
      "mark": "紫",
      "tags": [
        "生身",
        "妖怪",
        "すきま妖怪"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-yukari-border",
          "name": "境界を操る程度の能力",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 18,
          "chance": 100,
          "maxUses": 0,
          "note": "攻撃をすきまに呑み込む。"
        },
        {
          "id": "th-s-yukari-gap",
          "name": "すきまの結界",
          "trigger": "battle_start",
          "effect": "shield",
          "value": 1200,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "target": "allies"
        }
      ],
      "weapons": [
        {
          "name": "紫奥義「弾幕結界」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 180,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 6,
          "weight": 0.6,
          "minDamage": 130,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#cc66ff"
        },
        {
          "name": "結界「生と死の境界」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 200,
          "accuracyPt": 15,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 150,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "before",
              "effect": "def_pierce_pct",
              "value": 40
            }
          ]
        },
        {
          "name": "境符「四重結界」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 20,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1.2,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 7000,
      "atk": 960,
      "def": 80,
      "mob": 760,
      "acc": 840,
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「八雲の式」で、境界の妖怪が気まぐれに手を貸してくれる。"
      }
    },
    {
      "id": "th-u-wriggle",
      "name": "リグル・ナイトバグ",
      "role": "闇に蠢く光の蟲",
      "pilot": "",
      "mark": "リ",
      "tags": [
        "生身",
        "妖怪",
        "蟲"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-wriggle-bug",
          "name": "蟲を操る程度の能力",
          "trigger": "after_attack",
          "effect": "acc_down_pct",
          "value": 10,
          "chance": 40,
          "maxUses": 0,
          "note": "",
          "target": "opponent",
          "duration": 2
        }
      ],
      "weapons": [
        {
          "name": "蛍符「地上の流星」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 32
        },
        {
          "name": "蠢符「ナイトバグトルネード」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2
        }
      ],
      "hp": 3000,
      "atk": 560,
      "def": 10,
      "mob": 720,
      "acc": 560,
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-05",
        "note": "人里を守り切ると、夜の妖怪たちも大人しくなる。"
      }
    },
    {
      "id": "th-u-mystia",
      "name": "ミスティア・ローレライ",
      "role": "夜雀の妖怪",
      "pilot": "",
      "mark": "ミ",
      "tags": [
        "生身",
        "妖怪",
        "鳥"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-mystia-song",
          "name": "歌で人を狂わす程度の能力",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 10,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "声符「梟の夜鳴声」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 42
        },
        {
          "name": "夜盲「夜雀の歌」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "歌声で相手を鳥目にする。",
          "powerPct": 120,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 50,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "effects": [
            {
              "timing": "after",
              "effect": "acc_down_pct",
              "value": 20,
              "when": "hit",
              "duration": 2
            }
          ]
        }
      ],
      "hp": 3100,
      "atk": 580,
      "def": 0,
      "mob": 760,
      "acc": 540,
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-05",
        "note": "人里を守り切ると、夜の妖怪たちも大人しくなる。"
      }
    },
    {
      "id": "th-u-keine",
      "name": "上白沢慧音",
      "role": "知識と歴史の半獣",
      "pilot": "",
      "mark": "慧",
      "tags": [
        "生身",
        "半獣",
        "人里"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-keine-history",
          "name": "歴史を食べる程度の能力",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": "人里の歴史を隠して守る。"
        },
        {
          "id": "th-s-keine-teacher",
          "name": "寺子屋の先生",
          "trigger": "battle_start",
          "effect": "def_up_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "target": "allies",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "name": "産霊「ファーストピラミッド」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#66ccff"
        },
        {
          "name": "国符「三種の神器 剣」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "頭突き",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 20,
          "critPt": 10,
          "targetCount": 1,
          "weight": 0.6,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 4900,
      "atk": 700,
      "def": 60,
      "mob": 600,
      "acc": 680,
      "row": "front",
      "growth": {
        "hp": 160,
        "atk": 20,
        "def": 4,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-05",
        "note": "人里を守り切ると、慧音が仲間になる。"
      }
    },
    {
      "id": "th-u-reisen",
      "name": "鈴仙・優曇華院・イナバ",
      "role": "狂気の月の兎",
      "pilot": "",
      "mark": "鈴",
      "tags": [
        "生身",
        "玉兎",
        "月",
        "永遠亭"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-reisen-lunatic",
          "name": "狂気を操る程度の能力",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 15,
          "chance": 50,
          "maxUses": 0,
          "note": "波長をずらして見えなくする。"
        }
      ],
      "weapons": [
        {
          "name": "座薬型の弾丸",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 115,
          "accuracyPt": 20,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 32
        },
        {
          "name": "狂視「狂視調律」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff4466",
          "effects": [
            {
              "timing": "after",
              "effect": "acc_down_pct",
              "value": 15,
              "when": "hit",
              "duration": 2
            }
          ]
        },
        {
          "name": "散符「真実の月（インビジブルフルムーン）」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 3900,
      "atk": 780,
      "def": 30,
      "mob": 800,
      "acc": 820,
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 18,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-06",
        "note": "永夜異変を解決すると、永遠亭の住人たちが手を貸してくれる。"
      }
    },
    {
      "id": "th-u-eirin",
      "name": "八意永琳",
      "role": "月の頭脳",
      "pilot": "",
      "mark": "永",
      "tags": [
        "生身",
        "月人",
        "蓬莱人",
        "永遠亭"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-eirin-medicine",
          "name": "あらゆる薬を作る程度の能力",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 4,
          "chance": 100,
          "maxUses": 0,
          "note": "仲間の傷をすぐに治す。",
          "target": "allies"
        },
        {
          "id": "th-s-eirin-hourai",
          "name": "蓬莱の薬",
          "trigger": "on_death",
          "effect": "guts",
          "value": 1,
          "chance": 100,
          "maxUses": 1,
          "note": "不老不死の身体。1戦闘1回、倒れずに耐える。"
        }
      ],
      "weapons": [
        {
          "name": "天丸「壺中の天地」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 4,
          "weight": 0.9,
          "minDamage": 100,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#5577ff"
        },
        {
          "name": "神符「天人の系譜」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 180,
          "accuracyPt": 20,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 120,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "天文「天網蜘網捕蝶の法」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 20,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1.2,
          "minDamage": 60,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 40
        }
      ],
      "hp": 6200,
      "atk": 900,
      "def": 60,
      "mob": 700,
      "acc": 860,
      "row": "back",
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-06",
        "note": "永夜異変を解決すると、永遠亭の住人たちが手を貸してくれる。"
      }
    },
    {
      "id": "th-u-kaguya",
      "name": "蓬莱山輝夜",
      "role": "永遠と須臾の罪人",
      "pilot": "",
      "mark": "輝",
      "tags": [
        "生身",
        "月人",
        "蓬莱人",
        "永遠亭"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-kaguya-eternity",
          "name": "永遠と須臾を操る程度の能力",
          "trigger": "battle_start",
          "effect": "extra_action",
          "value": 0,
          "chance": 100,
          "maxUses": 1,
          "note": "一瞬を積み重ねて先に動く。"
        },
        {
          "id": "th-s-kaguya-hourai",
          "name": "蓬莱の薬",
          "trigger": "on_death",
          "effect": "guts",
          "value": 1,
          "chance": 100,
          "maxUses": 1,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "難題「龍の頸の玉 -五色の弾丸-」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1.2,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 60
        },
        {
          "name": "神宝「蓬莱の玉の枝 -夢色の郷-」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 230,
          "accuracyPt": 10,
          "critPt": 10,
          "targetCount": 2,
          "weight": 0.9,
          "minDamage": 180,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ffccff"
        },
        {
          "name": "「永夜返し」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 6,
          "weight": 0.6,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#6677ff"
        }
      ],
      "hp": 6000,
      "atk": 940,
      "def": 50,
      "mob": 740,
      "acc": 820,
      "row": "back",
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-06",
        "note": "永夜異変を解決すると、永遠亭の住人たちが手を貸してくれる。"
      }
    },
    {
      "id": "th-u-mokou",
      "name": "藤原妹紅",
      "role": "蓬莱の人の形",
      "pilot": "",
      "mark": "妹",
      "tags": [
        "生身",
        "人間",
        "蓬莱人"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-mokou-undying",
          "name": "老いる事も死ぬ事も無い程度の能力",
          "trigger": "on_death",
          "effect": "guts",
          "value": 1,
          "chance": 100,
          "maxUses": 2,
          "note": "何度でも蘇る。1戦闘2回まで。"
        },
        {
          "id": "th-s-mokou-resurrection",
          "name": "リザレクション",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 6,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "不死「火の鳥 -鳳翼天翔-」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1.2,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "burn",
              "value": 150,
              "when": "hit",
              "duration": 2
            }
          ]
        },
        {
          "name": "蓬莱「凱風快晴 -フジヤマヴォルケイノ-」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 250,
          "accuracyPt": 5,
          "critPt": 10,
          "targetCount": 4,
          "weight": 0.6,
          "minDamage": 200,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#ff6600"
        },
        {
          "name": "滅罪「正直者の死」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 160,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 100,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 5600,
      "atk": 920,
      "def": 40,
      "mob": 720,
      "acc": 740,
      "row": "front",
      "growth": {
        "hp": 150,
        "atk": 24,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-07",
        "note": "肝試しを終えると、竹林の案内人が手を貸してくれる。"
      }
    },
    {
      "id": "th-u-nitori",
      "name": "河城にとり",
      "role": "超妖怪弾頭",
      "pilot": "",
      "mark": "に",
      "tags": [
        "生身",
        "河童",
        "妖怪",
        "技術者",
        "妖怪の山"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-nitori-camo",
          "name": "光学「オプティカルカモフラージュ」",
          "trigger": "battle_start",
          "effect": "mob_up_pct",
          "value": 30,
          "chance": 100,
          "maxUses": 1,
          "note": "光学迷彩で姿を消す。",
          "duration": 2
        },
        {
          "id": "th-s-nitori-gadget",
          "name": "河童の発明品",
          "trigger": "battle_start",
          "effect": "shield",
          "value": 800,
          "chance": 100,
          "maxUses": 1,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "河童「のびーるアーム」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "洪水「ウーズフラッディング」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#33aaff"
        },
        {
          "name": "水符「河童のポロロッカ」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 115,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 32
        }
      ],
      "hp": 3700,
      "atk": 700,
      "def": 60,
      "mob": 660,
      "acc": 740,
      "row": "back",
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-08",
        "note": "守矢神社の騒ぎが収まると、山の妖怪たちとも打ち解ける。"
      }
    },
    {
      "id": "th-u-aya",
      "name": "射命丸文",
      "role": "里に最も近い天狗",
      "pilot": "",
      "mark": "文",
      "tags": [
        "生身",
        "天狗",
        "妖怪",
        "妖怪の山"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-aya-wind",
          "name": "風を操る程度の能力",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 18,
          "chance": 100,
          "maxUses": 0,
          "note": "幻想郷最速の足で避ける。"
        },
        {
          "id": "th-s-aya-scoop",
          "name": "特ダネの気配",
          "trigger": "on_evade",
          "effect": "counter",
          "value": 80,
          "chance": 50,
          "maxUses": 0,
          "note": "避けたついでに一枚撮る。"
        }
      ],
      "weapons": [
        {
          "name": "疾風「風神少女」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 15,
          "critPt": 5,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 40,
          "hitsMin": 4,
          "hitsMax": 6,
          "hitPowerPct": 22
        },
        {
          "name": "「幻想風靡」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "目にも止まらぬ速さで駆け抜ける。",
          "powerPct": 210,
          "accuracyPt": 20,
          "critPt": 20,
          "targetCount": 1,
          "weight": 0.9,
          "minDamage": 160,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff8844"
        },
        {
          "name": "旋符「紅葉扇風」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1,
          "minDamage": 50,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 4100,
      "atk": 760,
      "def": 20,
      "mob": 980,
      "acc": 800,
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 24,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-08",
        "note": "守矢神社の騒ぎが収まると、山の妖怪たちとも打ち解ける。"
      }
    },
    {
      "id": "th-u-sanae",
      "name": "東風谷早苗",
      "role": "祀られる風の人間",
      "pilot": "",
      "mark": "早",
      "tags": [
        "生身",
        "人間",
        "現人神",
        "守矢神社"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-sanae-miracle",
          "name": "奇跡を起こす程度の能力",
          "trigger": "before_attack",
          "effect": "crit_up_pt",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "th-s-sanae-faith",
          "name": "神々の加護",
          "trigger": "on_death",
          "effect": "guts",
          "value": 1,
          "chance": 40,
          "maxUses": 1,
          "note": "奇跡的に持ちこたえることがある。"
        }
      ],
      "weapons": [
        {
          "name": "秘術「グレイソーマタージ」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1.2,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "奇跡「客星の明るすぎる夜」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 220,
          "accuracyPt": 10,
          "critPt": 20,
          "targetCount": 2,
          "weight": 0.9,
          "minDamage": 170,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#66ff99"
        },
        {
          "name": "開海「海が割れる日」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 4000,
      "atk": 780,
      "def": 30,
      "mob": 720,
      "acc": 780,
      "growth": {
        "hp": 120,
        "atk": 22,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-08",
        "note": "守矢神社の騒ぎが収まると、守矢の神々も幻想郷になじんでいく。"
      }
    },
    {
      "id": "th-u-kanako",
      "name": "八坂神奈子",
      "role": "山坂と湖の権化",
      "pilot": "",
      "mark": "神",
      "tags": [
        "生身",
        "神",
        "守矢神社"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-kanako-sky",
          "name": "乾を創造する程度の能力",
          "trigger": "battle_start",
          "effect": "def_up_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "target": "allies",
          "duration": 3
        },
        {
          "id": "th-s-kanako-god",
          "name": "軍神の威光",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "神祭「エクスパンデッド・オンバシラ」",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 230,
          "accuracyPt": 10,
          "critPt": 10,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 180,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff5555"
        },
        {
          "name": "御柱",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "「マウンテン・オブ・フェイス」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 6,
          "weight": 0.6,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#ffaa66"
        }
      ],
      "hp": 6900,
      "atk": 960,
      "def": 90,
      "mob": 620,
      "acc": 780,
      "row": "back",
      "growth": {
        "hp": 160,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-08",
        "note": "守矢神社の騒ぎが収まると、守矢の神々も幻想郷になじんでいく。"
      }
    },
    {
      "id": "th-u-suwako",
      "name": "洩矢諏訪子",
      "role": "土着神の頂点",
      "pilot": "",
      "mark": "諏",
      "tags": [
        "生身",
        "神",
        "守矢神社"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-suwako-earth",
          "name": "坤を創造する程度の能力",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 5,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "祟符「ミシャグジさま」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1.2,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "atk_down_pct",
              "value": 15,
              "when": "hit",
              "duration": 2
            }
          ]
        },
        {
          "name": "土着神「ケロちゃん風雨に負けず」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 5,
          "weight": 0.6,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#99cc33"
        },
        {
          "name": "開宴「二拝二拍一拝」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 180,
          "accuracyPt": 15,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 120,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 6100,
      "atk": 940,
      "def": 70,
      "mob": 760,
      "acc": 780,
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「守矢の分社」で、もう一柱の神様が姿を見せる。"
      }
    },
    {
      "id": "th-u-yugi",
      "name": "星熊勇儀",
      "role": "語られる怪力乱神",
      "pilot": "",
      "mark": "勇",
      "tags": [
        "生身",
        "鬼",
        "妖怪",
        "旧都"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-yugi-might",
          "name": "怪力乱神を持つ程度の能力",
          "trigger": "before_attack",
          "effect": "damage_up_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "th-s-yugi-oni",
          "name": "鬼の頑丈さ",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 20,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "四天王奥義「三歩必殺」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 270,
          "accuracyPt": 10,
          "critPt": 15,
          "targetCount": 3,
          "weight": 0.7,
          "minDamage": 220,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#ff3333"
        },
        {
          "name": "鬼符「怪力乱神」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "力業「大江山嵐」",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 7200,
      "atk": 1000,
      "def": 80,
      "mob": 560,
      "acc": 680,
      "row": "front",
      "growth": {
        "hp": 180,
        "atk": 20,
        "def": 4,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-09",
        "note": "地底の異変を解決すると、旧都の鬼や地霊殿の住人たちと縁ができる。"
      }
    },
    {
      "id": "th-u-satori",
      "name": "古明地さとり",
      "role": "怨霊も恐れ怯む少女",
      "pilot": "",
      "mark": "さ",
      "tags": [
        "生身",
        "覚",
        "妖怪",
        "地霊殿"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-satori-read",
          "name": "心を読む程度の能力",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 20,
          "chance": 100,
          "maxUses": 0,
          "note": "何をするか読めている。"
        },
        {
          "id": "th-s-satori-aim",
          "name": "読心の照準",
          "trigger": "before_attack",
          "effect": "hit_up_pt",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "想起「テリブルスーヴニール」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "相手の心にあるトラウマを呼び起こす。",
          "powerPct": 150,
          "accuracyPt": 20,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff88cc",
          "effects": [
            {
              "timing": "after",
              "effect": "atk_down_pct",
              "value": 15,
              "when": "hit",
              "duration": 2
            }
          ]
        },
        {
          "name": "想起の弾幕",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 25,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 50,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 32
        }
      ],
      "hp": 4300,
      "atk": 820,
      "def": 30,
      "mob": 700,
      "acc": 860,
      "row": "back",
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-09",
        "note": "地底の異変を解決すると、旧都の鬼や地霊殿の住人たちと縁ができる。"
      }
    },
    {
      "id": "th-u-rin",
      "name": "火焔猫燐",
      "role": "地獄の輪禍",
      "pilot": "",
      "mark": "燐",
      "tags": [
        "生身",
        "火車",
        "妖怪",
        "地霊殿"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-rin-corpse",
          "name": "死体を持ち去る程度の能力",
          "trigger": "on_kill",
          "effect": "heal_maxhp_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "th-s-rin-onryo",
          "name": "怨霊を操る",
          "trigger": "battle_start",
          "effect": "atk_up_pct",
          "value": 10,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "target": "allies",
          "duration": 2
        }
      ],
      "weapons": [
        {
          "name": "猫符「キャッツウォーク」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 115,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 40,
          "hitsMin": 3,
          "hitsMax": 5,
          "hitPowerPct": 26
        },
        {
          "name": "贖罪「旧地獄の針山」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 4,
          "weight": 0.9,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#cc3366"
        },
        {
          "name": "「死灰復燃」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "burn",
              "value": 120,
              "when": "hit",
              "duration": 2
            }
          ]
        }
      ],
      "hp": 4100,
      "atk": 760,
      "def": 20,
      "mob": 840,
      "acc": 720,
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 20,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-09",
        "note": "地底の異変を解決すると、旧都の鬼や地霊殿の住人たちと縁ができる。"
      }
    },
    {
      "id": "th-u-utsuho",
      "name": "霊烏路空",
      "role": "熱かい悩む神の火",
      "pilot": "",
      "mark": "空",
      "tags": [
        "生身",
        "地獄鴉",
        "八咫烏",
        "地霊殿"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-utsuho-fusion",
          "name": "核融合を操る程度の能力",
          "trigger": "before_attack",
          "effect": "damage_up_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "th-s-utsuho-yata",
          "name": "八咫烏の力",
          "trigger": "turn_start",
          "effect": "atk_up_pct",
          "value": 5,
          "chance": 100,
          "maxUses": 0,
          "note": "",
          "duration": 2
        }
      ],
      "weapons": [
        {
          "name": "核熱「ニュークリアフュージョン」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 250,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 200,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ffaa00",
          "effects": [
            {
              "timing": "after",
              "effect": "burn",
              "value": 200,
              "when": "hit",
              "duration": 2
            }
          ]
        },
        {
          "name": "爆符「ギガフレア」",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 320,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 2,
          "weight": 0.6,
          "minDamage": 260,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#ffdd00",
          "effects": [
            {
              "timing": "after",
              "effect": "recoil_pct",
              "value": 3
            }
          ]
        },
        {
          "name": "制御棒",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.1,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 6600,
      "atk": 1100,
      "def": 50,
      "mob": 560,
      "acc": 680,
      "row": "back",
      "growth": {
        "hp": 120,
        "atk": 28,
        "def": 2,
        "mob": 16,
        "acc": 14
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-09",
        "note": "地底の異変を解決すると、旧都の鬼や地霊殿の住人たちと縁ができる。"
      }
    },
    {
      "id": "th-u-koishi",
      "name": "古明地こいし",
      "role": "閉じた恋の瞳",
      "pilot": "",
      "mark": "こ",
      "tags": [
        "生身",
        "覚",
        "妖怪",
        "地霊殿"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-koishi-unconscious",
          "name": "無意識を操る程度の能力",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 25,
          "chance": 60,
          "maxUses": 0,
          "note": "誰にも気づかれない。"
        },
        {
          "id": "th-s-koishi-whim",
          "name": "気まぐれ",
          "trigger": "battle_start",
          "effect": "mob_up_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "name": "本能「イドの解放」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 4,
          "weight": 1.2,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "「嫌われ者のフィロソフィ」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 6,
          "weight": 0.6,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#66dd88"
        },
        {
          "name": "抑制「スーパーエゴ」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 15,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 4700,
      "atk": 900,
      "def": 20,
      "mob": 920,
      "acc": 760,
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 22,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-09",
        "note": "地底の異変を解決すると、いつの間にか古明地こいしもついて来ている。"
      }
    },
    {
      "id": "th-u-nazrin",
      "name": "ナズーリン",
      "role": "小さな小さな賢将",
      "pilot": "",
      "mark": "ナ",
      "tags": [
        "生身",
        "妖怪",
        "鼠",
        "命蓮寺"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-nazrin-find",
          "name": "探し物を探し当てる程度の能力",
          "trigger": "before_attack",
          "effect": "hit_up_pt",
          "value": 20,
          "chance": 100,
          "maxUses": 0,
          "note": "弱点をダウジングで見つける。"
        }
      ],
      "weapons": [
        {
          "name": "視符「ナズーリンペンデュラム」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 20,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 42
        },
        {
          "name": "捜符「レアメタルディテクター」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2
        }
      ],
      "hp": 3300,
      "atk": 610,
      "def": 20,
      "mob": 800,
      "acc": 760,
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-10",
        "note": "聖白蓮の封印が解けると、命蓮寺の面々が仲間になる。"
      }
    },
    {
      "id": "th-u-ichirin",
      "name": "雲居一輪",
      "role": "守り守られし大輪",
      "pilot": "",
      "mark": "一",
      "tags": [
        "生身",
        "妖怪",
        "入道使い",
        "命蓮寺"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-ichirin-unzan",
          "name": "入道を使う程度の能力",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "th-s-ichirin-guard",
          "name": "雲山の守り",
          "trigger": "battle_start",
          "effect": "taunt",
          "value": 30,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "name": "拳符「天網サンドバッグ」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "入道の雲山が拳を振るう。",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1.2,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "鉄拳「問答無用の妖怪拳」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 220,
          "accuracyPt": 10,
          "critPt": 10,
          "targetCount": 1,
          "weight": 0.9,
          "minDamage": 170,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#aabbcc"
        }
      ],
      "hp": 5300,
      "atk": 800,
      "def": 70,
      "mob": 600,
      "acc": 660,
      "row": "front",
      "growth": {
        "hp": 160,
        "atk": 20,
        "def": 4,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-10",
        "note": "聖白蓮の封印が解けると、命蓮寺の面々が仲間になる。"
      }
    },
    {
      "id": "th-u-murasa",
      "name": "村紗水蜜",
      "role": "水難事故の念縛霊",
      "pilot": "",
      "mark": "水",
      "tags": [
        "生身",
        "船幽霊",
        "霊",
        "命蓮寺"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-murasa-wreck",
          "name": "水難事故を引き起こす程度の能力",
          "trigger": "before_attack",
          "effect": "crit_up_pt",
          "value": 10,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "転覆「道連れアンカー」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 200,
          "accuracyPt": 10,
          "critPt": 10,
          "targetCount": 1,
          "weight": 0.9,
          "minDamage": 150,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#3388cc",
          "effects": [
            {
              "timing": "after",
              "effect": "mob_down_pct",
              "value": 20,
              "when": "hit",
              "duration": 2
            }
          ]
        },
        {
          "name": "湊符「幽霊船の港」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 4,
          "weight": 1.1,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 4700,
      "atk": 840,
      "def": 30,
      "mob": 700,
      "acc": 720,
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-10",
        "note": "聖白蓮の封印が解けると、命蓮寺の面々が仲間になる。"
      }
    },
    {
      "id": "th-u-shou",
      "name": "寅丸星",
      "role": "毘沙門天の弟子",
      "pilot": "",
      "mark": "星",
      "tags": [
        "生身",
        "妖怪",
        "虎",
        "命蓮寺"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-shou-treasure",
          "name": "財宝が集まる程度の能力",
          "trigger": "battle_start",
          "effect": "atk_up_pct",
          "value": 10,
          "chance": 100,
          "maxUses": 1,
          "note": "毘沙門天の加護。",
          "target": "allies",
          "duration": 2
        }
      ],
      "weapons": [
        {
          "name": "宝塔「グレイテストトレジャー」",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 230,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 180,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ffd700"
        },
        {
          "name": "光符「アブソリュートジャスティス」",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "寅符「ハングリータイガー」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 160,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 100,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 5500,
      "atk": 880,
      "def": 60,
      "mob": 680,
      "acc": 780,
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-10",
        "note": "聖白蓮の封印が解けると、命蓮寺の面々が仲間になる。"
      }
    },
    {
      "id": "th-u-byakuren",
      "name": "聖白蓮",
      "role": "封印された大魔法使い",
      "pilot": "",
      "mark": "聖",
      "tags": [
        "生身",
        "魔法使い",
        "僧侶",
        "命蓮寺"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-byakuren-magic",
          "name": "魔法を使う程度の能力（身体強化）",
          "trigger": "battle_start",
          "effect": "atk_up_pct",
          "value": 20,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "duration": 3
        },
        {
          "id": "th-s-byakuren-youth",
          "name": "若返りの魔法",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 4,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "超人「聖白蓮」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "身体能力を高める魔法で一気に間合いを詰める。",
          "powerPct": 200,
          "accuracyPt": 15,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 150,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "「魔法銀河系」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 180,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 5,
          "weight": 0.6,
          "minDamage": 120,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#cc99ff"
        },
        {
          "name": "飛鉢「フライングファンタスティカ」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 7100,
      "atk": 960,
      "def": 80,
      "mob": 760,
      "acc": 820,
      "row": "front",
      "growth": {
        "hp": 160,
        "atk": 24,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-10",
        "note": "聖白蓮の封印が解けると、命蓮寺の面々が仲間になる。"
      }
    },
    {
      "id": "th-u-nue",
      "name": "封獣ぬえ",
      "role": "未確認幻想飛行少女",
      "pilot": "",
      "mark": "鵺",
      "tags": [
        "生身",
        "妖怪",
        "鵺",
        "命蓮寺"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-nue-unknown",
          "name": "正体を判らなくする程度の能力",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 22,
          "chance": 100,
          "maxUses": 0,
          "note": "正体がつかめず狙いが定まらない。"
        }
      ],
      "weapons": [
        {
          "name": "正体不明「忿怒のレッドUFO襲来」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1.2,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "「遊星よりの弾幕X」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 6,
          "weight": 0.6,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#ff3366"
        },
        {
          "name": "鵺符「弾幕キメラ」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 160,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 80,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 45
        }
      ],
      "hp": 5100,
      "atk": 900,
      "def": 40,
      "mob": 820,
      "acc": 760,
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-10",
        "note": "聖白蓮の封印が解けると、正体不明の妖怪もいつの間にか寺に居着く。"
      }
    },
    {
      "id": "th-u-yoshika",
      "name": "宮古芳香",
      "role": "忠実な死体",
      "pilot": "",
      "mark": "芳",
      "tags": [
        "生身",
        "キョンシー",
        "死体"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-yoshika-eat",
          "name": "何でも食べる程度の能力",
          "trigger": "on_kill",
          "effect": "heal_maxhp_pct",
          "value": 30,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "th-s-yoshika-body",
          "name": "死体の身体",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 5,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "毒爪「ポイズンレイズ」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "burn",
              "value": 120,
              "when": "hit",
              "duration": 2
            }
          ]
        },
        {
          "name": "回復「ヒールバイデザイア」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 2,
          "weight": 0.6,
          "minDamage": 40,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 12000,
      "atk": 750,
      "def": 90,
      "mob": 400,
      "acc": 520,
      "row": "front",
      "exp": 600,
      "crew": "none"
    },
    {
      "id": "th-u-seiga",
      "name": "霍青娥",
      "role": "壁抜けの邪仙",
      "pilot": "",
      "mark": "青",
      "tags": [
        "生身",
        "仙人",
        "邪仙",
        "神霊廟"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-seiga-wall",
          "name": "壁をすり抜けられる程度の能力",
          "trigger": "before_attack",
          "effect": "def_pierce_pct",
          "value": 30,
          "chance": 100,
          "maxUses": 0,
          "note": "守りの壁をすり抜けて攻撃する。"
        }
      ],
      "weapons": [
        {
          "name": "邪符「ヤンシャオグイ」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#33cccc"
        },
        {
          "name": "入魔「ゾウフォルゥモォ」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 50,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 35,
          "effects": [
            {
              "timing": "after",
              "effect": "atk_up_pct",
              "value": 10,
              "target": "allies",
              "duration": 2
            }
          ]
        }
      ],
      "hp": 4500,
      "atk": 820,
      "def": 30,
      "mob": 760,
      "acc": 780,
      "row": "back",
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-11",
        "note": "神霊廟の異変を解決すると、道士たちも幻想郷の一員になる。"
      }
    },
    {
      "id": "th-u-futo",
      "name": "物部布都",
      "role": "古代日本の尸解仙",
      "pilot": "",
      "mark": "布",
      "tags": [
        "生身",
        "尸解仙",
        "仙人",
        "神霊廟"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-futo-fengshui",
          "name": "風水を操る程度の能力",
          "trigger": "battle_start",
          "effect": "mob_up_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "target": "allies",
          "duration": 2
        }
      ],
      "weapons": [
        {
          "name": "投皿「物部の八十平瓮」",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 125,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 50,
          "hitsMin": 3,
          "hitsMax": 5,
          "hitPowerPct": 28
        },
        {
          "name": "天符「雨の磐舟」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#66aaff"
        },
        {
          "name": "炎符「桜井寺炎上」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "burn",
              "value": 150,
              "when": "hit",
              "duration": 2
            }
          ]
        }
      ],
      "hp": 4700,
      "atk": 860,
      "def": 30,
      "mob": 740,
      "acc": 780,
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-11",
        "note": "神霊廟の異変を解決すると、道士たちも幻想郷の一員になる。"
      }
    },
    {
      "id": "th-u-miko",
      "name": "豊聡耳神子",
      "role": "聖徳道士",
      "pilot": "",
      "mark": "神子",
      "tags": [
        "生身",
        "聖人",
        "仙人",
        "神霊廟"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-miko-ten",
          "name": "十人の話を同時に聞く程度の能力",
          "trigger": "before_attack",
          "effect": "hit_up_pt",
          "value": 20,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "th-s-miko-saint",
          "name": "聖人の威光",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "光符「グセフラッシュ」",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 20,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1.2,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "名誉「十二階の色彩」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "「星降る神霊廟」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 180,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 6,
          "weight": 0.6,
          "minDamage": 130,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#ffe680"
        }
      ],
      "hp": 7200,
      "atk": 1000,
      "def": 70,
      "mob": 760,
      "acc": 900,
      "row": "back",
      "growth": {
        "hp": 120,
        "atk": 24,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-11",
        "note": "神霊廟の異変を解決すると、道士たちも幻想郷の一員になる。"
      }
    },
    {
      "id": "th-u-mamizou",
      "name": "二ッ岩マミゾウ",
      "role": "佐渡の二ッ岩",
      "pilot": "",
      "mark": "狸",
      "tags": [
        "生身",
        "化け狸",
        "妖怪"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "th-s-mamizou-bake",
          "name": "化けさせる程度の能力",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": "葉っぱの身代わりに化けさせる。"
        },
        {
          "id": "th-s-mamizou-boss",
          "name": "化け狸の親分",
          "trigger": "battle_start",
          "effect": "shield",
          "value": 1000,
          "chance": 100,
          "maxUses": 1,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "変化「二ッ岩家の裁き」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1.2,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "狸符「満月のポンポコリン」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 5,
          "weight": 0.6,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#cc8844"
        },
        {
          "name": "変化「百鬼妖界の門」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 10,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 6100,
      "atk": 920,
      "def": 60,
      "mob": 700,
      "acc": 780,
      "growth": {
        "hp": 120,
        "atk": 20,
        "def": 2,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "th-m-11",
        "note": "神霊廟の騒ぎが収まると、佐渡から来た化け狸もそのまま幻想郷に住み着く。"
      }
    },
    {
      "id": "th-e-rumia",
      "name": "ルーミア",
      "role": "宵闇の妖怪",
      "pilot": "",
      "mark": "ル",
      "tags": [
        "生身",
        "妖怪"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-rumia-dark",
          "name": "闇を操る程度の能力",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 10,
          "chance": 100,
          "maxUses": 0,
          "note": "闇をまとって姿をくらます。"
        }
      ],
      "weapons": [
        {
          "name": "ナイトバード",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 105,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 40
        },
        {
          "name": "月符「ムーンライトレイ」",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 2,
          "weight": 0.9,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2
        },
        {
          "name": "闇符「ディマーケイション」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 2,
          "weight": 0.7,
          "minDamage": 50,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "acc_down_pct",
              "value": 15,
              "when": "hit",
              "duration": 2
            }
          ]
        }
      ],
      "hp": 5100,
      "atk": 560,
      "def": 0,
      "mob": 640,
      "acc": 560,
      "exp": 510,
      "crew": "none"
    },
    {
      "id": "th-e-cirno",
      "name": "チルノ",
      "role": "湖上の氷精",
      "pilot": "",
      "mark": "チ",
      "tags": [
        "生身",
        "妖精",
        "氷"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-cirno-cold",
          "name": "冷気を操る程度の能力",
          "trigger": "after_attack",
          "effect": "mob_down_pct",
          "value": 10,
          "chance": 40,
          "maxUses": 0,
          "note": "",
          "target": "opponent",
          "duration": 2
        },
        {
          "id": "th-s-cirno-strong",
          "name": "最強の妖精",
          "trigger": "battle_start",
          "effect": "atk_up_pct",
          "value": 10,
          "chance": 100,
          "maxUses": 1,
          "note": "根拠のない自信で力が湧く。",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "name": "アイシクルショット",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 105,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 32
        },
        {
          "name": "氷符「アイシクルフォール」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 70,
          "usesPerBattle": 2,
          "fxColor": "#99e6ff"
        },
        {
          "name": "凍符「パーフェクトフリーズ」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "弾をまとめて凍らせる。",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.6,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#cceeff",
          "effects": [
            {
              "timing": "after",
              "effect": "stun",
              "value": 1,
              "chance": 25,
              "when": "hit",
              "duration": 1
            }
          ]
        }
      ],
      "hp": 5400,
      "atk": 610,
      "def": 10,
      "mob": 720,
      "acc": 520,
      "exp": 540,
      "crew": "none"
    },
    {
      "id": "th-e-meiling",
      "name": "紅美鈴",
      "role": "華人小娘",
      "pilot": "",
      "mark": "美",
      "tags": [
        "生身",
        "妖怪",
        "紅魔館",
        "武術"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-meiling-ki",
          "name": "気を使う程度の能力",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 4,
          "chance": 100,
          "maxUses": 0,
          "note": "気の流れを整えて回復する。"
        },
        {
          "id": "th-s-meiling-gate",
          "name": "紅魔館の門番",
          "trigger": "battle_start",
          "effect": "taunt",
          "value": 40,
          "chance": 100,
          "maxUses": 1,
          "note": "門の前に立ちはだかる。",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "name": "星気「星脈地転弾」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "気を込めた拳。",
          "powerPct": 160,
          "accuracyPt": 15,
          "critPt": 8,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "彩符「彩光乱舞」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 60,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 40,
          "usesPerBattle": 2,
          "fxColor": "#ff99cc"
        },
        {
          "name": "華符「芳華絢爛」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 2,
          "weight": 0.8,
          "minDamage": 50,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 6800,
      "atk": 640,
      "def": 80,
      "mob": 600,
      "acc": 560,
      "row": "front",
      "exp": 680,
      "crew": "none"
    },
    {
      "id": "th-e-patchouli",
      "name": "パチュリー・ノーレッジ",
      "role": "動かない大図書館",
      "pilot": "",
      "mark": "パ",
      "tags": [
        "生身",
        "魔法使い",
        "紅魔館"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-patchouli-seven",
          "name": "火水木金土日月を操る程度の能力",
          "trigger": "before_attack",
          "effect": "damage_up_pct",
          "value": 12,
          "chance": 100,
          "maxUses": 0,
          "note": "七つの属性の魔法を使い分ける。"
        },
        {
          "id": "th-s-patchouli-asthma",
          "name": "喘息持ち",
          "trigger": "battle_start",
          "effect": "mob_down_pct",
          "value": 10,
          "chance": 100,
          "maxUses": 1,
          "note": "体が弱く、動くのは苦手。",
          "duration": 2
        }
      ],
      "weapons": [
        {
          "name": "火符「アグニシャイン」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff7733",
          "effects": [
            {
              "timing": "after",
              "effect": "burn",
              "value": 120,
              "when": "hit",
              "duration": 2
            }
          ]
        },
        {
          "name": "水符「プリンセスウンディネ」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 50,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 35
        },
        {
          "name": "日符「ロイヤルフレア」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "小さな太陽を生み出す大魔法。",
          "powerPct": 260,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 4,
          "weight": 0.6,
          "minDamage": 200,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#ffcc33"
        }
      ],
      "hp": 4300,
      "atk": 870,
      "def": 10,
      "mob": 420,
      "acc": 720,
      "row": "back",
      "exp": 430,
      "crew": "none"
    },
    {
      "id": "th-e-sakuya",
      "name": "十六夜咲夜",
      "role": "完全で瀟洒な従者",
      "pilot": "",
      "mark": "咲",
      "tags": [
        "生身",
        "人間",
        "紅魔館",
        "メイド"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-sakuya-time",
          "name": "時間を操る程度の能力",
          "trigger": "battle_start",
          "effect": "extra_action",
          "value": 0,
          "chance": 100,
          "maxUses": 1,
          "note": "時を止めて先に動く。"
        },
        {
          "id": "th-s-sakuya-perfect",
          "name": "完全で瀟洒",
          "trigger": "on_crit",
          "effect": "extra_action",
          "value": 0,
          "chance": 100,
          "maxUses": 1,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "奇術「ミスディレクション」",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "銀のナイフを死角から投げる。",
          "powerPct": 120,
          "accuracyPt": 20,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 40,
          "hitsMin": 3,
          "hitsMax": 6,
          "hitPowerPct": 24
        },
        {
          "name": "幻世「ザ・ワールド」",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "時を止めてナイフを配置する。",
          "powerPct": 170,
          "accuracyPt": 30,
          "critPt": 15,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 100,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 45,
          "usesPerBattle": 2,
          "fxColor": "#c0c0ff"
        },
        {
          "name": "メイド秘技「殺人ドール」",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 2,
          "weight": 0.8,
          "minDamage": 60,
          "hitsMin": 2,
          "hitsMax": 2,
          "hitPowerPct": 55
        }
      ],
      "hp": 4600,
      "atk": 730,
      "def": 30,
      "mob": 820,
      "acc": 860,
      "exp": 460,
      "crew": "none"
    },
    {
      "id": "th-e-remilia",
      "name": "レミリア・スカーレット",
      "role": "永遠に紅い幼き月",
      "pilot": "",
      "mark": "レ",
      "tags": [
        "生身",
        "吸血鬼",
        "妖怪",
        "紅魔館"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-remilia-fate",
          "name": "運命を操る程度の能力",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": "当たらない運命にしてしまう。"
        },
        {
          "id": "th-s-remilia-vamp",
          "name": "吸血鬼の再生力",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 4,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "神槍「スピア・ザ・グングニル」",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "紅い魔力の槍を投げ放つ。",
          "powerPct": 240,
          "accuracyPt": 25,
          "critPt": 15,
          "targetCount": 1,
          "weight": 0.9,
          "minDamage": 200,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff3344",
          "effects": [
            {
              "timing": "before",
              "effect": "def_pierce_pct",
              "value": 30
            }
          ]
        },
        {
          "name": "紅符「スカーレットシュート」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1.2,
          "minDamage": 70,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 45
        },
        {
          "name": "夜王「ドラキュラクレイドル」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "体当たりで吸血する。",
          "powerPct": 160,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "drain_pct",
              "value": 30,
              "when": "hit"
            }
          ]
        }
      ],
      "hp": 8700,
      "atk": 900,
      "def": 60,
      "mob": 760,
      "acc": 740,
      "exp": 870,
      "crew": "none"
    },
    {
      "id": "th-e-flandre",
      "name": "フランドール・スカーレット",
      "role": "悪魔の妹",
      "pilot": "",
      "mark": "フ",
      "tags": [
        "生身",
        "吸血鬼",
        "妖怪",
        "紅魔館"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-flandre-break",
          "name": "ありとあらゆるものを破壊する程度の能力",
          "trigger": "before_attack",
          "effect": "def_pierce_pct",
          "value": 20,
          "chance": 100,
          "maxUses": 0,
          "note": "ものの「目」を握りつぶす。"
        },
        {
          "id": "th-s-flandre-vamp",
          "name": "吸血鬼の再生力",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 4,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "禁忌「レーヴァテイン」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 220,
          "accuracyPt": 10,
          "critPt": 15,
          "targetCount": 2,
          "weight": 0.9,
          "minDamage": 180,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff5500",
          "effects": [
            {
              "timing": "before",
              "effect": "def_pierce_pct",
              "value": 40
            }
          ]
        },
        {
          "name": "禁忌「フォーオブアカインド」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "4人に分身して撃つ。",
          "powerPct": 140,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 60,
          "hitsMin": 4,
          "hitsMax": 4,
          "hitPowerPct": 30
        },
        {
          "name": "QED「495年の波紋」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 160,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 6,
          "weight": 0.6,
          "minDamage": 100,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#ff66ff"
        }
      ],
      "hp": 26000,
      "atk": 1155,
      "def": 40,
      "mob": 780,
      "acc": 700,
      "exp": 2600,
      "crew": "none"
    },
    {
      "id": "th-e-alice",
      "name": "アリス・マーガトロイド",
      "role": "七色の人形使い",
      "pilot": "",
      "mark": "ア",
      "tags": [
        "生身",
        "魔法使い",
        "人形使い"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-alice-doll",
          "name": "人形を操る程度の能力",
          "trigger": "battle_start",
          "effect": "shield",
          "value": 900,
          "chance": 100,
          "maxUses": 1,
          "note": "人形を盾にする。"
        },
        {
          "id": "th-s-alice-cool",
          "name": "都会派の魔法",
          "trigger": "before_attack",
          "effect": "hit_up_pt",
          "value": 10,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "蒼符「博愛の仏蘭西人形」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 115,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 40,
          "hitsMin": 3,
          "hitsMax": 5,
          "hitPowerPct": 26
        },
        {
          "name": "咒詛「首吊り蓬莱人形」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#99aaff"
        },
        {
          "name": "紅符「紅毛の和蘭人形」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 125,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 2,
          "weight": 0.8,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 7200,
      "atk": 700,
      "def": 30,
      "mob": 620,
      "acc": 780,
      "row": "back",
      "exp": 720,
      "crew": "none"
    },
    {
      "id": "th-e-youmu",
      "name": "魂魄妖夢",
      "role": "半人半霊の庭師",
      "pilot": "",
      "mark": "妖",
      "tags": [
        "生身",
        "半人半霊",
        "剣士",
        "白玉楼"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-youmu-half",
          "name": "半霊",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 10,
          "chance": 50,
          "maxUses": 0,
          "note": "半霊が身代わりになる。"
        },
        {
          "id": "th-s-youmu-sword",
          "name": "剣術を扱う程度の能力",
          "trigger": "on_crit",
          "effect": "extra_action",
          "value": 0,
          "chance": 100,
          "maxUses": 1,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "楼観剣",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 15,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 70
        },
        {
          "name": "人符「現世斬」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "一瞬で間合いを詰めて斬る。",
          "powerPct": 170,
          "accuracyPt": 20,
          "critPt": 15,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "断命剣「冥想斬」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 250,
          "accuracyPt": 10,
          "critPt": 10,
          "targetCount": 1,
          "weight": 0.9,
          "minDamage": 200,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#88ffcc",
          "effects": [
            {
              "timing": "before",
              "effect": "def_pierce_pct",
              "value": 30
            }
          ]
        }
      ],
      "hp": 12300,
      "atk": 830,
      "def": 40,
      "mob": 800,
      "acc": 760,
      "row": "front",
      "exp": 1230,
      "crew": "none"
    },
    {
      "id": "th-e-prism",
      "name": "プリズムリバー三姉妹",
      "role": "騒霊楽団",
      "pilot": "",
      "mark": "楽",
      "tags": [
        "生身",
        "騒霊",
        "霊"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-prism-concert",
          "name": "手を使わずに楽器を演奏する程度の能力",
          "trigger": "battle_start",
          "effect": "atk_up_pct",
          "value": 10,
          "chance": 100,
          "maxUses": 1,
          "note": "演奏で仲間を盛り上げる。",
          "target": "allies",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "name": "騒符「ライブポルターガイスト」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "三人の合奏が辺りを揺らす。",
          "powerPct": 130,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 4,
          "weight": 0.9,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ffaa55"
        },
        {
          "name": "弦楽「嵐のアンサンブル」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 35
        }
      ],
      "hp": 11500,
      "atk": 640,
      "def": 20,
      "mob": 640,
      "acc": 640,
      "row": "back",
      "exp": 1150,
      "crew": "none"
    },
    {
      "id": "th-e-yuyuko",
      "name": "西行寺幽々子",
      "role": "幽冥楼閣の亡霊少女",
      "pilot": "",
      "mark": "幽",
      "tags": [
        "生身",
        "亡霊",
        "霊",
        "白玉楼"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-yuyuko-death",
          "name": "死を操る程度の能力",
          "trigger": "before_attack",
          "effect": "crit_up_pt",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": "死へ誘う蝶。"
        },
        {
          "id": "th-s-yuyuko-ghost",
          "name": "亡霊の身体",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "亡郷「亡我郷」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1.2,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "atk_down_pct",
              "value": 10,
              "when": "hit",
              "duration": 2
            }
          ]
        },
        {
          "name": "華霊「バタフライディルージョン」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 20,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 50,
          "hitsMin": 3,
          "hitsMax": 5,
          "hitPowerPct": 28
        },
        {
          "name": "桜符「完全なる墨染の桜」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 200,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 5,
          "weight": 0.6,
          "minDamage": 150,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#ffb7d5"
        }
      ],
      "hp": 24800,
      "atk": 946,
      "def": 40,
      "mob": 600,
      "acc": 760,
      "row": "back",
      "exp": 2480,
      "crew": "none"
    },
    {
      "id": "th-e-ran",
      "name": "八雲藍",
      "role": "すきま妖怪の式",
      "pilot": "",
      "mark": "藍",
      "tags": [
        "生身",
        "妖怪",
        "式神",
        "狐"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-ran-shiki",
          "name": "式神を使う程度の能力",
          "trigger": "battle_start",
          "effect": "atk_up_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "duration": 3
        },
        {
          "id": "th-s-ran-calc",
          "name": "式の計算",
          "trigger": "before_attack",
          "effect": "hit_up_pt",
          "value": 12,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "式神「十二神将の宴」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 4,
          "weight": 0.9,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ffdd55"
        },
        {
          "name": "式輝「狐狸妖怪レーザー」",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 20,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1.2,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "式神「仙狐思念」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 50,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 35
        }
      ],
      "hp": 18900,
      "atk": 900,
      "def": 50,
      "mob": 780,
      "acc": 780,
      "exp": 1890,
      "crew": "none"
    },
    {
      "id": "th-e-wriggle",
      "name": "リグル・ナイトバグ",
      "role": "闇に蠢く光の蟲",
      "pilot": "",
      "mark": "リ",
      "tags": [
        "生身",
        "妖怪",
        "蟲"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-wriggle-bug",
          "name": "蟲を操る程度の能力",
          "trigger": "after_attack",
          "effect": "acc_down_pct",
          "value": 10,
          "chance": 40,
          "maxUses": 0,
          "note": "",
          "target": "opponent",
          "duration": 2
        }
      ],
      "weapons": [
        {
          "name": "蛍符「地上の流星」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 32
        },
        {
          "name": "蠢符「ナイトバグトルネード」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2
        }
      ],
      "hp": 12000,
      "atk": 560,
      "def": 10,
      "mob": 720,
      "acc": 560,
      "exp": 1200,
      "crew": "none"
    },
    {
      "id": "th-e-mystia",
      "name": "ミスティア・ローレライ",
      "role": "夜雀の妖怪",
      "pilot": "",
      "mark": "ミ",
      "tags": [
        "生身",
        "妖怪",
        "鳥"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-mystia-song",
          "name": "歌で人を狂わす程度の能力",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 10,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "声符「梟の夜鳴声」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 42
        },
        {
          "name": "夜盲「夜雀の歌」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "歌声で相手を鳥目にする。",
          "powerPct": 120,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 50,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "effects": [
            {
              "timing": "after",
              "effect": "acc_down_pct",
              "value": 20,
              "when": "hit",
              "duration": 2
            }
          ]
        }
      ],
      "hp": 12400,
      "atk": 580,
      "def": 0,
      "mob": 760,
      "acc": 540,
      "exp": 1240,
      "crew": "none"
    },
    {
      "id": "th-e-reisen",
      "name": "鈴仙・優曇華院・イナバ",
      "role": "狂気の月の兎",
      "pilot": "",
      "mark": "鈴",
      "tags": [
        "生身",
        "玉兎",
        "月",
        "永遠亭"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-reisen-lunatic",
          "name": "狂気を操る程度の能力",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 15,
          "chance": 50,
          "maxUses": 0,
          "note": "波長をずらして見えなくする。"
        }
      ],
      "weapons": [
        {
          "name": "座薬型の弾丸",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 115,
          "accuracyPt": 20,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 32
        },
        {
          "name": "狂視「狂視調律」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff4466",
          "effects": [
            {
              "timing": "after",
              "effect": "acc_down_pct",
              "value": 15,
              "when": "hit",
              "duration": 2
            }
          ]
        },
        {
          "name": "散符「真実の月（インビジブルフルムーン）」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 9800,
      "atk": 780,
      "def": 30,
      "mob": 800,
      "acc": 820,
      "exp": 980,
      "crew": "none"
    },
    {
      "id": "th-e-eirin",
      "name": "八意永琳",
      "role": "月の頭脳",
      "pilot": "",
      "mark": "永",
      "tags": [
        "生身",
        "月人",
        "蓬莱人",
        "永遠亭"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-eirin-medicine",
          "name": "あらゆる薬を作る程度の能力",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 4,
          "chance": 100,
          "maxUses": 0,
          "note": "仲間の傷をすぐに治す。",
          "target": "allies"
        },
        {
          "id": "th-s-eirin-hourai",
          "name": "蓬莱の薬",
          "trigger": "on_death",
          "effect": "guts",
          "value": 1,
          "chance": 100,
          "maxUses": 1,
          "note": "不老不死の身体。1戦闘1回、倒れずに耐える。"
        }
      ],
      "weapons": [
        {
          "name": "天丸「壺中の天地」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 4,
          "weight": 0.9,
          "minDamage": 100,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#5577ff"
        },
        {
          "name": "神符「天人の系譜」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 180,
          "accuracyPt": 20,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 120,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "天文「天網蜘網捕蝶の法」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 20,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1.2,
          "minDamage": 60,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 40
        }
      ],
      "hp": 18600,
      "atk": 990,
      "def": 60,
      "mob": 700,
      "acc": 860,
      "row": "back",
      "exp": 1860,
      "crew": "none"
    },
    {
      "id": "th-e-kaguya",
      "name": "蓬莱山輝夜",
      "role": "永遠と須臾の罪人",
      "pilot": "",
      "mark": "輝",
      "tags": [
        "生身",
        "月人",
        "蓬莱人",
        "永遠亭"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-kaguya-eternity",
          "name": "永遠と須臾を操る程度の能力",
          "trigger": "battle_start",
          "effect": "extra_action",
          "value": 0,
          "chance": 100,
          "maxUses": 1,
          "note": "一瞬を積み重ねて先に動く。"
        },
        {
          "id": "th-s-kaguya-hourai",
          "name": "蓬莱の薬",
          "trigger": "on_death",
          "effect": "guts",
          "value": 1,
          "chance": 100,
          "maxUses": 1,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "難題「龍の頸の玉 -五色の弾丸-」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1.2,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 60
        },
        {
          "name": "神宝「蓬莱の玉の枝 -夢色の郷-」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 230,
          "accuracyPt": 10,
          "critPt": 10,
          "targetCount": 2,
          "weight": 0.9,
          "minDamage": 180,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ffccff"
        },
        {
          "name": "「永夜返し」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 6,
          "weight": 0.6,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#6677ff"
        }
      ],
      "hp": 24000,
      "atk": 1034,
      "def": 50,
      "mob": 740,
      "acc": 820,
      "row": "back",
      "exp": 2400,
      "crew": "none"
    },
    {
      "id": "th-e-mokou",
      "name": "藤原妹紅",
      "role": "蓬莱の人の形",
      "pilot": "",
      "mark": "妹",
      "tags": [
        "生身",
        "人間",
        "蓬莱人"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-mokou-undying",
          "name": "老いる事も死ぬ事も無い程度の能力",
          "trigger": "on_death",
          "effect": "guts",
          "value": 1,
          "chance": 100,
          "maxUses": 2,
          "note": "何度でも蘇る。1戦闘2回まで。"
        },
        {
          "id": "th-s-mokou-resurrection",
          "name": "リザレクション",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 6,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "不死「火の鳥 -鳳翼天翔-」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1.2,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "burn",
              "value": 150,
              "when": "hit",
              "duration": 2
            }
          ]
        },
        {
          "name": "蓬莱「凱風快晴 -フジヤマヴォルケイノ-」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 250,
          "accuracyPt": 5,
          "critPt": 10,
          "targetCount": 4,
          "weight": 0.6,
          "minDamage": 200,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#ff6600"
        },
        {
          "name": "滅罪「正直者の死」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 160,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 100,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 40300,
      "atk": 1012,
      "def": 40,
      "mob": 720,
      "acc": 740,
      "row": "front",
      "exp": 4030,
      "crew": "none"
    },
    {
      "id": "th-e-nitori",
      "name": "河城にとり",
      "role": "超妖怪弾頭",
      "pilot": "",
      "mark": "に",
      "tags": [
        "生身",
        "河童",
        "妖怪",
        "技術者",
        "妖怪の山"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-nitori-camo",
          "name": "光学「オプティカルカモフラージュ」",
          "trigger": "battle_start",
          "effect": "mob_up_pct",
          "value": 30,
          "chance": 100,
          "maxUses": 1,
          "note": "光学迷彩で姿を消す。",
          "duration": 2
        },
        {
          "id": "th-s-nitori-gadget",
          "name": "河童の発明品",
          "trigger": "battle_start",
          "effect": "shield",
          "value": 800,
          "chance": 100,
          "maxUses": 1,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "河童「のびーるアーム」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "洪水「ウーズフラッディング」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#33aaff"
        },
        {
          "name": "水符「河童のポロロッカ」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 115,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 32
        }
      ],
      "hp": 7400,
      "atk": 700,
      "def": 60,
      "mob": 660,
      "acc": 740,
      "row": "back",
      "exp": 740,
      "crew": "none"
    },
    {
      "id": "th-e-aya",
      "name": "射命丸文",
      "role": "里に最も近い天狗",
      "pilot": "",
      "mark": "文",
      "tags": [
        "生身",
        "天狗",
        "妖怪",
        "妖怪の山"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-aya-wind",
          "name": "風を操る程度の能力",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 18,
          "chance": 100,
          "maxUses": 0,
          "note": "幻想郷最速の足で避ける。"
        },
        {
          "id": "th-s-aya-scoop",
          "name": "特ダネの気配",
          "trigger": "on_evade",
          "effect": "counter",
          "value": 80,
          "chance": 50,
          "maxUses": 0,
          "note": "避けたついでに一枚撮る。"
        }
      ],
      "weapons": [
        {
          "name": "疾風「風神少女」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 15,
          "critPt": 5,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 40,
          "hitsMin": 4,
          "hitsMax": 6,
          "hitPowerPct": 22
        },
        {
          "name": "「幻想風靡」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "目にも止まらぬ速さで駆け抜ける。",
          "powerPct": 210,
          "accuracyPt": 20,
          "critPt": 20,
          "targetCount": 1,
          "weight": 0.9,
          "minDamage": 160,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff8844"
        },
        {
          "name": "旋符「紅葉扇風」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1,
          "minDamage": 50,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 20500,
      "atk": 760,
      "def": 20,
      "mob": 980,
      "acc": 800,
      "exp": 2050,
      "crew": "none"
    },
    {
      "id": "th-e-sanae",
      "name": "東風谷早苗",
      "role": "祀られる風の人間",
      "pilot": "",
      "mark": "早",
      "tags": [
        "生身",
        "人間",
        "現人神",
        "守矢神社"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-sanae-miracle",
          "name": "奇跡を起こす程度の能力",
          "trigger": "before_attack",
          "effect": "crit_up_pt",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "th-s-sanae-faith",
          "name": "神々の加護",
          "trigger": "on_death",
          "effect": "guts",
          "value": 1,
          "chance": 40,
          "maxUses": 1,
          "note": "奇跡的に持ちこたえることがある。"
        }
      ],
      "weapons": [
        {
          "name": "秘術「グレイソーマタージ」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1.2,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "奇跡「客星の明るすぎる夜」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 220,
          "accuracyPt": 10,
          "critPt": 20,
          "targetCount": 2,
          "weight": 0.9,
          "minDamage": 170,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#66ff99"
        },
        {
          "name": "開海「海が割れる日」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 22000,
      "atk": 780,
      "def": 30,
      "mob": 720,
      "acc": 780,
      "exp": 2200,
      "crew": "none"
    },
    {
      "id": "th-e-kanako",
      "name": "八坂神奈子",
      "role": "山坂と湖の権化",
      "pilot": "",
      "mark": "神",
      "tags": [
        "生身",
        "神",
        "守矢神社"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-kanako-sky",
          "name": "乾を創造する程度の能力",
          "trigger": "battle_start",
          "effect": "def_up_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "target": "allies",
          "duration": 3
        },
        {
          "id": "th-s-kanako-god",
          "name": "軍神の威光",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "神祭「エクスパンデッド・オンバシラ」",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 230,
          "accuracyPt": 10,
          "critPt": 10,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 180,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff5555"
        },
        {
          "name": "御柱",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "「マウンテン・オブ・フェイス」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 6,
          "weight": 0.6,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#ffaa66"
        }
      ],
      "hp": 62100,
      "atk": 1104,
      "def": 90,
      "mob": 620,
      "acc": 780,
      "row": "back",
      "exp": 6210,
      "crew": "none"
    },
    {
      "id": "th-e-yugi",
      "name": "星熊勇儀",
      "role": "語られる怪力乱神",
      "pilot": "",
      "mark": "勇",
      "tags": [
        "生身",
        "鬼",
        "妖怪",
        "旧都"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-yugi-might",
          "name": "怪力乱神を持つ程度の能力",
          "trigger": "before_attack",
          "effect": "damage_up_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "th-s-yugi-oni",
          "name": "鬼の頑丈さ",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 20,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "四天王奥義「三歩必殺」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 270,
          "accuracyPt": 10,
          "critPt": 15,
          "targetCount": 3,
          "weight": 0.7,
          "minDamage": 220,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#ff3333"
        },
        {
          "name": "鬼符「怪力乱神」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "力業「大江山嵐」",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 32400,
      "atk": 1000,
      "def": 80,
      "mob": 560,
      "acc": 680,
      "row": "front",
      "exp": 3240,
      "crew": "none"
    },
    {
      "id": "th-e-satori",
      "name": "古明地さとり",
      "role": "怨霊も恐れ怯む少女",
      "pilot": "",
      "mark": "さ",
      "tags": [
        "生身",
        "覚",
        "妖怪",
        "地霊殿"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-satori-read",
          "name": "心を読む程度の能力",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 20,
          "chance": 100,
          "maxUses": 0,
          "note": "何をするか読めている。"
        },
        {
          "id": "th-s-satori-aim",
          "name": "読心の照準",
          "trigger": "before_attack",
          "effect": "hit_up_pt",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "想起「テリブルスーヴニール」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "相手の心にあるトラウマを呼び起こす。",
          "powerPct": 150,
          "accuracyPt": 20,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff88cc",
          "effects": [
            {
              "timing": "after",
              "effect": "atk_down_pct",
              "value": 15,
              "when": "hit",
              "duration": 2
            }
          ]
        },
        {
          "name": "想起の弾幕",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 25,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 50,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 32
        }
      ],
      "hp": 12900,
      "atk": 820,
      "def": 30,
      "mob": 700,
      "acc": 860,
      "row": "back",
      "exp": 1290,
      "crew": "none"
    },
    {
      "id": "th-e-rin",
      "name": "火焔猫燐",
      "role": "地獄の輪禍",
      "pilot": "",
      "mark": "燐",
      "tags": [
        "生身",
        "火車",
        "妖怪",
        "地霊殿"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-rin-corpse",
          "name": "死体を持ち去る程度の能力",
          "trigger": "on_kill",
          "effect": "heal_maxhp_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "th-s-rin-onryo",
          "name": "怨霊を操る",
          "trigger": "battle_start",
          "effect": "atk_up_pct",
          "value": 10,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "target": "allies",
          "duration": 2
        }
      ],
      "weapons": [
        {
          "name": "猫符「キャッツウォーク」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 115,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 40,
          "hitsMin": 3,
          "hitsMax": 5,
          "hitPowerPct": 26
        },
        {
          "name": "贖罪「旧地獄の針山」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 4,
          "weight": 0.9,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#cc3366"
        },
        {
          "name": "「死灰復燃」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "burn",
              "value": 120,
              "when": "hit",
              "duration": 2
            }
          ]
        }
      ],
      "hp": 14400,
      "atk": 760,
      "def": 20,
      "mob": 840,
      "acc": 720,
      "exp": 1440,
      "crew": "none"
    },
    {
      "id": "th-e-utsuho",
      "name": "霊烏路空",
      "role": "熱かい悩む神の火",
      "pilot": "",
      "mark": "空",
      "tags": [
        "生身",
        "地獄鴉",
        "八咫烏",
        "地霊殿"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-utsuho-fusion",
          "name": "核融合を操る程度の能力",
          "trigger": "before_attack",
          "effect": "damage_up_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "th-s-utsuho-yata",
          "name": "八咫烏の力",
          "trigger": "turn_start",
          "effect": "atk_up_pct",
          "value": 5,
          "chance": 100,
          "maxUses": 0,
          "note": "",
          "duration": 2
        }
      ],
      "weapons": [
        {
          "name": "核熱「ニュークリアフュージョン」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 250,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 200,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ffaa00",
          "effects": [
            {
              "timing": "after",
              "effect": "burn",
              "value": 200,
              "when": "hit",
              "duration": 2
            }
          ]
        },
        {
          "name": "爆符「ギガフレア」",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 320,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 2,
          "weight": 0.6,
          "minDamage": 260,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#ffdd00",
          "effects": [
            {
              "timing": "after",
              "effect": "recoil_pct",
              "value": 3
            }
          ]
        },
        {
          "name": "制御棒",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.1,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 72600,
      "atk": 1210,
      "def": 50,
      "mob": 560,
      "acc": 680,
      "row": "back",
      "exp": 7260,
      "crew": "none"
    },
    {
      "id": "th-e-koishi",
      "name": "古明地こいし",
      "role": "閉じた恋の瞳",
      "pilot": "",
      "mark": "こ",
      "tags": [
        "生身",
        "覚",
        "妖怪",
        "地霊殿"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-koishi-unconscious",
          "name": "無意識を操る程度の能力",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 25,
          "chance": 60,
          "maxUses": 0,
          "note": "誰にも気づかれない。"
        },
        {
          "id": "th-s-koishi-whim",
          "name": "気まぐれ",
          "trigger": "battle_start",
          "effect": "mob_up_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "name": "本能「イドの解放」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 4,
          "weight": 1.2,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "「嫌われ者のフィロソフィ」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 6,
          "weight": 0.6,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#66dd88"
        },
        {
          "name": "抑制「スーパーエゴ」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 15,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 28200,
      "atk": 900,
      "def": 20,
      "mob": 920,
      "acc": 760,
      "exp": 2820,
      "crew": "none"
    },
    {
      "id": "th-e-nazrin",
      "name": "ナズーリン",
      "role": "小さな小さな賢将",
      "pilot": "",
      "mark": "ナ",
      "tags": [
        "生身",
        "妖怪",
        "鼠",
        "命蓮寺"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-nazrin-find",
          "name": "探し物を探し当てる程度の能力",
          "trigger": "before_attack",
          "effect": "hit_up_pt",
          "value": 20,
          "chance": 100,
          "maxUses": 0,
          "note": "弱点をダウジングで見つける。"
        }
      ],
      "weapons": [
        {
          "name": "視符「ナズーリンペンデュラム」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 20,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 42
        },
        {
          "name": "捜符「レアメタルディテクター」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2
        }
      ],
      "hp": 6600,
      "atk": 610,
      "def": 20,
      "mob": 800,
      "acc": 760,
      "exp": 660,
      "crew": "none"
    },
    {
      "id": "th-e-ichirin",
      "name": "雲居一輪",
      "role": "守り守られし大輪",
      "pilot": "",
      "mark": "一",
      "tags": [
        "生身",
        "妖怪",
        "入道使い",
        "命蓮寺"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-ichirin-unzan",
          "name": "入道を使う程度の能力",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "th-s-ichirin-guard",
          "name": "雲山の守り",
          "trigger": "battle_start",
          "effect": "taunt",
          "value": 30,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "name": "拳符「天網サンドバッグ」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "入道の雲山が拳を振るう。",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1.2,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "鉄拳「問答無用の妖怪拳」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 220,
          "accuracyPt": 10,
          "critPt": 10,
          "targetCount": 1,
          "weight": 0.9,
          "minDamage": 170,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#aabbcc"
        }
      ],
      "hp": 15900,
      "atk": 800,
      "def": 70,
      "mob": 600,
      "acc": 660,
      "row": "front",
      "exp": 1590,
      "crew": "none"
    },
    {
      "id": "th-e-murasa",
      "name": "村紗水蜜",
      "role": "水難事故の念縛霊",
      "pilot": "",
      "mark": "水",
      "tags": [
        "生身",
        "船幽霊",
        "霊",
        "命蓮寺"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-murasa-wreck",
          "name": "水難事故を引き起こす程度の能力",
          "trigger": "before_attack",
          "effect": "crit_up_pt",
          "value": 10,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "転覆「道連れアンカー」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 200,
          "accuracyPt": 10,
          "critPt": 10,
          "targetCount": 1,
          "weight": 0.9,
          "minDamage": 150,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#3388cc",
          "effects": [
            {
              "timing": "after",
              "effect": "mob_down_pct",
              "value": 20,
              "when": "hit",
              "duration": 2
            }
          ]
        },
        {
          "name": "湊符「幽霊船の港」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 4,
          "weight": 1.1,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 14100,
      "atk": 840,
      "def": 30,
      "mob": 700,
      "acc": 720,
      "exp": 1410,
      "crew": "none"
    },
    {
      "id": "th-e-shou",
      "name": "寅丸星",
      "role": "毘沙門天の弟子",
      "pilot": "",
      "mark": "星",
      "tags": [
        "生身",
        "妖怪",
        "虎",
        "命蓮寺"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-shou-treasure",
          "name": "財宝が集まる程度の能力",
          "trigger": "battle_start",
          "effect": "atk_up_pct",
          "value": 10,
          "chance": 100,
          "maxUses": 1,
          "note": "毘沙門天の加護。",
          "target": "allies",
          "duration": 2
        }
      ],
      "weapons": [
        {
          "name": "宝塔「グレイテストトレジャー」",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 230,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 180,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ffd700"
        },
        {
          "name": "光符「アブソリュートジャスティス」",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "寅符「ハングリータイガー」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 160,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 100,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 22000,
      "atk": 880,
      "def": 60,
      "mob": 680,
      "acc": 780,
      "exp": 2200,
      "crew": "none"
    },
    {
      "id": "th-e-nue",
      "name": "封獣ぬえ",
      "role": "未確認幻想飛行少女",
      "pilot": "",
      "mark": "鵺",
      "tags": [
        "生身",
        "妖怪",
        "鵺",
        "命蓮寺"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-nue-unknown",
          "name": "正体を判らなくする程度の能力",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 22,
          "chance": 100,
          "maxUses": 0,
          "note": "正体がつかめず狙いが定まらない。"
        }
      ],
      "weapons": [
        {
          "name": "正体不明「忿怒のレッドUFO襲来」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1.2,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "「遊星よりの弾幕X」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 6,
          "weight": 0.6,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#ff3366"
        },
        {
          "name": "鵺符「弾幕キメラ」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 160,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 80,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 45
        }
      ],
      "hp": 20400,
      "atk": 900,
      "def": 40,
      "mob": 820,
      "acc": 760,
      "exp": 2040,
      "crew": "none"
    },
    {
      "id": "th-e-byakuren",
      "name": "聖白蓮",
      "role": "封印された大魔法使い",
      "pilot": "",
      "mark": "聖",
      "tags": [
        "生身",
        "魔法使い",
        "僧侶",
        "命蓮寺"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-byakuren-magic",
          "name": "魔法を使う程度の能力（身体強化）",
          "trigger": "battle_start",
          "effect": "atk_up_pct",
          "value": 20,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "duration": 3
        },
        {
          "id": "th-s-byakuren-youth",
          "name": "若返りの魔法",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 4,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "超人「聖白蓮」",
          "attackType": "melee",
          "damageType": "physical",
          "note": "身体能力を高める魔法で一気に間合いを詰める。",
          "powerPct": 200,
          "accuracyPt": 15,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 150,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "「魔法銀河系」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 180,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 5,
          "weight": 0.6,
          "minDamage": 120,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#cc99ff"
        },
        {
          "name": "飛鉢「フライングファンタスティカ」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 42600,
      "atk": 1056,
      "def": 80,
      "mob": 760,
      "acc": 820,
      "row": "front",
      "exp": 4260,
      "crew": "none"
    },
    {
      "id": "th-e-seiga",
      "name": "霍青娥",
      "role": "壁抜けの邪仙",
      "pilot": "",
      "mark": "青",
      "tags": [
        "生身",
        "仙人",
        "邪仙",
        "神霊廟"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-seiga-wall",
          "name": "壁をすり抜けられる程度の能力",
          "trigger": "before_attack",
          "effect": "def_pierce_pct",
          "value": 30,
          "chance": 100,
          "maxUses": 0,
          "note": "守りの壁をすり抜けて攻撃する。"
        }
      ],
      "weapons": [
        {
          "name": "邪符「ヤンシャオグイ」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#33cccc"
        },
        {
          "name": "入魔「ゾウフォルゥモォ」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 50,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 35,
          "effects": [
            {
              "timing": "after",
              "effect": "atk_up_pct",
              "value": 10,
              "target": "allies",
              "duration": 2
            }
          ]
        }
      ],
      "hp": 22500,
      "atk": 820,
      "def": 30,
      "mob": 760,
      "acc": 780,
      "row": "back",
      "exp": 2250,
      "crew": "none"
    },
    {
      "id": "th-e-futo",
      "name": "物部布都",
      "role": "古代日本の尸解仙",
      "pilot": "",
      "mark": "布",
      "tags": [
        "生身",
        "尸解仙",
        "仙人",
        "神霊廟"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-futo-fengshui",
          "name": "風水を操る程度の能力",
          "trigger": "battle_start",
          "effect": "mob_up_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "target": "allies",
          "duration": 2
        }
      ],
      "weapons": [
        {
          "name": "投皿「物部の八十平瓮」",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 125,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 50,
          "hitsMin": 3,
          "hitsMax": 5,
          "hitPowerPct": 28
        },
        {
          "name": "天符「雨の磐舟」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.9,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#66aaff"
        },
        {
          "name": "炎符「桜井寺炎上」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "burn",
              "value": 150,
              "when": "hit",
              "duration": 2
            }
          ]
        }
      ],
      "hp": 28200,
      "atk": 860,
      "def": 30,
      "mob": 740,
      "acc": 780,
      "exp": 2820,
      "crew": "none"
    },
    {
      "id": "th-e-miko",
      "name": "豊聡耳神子",
      "role": "聖徳道士",
      "pilot": "",
      "mark": "神子",
      "tags": [
        "生身",
        "聖人",
        "仙人",
        "神霊廟"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-miko-ten",
          "name": "十人の話を同時に聞く程度の能力",
          "trigger": "before_attack",
          "effect": "hit_up_pt",
          "value": 20,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "th-s-miko-saint",
          "name": "聖人の威光",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "光符「グセフラッシュ」",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 20,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1.2,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "名誉「十二階の色彩」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "「星降る神霊廟」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 180,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 6,
          "weight": 0.6,
          "minDamage": 130,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#ffe680"
        }
      ],
      "hp": 72000,
      "atk": 1150,
      "def": 70,
      "mob": 760,
      "acc": 900,
      "row": "back",
      "exp": 7200,
      "crew": "none"
    },
    {
      "id": "th-e-mamizou",
      "name": "二ッ岩マミゾウ",
      "role": "佐渡の二ッ岩",
      "pilot": "",
      "mark": "狸",
      "tags": [
        "生身",
        "化け狸",
        "妖怪"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "th-s-mamizou-bake",
          "name": "化けさせる程度の能力",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": "葉っぱの身代わりに化けさせる。"
        },
        {
          "id": "th-s-mamizou-boss",
          "name": "化け狸の親分",
          "trigger": "battle_start",
          "effect": "shield",
          "value": 1000,
          "chance": 100,
          "maxUses": 1,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "変化「二ッ岩家の裁き」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1.2,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "狸符「満月のポンポコリン」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 5,
          "weight": 0.6,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#cc8844"
        },
        {
          "name": "変化「百鬼妖界の門」",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 10,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 30500,
      "atk": 920,
      "def": 60,
      "mob": 700,
      "acc": 780,
      "exp": 3050,
      "crew": "none"
    }
  ],
  "missions": [
    {
      "id": "th-m-01",
      "name": "紅霧異変・霧の湖",
      "diff": "E",
      "reward": 1500,
      "desc": "幻想郷が紅い霧に覆われた。霧の出どころを探して湖を渡る。敵が残り1体になると湖の氷精が飛んでくる。",
      "terrain": "紅い霧",
      "tags": [
        "紅魔郷",
        "紅霧異変"
      ],
      "rules": [],
      "enemies": [
        "th-u-fairy",
        "th-u-fairy",
        "th-e-rumia"
      ],
      "maxDeploy": 2,
      "drops": [
        {
          "itemId": "th-i-medicine",
          "chance": 80,
          "min": 1,
          "max": 2
        }
      ],
      "enemyRows": [
        "front",
        "front",
        "back"
      ],
      "waves": [
        {
          "enemies": [
            "th-e-cirno",
            "th-u-fairy"
          ],
          "when": "remaining",
          "value": 1,
          "label": "湖の氷精"
        }
      ],
      "story": {
        "before": [
          {
            "speaker": "博麗霊夢",
            "text": "洗濯物が乾かないじゃない。この霧、どこから出てるのかしら"
          },
          {
            "speaker": "霧雨魔理沙",
            "text": "湖の向こうに真っ赤な館があるって話だぜ。行ってみようぜ"
          }
        ],
        "after": [
          {
            "speaker": "チルノ",
            "text": "つ、次は負けないんだから！"
          },
          {
            "speaker": "博麗霊夢",
            "text": "はいはい。霧の元はもっと先ね"
          }
        ]
      },
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "no_loss"
        },
        {
          "type": "turns_le",
          "value": 12
        }
      ]
    },
    {
      "id": "th-m-02",
      "name": "紅霧異変・紅魔館",
      "diff": "C",
      "reward": 4000,
      "desc": "紅い館に乗り込む。門番を越え、図書館を抜けた先で、メイド長と館の主が待つ（敵を倒しきるたびに次の部屋へ）。主のレミリアを倒せば勝利。",
      "terrain": "紅い霧",
      "tags": [
        "紅魔郷",
        "紅霧異変",
        "ボス"
      ],
      "rules": [],
      "enemies": [
        "th-e-meiling",
        "th-u-maid"
      ],
      "maxDeploy": 4,
      "drops": [
        {
          "itemId": "th-i-grimoire",
          "chance": 100,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "th-i-ofuda",
          "chance": 50,
          "min": 1,
          "max": 1
        }
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 1,
        "bossWave": 2
      },
      "waves": [
        {
          "enemies": [
            "th-e-patchouli"
          ],
          "when": "cleared",
          "rows": [
            "back"
          ],
          "label": "大図書館"
        },
        {
          "enemies": [
            "th-e-sakuya",
            "th-e-remilia"
          ],
          "when": "cleared",
          "rows": [
            "front",
            "back"
          ],
          "label": "館の主"
        }
      ],
      "requires": {
        "missions": [
          "th-m-01"
        ]
      },
      "story": {
        "before": [
          {
            "speaker": "紅美鈴",
            "text": "ここから先は通しませんよ！"
          },
          {
            "speaker": "霧雨魔理沙",
            "text": "門番ってのは、通すためにいるんだろ？"
          }
        ],
        "after": [
          {
            "speaker": "レミリア・スカーレット",
            "text": "……いいわ。霧は晴らしてあげる。その代わり、今度うちのパーティーに来なさい"
          },
          {
            "speaker": "博麗霊夢",
            "text": "異変のあとは宴会ね。もちろん神社でやるわよ"
          }
        ]
      },
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "turns_le",
          "value": 16
        },
        {
          "type": "no_loss"
        }
      ],
      "starReward": 1500
    },
    {
      "id": "th-m-03",
      "name": "EX 悪魔の妹",
      "diff": "A",
      "reward": 6000,
      "desc": "紅魔館の地下に、495年閉じこもっていた吸血鬼がいる。HPが半分になると、遊び相手を呼び寄せる。",
      "terrain": "標準",
      "tags": [
        "紅魔郷",
        "EX"
      ],
      "rules": [
        {
          "type": "turn_limit",
          "value": 30
        }
      ],
      "enemies": [
        "th-e-flandre"
      ],
      "maxDeploy": 5,
      "drops": [
        {
          "itemId": "th-i-hakkero",
          "chance": 100,
          "min": 1,
          "max": 1
        }
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 0
      },
      "waves": [
        {
          "enemies": [
            "th-u-maid",
            "th-u-maid",
            "th-u-maid"
          ],
          "when": "bossHp",
          "value": 50,
          "label": "妖精メイド隊"
        }
      ],
      "requires": {
        "missions": [
          "th-m-02"
        ],
        "minLevel": 4
      },
      "story": {
        "before": [
          {
            "speaker": "フランドール・スカーレット",
            "text": "ねえ、あなたたちは壊れないで遊んでくれる？"
          },
          {
            "speaker": "霧雨魔理沙",
            "text": "遊んでやるよ。ただし弾幕ごっこでな"
          }
        ],
        "after": [
          {
            "speaker": "フランドール・スカーレット",
            "text": "あはは、楽しかった！ また遊ぼうね"
          }
        ]
      },
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "no_loss"
        },
        {
          "type": "hp_ge",
          "value": 40
        }
      ],
      "starReward": 2000
    },
    {
      "id": "th-m-04",
      "name": "春雪異変・白玉楼",
      "diff": "B",
      "reward": 6000,
      "desc": "五月になっても冬が終わらない。春を集める者を追って冥界へ。亡霊の姫を倒せば勝利。姫のHPが半分になると、すきま妖怪の式が現れる。",
      "terrain": "冥界",
      "tags": [
        "妖々夢",
        "春雪異変",
        "ボス"
      ],
      "rules": [],
      "enemies": [
        "th-u-ghost",
        "th-u-ghost",
        "th-e-alice"
      ],
      "maxDeploy": 6,
      "drops": [
        {
          "itemId": "th-i-sake",
          "chance": 80,
          "min": 1,
          "max": 2
        },
        {
          "itemId": "th-i-saisen",
          "chance": 50,
          "min": 1,
          "max": 1
        }
      ],
      "enemyRows": [
        "front",
        "front",
        "back"
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 0,
        "bossWave": 2
      },
      "waves": [
        {
          "enemies": [
            "th-e-youmu",
            "th-e-prism"
          ],
          "when": "remaining",
          "rows": [
            "front",
            "back"
          ],
          "value": 1,
          "label": "冥界の庭師と楽団"
        },
        {
          "enemies": [
            "th-e-yuyuko",
            "th-u-ghost",
            "th-u-ghost"
          ],
          "when": "cleared",
          "rows": [
            "back",
            "front",
            "front"
          ],
          "label": "白玉楼の主"
        },
        {
          "enemies": [
            "th-e-ran"
          ],
          "when": "bossHp",
          "value": 50,
          "label": "すきま妖怪の式"
        }
      ],
      "requires": {
        "missions": [
          "th-m-02"
        ]
      },
      "story": {
        "before": [
          {
            "speaker": "博麗霊夢",
            "text": "いつまで雪かきさせる気よ。春はどこに行ったの"
          },
          {
            "speaker": "魂魄妖夢",
            "text": "幽々子様のため、春はいただいていきます"
          }
        ],
        "after": [
          {
            "speaker": "西行寺幽々子",
            "text": "あら残念。桜はまた来年ね"
          },
          {
            "speaker": "博麗霊夢",
            "text": "冥界とこっちの境目、ちゃんと直しておきなさいよ"
          }
        ]
      },
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "turns_le",
          "value": 20
        },
        {
          "type": "no_loss"
        }
      ],
      "starReward": 2000
    },
    {
      "id": "th-m-05",
      "name": "永夜異変・人里の守護",
      "diff": "C",
      "reward": 5000,
      "desc": "満月が欠けたまま夜が明けない。騒ぎ出した夜の妖怪から、8TURNのあいだ人里を守る。慧音が同行し、倒されると敗北。",
      "terrain": "夜間",
      "tags": [
        "永夜抄",
        "永夜異変",
        "防衛"
      ],
      "rules": [],
      "enemies": [
        "th-e-wriggle",
        "th-u-kedama",
        "th-u-kedama"
      ],
      "maxDeploy": 4,
      "drops": [
        {
          "itemId": "th-i-omamori",
          "chance": 60,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "th-i-medicine",
          "chance": 80,
          "min": 1,
          "max": 2
        }
      ],
      "objective": {
        "type": "defense",
        "turns": 8,
        "escortUnitId": "th-u-keine"
      },
      "waves": [
        {
          "enemies": [
            "th-e-mystia",
            "th-u-kedama"
          ],
          "when": "turn",
          "value": 3,
          "label": "夜雀の歌"
        },
        {
          "enemies": [
            "th-u-fairy",
            "th-u-fairy",
            "th-u-kedama"
          ],
          "when": "turn",
          "value": 5,
          "label": "妖精の群れ"
        },
        {
          "enemies": [
            "th-e-wriggle",
            "th-e-mystia"
          ],
          "when": "turn",
          "value": 7,
          "label": "夜の妖怪の逆襲"
        }
      ],
      "requires": {
        "missions": [
          "th-m-04"
        ]
      },
      "story": {
        "before": [
          {
            "speaker": "上白沢慧音",
            "text": "人里の歴史は私が隠しておく。妖怪たちを近づけないでくれ"
          },
          {
            "speaker": "霧雨魔理沙",
            "text": "任せとけ。夜の散歩のついでだぜ"
          }
        ],
        "after": [
          {
            "speaker": "上白沢慧音",
            "text": "助かった。月を盗んだ者は、竹林の奥にいるはずだ"
          }
        ]
      },
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "no_loss"
        },
        {
          "type": "hp_ge",
          "value": 50
        }
      ]
    },
    {
      "id": "th-m-06",
      "name": "永夜異変・永遠亭",
      "diff": "B",
      "reward": 7000,
      "desc": "迷いの竹林の奥、永遠亭へ。3TURN目に月の頭脳が、敵が残り1体になると永遠の姫が出てくる。姫の輝夜を倒せば勝利。",
      "terrain": "迷いの竹林",
      "tags": [
        "永夜抄",
        "永夜異変",
        "ボス"
      ],
      "rules": [],
      "enemies": [
        "th-u-usagi",
        "th-u-usagi",
        "th-e-reisen"
      ],
      "maxDeploy": 6,
      "drops": [
        {
          "itemId": "th-i-kochou",
          "chance": 60,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "th-i-grimoire",
          "chance": 50,
          "min": 1,
          "max": 1
        }
      ],
      "enemyRows": [
        "front",
        "front",
        "back"
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 0,
        "bossWave": 2
      },
      "waves": [
        {
          "enemies": [
            "th-e-eirin",
            "th-u-usagi"
          ],
          "when": "turn",
          "rows": [
            "back",
            "front"
          ],
          "value": 3,
          "label": "月の頭脳"
        },
        {
          "enemies": [
            "th-e-kaguya"
          ],
          "when": "remaining",
          "rows": [
            "back"
          ],
          "value": 1,
          "label": "永遠の姫"
        }
      ],
      "requires": {
        "missions": [
          "th-m-05"
        ]
      },
      "story": {
        "before": [
          {
            "speaker": "鈴仙・優曇華院・イナバ",
            "text": "ここから先へは行かせません。師匠の術の邪魔はさせない"
          },
          {
            "speaker": "博麗霊夢",
            "text": "夜を止めたのはあんたたちね"
          }
        ],
        "after": [
          {
            "speaker": "蓬莱山輝夜",
            "text": "いいわ、月は返してあげる。ずいぶん楽しい夜だったもの"
          }
        ]
      },
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "turns_le",
          "value": 18
        },
        {
          "type": "no_loss"
        }
      ],
      "starReward": 2500
    },
    {
      "id": "th-m-07",
      "name": "EX 蓬莱人の肝試し",
      "diff": "A",
      "reward": 7000,
      "desc": "竹林で肝試し。待っていたのは死なない人間・藤原妹紅。何度倒れても起き上がる。30TURN以内に倒しきれ。",
      "terrain": "迷いの竹林",
      "tags": [
        "永夜抄",
        "EX"
      ],
      "rules": [
        {
          "type": "turn_limit",
          "value": 30
        }
      ],
      "enemies": [
        "th-e-mokou"
      ],
      "maxDeploy": 5,
      "drops": [
        {
          "itemId": "th-i-grimoire",
          "chance": 100,
          "min": 1,
          "max": 1
        }
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 0
      },
      "requires": {
        "missions": [
          "th-m-06"
        ],
        "minLevel": 5
      },
      "story": {
        "before": [
          {
            "speaker": "藤原妹紅",
            "text": "肝試しだって？ だったら本物の不死を見せてやるよ"
          }
        ],
        "after": [
          {
            "speaker": "藤原妹紅",
            "text": "はは、久しぶりに燃えた。竹林で迷ったら呼びな"
          }
        ]
      },
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "no_loss"
        },
        {
          "type": "turns_le",
          "value": 15
        }
      ],
      "starReward": 2500
    },
    {
      "id": "th-m-08",
      "name": "守矢神社・妖怪の山",
      "diff": "B",
      "reward": 7000,
      "desc": "山の上に引っ越してきた神社が、博麗神社に営業停止を迫ってきた。天狗の縄張りを抜け、山の神・八坂神奈子を倒せば勝利。",
      "terrain": "妖怪の山",
      "tags": [
        "風神録",
        "ボス"
      ],
      "rules": [],
      "enemies": [
        "th-u-hakuro",
        "th-u-hakuro",
        "th-e-nitori"
      ],
      "maxDeploy": 6,
      "drops": [
        {
          "itemId": "th-i-yinyang",
          "chance": 100,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "th-i-camo",
          "chance": 40,
          "min": 1,
          "max": 1
        }
      ],
      "enemyRows": [
        "front",
        "front",
        "back"
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 1,
        "bossWave": 2
      },
      "waves": [
        {
          "enemies": [
            "th-e-aya"
          ],
          "when": "remaining",
          "value": 1,
          "label": "鴉天狗"
        },
        {
          "enemies": [
            "th-e-sanae",
            "th-e-kanako"
          ],
          "when": "cleared",
          "rows": [
            "front",
            "back"
          ],
          "label": "守矢神社"
        }
      ],
      "requires": {
        "missions": [
          "th-m-06"
        ]
      },
      "story": {
        "before": [
          {
            "speaker": "東風谷早苗",
            "text": "博麗神社には、うちの神様の分社になっていただきます！"
          },
          {
            "speaker": "博麗霊夢",
            "text": "冗談じゃないわ。信仰は奪うものじゃないでしょ"
          }
        ],
        "after": [
          {
            "speaker": "八坂神奈子",
            "text": "やるじゃないか、博麗の巫女。これからはお互い仲良くやろう"
          },
          {
            "speaker": "東風谷早苗",
            "text": "これ、地上と話せる陰陽玉です。地底で何かあったら使ってくださいね"
          }
        ]
      },
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "turns_le",
          "value": 18
        },
        {
          "type": "no_loss"
        }
      ],
      "starReward": 2500
    },
    {
      "id": "th-m-09",
      "name": "地霊殿・灼熱地獄跡",
      "diff": "A",
      "reward": 9000,
      "desc": "神社の近くに間欠泉が湧き、地底から怨霊があふれ出した。陰陽玉を持って地底へ。地獄鴉の空を倒せば勝利。空のHPが半分になると、無意識の少女が現れる。",
      "terrain": "旧地獄",
      "tags": [
        "地霊殿",
        "ボス"
      ],
      "rules": [],
      "enemies": [
        "th-u-onryo",
        "th-u-onryo",
        "th-e-yugi"
      ],
      "maxDeploy": 8,
      "drops": [
        {
          "itemId": "th-i-grimoire",
          "chance": 100,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "th-i-kochou",
          "chance": 60,
          "min": 1,
          "max": 1
        }
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 1,
        "bossWave": 2
      },
      "waves": [
        {
          "enemies": [
            "th-e-satori",
            "th-u-onryo"
          ],
          "when": "cleared",
          "rows": [
            "back",
            "front"
          ],
          "label": "地霊殿"
        },
        {
          "enemies": [
            "th-e-rin",
            "th-e-utsuho"
          ],
          "when": "remaining",
          "rows": [
            "front",
            "back"
          ],
          "value": 1,
          "label": "灼熱地獄跡"
        },
        {
          "enemies": [
            "th-e-koishi",
            "th-u-onryo"
          ],
          "when": "bossHp",
          "value": 50,
          "label": "無意識の来訪者"
        }
      ],
      "requires": {
        "missions": [
          "th-m-08"
        ],
        "items": [
          "th-i-yinyang"
        ],
        "minLevel": 5
      },
      "story": {
        "before": [
          {
            "speaker": "星熊勇儀",
            "text": "地上の人間が来るなんて久しぶりだ。一杯やる前に、腕前を見せてもらおうか"
          },
          {
            "speaker": "霧雨魔理沙",
            "text": "陰陽玉から声がするぜ。地底の奥が熱いってさ"
          }
        ],
        "after": [
          {
            "speaker": "霊烏路空",
            "text": "うにゅ……神様の力、ちょっと使いすぎちゃった"
          },
          {
            "speaker": "古明地さとり",
            "text": "ペットが迷惑をかけたわね。……心を読まなくても、あなたたちが怒っているのはわかるわ"
          }
        ]
      },
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "turns_le",
          "value": 20
        },
        {
          "type": "no_loss"
        }
      ],
      "starReward": 3000
    },
    {
      "id": "th-m-10",
      "name": "星蓮船・法界",
      "diff": "A",
      "reward": 9000,
      "desc": "空に宝船が現れた。船を追って魔界の法界へ。3TURN目に船長が、敵が残り1体で毘沙門天の弟子が、その次に封印された聖が現れる。聖白蓮を倒せば勝利。30TURNの制限つき。",
      "terrain": "法界",
      "tags": [
        "星蓮船",
        "ボス"
      ],
      "rules": [
        {
          "type": "turn_limit",
          "value": 30
        }
      ],
      "enemies": [
        "th-e-nazrin",
        "th-u-fairy",
        "th-e-ichirin"
      ],
      "maxDeploy": 8,
      "drops": [
        {
          "itemId": "th-i-saisen",
          "chance": 100,
          "min": 1,
          "max": 2
        },
        {
          "itemId": "th-i-grimoire",
          "chance": 50,
          "min": 1,
          "max": 1
        }
      ],
      "enemyRows": [
        "back",
        "front",
        "front"
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 0,
        "bossWave": 3
      },
      "waves": [
        {
          "enemies": [
            "th-e-murasa",
            "th-u-fairy"
          ],
          "when": "turn",
          "value": 3,
          "label": "聖輦船の船長"
        },
        {
          "enemies": [
            "th-e-shou"
          ],
          "when": "remaining",
          "value": 1,
          "label": "毘沙門天の弟子"
        },
        {
          "enemies": [
            "th-e-byakuren",
            "th-e-nue"
          ],
          "when": "cleared",
          "rows": [
            "front",
            "back"
          ],
          "label": "封印された大魔法使い"
        }
      ],
      "requires": {
        "missions": [
          "th-m-09"
        ]
      },
      "story": {
        "before": [
          {
            "speaker": "ナズーリン",
            "text": "宝船の欠片を探しているのかい？ あいにく、こちらも探し物の最中でね"
          },
          {
            "speaker": "博麗霊夢",
            "text": "宝船ねえ。お宝があるなら話は別よ"
          }
        ],
        "after": [
          {
            "speaker": "聖白蓮",
            "text": "人も妖怪も、平等に救われるべきなのです。あなたたちとも、わかり合えると信じています"
          }
        ]
      },
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "turns_le",
          "value": 22
        },
        {
          "type": "no_loss"
        }
      ],
      "starReward": 3000
    },
    {
      "id": "th-m-11",
      "name": "神霊廟・夢殿大祀廟",
      "diff": "S",
      "reward": 12000,
      "desc": "墓地に神霊があふれ、霊廟から聖人が目覚めようとしている。邪仙と尸解仙を退け、聖徳道士・豊聡耳神子を倒せば勝利。神子のHPが半分になると、佐渡の化け狸が割って入る。",
      "terrain": "標準",
      "tags": [
        "神霊廟",
        "最終",
        "ボス"
      ],
      "rules": [],
      "enemies": [
        "th-u-shinrei",
        "th-u-shinrei",
        "th-u-yoshika"
      ],
      "maxDeploy": 8,
      "drops": [
        {
          "itemId": "th-i-kochou",
          "chance": 100,
          "min": 2,
          "max": 2
        },
        {
          "itemId": "th-i-grimoire",
          "chance": 100,
          "min": 1,
          "max": 1
        }
      ],
      "enemyRows": [
        "back",
        "back",
        "front"
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 1,
        "bossWave": 2
      },
      "waves": [
        {
          "enemies": [
            "th-e-seiga",
            "th-u-yoshika"
          ],
          "when": "remaining",
          "rows": [
            "back",
            "front"
          ],
          "value": 1,
          "label": "壁抜けの邪仙"
        },
        {
          "enemies": [
            "th-e-futo",
            "th-e-miko"
          ],
          "when": "cleared",
          "rows": [
            "front",
            "back"
          ],
          "label": "聖徳道士"
        },
        {
          "enemies": [
            "th-e-mamizou"
          ],
          "when": "bossHp",
          "value": 50,
          "label": "佐渡の化け狸"
        }
      ],
      "requires": {
        "missions": [
          "th-m-10"
        ],
        "minLevel": 7
      },
      "story": {
        "before": [
          {
            "speaker": "物部布都",
            "text": "太子様のお目覚めじゃ。邪魔立ては許さぬぞ！"
          },
          {
            "speaker": "霧雨魔理沙",
            "text": "墓場で宗教戦争かよ。にぎやかになったもんだぜ"
          }
        ],
        "after": [
          {
            "speaker": "豊聡耳神子",
            "text": "あなたたちの欲、しかと聞かせてもらった。幻想郷も面白い場所になったものだ"
          },
          {
            "speaker": "博麗霊夢",
            "text": "異変はおしまい。さあ、宴会の準備よ"
          }
        ]
      },
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "turns_le",
          "value": 24
        },
        {
          "type": "no_loss"
        }
      ],
      "starReward": 5000
    },
    {
      "id": "th-m-12",
      "name": "博麗神社の宴会",
      "diff": "C",
      "reward": 2500,
      "desc": "異変のあとは神社で宴会。酔った妖精たちと弾幕ごっこ。何度でも挑める稼ぎ場。",
      "terrain": "標準",
      "tags": [
        "宴会",
        "くり返し"
      ],
      "rules": [],
      "enemies": [
        "th-u-fairy",
        "th-u-fairy",
        "th-u-maid",
        "th-u-kedama"
      ],
      "maxDeploy": 5,
      "drops": [
        {
          "itemId": "th-i-saisen",
          "chance": 70,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "th-i-sake",
          "chance": 30,
          "min": 1,
          "max": 1
        }
      ],
      "requires": {
        "missions": [
          "th-m-01"
        ]
      },
      "exp": 250
    }
  ],
  "items": [
    {
      "id": "th-i-medicine",
      "name": "永遠亭の置き薬",
      "desc": "HPを最大HPの60%回復する。",
      "effect": {
        "type": "heal_hp_pct",
        "value": 60
      },
      "price": 800
    },
    {
      "id": "th-i-kochou",
      "name": "胡蝶夢丸",
      "desc": "よく眠れる薬。HPを全回復する。",
      "effect": {
        "type": "heal_hp_full"
      },
      "price": 1500,
      "shop": {
        "requiresResearch": "th-r-eientei"
      }
    },
    {
      "id": "th-i-ofuda",
      "name": "博麗のお札",
      "desc": "部隊全員、次の出撃だけATK+15%。",
      "effect": {
        "type": "sortie_buff",
        "stat": "atk",
        "value": 15
      },
      "price": 1200,
      "scope": "party"
    },
    {
      "id": "th-i-sake",
      "name": "宴会の酒",
      "desc": "異変のあとはみんなで宴会。経験値+200。",
      "effect": {
        "type": "exp_gain",
        "value": 200
      },
      "price": 1500
    },
    {
      "id": "th-i-hakkero",
      "name": "ミニ八卦炉",
      "desc": "火力の出る魔法の炉。装備するとATK+60。",
      "price": 3000,
      "equip": {
        "slot": "accessory",
        "stats": {
          "atk": 60
        },
        "skills": [],
        "weapons": []
      }
    },
    {
      "id": "th-i-omamori",
      "name": "博麗のお守り",
      "desc": "装備するとDEF+50・最大HP+400。",
      "price": 2500,
      "equip": {
        "slot": "accessory",
        "stats": {
          "hp": 400,
          "def": 50
        },
        "skills": [],
        "weapons": []
      }
    },
    {
      "id": "th-i-camo",
      "name": "河童の光学迷彩スーツ",
      "desc": "装備するとMOB+60。",
      "price": 2800,
      "equip": {
        "slot": "accessory",
        "stats": {
          "mob": 60
        },
        "skills": [],
        "weapons": []
      },
      "shop": {
        "requiresResearch": "th-r-kappa"
      }
    },
    {
      "id": "th-i-grimoire",
      "name": "大図書館の魔導書",
      "desc": "読むと新しい技がひらめく。スキルポイント+1（1体1回）。",
      "effect": {
        "type": "skill_point",
        "value": 1
      },
      "limitPerUnit": 1
    },
    {
      "id": "th-i-yinyang",
      "name": "陰陽玉",
      "desc": "地上と通信できる陰陽玉。地底へ向かう作戦に必要。",
      "key": true
    },
    {
      "id": "th-i-saisen",
      "name": "お賽銭箱",
      "desc": "たまに中身が入っている。",
      "effect": {
        "type": "loot_box",
        "table": [
          {
            "itemId": "th-i-medicine",
            "weight": 5,
            "min": 1,
            "max": 2
          },
          {
            "itemId": "th-i-ofuda",
            "weight": 3,
            "min": 1,
            "max": 1
          },
          {
            "itemId": "th-i-sake",
            "weight": 2,
            "min": 1,
            "max": 1
          },
          {
            "itemId": "th-i-kochou",
            "weight": 1,
            "min": 1,
            "max": 1
          }
        ]
      }
    }
  ],
  "research": [
    {
      "id": "th-r-kappa",
      "name": "河童の技術",
      "desc": "河童の光学迷彩スーツがショップに並ぶ。永遠亭の置き薬も2つもらえる。",
      "cost": {
        "credits": 3000,
        "items": {}
      },
      "requires": [],
      "unlock": {
        "units": [],
        "items": [
          "th-i-camo"
        ],
        "grantItems": {
          "th-i-medicine": 2
        }
      }
    },
    {
      "id": "th-r-eientei",
      "name": "永遠亭の薬学",
      "desc": "胡蝶夢丸がショップに並ぶ。",
      "cost": {
        "credits": 4000,
        "items": {}
      },
      "requires": [],
      "unlock": {
        "units": [],
        "items": [
          "th-i-kochou"
        ],
        "grantItems": {
          "th-i-kochou": 1
        }
      }
    },
    {
      "id": "th-r-yakumo",
      "name": "八雲の式",
      "desc": "（ゲームオリジナル）境界の妖怪・八雲紫が、気まぐれに手を貸してくれる。",
      "cost": {
        "credits": 12000,
        "items": {
          "th-i-grimoire": 1
        }
      },
      "requires": [],
      "unlock": {
        "units": [
          "th-u-yukari"
        ],
        "items": [],
        "grantItems": {}
      }
    },
    {
      "id": "th-r-moriya",
      "name": "守矢の分社",
      "desc": "（ゲームオリジナル）博麗神社に守矢の分社を建てると、洩矢諏訪子が顔を出すようになる。",
      "cost": {
        "credits": 10000,
        "items": {}
      },
      "requires": [
        "th-r-kappa"
      ],
      "unlock": {
        "units": [
          "th-u-suwako"
        ],
        "items": [],
        "grantItems": {}
      }
    }
  ],
  "terrains": [
    {
      "name": "紅い霧",
      "desc": "幻想郷を覆う紅い霧。遠くが見えにくい。",
      "rangedHitPt": -10
    },
    {
      "name": "冥界",
      "desc": "幽霊が漂う死者の世界。身体が軽い。",
      "meleeHitPt": -5,
      "mobPct": 10
    },
    {
      "name": "迷いの竹林",
      "desc": "一度入ると迷う竹林。射撃が通りにくい。",
      "rangedHitPt": -15,
      "mobPct": 10
    },
    {
      "name": "妖怪の山",
      "desc": "天狗と河童が暮らす険しい山。足場が悪い。",
      "meleeHitPt": 5,
      "mobPct": -10
    },
    {
      "name": "旧地獄",
      "desc": "灼熱地獄跡の熱気。動きが鈍る。",
      "rangedHitPt": -5,
      "mobPct": -10
    },
    {
      "name": "法界",
      "desc": "魔界の一角。魔力が満ちている。",
      "meleeHitPt": -5,
      "rangedHitPt": 5
    }
  ]
};
