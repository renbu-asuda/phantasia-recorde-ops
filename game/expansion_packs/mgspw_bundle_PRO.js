/* PRO 拡張パック — メタルギアソリッド ピースウォーカー（統合パック Bundle Schema 4 / Toolkit 1.12.0 以降）
 * 「メタルギア ソリッド ピースウォーカー」の二次創作です（非公式・非営利）。原作: コナミデジタルエンタテインメント。コナミ様とは関係ありません。
 * キャラクター・兵器の名称などの権利は原作者に帰属します。原作の画像・音楽・文章は使っていません。
 * ゲームの「拡張パック」画面で「メタルギアソリッド ピースウォーカー」を追加するか、「データ管理 → 統合JSを読み込む」で読み込んでください。
 *
 * 収録: 仲間にできるユニット31人（スネーク・物語のキャラクター・サンディニスタ兵・マザーベースの兵科ごとのMSF兵 8兵科×ランクC/B/A）と敵19体（兵士・指揮官・AI兵器）／作戦16本（MAIN OPS 序章〜第5章＋EXTRA OPS）／アイテム10種／研究4種／地形5種
 * 設計メモ:
 *   - 基準は一般歩兵 HP3000 / ATK500 / DEF0 / MOB500 / ACC500。はじめはスネーク1人。物語が進むと仲間が増え、MSF兵はランクC→B→Aの順に研究で強い兵士が配属される。
 *   - AI兵器（LAV・T-72U・ピューパ・Mi-24A・クリサリス・コクーン・ピースウォーカー・ZEKE）は高いHPとDEFを持つ「兵器」タグの敵。ロケットランチャーや技術兵・ヒューイの追加効果で崩せる。
 *   - データは統合メーカー（combined_maker.html）で読み込み・確認して書き出したものです。
 *   - 会話文と説明はゲーム用に書き下ろしたもので、原作の文章ではありません。
 */
window.VAIS_BUNDLE_PACK = {
  "format": "VAIS_OUTER_OPS_BUNDLE_PACK",
  "schemaVersion": 4,
  "packId": "mgspw",
  "packName": "メタルギアソリッド ピースウォーカー 拡張パック（二次創作）",
  "units": [
    {
      "id": "pw-u-snake",
      "name": "スネーク",
      "role": "傭兵部隊MSFの司令官",
      "pilot": "",
      "mark": "蛇",
      "tags": [
        "生身",
        "人間",
        "傭兵",
        "MSF",
        "CQC"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-snake-sneak",
          "name": "ステルス",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 15,
          "chance": 50,
          "maxUses": 0,
          "note": "気配を消して、狙いを外させる。"
        },
        {
          "id": "pw-s-snake-cqc",
          "name": "CQCの心得",
          "trigger": "before_attack",
          "effect": "crit_up_pt",
          "value": 10,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "pw-s-snake-lead",
          "name": "司令官",
          "trigger": "ally_down",
          "effect": "atk_up_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": "仲間が倒れても部隊を立て直す。",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "name": "ハンドガン",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "サプレッサー付きの拳銃。",
          "powerPct": 100,
          "accuracyPt": 25,
          "critPt": 8,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 50,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 42
        },
        {
          "name": "CQC",
          "attackType": "melee",
          "damageType": "physical",
          "note": "近接格闘術。相手を組み伏せる。",
          "powerPct": 140,
          "accuracyPt": 25,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "stun",
              "value": 1,
              "chance": 30,
              "when": "hit",
              "duration": 1
            }
          ]
        },
        {
          "name": "ケースレスアサルトライフル",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 115,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.9,
          "minDamage": 40,
          "hitsMin": 3,
          "hitsMax": 5,
          "hitPowerPct": 26
        },
        {
          "name": "ロケットランチャー",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 230,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 2,
          "weight": 0.6,
          "minDamage": 180,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff8844",
          "effects": [
            {
              "timing": "before",
              "effect": "tag_damage_up_pct",
              "value": 30,
              "tag": "兵器"
            }
          ]
        }
      ],
      "hp": 4600,
      "atk": 780,
      "def": 50,
      "mob": 860,
      "acc": 860,
      "row": "front",
      "growth": {
        "hp": 150,
        "atk": 22,
        "def": 3,
        "mob": 18,
        "acc": 22
      },
      "skillTree": [
        {
          "id": "pw-n-snake-1",
          "skill": {
            "id": "pw-s-snake-box",
            "name": "段ボールに隠れる",
            "trigger": "battle_start",
            "effect": "mob_up_pct",
            "value": 20,
            "chance": 100,
            "maxUses": 1,
            "note": "あからさまに怪しいが、なぜか見つからない。",
            "duration": 3
          },
          "cost": 1,
          "minLevel": 2,
          "requires": []
        },
        {
          "id": "pw-n-snake-2",
          "skill": {
            "id": "pw-s-snake-fulton",
            "name": "フルトン回収",
            "trigger": "on_kill",
            "effect": "heal_maxhp_pct",
            "value": 10,
            "chance": 100,
            "maxUses": 0,
            "note": "倒した相手を回収する要領で、気を取り直す。"
          },
          "cost": 2,
          "minLevel": 4,
          "requires": [
            "pw-n-snake-1"
          ]
        },
        {
          "id": "pw-n-snake-3",
          "skill": {
            "id": "pw-s-snake-bigboss",
            "name": "ビッグボス",
            "trigger": "on_crit",
            "effect": "extra_action",
            "value": 0,
            "chance": 100,
            "maxUses": 1,
            "note": "伝説の傭兵の一撃。"
          },
          "cost": 3,
          "minLevel": 7,
          "requires": [
            "pw-n-snake-2"
          ]
        }
      ],
      "crew": "none"
    },
    {
      "id": "pw-u-kaz",
      "name": "カズヒラ・ミラー",
      "role": "MSFの副司令官",
      "pilot": "",
      "mark": "カ",
      "tags": [
        "生身",
        "人間",
        "MSF",
        "副司令官"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-kaz-support",
          "name": "副司令官の采配",
          "trigger": "battle_start",
          "effect": "atk_up_pct",
          "value": 12,
          "chance": 100,
          "maxUses": 1,
          "note": "指示で部隊の動きがそろう。",
          "target": "allies",
          "duration": 3
        },
        {
          "id": "pw-s-kaz-gmp",
          "name": "資金のやりくり",
          "trigger": "turn_end",
          "effect": "acc_up_pct",
          "value": 3,
          "chance": 100,
          "maxUses": 0,
          "note": "",
          "target": "allies",
          "duration": 2
        }
      ],
      "weapons": [
        {
          "name": "拳銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 95,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 40
        },
        {
          "name": "無線で援護要請",
          "attackType": "ranged",
          "damageType": "special",
          "note": "マザーベースから支援射撃を呼ぶ。",
          "powerPct": 120,
          "accuracyPt": 20,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.5,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#66ccff"
        }
      ],
      "hp": 3800,
      "atk": 520,
      "def": 30,
      "mob": 640,
      "acc": 720,
      "row": "back",
      "growth": {
        "hp": 130,
        "atk": 20,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "pw-m-01",
        "note": "資材搬入施設の調査を終えると、副司令官としてスネークを支える。"
      }
    },
    {
      "id": "pw-u-amanda",
      "name": "アマンダ",
      "role": "サンディニスタの女性戦士",
      "pilot": "",
      "mark": "ア",
      "tags": [
        "生身",
        "人間",
        "サンディニスタ",
        "ゲリラ"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-amanda-jungle",
          "name": "ジャングルの戦い",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 12,
          "chance": 45,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "pw-s-amanda-rebel",
          "name": "解放の意志",
          "trigger": "ally_down",
          "effect": "atk_up_pct",
          "value": 12,
          "chance": 100,
          "maxUses": 0,
          "note": "",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "name": "ライフル",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 50,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 38
        },
        {
          "name": "ジャングルの奇襲",
          "attackType": "melee",
          "damageType": "physical",
          "note": "茂みから飛び出して切り込む。",
          "powerPct": 150,
          "accuracyPt": 15,
          "critPt": 10,
          "targetCount": 1,
          "weight": 0.8,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 4100,
      "atk": 700,
      "def": 40,
      "mob": 760,
      "acc": 740,
      "row": "front",
      "growth": {
        "hp": 130,
        "atk": 20,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "pw-m-02",
        "note": "アマンダを無事に救い出すと、サンディニスタの案内役として協力してくれる。"
      }
    },
    {
      "id": "pw-u-chico",
      "name": "チコ",
      "role": "サンディニスタの少年兵",
      "pilot": "",
      "mark": "チ",
      "tags": [
        "生身",
        "人間",
        "サンディニスタ",
        "少年"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-chico-fast",
          "name": "すばしっこい",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 16,
          "chance": 55,
          "maxUses": 0,
          "note": "小柄な身体で逃げ回る。"
        },
        {
          "id": "pw-s-chico-courage",
          "name": "姉のため",
          "trigger": "before_attack",
          "effect": "crit_up_pt",
          "value": 10,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "小型の拳銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 90,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.1,
          "minDamage": 30,
          "hitsMin": 1,
          "hitsMax": 3,
          "hitPowerPct": 50
        },
        {
          "name": "投石",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 80,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.5,
          "minDamage": 20,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 35
        }
      ],
      "hp": 3000,
      "atk": 520,
      "def": 10,
      "mob": 820,
      "acc": 640,
      "row": "back",
      "growth": {
        "hp": 130,
        "atk": 20,
        "def": 3,
        "mob": 20,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "pw-m-04",
        "note": "無事に助け出されたチコが、MSFの一員として働きたいと言い出す。"
      }
    },
    {
      "id": "pw-u-sandsoldier",
      "name": "サンディニスタ兵",
      "role": "サンディニスタの兵士",
      "pilot": "",
      "mark": "サ",
      "tags": [
        "生身",
        "人間",
        "サンディニスタ",
        "ゲリラ"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-sand-guts",
          "name": "しぶとい",
          "trigger": "on_death",
          "effect": "guts",
          "value": 1,
          "chance": 30,
          "maxUses": 1,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "古いライフル",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.1,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 36
        },
        {
          "name": "火炎瓶",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 2,
          "weight": 0.5,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "effects": [
            {
              "timing": "after",
              "effect": "burn",
              "value": 100,
              "when": "hit",
              "duration": 2
            }
          ]
        }
      ],
      "hp": 3500,
      "atk": 560,
      "def": 40,
      "mob": 640,
      "acc": 600,
      "row": "front",
      "growth": {
        "hp": 130,
        "atk": 20,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "pw-m-02",
        "note": "アマンダの部下たちが、MSFと共闘してくれる。"
      }
    },
    {
      "id": "pw-u-huey",
      "name": "ヒューイ・エメリッヒ",
      "role": "兵器開発の技術者",
      "pilot": "",
      "mark": "ヒ",
      "tags": [
        "生身",
        "人間",
        "MSF",
        "技術者",
        "研究開発班"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-huey-engineer",
          "name": "兵器の弱点を知る",
          "trigger": "before_attack",
          "effect": "def_pierce_pct",
          "value": 25,
          "chance": 100,
          "maxUses": 0,
          "note": "設計者のひとりとして、装甲の継ぎ目を知っている。"
        },
        {
          "id": "pw-s-huey-repair",
          "name": "応急修理",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 3,
          "chance": 100,
          "maxUses": 0,
          "note": "",
          "target": "allies"
        }
      ],
      "weapons": [
        {
          "name": "改造ハンドガン",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 95,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.8,
          "minDamage": 30,
          "hitsMin": 1,
          "hitsMax": 3,
          "hitPowerPct": 45
        },
        {
          "name": "ロボット工学の知識",
          "attackType": "ranged",
          "damageType": "special",
          "note": "兵器の配線の弱点を突く。",
          "powerPct": 140,
          "accuracyPt": 20,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#99ffcc",
          "effects": [
            {
              "timing": "before",
              "effect": "tag_damage_up_pct",
              "value": 35,
              "tag": "兵器"
            },
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
      "hp": 3200,
      "atk": 500,
      "def": 10,
      "mob": 540,
      "acc": 700,
      "row": "back",
      "growth": {
        "hp": 130,
        "atk": 20,
        "def": 3,
        "mob": 16,
        "acc": 22
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "pw-m-11",
        "note": "独房から助け出された技術者ヒューイが、MSFに加わる。"
      }
    },
    {
      "id": "pw-u-strangelove",
      "name": "ストレンジラブ",
      "role": "AI研究者",
      "pilot": "",
      "mark": "ス",
      "tags": [
        "生身",
        "人間",
        "研究者",
        "技術者"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-strange-analyze",
          "name": "解析",
          "trigger": "battle_start",
          "effect": "acc_up_pct",
          "value": 12,
          "chance": 100,
          "maxUses": 1,
          "note": "AIの動きを予測して教える。",
          "target": "allies",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "name": "拳銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 90,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.8,
          "minDamage": 30,
          "hitsMin": 1,
          "hitsMax": 3,
          "hitPowerPct": 45
        },
        {
          "name": "AIの演算",
          "attackType": "ranged",
          "damageType": "special",
          "note": "敵の火器管制の癖を読み、狙いを乱す。",
          "powerPct": 130,
          "accuracyPt": 25,
          "critPt": 0,
          "targetCount": 3,
          "weight": 1,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#66aaff",
          "effects": [
            {
              "timing": "after",
              "effect": "acc_down_pct",
              "value": 15,
              "when": "hit",
              "duration": 2
            }
          ]
        }
      ],
      "hp": 3300,
      "atk": 540,
      "def": 20,
      "mob": 560,
      "acc": 720,
      "row": "back",
      "growth": {
        "hp": 130,
        "atk": 20,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "pw-m-14",
        "note": "ピースウォーカーの暴走を止めると、AIの研究者がMSFに協力するようになる。"
      }
    },
    {
      "id": "pw-u-msf-assaultc",
      "name": "MSF突撃兵C",
      "role": "戦闘部隊 / 突撃兵 ランクC",
      "pilot": "",
      "mark": "突",
      "tags": [
        "生身",
        "MSF",
        "戦闘部隊",
        "突撃兵",
        "ランクC"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-assault-C",
          "name": "突撃",
          "trigger": "before_attack",
          "effect": "damage_up_pct",
          "value": 8,
          "chance": 50,
          "maxUses": 0,
          "note": "前に出て押し込む。"
        }
      ],
      "weapons": [
        {
          "name": "アサルトライフル",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 105,
          "accuracyPt": 12,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 32
        },
        {
          "name": "手榴弾",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.6,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2
        }
      ],
      "hp": 3600,
      "atk": 640,
      "def": 40,
      "mob": 640,
      "acc": 640,
      "row": "front",
      "growth": {
        "hp": 130,
        "atk": 20,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "pw-m-01",
        "note": "フルトン回収した兵士が、戦闘部隊に配属される。"
      }
    },
    {
      "id": "pw-u-msf-assaultb",
      "name": "MSF突撃兵B",
      "role": "戦闘部隊 / 突撃兵 ランクB",
      "pilot": "",
      "mark": "突",
      "tags": [
        "生身",
        "MSF",
        "戦闘部隊",
        "突撃兵",
        "ランクB"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-assault-B",
          "name": "突撃",
          "trigger": "before_attack",
          "effect": "damage_up_pct",
          "value": 10,
          "chance": 50,
          "maxUses": 0,
          "note": "前に出て押し込む。"
        }
      ],
      "weapons": [
        {
          "name": "アサルトライフル",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 105,
          "accuracyPt": 12,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 32
        },
        {
          "name": "手榴弾",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.6,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2
        }
      ],
      "hp": 4500,
      "atk": 770,
      "def": 55,
      "mob": 640,
      "acc": 640,
      "row": "front",
      "growth": {
        "hp": 163,
        "atk": 24,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「研究開発班の増員」で配属される。"
      }
    },
    {
      "id": "pw-u-msf-assaulta",
      "name": "MSF突撃兵A",
      "role": "戦闘部隊 / 突撃兵 ランクA",
      "pilot": "",
      "mark": "突",
      "tags": [
        "生身",
        "MSF",
        "戦闘部隊",
        "突撃兵",
        "ランクA"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-assault-A",
          "name": "突撃",
          "trigger": "before_attack",
          "effect": "damage_up_pct",
          "value": 12,
          "chance": 50,
          "maxUses": 0,
          "note": "前に出て押し込む。"
        }
      ],
      "weapons": [
        {
          "name": "アサルトライフル",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 105,
          "accuracyPt": 12,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.3,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 32
        },
        {
          "name": "手榴弾",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.6,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2
        }
      ],
      "hp": 5400,
      "atk": 930,
      "def": 70,
      "mob": 640,
      "acc": 640,
      "row": "front",
      "growth": {
        "hp": 195,
        "atk": 29,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「フルトン改良」で、熟練の突撃兵が配属される。"
      }
    },
    {
      "id": "pw-u-msf-heavyc",
      "name": "MSF重装兵C",
      "role": "戦闘部隊 / 重装兵 ランクC",
      "pilot": "",
      "mark": "重",
      "tags": [
        "生身",
        "MSF",
        "戦闘部隊",
        "重装兵",
        "ランクC"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-heavy-taunt-C",
          "name": "盾になる",
          "trigger": "battle_start",
          "effect": "taunt",
          "value": 40,
          "chance": 100,
          "maxUses": 1,
          "note": "敵の狙いを引きつける。",
          "duration": 3
        },
        {
          "id": "pw-s-heavy-armor-C",
          "name": "防弾装備",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 12,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "軽機関銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 8,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 40,
          "hitsMin": 3,
          "hitsMax": 6,
          "hitPowerPct": 22
        },
        {
          "name": "ライオットシールド打撃",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.6,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 5400,
      "atk": 580,
      "def": 110,
      "mob": 460,
      "acc": 540,
      "row": "front",
      "growth": {
        "hp": 130,
        "atk": 20,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "pw-m-04",
        "note": "フルトン回収した兵士が、戦闘部隊に配属される。"
      }
    },
    {
      "id": "pw-u-msf-heavyb",
      "name": "MSF重装兵B",
      "role": "戦闘部隊 / 重装兵 ランクB",
      "pilot": "",
      "mark": "重",
      "tags": [
        "生身",
        "MSF",
        "戦闘部隊",
        "重装兵",
        "ランクB"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-heavy-taunt-B",
          "name": "盾になる",
          "trigger": "battle_start",
          "effect": "taunt",
          "value": 40,
          "chance": 100,
          "maxUses": 1,
          "note": "敵の狙いを引きつける。",
          "duration": 3
        },
        {
          "id": "pw-s-heavy-armor-B",
          "name": "防弾装備",
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
          "name": "軽機関銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 8,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 40,
          "hitsMin": 3,
          "hitsMax": 6,
          "hitPowerPct": 22
        },
        {
          "name": "ライオットシールド打撃",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.6,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 6750,
      "atk": 695,
      "def": 125,
      "mob": 460,
      "acc": 540,
      "row": "front",
      "growth": {
        "hp": 163,
        "atk": 24,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「研究開発班の増員」で配属される。"
      }
    },
    {
      "id": "pw-u-msf-heavya",
      "name": "MSF重装兵A",
      "role": "戦闘部隊 / 重装兵 ランクA",
      "pilot": "",
      "mark": "重",
      "tags": [
        "生身",
        "MSF",
        "戦闘部隊",
        "重装兵",
        "ランクA"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-heavy-taunt-A",
          "name": "盾になる",
          "trigger": "battle_start",
          "effect": "taunt",
          "value": 40,
          "chance": 100,
          "maxUses": 1,
          "note": "敵の狙いを引きつける。",
          "duration": 3
        },
        {
          "id": "pw-s-heavy-armor-A",
          "name": "防弾装備",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 18,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "軽機関銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 8,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 40,
          "hitsMin": 3,
          "hitsMax": 6,
          "hitPowerPct": 22
        },
        {
          "name": "ライオットシールド打撃",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.6,
          "minDamage": 70,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 8100,
      "atk": 840,
      "def": 140,
      "mob": 460,
      "acc": 540,
      "row": "front",
      "growth": {
        "hp": 195,
        "atk": 29,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「フルトン改良」で、熟練の重装兵が配属される。"
      }
    },
    {
      "id": "pw-u-msf-sniperc",
      "name": "MSF狙撃手C",
      "role": "戦闘部隊 / 狙撃手 ランクC",
      "pilot": "",
      "mark": "狙",
      "tags": [
        "生身",
        "MSF",
        "戦闘部隊",
        "狙撃手",
        "ランクC"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-sniper-eye-C",
          "name": "狙撃の勘",
          "trigger": "before_attack",
          "effect": "hit_up_pt",
          "value": 16,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "狙撃銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "一発の重い狙撃。",
          "powerPct": 190,
          "accuracyPt": 30,
          "critPt": 12,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 130,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "拳銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 90,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.4,
          "minDamage": 30,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 60
        }
      ],
      "hp": 3000,
      "atk": 780,
      "def": 10,
      "mob": 600,
      "acc": 860,
      "row": "back",
      "growth": {
        "hp": 130,
        "atk": 20,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "pw-m-03",
        "note": "フルトン回収した兵士が、戦闘部隊に配属される。"
      }
    },
    {
      "id": "pw-u-msf-sniperb",
      "name": "MSF狙撃手B",
      "role": "戦闘部隊 / 狙撃手 ランクB",
      "pilot": "",
      "mark": "狙",
      "tags": [
        "生身",
        "MSF",
        "戦闘部隊",
        "狙撃手",
        "ランクB"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-sniper-eye-B",
          "name": "狙撃の勘",
          "trigger": "before_attack",
          "effect": "hit_up_pt",
          "value": 20,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "狙撃銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "一発の重い狙撃。",
          "powerPct": 190,
          "accuracyPt": 30,
          "critPt": 12,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 130,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "拳銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 90,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.4,
          "minDamage": 30,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 60
        }
      ],
      "hp": 3750,
      "atk": 935,
      "def": 25,
      "mob": 600,
      "acc": 860,
      "row": "back",
      "growth": {
        "hp": 163,
        "atk": 24,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「研究開発班の増員」で配属される。"
      }
    },
    {
      "id": "pw-u-msf-snipera",
      "name": "MSF狙撃手A",
      "role": "戦闘部隊 / 狙撃手 ランクA",
      "pilot": "",
      "mark": "狙",
      "tags": [
        "生身",
        "MSF",
        "戦闘部隊",
        "狙撃手",
        "ランクA"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-sniper-eye-A",
          "name": "狙撃の勘",
          "trigger": "before_attack",
          "effect": "hit_up_pt",
          "value": 24,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "狙撃銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "一発の重い狙撃。",
          "powerPct": 190,
          "accuracyPt": 30,
          "critPt": 12,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 130,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "拳銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 90,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.4,
          "minDamage": 30,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 60
        }
      ],
      "hp": 4500,
      "atk": 1130,
      "def": 40,
      "mob": 600,
      "acc": 860,
      "row": "back",
      "growth": {
        "hp": 195,
        "atk": 29,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「フルトン改良」で、熟練の狙撃手が配属される。"
      }
    },
    {
      "id": "pw-u-msf-medicc",
      "name": "MSF衛生兵C",
      "role": "医療班 / 衛生兵 ランクC",
      "pilot": "",
      "mark": "衛",
      "tags": [
        "生身",
        "MSF",
        "医療班",
        "衛生兵",
        "ランクC"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-medic-heal-C",
          "name": "応急処置",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 5,
          "chance": 100,
          "maxUses": 0,
          "note": "もっとも傷ついた味方を手当てする。",
          "target": "weakest_ally"
        }
      ],
      "weapons": [
        {
          "name": "サブマシンガン",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 90,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 28
        }
      ],
      "hp": 3300,
      "atk": 420,
      "def": 20,
      "mob": 640,
      "acc": 620,
      "row": "back",
      "growth": {
        "hp": 130,
        "atk": 20,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "pw-m-02",
        "note": "フルトン回収した兵士が、医療班に配属される。"
      }
    },
    {
      "id": "pw-u-msf-medicb",
      "name": "MSF衛生兵B",
      "role": "医療班 / 衛生兵 ランクB",
      "pilot": "",
      "mark": "衛",
      "tags": [
        "生身",
        "MSF",
        "医療班",
        "衛生兵",
        "ランクB"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-medic-heal-B",
          "name": "応急処置",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 6,
          "chance": 100,
          "maxUses": 0,
          "note": "もっとも傷ついた味方を手当てする。",
          "target": "weakest_ally"
        }
      ],
      "weapons": [
        {
          "name": "サブマシンガン",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 90,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 28
        }
      ],
      "hp": 4130,
      "atk": 505,
      "def": 35,
      "mob": 640,
      "acc": 620,
      "row": "back",
      "growth": {
        "hp": 163,
        "atk": 24,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「医療班の増員」で配属される。"
      }
    },
    {
      "id": "pw-u-msf-medica",
      "name": "MSF衛生兵A",
      "role": "医療班 / 衛生兵 ランクA",
      "pilot": "",
      "mark": "衛",
      "tags": [
        "生身",
        "MSF",
        "医療班",
        "衛生兵",
        "ランクA"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-medic-heal-A",
          "name": "応急処置",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 8,
          "chance": 100,
          "maxUses": 0,
          "note": "もっとも傷ついた味方を手当てする。",
          "target": "weakest_ally"
        }
      ],
      "weapons": [
        {
          "name": "サブマシンガン",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 90,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 28
        }
      ],
      "hp": 4950,
      "atk": 610,
      "def": 50,
      "mob": 640,
      "acc": 620,
      "row": "back",
      "growth": {
        "hp": 195,
        "atk": 29,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「フルトン改良」で、熟練の衛生兵が配属される。"
      }
    },
    {
      "id": "pw-u-msf-techc",
      "name": "MSF技術兵C",
      "role": "研究開発班 / 技術兵 ランクC",
      "pilot": "",
      "mark": "技",
      "tags": [
        "生身",
        "MSF",
        "研究開発班",
        "技術兵",
        "ランクC"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-tech-break-C",
          "name": "装甲の弱点を解析",
          "trigger": "after_attack",
          "effect": "def_down_pct",
          "value": 10,
          "chance": 55,
          "maxUses": 0,
          "note": "相手の装甲の継ぎ目を調べて崩す。",
          "target": "opponent",
          "duration": 2
        }
      ],
      "weapons": [
        {
          "name": "改造ケースレスガン",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 105,
          "accuracyPt": 12,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 38
        },
        {
          "name": "徹甲弾",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 8,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.7,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "before",
              "effect": "def_pierce_pct",
              "value": 20
            }
          ]
        }
      ],
      "hp": 3200,
      "atk": 520,
      "def": 20,
      "mob": 620,
      "acc": 680,
      "row": "back",
      "growth": {
        "hp": 130,
        "atk": 20,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "pw-m-08",
        "note": "フルトン回収した兵士が、研究開発班に配属される。"
      }
    },
    {
      "id": "pw-u-msf-techb",
      "name": "MSF技術兵B",
      "role": "研究開発班 / 技術兵 ランクB",
      "pilot": "",
      "mark": "技",
      "tags": [
        "生身",
        "MSF",
        "研究開発班",
        "技術兵",
        "ランクB"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-tech-break-B",
          "name": "装甲の弱点を解析",
          "trigger": "after_attack",
          "effect": "def_down_pct",
          "value": 13,
          "chance": 55,
          "maxUses": 0,
          "note": "相手の装甲の継ぎ目を調べて崩す。",
          "target": "opponent",
          "duration": 2
        }
      ],
      "weapons": [
        {
          "name": "改造ケースレスガン",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 105,
          "accuracyPt": 12,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 38
        },
        {
          "name": "徹甲弾",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 8,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.7,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "before",
              "effect": "def_pierce_pct",
              "value": 20
            }
          ]
        }
      ],
      "hp": 4000,
      "atk": 625,
      "def": 35,
      "mob": 620,
      "acc": 680,
      "row": "back",
      "growth": {
        "hp": 163,
        "atk": 24,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「研究開発班の増員」で配属される。"
      }
    },
    {
      "id": "pw-u-msf-techa",
      "name": "MSF技術兵A",
      "role": "研究開発班 / 技術兵 ランクA",
      "pilot": "",
      "mark": "技",
      "tags": [
        "生身",
        "MSF",
        "研究開発班",
        "技術兵",
        "ランクA"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-tech-break-A",
          "name": "装甲の弱点を解析",
          "trigger": "after_attack",
          "effect": "def_down_pct",
          "value": 16,
          "chance": 55,
          "maxUses": 0,
          "note": "相手の装甲の継ぎ目を調べて崩す。",
          "target": "opponent",
          "duration": 2
        }
      ],
      "weapons": [
        {
          "name": "改造ケースレスガン",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 105,
          "accuracyPt": 12,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 38
        },
        {
          "name": "徹甲弾",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 8,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.7,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "before",
              "effect": "def_pierce_pct",
              "value": 30
            }
          ]
        }
      ],
      "hp": 4800,
      "atk": 755,
      "def": 50,
      "mob": 620,
      "acc": 680,
      "row": "back",
      "growth": {
        "hp": 195,
        "atk": 29,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「フルトン改良」で、熟練の技術兵が配属される。"
      }
    },
    {
      "id": "pw-u-msf-scoutc",
      "name": "MSF偵察兵C",
      "role": "諜報班 / 偵察兵 ランクC",
      "pilot": "",
      "mark": "偵",
      "tags": [
        "生身",
        "MSF",
        "諜報班",
        "偵察兵",
        "ランクC"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-scout-evade-C",
          "name": "身を隠す",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 14,
          "chance": 50,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "pw-s-scout-info-C",
          "name": "敵の情報",
          "trigger": "battle_start",
          "effect": "acc_up_pct",
          "value": 10,
          "chance": 100,
          "maxUses": 1,
          "note": "偵察の情報で味方の狙いがよくなる。",
          "target": "allies",
          "duration": 2
        }
      ],
      "weapons": [
        {
          "name": "サプレッサー付き拳銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 18,
          "critPt": 8,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 40
        }
      ],
      "hp": 2900,
      "atk": 560,
      "def": 10,
      "mob": 860,
      "acc": 740,
      "row": "front",
      "growth": {
        "hp": 130,
        "atk": 20,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "pw-m-06",
        "note": "フルトン回収した兵士が、諜報班に配属される。"
      }
    },
    {
      "id": "pw-u-msf-scoutb",
      "name": "MSF偵察兵B",
      "role": "諜報班 / 偵察兵 ランクB",
      "pilot": "",
      "mark": "偵",
      "tags": [
        "生身",
        "MSF",
        "諜報班",
        "偵察兵",
        "ランクB"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-scout-evade-B",
          "name": "身を隠す",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 17,
          "chance": 50,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "pw-s-scout-info-B",
          "name": "敵の情報",
          "trigger": "battle_start",
          "effect": "acc_up_pct",
          "value": 10,
          "chance": 100,
          "maxUses": 1,
          "note": "偵察の情報で味方の狙いがよくなる。",
          "target": "allies",
          "duration": 2
        }
      ],
      "weapons": [
        {
          "name": "サプレッサー付き拳銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 18,
          "critPt": 8,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 40
        }
      ],
      "hp": 3630,
      "atk": 670,
      "def": 25,
      "mob": 860,
      "acc": 740,
      "row": "front",
      "growth": {
        "hp": 163,
        "atk": 24,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「諜報班の増員」で配属される。"
      }
    },
    {
      "id": "pw-u-msf-scouta",
      "name": "MSF偵察兵A",
      "role": "諜報班 / 偵察兵 ランクA",
      "pilot": "",
      "mark": "偵",
      "tags": [
        "生身",
        "MSF",
        "諜報班",
        "偵察兵",
        "ランクA"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-scout-evade-A",
          "name": "身を隠す",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 20,
          "chance": 50,
          "maxUses": 0,
          "note": ""
        },
        {
          "id": "pw-s-scout-info-A",
          "name": "敵の情報",
          "trigger": "battle_start",
          "effect": "acc_up_pct",
          "value": 10,
          "chance": 100,
          "maxUses": 1,
          "note": "偵察の情報で味方の狙いがよくなる。",
          "target": "allies",
          "duration": 2
        }
      ],
      "weapons": [
        {
          "name": "サプレッサー付き拳銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 18,
          "critPt": 8,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 40
        }
      ],
      "hp": 4350,
      "atk": 810,
      "def": 40,
      "mob": 860,
      "acc": 740,
      "row": "front",
      "growth": {
        "hp": 195,
        "atk": 29,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「フルトン改良」で、熟練の偵察兵が配属される。"
      }
    },
    {
      "id": "pw-u-msf-supplyc",
      "name": "MSF補給兵C",
      "role": "支援班 / 補給兵 ランクC",
      "pilot": "",
      "mark": "補",
      "tags": [
        "生身",
        "MSF",
        "支援班",
        "補給兵",
        "ランクC"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-supply-shield-C",
          "name": "補給物資",
          "trigger": "battle_start",
          "effect": "shield",
          "value": 700,
          "chance": 100,
          "maxUses": 1,
          "note": "防弾板を配って味方を守る。",
          "target": "allies"
        }
      ],
      "weapons": [
        {
          "name": "ショットガン",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 115,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1.1,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 3400,
      "atk": 480,
      "def": 30,
      "mob": 600,
      "acc": 600,
      "row": "back",
      "growth": {
        "hp": 130,
        "atk": 20,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "pw-m-06",
        "note": "フルトン回収した兵士が、支援班に配属される。"
      }
    },
    {
      "id": "pw-u-msf-supplyb",
      "name": "MSF補給兵B",
      "role": "支援班 / 補給兵 ランクB",
      "pilot": "",
      "mark": "補",
      "tags": [
        "生身",
        "MSF",
        "支援班",
        "補給兵",
        "ランクB"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-supply-shield-B",
          "name": "補給物資",
          "trigger": "battle_start",
          "effect": "shield",
          "value": 950,
          "chance": 100,
          "maxUses": 1,
          "note": "防弾板を配って味方を守る。",
          "target": "allies"
        }
      ],
      "weapons": [
        {
          "name": "ショットガン",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 115,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1.1,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 4250,
      "atk": 575,
      "def": 45,
      "mob": 600,
      "acc": 600,
      "row": "back",
      "growth": {
        "hp": 163,
        "atk": 24,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「諜報班の増員」で配属される。"
      }
    },
    {
      "id": "pw-u-msf-supplya",
      "name": "MSF補給兵A",
      "role": "支援班 / 補給兵 ランクA",
      "pilot": "",
      "mark": "補",
      "tags": [
        "生身",
        "MSF",
        "支援班",
        "補給兵",
        "ランクA"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-supply-shield-A",
          "name": "補給物資",
          "trigger": "battle_start",
          "effect": "shield",
          "value": 1200,
          "chance": 100,
          "maxUses": 1,
          "note": "防弾板を配って味方を守る。",
          "target": "allies"
        }
      ],
      "weapons": [
        {
          "name": "ショットガン",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 115,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1.1,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 5100,
      "atk": 695,
      "def": 60,
      "mob": 600,
      "acc": 600,
      "row": "back",
      "growth": {
        "hp": 195,
        "atk": 29,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「フルトン改良」で、熟練の補給兵が配属される。"
      }
    },
    {
      "id": "pw-u-msf-cookc",
      "name": "MSF料理兵C",
      "role": "食堂班 / 料理兵 ランクC",
      "pilot": "",
      "mark": "食",
      "tags": [
        "生身",
        "MSF",
        "食堂班",
        "料理兵",
        "ランクC"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-cook-meal-C",
          "name": "温かい食事",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 4,
          "chance": 100,
          "maxUses": 0,
          "note": "食事で部隊の士気が上がる。",
          "target": "allies"
        }
      ],
      "weapons": [
        {
          "name": "フライパン",
          "attackType": "melee",
          "damageType": "physical",
          "note": "意外と痛い。",
          "powerPct": 110,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 50,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 3500,
      "atk": 400,
      "def": 20,
      "mob": 560,
      "acc": 560,
      "row": "back",
      "growth": {
        "hp": 130,
        "atk": 20,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "missionId": "pw-m-09",
        "note": "フルトン回収した兵士が、食堂班に配属される。"
      }
    },
    {
      "id": "pw-u-msf-cookb",
      "name": "MSF料理兵B",
      "role": "食堂班 / 料理兵 ランクB",
      "pilot": "",
      "mark": "食",
      "tags": [
        "生身",
        "MSF",
        "食堂班",
        "料理兵",
        "ランクB"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-cook-meal-B",
          "name": "温かい食事",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 5,
          "chance": 100,
          "maxUses": 0,
          "note": "食事で部隊の士気が上がる。",
          "target": "allies"
        }
      ],
      "weapons": [
        {
          "name": "フライパン",
          "attackType": "melee",
          "damageType": "physical",
          "note": "意外と痛い。",
          "powerPct": 110,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 50,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 4380,
      "atk": 480,
      "def": 35,
      "mob": 560,
      "acc": 560,
      "row": "back",
      "growth": {
        "hp": 163,
        "atk": 24,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「医療班の増員」で配属される。"
      }
    },
    {
      "id": "pw-u-msf-cooka",
      "name": "MSF料理兵A",
      "role": "食堂班 / 料理兵 ランクA",
      "pilot": "",
      "mark": "食",
      "tags": [
        "生身",
        "MSF",
        "食堂班",
        "料理兵",
        "ランクA"
      ],
      "ability": "",
      "deploy": {
        "player": true,
        "enemy": false
      },
      "skills": [
        {
          "id": "pw-s-cook-meal-A",
          "name": "温かい食事",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 6,
          "chance": 100,
          "maxUses": 0,
          "note": "食事で部隊の士気が上がる。",
          "target": "allies"
        }
      ],
      "weapons": [
        {
          "name": "フライパン",
          "attackType": "melee",
          "damageType": "physical",
          "note": "意外と痛い。",
          "powerPct": 110,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 50,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 5250,
      "atk": 580,
      "def": 50,
      "mob": 560,
      "acc": 560,
      "row": "back",
      "growth": {
        "hp": 195,
        "atk": 29,
        "def": 3,
        "mob": 16,
        "acc": 18
      },
      "crew": "none",
      "recruit": {
        "locked": true,
        "note": "研究「フルトン改良」で、熟練の料理兵が配属される。"
      }
    },
    {
      "id": "pw-e-soldier",
      "name": "ピース・セントリー兵",
      "role": "武装勢力の兵士",
      "pilot": "",
      "mark": "兵",
      "tags": [
        "生身",
        "武装勢力"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [],
      "weapons": [
        {
          "name": "アサルトライフル",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 36
        }
      ],
      "hp": 3500,
      "atk": 525,
      "def": 10,
      "mob": 560,
      "acc": 520,
      "exp": 438,
      "crew": "none"
    },
    {
      "id": "pw-e-heavy",
      "name": "重火器兵",
      "role": "機関銃を持つ兵士",
      "pilot": "",
      "mark": "重",
      "tags": [
        "生身",
        "武装勢力"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [],
      "weapons": [
        {
          "name": "機関銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 3,
          "hitsMax": 6,
          "hitPowerPct": 22
        },
        {
          "name": "手榴弾",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 130,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 2,
          "weight": 0.5,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1
        }
      ],
      "hp": 5400,
      "atk": 650,
      "def": 60,
      "mob": 420,
      "acc": 500,
      "row": "front",
      "exp": 675,
      "crew": "none"
    },
    {
      "id": "pw-e-sniper",
      "name": "武装勢力の狙撃兵",
      "role": "遠くから狙う兵士",
      "pilot": "",
      "mark": "狙",
      "tags": [
        "生身",
        "武装勢力"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [],
      "weapons": [
        {
          "name": "狙撃銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 180,
          "accuracyPt": 25,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 100,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 3600,
      "atk": 815,
      "def": 10,
      "mob": 520,
      "acc": 760,
      "row": "back",
      "exp": 450,
      "crew": "none"
    },
    {
      "id": "pw-e-at",
      "name": "対戦車兵",
      "role": "ロケットランチャーの兵士",
      "pilot": "",
      "mark": "対",
      "tags": [
        "生身",
        "武装勢力"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [],
      "weapons": [
        {
          "name": "携行ロケット",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 210,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 150,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "effects": [
            {
              "timing": "before",
              "effect": "tag_damage_up_pct",
              "value": 20,
              "tag": "兵器"
            }
          ]
        },
        {
          "name": "拳銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 80,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.4,
          "minDamage": 25,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 60
        }
      ],
      "hp": 4200,
      "atk": 700,
      "def": 20,
      "mob": 480,
      "acc": 560,
      "row": "back",
      "exp": 525,
      "crew": "none"
    },
    {
      "id": "pw-e-cia",
      "name": "CIA工作員",
      "role": "拳銃の諜報員",
      "pilot": "",
      "mark": "工",
      "tags": [
        "生身",
        "CIA",
        "工作員"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [],
      "weapons": [
        {
          "name": "拳銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 105,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 40,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 40
        },
        {
          "name": "スタングレネード",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 90,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.5,
          "minDamage": 40,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 1,
          "effects": [
            {
              "timing": "after",
              "effect": "acc_down_pct",
              "value": 20,
              "when": "hit",
              "duration": 2
            }
          ]
        }
      ],
      "hp": 5000,
      "atk": 800,
      "def": 30,
      "mob": 700,
      "acc": 720,
      "exp": 625,
      "crew": "none"
    },
    {
      "id": "pw-e-cipher",
      "name": "サイファーの兵士",
      "role": "精鋭の兵士",
      "pilot": "",
      "mark": "サ",
      "tags": [
        "生身",
        "サイファー",
        "精鋭"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [],
      "weapons": [
        {
          "name": "ケースレスライフル",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 115,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 50,
          "hitsMin": 3,
          "hitsMax": 4,
          "hitPowerPct": 30
        },
        {
          "name": "ナイフ",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 140,
          "accuracyPt": 15,
          "critPt": 10,
          "targetCount": 1,
          "weight": 0.6,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 5700,
      "atk": 950,
      "def": 50,
      "mob": 720,
      "acc": 760,
      "exp": 713,
      "crew": "none"
    },
    {
      "id": "pw-e-coldman",
      "name": "ホット・コールドマン",
      "role": "CIA中米支局長",
      "pilot": "",
      "mark": "コ",
      "tags": [
        "生身",
        "CIA",
        "指揮官"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "pw-s-cold-order",
          "name": "指揮官の号令",
          "trigger": "battle_start",
          "effect": "atk_up_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "target": "allies",
          "duration": 3
        }
      ],
      "weapons": [
        {
          "name": "拳銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 120,
          "accuracyPt": 20,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 60,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 42
        },
        {
          "name": "核の脅し",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.6,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "effects": [
            {
              "timing": "after",
              "effect": "atk_down_pct",
              "value": 15,
              "when": "hit",
              "duration": 2
            }
          ]
        }
      ],
      "hp": 13500,
      "atk": 1125,
      "def": 70,
      "mob": 600,
      "acc": 780,
      "exp": 1688,
      "crew": "none"
    },
    {
      "id": "pw-e-zadornov",
      "name": "ガルベス（ザドルノフ）",
      "role": "正体を隠していたソ連の工作員",
      "pilot": "",
      "mark": "ザ",
      "tags": [
        "生身",
        "KGB",
        "工作員"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "pw-s-zad-cover",
          "name": "偽りの教授",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 12,
          "chance": 40,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "拳銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 115,
          "accuracyPt": 20,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 60,
          "hitsMin": 2,
          "hitsMax": 3,
          "hitPowerPct": 42
        },
        {
          "name": "格闘",
          "attackType": "melee",
          "damageType": "physical",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 15,
          "critPt": 10,
          "targetCount": 1,
          "weight": 0.7,
          "minDamage": 100,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "hp": 12300,
      "atk": 1075,
      "def": 60,
      "mob": 740,
      "acc": 800,
      "exp": 1538,
      "crew": "none"
    },
    {
      "id": "pw-e-paz",
      "name": "パス",
      "role": "サイファーに通じていた少女",
      "pilot": "",
      "mark": "パ",
      "tags": [
        "生身",
        "サイファー",
        "内通者"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "pw-s-paz-shield",
          "name": "ZEKEの装甲",
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
          "name": "ケースレスハンドガン",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 20,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 50,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 34
        },
        {
          "name": "ZEKEの操作",
          "attackType": "ranged",
          "damageType": "special",
          "note": "",
          "powerPct": 160,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.6,
          "minDamage": 100,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff4466",
          "effects": [
            {
              "timing": "after",
              "effect": "acc_down_pct",
              "value": 15,
              "when": "hit",
              "duration": 2
            }
          ]
        }
      ],
      "hp": 9100,
      "atk": 900,
      "def": 30,
      "mob": 800,
      "acc": 820,
      "row": "back",
      "exp": 1138,
      "crew": "none"
    },
    {
      "id": "pw-e-lav",
      "name": "LAV-typeG",
      "role": "装甲車",
      "pilot": "",
      "mark": "L",
      "tags": [
        "兵器",
        "機械",
        "装甲車"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "pw-s-lav-armor",
          "name": "装甲",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 12,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "機関砲",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 105,
          "accuracyPt": 8,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 40,
          "hitsMin": 3,
          "hitsMax": 5,
          "hitPowerPct": 26
        },
        {
          "name": "主砲",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 220,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 1,
          "weight": 0.6,
          "minDamage": 200,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 3
        }
      ],
      "hp": 36400,
      "atk": 1010,
      "def": 130,
      "mob": 420,
      "acc": 600,
      "row": "front",
      "exp": 4550,
      "crew": "none"
    },
    {
      "id": "pw-e-t72",
      "name": "T-72U",
      "role": "戦車",
      "pilot": "",
      "mark": "T",
      "tags": [
        "兵器",
        "機械",
        "戦車"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "pw-s-t72-armor",
          "name": "複合装甲",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 18,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "同軸機銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 95,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 3,
          "hitsMax": 5,
          "hitPowerPct": 22
        },
        {
          "name": "125mm砲",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 270,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 2,
          "weight": 0.6,
          "minDamage": 240,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 3,
          "fxColor": "#ff6633"
        }
      ],
      "hp": 52000,
      "atk": 1260,
      "def": 170,
      "mob": 380,
      "acc": 620,
      "row": "front",
      "exp": 6500,
      "crew": "none"
    },
    {
      "id": "pw-e-pupa",
      "name": "ピューパ",
      "role": "小型の無人兵器",
      "pilot": "",
      "mark": "ピ",
      "tags": [
        "兵器",
        "機械",
        "無人兵器",
        "ピースウォーカー系"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [],
      "weapons": [
        {
          "name": "機関砲",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 100,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 3,
          "hitsMax": 6,
          "hitPowerPct": 20
        },
        {
          "name": "ミサイル",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 180,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.6,
          "minDamage": 140,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff8844"
        }
      ],
      "hp": 64000,
      "atk": 1170,
      "def": 100,
      "mob": 780,
      "acc": 700,
      "row": "back",
      "exp": 8000,
      "crew": "none"
    },
    {
      "id": "pw-e-mi24",
      "name": "Mi-24A",
      "role": "戦闘ヘリ",
      "pilot": "",
      "mark": "ミ",
      "tags": [
        "兵器",
        "機械",
        "ヘリ"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "pw-s-mi24-fly",
          "name": "機動力",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 15,
          "chance": 50,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "機関砲",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 105,
          "accuracyPt": 12,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 3,
          "hitsMax": 6,
          "hitPowerPct": 20
        },
        {
          "name": "ロケット弾ポッド",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 4,
          "weight": 0.6,
          "minDamage": 110,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff7733"
        }
      ],
      "hp": 108000,
      "atk": 1470,
      "def": 100,
      "mob": 860,
      "acc": 740,
      "row": "back",
      "exp": 13500,
      "crew": "none"
    },
    {
      "id": "pw-e-chrysalis",
      "name": "クリサリス",
      "role": "AI兵器の第2形態",
      "pilot": "",
      "mark": "ク",
      "tags": [
        "兵器",
        "機械",
        "無人兵器",
        "ピースウォーカー系"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [],
      "weapons": [
        {
          "name": "機関砲",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 105,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 3,
          "hitsMax": 6,
          "hitPowerPct": 20
        },
        {
          "name": "ミサイル",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 190,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.6,
          "minDamage": 160,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 3
        },
        {
          "name": "レーザー砲",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 230,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 2,
          "weight": 0.5,
          "minDamage": 200,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff3366"
        }
      ],
      "hp": 54400,
      "atk": 1325,
      "def": 150,
      "mob": 700,
      "acc": 780,
      "row": "back",
      "exp": 6800,
      "crew": "none"
    },
    {
      "id": "pw-e-cocoon",
      "name": "コクーン",
      "role": "AI兵器の第3形態",
      "pilot": "",
      "mark": "コ",
      "tags": [
        "兵器",
        "機械",
        "無人兵器",
        "ピースウォーカー系"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "pw-s-cocoon-armor",
          "name": "厚い装甲",
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
          "name": "機関砲",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 105,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 4,
          "hitsMax": 6,
          "hitPowerPct": 20
        },
        {
          "name": "ミサイルポッド",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 200,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 4,
          "weight": 0.6,
          "minDamage": 170,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 3
        },
        {
          "name": "火炎放射",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.6,
          "minDamage": 100,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "burn",
              "value": 150,
              "when": "hit",
              "duration": 2
            }
          ]
        }
      ],
      "hp": 64400,
      "atk": 1375,
      "def": 170,
      "mob": 620,
      "acc": 780,
      "row": "front",
      "exp": 8050,
      "crew": "none"
    },
    {
      "id": "pw-e-pw1",
      "name": "ピースウォーカー",
      "role": "AI搭載の核搭載兵器",
      "pilot": "",
      "mark": "P",
      "tags": [
        "兵器",
        "機械",
        "無人兵器",
        "ピースウォーカー系",
        "核搭載"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "pw-s-pw-ai",
          "name": "AIの照準",
          "trigger": "before_attack",
          "effect": "hit_up_pt",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "機関砲",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 4,
          "hitsMax": 6,
          "hitPowerPct": 20
        },
        {
          "name": "ミサイル発射管",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 210,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 4,
          "weight": 0.6,
          "minDamage": 180,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 3,
          "fxColor": "#ff7733"
        },
        {
          "name": "火炎放射器",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 150,
          "accuracyPt": 15,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.5,
          "minDamage": 100,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "effects": [
            {
              "timing": "after",
              "effect": "burn",
              "value": 180,
              "when": "hit",
              "duration": 2
            }
          ]
        }
      ],
      "hp": 70400,
      "atk": 1430,
      "def": 180,
      "mob": 520,
      "acc": 800,
      "row": "front",
      "exp": 8800,
      "crew": "none"
    },
    {
      "id": "pw-e-pw2",
      "name": "ピースウォーカー（改）",
      "role": "自己修復を覚えた形態",
      "pilot": "",
      "mark": "P",
      "tags": [
        "兵器",
        "機械",
        "無人兵器",
        "ピースウォーカー系",
        "核搭載"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "pw-s-pw2-repair",
          "name": "自己修復",
          "trigger": "turn_end",
          "effect": "heal_maxhp_pct",
          "value": 2,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "機関砲",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 110,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 4,
          "hitsMax": 6,
          "hitPowerPct": 22
        },
        {
          "name": "ミサイル発射管",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 220,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 4,
          "weight": 0.6,
          "minDamage": 190,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 3
        },
        {
          "name": "レーザー砲",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 250,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.5,
          "minDamage": 220,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff3366"
        }
      ],
      "hp": 88000,
      "atk": 1535,
      "def": 190,
      "mob": 540,
      "acc": 820,
      "row": "front",
      "exp": 11000,
      "crew": "none"
    },
    {
      "id": "pw-e-pw3",
      "name": "ピースウォーカー（暴走）",
      "role": "AIが暴走した最後の形態",
      "pilot": "",
      "mark": "P",
      "tags": [
        "兵器",
        "機械",
        "無人兵器",
        "ピースウォーカー系",
        "核搭載"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "pw-s-pw3-rampage",
          "name": "暴走",
          "trigger": "battle_start",
          "effect": "atk_up_pct",
          "value": 15,
          "chance": 100,
          "maxUses": 1,
          "note": "",
          "duration": 3
        },
        {
          "id": "pw-s-pw3-ai",
          "name": "AIの照準",
          "trigger": "before_attack",
          "effect": "hit_up_pt",
          "value": 15,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "機関砲",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 115,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 4,
          "hitsMax": 6,
          "hitPowerPct": 22
        },
        {
          "name": "ミサイル一斉射",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 230,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 6,
          "weight": 0.6,
          "minDamage": 200,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 3,
          "fxColor": "#ff5533"
        },
        {
          "name": "レーザー砲",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 270,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 3,
          "weight": 0.5,
          "minDamage": 240,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ff3366"
        }
      ],
      "hp": 48000,
      "atk": 1190,
      "def": 200,
      "mob": 560,
      "acc": 840,
      "row": "front",
      "exp": 6000,
      "crew": "none"
    },
    {
      "id": "pw-e-zeke",
      "name": "メタルギアZEKE",
      "role": "二足歩行の核搭載兵器",
      "pilot": "",
      "mark": "Z",
      "tags": [
        "兵器",
        "機械",
        "無人兵器",
        "メタルギア",
        "核搭載"
      ],
      "ability": "",
      "deploy": {
        "player": false,
        "enemy": true
      },
      "skills": [
        {
          "id": "pw-s-zeke-armor",
          "name": "電磁装甲",
          "trigger": "when_targeted",
          "effect": "damage_reduce_pct",
          "value": 12,
          "chance": 100,
          "maxUses": 0,
          "note": ""
        }
      ],
      "weapons": [
        {
          "name": "機関砲",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 115,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 1,
          "weight": 1,
          "minDamage": 30,
          "hitsMin": 4,
          "hitsMax": 7,
          "hitPowerPct": 20
        },
        {
          "name": "レールガン",
          "attackType": "ranged",
          "damageType": "beam",
          "note": "",
          "powerPct": 300,
          "accuracyPt": 10,
          "critPt": 0,
          "targetCount": 2,
          "weight": 0.6,
          "minDamage": 280,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 3,
          "fxColor": "#66ccff"
        },
        {
          "name": "核ミサイルの脅し",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "",
          "powerPct": 200,
          "accuracyPt": 5,
          "critPt": 0,
          "targetCount": 6,
          "weight": 0.5,
          "minDamage": 150,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100,
          "usesPerBattle": 2,
          "fxColor": "#ffcc33"
        }
      ],
      "hp": 71500,
      "atk": 1755,
      "def": 210,
      "mob": 600,
      "acc": 850,
      "row": "front",
      "exp": 8938,
      "crew": "none"
    }
  ],
  "missions": [
    {
      "id": "pw-m-01",
      "name": "序章 資材搬入施設調査",
      "diff": "E",
      "reward": 1500,
      "desc": "コスタリカの山中にある資材搬入施設を調べる。まずはスネーク1人の潜入から。",
      "terrain": "熱帯雨林",
      "tags": [
        "序章"
      ],
      "rules": [],
      "enemies": [
        "pw-e-soldier",
        "pw-e-soldier",
        "pw-e-soldier"
      ],
      "maxDeploy": 2,
      "drops": [
        {
          "itemId": "pw-i-ration",
          "chance": 80,
          "min": 1,
          "max": 2
        }
      ],
      "story": {
        "before": [
          {
            "speaker": "カズヒラ・ミラー",
            "text": "スネーク、依頼主の大学教授が言うには、山の施設に武装勢力が出入りしているらしい"
          },
          {
            "speaker": "スネーク",
            "text": "様子を見てくる。見つからないようにな"
          }
        ],
        "after": [
          {
            "speaker": "スネーク",
            "text": "ただの資材置き場じゃない。誰かがここで何かを準備している"
          }
        ]
      },
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
      ]
    },
    {
      "id": "pw-m-02",
      "name": "第1章 アマンダ追跡",
      "diff": "D",
      "reward": 2500,
      "desc": "サンディニスタの女性戦士アマンダが武装勢力に追われている。アマンダを守りながら敵を倒す。",
      "terrain": "熱帯雨林",
      "tags": [
        "第1章"
      ],
      "rules": [],
      "enemies": [
        "pw-e-soldier",
        "pw-e-soldier",
        "pw-e-heavy",
        "pw-e-sniper"
      ],
      "maxDeploy": 4,
      "drops": [
        {
          "itemId": "pw-i-medkit",
          "chance": 70,
          "min": 1,
          "max": 1
        }
      ],
      "enemyRows": [
        "front",
        "front",
        "front",
        "back"
      ],
      "objective": {
        "type": "escort",
        "escortUnitId": "pw-u-amanda"
      },
      "waves": [
        {
          "enemies": [
            "pw-e-soldier",
            "pw-e-soldier",
            "pw-e-at"
          ],
          "when": "turn",
          "rows": [
            "front",
            "front",
            "back"
          ],
          "value": 3,
          "label": "追っ手の増援"
        }
      ],
      "requires": {
        "missions": [
          "pw-m-01"
        ]
      },
      "story": {
        "before": [
          {
            "speaker": "アマンダ",
            "text": "話はあとよ！ 追っ手がすぐそこまで来てる"
          },
          {
            "speaker": "スネーク",
            "text": "ついてこい。敵は俺が引きつける"
          }
        ],
        "after": [
          {
            "speaker": "アマンダ",
            "text": "……助かったわ。あなたたち、ただの傭兵じゃなさそうね"
          }
        ]
      },
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "no_loss"
        },
        {
          "type": "hp_ge",
          "value": 60
        }
      ]
    },
    {
      "id": "pw-m-03",
      "name": "第1章 対装甲車戦 LAV-typeG",
      "diff": "C",
      "reward": 4000,
      "desc": "装甲車が道をふさいでいる。主砲に注意しながら、ロケットランチャーで装甲を崩せ。",
      "terrain": "熱帯雨林",
      "tags": [
        "第1章",
        "ボス"
      ],
      "rules": [],
      "enemies": [
        "pw-e-lav",
        "pw-e-soldier",
        "pw-e-soldier",
        "pw-e-at"
      ],
      "maxDeploy": 4,
      "drops": [
        {
          "itemId": "pw-i-caseless",
          "chance": 70,
          "min": 1,
          "max": 1
        }
      ],
      "enemyRows": [
        "front",
        "back",
        "back",
        "back"
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 0
      },
      "requires": {
        "missions": [
          "pw-m-02"
        ]
      },
      "story": {
        "before": [
          {
            "speaker": "カズヒラ・ミラー",
            "text": "装甲車だ。生身の身体じゃ歯が立たない、対戦車の装備を使え"
          }
        ],
        "after": [
          {
            "speaker": "スネーク",
            "text": "ひとまず、道は開けた"
          }
        ]
      },
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "no_loss"
        },
        {
          "type": "turns_le",
          "value": 14
        }
      ],
      "starReward": 1500
    },
    {
      "id": "pw-m-04",
      "name": "第1章 チコ救出",
      "diff": "C",
      "reward": 3500,
      "desc": "武装勢力に捕まった少年チコを助け出す。チコを守り切れ。敵が残り少なくなると増援が来る。",
      "terrain": "熱帯雨林",
      "tags": [
        "第1章"
      ],
      "rules": [],
      "enemies": [
        "pw-e-soldier",
        "pw-e-soldier",
        "pw-e-heavy",
        "pw-e-heavy"
      ],
      "maxDeploy": 5,
      "drops": [
        {
          "itemId": "pw-i-ration",
          "chance": 80,
          "min": 1,
          "max": 2
        },
        {
          "itemId": "pw-i-crate",
          "chance": 40,
          "min": 1,
          "max": 1
        }
      ],
      "enemyRows": [
        "back",
        "back",
        "front",
        "front"
      ],
      "objective": {
        "type": "escort",
        "escortUnitId": "pw-u-chico"
      },
      "waves": [
        {
          "enemies": [
            "pw-e-heavy",
            "pw-e-sniper",
            "pw-e-heavy",
            "pw-e-at"
          ],
          "when": "remaining",
          "rows": [
            "front",
            "back",
            "front",
            "back"
          ],
          "value": 2,
          "label": "見張りの増援"
        }
      ],
      "requires": {
        "missions": [
          "pw-m-02"
        ]
      },
      "story": {
        "before": [
          {
            "speaker": "アマンダ",
            "text": "あの子は私の仲間の弟。無事に連れ戻したいの"
          },
          {
            "speaker": "スネーク",
            "text": "必ず助ける。行くぞ"
          }
        ],
        "after": [
          {
            "speaker": "チコ",
            "text": "ありがとう！ 俺も何か手伝えることはない？"
          }
        ]
      },
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
      ]
    },
    {
      "id": "pw-m-05",
      "name": "第1章 ジャングルトレイン追跡",
      "diff": "C",
      "reward": 4500,
      "desc": "密林を走る貨物列車を追う。20TURNのうちに追いつかなければ逃げられてしまう。敵はTURNごとに増援を出してくる。",
      "terrain": "熱帯雨林",
      "tags": [
        "第1章"
      ],
      "rules": [
        {
          "type": "turn_limit",
          "value": 20
        }
      ],
      "enemies": [
        "pw-e-soldier",
        "pw-e-heavy",
        "pw-e-soldier",
        "pw-e-heavy"
      ],
      "maxDeploy": 5,
      "drops": [
        {
          "itemId": "pw-i-gmp",
          "chance": 60,
          "min": 1,
          "max": 2
        },
        {
          "itemId": "pw-i-medkit",
          "chance": 60,
          "min": 1,
          "max": 1
        }
      ],
      "waves": [
        {
          "enemies": [
            "pw-e-soldier",
            "pw-e-soldier",
            "pw-e-at",
            "pw-e-sniper"
          ],
          "when": "turn",
          "rows": [
            "front",
            "front",
            "back",
            "back"
          ],
          "value": 4,
          "label": "貨車の護衛"
        },
        {
          "enemies": [
            "pw-e-heavy",
            "pw-e-sniper",
            "pw-e-soldier",
            "pw-e-at"
          ],
          "when": "turn",
          "rows": [
            "front",
            "back",
            "front",
            "back"
          ],
          "value": 8,
          "label": "最後尾の見張り"
        }
      ],
      "requires": {
        "missions": [
          "pw-m-03",
          "pw-m-04"
        ]
      },
      "story": {
        "before": [
          {
            "speaker": "カズヒラ・ミラー",
            "text": "あの列車に武器が積まれている。逃がすな"
          },
          {
            "speaker": "チコ",
            "text": "線路沿いに近道があるよ！"
          }
        ],
        "after": [
          {
            "speaker": "スネーク",
            "text": "積み荷は兵器の部品だ。やはり、これだけの武装勢力が背後にいる"
          }
        ]
      },
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
      ]
    },
    {
      "id": "pw-m-06",
      "name": "第1章 対戦車戦 T-72U",
      "diff": "B",
      "reward": 6000,
      "desc": "旧ソ連製の戦車が立ちはだかる。複合装甲を崩し、主砲を撃たせる前に倒せ。",
      "terrain": "熱帯雨林",
      "tags": [
        "第1章",
        "ボス"
      ],
      "rules": [],
      "enemies": [
        "pw-e-t72",
        "pw-e-at",
        "pw-e-at",
        "pw-e-soldier"
      ],
      "maxDeploy": 6,
      "drops": [
        {
          "itemId": "pw-i-caseless",
          "chance": 70,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "pw-i-crate",
          "chance": 50,
          "min": 1,
          "max": 1
        }
      ],
      "enemyRows": [
        "front",
        "back",
        "back",
        "back"
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 0
      },
      "requires": {
        "missions": [
          "pw-m-05"
        ]
      },
      "story": {
        "before": [
          {
            "speaker": "カズヒラ・ミラー",
            "text": "戦車まで持ち出してきたか。正面から撃ち合うな、側面から崩せ"
          }
        ],
        "after": [
          {
            "speaker": "スネーク",
            "text": "これで終わりじゃない。基地の奥に、まだ何かある"
          }
        ]
      },
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "no_loss"
        },
        {
          "type": "turns_le",
          "value": 16
        }
      ],
      "starReward": 2000
    },
    {
      "id": "pw-m-07",
      "name": "第1章 火口内基地・対ピューパ戦",
      "diff": "B",
      "reward": 7000,
      "desc": "火山の火口の中に武装勢力の基地があった。見張りを倒すと、AI兵器「ピューパ」が出てくる。ピューパを倒せば勝利。",
      "terrain": "火口内",
      "tags": [
        "第1章",
        "ボス"
      ],
      "rules": [],
      "enemies": [
        "pw-e-soldier",
        "pw-e-heavy",
        "pw-e-heavy",
        "pw-e-sniper"
      ],
      "maxDeploy": 6,
      "drops": [
        {
          "itemId": "pw-i-manual",
          "chance": 100,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "pw-i-medkit",
          "chance": 60,
          "min": 1,
          "max": 2
        }
      ],
      "enemyRows": [
        "front",
        "front",
        "front",
        "back"
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 0,
        "bossWave": 1
      },
      "waves": [
        {
          "enemies": [
            "pw-e-pupa",
            "pw-e-soldier",
            "pw-e-at"
          ],
          "when": "cleared",
          "rows": [
            "back",
            "front",
            "back"
          ],
          "label": "無人兵器 ピューパ"
        }
      ],
      "requires": {
        "missions": [
          "pw-m-06"
        ]
      },
      "story": {
        "before": [
          {
            "speaker": "スネーク",
            "text": "火口の中に基地だと？ 見つからないわけだ"
          },
          {
            "speaker": "カズヒラ・ミラー",
            "text": "待て、動くものがある。人が乗っていない……無人の兵器だ"
          }
        ],
        "after": [
          {
            "speaker": "スネーク",
            "text": "AIで動く兵器か。厄介なものを作ってる連中だ"
          }
        ]
      },
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "turns_le",
          "value": 18
        },
        {
          "type": "no_loss"
        }
      ],
      "starReward": 2500
    },
    {
      "id": "pw-m-08",
      "name": "第2章 雲霧林・対戦闘ヘリ戦 Mi-24A",
      "diff": "B",
      "reward": 7500,
      "desc": "霧深い森の研究施設へ向かう道で、戦闘ヘリが空から襲ってくる。敵が残り1体になると、ヘリが上空に現れる。",
      "terrain": "雲霧林",
      "tags": [
        "第2章",
        "ボス"
      ],
      "rules": [],
      "enemies": [
        "pw-e-soldier",
        "pw-e-sniper",
        "pw-e-at",
        "pw-e-heavy"
      ],
      "maxDeploy": 6,
      "drops": [
        {
          "itemId": "pw-i-stealth",
          "chance": 40,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "pw-i-crate",
          "chance": 50,
          "min": 1,
          "max": 1
        }
      ],
      "enemyRows": [
        "front",
        "back",
        "back",
        "front"
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 0,
        "bossWave": 1
      },
      "waves": [
        {
          "enemies": [
            "pw-e-mi24",
            "pw-e-at"
          ],
          "when": "remaining",
          "rows": [
            "back",
            "back"
          ],
          "value": 1,
          "label": "戦闘ヘリ"
        }
      ],
      "requires": {
        "missions": [
          "pw-m-07"
        ]
      },
      "story": {
        "before": [
          {
            "speaker": "カズヒラ・ミラー",
            "text": "この霧だ、上から丸見えなのはこっちだけだぞ"
          },
          {
            "speaker": "スネーク",
            "text": "対空ロケットを用意する。撃ち落とす"
          }
        ],
        "after": [
          {
            "speaker": "スネーク",
            "text": "ヘリまで出してくるとはな。研究施設は近い"
          }
        ]
      },
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "turns_le",
          "value": 18
        },
        {
          "type": "no_loss"
        }
      ],
      "starReward": 2500
    },
    {
      "id": "pw-m-09",
      "name": "第2章 研究施設・対クリサリス戦",
      "diff": "A",
      "reward": 9000,
      "desc": "研究施設の奥で、さらに強いAI兵器「クリサリス」が待ち構えている。敵が残り2体になると、クリサリスが出てくる。",
      "terrain": "地下基地",
      "tags": [
        "第2章",
        "ボス"
      ],
      "rules": [],
      "enemies": [
        "pw-e-heavy",
        "pw-e-soldier",
        "pw-e-sniper",
        "pw-e-soldier"
      ],
      "maxDeploy": 7,
      "drops": [
        {
          "itemId": "pw-i-manual",
          "chance": 100,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "pw-i-fulton",
          "chance": 60,
          "min": 1,
          "max": 1
        }
      ],
      "enemyRows": [
        "front",
        "front",
        "back",
        "back"
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 0,
        "bossWave": 1
      },
      "waves": [
        {
          "enemies": [
            "pw-e-chrysalis",
            "pw-e-heavy"
          ],
          "when": "remaining",
          "rows": [
            "back",
            "front"
          ],
          "value": 2,
          "label": "無人兵器 クリサリス"
        }
      ],
      "requires": {
        "missions": [
          "pw-m-08"
        ],
        "minLevel": 3
      },
      "story": {
        "before": [
          {
            "speaker": "スネーク",
            "text": "ここが研究施設か。……見られている。気をつけろ"
          },
          {
            "speaker": "カズヒラ・ミラー",
            "text": "AIの兵器がこの先に何台も眠ってるんだ。ここで止めないと"
          }
        ],
        "after": [
          {
            "speaker": "スネーク",
            "text": "これで、AI兵器の正体が少しずつ見えてきた"
          }
        ]
      },
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "turns_le",
          "value": 20
        },
        {
          "type": "no_loss"
        }
      ],
      "starReward": 3000
    },
    {
      "id": "pw-m-10",
      "name": "第3章 採掘場・対コクーン戦",
      "diff": "A",
      "reward": 10000,
      "desc": "採掘場に偽装した基地の奥に、さらに大きなAI兵器「コクーン」がいる。まず武装勢力を退け、そのあとコクーンが出る。",
      "terrain": "火口内",
      "tags": [
        "第3章",
        "ボス"
      ],
      "rules": [],
      "enemies": [
        "pw-e-soldier",
        "pw-e-soldier",
        "pw-e-heavy"
      ],
      "maxDeploy": 8,
      "drops": [
        {
          "itemId": "pw-i-box",
          "chance": 60,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "pw-i-crate",
          "chance": 60,
          "min": 1,
          "max": 2
        }
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 0,
        "bossWave": 2
      },
      "waves": [
        {
          "enemies": [
            "pw-e-at",
            "pw-e-sniper",
            "pw-e-heavy"
          ],
          "when": "cleared",
          "rows": [
            "back",
            "back",
            "front"
          ],
          "label": "基地の守備隊"
        },
        {
          "enemies": [
            "pw-e-cocoon",
            "pw-e-soldier"
          ],
          "when": "cleared",
          "rows": [
            "front",
            "back"
          ],
          "label": "無人兵器 コクーン"
        }
      ],
      "requires": {
        "missions": [
          "pw-m-09"
        ]
      },
      "story": {
        "before": [
          {
            "speaker": "アマンダ",
            "text": "採掘場の下に基地があるなんて。入口は私が案内するわ"
          },
          {
            "speaker": "スネーク",
            "text": "頼む。中の兵器は、数が多い"
          }
        ],
        "after": [
          {
            "speaker": "スネーク",
            "text": "コクーンも止めた。残るのは、ピースウォーカーとその設計者たちだ"
          }
        ]
      },
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "turns_le",
          "value": 22
        },
        {
          "type": "no_loss"
        }
      ],
      "starReward": 3500
    },
    {
      "id": "pw-m-11",
      "name": "第3章 地下基地・独房からの脱出",
      "diff": "A",
      "reward": 9000,
      "desc": "地下基地の独房に、ピースウォーカーの設計者ヒューイが捕らえられている。ヒューイを守りながら基地を抜け出せ。",
      "terrain": "地下基地",
      "tags": [
        "第3章"
      ],
      "rules": [],
      "enemies": [
        "pw-e-cia",
        "pw-e-cia",
        "pw-e-heavy",
        "pw-e-heavy"
      ],
      "maxDeploy": 6,
      "drops": [
        {
          "itemId": "pw-i-medkit",
          "chance": 70,
          "min": 1,
          "max": 2
        },
        {
          "itemId": "pw-i-fulton",
          "chance": 50,
          "min": 1,
          "max": 1
        }
      ],
      "enemyRows": [
        "front",
        "back",
        "front",
        "front"
      ],
      "objective": {
        "type": "escort",
        "escortUnitId": "pw-u-huey"
      },
      "waves": [
        {
          "enemies": [
            "pw-e-cia",
            "pw-e-sniper",
            "pw-e-heavy",
            "pw-e-at"
          ],
          "when": "turn",
          "rows": [
            "front",
            "back",
            "front",
            "back"
          ],
          "value": 3,
          "label": "追跡部隊"
        },
        {
          "enemies": [
            "pw-e-cipher",
            "pw-e-cipher",
            "pw-e-sniper"
          ],
          "when": "turn",
          "rows": [
            "front",
            "front",
            "back"
          ],
          "value": 6,
          "label": "サイファーの兵士"
        }
      ],
      "requires": {
        "missions": [
          "pw-m-10"
        ]
      },
      "story": {
        "before": [
          {
            "speaker": "ヒューイ・エメリッヒ",
            "text": "わ、私は味方だ！ ピースウォーカーのことなら何でも教える。ここから出してくれ"
          },
          {
            "speaker": "スネーク",
            "text": "走れるか。ついてこい"
          }
        ],
        "after": [
          {
            "speaker": "ヒューイ・エメリッヒ",
            "text": "……ありがたい。あの兵器は、人間の判断を奪ってしまうんだ"
          }
        ]
      },
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
      ]
    },
    {
      "id": "pw-m-12",
      "name": "第3章 対ピースウォーカー戦",
      "diff": "S",
      "reward": 13000,
      "desc": "とうとうAI兵器「ピースウォーカー」と対決する。ボスのHPが半分になると、守備隊が駆けつける。AI基板を手に入れろ。",
      "terrain": "火口内",
      "tags": [
        "第3章",
        "ボス"
      ],
      "rules": [
        {
          "type": "turn_limit",
          "value": 30
        }
      ],
      "enemies": [
        "pw-e-pw1",
        "pw-e-heavy"
      ],
      "maxDeploy": 8,
      "drops": [
        {
          "itemId": "pw-i-board",
          "chance": 100,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "pw-i-manual",
          "chance": 100,
          "min": 1,
          "max": 1
        }
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 0
      },
      "waves": [
        {
          "enemies": [
            "pw-e-cia",
            "pw-e-sniper",
            "pw-e-at"
          ],
          "when": "bossHp",
          "rows": [
            "front",
            "back",
            "back"
          ],
          "value": 50,
          "label": "基地の守備隊"
        }
      ],
      "requires": {
        "missions": [
          "pw-m-11"
        ],
        "minLevel": 5
      },
      "story": {
        "before": [
          {
            "speaker": "ヒューイ・エメリッヒ",
            "text": "あれがピースウォーカー……あの兵器の中枢はAI基板だ。そこを狙え"
          },
          {
            "speaker": "スネーク",
            "text": "全員、行くぞ。ここで止める"
          }
        ],
        "after": [
          {
            "speaker": "ヒューイ・エメリッヒ",
            "text": "AI基板だ。これがなければ、あの兵器は動かない……はずなんだが"
          }
        ]
      },
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "turns_le",
          "value": 24
        },
        {
          "type": "no_loss"
        }
      ],
      "starReward": 5000
    },
    {
      "id": "pw-m-13",
      "name": "第4章 ミサイル基地・対ピースウォーカー戦2",
      "diff": "S",
      "reward": 15000,
      "desc": "米軍のミサイル基地に潜入。敵を倒すと管制塔から指揮官が、さらにそのあと自己修復を覚えたピースウォーカー（改）が現れる。AI基板が必要。",
      "terrain": "米軍基地",
      "tags": [
        "第4章",
        "ボス"
      ],
      "rules": [
        {
          "type": "turn_limit",
          "value": 32
        }
      ],
      "enemies": [
        "pw-e-cia",
        "pw-e-soldier",
        "pw-e-heavy"
      ],
      "maxDeploy": 8,
      "drops": [
        {
          "itemId": "pw-i-box",
          "chance": 60,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "pw-i-crate",
          "chance": 100,
          "min": 1,
          "max": 2
        }
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 0,
        "bossWave": 2
      },
      "waves": [
        {
          "enemies": [
            "pw-e-coldman",
            "pw-e-cia"
          ],
          "when": "cleared",
          "rows": [
            "back",
            "front"
          ],
          "label": "CIA中米支局長"
        },
        {
          "enemies": [
            "pw-e-pw2",
            "pw-e-sniper"
          ],
          "when": "cleared",
          "rows": [
            "front",
            "back"
          ],
          "label": "ピースウォーカー（改）"
        }
      ],
      "requires": {
        "missions": [
          "pw-m-12"
        ],
        "items": [
          "pw-i-board"
        ],
        "minLevel": 6
      },
      "story": {
        "before": [
          {
            "speaker": "カズヒラ・ミラー",
            "text": "米軍基地だ。ここからピースウォーカーが核ミサイルを撃ちかねない"
          },
          {
            "speaker": "スネーク",
            "text": "コールドマンの狙いは、それを証明することか。止める"
          }
        ],
        "after": [
          {
            "speaker": "スネーク",
            "text": "AIは落ちた。だが、これで終わった気がしない"
          }
        ]
      },
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "turns_le",
          "value": 26
        },
        {
          "type": "no_loss"
        }
      ],
      "starReward": 5500
    },
    {
      "id": "pw-m-14",
      "name": "第4章 対ピースウォーカー戦3",
      "diff": "S",
      "reward": 16000,
      "desc": "暴走したピースウォーカーを、湖に沈むまで食い止める。8TURN耐えれば勝利。AIの研究者ストレンジラブを守り切れ。",
      "terrain": "米軍基地",
      "tags": [
        "第4章",
        "防衛"
      ],
      "rules": [],
      "enemies": [
        "pw-e-pw3"
      ],
      "maxDeploy": 8,
      "drops": [
        {
          "itemId": "pw-i-manual",
          "chance": 100,
          "min": 1,
          "max": 1
        },
        {
          "itemId": "pw-i-crate",
          "chance": 100,
          "min": 1,
          "max": 2
        }
      ],
      "objective": {
        "type": "defense",
        "turns": 8,
        "escortUnitId": "pw-u-strangelove"
      },
      "waves": [
        {
          "enemies": [
            "pw-e-cipher",
            "pw-e-cipher"
          ],
          "when": "turn",
          "value": 3,
          "label": "サイファーの兵士"
        },
        {
          "enemies": [
            "pw-e-cipher",
            "pw-e-sniper",
            "pw-e-heavy"
          ],
          "when": "turn",
          "rows": [
            "front",
            "back",
            "front"
          ],
          "value": 6,
          "label": "増援部隊"
        }
      ],
      "requires": {
        "missions": [
          "pw-m-13"
        ]
      },
      "story": {
        "before": [
          {
            "speaker": "ストレンジラブ",
            "text": "AIは「ザ・ボス」の人格を元にしてる。止まらないなら、湖に沈めるしかないわ"
          },
          {
            "speaker": "スネーク",
            "text": "そこまで耐える。博士、後ろから動くな"
          }
        ],
        "after": [
          {
            "speaker": "ストレンジラブ",
            "text": "……沈んだわ。あの子は、最後に核を撃たない道を選んだのね"
          }
        ]
      },
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
      "starReward": 6000
    },
    {
      "id": "pw-m-15",
      "name": "第5章 ザドルノフ捜索・対メタルギアZEKE戦",
      "diff": "S",
      "reward": 20000,
      "desc": "MSFの基地で、内通者がメタルギアZEKEを奪った。内通者と正体を現したガルベスを倒し、最後にZEKEを止めろ。ZEKEの撃破で勝利。",
      "terrain": "標準",
      "tags": [
        "第5章",
        "最終",
        "ボス"
      ],
      "rules": [
        {
          "type": "turn_limit",
          "value": 36
        }
      ],
      "enemies": [
        "pw-e-cipher",
        "pw-e-cipher",
        "pw-e-sniper"
      ],
      "maxDeploy": 8,
      "drops": [
        {
          "itemId": "pw-i-crate",
          "chance": 100,
          "min": 2,
          "max": 3
        },
        {
          "itemId": "pw-i-manual",
          "chance": 100,
          "min": 1,
          "max": 1
        }
      ],
      "enemyRows": [
        "front",
        "front",
        "back"
      ],
      "objective": {
        "type": "boss",
        "bossIndex": 0,
        "bossWave": 2
      },
      "waves": [
        {
          "enemies": [
            "pw-e-zadornov",
            "pw-e-cipher"
          ],
          "when": "cleared",
          "label": "ザドルノフ"
        },
        {
          "enemies": [
            "pw-e-zeke",
            "pw-e-paz"
          ],
          "when": "cleared",
          "rows": [
            "front",
            "back"
          ],
          "label": "メタルギアZEKE"
        }
      ],
      "requires": {
        "missions": [
          "pw-m-14"
        ],
        "minLevel": 8
      },
      "story": {
        "before": [
          {
            "speaker": "カズヒラ・ミラー",
            "text": "MSFの基地が襲われてる。内通者がいたんだ……ZEKEを奪われた"
          },
          {
            "speaker": "スネーク",
            "text": "MSFは俺たちの居場所だ。取り返す"
          }
        ],
        "after": [
          {
            "speaker": "スネーク",
            "text": "これで、MSFは守れた。俺たちは「国境なき軍隊」の道を歩き続ける"
          },
          {
            "speaker": "カズヒラ・ミラー",
            "text": "ああ。あんたは、俺たちのビッグボスだ"
          }
        ]
      },
      "stars": [
        {
          "type": "clear"
        },
        {
          "type": "turns_le",
          "value": 30
        },
        {
          "type": "no_loss"
        }
      ],
      "starReward": 8000
    },
    {
      "id": "pw-m-16",
      "name": "EXTRA OPS 資材回収",
      "diff": "C",
      "reward": 2500,
      "desc": "マザーベースの運営費を稼ぐ、くり返し挑める任務。何度でも挑める稼ぎ場。",
      "terrain": "標準",
      "tags": [
        "EXTRA OPS",
        "くり返し"
      ],
      "rules": [],
      "enemies": [
        "pw-e-soldier",
        "pw-e-soldier",
        "pw-e-heavy",
        "pw-e-sniper"
      ],
      "maxDeploy": 5,
      "drops": [
        {
          "itemId": "pw-i-gmp",
          "chance": 70,
          "min": 1,
          "max": 2
        },
        {
          "itemId": "pw-i-crate",
          "chance": 40,
          "min": 1,
          "max": 1
        }
      ],
      "requires": {
        "missions": [
          "pw-m-01"
        ]
      },
      "exp": 250
    }
  ],
  "items": [
    {
      "id": "pw-i-ration",
      "name": "携帯食料",
      "desc": "HPを最大HPの50%回復する。",
      "effect": {
        "type": "heal_hp_pct",
        "value": 50
      },
      "price": 600
    },
    {
      "id": "pw-i-medkit",
      "name": "医療キット",
      "desc": "生身のユニットのHPを2500回復する。",
      "requires": {
        "allTags": [
          "生身"
        ]
      },
      "effect": {
        "type": "heal_hp_flat",
        "value": 2500
      },
      "price": 700
    },
    {
      "id": "pw-i-gmp",
      "name": "GMP資材",
      "desc": "マザーベースの運営資金。3000の資金を得る。",
      "effect": {
        "type": "credits_gain",
        "value": 3000
      }
    },
    {
      "id": "pw-i-caseless",
      "name": "ケースレス弾の補給",
      "desc": "部隊全員、次の出撃だけATK+15%。",
      "effect": {
        "type": "sortie_buff",
        "stat": "atk",
        "value": 15
      },
      "price": 1200,
      "scope": "party"
    },
    {
      "id": "pw-i-fulton",
      "name": "フルトン回収装置",
      "desc": "回収した兵士の訓練に使う。経験値+150。",
      "effect": {
        "type": "exp_gain",
        "value": 150
      },
      "price": 1500
    },
    {
      "id": "pw-i-stealth",
      "name": "ステルス迷彩",
      "desc": "装備するとMOB+60。",
      "price": 2800,
      "equip": {
        "slot": "accessory",
        "stats": {
          "mob": 60
        },
        "skills": [],
        "weapons": []
      },
      "shop": {
        "requiresResearch": "pw-r-rd"
      }
    },
    {
      "id": "pw-i-box",
      "name": "段ボール箱",
      "desc": "装備するとDEF+30・最大HP+300。被弾しにくくなることがある。",
      "price": 2200,
      "equip": {
        "slot": "accessory",
        "stats": {
          "hp": 300,
          "def": 30
        },
        "skills": [
          {
            "id": "pw-s-box-hide",
            "name": "箱に隠れる",
            "trigger": "when_targeted",
            "effect": "enemy_hit_down_pt",
            "value": 10,
            "chance": 30,
            "maxUses": 0,
            "note": ""
          }
        ],
        "weapons": []
      }
    },
    {
      "id": "pw-i-manual",
      "name": "戦術マニュアル",
      "desc": "読むと新しい技がひらめく。スキルポイント+1（1体1回）。",
      "effect": {
        "type": "skill_point",
        "value": 1
      },
      "limitPerUnit": 1
    },
    {
      "id": "pw-i-board",
      "name": "AI基板",
      "desc": "ピースウォーカーの制御用の基板。「ピースウォーカー（改）」の作戦に必要。",
      "key": true
    },
    {
      "id": "pw-i-crate",
      "name": "補給箱",
      "desc": "ヘリで届いた補給箱。中身は開けてのお楽しみ。",
      "effect": {
        "type": "loot_box",
        "table": [
          {
            "itemId": "pw-i-ration",
            "weight": 5,
            "min": 1,
            "max": 2
          },
          {
            "itemId": "pw-i-medkit",
            "weight": 4,
            "min": 1,
            "max": 1
          },
          {
            "itemId": "pw-i-caseless",
            "weight": 2,
            "min": 1,
            "max": 1
          },
          {
            "itemId": "pw-i-fulton",
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
      "id": "pw-r-rd",
      "name": "研究開発班の増員",
      "desc": "戦闘部隊の中堅兵（突撃兵・重装兵・狙撃手のB）と技術兵Bが配属される。ステルス迷彩がショップに並ぶ。",
      "cost": {
        "credits": 3000,
        "items": {}
      },
      "requires": [],
      "unlock": {
        "units": [
          "pw-u-msf-assaultb",
          "pw-u-msf-heavyb",
          "pw-u-msf-sniperb",
          "pw-u-msf-techb"
        ],
        "items": [
          "pw-i-stealth"
        ],
        "grantItems": {
          "pw-i-caseless": 1
        }
      }
    },
    {
      "id": "pw-r-med",
      "name": "医療班の増員",
      "desc": "衛生兵Bと料理兵Bが配属される。携帯食料と医療キットがもらえる。",
      "cost": {
        "credits": 3000,
        "items": {}
      },
      "requires": [],
      "unlock": {
        "units": [
          "pw-u-msf-medicb",
          "pw-u-msf-cookb"
        ],
        "items": [],
        "grantItems": {
          "pw-i-ration": 3,
          "pw-i-medkit": 2
        }
      }
    },
    {
      "id": "pw-r-intel",
      "name": "諜報班の増員",
      "desc": "偵察兵Bと補給兵Bが配属される。",
      "cost": {
        "credits": 4000,
        "items": {}
      },
      "requires": [],
      "unlock": {
        "units": [
          "pw-u-msf-scoutb",
          "pw-u-msf-supplyb"
        ],
        "items": [],
        "grantItems": {
          "pw-i-fulton": 1
        }
      }
    },
    {
      "id": "pw-r-fulton",
      "name": "フルトン改良",
      "desc": "回収の精度が上がり、熟練の兵士（各兵科のA）が配属される。",
      "cost": {
        "credits": 15000,
        "items": {
          "pw-i-manual": 1
        }
      },
      "requires": [
        "pw-r-rd",
        "pw-r-med",
        "pw-r-intel"
      ],
      "unlock": {
        "units": [
          "pw-u-msf-assaulta",
          "pw-u-msf-heavya",
          "pw-u-msf-snipera",
          "pw-u-msf-medica",
          "pw-u-msf-techa",
          "pw-u-msf-scouta",
          "pw-u-msf-supplya",
          "pw-u-msf-cooka"
        ],
        "items": [],
        "grantItems": {}
      }
    }
  ],
  "terrains": [
    {
      "name": "熱帯雨林",
      "desc": "蒸し暑いジャングル。見通しが悪く、足を取られる。",
      "rangedHitPt": -5,
      "mobPct": -5
    },
    {
      "name": "火口内",
      "desc": "火山の火口の中に作られた基地。足場が悪い。",
      "rangedHitPt": -5,
      "mobPct": -10
    },
    {
      "name": "雲霧林",
      "desc": "霧に包まれた森。遠くが見えにくい。",
      "rangedHitPt": -10
    },
    {
      "name": "地下基地",
      "desc": "狭い通路が続く地下施設。近距離で戦いやすい。",
      "meleeHitPt": 5,
      "mobPct": -5
    },
    {
      "name": "米軍基地",
      "desc": "見通しのよい基地。射撃が通りやすい。",
      "rangedHitPt": 5
    }
  ]
};
