/* PRO 1.13.0 基本データ（ユニット）— ゲームに最初から入っているデータです。
 * 最新の形式（Unit Schema 6 / Mission Schema 3 / Item Schema 5）です。
 * 作り方の参考にどうぞ。メーカーで読み込めば、そのまま編集できます。 */
window.VAIS_UNIT_PACK = {
  "format": "VAIS_OUTER_OPS_UNIT_PACK",
  "schemaVersion": 6,
  "packId": "pro-core",
  "packName": "基本データ",
  "units": [
    {
      "id": "core-u-jackal",
      "name": "ジャッカル",
      "role": "歩兵",
      "mark": "JCK",
      "pilot": "",
      "tags": [
        "歩兵",
        "生身"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "hp": 3000,
      "atk": 500,
      "def": 0,
      "mob": 500,
      "acc": 500,
      "skills": [],
      "weapons": [
        {
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 50,
          "hitsMin": 1,
          "hitsMax": 4,
          "hitPowerPct": 25,
          "name": "E90"
        },
        {
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 80,
          "accuracyPt": 20,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 45,
          "name": "ナイフ"
        }
      ],
      "skillTree": [
        {
          "id": "core-n-jackal-aim",
          "cost": 1,
          "minLevel": 1,
          "requires": [],
          "skill": {
            "id": "core-s-jackal-aim",
            "name": "精密射撃",
            "trigger": "before_attack",
            "effect": "hit_up_pt",
            "value": 10,
            "chance": 100,
            "maxUses": 0,
            "note": ""
          }
        },
        {
          "id": "core-n-jackal-pierce",
          "cost": 2,
          "minLevel": 3,
          "requires": [
            "core-n-jackal-aim"
          ],
          "skill": {
            "id": "core-s-jackal-pierce",
            "name": "徹甲弾",
            "trigger": "before_attack",
            "effect": "def_pierce_pct",
            "value": 30,
            "chance": 100,
            "maxUses": 0,
            "note": ""
          }
        },
        {
          "id": "core-n-jackal-lead",
          "cost": 2,
          "minLevel": 5,
          "requires": [
            "core-n-jackal-aim"
          ],
          "skill": {
            "id": "core-s-jackal-lead",
            "name": "号令",
            "trigger": "battle_start",
            "effect": "atk_up_pct",
            "value": 10,
            "chance": 100,
            "maxUses": 1,
            "note": "",
            "target": "allies",
            "duration": 3
          }
        }
      ],
      "noFire": true
    },
    {
      "id": "core-u-tiger",
      "name": "タイガー",
      "role": "突撃兵",
      "mark": "TGR",
      "pilot": "",
      "tags": [
        "歩兵",
        "生身"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "hp": 3300,
      "atk": 550,
      "def": 0,
      "mob": 450,
      "acc": 470,
      "skills": [
        {
          "id": "core-s-tiger-rage",
          "name": "闘志",
          "trigger": "after_damaged",
          "effect": "atk_up_pct",
          "value": 10,
          "chance": 50,
          "maxUses": 0,
          "note": "",
          "duration": 2
        }
      ],
      "weapons": [
        {
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 90,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 2,
          "hitsMax": 5,
          "hitPowerPct": 20,
          "name": "サブマシンガン"
        },
        {
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
          "hitPowerPct": 80,
          "name": "グレネード",
          "usesPerBattle": 2,
          "fxColor": "#ff9a3c"
        }
      ]
    },
    {
      "id": "core-u-fox",
      "name": "フォックス",
      "role": "偵察兵",
      "mark": "FOX",
      "pilot": "",
      "tags": [
        "歩兵",
        "生身",
        "偵察"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "hp": 2800,
      "atk": 460,
      "def": 0,
      "mob": 600,
      "acc": 500,
      "skills": [
        {
          "id": "core-s-fox-evade",
          "name": "緊急回避",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 10,
          "chance": 20,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "core-s-fox-counter",
          "name": "見切り",
          "trigger": "on_evade",
          "effect": "counter",
          "value": 70,
          "chance": 50,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 50,
          "hitsMin": 1,
          "hitsMax": 4,
          "hitPowerPct": 25,
          "name": "E90"
        },
        {
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 90,
          "accuracyPt": 15,
          "critPt": 5,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 45,
          "name": "ドレインブレード",
          "fxColor": "#ff4f6d",
          "effects": [
            {
              "timing": "after",
              "effect": "drain_pct",
              "value": 30
            }
          ]
        }
      ]
    },
    {
      "id": "core-u-turtle",
      "name": "タートル",
      "role": "重装兵",
      "mark": "TRT",
      "pilot": "",
      "tags": [
        "歩兵",
        "生身"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "hp": 3500,
      "atk": 580,
      "def": 100,
      "mob": 350,
      "acc": 500,
      "skills": [
        {
          "id": "core-s-turtle-guard",
          "name": "緊急防御",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 10,
          "chance": 25,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "core-s-turtle-taunt",
          "name": "仁王立ち",
          "trigger": "battle_start",
          "effect": "taunt",
          "value": 100,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 90,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 2,
          "hitsMax": 5,
          "hitPowerPct": 20,
          "name": "サブマシンガン"
        },
        {
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 180,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.8,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "name": "アーマーブレイカー",
          "usesPerBattle": 3,
          "fxColor": "#ffb347",
          "effects": [
            {
              "timing": "before",
              "effect": "tag_damage_up_pct",
              "value": 30,
              "tag": "装甲車"
            },
            {
              "timing": "after",
              "effect": "def_down_pct",
              "value": 20,
              "when": "hit",
              "duration": 2
            }
          ]
        }
      ]
    },
    {
      "id": "core-u-mina",
      "name": "ミナ",
      "role": "衛生兵",
      "mark": "MIN",
      "pilot": "",
      "tags": [
        "歩兵",
        "生身",
        "衛生兵"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "hp": 2900,
      "atk": 420,
      "def": 0,
      "mob": 520,
      "acc": 520,
      "skills": [
        {
          "id": "core-s-mina-aid",
          "name": "応急手当",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 12,
          "chance": 100,
          "maxUses": 0,
          "note": "",
          "target": "weakest_ally"
        }
      ],
      "weapons": [
        {
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 90,
          "accuracyPt": 10,
          "critPt": 5,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 60,
          "name": "ハンドガン"
        }
      ],
      "row": "back"
    },
    {
      "id": "core-u-kai",
      "name": "カイ",
      "role": "パイロット",
      "mark": "KAI",
      "pilot": "",
      "tags": [
        "歩兵",
        "生身",
        "パイロット"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "hp": 2600,
      "atk": 450,
      "def": 0,
      "mob": 560,
      "acc": 580,
      "skills": [],
      "weapons": [
        {
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 90,
          "accuracyPt": 10,
          "critPt": 5,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 60,
          "name": "ハンドガン"
        }
      ],
      "crew": "none",
      "row": "back",
      "pilotProfile": {
        "stats": {
          "acc": 40,
          "mob": 20
        },
        "aptitude": {
          "tags": [
            "機動兵器"
          ],
          "pct": 15
        },
        "skills": [
          {
            "id": "core-s-kai-focus",
            "name": "集中",
            "trigger": "on_crit",
            "effect": "extra_action",
            "value": 0,
            "chance": 100,
            "maxUses": 1,
            "note": ""
          }
        ],
        "growthPct": 3
      }
    },
    {
      "id": "core-u-strider",
      "name": "ストライダー",
      "role": "機動兵器",
      "mark": "STR",
      "pilot": "",
      "tags": [
        "機動兵器",
        "機械"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "hp": 6000,
      "atk": 700,
      "def": 200,
      "mob": 550,
      "acc": 520,
      "skills": [],
      "weapons": [
        {
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 15,
          "critPt": 5,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 70,
          "name": "ビームライフル",
          "fxColor": "#5ad8ff"
        },
        {
          "attackType": "melee",
          "damageType": "special",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 50,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 60,
          "name": "ショックランス",
          "fxColor": "#c9a0ff",
          "effects": [
            {
              "timing": "after",
              "effect": "stun",
              "value": 0,
              "when": "hit",
              "chance": 30
            }
          ]
        }
      ],
      "crew": "required",
      "sortieCost": 120
    },
    {
      "id": "core-u-truck",
      "name": "輸送車",
      "role": "非戦闘員",
      "mark": "TRK",
      "pilot": "",
      "tags": [
        "車両",
        "機械",
        "要人"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": false
      },
      "hp": 5000,
      "atk": 0,
      "def": 150,
      "mob": 300,
      "acc": 300,
      "skills": [],
      "weapons": [
        {
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 30,
          "accuracyPt": 10,
          "critPt": 5,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 60,
          "name": "自衛火器"
        }
      ]
    },
    {
      "id": "core-u-rin",
      "name": "リン",
      "role": "パイロット",
      "mark": "RIN",
      "pilot": "",
      "tags": [
        "歩兵",
        "生身",
        "パイロット"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "hp": 2800,
      "atk": 430,
      "def": 0,
      "mob": 620,
      "acc": 540,
      "skills": [],
      "weapons": [
        {
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 80,
          "accuracyPt": 20,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 45,
          "name": "ナイフ"
        },
        {
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 90,
          "accuracyPt": 10,
          "critPt": 5,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 60,
          "name": "ハンドガン"
        }
      ],
      "crew": "none",
      "pilotProfile": {
        "stats": {
          "mob": 40,
          "def": 30
        },
        "skills": [
          {
            "id": "core-s-rin-dodge",
            "name": "回避運動",
            "trigger": "when_targeted",
            "effect": "enemy_hit_down_pt",
            "value": 10,
            "chance": 100,
            "maxUses": 0,
            "note": ""
          }
        ],
        "growthPct": 2
      },
      "recruit": {
        "locked": true,
        "missionId": "core-m-03",
        "note": "「輸送車護衛」をクリアすると加入"
      }
    },
    {
      "id": "core-u-guardian",
      "name": "ガーディアン",
      "role": "重装機",
      "mark": "GRD",
      "pilot": "",
      "tags": [
        "機動兵器",
        "機械",
        "装甲車"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "hp": 8000,
      "atk": 650,
      "def": 350,
      "mob": 420,
      "acc": 500,
      "skills": [
        {
          "id": "core-s-guardian-wall",
          "name": "鉄壁",
          "trigger": "when_targeted",
          "effect": "weapon_resist_pct",
          "value": 25,
          "chance": 100,
          "maxUses": 0,
          "note": "",
          "resistType": "physical"
        }
      ],
      "weapons": [
        {
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 50,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 30,
          "name": "機関砲"
        },
        {
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.7,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "name": "チャージ砲",
          "cooldown": 1,
          "fxColor": "#7fd6ff",
          "effects": [
            {
              "timing": "before",
              "effect": "atk_up_pct",
              "value": 30,
              "duration": 1
            },
            {
              "timing": "after",
              "effect": "recoil_pct",
              "value": 5
            }
          ]
        }
      ],
      "crew": "required",
      "recruit": {
        "locked": true,
        "note": "研究「重装機ガーディアン配備」で加入"
      },
      "sortieCost": 200
    },
    {
      "id": "core-e-trooper",
      "name": "敵歩兵",
      "role": "歩兵",
      "mark": "ETR",
      "pilot": "",
      "tags": [
        "歩兵",
        "生身"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "hp": 3000,
      "atk": 500,
      "def": 0,
      "mob": 500,
      "acc": 500,
      "skills": [],
      "weapons": [
        {
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 50,
          "hitsMin": 1,
          "hitsMax": 4,
          "hitPowerPct": 25,
          "name": "E90"
        }
      ]
    },
    {
      "id": "core-e-raider",
      "name": "敵突撃兵",
      "role": "突撃兵",
      "mark": "ERD",
      "pilot": "",
      "tags": [
        "歩兵",
        "生身"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "hp": 3200,
      "atk": 540,
      "def": 20,
      "mob": 540,
      "acc": 480,
      "skills": [],
      "weapons": [
        {
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 80,
          "accuracyPt": 20,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 45,
          "name": "ナイフ"
        },
        {
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 90,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 2,
          "hitsMax": 5,
          "hitPowerPct": 20,
          "name": "サブマシンガン"
        }
      ]
    },
    {
      "id": "core-e-sniper",
      "name": "敵狙撃兵",
      "role": "狙撃兵",
      "mark": "ESN",
      "pilot": "",
      "tags": [
        "歩兵",
        "生身"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "hp": 2600,
      "atk": 600,
      "def": 0,
      "mob": 480,
      "acc": 650,
      "skills": [],
      "weapons": [
        {
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 160,
          "accuracyPt": 25,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "name": "狙撃銃"
        }
      ],
      "row": "back",
      "ai": {
        "target": "lowest_hp"
      }
    },
    {
      "id": "core-e-apc",
      "name": "敵装甲車",
      "role": "装甲車",
      "mark": "EAP",
      "pilot": "",
      "tags": [
        "装甲車",
        "機械"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "hp": 7000,
      "atk": 600,
      "def": 300,
      "mob": 350,
      "acc": 480,
      "skills": [
        {
          "id": "core-s-apc-guard",
          "name": "装甲",
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
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 50,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 30,
          "name": "機関砲"
        },
        {
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 90,
          "accuracyPt": 0,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.6,
          "minDamage": 40,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 70,
          "name": "ナパーム弾",
          "usesPerBattle": 2,
          "fxColor": "#ff6a2a",
          "effects": [
            {
              "timing": "after",
              "effect": "burn",
              "value": 80,
              "when": "hit",
              "duration": 3
            }
          ]
        }
      ]
    },
    {
      "id": "core-e-mech",
      "name": "敵機動兵器",
      "role": "機動兵器",
      "mark": "EMC",
      "pilot": "",
      "tags": [
        "機動兵器",
        "機械"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "hp": 6500,
      "atk": 680,
      "def": 200,
      "mob": 500,
      "acc": 520,
      "skills": [],
      "weapons": [
        {
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 15,
          "critPt": 5,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 70,
          "name": "ビームライフル",
          "fxColor": "#5ad8ff"
        },
        {
          "attackType": "melee",
          "damageType": "special",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 50,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 60,
          "name": "ショックランス",
          "fxColor": "#c9a0ff",
          "effects": [
            {
              "timing": "after",
              "effect": "stun",
              "value": 0,
              "when": "hit",
              "chance": 30
            }
          ]
        }
      ],
      "crew": "required"
    },
    {
      "id": "core-e-commander",
      "name": "敵指揮官機",
      "role": "指揮官機",
      "mark": "CMD",
      "pilot": "",
      "tags": [
        "機動兵器",
        "機械",
        "指揮官"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "hp": 12000,
      "atk": 820,
      "def": 250,
      "mob": 520,
      "acc": 600,
      "skills": [
        {
          "id": "core-s-cmd-barrier",
          "name": "防御フィールド",
          "trigger": "battle_start",
          "effect": "shield",
          "value": 1500,
          "chance": 100,
          "maxUses": 1,
          "note": ""
        },
        {
          "id": "core-s-cmd-rage",
          "name": "激昂",
          "trigger": "turn_start",
          "effect": "atk_up_pct",
          "value": 20,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "duration": 99,
          "cond": {
            "type": "hp_below",
            "value": 50
          }
        }
      ],
      "weapons": [
        {
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 15,
          "critPt": 5,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 70,
          "name": "ビームライフル",
          "fxColor": "#5ad8ff"
        },
        {
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 4,
          "weight": 1,
          "minDamage": 40,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 60,
          "name": "ミサイル",
          "usesPerBattle": 3,
          "fxColor": "#ff4fd8"
        },
        {
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.7,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "name": "チャージ砲",
          "cooldown": 1,
          "fxColor": "#7fd6ff",
          "effects": [
            {
              "timing": "before",
              "effect": "atk_up_pct",
              "value": 30,
              "duration": 1
            },
            {
              "timing": "after",
              "effect": "recoil_pct",
              "value": 5
            }
          ]
        }
      ],
      "row": "back",
      "exp": 400
    }
  ],
  "hires": [
    {
      "id": "core-h-tiger",
      "unitId": "core-u-tiger",
      "cost": 1200,
      "note": "頼れる突撃兵。何人いても困らない。"
    },
    {
      "id": "core-h-mina",
      "unitId": "core-u-mina",
      "cost": 1500,
      "limit": 3,
      "note": "後方から支援する衛生兵。"
    },
    {
      "id": "core-h-fox",
      "unitId": "core-u-fox",
      "cost": 1800,
      "requires": {
        "missions": [
          "core-m-02"
        ]
      },
      "note": "「防衛線維持」をクリアすると雇える狙撃兵。"
    },
    {
      "id": "core-h-strider",
      "unitId": "core-u-strider",
      "cost": 2600,
      "limit": 2,
      "requires": {
        "research": [
          "core-r-shop"
        ]
      },
      "hidden": true,
      "note": "研究「新装備の開発」で配備できる機動兵器。パイロットが必要。"
    }
  ]
};
