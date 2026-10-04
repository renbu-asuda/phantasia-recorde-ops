/* PRO data pack — 1.10.1 武装の追加効果サンプル（統合パック Bundle Schema 2）
 * ゲームの「データ管理 → 統合JSを読み込む」で読み込むと、武装の追加効果（使用前・使用後）を試せます。
 * チャージ砲（使用前ATK+30%・使用後に反動）／アーマーブレイカー（命中でDEF低下）／ショックランス（スタン）／
 * ドレインブレード（HP吸収）／集中狙撃銃（撃破で再行動）／指揮用信号弾（味方全体ACC+）／ナパーム弾（炎上・敵が使用）。 */
window.VAIS_BUNDLE_PACK = {
  "format": "VAIS_OUTER_OPS_BUNDLE_PACK",
  "schemaVersion": 2,
  "packId": "pro_1101_weapon_effects_sample",
  "packName": "1.10.1 武装の追加効果サンプル",
  "units": [
    {
      "id": "fx-u-breaker",
      "name": "ガロ",
      "role": "重装兵",
      "mark": "GAR",
      "tags": [
        "歩兵",
        "生身"
      ],
      "hp": 4400,
      "atk": 580,
      "def": 150,
      "mob": 400,
      "acc": 500,
      "skills": [],
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
      "deploy": {
        "player": true,
        "enemy": false
      }
    },
    {
      "id": "fx-u-lancer",
      "name": "シオン",
      "role": "突撃兵",
      "mark": "SIO",
      "tags": [
        "歩兵",
        "生身"
      ],
      "hp": 3400,
      "atk": 580,
      "def": 40,
      "mob": 600,
      "acc": 520,
      "skills": [],
      "weapons": [
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
      "deploy": {
        "player": true,
        "enemy": false
      }
    },
    {
      "id": "fx-u-charger",
      "name": "ユウ",
      "role": "砲撃手",
      "mark": "YUU",
      "tags": [
        "歩兵",
        "生身"
      ],
      "hp": 2900,
      "atk": 620,
      "def": 0,
      "mob": 480,
      "acc": 560,
      "skills": [],
      "weapons": [
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
      "deploy": {
        "player": true,
        "enemy": false
      },
      "row": "back"
    },
    {
      "id": "fx-u-signal",
      "name": "ノア",
      "role": "指揮官",
      "mark": "NOA",
      "tags": [
        "歩兵",
        "生身",
        "隊長"
      ],
      "hp": 3000,
      "atk": 520,
      "def": 20,
      "mob": 520,
      "acc": 620,
      "skills": [],
      "weapons": [
        {
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 15,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "name": "集中狙撃銃",
          "fxColor": "#e8f06a",
          "effects": [
            {
              "timing": "before",
              "effect": "hit_up_pt",
              "value": 20
            },
            {
              "timing": "before",
              "effect": "crit_up_pt",
              "value": 10
            },
            {
              "timing": "after",
              "effect": "extra_action",
              "value": 0,
              "when": "kill"
            }
          ]
        },
        {
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 60,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.5,
          "minDamage": 30,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "name": "指揮用信号弾",
          "cooldown": 2,
          "fxColor": "#9cff6a",
          "effects": [
            {
              "timing": "after",
              "effect": "acc_up_pct",
              "value": 15,
              "target": "allies",
              "duration": 2
            }
          ]
        }
      ],
      "deploy": {
        "player": true,
        "enemy": false
      },
      "row": "back",
      "ai": {
        "target": "lowest_hp"
      }
    },
    {
      "id": "fx-e-trooper",
      "name": "敵歩兵",
      "role": "歩兵",
      "mark": "ETR",
      "tags": [
        "歩兵",
        "生身"
      ],
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
          "name": "アサルトライフル"
        }
      ],
      "deploy": {
        "player": false,
        "enemy": true
      }
    },
    {
      "id": "fx-e-apc",
      "name": "敵装甲車",
      "role": "装甲車",
      "mark": "EAP",
      "tags": [
        "装甲車",
        "機械"
      ],
      "hp": 7000,
      "atk": 600,
      "def": 300,
      "mob": 350,
      "acc": 480,
      "skills": [],
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
      "deploy": {
        "player": false,
        "enemy": true
      }
    }
  ],
  "missions": [
    {
      "id": "fx-m-01",
      "name": "演習：追加効果テスト",
      "diff": "D",
      "reward": 1500,
      "desc": "武装の追加効果（使用前・使用後）を試す演習。装甲車にはアーマーブレイカーが効く。",
      "enemies": [
        "fx-e-trooper",
        "fx-e-apc",
        "fx-e-trooper"
      ],
      "maxDeploy": 4,
      "rules": [],
      "drops": [
        {
          "itemId": "fx-i-kit",
          "chance": 100,
          "min": 1,
          "max": 1
        }
      ]
    }
  ],
  "items": [
    {
      "id": "fx-i-kit",
      "name": "武装キット：チャージ砲",
      "desc": "撃つ前にATKが上がる武装「チャージ砲」を追加する。",
      "effect": {
        "type": "add_weapon",
        "weapon": {
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
      }
    }
  ]
};
