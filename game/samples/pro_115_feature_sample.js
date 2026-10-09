/* PRO data pack */
window.VAIS_BUNDLE_PACK = {
  "format": "VAIS_OUTER_OPS_BUNDLE_PACK",
  "schemaVersion": 9,
  "packId": "pro_115_demo",
  "packName": "PRO 1.15 新機能デモ",
  "author": "PRO",
  "packVersion": "1.0.0",
  "dependencies": [],
  "units": [
    {
      "id": "demo_hero",
      "name": "デモ隊員",
      "hp": 5000,
      "atk": 500,
      "def": 50,
      "mob": 500,
      "acc": 500,
      "tags": [
        "デモ"
      ],
      "deploy": {
        "player": true,
        "enemy": false
      },
      "crew": "none",
      "weaponIds": [
        "demo_gun"
      ],
      "skillIds": [
        "demo_awaken"
      ],
      "equipSlots": 2,
      "sortieCost": 50
    },
    {
      "id": "demo_boss",
      "name": "段階変化ボス",
      "hp": 6000,
      "atk": 400,
      "def": 50,
      "mob": 500,
      "acc": 500,
      "tags": [
        "デモ"
      ],
      "deploy": {
        "player": false,
        "enemy": true
      },
      "crew": "none",
      "weaponIds": [
        "demo_gun"
      ],
      "skillIds": [],
      "equipSlots": 2,
      "sortieCost": 0,
      "phases": [
        {
          "id": "armor_release",
          "name": "装甲排除",
          "cond": {
            "type": "hp_below",
            "value": 60
          },
          "stats": {
            "def": 0,
            "mob": 650,
            "atk": 650
          },
          "hpMode": "ratio",
          "weaponIds": [
            "demo_cannon"
          ],
          "skillIds": [],
          "lines": [
            {
              "speaker": "ボス",
              "text": "装甲を排除。高出力砲に切り替える。"
            }
          ]
        }
      ]
    }
  ],
  "skills": [
    {
      "id": "demo_awaken",
      "name": "複合覚醒",
      "trigger": "turn_start",
      "effect": "atk_up_pct",
      "value": 30,
      "chance": 100,
      "maxUses": 1,
      "note": "",
      "cond": {
        "all": [
          {
            "type": "turn_ge",
            "value": 2
          },
          {
            "type": "hp_below",
            "value": 80
          }
        ]
      },
      "duration": 4,
      "effects": [
        {
          "effect": "atk_up_pct",
          "value": 30,
          "duration": 4
        },
        {
          "effect": "mob_up_pct",
          "value": 20,
          "duration": 4
        },
        {
          "effect": "heal_flat",
          "value": 500
        }
      ]
    }
  ],
  "weapons": [
    {
      "id": "demo_gun",
      "name": "試験用射撃",
      "attackType": "ranged",
      "damageType": "physical",
      "note": "",
      "powerPct": 100,
      "accuracyPt": 20,
      "critPt": 0,
      "targetCount": 1,
      "weight": 1,
      "minDamage": 50,
      "hitsMin": 1,
      "hitsMax": 2,
      "hitPowerPct": 80,
      "baseAtk": 300,
      "useUnitAtk": true
    },
    {
      "id": "demo_cannon",
      "name": "高出力砲",
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
      "hitsMax": 1,
      "hitPowerPct": 100,
      "baseAtk": 500,
      "useUnitAtk": true
    }
  ],
  "missions": [
    {
      "id": "demo_mission",
      "name": "新機能デモ：選択と段階変化",
      "diff": "D",
      "reward": 1000,
      "maxDeploy": 4,
      "enemies": [
        "demo_boss"
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 0
      },
      "terrain": "標準",
      "drops": [
        {
          "itemId": "demo_key",
          "chance": 100,
          "min": 1,
          "max": 1
        }
      ],
      "story": {
        "before": [
          {
            "speaker": "隊長",
            "text": "ルートを選び、ボスの段階変化を確認する。"
          }
        ],
        "choices": [
          {
            "text": "森へ進む",
            "flags": {
              "demo_forest": true
            },
            "lines": [
              {
                "speaker": "隊長",
                "text": "森林ルートだ。"
              }
            ]
          },
          {
            "text": "通常ルート",
            "flags": {
              "demo_forest": false
            },
            "lines": []
          }
        ],
        "after": [
          {
            "speaker": "隊長",
            "text": "成功。戦闘履歴と素材の入手先を確認してくれ。"
          }
        ],
        "defeat": [
          {
            "speaker": "隊長",
            "text": "撤退する。編成を整えて再挑戦だ。"
          }
        ]
      },
      "events": [
        {
          "id": "first_report",
          "when": "turn",
          "value": 1,
          "lines": [
            {
              "speaker": "通信",
              "text": "敵を確認。交戦を開始する。"
            }
          ]
        },
        {
          "id": "terrain_change",
          "when": "boss_hp",
          "value": 60,
          "terrain": "森林",
          "lines": [
            {
              "speaker": "通信",
              "text": "戦場が森林へ移行した。"
            }
          ]
        }
      ],
      "resultFlags": {
        "win": {
          "demo_clear": true
        }
      }
    },
    {
      "id": "demo_followup",
      "name": "新機能デモ：分岐解放",
      "diff": "D",
      "reward": 800,
      "maxDeploy": 4,
      "enemies": [
        "demo_boss"
      ],
      "terrain": "標準",
      "requires": {
        "flags": {
          "demo_clear": true
        }
      },
      "hidden": true,
      "drops": []
    }
  ],
  "items": [
    {
      "id": "demo_key",
      "name": "デモ研究素材",
      "desc": "デモ作戦で必ず1個入手する。",
      "effect": {
        "type": "credits_gain",
        "value": 1
      },
      "key": true
    }
  ],
  "research": [
    {
      "id": "demo_research",
      "name": "デモ素材研究",
      "desc": "素材不足と入手先を確認する研究。",
      "cost": {
        "credits": 100,
        "items": {
          "demo_key": 2
        }
      },
      "requires": [],
      "unlock": {
        "units": [],
        "items": [],
        "grantItems": {}
      }
    }
  ]
};
