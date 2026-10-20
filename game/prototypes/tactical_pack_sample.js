/* Built-in sample pack (PRO_TACTICAL_PACK): sample units, items, research, hires, evolutions, fusions, achievements and
   missions. Not loaded by default: the game starts empty and this pack is chosen as a data source (記録・設定 → データの読み込み元)
   or named as a dependency ('sample') by a T&D pack. IDs follow the ID rules: <packId>-<CODE>-<6 digits>. */
window.PROTacticalSamplePack={
 "format": "PRO_TACTICAL_PACK",
 "packId": "sample",
 "version": 1,
 "name": "内蔵サンプル",
 "units": [
  {
   "hp": 1200,
   "atk": 180,
   "def": 130,
   "mob": 250,
   "acc": 500,
   "skills": [],
   "tags": [],
   "id": "sample-U-000000",
   "skillTree": [
    {
     "id": "inf-aim",
     "cost": 1,
     "minLevel": 1,
     "requires": [],
     "skill": {
      "id": "s-inf-aim",
      "chance": 100,
      "maxUses": 0,
      "name": "狙いを定める",
      "trigger": "before_attack",
      "effect": "hit_up_pt",
      "value": 10
     }
    },
    {
     "id": "inf-charge",
     "cost": 2,
     "minLevel": 3,
     "requires": [
      "inf-aim"
     ],
     "skill": {
      "id": "s-inf-charge",
      "chance": 100,
      "maxUses": 0,
      "name": "突撃",
      "trigger": "before_attack",
      "effect": "def_pierce_pct",
      "value": 20
     }
    },
    {
     "id": "inf-rally",
     "cost": 3,
     "minLevel": 5,
     "requires": [
      "inf-charge"
     ],
     "skill": {
      "id": "s-inf-rally",
      "chance": 100,
      "maxUses": 0,
      "name": "鼓舞",
      "trigger": "battle_start",
      "effect": "atk_up_pct",
      "value": 10,
      "target": "allies"
     }
    }
   ],
   "joinVerb": "hire",
   "catalog": "最も数の多い基本戦力。どんな地形でも頼りになる。",
   "name": "歩兵小隊",
   "size": "S",
   "move": 5,
   "movementAptitude": {
    "ground": "B",
    "air": "none",
    "water": "none",
    "underwater": "none",
    "space": "none"
   },
   "weapons": [
    {
     "name": "近接武装",
     "attackType": "melee",
     "damageType": "physical",
     "powerPct": 100,
     "accuracyPt": 10,
     "targetCount": 1,
     "minRange": 1,
     "maxRange": 1
    }
   ]
  },
  {
   "hp": 1200,
   "atk": 180,
   "def": 130,
   "mob": 250,
   "acc": 500,
   "skills": [],
   "tags": [
    "車両"
   ],
   "id": "sample-U-000001",
   "skillTree": [
    {
     "id": "sc-eye",
     "cost": 1,
     "minLevel": 1,
     "requires": [],
     "skill": {
      "id": "s-sc-eye",
      "chance": 100,
      "maxUses": 0,
      "name": "観測",
      "trigger": "before_attack",
      "effect": "hit_up_pt",
      "value": 15
     }
    },
    {
     "id": "sc-ap",
     "cost": 2,
     "minLevel": 4,
     "requires": [
      "sc-eye"
     ],
     "skill": {
      "id": "s-sc-ap",
      "chance": 100,
      "maxUses": 0,
      "name": "徹甲弾",
      "trigger": "before_attack",
      "effect": "def_pierce_pct",
      "value": 30
     }
    }
   ],
   "joinVerb": "produce",
   "catalog": "長射程の狙撃砲で敵の動きを止める偵察車両。",
   "name": "偵察車",
   "size": "M",
   "move": 7,
   "movementAptitude": {
    "ground": "A",
    "air": "none",
    "water": "none",
    "underwater": "none",
    "space": "none"
   },
   "weapons": [
    {
     "name": "狙撃砲",
     "attackType": "ranged",
     "damageType": "physical",
     "powerPct": 100,
     "accuracyPt": 10,
     "targetCount": 1,
     "minRange": 2,
     "maxRange": 6
    }
   ]
  },
  {
   "hp": 1200,
   "atk": 180,
   "def": 130,
   "mob": 250,
   "acc": 500,
   "skills": [],
   "tags": [
    "車両"
   ],
   "id": "sample-U-000002",
   "joinVerb": "produce",
   "catalog": "厚い装甲と射撃武装を備えた地上戦の要。",
   "name": "主力戦車",
   "size": "L",
   "move": 4,
   "movementAptitude": {
    "ground": "B",
    "air": "none",
    "water": "none",
    "underwater": "none",
    "space": "none"
   },
   "weapons": [
    {
     "name": "射撃武装",
     "attackType": "ranged",
     "damageType": "physical",
     "powerPct": 100,
     "accuracyPt": 10,
     "targetCount": 1,
     "minRange": 1,
     "maxRange": 3
    }
   ]
  },
  {
   "hp": 1200,
   "atk": 180,
   "def": 130,
   "mob": 250,
   "acc": 500,
   "skills": [],
   "tags": [],
   "id": "sample-U-000003",
   "joinVerb": "hire",
   "catalog": "前線で味方を支える衛生兵。",
   "name": "衛生兵",
   "size": "S",
   "move": 5,
   "movementAptitude": {
    "ground": "B",
    "air": "none",
    "water": "none",
    "underwater": "none",
    "space": "none"
   },
   "weapons": [
    {
     "name": "近接武装",
     "attackType": "melee",
     "damageType": "physical",
     "powerPct": 100,
     "accuracyPt": 10,
     "targetCount": 1,
     "minRange": 1,
     "maxRange": 1
    }
   ]
  },
  {
   "hp": 1200,
   "atk": 180,
   "def": 130,
   "mob": 250,
   "acc": 500,
   "skills": [],
   "tags": [
    "機動兵器"
   ],
   "id": "sample-U-000004",
   "noFire": true,
   "catalog": "地上・空中・宇宙を行き来できる汎用機動兵器。",
   "name": "汎用機動兵器",
   "size": "2XL",
   "move": 6,
   "movementAptitude": {
    "ground": "B",
    "air": "B",
    "water": "none",
    "underwater": "none",
    "space": "B"
   },
   "weapons": [
    {
     "name": "格闘武装",
     "attackType": "melee",
     "damageType": "physical",
     "powerPct": 100,
     "accuracyPt": 10,
     "targetCount": 1,
     "minRange": 1,
     "maxRange": 1
    },
    {
     "name": "ビームライフル",
     "attackType": "ranged",
     "damageType": "physical",
     "powerPct": 100,
     "accuracyPt": 10,
     "targetCount": 1,
     "minRange": 1,
     "maxRange": 3
    }
   ]
  },
  {
   "hp": 1200,
   "atk": 180,
   "def": 130,
   "mob": 250,
   "acc": 500,
   "skills": [],
   "tags": [],
   "id": "sample-U-000005",
   "catalog": "空中を高速で移動する戦闘機。",
   "name": "戦闘機",
   "size": "XL",
   "move": 8,
   "movementAptitude": {
    "ground": "none",
    "air": "A",
    "water": "none",
    "underwater": "none",
    "space": "none"
   },
   "weapons": [
    {
     "name": "射撃武装",
     "attackType": "ranged",
     "damageType": "physical",
     "powerPct": 100,
     "accuracyPt": 10,
     "targetCount": 1,
     "minRange": 1,
     "maxRange": 3
    }
   ]
  },
  {
   "hp": 1200,
   "atk": 180,
   "def": 130,
   "mob": 250,
   "acc": 500,
   "skills": [],
   "tags": [],
   "id": "sample-U-000006",
   "catalog": "巨大な陸戦兵器。動きは遅いが圧倒的な存在感。",
   "name": "大型陸戦兵器",
   "size": "3XL",
   "move": 3,
   "movementAptitude": {
    "ground": "D",
    "air": "none",
    "water": "none",
    "underwater": "none",
    "space": "none"
   },
   "weapons": [
    {
     "name": "近接武装",
     "attackType": "melee",
     "damageType": "physical",
     "powerPct": 100,
     "accuracyPt": 10,
     "targetCount": 1,
     "minRange": 1,
     "maxRange": 1
    }
   ]
  },
  {
   "hp": 1200,
   "atk": 180,
   "def": 130,
   "mob": 250,
   "acc": 500,
   "skills": [],
   "tags": [],
   "id": "sample-U-000007",
   "joinVerb": "produce",
   "catalog": "沿岸を守る小型の哨戒艇。",
   "name": "哨戒艇",
   "size": "M",
   "move": 6,
   "movementAptitude": {
    "ground": "none",
    "air": "none",
    "water": "B",
    "underwater": "none",
    "space": "none"
   },
   "weapons": [
    {
     "name": "射撃武装",
     "attackType": "ranged",
     "damageType": "physical",
     "powerPct": 100,
     "accuracyPt": 10,
     "targetCount": 1,
     "minRange": 1,
     "maxRange": 3
    }
   ]
  },
  {
   "hp": 1200,
   "atk": 180,
   "def": 130,
   "mob": 250,
   "acc": 500,
   "skills": [],
   "tags": [],
   "id": "sample-U-000008",
   "catalog": "水中から奇襲する潜水艦。",
   "name": "潜水艦",
   "size": "XL",
   "move": 5,
   "movementAptitude": {
    "ground": "none",
    "air": "none",
    "water": "B",
    "underwater": "A",
    "space": "none"
   },
   "weapons": [
    {
     "name": "射撃武装",
     "attackType": "ranged",
     "damageType": "physical",
     "powerPct": 100,
     "accuracyPt": 10,
     "targetCount": 1,
     "minRange": 1,
     "maxRange": 3
    }
   ]
  },
  {
   "hp": 1200,
   "atk": 180,
   "def": 130,
   "mob": 250,
   "acc": 500,
   "skills": [],
   "tags": [],
   "id": "sample-U-000009",
   "joinVerb": "produce",
   "catalog": "陸と水を行き来する水陸両用機。",
   "name": "水陸両用機",
   "size": "M",
   "move": 5,
   "movementAptitude": {
    "ground": "B",
    "air": "none",
    "water": "B",
    "underwater": "B",
    "space": "none"
   },
   "weapons": [
    {
     "name": "近接武装",
     "attackType": "melee",
     "damageType": "physical",
     "powerPct": 100,
     "accuracyPt": 10,
     "targetCount": 1,
     "minRange": 1,
     "maxRange": 1
    }
   ]
  },
  {
   "hp": 1200,
   "atk": 180,
   "def": 130,
   "mob": 250,
   "acc": 500,
   "skills": [],
   "tags": [],
   "id": "sample-U-000010",
   "catalog": "宇宙空間専用の戦闘艇。",
   "name": "宇宙戦闘艇",
   "size": "XL",
   "move": 7,
   "movementAptitude": {
    "ground": "none",
    "air": "none",
    "water": "none",
    "underwater": "none",
    "space": "A"
   },
   "weapons": [
    {
     "name": "射撃武装",
     "attackType": "ranged",
     "damageType": "physical",
     "powerPct": 100,
     "accuracyPt": 10,
     "targetCount": 1,
     "minRange": 1,
     "maxRange": 3
    }
   ]
  },
  {
   "hp": 1200,
   "atk": 180,
   "def": 130,
   "mob": 250,
   "acc": 500,
   "skills": [],
   "tags": [],
   "id": "sample-U-000011",
   "catalog": "設定確認用の試験機。",
   "name": "未設定テスト機",
   "size": "M",
   "movementAptitude": {
    "ground": "none",
    "air": "none",
    "water": "none",
    "underwater": "none",
    "space": "none"
   },
   "weapons": [
    {
     "name": "近接武装",
     "attackType": "melee",
     "damageType": "physical",
     "powerPct": 100,
     "accuracyPt": 10,
     "targetCount": 1,
     "minRange": 1,
     "maxRange": 1
    }
   ]
  },
  {
   "id": "sample-U-000012",
   "name": "訓練標的",
   "size": "M",
   "move": 3,
   "movementAptitude": {
    "ground": "B",
    "air": "none",
    "water": "none",
    "underwater": "none",
    "space": "none"
   },
   "hp": 1000,
   "atk": 130,
   "def": 100,
   "mob": 150,
   "acc": 450,
   "weapons": [],
   "skills": [],
   "tags": [
    "標的"
   ]
  },
  {
   "id": "sample-U-000013",
   "base": "sample-U-000012",
   "separate": false,
   "movementAptitude": {
    "ground": "none",
    "air": "none",
    "water": "B",
    "underwater": "none",
    "space": "none"
   }
  },
  {
   "id": "sample-U-000014",
   "base": "sample-U-000012",
   "separate": false,
   "movementAptitude": {
    "ground": "none",
    "air": "none",
    "water": "none",
    "underwater": "none",
    "space": "B"
   }
  },
  {
   "id": "sample-U-000015",
   "base": "sample-U-000001",
   "separate": true,
   "joinVerb": "produce",
   "hireCost": 4200,
   "name": "エース偵察車",
   "hp": 1500,
   "acc": 600,
   "catalog": "敵軍のエースが駆る改造偵察車。"
  },
  {
   "hp": 900,
   "atk": 120,
   "def": 80,
   "mob": 250,
   "acc": 500,
   "skills": [],
   "tags": [
    "生身",
    "パイロット"
   ],
   "id": "sample-U-000016",
   "name": "葵",
   "catalog": "機動兵器の操縦に長けたパイロット。",
   "joinVerb": "hire",
   "hireCost": 1500,
   "size": "S",
   "move": 4,
   "movementAptitude": {
    "ground": "B",
    "air": "none",
    "water": "none",
    "underwater": "none",
    "space": "none"
   },
   "weapons": [
    {
     "name": "拳銃",
     "attackType": "melee",
     "damageType": "physical",
     "powerPct": 100,
     "accuracyPt": 10,
     "targetCount": 1,
     "minRange": 1,
     "maxRange": 1
    }
   ],
   "pilotProfile": {
    "stats": {
     "atk": 40,
     "acc": 60
    },
    "skills": [
     {
      "id": "s-aoi-eye",
      "name": "見切り",
      "trigger": "before_attack",
      "effect": "hit_up_pt",
      "value": 10,
      "chance": 100,
      "maxUses": 0
     }
    ],
    "aptitude": {
     "tags": [
      "機動兵器"
     ],
     "pct": 10
    },
    "growthPct": 2
   }
  },
  {
   "hp": 1500,
   "atk": 220,
   "def": 150,
   "mob": 250,
   "acc": 500,
   "skills": [],
   "tags": [
    "生身"
   ],
   "id": "sample-U-000017",
   "pilotProfile": {
    "stats": {
     "atk": 30,
     "def": 30
    },
    "skills": [],
    "growthPct": 2
   },
   "name": "古参兵",
   "catalog": "機動訓練の教官。訓練を終えると部隊に加わる。",
   "joinVerb": "hire",
   "recruit": {
    "missionId": "sample-TM-000000"
   },
   "size": "S",
   "move": 5,
   "movementAptitude": {
    "ground": "A",
    "air": "none",
    "water": "none",
    "underwater": "none",
    "space": "none"
   },
   "weapons": [
    {
     "name": "近接武装",
     "attackType": "melee",
     "damageType": "physical",
     "powerPct": 100,
     "accuracyPt": 10,
     "targetCount": 1,
     "minRange": 1,
     "maxRange": 1
    },
    {
     "name": "小銃",
     "attackType": "ranged",
     "damageType": "physical",
     "powerPct": 100,
     "accuracyPt": 10,
     "targetCount": 1,
     "minRange": 1,
     "maxRange": 2
    }
   ]
  },
  {
   "hp": 1500,
   "atk": 220,
   "def": 170,
   "mob": 250,
   "acc": 500,
   "skills": [],
   "tags": [],
   "id": "sample-U-000018",
   "name": "主力戦車改",
   "catalog": "主力戦車を改修した発展型。",
   "size": "L",
   "move": 5,
   "movementAptitude": {
    "ground": "B",
    "air": "none",
    "water": "none",
    "underwater": "none",
    "space": "none"
   },
   "weapons": [
    {
     "name": "改良射撃武装",
     "attackType": "ranged",
     "damageType": "physical",
     "powerPct": 100,
     "accuracyPt": 10,
     "targetCount": 1,
     "minRange": 1,
     "maxRange": 3
    }
   ]
  },
  {
   "hp": 1200,
   "atk": 180,
   "def": 130,
   "mob": 250,
   "acc": 500,
   "skills": [],
   "tags": [],
   "id": "sample-U-000019",
   "name": "高速偵察車",
   "catalog": "偵察車の足回りを強化した高速型。",
   "size": "M",
   "move": 9,
   "movementAptitude": {
    "ground": "A",
    "air": "none",
    "water": "none",
    "underwater": "none",
    "space": "none"
   },
   "weapons": [
    {
     "name": "狙撃砲",
     "attackType": "ranged",
     "damageType": "physical",
     "powerPct": 100,
     "accuracyPt": 10,
     "targetCount": 1,
     "minRange": 2,
     "maxRange": 6
    }
   ]
  },
  {
   "hp": 1400,
   "atk": 180,
   "def": 130,
   "mob": 250,
   "acc": 500,
   "skills": [],
   "tags": [],
   "id": "sample-U-000020",
   "joinVerb": "hire",
   "hireCost": 1800,
   "name": "特殊歩兵",
   "catalog": "歩兵と衛生兵の技術を併せ持つ精鋭。",
   "size": "S",
   "move": 6,
   "movementAptitude": {
    "ground": "A",
    "air": "none",
    "water": "none",
    "underwater": "none",
    "space": "none"
   },
   "weapons": [
    {
     "name": "近接武装",
     "attackType": "melee",
     "damageType": "physical",
     "powerPct": 100,
     "accuracyPt": 10,
     "targetCount": 1,
     "minRange": 1,
     "maxRange": 1
    }
   ]
  },
  {
   "hp": 1800,
   "atk": 180,
   "def": 130,
   "mob": 250,
   "acc": 500,
   "skills": [],
   "tags": [
    "機動兵器"
   ],
   "id": "sample-U-000021",
   "crew": "required",
   "name": "指揮機動兵器",
   "catalog": "汎用機動兵器と戦闘機の設計を組み合わせた指揮機。",
   "size": "2XL",
   "move": 7,
   "movementAptitude": {
    "ground": "B",
    "air": "A",
    "water": "none",
    "underwater": "none",
    "space": "B"
   },
   "weapons": [
    {
     "name": "格闘武装",
     "attackType": "melee",
     "damageType": "physical",
     "powerPct": 100,
     "accuracyPt": 10,
     "targetCount": 1,
     "minRange": 1,
     "maxRange": 1
    },
    {
     "name": "ビームライフル",
     "attackType": "ranged",
     "damageType": "physical",
     "powerPct": 100,
     "accuracyPt": 10,
     "targetCount": 1,
     "minRange": 1,
     "maxRange": 4
    }
   ]
  }
 ],
 "items": [
  {
   "id": "sample-I-000000",
   "name": "機械部品",
   "desc": "研究や開発に使う汎用の部品。",
   "price": 400
  },
  {
   "id": "sample-I-000001",
   "name": "戦闘データ",
   "desc": "戦闘記録を解析したデータ。研究で手に入る。"
  },
  {
   "id": "sample-I-000002",
   "name": "特殊合金",
   "desc": "高性能な装甲材。装甲改良の研究で購入できるようになる。",
   "price": 1500,
   "shop": {
    "requiresResearch": "sample-R-000001"
   }
  },
  {
   "id": "sample-I-000003",
   "name": "修理キット",
   "desc": "ユニットの修理に使う。機動訓練をクリアすると購入できる。",
   "price": 300,
   "shop": {
    "requiresMission": "sample-TM-000000"
   }
  },
  {
   "id": "sample-I-000004",
   "name": "通行許可証",
   "desc": "大切なもの。売却できない。",
   "key": true
  },
  {
   "id": "sample-I-000005",
   "name": "緊急修理キット",
   "desc": "大破・重傷のユニットを復帰させる。高価。",
   "price": 8000,
   "effects": [
    {
     "type": "revive_hp_pct",
     "value": 100
    }
   ]
  },
  {
   "id": "sample-I-000006",
   "name": "弾薬・ENパック",
   "desc": "作戦中に使う。1体の弾薬とENを全回復する。",
   "price": 400,
   "effects": [],
   "resupply": 100
  },
  {
   "id": "sample-I-000007",
   "name": "応急修理キット",
   "desc": "作戦中に使う。1体のHPを最大HPの50%回復する。",
   "price": 600,
   "effects": [
    {
     "type": "heal_hp_pct",
     "value": 50
    }
   ]
  },
  {
   "id": "sample-I-000008",
   "name": "戦闘糧食",
   "desc": "補給アイテム。次の出撃だけATK+20%。",
   "price": 400,
   "effects": [
    {
     "type": "sortie_buff",
     "stat": "atk",
     "value": 20
    }
   ]
  },
  {
   "id": "sample-I-000009",
   "name": "強化チップ",
   "desc": "使うとATKが永続的に20上がる。1体3回まで。",
   "price": 800,
   "limitPerUnit": 3,
   "effects": [
    {
     "type": "stat_up_flat",
     "stat": "atk",
     "value": 20
    }
   ]
  },
  {
   "id": "sample-I-000010",
   "name": "訓練マニュアル",
   "desc": "使うと経験値300を得る。",
   "price": 500,
   "effects": [
    {
     "type": "exp_gain",
     "value": 300
    }
   ]
  },
  {
   "id": "sample-I-000011",
   "name": "戦術教本",
   "desc": "使うとスキルポイントが1増える。",
   "price": 1000,
   "effects": [
    {
     "type": "skill_point",
     "value": 1
    }
   ]
  },
  {
   "id": "sample-I-000012",
   "name": "精密照準器",
   "desc": "装備するとACC+60。",
   "price": 1200,
   "equip": {
    "stats": {
     "acc": 60
    }
   }
  },
  {
   "id": "sample-I-000013",
   "name": "増加装甲",
   "desc": "装備するとDEF+80・MOB-20。車両・機動兵器のみ。",
   "requires": {
    "anyTags": [
     "車両",
     "機動兵器"
    ]
   },
   "price": 1500,
   "equip": {
    "stats": {
     "def": 80,
     "mob": -20
    }
   }
  },
  {
   "id": "sample-I-000014",
   "name": "追加ミサイル",
   "desc": "装備すると武装「ミサイル」（射程2〜4）が増える。",
   "price": 2000,
   "equip": {
    "weapons": [
     {
      "name": "ミサイル",
      "attackType": "ranged",
      "damageType": "physical",
      "powerPct": 120,
      "accuracyPt": 0,
      "targetCount": 1,
      "minRange": 2,
      "maxRange": 4
     }
    ]
   }
  }
 ],
 "startItems": {
  "sample-I-000007": 2,
  "sample-I-000006": 1,
  "sample-I-000000": 5,
  "sample-I-000002": 1,
  "sample-I-000004": 1,
  "sample-I-000009": 2,
  "sample-I-000010": 1,
  "sample-I-000012": 1,
  "sample-I-000013": 1,
  "sample-I-000008": 2
 },
 "research": [
  {
   "id": "sample-R-000000",
   "name": "戦闘記録の解析",
   "desc": "過去の戦闘を解析し、戦闘データを得る。",
   "days": 1,
   "cost": {
    "credits": 500
   },
   "unlock": {
    "grantItems": {
     "sample-I-000001": 2
    }
   }
  },
  {
   "id": "sample-R-000001",
   "name": "装甲改良",
   "desc": "主力戦車改の生産技術。",
   "days": 2,
   "cost": {
    "credits": 2000,
    "items": {
     "sample-I-000000": 3
    }
   },
   "unlock": {
    "register": [
     "sample-U-000018"
    ]
   }
  },
  {
   "id": "sample-R-000002",
   "name": "エース機の再現",
   "desc": "エース偵察車を再現し、部隊に迎える。",
   "days": 3,
   "requires": [
    "sample-R-000001"
   ],
   "cost": {
    "credits": 3000,
    "items": {
     "sample-I-000002": 1,
     "sample-I-000001": 1
    }
   },
   "unlock": {
    "units": [
     "sample-U-000015"
    ]
   }
  }
 ],
 "achievements": [
  {
   "id": "sample-A-000000",
   "name": "初勝利",
   "desc": "作戦に1回勝利する",
   "conds": {
    "mode": "all",
    "list": [
     {
      "type": "wins_total",
      "cmp": "ge",
      "value": 1
     }
    ]
   },
   "reward": {
    "credits": 500
   }
  },
  {
   "id": "sample-A-000001",
   "name": "訓練修了",
   "desc": "機動訓練を星3つでクリアする",
   "conds": {
    "mode": "all",
    "list": [
     {
      "type": "mission_stars",
      "missionId": "sample-TM-000000",
      "cmp": "ge",
      "value": 3
     }
    ]
   },
   "reward": {
    "items": {
     "sample-I-000009": 1
    }
   }
  },
  {
   "id": "sample-A-000002",
   "name": "技術者",
   "desc": "装甲改良の研究を完了する",
   "conds": {
    "mode": "all",
    "list": [
     {
      "type": "research_done",
      "researchId": "sample-R-000001"
     }
    ]
   },
   "reward": {
    "credits": 1000
   }
  },
  {
   "id": "sample-A-000003",
   "name": "資産家",
   "desc": "資金を50,000Cr以上ためる",
   "hidden": true,
   "conds": {
    "mode": "all",
    "list": [
     {
      "type": "credits_have",
      "cmp": "ge",
      "value": 50000
     }
    ]
   },
   "reward": {
    "items": {
     "sample-I-000005": 1
    }
   }
  }
 ],
 "hires": [
  {
   "id": "sample-H-000000",
   "unitId": "sample-U-000016",
   "cost": 1500
  },
  {
   "id": "sample-H-000001",
   "unitId": "sample-U-000000",
   "cost": 800
  },
  {
   "id": "sample-H-000002",
   "unitId": "sample-U-000001",
   "cost": 1500,
   "limit": 3
  },
  {
   "id": "sample-H-000003",
   "unitId": "sample-U-000002",
   "cost": 2500,
   "requires": {
    "missions": [
     "sample-TM-000000"
    ]
   }
  },
  {
   "id": "sample-H-000004",
   "unitId": "sample-U-000009",
   "cost": 2000,
   "hidden": true,
   "conds": {
    "mode": "all",
    "list": [
     {
      "type": "unit_owned",
      "unitId": "sample-U-000007",
      "cmp": "ge",
      "count": 2
     }
    ]
   }
  }
 ],
 "evolutions": [
  {
   "id": "sample-E-000000",
   "from": "sample-U-000002",
   "to": "sample-U-000018",
   "carry": {
    "level": true
   },
   "register": true,
   "conds": {
    "mode": "all",
    "list": [
     {
      "type": "credits_use",
      "value": 3000
     }
    ]
   }
  },
  {
   "id": "sample-E-000001",
   "from": "sample-U-000001",
   "to": "sample-U-000019",
   "carry": {
    "level": true
   },
   "conds": {
    "mode": "all",
    "list": [
     {
      "type": "unit_level",
      "cmp": "ge",
      "value": 5
     }
    ]
   }
  }
 ],
 "fusions": [
  {
   "id": "sample-FU-000000",
   "materials": [
    {
     "unitId": "sample-U-000000"
    },
    {
     "unitId": "sample-U-000003",
     "consume": false
    }
   ],
   "result": {
    "type": "unit",
    "unitId": "sample-U-000020",
    "count": 1,
    "register": true
   }
  },
  {
   "id": "sample-FU-000001",
   "materials": [
    {
     "unitId": "sample-U-000004"
    },
    {
     "unitId": "sample-U-000005"
    }
   ],
   "carry": {
    "level": true
   },
   "result": {
    "type": "unit",
    "unitId": "sample-U-000021",
    "count": 1
   },
   "conds": {
    "mode": "all",
    "list": [
     {
      "type": "credits_use",
      "value": 5000
     }
    ]
   }
  },
  {
   "id": "sample-FU-000002",
   "materials": [
    {
     "unitId": "sample-U-000001",
     "consume": false
    },
    {
     "unitId": "sample-U-000002",
     "consume": false
    }
   ],
   "result": {
    "type": "register",
    "unitId": "sample-U-000015"
   },
   "conds": {
    "mode": "all",
    "list": [
     {
      "type": "credits_use",
      "value": 2000
     }
    ]
   }
  }
 ],
 "roster": [
  "sample-U-000000",
  "sample-U-000001",
  "sample-U-000002",
  "sample-U-000003",
  "sample-U-000004",
  "sample-U-000005",
  "sample-U-000006",
  "sample-U-000007",
  "sample-U-000008",
  "sample-U-000009",
  "sample-U-000010",
  "sample-U-000011"
 ],
 "missions": [
  {
   "id": "sample-TM-000000",
   "code": "TR-01",
   "kind": "training",
   "name": "機動訓練",
   "desc": "平原を舞台に、部隊の移動と交戦の流れを確認する訓練作戦。",
   "goal": "敵部隊の全滅",
   "terrainLabel": "地上・空中",
   "formation": "地上対応の部隊",
   "reward": "800 Cr",
   "color": "#29453e",
   "surface": "ground",
   "map": {
    "width": 12,
    "height": 9,
    "rows": [
     "fpppppprpmpp",
     "pppppfprpmpp",
     "pppfmpprpmfp",
     "pfppmpprfmpp",
     "ppppmpfbpppp",
     "ppppmpprpppf",
     "ppfpmpprpfpp",
     "fpppppprpppp",
     "pppppfprpppp"
    ]
   },
   "playerStarts": [
    {
     "x": 0,
     "y": 0
    },
    {
     "x": 1,
     "y": 0
    },
    {
     "x": 2,
     "y": 0
    },
    {
     "x": 0,
     "y": 1
    },
    {
     "x": 1,
     "y": 1
    },
    {
     "x": 2,
     "y": 1
    },
    {
     "x": 0,
     "y": 2
    },
    {
     "x": 1,
     "y": 2
    },
    {
     "x": 2,
     "y": 2
    }
   ],
   "victory": "enemy_wipe",
   "defeat": "player_wipe",
   "result": {
    "credits": 800,
    "exp": 60,
    "items": {
     "sample-I-000003": 1
    }
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
     "value": 8
    }
   ],
   "enemies": [
    {
     "id": "enemy-0",
     "name": "敵第1部隊",
     "position": {
      "x": 5,
      "y": 4
     },
     "ai": {
      "pattern": "assault",
      "target": "lowest_hp"
     },
     "members": [
      {
       "unit": "sample-U-000012",
       "name": "訓練標的1"
      },
      {
       "unit": "sample-U-000012",
       "name": "訓練標的2"
      }
     ]
    },
    {
     "id": "enemy-1",
     "name": "敵第2部隊",
     "position": {
      "x": 9,
      "y": 4
     },
     "ai": {
      "pattern": "assault",
      "target": "lowest_hp"
     },
     "members": [
      {
       "unit": "sample-U-000012",
       "name": "訓練標的1"
      },
      {
       "unit": "sample-U-000012",
       "name": "訓練標的2"
      }
     ]
    }
   ]
  },
  {
   "id": "sample-TM-000001",
   "code": "OP-01",
   "kind": "combat",
   "name": "沿岸防衛線",
   "desc": "海岸線に展開する敵部隊を迎撃。水上・水中に対応する編成を想定したサンプル。",
   "goal": "敵部隊の全滅",
   "terrainLabel": "水上・水中・空中",
   "formation": "水域対応の部隊",
   "reward": "2,400 Cr",
   "color": "#23434e",
   "surface": "water",
   "map": {
    "width": 12,
    "height": 9,
    "rows": [
     "wwwwwwwddddd",
     "wwwwwwwddddd",
     "wwwwwwwddddd",
     "wwwwwwwddddd",
     "wwwwwwwddddd",
     "wwwwwwwddddd",
     "wwwwwwwddddd",
     "wwwwwwwddddd",
     "wwwwwwwddddd"
    ]
   },
   "playerStarts": [
    {
     "x": 0,
     "y": 0
    },
    {
     "x": 1,
     "y": 0
    },
    {
     "x": 2,
     "y": 0
    },
    {
     "x": 0,
     "y": 1
    },
    {
     "x": 1,
     "y": 1
    },
    {
     "x": 2,
     "y": 1
    },
    {
     "x": 0,
     "y": 2
    },
    {
     "x": 1,
     "y": 2
    },
    {
     "x": 2,
     "y": 2
    }
   ],
   "victory": "enemy_wipe",
   "defeat": "player_wipe",
   "result": {
    "credits": 2400,
    "exp": 150,
    "items": {
     "sample-I-000000": 2
    }
   },
   "requires": {
    "missions": [
     "sample-TM-000000"
    ]
   },
   "enemies": [
    {
     "id": "enemy-0",
     "name": "敵第1部隊",
     "position": {
      "x": 5,
      "y": 4
     },
     "ai": {
      "pattern": "ambush",
      "target": "nearest",
      "triggerRange": 5
     },
     "members": [
      {
       "unit": "sample-U-000013",
       "name": "訓練標的1"
      },
      {
       "unit": "sample-U-000013",
       "name": "訓練標的2"
      }
     ]
    },
    {
     "id": "enemy-1",
     "name": "敵第2部隊",
     "position": {
      "x": 9,
      "y": 4
     },
     "ai": {
      "pattern": "hold",
      "target": "lowest_hp"
     },
     "members": [
      {
       "unit": "sample-U-000013",
       "name": "訓練標的1"
      },
      {
       "unit": "sample-U-000013",
       "name": "訓練標的2"
      }
     ]
    }
   ]
  },
  {
   "id": "sample-TM-000002",
   "code": "OP-02",
   "kind": "combat",
   "name": "軌道上の遭遇",
   "desc": "宇宙空間で遭遇した敵部隊を排除する。宇宙適性を確認するためのサンプル。",
   "goal": "敵部隊の全滅",
   "terrainLabel": "宇宙",
   "formation": "宇宙対応の部隊",
   "reward": "3,600 Cr",
   "color": "#222d48",
   "surface": "space",
   "map": {
    "width": 12,
    "height": 9,
    "rows": [
     "xssssssxssss",
     "ssssxssssssx",
     "sxssssssxsss",
     "sssssxssssss",
     "ssxssssssxss",
     "ssssssxsssss",
     "sssxssssssxs",
     "xssssssxssss",
     "ssssxssssssx"
    ]
   },
   "playerStarts": [
    {
     "x": 0,
     "y": 0
    },
    {
     "x": 1,
     "y": 0
    },
    {
     "x": 2,
     "y": 0
    },
    {
     "x": 0,
     "y": 1
    },
    {
     "x": 1,
     "y": 1
    },
    {
     "x": 2,
     "y": 1
    },
    {
     "x": 0,
     "y": 2
    },
    {
     "x": 1,
     "y": 2
    },
    {
     "x": 2,
     "y": 2
    }
   ],
   "victory": "enemy_wipe",
   "defeat": "player_wipe",
   "result": {
    "credits": 3600,
    "exp": 220,
    "items": {
     "sample-I-000002": 1
    }
   },
   "hidden": true,
   "requires": {
    "missions": [
     "sample-TM-000001"
    ]
   },
   "enemies": [
    {
     "id": "enemy-0",
     "name": "敵第1部隊",
     "position": {
      "x": 5,
      "y": 4
     },
     "ai": {
      "pattern": "cautious",
      "target": "strongest",
      "retreatHpPct": 50
     },
     "members": [
      {
       "unit": "sample-U-000014",
       "name": "訓練標的1"
      },
      {
       "unit": "sample-U-000014",
       "name": "訓練標的2"
      }
     ]
    },
    {
     "id": "enemy-1",
     "name": "敵第2部隊",
     "position": {
      "x": 9,
      "y": 4
     },
     "ai": {
      "pattern": "assault",
      "target": "nearest"
     },
     "members": [
      {
       "unit": "sample-U-000014",
       "name": "訓練標的1"
      },
      {
       "unit": "sample-U-000014",
       "name": "訓練標的2"
      }
     ]
    }
   ]
  }
 ]
};
