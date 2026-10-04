/* PRO 1.10.3 基本データ（アイテム・研究）— ゲームに最初から入っているデータです。
 * 最新の形式（Unit Schema 4 / Mission Schema 2 / Item Schema 3）で作り直しました。
 * 作り方の参考にどうぞ。メーカーで読み込めば、そのまま編集できます。 */
window.VAIS_ITEM_PACK = {
  "format": "VAIS_OUTER_OPS_ITEM_PACK",
  "schemaVersion": 3,
  "packId": "pro-core",
  "packName": "基本データ",
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
    }
  ],
  "research": [
    {
      "id": "core-r-shop",
      "name": "新装備の開発",
      "desc": "増加装甲と武装キットがショップに並ぶ。",
      "cost": {
        "credits": 2000,
        "items": {}
      },
      "requires": [],
      "unlock": {
        "units": [],
        "items": [
          "core-i-armor",
          "core-i-weaponkit"
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
      }
    }
  ]
};
