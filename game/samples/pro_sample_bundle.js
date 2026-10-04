/* PRO data pack */
window.VAIS_BUNDLE_PACK = {
  "format": "VAIS_OUTER_OPS_BUNDLE_PACK",
  "schemaVersion": 1,
  "packId": "pack-0000",
  "packName": "テスト統合パック",
  "units": [
    {
      "id": "unit-0001",
      "name": "ジャッカル",
      "role": "歩兵",
      "pilot": "",
      "mark": "I",
      "tags": [
        "歩兵",
        "生身"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [],
      "weapons": [
        {
          "name": "E90",
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
          "hitPowerPct": 25
        },
        {
          "name": "ナイフ",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 75,
          "accuracyPt": 20,
          "critPt": 5,
          "targetCount": 1,
          "weight": 0.75,
          "minDamage": 25,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 3000,
      "atk": 500,
      "def": 0,
      "mob": 500,
      "acc": 500
    },
    {
      "id": "unit-0002",
      "name": "タイガー",
      "role": "歩兵",
      "pilot": "",
      "mark": "I",
      "tags": [
        "歩兵",
        "生身"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [],
      "weapons": [
        {
          "name": "E90",
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
          "hitPowerPct": 25
        },
        {
          "name": "ナイフ",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 75,
          "accuracyPt": 20,
          "critPt": 5,
          "targetCount": 1,
          "weight": 0.75,
          "minDamage": 25,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 3300,
      "atk": 550,
      "def": 0,
      "mob": 450,
      "acc": 470
    },
    {
      "id": "unit-0000-e",
      "name": "敵歩兵",
      "role": "歩兵",
      "pilot": "",
      "mark": "I",
      "tags": [
        "歩兵",
        "生身"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [],
      "weapons": [
        {
          "name": "E90",
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
          "hitPowerPct": 25
        },
        {
          "name": "ナイフ",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 75,
          "accuracyPt": 20,
          "critPt": 5,
          "targetCount": 1,
          "weight": 0.75,
          "minDamage": 25,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 3000,
      "atk": 500,
      "def": 0,
      "mob": 500,
      "acc": 500
    },
    {
      "id": "unit-0003",
      "name": "フォックス",
      "role": "歩兵",
      "pilot": "",
      "mark": "I",
      "tags": [
        "歩兵",
        "生身"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "s-0001",
          "name": "緊急回避",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 10,
          "chance": 20,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "E90",
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
          "hitPowerPct": 25
        },
        {
          "name": "ナイフ",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 75,
          "accuracyPt": 20,
          "critPt": 5,
          "targetCount": 1,
          "weight": 0.75,
          "minDamage": 25,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 2800,
      "atk": 460,
      "def": 0,
      "mob": 600,
      "acc": 500
    },
    {
      "id": "unit-0004",
      "name": "タートル",
      "role": "歩兵",
      "pilot": "",
      "mark": "I",
      "tags": [
        "歩兵",
        "生身"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "s-0002",
          "name": "緊急防御",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 10,
          "chance": 25,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "E90",
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
          "hitPowerPct": 25
        },
        {
          "name": "ナイフ",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 75,
          "accuracyPt": 20,
          "critPt": 5,
          "targetCount": 1,
          "weight": 0.75,
          "minDamage": 25,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 3500,
      "atk": 580,
      "def": 100,
      "mob": 350,
      "acc": 500
    }
  ],
  "missions": [
    {
      "id": "mission-0001",
      "name": "敵哨戒撃破1",
      "diff": "E",
      "reward": 1000,
      "desc": "敵の哨戒部隊を撃破せよ。",
      "terrain": "標準",
      "tags": [],
      "rules": [],
      "enemies": [
        "unit-0000-e",
        "unit-0000-e"
      ],
      "maxDeploy": 8,
      "drops": [
        {
          "itemId": "item-0001",
          "chance": 50,
          "min": 1,
          "max": 1
        }
      ]
    }
  ],
  "items": [
    {
      "id": "item-0001",
      "name": "医療キット",
      "desc": "負傷した兵士の手当てをするキット。体力を回復する。",
      "requires": {
        "allTags": [
          "生身"
        ]
      },
      "effect": {
        "type": "heal_hp_flat",
        "value": 1500
      }
    }
  ]
};
