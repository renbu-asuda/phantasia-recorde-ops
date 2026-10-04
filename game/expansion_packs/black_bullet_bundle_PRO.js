/* PRO 拡張パック — ブラック・ブレット（統合パック Bundle Schema 3 / Toolkit 1.10.3 以降）
 * 原作: 神崎紫電『ブラック・ブレット』（電撃文庫）。キャラクター・用語の権利は原作者・出版社に帰属します。非公式のファン制作パックです。
 * ゲームの「データ管理 → 統合JSを読み込む」で読み込んでください。ユニット・作戦・アイテム・研究がまとめて入ります。
 *
 * 収録: ユニット27体（天童民間警備会社・民警ペア・蛭子ペア・五翔会の機械化兵士・ガストレア・ゾディアック）／作戦10本（原作1～7巻の流れ＋IF）／アイテム10種／研究3種
 * 設計メモ:
 *   - 基準は一般歩兵 HP3000 / ATK500 / DEF0 / MOB500 / ACC500。主要キャラは IP序列の高さに合わせて強めにしています。
 *   - バラニウム製の武器・弾は「ガストレア」タグの敵へのダメージが上がる（武装の追加効果）。ガストレアは毎TURN再生する。
 *   - 蛭子影胤の斥力フィールドは物理耐性＋開幕バリア、蓮太郎の撃発は特殊属性・DEF貫通・反動として表現。
 *   - 会話文はゲーム用に書き下ろしたもので、原作の文章ではありません。研究「蛭子ペアとの共闘」はゲームオリジナルです。
 */
window.VAIS_BUNDLE_PACK = {
  "format": "VAIS_OUTER_OPS_BUNDLE_PACK",
  "schemaVersion": 3,
  "packId": "black_bullet",
  "packName": "ブラック・ブレット 拡張パック",
  "units": [
    {
      "id": "bb-u-rentaro",
      "name": "里見蓮太郎",
      "role": "プロモーター / 機械化兵士",
      "mark": "蓮",
      "pilot": "",
      "tags": [
        "生身",
        "民警",
        "プロモーター",
        "機械化兵士",
        "天童式戦闘術",
        "バラニウム",
        "天童民間警備会社",
        "新人類創造計画"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "hp": 4200,
      "atk": 720,
      "def": 80,
      "mob": 700,
      "acc": 760,
      "skills": [
        {
          "id": "bb-s-rentaro-eye",
          "name": "二一式黒膂石義眼",
          "trigger": "before_attack",
          "effect": "hit_up_pt",
          "value": 15,
          "chance": 100,
          "maxUses": 3,
          "note": "義眼の演算で思考を加速する。1戦闘3回まで。"
        },
        {
          "id": "bb-s-rentaro-will",
          "name": "守るための拳",
          "trigger": "ally_down",
          "effect": "atk_up_pct",
          "value": 20,
          "chance": 100,
          "maxUses": 0,
          "note": "仲間が倒れると奮起する。",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "name": "XD拳銃・バラニウム弾",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "40口径の拳銃。弾はバラニウム製。",
          "powerPct": 105,
          "accuracyPt": 15,
          "critPt": 5,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 3,
          "hitPowerPct": 38,
          "effects": [
            {
              "timing": "before",
              "effect": "tag_damage_up_pct",
              "value": 20,
              "tag": "ガストレア"
            }
          ]
        },
        {
          "name": "天童式戦闘術・焔火扇",
          "attackType": "melee",
          "damageType": "physical",
          "note": "天童式戦闘術の正拳。",
          "powerPct": 135,
          "accuracyPt": 18,
          "critPt": 8,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "隠禅・黒天風",
          "attackType": "melee",
          "damageType": "physical",
          "note": "天童式戦闘術の回し蹴り。",
          "powerPct": 120,
          "accuracyPt": 20,
          "critPt": 10,
          "targetCount": 1,
          "weight": 0.8,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "mob_down_pct",
              "value": 15,
              "when": "hit",
              "duration": 2
            }
          ]
        },
        {
          "name": "超バラニウム義肢・撃発",
          "attackType": "melee",
          "damageType": "special",
          "note": "義肢のカートリッジを炸裂させた推進力で打ち込む決め技。撃った後は反動がある。",
          "powerPct": 260,
          "accuracyPt": 5,
          "critPt": 15,
          "targetCount": 1,
          "weight": 0.6,
          "minDamage": 220,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "cooldown": 2,
          "fxColor": "#ffcc33",
          "effects": [
            {
              "timing": "before",
              "effect": "def_pierce_pct",
              "value": 30
            },
            {
              "timing": "after",
              "effect": "recoil_pct",
              "value": 3
            }
          ]
        }
      ],
      "crew": "none",
      "growth": {
        "hp": 150,
        "atk": 22,
        "def": 3,
        "mob": 18,
        "acc": 20
      },
      "skillTree": [
        {
          "id": "bb-n-rentaro-1",
          "cost": 1,
          "minLevel": 2,
          "requires": [],
          "skill": {
            "id": "bb-s-rentaro-unebi",
            "name": "雲嶺毘湖鯉鮒",
            "trigger": "after_attack",
            "effect": "def_down_pct",
            "value": 15,
            "chance": 40,
            "maxUses": 0,
            "note": "天童式戦闘術の連撃で相手の守りを崩す。",
            "target": "opponent",
            "duration": 2
          }
        },
        {
          "id": "bb-n-rentaro-2",
          "cost": 2,
          "minLevel": 4,
          "requires": [
            "bb-n-rentaro-1"
          ],
          "skill": {
            "id": "bb-s-rentaro-rokuro",
            "name": "轆轤鹿伏鬼",
            "trigger": "on_crit",
            "effect": "extra_action",
            "value": 0,
            "chance": 100,
            "maxUses": 1,
            "note": "会心の一撃から畳みかける。"
          }
        },
        {
          "id": "bb-n-rentaro-3",
          "cost": 3,
          "minLevel": 7,
          "requires": [
            "bb-n-rentaro-2"
          ],
          "skill": {
            "id": "bb-s-rentaro-overdrive",
            "name": "義眼・限界演算",
            "trigger": "battle_start",
            "effect": "acc_up_pct",
            "value": 20,
            "chance": 100,
            "maxUses": 1,
            "note": "義眼の演算を限界まで引き上げる。",
            "duration": 4
          }
        }
      ]
    },
    {
      "id": "bb-u-enju",
      "name": "藍原延珠",
      "role": "イニシエーター / モデル・ラビット",
      "mark": "延",
      "pilot": "",
      "tags": [
        "生身",
        "民警",
        "イニシエーター",
        "呪われた子供たち",
        "モデル・ラビット",
        "天童民間警備会社"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "hp": 3500,
      "atk": 780,
      "def": 0,
      "mob": 930,
      "acc": 660,
      "skills": [
        {
          "id": "bb-s-enju-rabbit",
          "name": "モデル・ラビット",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 12,
          "chance": 35,
          "maxUses": 0,
          "note": "跳躍力で攻撃をかわす。"
        },
        {
          "id": "bb-s-enju-dash",
          "name": "脱兎",
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
          "name": "モデル・ラビット蹴撃",
          "attackType": "melee",
          "damageType": "physical",
          "note": "バラニウム製の靴底で蹴る。",
          "powerPct": 120,
          "accuracyPt": 20,
          "critPt": 8,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 60,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 45,
          "effects": [
            {
              "timing": "before",
              "effect": "tag_damage_up_pct",
              "value": 20,
              "tag": "ガストレア"
            }
          ]
        },
        {
          "name": "跳躍からの踵落とし",
          "attackType": "melee",
          "damageType": "physical",
          "note": "ウサギ因子の脚力で高く跳び、真上から蹴り落とす。",
          "powerPct": 190,
          "accuracyPt": 8,
          "critPt": 15,
          "targetCount": 1,
          "weight": 0.7,
          "minDamage": 120,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "before",
              "effect": "crit_up_pt",
              "value": 10
            }
          ]
        }
      ],
      "crew": "none",
      "growth": {
        "hp": 110,
        "atk": 24,
        "def": 0,
        "mob": 22,
        "acc": 14
      }
    },
    {
      "id": "bb-u-kisara",
      "name": "天童木更",
      "role": "プロモーター / 天童式抜刀術",
      "mark": "木",
      "pilot": "",
      "tags": [
        "生身",
        "民警",
        "プロモーター",
        "剣士",
        "天童式抜刀術",
        "バラニウム",
        "天童民間警備会社",
        "社長"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "hp": 2700,
      "atk": 900,
      "def": 0,
      "mob": 720,
      "acc": 790,
      "skills": [
        {
          "id": "bb-s-kisara-nirvana",
          "name": "涅槃妙心の構え",
          "trigger": "after_damaged",
          "effect": "counter",
          "value": 80,
          "chance": 35,
          "maxUses": 0,
          "note": "攻防一体の構えから斬り返す。"
        }
      ],
      "weapons": [
        {
          "name": "滴水成氷",
          "attackType": "melee",
          "damageType": "physical",
          "note": "天童式抜刀術 一の型一番。雷のように速い抜き打ち。",
          "powerPct": 160,
          "accuracyPt": 20,
          "critPt": 12,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "before",
              "effect": "tag_damage_up_pct",
              "value": 25,
              "tag": "ガストレア"
            }
          ]
        },
        {
          "name": "無影無踪",
          "attackType": "ranged",
          "damageType": "special",
          "note": "一の型八番。刀を払った遠心力でかまいたちを飛ばす。",
          "powerPct": 120,
          "accuracyPt": 10,
          "critPt": 8,
          "targetCount": 2,
          "weight": 0.8,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "彌陀永垂剣",
          "attackType": "melee",
          "damageType": "physical",
          "note": "一の型六番。超高速の居合で賽の目に斬る。",
          "powerPct": 110,
          "accuracyPt": 12,
          "critPt": 10,
          "targetCount": 1,
          "weight": 0.6,
          "minDamage": 40,
          "hitsMin": 4,
          "hitsMax": 6,
          "hitPowerPct": 30,
          "usesPerBattle": 2
        },
        {
          "name": "螺旋卍斬花",
          "attackType": "melee",
          "damageType": "special",
          "note": "天童式抜刀術 零の型。",
          "powerPct": 300,
          "accuracyPt": 10,
          "critPt": 20,
          "targetCount": 1,
          "weight": 0.4,
          "minDamage": 250,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#b46bff",
          "effects": [
            {
              "timing": "before",
              "effect": "def_pierce_pct",
              "value": 40
            }
          ]
        }
      ],
      "crew": "none",
      "growth": {
        "hp": 80,
        "atk": 30,
        "def": 0,
        "mob": 16,
        "acc": 20
      }
    },
    {
      "id": "bb-u-tina",
      "name": "ティナ・スプラウト",
      "role": "イニシエーター / モデル・オウル / 狙撃手",
      "mark": "テ",
      "pilot": "",
      "tags": [
        "生身",
        "民警",
        "イニシエーター",
        "呪われた子供たち",
        "モデル・オウル",
        "機械化兵士",
        "狙撃手"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": true
      },
      "hp": 3400,
      "atk": 660,
      "def": 20,
      "mob": 800,
      "acc": 860,
      "skills": [
        {
          "id": "bb-s-tina-owl",
          "name": "モデル・オウル",
          "trigger": "before_attack",
          "effect": "crit_up_pt",
          "value": 10,
          "chance": 100,
          "maxUses": 0,
          "note": "夜目と集中力。"
        },
        {
          "id": "bb-s-tina-shen",
          "name": "シェンフィールド",
          "trigger": "battle_start",
          "effect": "acc_up_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 1,
          "note": "偵察機が敵の位置を伝える。",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "name": "対物狙撃銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "フクロウ因子の夜目と演算で1km先も外さない。",
          "powerPct": 210,
          "accuracyPt": 30,
          "critPt": 15,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 160,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "before",
              "effect": "tag_damage_up_pct",
              "value": 20,
              "tag": "ガストレア"
            }
          ]
        },
        {
          "name": "シェンフィールド連携射撃",
          "attackType": "ranged",
          "damageType": "special",
          "note": "脳内チップで操る偵察機シェンフィールドから多方向に撃つ。",
          "powerPct": 90,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.7,
          "minDamage": 40,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 60,
          "effects": [
            {
              "timing": "after",
              "effect": "acc_up_pct",
              "value": 10,
              "target": "allies",
              "duration": 2
            }
          ]
        },
        {
          "name": "ミニガン",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "重火器による制圧射撃。",
          "powerPct": 95,
          "accuracyPt": 0,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.5,
          "minDamage": 25,
          "hitsMin": 4,
          "hitsMax": 8,
          "hitPowerPct": 18,
          "usesPerBattle": 2
        }
      ],
      "crew": "none",
      "row": "back",
      "ai": {
        "target": "lowest_hp"
      },
      "growth": {
        "hp": 110,
        "atk": 20,
        "def": 1,
        "mob": 16,
        "acc": 26
      },
      "recruit": {
        "locked": true,
        "missionId": "bb-m-04",
        "note": "「神算鬼謀の狙撃兵」をクリアすると天童民間警備会社に加わる"
      }
    },
    {
      "id": "bb-u-shoma",
      "name": "薙沢彰磨",
      "role": "プロモーター / 天童式戦闘術八段",
      "mark": "彰",
      "pilot": "",
      "tags": [
        "生身",
        "民警",
        "プロモーター",
        "天童式戦闘術",
        "薙沢・布施ペア"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "hp": 3700,
      "atk": 760,
      "def": 20,
      "mob": 670,
      "acc": 700,
      "skills": [
        {
          "id": "bb-s-shoma-guard",
          "name": "八段の受け",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 15,
          "chance": 30,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "SIG SAUER P226",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 15,
          "critPt": 5,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 50,
          "hitsMin": 1,
          "hitsMax": 3,
          "hitPowerPct": 35,
          "effects": [
            {
              "timing": "before",
              "effect": "tag_damage_up_pct",
              "value": 15,
              "tag": "ガストレア"
            }
          ]
        },
        {
          "name": "天童式戦闘術八段の打撃",
          "attackType": "melee",
          "damageType": "physical",
          "note": "蓮太郎の兄弟子。IP序列970位。",
          "powerPct": 170,
          "accuracyPt": 20,
          "critPt": 12,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 120,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "bb-m-05",
        "note": "「モノリス崩壊」をクリアすると協力してくれる"
      }
    },
    {
      "id": "bb-u-sui",
      "name": "布施翠",
      "role": "イニシエーター / モデル・キャット",
      "mark": "翠",
      "pilot": "",
      "tags": [
        "生身",
        "民警",
        "イニシエーター",
        "呪われた子供たち",
        "モデル・キャット",
        "薙沢・布施ペア"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "hp": 3100,
      "atk": 690,
      "def": 0,
      "mob": 960,
      "acc": 650,
      "skills": [
        {
          "id": "bb-s-sui-cat",
          "name": "モデル・キャット",
          "trigger": "on_evade",
          "effect": "counter",
          "value": 60,
          "chance": 50,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "収納式の爪",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 95,
          "accuracyPt": 20,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 40,
          "hitsMin": 3,
          "hitsMax": 5,
          "hitPowerPct": 30,
          "effects": [
            {
              "timing": "before",
              "effect": "tag_damage_up_pct",
              "value": 15,
              "tag": "ガストレア"
            }
          ]
        }
      ],
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "bb-m-05",
        "note": "「モノリス崩壊」をクリアすると協力してくれる"
      }
    },
    {
      "id": "bb-u-shogen",
      "name": "伊熊将監",
      "role": "プロモーター / 重戦士",
      "mark": "将",
      "pilot": "",
      "tags": [
        "生身",
        "民警",
        "プロモーター",
        "重戦士",
        "バラニウム",
        "伊熊・千寿ペア"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "hp": 4600,
      "atk": 830,
      "def": 100,
      "mob": 390,
      "acc": 500,
      "skills": [
        {
          "id": "bb-s-shogen-taunt",
          "name": "荒くれの威圧",
          "trigger": "battle_start",
          "effect": "taunt",
          "value": 80,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "name": "バラニウム巨剣",
          "attackType": "melee",
          "damageType": "physical",
          "note": "大手民警・三ヶ島ロイヤルガーダー所属。IP序列1584位。",
          "powerPct": 190,
          "accuracyPt": 5,
          "critPt": 10,
          "targetCount": 2,
          "weight": 1,
          "minDamage": 140,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "before",
              "effect": "tag_damage_up_pct",
              "value": 20,
              "tag": "ガストレア"
            }
          ]
        },
        {
          "name": "S&W シグマ .40",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 95,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.6,
          "minDamage": 50,
          "hitsMin": 1,
          "hitsMax": 3,
          "hitPowerPct": 35
        }
      ],
      "crew": "none"
    },
    {
      "id": "bb-u-kayo",
      "name": "千寿夏世",
      "role": "イニシエーター / モデル・ドルフィン / 司令塔",
      "mark": "夏",
      "pilot": "",
      "tags": [
        "生身",
        "民警",
        "イニシエーター",
        "呪われた子供たち",
        "モデル・ドルフィン",
        "支援",
        "伊熊・千寿ペア"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "hp": 3100,
      "atk": 540,
      "def": 0,
      "mob": 650,
      "acc": 800,
      "skills": [
        {
          "id": "bb-s-kayo-iq",
          "name": "IQ210の戦術眼",
          "trigger": "battle_start",
          "effect": "acc_up_pct",
          "value": 12,
          "chance": 100,
          "maxUses": 1,
          "note": "イルカ因子の知能で後衛から指揮する。",
          "target": "allies",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "name": "フルオートショットガン",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 30
        },
        {
          "name": "40mmグレネードランチャー",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 0,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.6,
          "minDamage": 40,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 70,
          "usesPerBattle": 2,
          "effects": [
            {
              "timing": "after",
              "effect": "burn",
              "value": 60,
              "when": "hit",
              "duration": 2
            }
          ]
        }
      ],
      "crew": "none",
      "row": "back"
    },
    {
      "id": "bb-u-tamaki",
      "name": "片桐玉樹",
      "role": "プロモーター / 近接戦闘",
      "mark": "玉",
      "pilot": "",
      "tags": [
        "生身",
        "民警",
        "プロモーター",
        "格闘",
        "バラニウム",
        "片桐民間警備会社"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "hp": 3900,
      "atk": 720,
      "def": 40,
      "mob": 620,
      "acc": 630,
      "skills": [],
      "weapons": [
        {
          "name": "マテバ拳銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 10,
          "critPt": 5,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 55
        },
        {
          "name": "バラニウム・チェーンソーブーツ",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 12,
          "critPt": 8,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 60,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 45,
          "effects": [
            {
              "timing": "before",
              "effect": "tag_damage_up_pct",
              "value": 20,
              "tag": "ガストレア"
            }
          ]
        }
      ],
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "bb-m-06",
        "note": "第三次関東会戦で蓮太郎のアジュバントに加わる"
      }
    },
    {
      "id": "bb-u-yuzuki",
      "name": "片桐弓月",
      "role": "イニシエーター / モデル・スパイダー",
      "mark": "弓",
      "pilot": "",
      "tags": [
        "生身",
        "民警",
        "イニシエーター",
        "呪われた子供たち",
        "モデル・スパイダー",
        "支援",
        "片桐民間警備会社"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "hp": 3200,
      "atk": 580,
      "def": 0,
      "mob": 830,
      "acc": 700,
      "skills": [],
      "weapons": [
        {
          "name": "粘着性のクモ糸",
          "attackType": "ranged",
          "damageType": "special",
          "note": "糸で絡め取って動きを止める。",
          "powerPct": 60,
          "accuracyPt": 20,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "mob_down_pct",
              "value": 25,
              "when": "hit",
              "duration": 2
            },
            {
              "timing": "after",
              "effect": "stun",
              "value": 0,
              "when": "hit",
              "chance": 20
            }
          ]
        },
        {
          "name": "糸を使った高機動格闘",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 40
        }
      ],
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "bb-m-06",
        "note": "第三次関東会戦で蓮太郎のアジュバントに加わる"
      }
    },
    {
      "id": "bb-u-gado",
      "name": "我堂長正",
      "role": "プロモーター / 軍団長",
      "mark": "我",
      "pilot": "",
      "tags": [
        "生身",
        "民警",
        "プロモーター",
        "剣士",
        "バラニウム",
        "我堂・壬生ペア",
        "指揮官"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "hp": 4800,
      "atk": 850,
      "def": 120,
      "mob": 600,
      "acc": 720,
      "skills": [
        {
          "id": "bb-s-gado-command",
          "name": "軍団長の号令",
          "trigger": "battle_start",
          "effect": "atk_up_pct",
          "value": 12,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "target": "allies",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "name": "バラニウム大太刀",
          "attackType": "melee",
          "damageType": "physical",
          "note": "第三次関東会戦の軍団長。IP序列275位。",
          "powerPct": 170,
          "accuracyPt": 15,
          "critPt": 10,
          "targetCount": 2,
          "weight": 1,
          "minDamage": 120,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "before",
              "effect": "tag_damage_up_pct",
              "value": 25,
              "tag": "ガストレア"
            }
          ]
        }
      ],
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「アジュバント結成」で合流"
      }
    },
    {
      "id": "bb-u-asaka",
      "name": "壬生朝霞",
      "role": "イニシエーター / 甲冑の剣士",
      "mark": "朝",
      "pilot": "",
      "tags": [
        "生身",
        "民警",
        "イニシエーター",
        "呪われた子供たち",
        "剣士",
        "バラニウム",
        "我堂・壬生ペア"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "hp": 3800,
      "atk": 820,
      "def": 150,
      "mob": 700,
      "acc": 720,
      "skills": [
        {
          "id": "bb-s-asaka-armor",
          "name": "外骨格の甲冑",
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
          "name": "バラニウム製の日本刀",
          "attackType": "melee",
          "damageType": "physical",
          "note": "甲冑のような外骨格をまとって斬り込む。",
          "powerPct": 150,
          "accuracyPt": 18,
          "critPt": 12,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 65,
          "effects": [
            {
              "timing": "before",
              "effect": "tag_damage_up_pct",
              "value": 20,
              "tag": "ガストレア"
            }
          ]
        }
      ],
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「アジュバント結成」で合流"
      }
    },
    {
      "id": "bb-u-hotaru",
      "name": "紅露火垂",
      "role": "イニシエーター / モデル・プラナリア",
      "mark": "火",
      "pilot": "",
      "tags": [
        "生身",
        "民警",
        "イニシエーター",
        "呪われた子供たち",
        "モデル・プラナリア"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "hp": 3000,
      "atk": 620,
      "def": 0,
      "mob": 700,
      "acc": 720,
      "skills": [
        {
          "id": "bb-s-hotaru-regen",
          "name": "プラナリアの再生",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": "致命傷からも再生する。"
        },
        {
          "id": "bb-s-hotaru-revive",
          "name": "不死身に近い再生",
          "trigger": "on_death",
          "effect": "guts",
          "value": 1,
          "chance": 100,
          "maxUses": 2,
          "note": "頭と胴が無事なら立ち上がる。1戦闘2回。"
        }
      ],
      "weapons": [
        {
          "name": "二丁拳銃（コルト・ガバメント カスタム）",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "水原鬼八の相棒。",
          "powerPct": 100,
          "accuracyPt": 12,
          "critPt": 5,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 45,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 32,
          "effects": [
            {
              "timing": "before",
              "effect": "tag_damage_up_pct",
              "value": 15,
              "tag": "ガストレア"
            }
          ]
        }
      ],
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "bb-m-08",
        "note": "「逃亡犯、里見蓮太郎」をクリアすると共闘"
      }
    },
    {
      "id": "bb-u-kagetane",
      "name": "蛭子影胤",
      "role": "元プロモーター / 機械化兵士",
      "mark": "影",
      "pilot": "",
      "tags": [
        "生身",
        "元民警",
        "プロモーター",
        "機械化兵士",
        "新人類創造計画",
        "斥力",
        "蛭子ペア"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": true
      },
      "hp": 4800,
      "atk": 760,
      "def": 100,
      "mob": 650,
      "acc": 730,
      "skills": [
        {
          "id": "bb-s-kagetane-field",
          "name": "イマジナリー・ギミック",
          "trigger": "when_targeted",
          "effect": "weapon_resist_pct",
          "value": 40,
          "chance": 100,
          "maxUses": 0,
          "note": "斥力フィールドで物理攻撃を弾く。",
          "resistType": "physical"
        },
        {
          "id": "bb-s-kagetane-barrier",
          "name": "斥力フィールド展開",
          "trigger": "battle_start",
          "effect": "shield",
          "value": 1500,
          "chance": 100,
          "maxUses": 1,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "スパンキング・ソドミー＆サイケデリック・ゴスペル",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "改造した二丁のベレッタ。",
          "powerPct": 115,
          "accuracyPt": 12,
          "critPt": 5,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 60,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 35
        },
        {
          "name": "マキシマム・ペイン",
          "attackType": "ranged",
          "damageType": "special",
          "note": "斥力で押しつぶす。",
          "powerPct": 220,
          "accuracyPt": 5,
          "critPt": 10,
          "targetCount": 2,
          "weight": 0.6,
          "minDamage": 180,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "cooldown": 1,
          "fxColor": "#7b5cff",
          "effects": [
            {
              "timing": "after",
              "effect": "stun",
              "value": 0,
              "when": "hit",
              "chance": 25
            }
          ]
        },
        {
          "name": "エンドレス・スクリーム",
          "attackType": "ranged",
          "damageType": "special",
          "note": "槍の形にした斥力で貫く。",
          "powerPct": 260,
          "accuracyPt": 10,
          "critPt": 15,
          "targetCount": 1,
          "weight": 0.4,
          "minDamage": 220,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "fxColor": "#7b5cff",
          "effects": [
            {
              "timing": "before",
              "effect": "def_pierce_pct",
              "value": 50
            }
          ]
        }
      ],
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「蛭子ペアとの共闘」で味方になる（ゲームオリジナル）"
      },
      "exp": 500
    },
    {
      "id": "bb-u-kohina",
      "name": "蛭子小比奈",
      "role": "イニシエーター / モデル・マンティス",
      "mark": "比",
      "pilot": "",
      "tags": [
        "生身",
        "イニシエーター",
        "呪われた子供たち",
        "モデル・マンティス",
        "剣士",
        "バラニウム",
        "蛭子ペア"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": true
      },
      "hp": 3400,
      "atk": 800,
      "def": 0,
      "mob": 920,
      "acc": 700,
      "skills": [
        {
          "id": "bb-s-kohina-mantis",
          "name": "モデル・マンティス",
          "trigger": "before_attack",
          "effect": "crit_up_pt",
          "value": 12,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "バラニウム小太刀・二刀",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 18,
          "critPt": 12,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 60,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 35,
          "effects": [
            {
              "timing": "before",
              "effect": "tag_damage_up_pct",
              "value": 15,
              "tag": "ガストレア"
            }
          ]
        },
        {
          "name": "カマキリの斬撃",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 180,
          "accuracyPt": 10,
          "critPt": 20,
          "targetCount": 1,
          "weight": 0.6,
          "minDamage": 120,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "def_down_pct",
              "value": 15,
              "when": "hit",
              "duration": 2
            }
          ]
        }
      ],
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「蛭子ペアとの共闘」で味方になる（ゲームオリジナル）"
      },
      "exp": 400
    },
    {
      "id": "bb-u-hummingbird",
      "name": "ハミングバード",
      "role": "五翔会 機械化兵士",
      "mark": "HB",
      "pilot": "",
      "tags": [
        "生身",
        "機械化兵士",
        "五翔会"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "hp": 4000,
      "atk": 800,
      "def": 50,
      "mob": 950,
      "acc": 750,
      "skills": [
        {
          "id": "bb-s-hb-evade",
          "name": "高機動",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 15,
          "chance": 40,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "ドローン群の掃射",
          "attackType": "ranged",
          "damageType": "special",
          "note": "久留米リカ。小型機械を操って襲う。",
          "powerPct": 90,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1,
          "minDamage": 40,
          "hitsMin": 1,
          "hitsMax": 3,
          "hitPowerPct": 40
        },
        {
          "name": "高機動からの刺突",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 15,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 100,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "crew": "none",
      "exp": 300
    },
    {
      "id": "bb-u-swordtail",
      "name": "ソードテール",
      "role": "五翔会 機械化兵士",
      "mark": "ST",
      "pilot": "",
      "tags": [
        "生身",
        "機械化兵士",
        "五翔会"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "hp": 4500,
      "atk": 850,
      "def": 80,
      "mob": 800,
      "acc": 800,
      "skills": [
        {
          "id": "bb-s-st-camo",
          "name": "光学迷彩",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 25,
          "chance": 50,
          "maxUses": 0,
          "note": "皮膚を光学迷彩化して姿を消す。"
        },
        {
          "id": "bb-s-st-spine",
          "name": "自己修復する脊椎",
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
          "name": "消音拳銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "鹿嶽十五。",
          "powerPct": 120,
          "accuracyPt": 20,
          "critPt": 15,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 60
        },
        {
          "name": "ナイフの暗殺術",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 20,
          "critPt": 20,
          "targetCount": 1,
          "weight": 0.8,
          "minDamage": 120,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "crew": "none",
      "exp": 350
    },
    {
      "id": "bb-u-darkstalker",
      "name": "ダークストーカー",
      "role": "五翔会 機械化兵士",
      "mark": "DS",
      "pilot": "",
      "tags": [
        "生身",
        "機械化兵士",
        "五翔会"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "hp": 5200,
      "atk": 900,
      "def": 100,
      "mob": 850,
      "acc": 950,
      "skills": [
        {
          "id": "bb-s-ds-eye",
          "name": "機械の目",
          "trigger": "before_attack",
          "effect": "crit_up_pt",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "bb-s-ds-counter",
          "name": "先読み",
          "trigger": "on_evade",
          "effect": "counter",
          "value": 80,
          "chance": 50,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "精密狙撃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "巳継悠河。機械の目で狙う。",
          "powerPct": 200,
          "accuracyPt": 30,
          "critPt": 20,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 160,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "before",
              "effect": "hit_up_pt",
              "value": 15
            }
          ]
        },
        {
          "name": "近接格闘術",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 20,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 60
        }
      ],
      "crew": "none",
      "row": "back",
      "ai": {
        "target": "lowest_hp"
      },
      "exp": 450
    },
    {
      "id": "bb-u-seitenshi",
      "name": "聖天子",
      "role": "東京エリア統治者",
      "mark": "聖",
      "pilot": "",
      "tags": [
        "生身",
        "要人"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": false
      },
      "hp": 5000,
      "atk": 100,
      "def": 50,
      "mob": 400,
      "acc": 400,
      "skills": [],
      "weapons": [
        {
          "name": "護身用拳銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 40,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 10,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "crew": "none"
    },
    {
      "id": "bb-u-stage1",
      "name": "ガストレア ステージI",
      "role": "ガストレア",
      "mark": "G1",
      "pilot": "",
      "tags": [
        "ガストレア",
        "ステージI",
        "モデル・スパイダー"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "hp": 2600,
      "atk": 460,
      "def": 0,
      "mob": 450,
      "acc": 420,
      "skills": [
        {
          "id": "bb-s-stage1-regen",
          "name": "再生能力",
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
          "name": "毒牙",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 40,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "crew": "none"
    },
    {
      "id": "bb-u-stage2",
      "name": "ガストレア ステージII",
      "role": "ガストレア",
      "mark": "G2",
      "pilot": "",
      "tags": [
        "ガストレア",
        "ステージII"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "hp": 4500,
      "atk": 600,
      "def": 60,
      "mob": 500,
      "acc": 450,
      "skills": [
        {
          "id": "bb-s-stage2-regen",
          "name": "再生能力",
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
          "name": "変異した爪",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 60
        }
      ],
      "crew": "none"
    },
    {
      "id": "bb-u-stage3",
      "name": "ガストレア ステージIII（飛行型）",
      "role": "ガストレア",
      "mark": "G3",
      "pilot": "",
      "tags": [
        "ガストレア",
        "ステージIII",
        "飛行"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "hp": 7000,
      "atk": 720,
      "def": 100,
      "mob": 600,
      "acc": 520,
      "skills": [
        {
          "id": "bb-s-stage3-regen",
          "name": "再生能力",
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
          "name": "急降下",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 5,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "酸の噴射",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 2,
          "weight": 0.6,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "def_down_pct",
              "value": 10,
              "when": "hit",
              "duration": 2
            }
          ]
        }
      ],
      "crew": "none"
    },
    {
      "id": "bb-u-stage4",
      "name": "ガストレア ステージIV",
      "role": "ガストレア",
      "mark": "G4",
      "pilot": "",
      "tags": [
        "ガストレア",
        "ステージIV",
        "大型"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "hp": 13000,
      "atk": 880,
      "def": 200,
      "mob": 450,
      "acc": 520,
      "skills": [
        {
          "id": "bb-s-stage4-regen",
          "name": "再生能力",
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
          "name": "巨体の突進",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1,
          "minDamage": 140,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "crew": "none",
      "regen": 5
    },
    {
      "id": "bb-u-pleiades",
      "name": "プレヤデス",
      "role": "ガストレア（遠距離砲撃型）",
      "mark": "PLE",
      "pilot": "",
      "tags": [
        "ガストレア",
        "ステージIV",
        "テッポウウオ"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "hp": 8000,
      "atk": 900,
      "def": 80,
      "mob": 380,
      "acc": 820,
      "skills": [
        {
          "id": "bb-s-pleiades-regen",
          "name": "再生能力",
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
          "name": "高圧水流の狙撃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "テッポウウオの因子を持つ砲撃役。",
          "powerPct": 200,
          "accuracyPt": 25,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 160,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "crew": "none",
      "row": "back",
      "ai": {
        "target": "lowest_hp"
      },
      "exp": 400
    },
    {
      "id": "bb-u-aldebaran",
      "name": "アルデバラン",
      "role": "ガストレア（指揮官型）",
      "mark": "ALD",
      "pilot": "",
      "tags": [
        "ガストレア",
        "ステージIV",
        "指揮官",
        "大型"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "hp": 20000,
      "atk": 800,
      "def": 150,
      "mob": 450,
      "acc": 620,
      "skills": [
        {
          "id": "bb-s-aldebaran-regen",
          "name": "再生能力",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 4,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "bb-s-ald-pheromone",
          "name": "フェロモンによる統率",
          "trigger": "battle_start",
          "effect": "atk_up_pct",
          "value": 20,
          "chance": 100,
          "maxUses": 1,
          "note": "ハチの因子でガストレアの軍勢を指揮する。",
          "target": "allies",
          "duration": 4
        },
        {
          "id": "bb-s-ald-shell",
          "name": "重装甲殻",
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
          "name": "バラニウム侵食液",
          "attackType": "ranged",
          "damageType": "special",
          "note": "バラニウムを溶かす体液。",
          "powerPct": 140,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1,
          "minDamage": 100,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "def_down_pct",
              "value": 20,
              "when": "hit",
              "duration": 3
            }
          ]
        },
        {
          "name": "甲殻の体当たり",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 180,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 150,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "crew": "none",
      "regen": 4,
      "exp": 1200
    },
    {
      "id": "bb-u-scorpion",
      "name": "スコーピオン（天蠍宮）",
      "role": "ゾディアック（ステージV）",
      "mark": "SCO",
      "pilot": "",
      "tags": [
        "ガストレア",
        "ステージV",
        "ゾディアック",
        "大型"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "hp": 22000,
      "atk": 720,
      "def": 150,
      "mob": 300,
      "acc": 600,
      "skills": [
        {
          "id": "bb-s-scorpion-regen",
          "name": "再生能力",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 3,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "bb-s-sco-ward",
          "name": "ゾディアックの外皮",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 25,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "天蠍宮の毒針",
          "attackType": "melee",
          "damageType": "special",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1,
          "minDamage": 200,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "burn",
              "value": 100,
              "when": "hit",
              "duration": 2
            }
          ]
        },
        {
          "name": "巨体の蹂躙",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.6,
          "minDamage": 100,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "crew": "none",
      "regen": 3,
      "exp": 2500
    },
    {
      "id": "bb-u-libra",
      "name": "リブラ（天秤宮）",
      "role": "ゾディアック（ステージV）",
      "mark": "LIB",
      "pilot": "",
      "tags": [
        "ガストレア",
        "ステージV",
        "ゾディアック",
        "大型"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "hp": 32000,
      "atk": 880,
      "def": 150,
      "mob": 400,
      "acc": 620,
      "skills": [
        {
          "id": "bb-s-libra-regen",
          "name": "再生能力",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 3,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "bb-s-lib-ward",
          "name": "ゾディアックの外皮",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 25,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "殺人ウイルスの散布",
          "attackType": "ranged",
          "damageType": "special",
          "note": "人間だけを狙うウイルスを撒く。",
          "powerPct": 90,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 6,
          "weight": 1,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "burn",
              "value": 100,
              "when": "hit",
              "duration": 2
            }
          ]
        },
        {
          "name": "ムカデの胴の薙ぎ払い",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 170,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1,
          "minDamage": 150,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "crew": "none",
      "regen": 3,
      "exp": 3000
    }
  ],
  "missions": [
    {
      "id": "bb-m-01",
      "name": "1巻 ガストレア駆除依頼",
      "diff": "E",
      "reward": 1500,
      "desc": "天童民間警備会社に入った駆除依頼。感染したばかりのガストレアを処理する。",
      "terrain": "市街地",
      "tags": [
        "1巻"
      ],
      "rules": [],
      "enemies": [
        "bb-u-stage1",
        "bb-u-stage1",
        "bb-u-stage1"
      ],
      "maxDeploy": 3,
      "drops": [
        {
          "itemId": "bb-i-medkit",
          "chance": 80,
          "min": 1,
          "max": 2
        }
      ],
      "story": {
        "before": [
          {
            "speaker": "天童木更",
            "text": "里見くん、仕事よ。今月こそ赤字を脱出するんだから！"
          },
          {
            "speaker": "藍原延珠",
            "text": "妾と蓮太郎に任せるのだ！"
          }
        ],
        "after": [
          {
            "speaker": "里見蓮太郎",
            "text": "片付いたな。……報酬、ちゃんと出るんだろうな"
          }
        ]
      }
    },
    {
      "id": "bb-m-02",
      "name": "1巻 仮面の男",
      "diff": "D",
      "reward": 2500,
      "desc": "ケースを狙う謎の男と少女が現れた。斥力の壁を持つ相手に、物理攻撃は通りにくい。",
      "terrain": "市街地",
      "tags": [
        "1巻"
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 0
      },
      "rules": [],
      "enemies": [
        "bb-u-kagetane",
        "bb-u-kohina",
        "bb-u-stage2"
      ],
      "maxDeploy": 4,
      "requires": {
        "missions": [
          "bb-m-01"
        ]
      },
      "drops": [
        {
          "itemId": "bb-i-maintenance",
          "chance": 60,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "bb-i-crate",
          "chance": 40,
          "min": 1,
          "max": 1
        }
      ],
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "no_loss"
        },
        {
          "type": "turns_le",
          "value": 10
        }
      ],
      "story": {
        "before": [
          {
            "speaker": "蛭子影胤",
            "text": "やあ、里見くん。ずいぶん面白い身体をしているね"
          },
          {
            "speaker": "里見蓮太郎",
            "text": "……てめぇ、何者だ"
          }
        ],
        "after": [
          {
            "speaker": "藍原延珠",
            "text": "逃げられたのだ……！"
          }
        ]
      }
    },
    {
      "id": "bb-m-03",
      "name": "1巻 天蠍宮",
      "diff": "C",
      "reward": 5000,
      "desc": "ゾディアック・スコーピオンが東京エリアに迫る。巨体の外皮は硬く、再生も速い。",
      "terrain": "標準",
      "tags": [
        "1巻",
        "ゾディアック"
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 0
      },
      "rules": [
        {
          "type": "turn_limit",
          "value": 25
        }
      ],
      "enemies": [
        "bb-u-scorpion",
        "bb-u-stage1",
        "bb-u-stage2"
      ],
      "maxDeploy": 5,
      "requires": {
        "missions": [
          "bb-m-02"
        ]
      },
      "drops": [
        {
          "itemId": "bb-i-railgun",
          "chance": 100,
          "min": 1,
          "max": 1
        }
      ],
      "starReward": 1500,
      "story": {
        "before": [
          {
            "speaker": "里見蓮太郎",
            "text": "あれがステージV……ゾディアックか"
          }
        ],
        "after": [
          {
            "speaker": "聖天子",
            "text": "東京エリアを救ってくれたこと、感謝します"
          }
        ]
      }
    },
    {
      "id": "bb-m-04",
      "name": "2巻 神算鬼謀の狙撃兵",
      "diff": "C",
      "reward": 4000,
      "desc": "聖天子を狙う狙撃手が現れた。聖天子を守りながら、狙撃手と偵察機の連携を崩せ。",
      "terrain": "夜間",
      "tags": [
        "2巻"
      ],
      "objective": {
        "type": "escort",
        "escortUnitId": "bb-u-seitenshi"
      },
      "rules": [],
      "enemies": [
        "bb-u-tina",
        "bb-u-stage2",
        "bb-u-stage2"
      ],
      "enemyRows": [
        "back",
        "front",
        "front"
      ],
      "maxDeploy": 4,
      "requires": {
        "missions": [
          "bb-m-02"
        ]
      },
      "drops": [
        {
          "itemId": "bb-i-shenfield",
          "chance": 50,
          "min": 1,
          "max": 1
        }
      ],
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "hp_ge",
          "value": 60
        },
        {
          "type": "turns_le",
          "value": 12
        }
      ],
      "story": {
        "before": [
          {
            "speaker": "里見蓮太郎",
            "text": "夜の狙撃……向こうはこっちが見えてる"
          }
        ],
        "after": [
          {
            "speaker": "ティナ・スプラウト",
            "text": "……わたしを、ここに置いてくれるんですか？"
          }
        ]
      }
    },
    {
      "id": "bb-m-05",
      "name": "3巻 モノリス崩壊",
      "diff": "B",
      "reward": 5000,
      "desc": "バラニウムを侵されたモノリスが崩れかけている。新モノリスが届くまで6TURN持ちこたえろ。",
      "terrain": "森林",
      "tags": [
        "3巻"
      ],
      "objective": {
        "type": "defense",
        "turns": 6
      },
      "rules": [
        {
          "type": "reinforce",
          "turn": 3,
          "enemies": [
            "bb-u-stage3",
            "bb-u-stage2"
          ]
        }
      ],
      "enemies": [
        "bb-u-stage2",
        "bb-u-stage3",
        "bb-u-stage3",
        "bb-u-stage2"
      ],
      "maxDeploy": 5,
      "requires": {
        "missions": [
          "bb-m-03"
        ]
      },
      "drops": [
        {
          "itemId": "bb-i-training",
          "chance": 60,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "bb-i-crate",
          "chance": 60,
          "min": 1,
          "max": 2
        }
      ],
      "story": {
        "before": [
          {
            "speaker": "薙沢彰磨",
            "text": "久しいな、蓮太郎。力を貸そう"
          }
        ],
        "after": []
      }
    },
    {
      "id": "bb-m-06",
      "name": "4巻 第三次関東会戦・前哨",
      "diff": "B",
      "reward": 6000,
      "desc": "モノリスの隙間からガストレアの軍勢がなだれ込む。遠距離からはプレヤデスの砲撃。全2波。",
      "terrain": "標準",
      "tags": [
        "4巻"
      ],
      "objective": {
        "type": "chain"
      },
      "waves": [
        [
          "bb-u-stage3",
          "bb-u-pleiades",
          "bb-u-stage2",
          "bb-u-stage2"
        ]
      ],
      "rules": [
        {
          "type": "turn_limit",
          "value": 22
        }
      ],
      "enemies": [
        "bb-u-stage2",
        "bb-u-stage2",
        "bb-u-stage3",
        "bb-u-stage3",
        "bb-u-stage2"
      ],
      "maxDeploy": 6,
      "requires": {
        "missions": [
          "bb-m-05"
        ]
      },
      "drops": [
        {
          "itemId": "bb-i-crate",
          "chance": 80,
          "min": 1,
          "max": 2
        },
        {
          "itemId": "bb-i-bullets",
          "chance": 50,
          "min": 1,
          "max": 1
        }
      ],
      "starReward": 2000,
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "turns_le",
          "value": 14
        },
        {
          "type": "no_loss"
        }
      ],
      "story": {
        "before": [
          {
            "speaker": "片桐玉樹",
            "text": "おう里見！ 俺らもアジュバントに入れろや"
          }
        ],
        "after": []
      }
    },
    {
      "id": "bb-m-07",
      "name": "4巻 アルデバラン",
      "diff": "A",
      "reward": 10000,
      "desc": "ガストレアの軍勢を統率するステージIV・アルデバランを討て。フェロモンで配下を強化し、バラニウムを溶かす体液を吐く。",
      "terrain": "標準",
      "tags": [
        "4巻",
        "ボス"
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 0
      },
      "rules": [
        {
          "type": "reinforce",
          "turn": 4,
          "enemies": [
            "bb-u-stage3",
            "bb-u-stage3"
          ]
        }
      ],
      "enemies": [
        "bb-u-aldebaran",
        "bb-u-pleiades",
        "bb-u-stage3",
        "bb-u-stage2"
      ],
      "enemyRows": [
        "back",
        "back",
        "front",
        "front"
      ],
      "maxDeploy": 8,
      "requires": {
        "missions": [
          "bb-m-06"
        ],
        "minLevel": 4
      },
      "drops": [
        {
          "itemId": "bb-i-railgun",
          "chance": 100,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "bb-i-sumire",
          "chance": 50,
          "min": 1,
          "max": 1
        }
      ],
      "starReward": 3000,
      "story": {
        "before": [
          {
            "speaker": "里見蓮太郎",
            "text": "ここで止めなきゃ東京エリアは終わる。全員、行くぞ！"
          }
        ],
        "after": [
          {
            "speaker": "藍原延珠",
            "text": "勝ったのだ、蓮太郎！"
          }
        ]
      }
    },
    {
      "id": "bb-m-08",
      "name": "5巻 逃亡犯、里見蓮太郎",
      "diff": "A",
      "reward": 8000,
      "desc": "殺人の濡れ衣を着せられた蓮太郎の前に、五翔会の機械化兵士が立ちはだかる。",
      "terrain": "夜間",
      "tags": [
        "5巻",
        "6巻"
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 0
      },
      "rules": [],
      "enemies": [
        "bb-u-darkstalker",
        "bb-u-swordtail",
        "bb-u-hummingbird"
      ],
      "enemyRows": [
        "back",
        "front",
        "front"
      ],
      "maxDeploy": 4,
      "requires": {
        "missions": [
          "bb-m-07"
        ]
      },
      "drops": [
        {
          "itemId": "bb-i-legacy",
          "chance": 100,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "bb-i-maintenance",
          "chance": 60,
          "min": 1,
          "max": 2
        }
      ],
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
      "story": {
        "before": [
          {
            "speaker": "紅露火垂",
            "text": "あなたが鬼八さんを殺したんじゃないなら……証明してみせて"
          }
        ],
        "after": [
          {
            "speaker": "里見蓮太郎",
            "text": "五翔会……必ず尻尾をつかんでやる"
          }
        ]
      }
    },
    {
      "id": "bb-m-09",
      "name": "7巻 天秤宮",
      "diff": "S",
      "reward": 15000,
      "desc": "ゾディアック・リブラが目覚めた。人間だけを狙うウイルスを撒き散らす。30TURN以内に討て。",
      "terrain": "標準",
      "tags": [
        "7巻",
        "ゾディアック",
        "最終"
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 0
      },
      "rules": [
        {
          "type": "turn_limit",
          "value": 30
        },
        {
          "type": "reinforce",
          "turn": 5,
          "enemies": [
            "bb-u-stage4",
            "bb-u-stage3"
          ]
        }
      ],
      "enemies": [
        "bb-u-libra",
        "bb-u-stage3",
        "bb-u-stage3",
        "bb-u-stage4"
      ],
      "maxDeploy": 8,
      "requires": {
        "missions": [
          "bb-m-08"
        ],
        "items": [
          "bb-i-legacy"
        ],
        "minLevel": 6
      },
      "drops": [
        {
          "itemId": "bb-i-sumire",
          "chance": 100,
          "min": 2,
          "max": 2
        }
      ],
      "starReward": 5000,
      "story": {
        "before": [
          {
            "speaker": "聖天子",
            "text": "東京エリアの命運を、あなたたちに託します"
          }
        ],
        "after": [
          {
            "speaker": "里見蓮太郎",
            "text": "……まだ終わっちゃいない。でも、今日は守れた"
          }
        ]
      }
    },
    {
      "id": "bb-m-10",
      "name": "IF 未踏査領域の掃討",
      "diff": "C",
      "reward": 3000,
      "desc": "モノリスの外、未踏査領域でのガストレア駆除。何度でも挑める稼ぎ場。",
      "terrain": "森林",
      "tags": [
        "IF"
      ],
      "rules": [],
      "enemies": [
        "bb-u-stage2",
        "bb-u-stage2",
        "bb-u-stage3",
        "bb-u-stage1"
      ],
      "maxDeploy": 5,
      "requires": {
        "missions": [
          "bb-m-03"
        ]
      },
      "exp": 250,
      "drops": [
        {
          "itemId": "bb-i-crate",
          "chance": 70,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "bb-i-training",
          "chance": 30,
          "min": 1,
          "max": 1
        }
      ]
    }
  ],
  "items": [
    {
      "id": "bb-i-medkit",
      "name": "民警用救急キット",
      "desc": "生身のユニットのHPを2000回復する。",
      "requires": {
        "allTags": [
          "生身"
        ]
      },
      "effect": {
        "type": "heal_hp_flat",
        "value": 2000
      },
      "price": 400
    },
    {
      "id": "bb-i-sumire",
      "name": "室戸菫の診察",
      "desc": "四賢人の一人による治療。HPを全回復する。",
      "effect": {
        "type": "heal_hp_full"
      },
      "price": 1500
    },
    {
      "id": "bb-i-maintenance",
      "name": "義肢メンテナンス",
      "desc": "機械化兵士のHPを最大HPの60%回復する。",
      "requires": {
        "allTags": [
          "機械化兵士"
        ]
      },
      "effect": {
        "type": "heal_hp_pct",
        "value": 60
      },
      "price": 800
    },
    {
      "id": "bb-i-bullets",
      "name": "バラニウム弾の補給",
      "desc": "部隊全員、次の出撃だけATK+15%。",
      "effect": {
        "type": "sortie_buff",
        "stat": "atk",
        "value": 15
      },
      "scope": "party",
      "price": 1200
    },
    {
      "id": "bb-i-training",
      "name": "天童式の稽古",
      "desc": "経験値+200。",
      "effect": {
        "type": "exp_gain",
        "value": 200
      },
      "price": 1500
    },
    {
      "id": "bb-i-shenfield",
      "name": "予備のシェンフィールド",
      "desc": "装備するとACC+50。",
      "equip": {
        "slot": "accessory",
        "stats": {
          "acc": 50
        },
        "skills": [],
        "weapons": []
      },
      "price": 2500
    },
    {
      "id": "bb-i-vest",
      "name": "バラニウム繊維の防弾ベスト",
      "desc": "装備するとDEF+70・最大HP+400。",
      "equip": {
        "slot": "accessory",
        "stats": {
          "def": 70,
          "hp": 400
        },
        "skills": [],
        "weapons": []
      },
      "price": 2500,
      "shop": {
        "requiresResearch": "bb-r-arsenal"
      }
    },
    {
      "id": "bb-i-railgun",
      "name": "天の梯子の記録",
      "desc": "「天の梯子」の発射記録。スキルポイント+1（1体1回）。",
      "effect": {
        "type": "skill_point",
        "value": 1
      },
      "limitPerUnit": 1
    },
    {
      "id": "bb-i-legacy",
      "name": "七星の遺産",
      "desc": "東京エリアが隠してきた秘密。「天秤宮」の作戦に必要。",
      "key": true
    },
    {
      "id": "bb-i-crate",
      "name": "司馬重工の補給箱",
      "desc": "中身は開けてのお楽しみ。",
      "effect": {
        "type": "loot_box",
        "table": [
          {
            "itemId": "bb-i-medkit",
            "weight": 5,
            "min": 1,
            "max": 2
          },
          {
            "itemId": "bb-i-maintenance",
            "weight": 3,
            "min": 1,
            "max": 1
          },
          {
            "itemId": "bb-i-bullets",
            "weight": 2,
            "min": 1,
            "max": 1
          },
          {
            "itemId": "bb-i-training",
            "weight": 2,
            "min": 1,
            "max": 1
          }
        ]
      }
    }
  ],
  "research": [
    {
      "id": "bb-r-arsenal",
      "name": "司馬重工の新装備",
      "desc": "バラニウム繊維の防弾ベストがショップに並ぶ。",
      "cost": {
        "credits": 3000,
        "items": {}
      },
      "requires": [],
      "unlock": {
        "units": [],
        "items": [
          "bb-i-vest"
        ],
        "grantItems": {
          "bb-i-medkit": 2
        }
      }
    },
    {
      "id": "bb-r-adjuvant",
      "name": "アジュバント結成",
      "desc": "第三次関東会戦に備え、我堂長正と壬生朝霞が合流する。",
      "cost": {
        "credits": 5000,
        "items": {}
      },
      "requires": [],
      "unlock": {
        "units": [
          "bb-u-gado",
          "bb-u-asaka"
        ],
        "items": [],
        "grantItems": {}
      }
    },
    {
      "id": "bb-r-hiruko",
      "name": "蛭子ペアとの共闘",
      "desc": "（ゲームオリジナル）最後の戦いに向け、蛭子影胤・小比奈と手を組む。",
      "cost": {
        "credits": 12000,
        "items": {
          "bb-i-railgun": 1
        }
      },
      "requires": [
        "bb-r-adjuvant"
      ],
      "unlock": {
        "units": [
          "bb-u-kagetane",
          "bb-u-kohina"
        ],
        "items": [],
        "grantItems": {}
      }
    }
  ]
};
