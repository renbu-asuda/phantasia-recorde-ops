/* PRO data pack — 1.10.2 パイロット統合サンプル（統合パック Bundle Schema 3）
 * ゲームの「データ管理 → 統合JSを読み込む」で読み込むと、パイロットとユニットの統合を試せます。
 * ストライダー／ガーディアン＝パイロットが必要な機体。カイ／リン＝自分でも戦えるパイロット（機体に乗ると補正・スキル）。
 * ガント軍曹＝パイロット不要の生身ユニット。「育成」で機体を選び、パイロット欄でカイかリンを搭乗させてから出撃してください。 */
window.VAIS_BUNDLE_PACK = {
  "format": "VAIS_OUTER_OPS_BUNDLE_PACK",
  "schemaVersion": 3,
  "packId": "pro_1102_pilot_sample",
  "packName": "1.10.2 パイロット統合サンプル",
  "units": [
    {
      "id": "pl-m-strider",
      "name": "ストライダー",
      "role": "機動兵器",
      "mark": "STR",
      "tags": [
        "機動兵器",
        "機械"
      ],
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
      "deploy": {
        "player": true,
        "enemy": false
      },
      "crew": "required"
    },
    {
      "id": "pl-m-guardian",
      "name": "ガーディアン",
      "role": "重装機",
      "mark": "GRD",
      "tags": [
        "機動兵器",
        "機械",
        "装甲"
      ],
      "hp": 8000,
      "atk": 650,
      "def": 350,
      "mob": 420,
      "acc": 500,
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
      },
      "crew": "required"
    },
    {
      "id": "pl-p-kai",
      "name": "カイ",
      "role": "パイロット",
      "mark": "KAI",
      "tags": [
        "歩兵",
        "生身",
        "パイロット"
      ],
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
      "deploy": {
        "player": true,
        "enemy": false
      },
      "crew": "none",
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
            "id": "pl-s-kai-aim",
            "chance": 100,
            "maxUses": 0,
            "note": "",
            "name": "精密射撃",
            "trigger": "before_attack",
            "effect": "hit_up_pt",
            "value": 12
          }
        ],
        "growthPct": 3
      },
      "row": "back"
    },
    {
      "id": "pl-p-rin",
      "name": "リン",
      "role": "パイロット",
      "mark": "RIN",
      "tags": [
        "歩兵",
        "生身",
        "パイロット"
      ],
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
      "deploy": {
        "player": true,
        "enemy": false
      },
      "crew": "none",
      "pilotProfile": {
        "stats": {
          "mob": 40,
          "def": 30
        },
        "skills": [
          {
            "id": "pl-s-rin-dodge",
            "chance": 100,
            "maxUses": 0,
            "note": "",
            "name": "回避運動",
            "trigger": "when_targeted",
            "effect": "enemy_hit_down_pt",
            "value": 10
          }
        ],
        "growthPct": 2
      }
    },
    {
      "id": "pl-u-sgt",
      "name": "ガント軍曹",
      "role": "歩兵",
      "mark": "GNT",
      "tags": [
        "歩兵",
        "生身"
      ],
      "hp": 3400,
      "atk": 520,
      "def": 30,
      "mob": 500,
      "acc": 520,
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
      "deploy": {
        "player": true,
        "enemy": false
      },
      "crew": "none"
    },
    {
      "id": "pl-e-trooper",
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
      "id": "pl-e-mech",
      "name": "敵機動兵器",
      "role": "機動兵器",
      "mark": "EMC",
      "tags": [
        "機動兵器",
        "機械"
      ],
      "hp": 6500,
      "atk": 680,
      "def": 200,
      "mob": 500,
      "acc": 500,
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
        }
      ],
      "deploy": {
        "player": false,
        "enemy": true
      },
      "crew": "required"
    }
  ],
  "missions": [
    {
      "id": "pl-m-01",
      "name": "演習：機動兵器起動",
      "diff": "D",
      "reward": 1600,
      "desc": "機動兵器はパイロットを乗せないと出撃できない。「育成」でカイかリンを搭乗させてから出撃しよう。",
      "enemies": [
        "pl-e-trooper",
        "pl-e-mech",
        "pl-e-trooper"
      ],
      "maxDeploy": 4,
      "rules": [],
      "drops": []
    }
  ],
  "items": []
};
