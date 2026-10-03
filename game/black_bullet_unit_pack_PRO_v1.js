/* PRO Unit Pack Schema 2 / Fantasia Record Ops v1.8.0 compatible
 * ブラック・ブレット ユニットパック
 *
 * バランス基準:
 *   一般歩兵 = HP3000 / ATK500 / DEF0 / MOB500 / ACC500
 *
 * 設計方針:
 *   - 原作本文、TVアニメ公式設定、公開設定資料を参照。
 *   - 影胤の斥力フィールドは physical 耐性として実装。
 *   - 蓮太郎の超バラニウム義肢・撃発は、対斥力用のゲーム表現として special 属性。
 *   - 全ユニットを player / enemy 両方で使用可能にし、ミッション作成・対戦検証をしやすくしている。
 */
window.VAIS_UNIT_PACK = {
  "format": "VAIS_OUTER_OPS_UNIT_PACK",
  "schemaVersion": 2,
  "packId": "black_bullet_units_v1",
  "packName": "ブラック・ブレット ユニットパック / PRO基準",
  "units": [
    {
      "id": "bb_rentaro",
      "name": "里見蓮太郎",
      "mark": "蓮",
      "pilot": "",
      "role": "プロモーター / 機械化兵士",
      "ability": "",
      "skills": [
        {
          "id": "bb_rentaro_eye",
          "name": "二一式黒膂石義眼",
          "trigger": "before_attack",
          "effect": "hit_up_pt",
          "value": 18,
          "chance": 100,
          "maxUses": 3,
          "note": "義眼演算による高精度戦闘。戦闘中3回まで。"
        }
      ],
      "deploy": {
        "player": true,
        "enemy": true
      },
      "hp": 4200,
      "atk": 720,
      "def": 80,
      "mob": 700,
      "acc": 760,
      "weapons": [
        {
          "name": "Springfield XD・バラニウム弾",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "標準携行拳銃。",
          "powerPct": 105,
          "accuracyPt": 15,
          "critPt": 5,
          "targetCount": 1,
          "weight": 1.35,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 3,
          "hitPowerPct": 38
        },
        {
          "name": "天童式戦闘術・焔火扇",
          "attackType": "melee",
          "damageType": "physical",
          "note": "天童式戦闘術の打撃。",
          "powerPct": 135,
          "accuracyPt": 18,
          "critPt": 8,
          "targetCount": 1,
          "weight": 1.0,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "超バラニウム義肢・撃発",
          "attackType": "melee",
          "damageType": "special",
          "note": "内蔵カートリッジの推進力で超バラニウム義肢を撃発する決戦打。斥力防御への対抗手段として特殊属性で表現。",
          "powerPct": 270,
          "accuracyPt": 5,
          "critPt": 15,
          "targetCount": 1,
          "weight": 0.7,
          "minDamage": 220,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "tags": [
        "生身",
        "民警",
        "プロモーター",
        "機械化兵士",
        "天童式戦闘術",
        "バラニウム",
        "天童民間警備会社",
        "新人類創造計画",
        "セクション22"
      ]
    },
    {
      "id": "bb_enju",
      "name": "藍原延珠",
      "mark": "延",
      "pilot": "",
      "role": "イニシエーター / モデル・ラビット",
      "ability": "",
      "skills": [
        {
          "id": "bb_enju_rabbit",
          "name": "モデル・ラビット",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 12,
          "chance": 100,
          "maxUses": 0,
          "note": "脚力と敏捷性による回避。"
        }
      ],
      "deploy": {
        "player": true,
        "enemy": true
      },
      "hp": 3500,
      "atk": 780,
      "def": 0,
      "mob": 930,
      "acc": 660,
      "weapons": [
        {
          "name": "モデル・ラビット格闘",
          "attackType": "melee",
          "damageType": "physical",
          "note": "高速の蹴り技主体。",
          "powerPct": 125,
          "accuracyPt": 18,
          "critPt": 8,
          "targetCount": 1,
          "weight": 1.45,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 70
        },
        {
          "name": "高空飛び蹴り",
          "attackType": "melee",
          "damageType": "physical",
          "note": "跳躍力を乗せた高威力蹴撃。",
          "powerPct": 180,
          "accuracyPt": 8,
          "critPt": 12,
          "targetCount": 1,
          "weight": 0.55,
          "minDamage": 150,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "tags": [
        "生身",
        "民警",
        "イニシエーター",
        "呪われた子供たち",
        "モデル・ラビット",
        "天童民間警備会社"
      ]
    },
    {
      "id": "bb_kisara",
      "name": "天童木更",
      "mark": "木",
      "pilot": "",
      "role": "プロモーター / 剣士",
      "ability": "",
      "skills": [
        {
          "id": "bb_kisara_master",
          "name": "天童式抜刀術・免許皆伝",
          "trigger": "before_attack",
          "effect": "crit_up_pt",
          "value": 12,
          "chance": 100,
          "maxUses": 0,
          "note": "極めて高い抜刀精度。"
        }
      ],
      "deploy": {
        "player": true,
        "enemy": true
      },
      "hp": 2700,
      "atk": 900,
      "def": 0,
      "mob": 720,
      "acc": 790,
      "weapons": [
        {
          "name": "殺人刀・雪影",
          "attackType": "melee",
          "damageType": "physical",
          "note": "天童家伝来の刀。",
          "powerPct": 150,
          "accuracyPt": 22,
          "critPt": 12,
          "targetCount": 1,
          "weight": 1.45,
          "minDamage": 100,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "天童式抜刀術・零の型",
          "attackType": "melee",
          "damageType": "physical",
          "note": "木更の決戦級抜刀。",
          "powerPct": 255,
          "accuracyPt": 10,
          "critPt": 22,
          "targetCount": 1,
          "weight": 0.22,
          "minDamage": 240,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "tags": [
        "生身",
        "民警",
        "プロモーター",
        "剣士",
        "天童式抜刀術",
        "バラニウム",
        "天童民間警備会社"
      ]
    },
    {
      "id": "bb_tina",
      "name": "ティナ・スプラウト",
      "mark": "テ",
      "pilot": "",
      "role": "イニシエーター / 機械化兵士 / 狙撃手",
      "ability": "",
      "skills": [
        {
          "id": "bb_tina_shenfield",
          "name": "シェンフィールド",
          "trigger": "before_attack",
          "effect": "hit_up_pt",
          "value": 15,
          "chance": 100,
          "maxUses": 3,
          "note": "偵察ビットから得た環境・座標情報で射撃を補正。"
        }
      ],
      "deploy": {
        "player": true,
        "enemy": true
      },
      "hp": 3400,
      "atk": 660,
      "def": 20,
      "mob": 800,
      "acc": 860,
      "weapons": [
        {
          "name": ".50口径対物狙撃銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "長距離狙撃用。",
          "powerPct": 220,
          "accuracyPt": 24,
          "critPt": 18,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 300,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "ミニガン",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "制圧射撃。",
          "powerPct": 100,
          "accuracyPt": 0,
          "critPt": 2,
          "targetCount": 2,
          "weight": 0.6,
          "minDamage": 45,
          "hitsMin": 3,
          "hitsMax": 7,
          "hitPowerPct": 28
        }
      ],
      "tags": [
        "生身",
        "民警",
        "イニシエーター",
        "呪われた子供たち",
        "モデル・オウル",
        "機械化兵士",
        "狙撃手",
        "天童民間警備会社"
      ]
    },
    {
      "id": "bb_kagetane",
      "name": "蛭子影胤",
      "mark": "影",
      "pilot": "",
      "role": "プロモーター / 機械化兵士",
      "ability": "",
      "skills": [
        {
          "id": "bb_kagetane_field",
          "name": "イマジナリー・ギミック",
          "trigger": "when_targeted",
          "effect": "weapon_resist_pct",
          "value": 60,
          "chance": 100,
          "maxUses": 0,
          "resistType": "physical",
          "note": "斥力フィールドによる絶対防御。物理属性の被ダメージを大きく抑える。"
        }
      ],
      "deploy": {
        "player": true,
        "enemy": true
      },
      "hp": 4200,
      "atk": 720,
      "def": 100,
      "mob": 650,
      "acc": 730,
      "weapons": [
        {
          "name": "スパンキング・ソドミー＆サイケデリック・ゴスペル",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "二挺のカスタムベレッタによるフルオート射撃。",
          "powerPct": 110,
          "accuracyPt": 12,
          "critPt": 5,
          "targetCount": 1,
          "weight": 1.25,
          "minDamage": 55,
          "hitsMin": 2,
          "hitsMax": 5,
          "hitPowerPct": 32
        },
        {
          "name": "マキシマム・ペイン",
          "attackType": "ranged",
          "damageType": "special",
          "note": "斥力フィールドを攻撃へ転用する圧殺技。",
          "powerPct": 210,
          "accuracyPt": 8,
          "critPt": 8,
          "targetCount": 1,
          "weight": 0.55,
          "minDamage": 260,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "tags": [
        "生身",
        "元民警",
        "プロモーター",
        "機械化兵士",
        "新人類創造計画",
        "セクション16",
        "斥力",
        "蛭子ペア"
      ]
    },
    {
      "id": "bb_kohina",
      "name": "蛭子小比奈",
      "mark": "小",
      "pilot": "",
      "role": "イニシエーター / モデル・マンティス",
      "ability": "",
      "skills": [
        {
          "id": "bb_kohina_mantis",
          "name": "モデル・マンティス",
          "trigger": "before_attack",
          "effect": "crit_up_pt",
          "value": 14,
          "chance": 100,
          "maxUses": 0,
          "note": "刃物を持った接近戦で真価を発揮。"
        }
      ],
      "deploy": {
        "player": true,
        "enemy": true
      },
      "hp": 3400,
      "atk": 800,
      "def": 0,
      "mob": 920,
      "acc": 700,
      "weapons": [
        {
          "name": "バラニウム小太刀・二刀",
          "attackType": "melee",
          "damageType": "physical",
          "note": "二本の小太刀による高速斬撃。",
          "powerPct": 125,
          "accuracyPt": 20,
          "critPt": 12,
          "targetCount": 1,
          "weight": 1.25,
          "minDamage": 90,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 72
        },
        {
          "name": "死角からの刺突",
          "attackType": "melee",
          "damageType": "physical",
          "note": "速度を活かして背後へ回り込む致命的な刺突。",
          "powerPct": 190,
          "accuracyPt": 12,
          "critPt": 20,
          "targetCount": 1,
          "weight": 0.45,
          "minDamage": 180,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "tags": [
        "生身",
        "イニシエーター",
        "呪われた子供たち",
        "モデル・マンティス",
        "剣士",
        "バラニウム",
        "蛭子ペア"
      ]
    },
    {
      "id": "bb_shoma",
      "name": "薙沢彰磨",
      "mark": "彰",
      "pilot": "",
      "role": "プロモーター / 天童式戦闘術",
      "ability": "",
      "skills": [
        {
          "id": "bb_shoma_8dan",
          "name": "天童式戦闘術八段",
          "trigger": "before_attack",
          "effect": "crit_up_pt",
          "value": 8,
          "chance": 100,
          "maxUses": 0,
          "note": "蓮太郎の兄弟子としての高い技量。"
        }
      ],
      "deploy": {
        "player": true,
        "enemy": true
      },
      "hp": 3700,
      "atk": 760,
      "def": 20,
      "mob": 670,
      "acc": 700,
      "weapons": [
        {
          "name": "SIG SAUER P226",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "中距離用拳銃。",
          "powerPct": 100,
          "accuracyPt": 14,
          "critPt": 4,
          "targetCount": 1,
          "weight": 0.9,
          "minDamage": 55,
          "hitsMin": 1,
          "hitsMax": 3,
          "hitPowerPct": 38
        },
        {
          "name": "天童式戦闘術八段",
          "attackType": "melee",
          "damageType": "physical",
          "note": "近接での天童式戦闘術。",
          "powerPct": 145,
          "accuracyPt": 20,
          "critPt": 10,
          "targetCount": 1,
          "weight": 1.25,
          "minDamage": 95,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "tags": [
        "生身",
        "民警",
        "プロモーター",
        "天童式戦闘術",
        "薙沢・布施ペア"
      ]
    },
    {
      "id": "bb_sui",
      "name": "布施翠",
      "mark": "翠",
      "pilot": "",
      "role": "イニシエーター / モデル・キャット",
      "ability": "",
      "skills": [
        {
          "id": "bb_sui_cat",
          "name": "モデル・キャット",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 14,
          "chance": 100,
          "maxUses": 0,
          "note": "スピード特化と鋭敏な反射を回避性能として表現。"
        }
      ],
      "deploy": {
        "player": true,
        "enemy": true
      },
      "hp": 3100,
      "atk": 690,
      "def": 0,
      "mob": 960,
      "acc": 650,
      "weapons": [
        {
          "name": "収納式の爪",
          "attackType": "melee",
          "damageType": "physical",
          "note": "間合いの読みにくい鋭利な爪。",
          "powerPct": 120,
          "accuracyPt": 22,
          "critPt": 12,
          "targetCount": 1,
          "weight": 1.0,
          "minDamage": 80,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 68
        }
      ],
      "tags": [
        "生身",
        "民警",
        "イニシエーター",
        "呪われた子供たち",
        "モデル・キャット",
        "薙沢・布施ペア"
      ]
    },
    {
      "id": "bb_shogen",
      "name": "伊熊将監",
      "mark": "将",
      "pilot": "",
      "role": "プロモーター / 重戦士",
      "ability": "",
      "skills": [],
      "deploy": {
        "player": true,
        "enemy": true
      },
      "hp": 4600,
      "atk": 830,
      "def": 100,
      "mob": 390,
      "acc": 500,
      "weapons": [
        {
          "name": "バラニウム巨剣",
          "attackType": "melee",
          "damageType": "physical",
          "note": "身の丈ほどある巨大剣。",
          "powerPct": 160,
          "accuracyPt": 0,
          "critPt": 8,
          "targetCount": 1,
          "weight": 1.35,
          "minDamage": 140,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        },
        {
          "name": "S&W シグマ .40",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "バックアップ用拳銃。",
          "powerPct": 90,
          "accuracyPt": 8,
          "critPt": 2,
          "targetCount": 1,
          "weight": 0.35,
          "minDamage": 50,
          "hitsMin": 1,
          "hitsMax": 3,
          "hitPowerPct": 35
        }
      ],
      "tags": [
        "生身",
        "民警",
        "プロモーター",
        "重戦士",
        "バラニウム",
        "伊熊・千寿ペア"
      ]
    },
    {
      "id": "bb_kayo",
      "name": "千寿夏世",
      "mark": "夏",
      "pilot": "",
      "role": "イニシエーター / モデル・ドルフィン / 支援射手",
      "ability": "",
      "skills": [
        {
          "id": "bb_kayo_dolphin",
          "name": "モデル・ドルフィン",
          "trigger": "before_attack",
          "effect": "hit_up_pt",
          "value": 10,
          "chance": 100,
          "maxUses": 0,
          "note": "高い知性と状況分析能力を射撃精度へ反映。"
        }
      ],
      "deploy": {
        "player": true,
        "enemy": true
      },
      "hp": 3100,
      "atk": 540,
      "def": 0,
      "mob": 650,
      "acc": 800,
      "weapons": [
        {
          "name": "司馬重工2027年式フルオートショットガン",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "サイレンサー付きフルオートショットガン。",
          "powerPct": 100,
          "accuracyPt": 12,
          "critPt": 3,
          "targetCount": 1,
          "weight": 1.2,
          "minDamage": 50,
          "hitsMin": 2,
          "hitsMax": 4,
          "hitPowerPct": 38
        },
        {
          "name": "40mmグレネードランチャー",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "合体装着式ランチャーユニット。",
          "powerPct": 185,
          "accuracyPt": -4,
          "critPt": 6,
          "targetCount": 2,
          "weight": 0.35,
          "minDamage": 260,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "tags": [
        "生身",
        "民警",
        "イニシエーター",
        "呪われた子供たち",
        "モデル・ドルフィン",
        "支援",
        "伊熊・千寿ペア"
      ]
    },
    {
      "id": "bb_tamaki",
      "name": "片桐玉樹",
      "mark": "玉",
      "pilot": "",
      "role": "プロモーター / 近接戦闘",
      "ability": "",
      "skills": [],
      "deploy": {
        "player": true,
        "enemy": true
      },
      "hp": 3900,
      "atk": 720,
      "def": 40,
      "mob": 620,
      "acc": 630,
      "weapons": [
        {
          "name": "マテバ拳銃",
          "attackType": "ranged",
          "damageType": "physical",
          "note": "オートマチックリボルバー。",
          "powerPct": 105,
          "accuracyPt": 12,
          "critPt": 5,
          "targetCount": 1,
          "weight": 0.75,
          "minDamage": 55,
          "hitsMin": 1,
          "hitsMax": 3,
          "hitPowerPct": 38
        },
        {
          "name": "メリケンサック＆バラニウム・チェーンソーブーツ",
          "attackType": "melee",
          "damageType": "physical",
          "note": "拳打とブーツ内蔵チェーンソーを組み合わせた接近戦。",
          "powerPct": 140,
          "accuracyPt": 15,
          "critPt": 8,
          "targetCount": 1,
          "weight": 1.25,
          "minDamage": 100,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 60
        }
      ],
      "tags": [
        "生身",
        "民警",
        "プロモーター",
        "格闘",
        "バラニウム",
        "片桐民間警備会社"
      ]
    },
    {
      "id": "bb_yuzuki",
      "name": "片桐弓月",
      "mark": "弓",
      "pilot": "",
      "role": "イニシエーター / モデル・スパイダー / 制圧支援",
      "ability": "",
      "skills": [
        {
          "id": "bb_yuzuki_web",
          "name": "モデル・スパイダー・テリトリー",
          "trigger": "when_targeted",
          "effect": "enemy_hit_down_pt",
          "value": 10,
          "chance": 100,
          "maxUses": 0,
          "note": "糸で作ったテリトリーによる行動阻害を回避補正として表現。"
        }
      ],
      "deploy": {
        "player": true,
        "enemy": true
      },
      "hp": 3200,
      "atk": 580,
      "def": 0,
      "mob": 830,
      "acc": 700,
      "weapons": [
        {
          "name": "粘着性クモ糸",
          "attackType": "ranged",
          "damageType": "special",
          "note": "敵を絡め取る制圧用の糸。ゲーム上は低威力・高命中攻撃。",
          "powerPct": 70,
          "accuracyPt": 28,
          "critPt": 0,
          "targetCount": 2,
          "weight": 1.2,
          "minDamage": 35,
          "hitsMin": 1,
          "hitsMax": 2,
          "hitPowerPct": 55
        },
        {
          "name": "高機動格闘",
          "attackType": "melee",
          "damageType": "physical",
          "note": "蜘蛛因子の跳躍・瞬発力を用いた近接攻撃。",
          "powerPct": 100,
          "accuracyPt": 18,
          "critPt": 5,
          "targetCount": 1,
          "weight": 0.8,
          "minDamage": 60,
          "hitsMin": 1,
          "hitsMax": 1,
          "hitPowerPct": 100
        }
      ],
      "tags": [
        "生身",
        "民警",
        "イニシエーター",
        "呪われた子供たち",
        "モデル・スパイダー",
        "支援",
        "片桐民間警備会社"
      ]
    }
  ]
};
