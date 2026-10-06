/* PRO 1.13.1 基本データ — Unit Schema 6 / Mission Schema 4 / Item Schema 5 / Bundle Schema 6。 */
window.VAIS_MISSION_PACK = {
  "format": "VAIS_OUTER_OPS_MISSION_PACK",
  "schemaVersion": 4,
  "packId": "pro-core",
  "packName": "基本データ",
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
  ]
};
