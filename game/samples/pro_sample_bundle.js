/* PRO 1.13.1 基本データ — Unit Schema 6 / Mission Schema 4 / Item Schema 5 / Bundle Schema 6。 */
window.VAIS_BUNDLE_PACK = {
  "format": "VAIS_OUTER_OPS_BUNDLE_PACK",
  "schemaVersion": 6,
  "packId": "pro-core",
  "packName": "基本データ",
  "units": [
    {
      "id": "core-u-jackal",
      "name": "ジャッカル",
      "role": "歩兵",
      "mark": "JCK",
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
      "noFire": true,
      "equipSlots": 2
    },
    {
      "id": "core-u-tiger",
      "name": "タイガー",
      "role": "突撃兵",
      "mark": "TGR",
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
      ],
      "equipSlots": 2
    },
    {
      "id": "core-u-fox",
      "name": "フォックス",
      "role": "偵察兵",
      "mark": "FOX",
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
      ],
      "equipSlots": 2
    },
    {
      "id": "core-u-turtle",
      "name": "タートル",
      "role": "重装兵",
      "mark": "TRT",
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
      ],
      "equipSlots": 2
    },
    {
      "id": "core-u-mina",
      "name": "ミナ",
      "role": "衛生兵",
      "mark": "MIN",
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
      "row": "back",
      "equipSlots": 2
    },
    {
      "id": "core-u-kai",
      "name": "カイ",
      "role": "パイロット",
      "mark": "KAI",
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
      },
      "equipSlots": 2
    },
    {
      "id": "core-u-strider",
      "name": "ストライダー",
      "role": "機動兵器",
      "mark": "STR",
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
      "sortieCost": 120,
      "equipSlots": 3
    },
    {
      "id": "core-u-truck",
      "name": "輸送車",
      "role": "非戦闘員",
      "mark": "TRK",
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
      ],
      "equipSlots": 0
    },
    {
      "id": "core-u-rin",
      "name": "リン",
      "role": "パイロット",
      "mark": "RIN",
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
      },
      "equipSlots": 2
    },
    {
      "id": "core-u-guardian",
      "name": "ガーディアン",
      "role": "重装機",
      "mark": "GRD",
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
      "sortieCost": 200,
      "equipSlots": 4
    },
    {
      "id": "core-e-trooper",
      "name": "敵歩兵",
      "role": "歩兵",
      "mark": "ETR",
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
      ],
      "equipSlots": 0
    },
    {
      "id": "core-e-raider",
      "name": "敵突撃兵",
      "role": "突撃兵",
      "mark": "ERD",
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
      ],
      "equipSlots": 0
    },
    {
      "id": "core-e-sniper",
      "name": "敵狙撃兵",
      "role": "狙撃兵",
      "mark": "ESN",
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
      },
      "equipSlots": 0
    },
    {
      "id": "core-e-apc",
      "name": "敵装甲車",
      "role": "装甲車",
      "mark": "EAP",
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
      ],
      "equipSlots": 0
    },
    {
      "id": "core-e-mech",
      "name": "敵機動兵器",
      "role": "機動兵器",
      "mark": "EMC",
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
      "crew": "required",
      "equipSlots": 0
    },
    {
      "id": "core-e-commander",
      "name": "敵指揮官機",
      "role": "指揮官機",
      "mark": "CMD",
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
      "exp": 400,
      "equipSlots": 0
    }
  ],
  "missions": [
    {
      "id": "core-m-01",
      "name": "演習：哨戒部隊撃破",
      "diff": "E",
      "reward": 1000,
      "desc": "敵の哨戒部隊を撃破せよ。ストライダーを使うなら「育成」でカイを搭乗させよう。",
      "terrain": "標準",
      "tags": [
        "チュートリアル"
      ],
      "rules": [],
      "enemies": [
        "core-e-trooper",
        "core-e-trooper"
      ],
      "maxDeploy": 4,
      "drops": [
        {
          "itemId": "core-i-medkit",
          "chance": 80,
          "min": 1,
          "max": 2
        },
        {
          "itemId": "core-i-crate",
          "chance": 30,
          "min": 1,
          "max": 1
        }
      ],
      "story": {
        "before": [
          {
            "speaker": "ジャッカル",
            "text": "哨戒部隊を叩く。まずは肩慣らしだ。"
          },
          {
            "speaker": "カイ",
            "text": "ストライダーは俺が乗らないと動かないぜ。育成画面で呼んでくれ。"
          }
        ],
        "after": [
          {
            "speaker": "ジャッカル",
            "text": "上出来だ。次は防衛線の応援に向かう。"
          }
        ]
      }
    },
    {
      "id": "core-m-02",
      "name": "防衛線維持",
      "diff": "D",
      "reward": 1800,
      "desc": "6TURNの間、防衛線を守り抜け。3TURN目に敵の援軍が来る。",
      "terrain": "森林",
      "tags": [],
      "objective": {
        "type": "defense",
        "turns": 6
      },
      "rules": [
        {
          "type": "reinforce",
          "turn": 3,
          "enemies": [
            "core-e-trooper",
            "core-e-sniper"
          ]
        }
      ],
      "enemies": [
        "core-e-trooper",
        "core-e-raider",
        "core-e-trooper"
      ],
      "maxDeploy": 5,
      "requires": {
        "missions": [
          "core-m-01"
        ]
      },
      "drops": [
        {
          "itemId": "core-i-keycard",
          "chance": 100,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "core-i-manual",
          "chance": 30,
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
          "type": "hp_ge",
          "value": 50
        }
      ],
      "story": {
        "before": [
          {
            "speaker": "ミナ",
            "text": "負傷者は私が手当てします。後ろは任せて！"
          }
        ],
        "after": [
          {
            "speaker": "ジャッカル",
            "text": "敵の基地のカードキーを拾った。いずれ使うことになりそうだ。"
          }
        ]
      }
    },
    {
      "id": "core-m-03",
      "name": "輸送車護衛",
      "diff": "D",
      "reward": 2000,
      "desc": "補給物資を積んだ輸送車を守れ。輸送車が撃破されると失敗。",
      "terrain": "市街地",
      "tags": [],
      "objective": {
        "type": "escort",
        "escortUnitId": "core-u-truck"
      },
      "rules": [],
      "enemies": [
        "core-e-raider",
        "core-e-raider",
        "core-e-sniper"
      ],
      "maxDeploy": 4,
      "requires": {
        "missions": [
          "core-m-01"
        ]
      },
      "drops": [
        {
          "itemId": "core-i-repair",
          "chance": 60,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "core-i-crate",
          "min": 1,
          "max": 1,
          "odds": [
            1,
            2
          ]
        }
      ],
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "turns_le",
          "value": 8
        },
        {
          "type": "no_loss"
        }
      ],
      "story": {
        "before": [
          {
            "speaker": "リン",
            "text": "輸送車の運転手のリンです。……私も機体に乗れます。無事に着いたら、手伝わせてください。"
          }
        ],
        "after": [
          {
            "speaker": "リン",
            "text": "約束通り、今日から部隊に加わります！"
          }
        ]
      }
    },
    {
      "id": "core-m-04",
      "name": "装甲部隊迎撃",
      "diff": "C",
      "reward": 3000,
      "desc": "敵装甲車を撃破せよ。装甲車を倒せば勝利。アーマーブレイカーが有効。",
      "terrain": "砂漠",
      "tags": [],
      "objective": {
        "type": "boss",
        "bossIndex": 0
      },
      "rules": [],
      "enemies": [
        "core-e-apc",
        "core-e-trooper",
        "core-e-trooper"
      ],
      "maxDeploy": 5,
      "requires": {
        "missions": [
          "core-m-02"
        ]
      },
      "drops": [
        {
          "itemId": "core-i-repair",
          "chance": 70,
          "min": 1,
          "max": 2
        },
        {
          "itemId": "core-i-spbook",
          "chance": 20,
          "min": 1,
          "max": 1
        }
      ],
      "story": {
        "before": [
          {
            "speaker": "タートル",
            "text": "装甲車は硬い。俺のアーマーブレイカーで装甲を剥がす。"
          }
        ],
        "after": []
      }
    },
    {
      "id": "core-m-05",
      "name": "敵基地強襲",
      "diff": "B",
      "reward": 4000,
      "desc": "夜間、敵基地に突入せよ。敵が残り1体になると守備隊本隊（後衛に狙撃兵）が出てくる。20TURN以内に制圧しないと失敗。",
      "terrain": "夜間",
      "tags": [],
      "waves": [
        {
          "enemies": [
            "core-e-raider",
            "core-e-sniper",
            "core-e-apc"
          ],
          "rows": [
            "front",
            "back",
            "front"
          ],
          "when": "remaining",
          "value": 1,
          "label": "守備隊本隊"
        }
      ],
      "rules": [
        {
          "type": "turn_limit",
          "value": 20
        }
      ],
      "enemies": [
        "core-e-trooper",
        "core-e-trooper",
        "core-e-raider"
      ],
      "maxDeploy": 6,
      "requires": {
        "missions": [
          "core-m-02"
        ],
        "items": [
          "core-i-keycard"
        ]
      },
      "starReward": 1000,
      "drops": [
        {
          "itemId": "core-i-spbook",
          "chance": 40,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "core-i-crate",
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
          "type": "turns_le",
          "value": 12
        },
        {
          "type": "hp_ge",
          "value": 40
        }
      ],
      "hidden": true
    },
    {
      "id": "core-m-06",
      "name": "決戦：指揮官機撃破",
      "diff": "A",
      "reward": 8000,
      "desc": "敵の前衛を崩すと、後方から指揮官機が出てくる。指揮官機を倒せば勝利。HPが半分になると親衛隊が駆けつける。",
      "terrain": "標準",
      "tags": [
        "ボス"
      ],
      "objective": {
        "type": "boss",
        "bossWave": 1,
        "bossIndex": 0
      },
      "rules": [],
      "enemies": [
        "core-e-raider",
        "core-e-trooper",
        "core-e-sniper"
      ],
      "enemyRows": [
        "front",
        "front",
        "back"
      ],
      "maxDeploy": 6,
      "requires": {
        "missions": [
          "core-m-04",
          "core-m-05"
        ],
        "minLevel": 3
      },
      "drops": [
        {
          "itemId": "core-i-spbook",
          "chance": 100,
          "min": 1,
          "max": 1
        }
      ],
      "story": {
        "before": [
          {
            "speaker": "ジャッカル",
            "text": "これが最後の戦いだ。全員、生きて帰るぞ。"
          }
        ],
        "after": [
          {
            "speaker": "カイ",
            "text": "やったな……！"
          },
          {
            "speaker": "ジャッカル",
            "text": "ああ。全員よくやった。"
          }
        ]
      },
      "waves": [
        {
          "enemies": [
            "core-e-commander",
            "core-e-trooper"
          ],
          "rows": [
            "back",
            "front"
          ],
          "when": "remaining",
          "value": 2,
          "label": "指揮官部隊"
        },
        {
          "enemies": [
            "core-e-raider",
            "core-e-raider"
          ],
          "when": "bossHp",
          "value": 50,
          "label": "親衛隊"
        }
      ],
      "hidden": true
    },
    {
      "id": "core-m-07",
      "name": "週末特別演習",
      "diff": "D",
      "reward": 1200,
      "desc": "土日だけの特別演習。経験値が多くもらえる。",
      "terrain": "標準",
      "tags": [
        "曜日限定"
      ],
      "days": [
        0,
        6
      ],
      "exp": 150,
      "rules": [],
      "enemies": [
        "core-e-trooper",
        "core-e-raider",
        "core-e-trooper"
      ],
      "maxDeploy": 4,
      "requires": {
        "missions": [
          "core-m-01"
        ]
      },
      "drops": [
        {
          "itemId": "core-i-manual",
          "min": 1,
          "max": 1,
          "odds": [
            1,
            2
          ]
        }
      ]
    }
  ],
  "items": [
    {
      "id": "core-i-medkit",
      "name": "医療キット",
      "desc": "生身のユニットのHPを1500回復する。",
      "requires": {
        "allTags": [
          "生身"
        ]
      },
      "effect": {
        "type": "heal_hp_flat",
        "value": 1500
      },
      "price": 300
    },
    {
      "id": "core-i-repair",
      "name": "修理キット",
      "desc": "生身以外のユニットのHPを最大HPの50%回復する。",
      "requires": {
        "noneTags": [
          "生身"
        ]
      },
      "effect": {
        "type": "heal_hp_pct",
        "value": 50
      },
      "price": 500
    },
    {
      "id": "core-i-ration",
      "name": "特製レーション",
      "desc": "部隊全員、次の出撃だけATK+15%。",
      "effect": {
        "type": "sortie_buff",
        "stat": "atk",
        "value": 15
      },
      "price": 800,
      "scope": "party"
    },
    {
      "id": "core-i-manual",
      "name": "戦術教本",
      "desc": "経験値+150。",
      "effect": {
        "type": "exp_gain",
        "value": 150
      },
      "price": 1000
    },
    {
      "id": "core-i-spbook",
      "name": "技能書",
      "desc": "スキルポイント+1。1体3回まで。",
      "effect": {
        "type": "skill_point",
        "value": 1
      },
      "price": 2000,
      "limitPerUnit": 3
    },
    {
      "id": "core-i-scope",
      "name": "照準器",
      "desc": "装備するとACC+40。",
      "price": 1500,
      "equip": {
        "slot": "accessory",
        "stats": {
          "acc": 40
        },
        "skills": [],
        "weapons": []
      }
    },
    {
      "id": "core-i-armor",
      "name": "増加装甲",
      "desc": "装備するとDEF+60・最大HP+300。",
      "price": 1800,
      "equip": {
        "slot": "accessory",
        "stats": {
          "hp": 300,
          "def": 60
        },
        "skills": [],
        "weapons": []
      },
      "shop": {
        "requiresResearch": "core-r-shop"
      }
    },
    {
      "id": "core-i-weaponkit",
      "name": "武装キット：チャージ砲",
      "desc": "撃つ前にATKが上がる武装「チャージ砲」を追加する。",
      "effect": {
        "type": "add_weapon",
        "weapon": {
          "name": "チャージ砲",
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
      },
      "price": 2500,
      "shop": {
        "requiresResearch": "core-r-shop"
      }
    },
    {
      "id": "core-i-keycard",
      "name": "基地カードキー",
      "desc": "「敵基地強襲」に必要。",
      "key": true
    },
    {
      "id": "core-i-crate",
      "name": "補給コンテナ",
      "desc": "中身は開けてのお楽しみ。",
      "effect": {
        "type": "loot_box",
        "table": [
          {
            "itemId": "core-i-medkit",
            "weight": 5,
            "min": 1,
            "max": 2
          },
          {
            "itemId": "core-i-repair",
            "weight": 3,
            "min": 1,
            "max": 1
          },
          {
            "itemId": "core-i-manual",
            "weight": 2,
            "min": 1,
            "max": 1
          },
          {
            "itemId": "core-i-scope",
            "weight": 1,
            "min": 1,
            "max": 1
          }
        ]
      }
    },
    {
      "id": "core-i-rack",
      "name": "拡張装備ラック",
      "desc": "使ったユニットの装備枠を1つ増やす（最大8枠）。",
      "effect": {
        "type": "equip_slot",
        "value": 1
      },
      "price": 2500,
      "shop": {
        "requiresResearch": "core-r-shop"
      }
    },
    {
      "id": "core-i-fantasy-armor",
      "name": "幻想防護装甲",
      "desc": "装備中、幻想属性の攻撃によるダメージを20%減らす。DEF+40。",
      "requires": {
        "noneTags": [
          "生身"
        ]
      },
      "price": 2400,
      "shop": {
        "requiresResearch": "core-r-shop"
      },
      "equip": {
        "slot": "accessory",
        "stats": {
          "def": 40
        },
        "skills": [
          {
            "id": "core-s-fantasy-resist",
            "name": "幻想耐性",
            "trigger": "when_targeted",
            "effect": "weapon_resist_pct",
            "resistType": "fantasy",
            "value": 20,
            "chance": 100,
            "maxUses": 0,
            "note": ""
          }
        ],
        "weapons": []
      }
    }
  ],
  "research": [
    {
      "id": "core-r-shop",
      "name": "新装備の開発",
      "desc": "増加装甲・チャージ砲の武装キット・拡張装備ラック・幻想防護装甲がショップに並ぶ。ストライダーの追加雇用も解放される。",
      "cost": {
        "credits": 2000,
        "items": {}
      },
      "requires": [],
      "unlock": {
        "units": [],
        "items": [
          "core-i-armor",
          "core-i-weaponkit",
          "core-i-rack",
          "core-i-fantasy-armor"
        ],
        "grantItems": {}
      }
    },
    {
      "id": "core-r-guardian",
      "name": "重装機ガーディアン配備",
      "desc": "パイロットが必要な重装機ガーディアンが加入する。",
      "cost": {
        "credits": 5000,
        "items": {
          "core-i-manual": 1
        }
      },
      "requires": [
        "core-r-shop"
      ],
      "unlock": {
        "units": [
          "core-u-guardian"
        ],
        "items": [],
        "grantItems": {
          "core-i-repair": 2
        }
      },
      "hidden": true
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
