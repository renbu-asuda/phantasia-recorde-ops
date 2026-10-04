/* PRO data pack — 1.9.0 機能サンプル（統合パック Bundle Schema 2）
 * ゲームの「データ管理 → 統合JSを読み込む」で読み込むと、1.9で追加した要素をまとめて試せます。
 * パイロット・研究・ショップ・装備・キーアイテム・ランダム箱・加入・スキルツリー・
 * ボス撃破／防衛／護衛／連戦・援軍・TURN制限・出撃タグ制限・地形・ストーリー・星評価・曜日限定。 */
window.VAIS_BUNDLE_PACK = {
  "format": "VAIS_OUTER_OPS_BUNDLE_PACK",
  "schemaVersion": 2,
  "packId": "pro_190_feature_sample",
  "packName": "1.9.0 機能サンプル",
  "units": [
    {
      "id": "f19-u-lead", "name": "レイ", "role": "分隊長", "mark": "REI", "tags": ["歩兵", "生身", "隊長"],
      "deploy": {"player": true, "enemy": false},
      "hp": 3600, "atk": 560, "def": 40, "mob": 560, "acc": 580,
      "skills": [
        {"id": "f19-s-command", "name": "号令", "trigger": "battle_start", "effect": "atk_up_pct", "value": 15, "chance": 100, "maxUses": 1, "target": "allies", "duration": 3, "note": "戦闘開始時に味方全体のATK+15%（3TURN）"},
        {"id": "f19-s-grit", "name": "不屈", "trigger": "on_death", "effect": "guts", "value": 1, "chance": 100, "maxUses": 1, "note": "1戦闘に1回、HP1で踏みとどまる"}
      ],
      "weapons": [
        {"name": "E90", "attackType": "ranged", "damageType": "physical", "powerPct": 100, "accuracyPt": 15, "critPt": 0, "targetCount": 1, "weight": 1, "minDamage": 50, "hitsMin": 1, "hitsMax": 4, "hitPowerPct": 25},
        {"name": "グレネード", "attackType": "ranged", "damageType": "physical", "powerPct": 120, "accuracyPt": 0, "critPt": 0, "targetCount": 3, "weight": 0.6, "minDamage": 40, "hitsMin": 1, "hitsMax": 1, "hitPowerPct": 80, "usesPerBattle": 2, "fxColor": "#ff9a3c"}
      ],
      "growth": {"hp": 140, "atk": 18, "def": 2, "mob": 10, "acc": 12},
      "skillTree": [
        {"id": "f19-n-aim", "cost": 1, "minLevel": 1, "requires": [], "skill": {"id": "f19-s-aim", "name": "精密射撃", "trigger": "before_attack", "effect": "hit_up_pt", "value": 10, "chance": 100, "maxUses": 0}},
        {"id": "f19-n-pierce", "cost": 2, "minLevel": 3, "requires": ["f19-n-aim"], "skill": {"id": "f19-s-pierce", "name": "装甲貫通弾", "trigger": "before_attack", "effect": "def_pierce_pct", "value": 30, "chance": 100, "maxUses": 0}},
        {"id": "f19-n-killer", "cost": 2, "minLevel": 5, "requires": ["f19-n-aim"], "skill": {"id": "f19-s-antiarmor", "name": "対装甲戦術", "trigger": "before_attack", "effect": "tag_damage_up_pct", "value": 40, "chance": 100, "maxUses": 0, "tag": "装甲車"}}
      ]
    },
    {
      "id": "f19-u-medic", "name": "ミナ", "role": "衛生兵", "mark": "MED", "tags": ["歩兵", "生身", "衛生兵"],
      "deploy": {"player": true, "enemy": false}, "row": "back",
      "hp": 3000, "atk": 420, "def": 0, "mob": 520, "acc": 520,
      "skills": [
        {"id": "f19-s-firstaid", "name": "応急手当", "trigger": "turn_end", "effect": "heal_maxhp_pct", "value": 12, "chance": 100, "maxUses": 0, "target": "weakest_ally", "note": "HP割合が最も低い味方を回復"},
        {"id": "f19-s-cover", "name": "煙幕", "trigger": "ally_down", "effect": "shield", "value": 800, "chance": 100, "maxUses": 1, "target": "allies"}
      ],
      "weapons": [{"name": "SMG", "attackType": "ranged", "damageType": "physical", "powerPct": 90, "accuracyPt": 10, "critPt": 0, "targetCount": 1, "weight": 1, "minDamage": 40, "hitsMin": 2, "hitsMax": 5, "hitPowerPct": 20}]
    },
    {
      "id": "f19-u-tank", "name": "ガードナー", "role": "装甲車", "mark": "GRD", "tags": ["装甲車", "機械"],
      "deploy": {"player": true, "enemy": false},
      "hp": 8000, "atk": 620, "def": 380, "mob": 360, "acc": 480,
      "skills": [
        {"id": "f19-s-taunt", "name": "挑発射撃", "trigger": "turn_start", "effect": "taunt", "value": 200, "chance": 100, "maxUses": 0, "duration": 1, "note": "敵に狙われやすくなる"},
        {"id": "f19-s-counter", "name": "迎撃", "trigger": "after_damaged", "effect": "counter", "value": 60, "chance": 30, "maxUses": 0}
      ],
      "weapons": [
        {"name": "機関砲", "attackType": "ranged", "damageType": "physical", "powerPct": 100, "accuracyPt": 10, "critPt": 0, "targetCount": 1, "weight": 1, "minDamage": 50, "hitsMin": 2, "hitsMax": 4, "hitPowerPct": 30},
        {"name": "徹甲砲", "attackType": "ranged", "damageType": "physical", "powerPct": 220, "accuracyPt": 0, "critPt": 5, "targetCount": 1, "weight": 2, "minDamage": 100, "hitsMin": 1, "hitsMax": 1, "hitPowerPct": 100, "usesPerBattle": 3, "cooldown": 1, "defPiercePct": 40, "fxColor": "#ffd23c"}
      ]
    },
    {
      "id": "f19-u-scout", "name": "ツバメ", "role": "偵察兵", "mark": "SWL", "tags": ["歩兵", "生身", "偵察"],
      "deploy": {"player": true, "enemy": false},
      "hp": 2800, "atk": 500, "def": 0, "mob": 760, "acc": 600,
      "skills": [{"id": "f19-s-dodge-counter", "name": "見切り", "trigger": "on_evade", "effect": "counter", "value": 70, "chance": 50, "maxUses": 0}],
      "weapons": [{"name": "ナイフ", "attackType": "melee", "damageType": "physical", "powerPct": 80, "accuracyPt": 20, "critPt": 10, "targetCount": 1, "weight": 1, "minDamage": 30, "hitsMin": 2, "hitsMax": 3, "hitPowerPct": 45}],
      "recruit": {"locked": true, "missionId": "f19-m-02", "note": "防衛線維持をクリア、またはスカウト契約書で加入"}
    },
    {
      "id": "f19-u-ace", "name": "ヴァルキリー", "role": "試作機", "mark": "VAL", "tags": ["機械", "エース"],
      "deploy": {"player": true, "enemy": false},
      "hp": 6500, "atk": 900, "def": 200, "mob": 700, "acc": 700,
      "skills": [{"id": "f19-s-ace-chain", "name": "連続起動", "trigger": "on_kill", "effect": "extra_action", "value": 1, "chance": 100, "maxUses": 2}],
      "weapons": [{"name": "ビームライフル", "attackType": "ranged", "damageType": "beam", "powerPct": 130, "accuracyPt": 15, "critPt": 5, "targetCount": 1, "weight": 1, "minDamage": 80, "hitsMin": 1, "hitsMax": 2, "hitPowerPct": 70, "fxColor": "#5ad8ff"}],
      "recruit": {"locked": true, "note": "研究「エース計画」で加入"}
    },
    {
      "id": "f19-u-vip", "name": "要人", "role": "非戦闘員", "tags": ["生身", "要人"],
      "deploy": {"player": false, "enemy": false},
      "hp": 4000, "atk": 200, "def": 0, "mob": 400, "acc": 400,
      "weapons": [{"name": "護身用拳銃", "attackType": "ranged", "damageType": "physical", "powerPct": 80, "accuracyPt": 0, "critPt": 0, "targetCount": 1, "weight": 1, "minDamage": 20, "hitsMin": 1, "hitsMax": 1, "hitPowerPct": 100}]
    },
    {
      "id": "f19-e-trooper", "name": "敵歩兵", "role": "歩兵", "tags": ["歩兵", "生身"],
      "deploy": {"player": false, "enemy": true},
      "hp": 3000, "atk": 500, "def": 0, "mob": 500, "acc": 500,
      "weapons": [{"name": "E90", "attackType": "ranged", "damageType": "physical", "powerPct": 100, "accuracyPt": 15, "critPt": 0, "targetCount": 1, "weight": 1, "minDamage": 50, "hitsMin": 1, "hitsMax": 4, "hitPowerPct": 25}]
    },
    {
      "id": "f19-e-sniper", "name": "敵狙撃兵", "role": "狙撃兵", "tags": ["歩兵", "生身"],
      "deploy": {"player": false, "enemy": true}, "row": "back", "ai": {"target": "lowest_hp"},
      "hp": 2600, "atk": 620, "def": 0, "mob": 480, "acc": 650,
      "skills": [{"id": "f19-s-snipe", "name": "狙撃", "trigger": "before_attack", "effect": "crit_up_pt", "value": 15, "chance": 100, "maxUses": 0}],
      "weapons": [{"name": "狙撃銃", "attackType": "ranged", "damageType": "physical", "powerPct": 160, "accuracyPt": 20, "critPt": 10, "targetCount": 1, "weight": 1, "minDamage": 80, "hitsMin": 1, "hitsMax": 1, "hitPowerPct": 100}]
    },
    {
      "id": "f19-e-armor", "name": "敵装甲車", "role": "装甲車", "tags": ["装甲車", "機械"],
      "deploy": {"player": false, "enemy": true}, "ai": {"target": "tag", "tag": "生身"},
      "hp": 7000, "atk": 600, "def": 300, "mob": 350, "acc": 480,
      "weapons": [
        {"name": "機関砲", "attackType": "ranged", "damageType": "physical", "powerPct": 100, "accuracyPt": 10, "critPt": 0, "targetCount": 1, "weight": 1, "minDamage": 50, "hitsMin": 2, "hitsMax": 4, "hitPowerPct": 30},
        {"name": "焼夷弾", "attackType": "ranged", "damageType": "special", "powerPct": 70, "accuracyPt": 0, "critPt": 0, "targetCount": 2, "weight": 0.5, "minDamage": 30, "hitsMin": 1, "hitsMax": 1, "hitPowerPct": 100, "usesPerBattle": 2}
      ],
      "skills": [{"id": "f19-s-napalm", "name": "延焼", "trigger": "after_attack", "effect": "burn", "value": 150, "chance": 30, "maxUses": 0, "duration": 2}],
      "exp": 80
    },
    {
      "id": "f19-e-boss", "name": "指揮官機", "role": "指揮官機", "mark": "CMD", "tags": ["機械", "指揮官"],
      "deploy": {"player": false, "enemy": true}, "row": "back",
      "hp": 15000, "atk": 900, "def": 250, "mob": 520, "acc": 600,
      "skills": [
        {"id": "f19-s-barrier", "name": "防御フィールド", "trigger": "battle_start", "effect": "shield", "value": 3000, "chance": 100, "maxUses": 1},
        {"id": "f19-s-rage", "name": "激昂", "trigger": "turn_start", "effect": "atk_up_pct", "value": 30, "chance": 100, "maxUses": 1, "duration": 99, "cond": {"type": "hp_below", "value": 50}},
        {"id": "f19-s-shock", "name": "電撃", "trigger": "after_attack", "effect": "stun", "value": 1, "chance": 20, "maxUses": 0, "duration": 1},
        {"id": "f19-s-jam", "name": "ジャミング", "trigger": "turn_start", "effect": "acc_down_pct", "value": 10, "chance": 50, "maxUses": 0, "target": "enemies", "duration": 1}
      ],
      "weapons": [
        {"name": "メガ粒子砲", "attackType": "ranged", "damageType": "beam", "powerPct": 140, "accuracyPt": 10, "critPt": 0, "targetCount": 3, "weight": 1, "minDamage": 60, "hitsMin": 1, "hitsMax": 1, "hitPowerPct": 70, "cooldown": 1, "fxColor": "#ff4fd8"},
        {"name": "バルカン", "attackType": "ranged", "damageType": "physical", "powerPct": 100, "accuracyPt": 15, "critPt": 0, "targetCount": 1, "weight": 1, "minDamage": 40, "hitsMin": 2, "hitsMax": 5, "hitPowerPct": 22}
      ],
      "exp": 400
    }
  ],
  "pilots": [
    {"id": "f19-p-kai", "name": "カイ", "tags": ["パイロット"], "stats": {"acc": 40, "mob": 20}, "aptitude": {"tags": ["機械"], "pct": 15}, "skills": [{"id": "f19-s-kai-focus", "name": "集中", "trigger": "on_crit", "effect": "extra_action", "value": 1, "chance": 50, "maxUses": 1}], "note": "機械タグの機体でATK・MOB・ACC+15%"},
    {"id": "f19-p-rin", "name": "リン", "tags": ["パイロット"], "stats": {"mob": 40}, "skills": [{"id": "f19-s-rin-evade", "name": "回避運動", "trigger": "when_targeted", "effect": "enemy_hit_down_pt", "value": 10, "chance": 100, "maxUses": 0}]}
  ],
  "missions": [
    {
      "id": "f19-m-01", "name": "演習：市街地突破", "diff": "E", "reward": 1200, "desc": "市街地の敵を排除せよ。近接攻撃が当たりやすい地形。",
      "enemies": ["f19-e-trooper", "f19-e-trooper", "f19-e-sniper"], "enemyRows": ["front", "front", "back"], "maxDeploy": 4, "terrain": "市街地", "tags": ["チュートリアル"], "rules": [],
      "drops": [{"itemId": "f19-i-medkit", "chance": 80, "min": 1, "max": 2}, {"itemId": "f19-i-crate", "chance": 50, "min": 1, "max": 1}],
      "story": {"before": [{"speaker": "レイ", "text": "演習を始める。狙撃兵は後衛だ、近接は届かないぞ。"}, {"speaker": "ミナ", "text": "負傷者は私が手当てします！"}], "after": [{"speaker": "レイ", "text": "上出来だ。次は本番の防衛線だな。"}]}
    },
    {
      "id": "f19-m-02", "name": "防衛線維持", "diff": "D", "reward": 1800, "desc": "6TURNの間、防衛線を守り抜け。3TURN目に敵の援軍が来る。",
      "enemies": ["f19-e-trooper", "f19-e-trooper", "f19-e-armor"], "maxDeploy": 5, "terrain": "森林", "tags": [],
      "objective": {"type": "defense", "turns": 6},
      "rules": [{"type": "reinforce", "turn": 3, "enemies": ["f19-e-trooper", "f19-e-sniper"]}],
      "requires": {"missions": ["f19-m-01"]},
      "drops": [{"itemId": "f19-i-keycard", "chance": 100, "min": 1, "max": 1}, {"itemId": "f19-i-manual", "chance": 30, "min": 1, "max": 1}],
      "story": {"after": [{"speaker": "ツバメ", "text": "援護に来た偵察兵のツバメだよ。今日からよろしく！"}]}
    },
    {
      "id": "f19-m-03", "name": "夜間護衛", "diff": "C", "reward": 2400, "desc": "要人を守りながら夜の街道を抜けろ。要人が倒れると任務失敗。",
      "enemies": ["f19-e-trooper", "f19-e-trooper", "f19-e-sniper", "f19-e-sniper"], "enemyRows": ["front", "front", "back", "back"], "maxDeploy": 4, "terrain": "夜間", "tags": [],
      "objective": {"type": "escort", "escortUnitId": "f19-u-vip"},
      "requires": {"missions": ["f19-m-02"]},
      "stars": [{"type": "clear"}, {"type": "hp_ge", "value": 60}, {"type": "turns_le", "value": 8}],
      "drops": [{"itemId": "f19-i-recruit", "chance": 25, "min": 1, "max": 1}, {"itemId": "f19-i-exp", "chance": 60, "min": 1, "max": 1}]
    },
    {
      "id": "f19-m-04", "name": "連戦：補給基地制圧", "diff": "C+", "reward": 3200, "desc": "3つの部隊を連続で撃破せよ。HPは持ち越し。25TURN以内に勝てなければ失敗。装甲車が硬いので、研究でヴァルキリーを配備するか、レイのスキルツリー「装甲貫通弾」「対装甲戦術」を習得してから挑もう。",
      "enemies": ["f19-e-trooper", "f19-e-trooper", "f19-e-trooper"], "maxDeploy": 6, "terrain": "砂漠", "tags": [],
      "objective": {"type": "chain"},
      "waves": [["f19-e-armor", "f19-e-trooper"], ["f19-e-armor", "f19-e-sniper"]],
      "rules": [{"type": "turn_limit", "value": 25}],
      "requires": {"missions": ["f19-m-02"]},
      "starReward": 800,
      "drops": [{"itemId": "f19-i-crate", "chance": 100, "min": 1, "max": 2}, {"itemId": "f19-i-cyber", "chance": 20, "min": 1, "max": 1}]
    },
    {
      "id": "f19-m-05", "name": "指揮官機撃破", "diff": "B", "reward": 6000, "desc": "防御フィールドを持つ指揮官機を撃破せよ。護衛を無視してもよい。カードキーが必要。",
      "enemies": ["f19-e-boss", "f19-e-armor", "f19-e-trooper", "f19-e-trooper"], "enemyRows": ["back", "front", "front", "front"], "maxDeploy": 6, "terrain": "標準", "tags": ["ボス"],
      "objective": {"type": "boss", "bossIndex": 0},
      "requires": {"missions": ["f19-m-02"], "items": ["f19-i-keycard"], "minLevel": 3},
      "drops": [{"itemId": "f19-i-armor", "chance": 50, "min": 1, "max": 1}],
      "story": {"before": [{"speaker": "指揮官機", "text": "この防御フィールドを破れるものか。"}, {"speaker": "レイ", "text": "装甲車には徹甲砲、フィールドは集中砲火で削るぞ！"}]}
    },
    {
      "id": "f19-m-06", "name": "週末限定：機甲演習", "diff": "D+", "reward": 2500, "desc": "土日だけ実施される機械ユニット限定の演習。経験値が多い。",
      "enemies": ["f19-e-armor", "f19-e-armor"], "maxDeploy": 3, "terrain": "雪原", "tags": ["限定"],
      "rules": [{"type": "deploy_tags", "allTags": ["機械"]}],
      "days": [0, 6], "exp": 120,
      "drops": [{"itemId": "f19-i-repair", "chance": 100, "min": 2, "max": 3}]
    }
  ],
  "items": [
    {"id": "f19-i-medkit", "name": "医療キット", "desc": "生身のユニットを回復。", "requires": {"allTags": ["生身"]}, "effect": {"type": "heal_hp_flat", "value": 1500}, "price": 300},
    {"id": "f19-i-repair", "name": "修理キット", "desc": "生身以外のユニットを修理。", "requires": {"noneTags": ["生身"]}, "effect": {"type": "heal_hp_pct", "value": 50}, "price": 400},
    {"id": "f19-i-ration", "name": "特製レーション", "desc": "部隊全員の次の出撃だけATK+15%。", "effect": {"type": "sortie_buff", "stat": "atk", "value": 15}, "scope": "party", "price": 600},
    {"id": "f19-i-scope", "name": "高精度スコープ", "desc": "装備するとACC+40。", "equip": {"slot": "accessory", "stats": {"acc": 40}, "skills": [], "weapons": []}, "price": 1500, "shop": {"requiresResearch": "f19-r-01"}},
    {"id": "f19-i-armor", "name": "複合装甲", "desc": "装備するとDEF+80・最大HP+500、被ダメージを時々軽減。", "equip": {"slot": "accessory", "stats": {"hp": 500, "def": 80}, "skills": [{"id": "f19-s-armor-guard", "name": "複合装甲", "trigger": "when_targeted", "effect": "damage_reduce_pct", "value": 10, "chance": 40, "maxUses": 0}], "weapons": []}},
    {"id": "f19-i-manual", "name": "戦術教本", "desc": "スキルポイント+1。1体3回まで。", "effect": {"type": "skill_point", "value": 1}, "limitPerUnit": 3, "price": 2000},
    {"id": "f19-i-exp", "name": "戦闘記録", "desc": "経験値+300。", "effect": {"type": "exp_gain", "value": 300}, "price": 900},
    {"id": "f19-i-crate", "name": "補給コンテナ", "desc": "何が入っているかは開けてのお楽しみ。", "effect": {"type": "loot_box", "table": [{"itemId": "f19-i-medkit", "weight": 5, "min": 1, "max": 2}, {"itemId": "f19-i-repair", "weight": 3, "min": 1, "max": 1}, {"itemId": "f19-i-exp", "weight": 2, "min": 1, "max": 1}, {"itemId": "f19-i-manual", "weight": 1, "min": 1, "max": 1}]}},
    {"id": "f19-i-cyber", "name": "サイバー化手術", "desc": "生身タグを外し、機械タグを付ける。修理キットが使えるようになる。", "requires": {"allTags": ["生身"]}, "effects": [{"type": "remove_tag", "tag": "生身"}, {"type": "add_tag", "tag": "機械"}, {"type": "stat_up_flat", "stat": "def", "value": 60}]},
    {"id": "f19-i-keycard", "name": "司令部カードキー", "desc": "指揮官機の作戦に必要。", "key": true},
    {"id": "f19-i-recruit", "name": "スカウト契約書", "desc": "偵察兵ツバメが加入する。", "effect": {"type": "recruit_unit", "unitId": "f19-u-scout"}}
  ],
  "research": [
    {"id": "f19-r-01", "name": "照準技術", "desc": "高精度スコープをショップに並べる。", "cost": {"credits": 1500, "items": {}}, "requires": [], "unlock": {"units": [], "items": ["f19-i-scope"], "grantItems": {}}},
    {"id": "f19-r-02", "name": "エース計画", "desc": "試作機ヴァルキリーを配備し、複合装甲を1つ支給する。", "cost": {"credits": 5000, "items": {"f19-i-manual": 1}}, "requires": ["f19-r-01"], "unlock": {"units": ["f19-u-ace"], "items": [], "grantItems": {"f19-i-armor": 1}}}
  ]
};
