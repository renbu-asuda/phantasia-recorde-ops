/* PRO data pack */
window.VAIS_BUNDLE_PACK = {
  "format": "VAIS_OUTER_OPS_BUNDLE_PACK",
  "schemaVersion": 1,
  "packId": "PR-01",
  "packName": "ファンタジア・レコードv1.0",
  "units": [
    {
      "id": "PR-01-U-0001",
      "name": "ブレン",
      "role": "歩兵",
      "pilot": "",
      "mark": "EX-S",
      "tags": [
        "生身",
        "エクスソルジャー",
        "ブレン"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "PR-01-S-0-00",
          "name": "超反応",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 999,
          "chance": 25,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "PR-01-S-0-01",
          "name": "再生力Lv5",
          "trigger": "turn_start",
          "effect": "heal_maxhp_pct",
          "value": 25,
          "chance": 40,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "格闘連撃",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 10,
          "critPt": 2,
          "targetCount": 1,
          "weight": 5,
          "minDamage": 0,
          "hitsMin": 4,
          "hitsMax": 4,
          "hitPowerPct": 38
        },
        {
          "name": "義手ビームサーベル",
          "attackType": "melee",
          "damageType": "beam",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 20,
          "critPt": 5,
          "targetCount": 1,
          "weight": 5,
          "minDamage": 0,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "義手ビームマシンガン",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 0,
          "critPt": 0,
          "targetCount": 1,
          "weight": 5,
          "minDamage": 0,
          "hitsMin": 3,
          "hitsMax": 5,
          "hitPowerPct": 25
        }
      ],
      "hp": 8000,
      "atk": 1300,
      "def": 150,
      "mob": 800,
      "acc": 750
    },
    {
      "id": "PR-01-U-0002",
      "name": "クリストフ",
      "role": "狙撃兵",
      "pilot": "",
      "mark": "EX-S",
      "tags": [
        "生身",
        "エクスソルジャー",
        "クリストフ"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "PR-01-S-1-00",
          "name": "超反応",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 999,
          "chance": 25,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "PR-01-S-1-01",
          "name": "再生力Lv5",
          "trigger": "turn_start",
          "effect": "heal_maxhp_pct",
          "value": 25,
          "chance": 40,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "PR-01-S-1-02",
          "name": "義眼狙撃演算",
          "trigger": "before_attack",
          "effect": "hit_up_pt",
          "value": 999,
          "chance": 40,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "護身ナイフ格闘",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 80,
          "accuracyPt": 10,
          "critPt": 2,
          "targetCount": 1,
          "weight": 2,
          "minDamage": 0,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "ブーステッドビームライフル",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 200,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 1,
          "weight": 5,
          "minDamage": 0,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "ビームサブマシンガン",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 0,
          "critPt": 0,
          "targetCount": 1,
          "weight": 4,
          "minDamage": 0,
          "hitsMin": 3,
          "hitsMax": 5,
          "hitPowerPct": 25
        }
      ],
      "hp": 6000,
      "atk": 1000,
      "def": 150,
      "mob": 700,
      "acc": 800
    },
    {
      "id": "PR-01-U-0003",
      "name": "勇平",
      "role": "歩兵",
      "pilot": "",
      "mark": "EX-S",
      "tags": [
        "生身",
        "エクスソルジャー",
        "勇平"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "PR-01-S-2-00",
          "name": "再生力Lv5",
          "trigger": "turn_start",
          "effect": "heal_maxhp_pct",
          "value": 25,
          "chance": 40,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "PR-01-S-2-01",
          "name": "筋肉ガード",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 20,
          "chance": 75,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "格闘",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 10,
          "critPt": 2,
          "targetCount": 1,
          "weight": 5,
          "minDamage": 0,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "マッスル・ブレイカー",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 200,
          "accuracyPt": 0,
          "critPt": 2,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 0,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 12000,
      "atk": 2000,
      "def": 200,
      "mob": 500,
      "acc": 500
    },
    {
      "id": "PR-01-U-0004",
      "name": "サラ",
      "role": "潜入兵",
      "pilot": "",
      "mark": "EX-S",
      "tags": [
        "生身",
        "エクスソルジャー",
        "サラ"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "PR-01-S-3-00",
          "name": "再生力Lv5",
          "trigger": "turn_start",
          "effect": "heal_maxhp_pct",
          "value": 25,
          "chance": 40,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "PR-01-S-3-01",
          "name": "光学迷彩「見えざる傘」",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 100,
          "chance": 35,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "PR-01-S-3-02",
          "name": "一撃暗殺",
          "trigger": "before_attack",
          "effect": "damage_up_pct",
          "value": 9999999,
          "chance": 5,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "ナイフ格闘",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 0,
          "critPt": 2,
          "targetCount": 1,
          "weight": 5,
          "minDamage": 0,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "投げナイフ",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 90,
          "accuracyPt": 0,
          "critPt": 2,
          "targetCount": 1,
          "weight": 5,
          "minDamage": 0,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "投げナイフ(バラマキ)",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 85,
          "accuracyPt": 0,
          "critPt": 2,
          "targetCount": 4,
          "weight": 3,
          "minDamage": 0,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 5000,
      "atk": 830,
      "def": 100,
      "mob": 950,
      "acc": 550
    },
    {
      "id": "PR-01-U-0005",
      "name": "エイジ",
      "role": "歩兵部隊長",
      "pilot": "",
      "mark": "EX-S",
      "tags": [
        "生身",
        "エクスソルジャー",
        "エイジ"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "PR-01-S-5-00",
          "name": "超反応",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 999,
          "chance": 25,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "PR-01-S-5-01",
          "name": "再生力Lv5",
          "trigger": "turn_start",
          "effect": "heal_maxhp_pct",
          "value": 25,
          "chance": 40,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "PR-01-S-5-02",
          "name": "戦術眼",
          "trigger": "before_attack",
          "effect": "crit_up_pt",
          "value": 999,
          "chance": 75,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "護身ナイフ格闘",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 80,
          "accuracyPt": 10,
          "critPt": 2,
          "targetCount": 1,
          "weight": 5,
          "minDamage": 0,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "ビームサブマシンガン",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 0,
          "critPt": 0,
          "targetCount": 1,
          "weight": 5,
          "minDamage": 0,
          "hitsMin": 3,
          "hitsMax": 5,
          "hitPowerPct": 25
        },
        {
          "name": "Tグレネードランチャー",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 0,
          "critPt": 5,
          "targetCount": 3,
          "weight": 3,
          "minDamage": 0,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 7000,
      "atk": 1100,
      "def": 150,
      "mob": 700,
      "acc": 700
    },
    {
      "id": "PR-01-U-0006-e",
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
          "name": "E90(単射)",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 5,
          "minDamage": 0,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "E90(三点バースト)",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 0,
          "critPt": 0,
          "targetCount": 1,
          "weight": 5,
          "minDamage": 0,
          "hitsMin": 3,
          "hitsMax": 3,
          "hitPowerPct": 40
        },
        {
          "name": "ナイフ",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 20,
          "critPt": 2,
          "targetCount": 1,
          "weight": 5,
          "minDamage": 0,
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
      "id": "PR-01-U-0007-e",
      "name": "敵歩兵長",
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
      "skills": [
        {
          "id": "PR-01-S-7-00",
          "name": "応急手当て",
          "trigger": "after_damaged",
          "effect": "heal_maxhp_pct",
          "value": 15,
          "chance": 45,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "E90(単射)",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 5,
          "minDamage": 0,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "E90(三点バースト)",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 0,
          "critPt": 0,
          "targetCount": 1,
          "weight": 5,
          "minDamage": 0,
          "hitsMin": 3,
          "hitsMax": 3,
          "hitPowerPct": 40
        },
        {
          "name": "ナイフ",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 20,
          "critPt": 2,
          "targetCount": 1,
          "weight": 5,
          "minDamage": 0,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 3300,
      "atk": 550,
      "def": 50,
      "mob": 550,
      "acc": 550
    },
    {
      "id": "PR-01-U-0008-e",
      "name": "RM-01A",
      "role": "装甲車",
      "pilot": "",
      "mark": "A-V",
      "tags": [
        "装甲車",
        "マシン"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [],
      "weapons": [
        {
          "name": "車体体当たり",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 2,
          "targetCount": 1,
          "weight": 3,
          "minDamage": 0,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "車載リニアマシンガン",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 0,
          "critPt": 0,
          "targetCount": 1,
          "weight": 5,
          "minDamage": 0,
          "hitsMin": 5,
          "hitsMax": 5,
          "hitPowerPct": 25
        }
      ],
      "hp": 5000,
      "atk": 550,
      "def": 150,
      "mob": 475,
      "acc": 500
    },
    {
      "id": "PR-01-U-0009-e",
      "name": "RM-01B",
      "role": "装甲車",
      "pilot": "",
      "mark": "A-V",
      "tags": [
        "装甲車",
        "マシン"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "PR-01-S-9-00",
          "name": "スモーク散布",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 5,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "車体体当たり",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 2,
          "targetCount": 1,
          "weight": 3,
          "minDamage": 0,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "車載リニアマシンガン",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 0,
          "critPt": 0,
          "targetCount": 1,
          "weight": 5,
          "minDamage": 0,
          "hitsMin": 5,
          "hitsMax": 5,
          "hitPowerPct": 25
        }
      ],
      "hp": 7000,
      "atk": 1100,
      "def": 200,
      "mob": 500,
      "acc": 550
    },
    {
      "id": "PR-01-U-0010-e",
      "name": "RD-01A",
      "role": "軽戦車",
      "pilot": "",
      "mark": "L-T",
      "tags": [
        "軽戦車",
        "マシン"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [],
      "weapons": [
        {
          "name": "車体体当たり",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 10,
          "critPt": 2,
          "targetCount": 1,
          "weight": 3,
          "minDamage": 0,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "車載リニアマシンガン",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 0,
          "critPt": 0,
          "targetCount": 1,
          "weight": 5,
          "minDamage": 0,
          "hitsMin": 5,
          "hitsMax": 5,
          "hitPowerPct": 25
        },
        {
          "name": "60mmリニアキャノン",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 0,
          "critPt": 0,
          "targetCount": 1,
          "weight": 4,
          "minDamage": 0,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 7000,
      "atk": 1300,
      "def": 300,
      "mob": 300,
      "acc": 450
    },
    {
      "id": "PR-01-U-0011-e",
      "name": "シャード",
      "role": "戦闘ヴァイス",
      "pilot": "",
      "mark": "VS",
      "tags": [
        "ヴァイス",
        "マシン"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "PR-01-S-11-00",
          "name": "光学迷彩「見えざる傘」",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 1000,
          "chance": 100,
          "maxUses": 1,
          "note": ""
        },
        {
          "id": "PR-01-S-11-01",
          "name": "魔導装甲(物理)",
          "trigger": "when_targeted",
          "effect": "weapon_resist_pct",
          "value": 20,
          "chance": 100,
          "maxUses": 0,
          "note": "",
          "resistType": "physical"
        },
        {
          "id": "PR-01-S-11-02",
          "name": "魔導装甲(ビーム)",
          "trigger": "when_targeted",
          "effect": "weapon_resist_pct",
          "value": 20,
          "chance": 100,
          "maxUses": 0,
          "note": "",
          "resistType": "beam"
        }
      ],
      "weapons": [
        {
          "name": "掌部マルチビームユニットサーベル",
          "attackType": "melee",
          "damageType": "beam",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 10,
          "critPt": 2,
          "targetCount": 1,
          "weight": 5,
          "minDamage": 0,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "掌部マルチビームユニットバルカン",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 0,
          "critPt": 0,
          "targetCount": 1,
          "weight": 5,
          "minDamage": 0,
          "hitsMin": 5,
          "hitsMax": 5,
          "hitPowerPct": 23
        },
        {
          "name": "尾部ブーステッドビームキャノン",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 1,
          "weight": 2,
          "minDamage": 0,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "大型反量子ミサイルランチャー",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 0,
          "accuracyPt": 0,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 999999,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 15000,
      "atk": 1500,
      "def": 350,
      "mob": 700,
      "acc": 700
    }
  ],
  "missions": [
    {
      "id": "PR-01-M-01",
      "name": "敵哨戒部隊撃破01",
      "diff": "E",
      "reward": 500,
      "desc": "敵の哨戒部隊を撃破せよ。",
      "terrain": "標準",
      "tags": [],
      "rules": [],
      "enemies": [
        "PR-01-U-0006-e",
        "PR-01-U-0006-e"
      ],
      "maxDeploy": 8,
      "drops": [
        {
          "itemId": "PR-01-I-0001",
          "chance": 50,
          "min": 1,
          "max": 1
        }
      ]
    },
    {
      "id": "PR-01-M-02",
      "name": "敵哨戒部隊撃破02",
      "diff": "E+",
      "reward": 1000,
      "desc": "敵の哨戒部隊を撃破せよ。",
      "terrain": "標準",
      "tags": [],
      "rules": [],
      "enemies": [
        "PR-01-U-0006-e",
        "PR-01-U-0006-e",
        "PR-01-U-0006-e",
        "PR-01-U-0006-e"
      ],
      "maxDeploy": 8,
      "drops": [
        {
          "itemId": "PR-01-I-0001",
          "chance": 50,
          "min": 1,
          "max": 2
        }
      ]
    },
    {
      "id": "PR-01-M-03",
      "name": "敵哨戒部隊撃破03",
      "diff": "D",
      "reward": 1500,
      "desc": "敵の哨戒部隊を撃破せよ。",
      "terrain": "標準",
      "tags": [],
      "rules": [],
      "enemies": [
        "PR-01-U-0006-e",
        "PR-01-U-0006-e",
        "PR-01-U-0006-e",
        "PR-01-U-0006-e",
        "PR-01-U-0007-e",
        "PR-01-U-0006-e"
      ],
      "maxDeploy": 8,
      "drops": [
        {
          "itemId": "PR-01-I-0001",
          "chance": 50,
          "min": 1,
          "max": 2
        },
        {
          "itemId": "PR-01-I-0002",
          "chance": 7,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0003",
          "chance": 7,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0004",
          "chance": 7,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0005",
          "chance": 7,
          "min": 1,
          "max": 1
        }
      ]
    },
    {
      "id": "PR-01-M-04",
      "name": "敵哨戒部隊撃破04",
      "diff": "D+",
      "reward": 1500,
      "desc": "敵の哨戒部隊を撃破せよ。",
      "terrain": "標準",
      "tags": [],
      "rules": [],
      "enemies": [
        "PR-01-U-0006-e",
        "PR-01-U-0006-e",
        "PR-01-U-0006-e",
        "PR-01-U-0006-e",
        "PR-01-U-0007-e",
        "PR-01-U-0006-e",
        "PR-01-U-0008-e"
      ],
      "maxDeploy": 8,
      "drops": [
        {
          "itemId": "PR-01-I-0001",
          "chance": 50,
          "min": 1,
          "max": 2
        },
        {
          "itemId": "PR-01-I-0002",
          "chance": 7,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0003",
          "chance": 7,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0004",
          "chance": 7,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0005",
          "chance": 7,
          "min": 1,
          "max": 1
        }
      ]
    },
    {
      "id": "PR-01-M-05",
      "name": "敵装甲部隊撃破01",
      "diff": "D+",
      "reward": 2000,
      "desc": "敵の装甲部隊を撃破せよ。",
      "terrain": "標準",
      "tags": [],
      "rules": [],
      "enemies": [
        "PR-01-U-0008-e",
        "PR-01-U-0008-e",
        "PR-01-U-0006-e",
        "PR-01-U-0006-e"
      ],
      "maxDeploy": 8,
      "drops": [
        {
          "itemId": "PR-01-I-0001",
          "chance": 50,
          "min": 1,
          "max": 2
        },
        {
          "itemId": "PR-01-I-0002",
          "chance": 7,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0003",
          "chance": 7,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0004",
          "chance": 7,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0005",
          "chance": 7,
          "min": 1,
          "max": 1
        }
      ]
    },
    {
      "id": "PR-01-M-06",
      "name": "敵装甲部隊撃破02",
      "diff": "C",
      "reward": 2500,
      "desc": "敵の装甲部隊を撃破せよ。",
      "terrain": "標準",
      "tags": [],
      "rules": [],
      "enemies": [
        "PR-01-U-0009-e",
        "PR-01-U-0008-e",
        "PR-01-U-0006-e",
        "PR-01-U-0006-e"
      ],
      "maxDeploy": 8,
      "drops": [
        {
          "itemId": "PR-01-I-0001",
          "chance": 50,
          "min": 1,
          "max": 2
        },
        {
          "itemId": "PR-01-I-0002",
          "chance": 7,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0003",
          "chance": 7,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0004",
          "chance": 7,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0005",
          "chance": 7,
          "min": 1,
          "max": 1
        }
      ]
    },
    {
      "id": "PR-01-M-07",
      "name": "敵機甲部隊撃破01",
      "diff": "C+",
      "reward": 3500,
      "desc": "敵の機甲部隊を撃破せよ。",
      "terrain": "標準",
      "tags": [],
      "rules": [],
      "enemies": [
        "PR-01-U-0006-e",
        "PR-01-U-0006-e",
        "PR-01-U-0006-e",
        "PR-01-U-0006-e",
        "PR-01-U-0010-e"
      ],
      "maxDeploy": 8,
      "drops": [
        {
          "itemId": "PR-01-I-0001",
          "chance": 70,
          "min": 2,
          "max": 4
        },
        {
          "itemId": "PR-01-I-0002",
          "chance": 14,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0003",
          "chance": 14,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0004",
          "chance": 14,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0005",
          "chance": 14,
          "min": 1,
          "max": 1
        }
      ]
    },
    {
      "id": "PR-01-M-08",
      "name": "敵機甲部隊撃破02",
      "diff": "B",
      "reward": 4200,
      "desc": "敵の機甲部隊を撃破せよ。",
      "terrain": "標準",
      "tags": [],
      "rules": [],
      "enemies": [
        "PR-01-U-0006-e",
        "PR-01-U-0006-e",
        "PR-01-U-0006-e",
        "PR-01-U-0006-e",
        "PR-01-U-0010-e",
        "PR-01-U-0009-e",
        "PR-01-U-0006-e",
        "PR-01-U-0006-e"
      ],
      "maxDeploy": 8,
      "drops": [
        {
          "itemId": "PR-01-I-0001",
          "chance": 70,
          "min": 2,
          "max": 4
        },
        {
          "itemId": "PR-01-I-0002",
          "chance": 14,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0003",
          "chance": 14,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0004",
          "chance": 14,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0005",
          "chance": 14,
          "min": 1,
          "max": 1
        }
      ]
    },
    {
      "id": "PR-01-M-09",
      "name": "敵戦車部隊撃破01",
      "diff": "A",
      "reward": 5500,
      "desc": "敵の戦車部隊を撃破せよ。",
      "terrain": "標準",
      "tags": [],
      "rules": [],
      "enemies": [
        "PR-01-U-0010-e",
        "PR-01-U-0010-e",
        "PR-01-U-0010-e",
        "PR-01-U-0010-e"
      ],
      "maxDeploy": 8,
      "drops": [
        {
          "itemId": "PR-01-I-0001",
          "chance": 70,
          "min": 2,
          "max": 4
        },
        {
          "itemId": "PR-01-I-0002",
          "chance": 14,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0003",
          "chance": 14,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0004",
          "chance": 14,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0005",
          "chance": 14,
          "min": 1,
          "max": 1
        }
      ]
    },
    {
      "id": "PR-01-M-10",
      "name": "正体不明ヴァイス部隊撃破01",
      "diff": "SS",
      "reward": 15500,
      "desc": "正体不明のヴァイス部隊を撃破せよ。",
      "terrain": "標準",
      "tags": [],
      "rules": [],
      "enemies": [
        "PR-01-U-0011-e",
        "PR-01-U-0011-e"
      ],
      "maxDeploy": 8,
      "drops": [
        {
          "itemId": "PR-01-I-0001",
          "chance": 70,
          "min": 2,
          "max": 4
        },
        {
          "itemId": "PR-01-I-0002",
          "chance": 14,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0003",
          "chance": 14,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0004",
          "chance": 14,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0005",
          "chance": 14,
          "min": 1,
          "max": 1
        }
      ]
    },
    {
      "id": "PR-01-M-11",
      "name": "正体不明ヴァイス部隊撃破02",
      "diff": "SSS",
      "reward": 30000,
      "desc": "正体不明のヴァイス部隊を撃破せよ。",
      "terrain": "標準",
      "tags": [],
      "rules": [],
      "enemies": [
        "PR-01-U-0011-e",
        "PR-01-U-0011-e",
        "PR-01-U-0011-e",
        "PR-01-U-0011-e",
        "PR-01-U-0011-e"
      ],
      "maxDeploy": 8,
      "drops": [
        {
          "itemId": "PR-01-I-0001",
          "chance": 70,
          "min": 2,
          "max": 4
        },
        {
          "itemId": "PR-01-I-0002",
          "chance": 14,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0003",
          "chance": 14,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0004",
          "chance": 14,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "PR-01-I-0005",
          "chance": 14,
          "min": 1,
          "max": 1
        }
      ]
    }
  ],
  "items": [
    {
      "id": "PR-01-I-0001",
      "name": "治療キット",
      "desc": "生身のユニットの負傷を治療するキット。ユニット一体のHPを回復する。",
      "requires": {
        "allTags": [
          "生身"
        ]
      },
      "effect": {
        "type": "heal_hp_flat",
        "value": 1500
      }
    },
    {
      "id": "PR-01-I-0002",
      "name": "低級攻撃訓練メニュー",
      "desc": "生身のユニットの攻撃力を訓練する指南書。ユニット一体の攻撃力を100上げる。ただし、一度使ったユニットには使えない。",
      "requires": {
        "allTags": [
          "生身"
        ]
      },
      "effects": [
        {
          "type": "add_skill",
          "skill": {
            "id": "PR-01-SS-0001",
            "name": "低級攻撃訓練履修",
            "trigger": "before_attack",
            "effect": "damage_up_pct",
            "value": 0,
            "chance": 0,
            "maxUses": 0,
            "note": ""
          }
        },
        {
          "type": "stat_up_flat",
          "value": 100,
          "stat": "atk"
        }
      ]
    },
    {
      "id": "PR-01-I-0003",
      "name": "低級防御訓練メニュー",
      "desc": "生身のユニットの防御力を訓練する指南書。ユニット一体の防御力を100上げる。ただし、一度使ったユニットには使えない。",
      "requires": {
        "allTags": [
          "生身"
        ]
      },
      "effects": [
        {
          "type": "add_skill",
          "skill": {
            "id": "PR-01-SS-0002",
            "name": "低級防御訓練履修",
            "trigger": "before_attack",
            "effect": "damage_up_pct",
            "value": 0,
            "chance": 0,
            "maxUses": 0,
            "note": ""
          }
        },
        {
          "type": "stat_up_flat",
          "value": 100,
          "stat": "def"
        }
      ]
    },
    {
      "id": "PR-01-I-0004",
      "name": "低級機動訓練メニュー",
      "desc": "生身のユニットの機動力を訓練する指南書。ユニット一体の機動力を100上げる。ただし、一度使ったユニットには使えない。",
      "requires": {
        "allTags": [
          "生身"
        ]
      },
      "effects": [
        {
          "type": "add_skill",
          "skill": {
            "id": "PR-01-SS-0003",
            "name": "低級機動訓練履修",
            "trigger": "before_attack",
            "effect": "damage_up_pct",
            "value": 0,
            "chance": 0,
            "maxUses": 0,
            "note": ""
          }
        },
        {
          "type": "stat_up_flat",
          "value": 100,
          "stat": "mob"
        }
      ]
    },
    {
      "id": "PR-01-I-0005",
      "name": "低級照準訓練メニュー",
      "desc": "生身のユニットの照準力を訓練する指南書。ユニット一体の照準力を100上げる。ただし、一度使ったユニットには使えない。",
      "requires": {
        "allTags": [
          "生身"
        ]
      },
      "effects": [
        {
          "type": "add_skill",
          "skill": {
            "id": "PR-01-SS-0004",
            "name": "低級照準訓練履修",
            "trigger": "before_attack",
            "effect": "damage_up_pct",
            "value": 0,
            "chance": 0,
            "maxUses": 0,
            "note": ""
          }
        },
        {
          "type": "stat_up_flat",
          "value": 100,
          "stat": "acc"
        }
      ]
    }
  ]
};
