# PRO 1.15.0 追補

新項目と処理順は [FEATURES_1_15.md](FEATURES_1_15.md) を参照。新機能使用時は Unit 9 / Mission 5 / Item 7 / Bundle 9。以下は旧版の項目を含む従来資料です。

# Toolkit 1.14.2: 共有スキル（Unit / Bundle Schema 8）

> 追補（番号据え置き）: アイテムの装備にも参照を使えます。`equip.skillIds`（8個まで）と `equip.weaponIds`（4個まで）で、同じパックの `skills` / `weapons` のIDを指定します（指定した側は埋め込みの `skills` / `weapons` を持ちません）。参照を使うと Bundle Schema 8。`PROCore.resolveItemData(item, weapons, skills)` で展開、`materializeItem` で参照を埋め込みに置き換えます。ゲームと単体メーカーは読み込み時に展開し、アイテムパック単体（`VAIS_ITEM_PACK`）は参照を持てません（統合パックとして読み込みます）。

ユニットパック／統合パックの直下 `skills` にスキル定義を保存し、ユニットから同じパック内のIDを参照します。

```js
skills: [{ id: "skill-heal", name: "再生", trigger: "turn_start", effect: "heal_maxhp_pct", value: 5, chance: 100 }],
units: [{ id: "soldier", name: "歩兵", hp: 3000, atk: 250, def: 0, mob: 500, acc: 500,
  skillIds: ["skill-heal"],
  // 必要なら以下の既存拡張項目にも紐付ける（ノードには従来の費用・前提項目なども設定）。
  skillTree: [{ id: "node-heal", name: "再生習得", skillId: "skill-heal" }],
  pilotProfile: { skillIds: ["skill-heal"] }
}]
```

- 共有スキル最大1000件、通常スキル最大24件、搭乗中スキル最大8件。ツリーは各ノードに1つの `skillId`。
- マスターのID重複、欠損参照、同じ通常／搭乗中リストの二重参照はエラー。参照がある場合は対応する旧埋め込み形式より優先します。`skillIds: []` は通常スキルなしを明示します。
- 統合メーカーは出力時に解決済みキャッシュを外し、共有定義とID参照だけを保存します。ゲームは戦闘用の解決済みスキルも保持し、再読み込み時にマスターから更新します。
- 統合メーカーの読込では旧 `skills`・旧 `ability`・ツリーの `skill`・搭乗中の `skills` を共有化。同じIDと内容は再利用し、同じIDで内容が違う場合は参照先を別IDにします。既存の別IDは維持します。
- Unit／Mission／Itemの個別メーカーは共有定義を展開して利用し、ユニット単独で使える埋め込み形式を維持します。アイテムが付与するスキル・装備中スキルは引き続き埋め込み形式です。
- 新参照形式にはGame／メーカー1.14.2以降が必要。旧Unit Schema 1～7・旧Bundle Schema 1～7とセーブversion 2を引き続き読み込めます。スキルだけの統合カタログも作成可能ですが、参照先はユニットと同じパックに含めてください。

# Toolkit 1.14.1: IDプリセットと符号付きHP効果

IDプリセットは各メーカーの「IDプリセット」欄で設定するブラウザ上の制作設定です。固定文字列・種類・連番を任意の区画数と順番で組み合わせ、種類ごとに保存・適用します。プリセットは出力JSには含まれず、既存IDを変更しません。衝突時は連番を進め、連番区画がない場合は末尾へ番号を付けます。

スキル／武装追加効果の `heal_maxhp_pct`・`heal_flat` の `value` は負数にも対応します。負数の下限は -1000000。割合ダメージは対象の最大HPを基準に計算し、小数点以下を四捨五入（非ゼロの最小量1）。正数は回復、0は変化なしです。負数はHP直接ダメージで、DEF・耐性・バリアを無視し、HPは0未満になりません。根性・戦闘不能・撃破記録・撃破時効果は通常と同じ処理へ接続します。自傷・味方へのダメージでは撃破数を加算しません。

対象は `target` に従い、省略時は従来通り自分です。例えば `trigger: "turn_start", effect: "heal_maxhp_pct", value: -25, target: "enemies"` は、ターン開始時に生存する敵全体へ各敵の最大HPの25%を直接ダメージとして与えます。自分への毒のような効果は `target: "self"` を指定します。スキルはID・名前・発動率など、従来の必須項目も設定してください。

アイテムの基地回復効果 `heal_hp_flat`・`heal_hp_pct` は正数のみです。アイテムで付与するスキル、装備中のスキル、追加する武装のHP効果は上記の符号付き仕様に対応します。

Schema番号とキーは変更していません。負数の回復効果を含むデータには、Game・メーカーとも **1.14.1以降**を使用してください。旧パックと既存セーブを引き続き読み込めます。

# Toolkit 1.14.0: 武装マスターと攻撃力

新しい武装項目は `baseAtk`（0～1000000の数値、未設定は0）と `useUnitAtk`（boolean、未設定はtrue）。
攻撃力は `((useUnitAtk === false ? 0 : 現在ATK) + baseAtk) * powerPct / 100`。
この後にDEF・1HIT倍率・乱数・スキル・最低ダメージ・CRITを従来の順序で適用する。

例: ATK250、基礎250、威力100%なら参照ありで500。参照なしなら250。
ATK参照なし・基礎0でも、武装のminDamageが0以外なら最低ダメージは発生する。

統合/ユニットパックの `weapons` に `{id, name, ...武装項目}` を格納し、各ユニットは `weaponIds: ["weapon-rifle"]` で選ぶ。
```js
weapons: [{ id: "weapon-rifle", name: "ライフル", attackType: "ranged", damageType: "physical", baseAtk: 250, useUnitAtk: true, powerPct: 100 }],
units: [{ id: "soldier", name: "歩兵", hp: 3000, atk: 250, def: 0, mob: 500, acc: 500, weaponIds: ["weapon-rifle"] }]
```

参照は同じパックの武装マスター内で解決する。欠損・重複ID・同じIDの二重装備はエラー。
`weaponIds` がある場合はその参照が優先される。ゲーム内の正規化キャッシュには解決済み `weapons` が併存するが、統合メーカーの書き出しではキャッシュを保存しない。
旧ユニットの `weapons: [{name, ...}]` もそのまま使用可能。統合メーカーでは読み込み時にマスター化する（ATK・威力の自動変更はしない）。
Unit Makerでの個別書き出しは武装を展開するため、外部武装ファイルは不要。
アイテムの追加武装や装備品の武装は従来の埋め込み形式で、baseAtk/useUnitAtkを利用可能。

新項目/マスターを使用したUnitはSchema7、ItemはSchema6、BundleはSchema7。新項目を使わない旧パックは以前のSchemaで保存可能。Missionは変更なし。
既存セーブのユニットID・名簿・個別強化・武装習得・装備は維持する。基本データのATKと成長値は変更されるため、ATK依存の育成効果は新しい参照式に従う。

# Toolkit 1.13.0 雇用・個体・出撃費用・装備枠（Unit Schema 6 / Mission Schema 4 / Item Schema 5 / Bundle Schema 6）

## 雇用候補 `hires`（ユニットパック・統合パックの直下、最大200）

```js
hires: [
  { id: 'h-tiger', unitId: 'core-u-tiger', cost: 1200 },                       // 最初から雇える
  { id: 'h-fox', unitId: 'core-u-fox', cost: 1800, limit: 2,                   // 所持数2体まで
    requires: { missions: ['core-m-02'], research: [], items: [], day: 0 },     // すべて満たすと雇える
    hidden: true, note: '雇用画面の紹介文' }                                    // 条件を満たすまで隠す
]
```

- `unitId` は味方として出撃できるユニット。`cost` は0以上（0=無料）、`limit` は0〜99（0・省略=無制限。そのユニットの所持数で判定）。
- 雇用は同じユニットを何体でも追加します。加入条件（`recruit`）のないユニットや、作戦・研究・アイテムで加入したユニットは、今までどおり1体が無料で加わります。
  `recruit.locked` で加入条件を付け、加入させる手段を作らなければ「雇用でしか手に入らないユニット」になります。
- 検証: `PROCore.hire(h)` / `PROCore.hireList(list)`、条件の文章 `PROCore.hireRequirementText(h, names)`。

## ユニットの追加項目

| 項目 | 内容 | 省略時 |
| --- | --- | --- |
| `sortieCost` | 出撃1回の費用（0〜）。勝敗に関係なく出撃時に部隊全員ぶん引く。合計が資金を超えると出撃不可 | 0 |
| `equipSlots` | 装備枠の数（0〜6） | 2 |
| `noFire` | `true` で解雇できない | false |

アイテム効果 `{type:'equip_slot', value: -3〜3（0以外）}`: 使ったユニット（個体）の装備枠を増減（0〜8枠）。減ってあふれた装備はアイテム一覧に戻ります。

## 作戦・研究・ドロップ

- 作戦 `hidden: true`: 前提作戦（`requires.missions`）・キーアイテム（`requires.items`）を満たすまで一覧に出しません。曜日（`days`）だけでは隠しません。
- 研究 `hidden: true`: 前提研究が終わるまで一覧に出しません。
- ドロップ `odds: [分子, 分母]`（`chance` の代わり）: 分数のまま正確に抽選します。`PROCore.drop(d)`・`dropChance(d)`（0〜1）・`dropRateText(d)`（「1/8（12.5%）」）・`parseDropRate('1/8'|'50%'|'50')`。

## Schema 番号（使ったときだけ上がる）

| 種類 | 上がる条件 | 番号 |
| --- | --- | --- |
| Unit Pack | `sortieCost`・`equipSlots`（2以外）・`noFire`・`hires` | 6 |
| Mission Pack | 作戦の `hidden`・ドロップの `odds` | 4 |
| Item Pack | `equip_slot` 効果・研究の `hidden` | 5 |
| 統合パック | 上のいずれか | 6 |

## セーブデータ（version 2）

- `state.roster: [{uid, base, name?, slotMod?}]` — 所持しているユニットの個体。`uid` は1体目が基本ID、2体目以降は `基本ID__2`、`__3`…。`name` は呼び名、`slotMod` は装備枠の増減。
- `state.joined: [基本ID]` — 無料で加入済みの基本ユニット（解雇しても再加入しません）。
- HP・レベル・装備・パイロット・疲労・負傷・隊列・強化・スキルツリーなどの各マップは `uid` をキーにします。1体目の `uid` が基本IDなので、version 1 のセーブはそのまま読み込めます（名簿は自動で作成）。

## 追加API

- `PROEditor`（1.7.0）: `tagInput(parent, values, onChange, opts)`（タグの札入力）、`duplicateOf(item)` / `freshIds(x)`（複製とID付け直し）、`hireFields()` / `newHire(unitId)`、`hiddenField(what, help)`、`dropRateInput(parent, drop, onChange)`。
  `form()` の `tags` 型は札入力に、`list` 型とウェーブに「複製」ボタン（`f.duplicate(item, arr)` で上書き可）。`unitExtFields()` に出撃費用・装備枠・解雇不可、`missionExtFields()` と `researchFields()` に「未解放のときの表示」。
- ゲーム（`window.PROGame`）: `hireUnit(id)`、`fireUnit(uid)`、`renameUnit(uid, name?)`。

---

# Toolkit 1.12.3 攻撃属性「幻想」（Unit Schema 5 / Item Schema 4 / Bundle Schema 5）

武装の `damageType` と、耐性スキルの `resistType` に **`fantasy`（幻想）** を追加しました。属性は戦闘の計算には関わらず、ラベル・色・耐性の一致判定にだけ使われます（物理・ビーム・特殊と同じ扱い）。

| `damageType` | 表示 | `resistType`（耐性の対象。上の4つ＋下の2つ） | 表示 |
| --- | --- | --- | --- |
| `physical` | 物理 | `melee` | 近接 |
| `beam` | ビーム | `ranged` | 射撃 |
| `special` | 特殊 | | |
| `fantasy` | 幻想 | | |

- 共通の定義は `PROCore.DAMAGE_TYPES` / `PROCore.RESIST_TYPES`。検証・ラベル・メーカーの選択肢はすべてここから作ります。
- **幻想を使ったデータは新しい Schema 番号で書き出されます**（旧ゲームが黙って「特殊」「物理」として読まないようにするため）。幻想の武装・耐性スキル（スキルツリー・装備品・アイテムで習得するものを含む）がある場合だけです。

| 種類 | 幻想を使わない | 幻想を使った |
| --- | --- | --- |
| Unit Pack | 今までどおり（2〜4） | **Unit Schema 5** |
| Item Pack | 今までどおり（2・3） | **Item Schema 4** |
| 統合パック | 今までどおり（1〜4） | **Bundle Schema 5** |

1.12.2 以前のゲームはこれらを「未対応のschemaVersion」として拒否します。1.12.3 以降のゲームは、未知の属性（例: `holy`）を黙って置き換えず、「属性『holy』は未対応です」と知らせて読み込みを止めます。

- `PROBattle`（1.4.0）: 戦闘の `ctx.effects` に `{resistCount, resistSaved, tagCount, tagBonus}`（耐性で軽減した回数と量、タグ特効の回数と追加ダメージ）。戦闘ログの行末に「耐性で -N」「特効 +N」が付きます。
- `PROEditor`（1.6.0）/ `PROTemplates`（1.3.0）: 耐性テンプレートは物理・ビーム・特殊・幻想・近接・射撃の6種、武装テンプレートに「幻想弾幕」。

---

# Toolkit 1.12.0 作戦データの追加項目（Mission Schema 3 / Bundle Schema 4）

使ったときだけ Schema が上がります（使わなければ Mission 1・2 / Bundle 1～3 のまま）。1.11.0 以前のゲームは Schema 3 の作戦パック・Schema 4 の統合パックを読み込めません。

## 勝敗条件 `objective`

| 項目 | 内容 |
| --- | --- |
| `type` | `annihilate`（殲滅）／`boss`（ボス撃破）／`defense`（防衛）。旧 `escort`（=殲滅＋護衛）・`chain`（=追加ウェーブ付きの殲滅）も読めます |
| `turns` | 防衛で耐えるTURN数（1～300）。指定TURNの終わりまで耐えたら勝利。敵を全滅させても勝利 |
| `bossWave` | ボスがいる波（0=最初の敵、1以降=`waves` の番号）。省略は0 |
| `bossIndex` | その波の中の番号（0から） |
| `escortUnitId` | 護衛するユニット。どの `type` とも組み合わせられ、倒れたら敗北（`escort` 以外に付けると Schema 3） |

TURN制限は今までどおり `rules` の `{type:'turn_limit',value}`（1～300。100以上は Schema 3）。決着がつかないまま300TURN経過で引き分け（`PROBattle.DRAW_TURNS`）。

## 追加ウェーブ `waves`（最大9）

要素は旧形式（敵IDの配列）か、新形式のオブジェクト。

| 項目 | 内容 |
| --- | --- |
| `enemies` | 敵ID（1～8） |
| `rows` | `front` / `back` の配列（省略は全員前衛） |
| `when` | `cleared`（前の敵がいなくなったら・省略時）／`turn`（`value` TURNの開始時、1～300）／`remaining`（敵が残り `value` 体以下、0～8）／`bossHp`（ボスのHPが `value`% 以下、1～99） |
| `label` | 波の名前（40文字まで。ログと説明に出る） |

- どの波も1回だけ出ます。盤面の敵がいなくなったときは、まだ出ていない次の波がそのTURNの終わりに出ます。
- 殲滅の勝利は「全部の波が出たうえで敵が全滅」。ボス撃破はボスを倒した時点で勝利（ボスが後の波にいるなら出現前は勝てない）。
- `cleared` で隊列も名前もない波は旧形式（配列）で書き出します。

## 地形 `terrains`（作戦パック・統合パックの直下、最大50）

`[{name, desc?, meleeHitPt?, rangedHitPt?, mobPct?, banTags?}]`。命中は -100～100、MOB は -90～200(%)。名前の重複は不可。
ゲームは読み込んだパックの地形を `PROCore.registerTerrains` に登録し、`terrainMods(m)` は「作戦の `terrainMods` ＞ パックの地形 ＞ 組み込み10種」の順で決まります（同じ名前の地形は後から読み込んだパックが優先）。地形があるパックは Mission Schema 3 / Bundle Schema 4。

## 追加API

- `PROCore`（2.3.0）: `normalizeWave` / `waveText(w,i,names)` / `waveWhenText` / `formationText(ids,rows,names)` / `bossOf(m)` / `missionConditions(m,names)`（`{win,lose,draw,…}` の文章）/ `missionIsV3` / `terrain` / `terrainList` / `registerTerrains` / `terrainDef` / `terrainEffectText` / `DRAW_TURNS`。`missionSchemaFor(missions,terrains)`。
- `PROBattle`（1.3.0）: `objectiveStatus(ctx)`（`{wave,totalWaves,boss,defenseLeft,escort,nextWave,turnsLeft,enemiesLeft}`）/ `buildBattle` / `DRAW_TURNS`。`runBattle` の既定の最大TURNは300（`opts.maxTurns` で変更可）。
- `PROEditor`（1.5.0）: 項目タイプ `formation`（`rowsKey`）/ `waves` / `objective` / `terrain`、`numberInput(input)`（マイナス可の欄を「±」付きに）/ `normNum` / `terrainEditor(container,{get,onChange})` / `terrainOptions` / `terrainEffectOf` / `testBattle(mission,defs,squad,{seed})`（`{ok,outcome,turns,reason,log,text}`）/ `compactWave`。
  ページ内の `input[type=number]` のうち min が未指定か負の欄は、自動で「±」付きの入力欄になります。

---

# Toolkit 1.11.0 追加API

- `PROBattle`（1.2.0）: `STANDARD_UNIT` / `unitPower(unit)` / `powerRatio(unit)` / `starCount(ratio)`。正規化済みのユニット（ゲームの UNIT_MASTER や `PROEditor.battleUnit` の結果）を渡します。`PROEditor.starRating` / `powerRatio` もこれを使います。
- ゲームの拡張パック画面は `PACK_CATALOG`（`packId` / `file` / `name` / `kind` / `desc`）を一覧表示し、`<script src="file?v=版">` で読み込みます。読み込み前の `window.VAIS_*` は退避・復元します。カタログの packId は重複させないでください。
- 「データファイルを読み込む」は `detectDataKind(text)` で bundle / unit / mission / item / save を判定します。
- セーブ `state.settings.guideDone`（はじめてガイドを閉じたか）を追加。

---

# Toolkit 1.10.4 読み込みチェック

- 各ページは共通ファイルを `?v=<版>` 付きで読み込みます。本体スクリプトの直前の `<script data-pro-guard>` が `PROCore` などの有無と最低バージョンを確認し、足りなければ `#proBootError` に案内を出して `window.__PRO_BOOT_FAILED` に理由の配列を入れます。
- ページから `../` で上のフォルダを参照しないこと（Android のローカルサーバー系アプリで読めなくなる）。

---

# Toolkit 1.10.3 ファイル構成と基本データ

データ形式の変更はありません。同梱ファイルの場所が変わりました。

| 場所 | 中身 |
|---|---|
| `index.html` / `outer_ops_*.js` / `shared/` | ゲーム本体・基本データ・共通モジュール（ルートに配置） |
| ルート | メーカー（`maker_hub.html` / `combined_maker.html` / `unit_maker.html` / `mission_maker.html` / `item_maker.html`）。1.10.4 で `makers/` からルートに戻しました（`../` を読めない環境があるため）。共通ファイルは `shared/xxx.js?v=<版>` で読み込みます |
| `samples/` | `pro_sample_bundle.js` / `pro_190_feature_sample.js` / `pro_1101_weapon_effects_sample.js` / `pro_1102_pilot_sample.js` |
| `expansion_packs/` | `PR-01.js` / `pack-0000.js` / `black_bullet_bundle_PRO.js` / `touhou_bundle_PRO.js` / `mgspw_bundle_PRO.js` |
| `docs/` | `README.txt` / `CHANGELOG.txt` / `INTEGRATION.md` / `TEST_REPORT.txt` |

- 基本データは `packId: "pro-core"`（Unit Schema 4 / Mission Schema 2 / Item Schema 3）。IDは `core-u-*` / `core-e-*` / `core-m-*` / `core-i-*` / `core-r-*`。
- 新しいゲームの初期アイテムは、基本アイテムパックで最初に見つかる `heal_*` 効果のアイテム1個です（`starterItems()`）。
- 以前の基本データ（packId `pack-0000`）は `expansion_packs/pack-0000.js` と同じ内容で、テストでは `tests/fixtures/base_181/` に保存しています。

---

# Toolkit 1.10.2 パイロットとユニットの統合（追加分）

パイロットはユニットとして表します。ユニットに次の2項目（どちらも省略可）を追加しました。どちらかを使ったユニットパックは **Unit Schema 4**、統合パックは **Bundle Schema 3** で出力されます。

```json
{"id": "pl-m-strider", "name": "ストライダー", "crew": "required", "...": "..."}
{"id": "pl-p-kai", "name": "カイ", "crew": "none", "tags": ["歩兵","生身","パイロット"], "...": "...",
 "pilotProfile": {"stats": {"acc": 40, "mob": 20}, "aptitude": {"tags": ["機動兵器"], "pct": 15}, "skills": [], "growthPct": 3}}
```

| 項目 | 内容 |
|---|---|
| `crew` | `required`（パイロットが乗っていないと出撃不可。敵としては無視）／`optional`（省略時。従来どおり任意）／`none`（パイロットは乗れない） |
| `pilotProfile.stats` | 搭乗時の能力補正（hp/atk/def/mob/acc） |
| `pilotProfile.aptitude` | `{tags, pct}`。機体がタグを1つでも持てば ATK・MOB・ACC を pct% 上げる |
| `pilotProfile.skills` | 搭乗時に機体へ加わるスキル（8個まで） |
| `pilotProfile.growthPct` | 0～20（省略=2）。補正 = stats ×（1 + growthPct% ×（パイロットLv − 1））、四捨五入 |

- `crew:"required"` のユニットに `pilotProfile` は付けられません。
- ゲームのセーブ `state.pilots` は `{機体ユニットID: パイロットユニットID}`。搭乗中のパイロットは単独出撃不可。機体と同じ経験値・疲労を受け、機体が撃破されると負傷します。
- 旧形式 `pilots`（Unit Schema 3 / Bundle Schema 2）は `PROCore.pilotsToUnits(units, pilots)` で `crew:"none"`・プレイヤー専用・標準歩兵相当（HP3000/ATK500/DEF0/MOB500/ACC500、ハンドガン）のユニットへ変換されます。IDは維持（重複時は `_pilot` を付加）。`bundlePack` は変換後のユニットを返し、`pilots` は出力しません。
- API（PROCore 2.2.0）: `crews` / `crewOf(unit)` / `pilotProfile(raw, label)` / `pilotBonus(profile, lv)` / `pilotToUnit(pilot, takenIds)` / `pilotsToUnits(units, pilots)` / `unitIsV4(unit)`。PROTemplates 1.2.0: `makePilotUnit(key, name, existingIds)`、ユニットテンプレート `mech` / `pilot`。

---

# Toolkit 1.10.1 武装の追加効果（追加分）

武装に `effects`（省略可・0～4個）を追加しました。使った武装は `weaponIsExtended` が true になり、ユニットは Unit Schema 3（アイテムの `add_weapon`・装備品の武装は Item Schema 3）で出力されます。

```json
{"name": "アーマーブレイカー", "attackType": "ranged", "damageType": "physical", "powerPct": 180, "...": "...",
 "effects": [
   {"timing": "before", "effect": "tag_damage_up_pct", "value": 30, "tag": "装甲車"},
   {"timing": "after",  "effect": "def_down_pct", "value": 20, "when": "hit", "duration": 2, "chance": 100}
 ]}
```

| 項目 | 内容 |
|---|---|
| `timing` | `before`（使用前＝ダメージ計算の前）／`after`（使用後＝攻撃の後）。必須 |
| `effect` | 下の表から。タイミングに合わない組み合わせはエラー |
| `value` | 効果の大きさ（0以上。`drain_pct` / `recoil_pct` は0～100） |
| `chance` | 発動率 0～100（省略=100） |
| `target` | `targets`（この攻撃の対象全員）/ `self` / `allies` / `weakest_ally` / `enemies` / `opponent` / `random_enemy`。省略時は弱体効果なら `targets`、それ以外は `self` |
| `when` | 使用後だけ。`always`（省略）/ `hit` / `crit` / `kill`。`hit`・`crit` で `targets` を狙う効果は、命中した（クリティカルを受けた）相手だけにかかる |
| `duration` | 持続TURN 1～99（バフ・デバフ・挑発・炎上。スタンは行動不能回数）。省略=2（スタンは1） |
| `cond` | スキルと同じ追加条件 `{type, value|tag}` |
| `tag` | `tag_damage_up_pct` の特効タグ（必須） |

| 効果 | 使用前 | 使用後 |
|---|---|---|
| `damage_up_pct` / `hit_up_pt` / `crit_up_pt` / `def_pierce_pct` / `tag_damage_up_pct`（その攻撃だけの修正） | ○ | × |
| `atk/def/mob/acc_up_pct`・`atk/def/mob/acc_down_pct`・`stun`・`burn`・`shield`・`heal_maxhp_pct`・`heal_flat`・`taunt`・`extra_action` | ○ | ○ |
| `drain_pct`（与ダメージの%回復）/ `recoil_pct`（最大HPの%を自分に。HP1未満にならない） | × | ○ |

- 発動は1回の攻撃につき1回、反撃（`opts.counter`）では発動しません。使用前のバフ・デバフはその攻撃のダメージ計算に反映されます。
- API: `PROCore.weaponEffect(raw)` / `weaponEffectText(e)` / `weaponEffectsText(weapon)` / `weaponEffectsAllowed` / `weaponEffectTargets` / `weaponWhen` / `weaponEffectLabels`（2.1.0）。
  `PROBattle.weaponEffects(ctx, unit, weapon, timing, info)`（1.1.0。`damagePreview` は発動率100%・条件なしの使用前効果を見込む）。
  `PROEditor.weaponEffectFields()` / `WEAPON_EFFECT_PRESETS`、`weaponExtFields()` に `effects` リスト（1.2.0）。

---

# Toolkit 1.10.0 メーカー補助API（追加分）

データ形式は1.9.0から変更ありません。メーカーの使いやすさのための共通機能を追加しました。

- `shared/pro_templates.js`（`window.PROTemplates` 1.0.0）
  - 一覧: `units` / `tiers` / `factions` / `skills` / `weapons` / `items` / `missions` / `ranks` / `pilots` / `research`（各要素は `key` / `label` / `desc`）。
  - 生成: `makeUnit(key, tier, faction, name, existingIds)` / `makeItem(key, name, ctx, existingIds)` / `makeMission(key, rank, name, ctx, existingIds)` / `makePilot` / `makeResearch` / `makeTreeNode` / `skillByKey` / `weaponByKey`。生成物はすべて `PROCore` の検証を通ります。
  - `autoId(prefix, existingIds)`: `unit-0001` 形式の重複しないID。
- `shared/pro_editor.js`（`window.PROEditor` 1.1.0）
  - モード: `mode()` / `setMode('easy'|'expert')`（localStorage `pro_maker_mode`）/ `modeToggle(container, onChange)`。かんたんモードでは `body.mode-easy` になり `.adv` 要素を隠します。フォーム項目の `advanced:true` は「詳細設定を開く」に入ります。
  - 参照ピッカー: フォーム項目 `type:'ref'`（`ref: units|enemies|players|lockedUnits|missions|items|keyItems|pricedItems|research|nodes`、`multi` / `ordered`）と `type:'refcounts'`。`form(container, obj, fields, onChange, {refs})` の `refs` に `refsFrom({units, missions, items, research, nodes})` を渡します。データが無いときは文字入力になります。
  - リスト項目の `presets:[{label, make(obj, array)}]` で「テンプレートから追加」。
  - 目安: `starRating(unit)`（★と標準歩兵比）/ `powerRatio(unit)` / `describeSkill(skill)` / `describeWeapon(weapon, unit)` / `missionDifficulty(mission, defs, squad)`（推定勝率・おすすめRANK・報酬）。
  - 案内: `issues(container, list)` / `friendlyError(message)` / `guide(container, key, title, steps)` / `afterExport(container, kind)` / `templatePicker(container, options)` / `fixIds(pack)`（IDの付け直しと参照の書き換え）。

---

# Toolkit 1.9.0 データ仕様（追加分）

1.9.0 では戦闘・育成・基地運営の要素を追加しました。追加項目はすべて**省略可能**です。
メーカーは追加項目を1つも使っていないパックを従来のSchema番号で書き出すため、旧バージョンのゲームでもそのまま読めます。
追加項目を使ったパックは新しいSchema番号になり、旧バージョンのゲームは「未対応」として読み込みを拒否します（誤った効果で動くことはありません）。

| 種類 | 1.9で読めるSchema | 追加項目を使った時の出力 |
|---|---|---|
| ユニット | 1 / 2 / 3 | 3 |
| 作戦 | 1 / 2 | 2 |
| アイテム | 1 / 2 / 3 | 3 |
| 統合パック | 1 / 2 | 2 |

## 共有モジュール

- `shared/pro_core.js`（`window.PROCore` 2.0.0）: データ検証。`skill` / `weapon` / `item` / `itemPack` / `bundlePack` に加え、`unitExt` / `skillExt` / `weaponExt` / `missionExt` / `pilot` / `research` / `rule`、ラベル（`triggers` / `skillEffects` / `conditions` / `skillTargets` / `objectives` / `ruleTypes` / `starTypes` / `TERRAINS`）。
- `shared/pro_battle.js`（`window.PROBattle` 1.0.0）: 戦闘エンジン。ゲームとメーカーのシミュレーターが同じ計算を使います。DOMに触れず、演出は `ctx.hooks`、乱数は `ctx.rng` 経由。`runBattle(ctx)` / `simulate({...})` / `damagePreview(...)`。
- `shared/pro_editor.js`（`window.PROEditor` 1.0.0）: メーカー用の項目定義つきフォーム、勝率シミュレーター、ダメージ計算機。

## ユニットの追加項目（Unit Schema 3）

```json
{
  "id": "rei", "name": "レイ", "tags": ["歩兵","生身"], "hp": 3600, "atk": 560, "def": 40, "mob": 560, "acc": 580,
  "image": "data:image/webp;base64,...",
  "row": "back",
  "ai": {"target": "tag", "tag": "生身"},
  "growth": {"hp": 140, "atk": 18, "mob": 10, "acc": 12},
  "exp": 80,
  "recruit": {"locked": true, "missionId": "mission_2", "note": "作戦2クリアで加入"},
  "skillTree": [
    {"id": "n1", "cost": 1, "minLevel": 1, "requires": [], "skill": {"id":"aim","name":"精密射撃","trigger":"before_attack","effect":"hit_up_pt","value":10,"chance":100,"maxUses":0}},
    {"id": "n2", "cost": 2, "minLevel": 3, "requires": ["n1"], "skill": {"id":"pierce","name":"装甲貫通弾","trigger":"before_attack","effect":"def_pierce_pct","value":30,"chance":100,"maxUses":0}}
  ],
  "skills": [], "weapons": []
}
```

- `image`: PNG/JPEG/WebP/GIF の data URL（約300KBまで）。Unit Makerは128px程度に縮小して埋め込みます。
- `row`: `front`（既定）/ `back`。前衛は後衛の3倍狙われやすく、前衛が1体でも残っている間、後衛は近接武装の対象になりません。
- `ai.target`: `random`（既定）/ `lowest_hp` / `highest_atk` / `tag`（`ai.tag` を持つ相手を10倍狙う）。
- `growth`: レベルが1上がるごとの能力上昇。省略時は HP 4% / ATK・DEF 3% / MOB・ACC 2%（基礎値に対して）。
- `exp`: 敵として撃破された時に撃破者が得る経験値。省略時は `HP÷150 + ATK÷40`。
- `recruit.locked`: 最初は部隊にいないユニット。`missionId` の作戦クリア、`recruit_unit` 効果のアイテム、研究の `unlock.units` で加入します。
- `skillTree`: 最大32ノード。レベルアップごとに1スキルポイント（SP）。必要レベル・前提ノード・SPを満たすと「育成」で解放。リセットでSP全額返却。

ユニットパックには `pilots` 配列も入れられます。

```json
"pilots": [{"id":"kai","name":"カイ","tags":["パイロット"],"stats":{"acc":40},"aptitude":{"tags":["機械"],"pct":15},"skills":[...],"image":"data:image/png;base64,..."}]
```

搭乗中は `stats` を加算し、ユニットが `aptitude.tags` のどれかを持つと ATK・MOB・ACC が `pct`% 上がります。パイロットのスキルも使えます。1人のパイロットは1体にだけ搭乗します。

## 武装の追加項目

- `usesPerBattle`: 1戦闘の使用回数（0・省略で無制限）。
- `cooldown`: 使用後に待つTURN数（1なら次のTURNは使えない）。
- `defPiercePct`: 相手DEFを割合で無視（0～100）。
- `fxColor`: 弾道とダメージ表示の色（`#RRGGBB`）。

使える武装がない時は「通常攻撃」（威力60%・1HIT）で攻撃します。

## スキルの追加（発動タイミング・効果・条件・対象・持続）

追加の発動タイミング: `battle_start`（戦闘開始時）/ `on_evade`（全弾回避した時）/ `on_crit`（クリティカルを出した時）/ `ally_down`（味方が撃破された時）/ `on_death`（撃破される時）。

| 発動タイミング | 使える効果 |
|---|---|
| before_attack | damage_up_pct / hit_up_pt / crit_up_pt / **def_pierce_pct** / **tag_damage_up_pct** |
| when_targeted | enemy_hit_down_pt / damage_reduce_pct / weapon_resist_pct |
| after_damaged・on_evade | **counter** ＋ イベント効果 |
| on_death | **guts** ＋ イベント効果 |
| turn_start / turn_end / after_attack / on_kill / battle_start / on_crit / ally_down | イベント効果 |

イベント効果: `heal_maxhp_pct` / `heal_flat` / `shield`（バリア：値ぶん吸収） / `extra_action`（再行動・1TURN1回） / `taunt`（狙われ率+値%） / `atk_up_pct` `def_up_pct` `mob_up_pct` `acc_up_pct` / `atk_down_pct` `def_down_pct` `mob_down_pct` `acc_down_pct` / `stun`（行動不能） / `burn`（毎TURN開始時に値の固定ダメージ）。

- `tag_damage_up_pct`: `tag` が必須。そのタグを持つ相手へのダメージ+値%。
- `guts`: HPが0になる攻撃を受けた時、HPを値（最低1）で残す。`maxUses: 1` 推奨。
- `counter`: 攻撃してきた相手へ、最初の武装で威力値%の反撃（反撃への反撃は起きません）。
- `target`: `self` / `allies` / `weakest_ally` / `enemies` / `opponent` / `random_enemy`。省略時は回復・強化・バリア・挑発が自分、弱体・スタン・炎上が相手（相手がいなければランダムな敵）。
- `duration`: バフ・デバフ・挑発・炎上の持続TURN（既定2）。スタンは行動不能になる回数（既定1）。
- `cond`: 追加の発動条件。`{"type":"hp_below","value":50}` / `hp_above` / `turn_ge` / `turn_le` / `allies_le` / `enemies_le` / `{"type":"target_tag","tag":"装甲車"}`。

```json
{"id":"rage","name":"激昂","trigger":"turn_start","effect":"atk_up_pct","value":30,"chance":100,"maxUses":1,"duration":99,"cond":{"type":"hp_below","value":50}}
```

## 作戦の追加項目（Mission Schema 2）

```json
{
  "id": "boss_1", "name": "指揮官機撃破", "enemies": ["boss","guard","guard"], "enemyRows": ["back","front","front"],
  "objective": {"type": "boss", "bossIndex": 0},
  "waves": [["guard","guard"]],
  "rules": [{"type":"turn_limit","value":20},{"type":"reinforce","turn":3,"enemies":["guard"]},{"type":"deploy_tags","allTags":["機械"]},"表示用の文字列ルール"],
  "terrain": "夜間", "terrainMods": {"rangedHitPt": -20},
  "requires": {"missions": ["mission_2"], "items": ["keycard"], "minLevel": 3},
  "story": {"before": [{"speaker":"隊長","text":"作戦開始だ。"}], "after": [{"speaker":"隊長","text":"よくやった。"}]},
  "stars": [{"type":"clear"},{"type":"hp_ge","value":60},{"type":"turns_le","value":8}], "starReward": 800,
  "days": [0, 6], "exp": 120
}
```

- `objective.type`: `annihilate`（既定）/ `boss`（`bossIndex` の敵を倒せば勝利）/ `defense`（`turns` TURN耐えれば勝利）/ `escort`（`escortUnitId` のユニットが自動で同行し、倒されると敗北）/ `chain`（`waves` を全部倒すと勝利）。
- `waves`: 現在の敵が全滅したTURNの終わりに次のウェーブが出現。HPは持ち越し。
- `rules`: `turn_limit`（そのTURNまでに勝てなければ敗北）/ `reinforce`（`turn` の開始時に援軍）/ `deploy_tags`（出撃ユニット全員が条件を満たす必要）。文字列と未知のオブジェクトは表示用として保持されます。
- 地形の標準効果: 市街地=近接命中+10 / 森林=射撃命中-5・MOB+5% / 砂漠=MOB-10% / 夜間=射撃命中-10 / 雪原=MOB-5%・射撃命中-5 / 島嶼=MOB-5% / 月面=MOB-10% / 宇宙=「生身」出撃不可 / 水中=射撃命中-15。`terrainMods`（`meleeHitPt` / `rangedHitPt` / `mobPct` / `banTags`）で上書きできます。
- `requires`: 前提作戦のクリア、キーアイテムの所持（消費しない）、出撃ユニットの必要レベル。
- `stars`: 最大3つ。`clear` / `no_loss` / `turns_le` / `hp_ge`。省略時は「勝利・被撃破なし・10TURN以内」。初めて取った星1つにつき `starReward`（省略時は報酬の20%）。
- `days`: 出撃できる曜日（0=日～6=土）。端末の日付で判定します。
- `exp`: 出撃した味方が得る経験値（勝利時。引き分け・敗北は半分、撃破された味方はさらに半分）。省略時はRANKから自動（E=15 … S=90）。

## アイテムの追加項目（Item Schema 3）

```json
{"id":"scope","name":"高精度スコープ","equip":{"slot":"accessory","stats":{"acc":40},"skills":[],"weapons":[]},"price":1500,"shop":{"requiresResearch":"optics"}}
{"id":"ration","name":"特製レーション","effect":{"type":"sortie_buff","stat":"atk","value":15},"scope":"party","price":600}
{"id":"manual","name":"戦術教本","effect":{"type":"skill_point","value":1},"limitPerUnit":3}
{"id":"keycard","name":"カードキー","key":true}
```

- `price`: ショップの価格（売値は半額）。`shop.requiresResearch` / `shop.requiresMission` で販売条件。研究の `unlock.items` に入っているアイテムは、その研究の完了まで並びません。
- `equip`: 装備品（1体2枠）。装備中だけ能力補正・スキル・武装が付きます。効果（`effect`）なしでも作れます。
- `key`: キーアイテム。使用できず、作戦の `requires.items` に使います。
- `scope: "party"`: 部隊の使用できるユニット全員に効果（1個消費）。
- `limitPerUnit`: 1体あたりの使用回数上限。

追加の効果: `add_tag` / `remove_tag`（`tag`）・`sortie_buff`（`stat`: atk/def/mob/acc、`value`%・次の出撃だけ）・`loot_box`（`table`: `[{itemId, weight, min, max}]` から1つ）・`remove_skill`（`skillId` 省略で全部）・`remove_weapon`（`name` 省略で全部）・`recruit_unit`（`unitId`）・`exp_gain`（`value`）・`skill_point`（`value`）。

アイテムパックには `research` 配列も入れられます。

```json
"research": [{"id":"optics","name":"照準技術","cost":{"credits":1500,"items":{"manual":1}},"requires":[],"unlock":{"units":["ace"],"items":["scope"],"grantItems":{"armor":1}}}]
```

## 統合パック（Bundle Schema 2）

Schema 1 の `units` / `missions` / `items` に加えて `pilots` / `research` を持てます。作戦が参照する敵（`enemies`・`waves`・援軍）と護衛対象、ドロップは同じ統合パック内に必要です。

## セーブデータ（ゲーム）

保存キーは従来通り `vais_outer_ops_save_v1`。1.9で `levels` / `equip` / `pilots` / `tree` / `tagMods` / `sortieBuffs` / `itemUses` / `fatigue` / `injury` / `rows` / `recruited` / `research` / `facilities` / `missions` / `records` / `achievements` / `presets` / `settings` / `day` を追加しました。旧セーブは自動で補完されます。
「データ管理 → セーブを書き出す」で、セーブと追加パックを1つのJSON（`format: "PRO_SAVE"`）にまとめて保存・復元できます。

---

# Toolkit 1.8.1 同梱データ

同梱サンプルはテスト統合パック（味方4体・敵歩兵1種・作戦1件・医療キット1種）に更新。基準HP3000・ATK500・DEF0・MOB/ACC500。個別JSは同じ統合データから生成しています。以下は共通基盤の仕様です。

# PRO メーカー共通基盤 1.0.0

Toolkit 1.8.0 は統合メーカーを追加しました。個別メーカーも独立して使用できます。

## ファイル構成

- `maker_hub.html`: 全メーカーの入口。
- `combined_maker.html`: 3種類を同じ画面で編集し、統合パックを出力。
- `pro_sample_bundle.js`: 同梱3種類をまとめた読込サンプル。
- `shared/pro_core.js`: `window.PROCore`。アイテム・効果・内包スキル/武装の検証、ラベル、JSON互換JSの読み取り、JS出力。
- `shared/maker_core.js`: `window.PROMaker`。リンク、ダウンロード、下書き補助、メーカー登録。
- `shared/maker.css`: 各メーカーの共通ナビゲーションとレスポンシブ表示。

ビルド・Node・サーバーは実行に不要です。従来と同じscriptタグを使用し、fetch/ES Modulesは使用しません。`shared`フォルダはHTMLと一緒に配布してください。

## 登録済みアダプター

各HTMLを開くと `PROMaker.getAdapter('unit' | 'mission' | 'item' | 'bundle')` から、そのHTMLのアダプターを取得できます。

- `exportPack()`: 現在の編集モデルをパックオブジェクトとして返す。Item Makerは検証失敗時に例外。他の2メーカーは従来の正規化済み出力を返すため、公開時には既存のvalidateも必要。
- `readPack(text)`: JS/JSON文字列を読み取り、正規化したオブジェクトを返す。現在の編集内容は変更しない。
- `draftKey`: 下書き保存先。3メーカーで異なるキー。

統合メーカーのbundleアダプターは3種類をまとめて検証し、`importPack(text)` で統合JS・個別JSを現在の編集データへ取り込めます。

## Bundle Schema 1

```js
window.VAIS_BUNDLE_PACK = {
  "format": "VAIS_OUTER_OPS_BUNDLE_PACK",
  "schemaVersion": 1,
  "packId": "chapter1",
  "packName": "第一章",
  "units": [{"id":"soldier","name":"兵士", "tags":["歩兵"], "deploy":{"player":true,"enemy":true},"hp":3000,"atk":500,"def":0,"mob":500,"acc":500,"weapons":[{"name":"銃"}]}],
  "missions": [{"id":"first","name":"第一作戦","enemies":["soldier"],"maxDeploy":1,"reward":500,"drops":[{"itemId":"aid","chance":50,"min":1,"max":1}]}],
  "items": [{"id":"aid","name":"修理キット","effect":{"type":"heal_hp_flat","value":1000}}]
};
```

`units` はUnit Schema 2、`missions` はMission Schema 1、`items` はItem Schema 2相当のデータです。内部のIDは種類ごとに一意。作戦の敵IDは同じ統合パック内の敵として出撃可能なユニットを参照し、ドロップIDは同じパック内のアイテムを参照します。統合メーカーは、外部のユニットやアイテムだけを参照した状態での書き出しを禁止します。

ゲームの「データ管理 → 統合パック」から読み込むと、全種類を検証し、成功時だけ保存と画面更新を行います。複数ファイル選択時、1ファイルでも無効なら何も変更しません。同じpackIdは統合パック単位で更新します。統合パックは基本データと個別の追加パックより後に重ねるため、同じユニット/作戦/アイテムIDの定義は統合パックが優先されます。統合パック間では後に読み込んだものが優先です。解除すると元の定義が再び使われます。所持アイテム数、ユニットID別のHP・恒久強化・追加武装とスキルは従来通り保存されます。

統合メーカーの「データを読み込む」は統合JS・個別のUnit/Mission/Item JSに対応します。複数の個別ファイルをまとめて選ぶと、3種類のデータを1つに取り込めます。元の個別メーカーに統合JSを渡す場合は、該当種類だけを編集し、個別JSとして書き出します。

## Item Schema 2

```js
window.VAIS_ITEM_PACK = {
  "format": "VAIS_OUTER_OPS_ITEM_PACK",
  "schemaVersion": 2,
  "packId": "training_items",
  "packName": "訓練アイテム",
  "items": [{
    "id": "training_set", "name": "訓練セット", "desc": "攻撃強化とスキル習得",
    "effects": [
      {"type": "stat_up_flat", "stat": "atk", "value": 10},
      {"type": "add_skill", "skill": {
        "id": "trained_firepower", "name": "火力訓練",
        "trigger": "before_attack", "effect": "damage_up_pct",
        "value": 10, "chance": 100, "maxUses": 0
      }}
    ]
  }]
};
```

単一効果は旧形式同様 `effect: {...}`。複数は `effects: [...]`（最大8件）。両方の同時指定は拒否。正規化時に効果が1個ならeffectへまとめます。旧Schema 1の回復・固定強化は読込可能。新規出力はSchema 2です。

| type | パラメーター | 動作 |
| --- | --- | --- |
| heal_hp_flat | value | 固定HP回復。HP 0でも使用可 |
| heal_hp_pct | value 1〜100 | 使用時の最大HP×割合を切り上げて回復 |
| heal_hp_full | なし | HP全回復 |
| revive_hp_pct | value 1〜100 | HP 0のみ、最大HP×割合で復帰 |
| stat_up_flat | stat, value | 指定能力に固定値を恒久加算 |
| stat_up_pct | stat, value 1〜100 | 使用時能力×割合を切り上げ、最低1を恒久加算 |
| all_stats_up_flat | value | 5能力すべてに同じ固定値を恒久加算 |
| add_skill | skill | スキル定義を内包して恒久習得 |
| add_weapon | weapon | 武装定義を内包して恒久追加 |
| credits_gain | value | 資金を加算。UI上は対象ユニットの選択が必要 |

statはhp/atk/def/mob/acc。アイテムのvalueは正の安全な整数。最大HP強化では現在HPにも同じ増分を加算。割合強化は使用するたび、その時点の能力から再計算するため繰り返すと増分も増加します。

内包スキルはUnit Schema 2と同じ発動条件・効果です。条件と効果の組み合わせを検証します。耐性にはresistTypeが必要。maxUsesは0〜999（0は無制限）。

武装はUnit Schema 2の二軸分類。targetCountは1〜8、hitsMin/Maxは1〜100、命中/CRIT補正は-100〜100、AIウェイトは0.01〜100000。アイテムにコピーする際、これらの範囲を超える元武装はエラー表示し、黙って変更しません。

## ユニット分類タグとアイテム使用条件（Toolkit 1.7.0）

Unit Pack Schema 2の各ユニットに任意の `tags: ["歩兵", "地上"]` を追加できます。Unit Makerの基本情報から編集できます。タグは16個以内、各1～32文字、重複不可。日本語も使用可能です。

Item Pack Schema 2の各アイテムに任意の条件を設定できます。`requires` がない旧パックは制限なしです。

```js
{
  "id": "infantry_rifle",
  "name": "歩兵用ライフル",
  "requires": {
    "allTags": ["歩兵"],
    "anyTags": ["地上", "基地警備"],
    "noneTags": ["重装備"]
  },
  "effect": {"type": "add_weapon", "weapon": {"name": "増設ライフル", "attackType": "ranged", "damageType": "physical"}}
}
```

`allTags` はすべて持つ必要、`anyTags` は1つ以上必要、`noneTags` は1つも持ってはいけません。各配列は省略できます。空条件は制限なし。比較はトリム後の完全一致で、大文字小文字は区別します。条件はすべての効果より前に評価し、不一致ならアイテムを消費せず、能力・資金も変更しません。

`tags` がない旧ユニットパックは `role` を `/` `／` `・` `|` で分割してタグとして補完します。例えば役割「歩兵」は「歩兵」タグに一致します。明示的な `tags: []` はタグなしとして扱います。Unit Makerで読み込んで保存すると補完結果をtagsへ記録します。戦闘中の敵・ミッションのtagsはこの使用条件に関係しません。

同梱 `weapon_module` は `allTags:["歩兵"]`。Item Makerでは読込済みUnit Packのタグを候補ボタンから選べます。Mission Makerは条件をドロップ候補に表示しますが、ドロップ自体は勝利時に抽選され、使用条件は基地で対象を選ぶ時に判定します。

## 使用と保存

- 全効果をコピー上で順に計算し、成功時のみ状態と所持数を反映。効果のどれかが使用不可なら全体を取り消す。
- 満タンへの回復、HPが残っている対象への復帰、同IDスキルの再習得、同名武装の再追加は不可。
- `state.upgrades[unitId]` に能力加算、`state.grants[unitId]` に追加skills/weaponsを保存。既存セーブはgrantsなしでも使用可能。
- ユニットの元定義を変更せず、味方用マスターを再構築するときに合成。敵は強化されない。
- 同IDスキル/同名武装が元パックへ追加された場合、元パックの定義を優先して1件だけ表示。追加記録は保持する。
- パックを一時解除しても保存記録を維持。同じユニットIDで再読込すると復元。別IDは別個体。
- アイテムパックの解除・更新後も、習得済みスキル/武装は使用時に保存した定義で残る。
- セーブ初期化はこれらの記録も削除。

## 回帰テスト

PCのNode.jsとPython 3で、ZIPを展開したフォルダから実行できます。

```sh
node tests/test_bundle_game.cjs
node tests/test_bundle_makers.cjs
node tests/test_tag_conditions.cjs
node tests/test_tag_makers.cjs
node tests/test_upgrades.cjs
node tests/test_extended_items.cjs
node tests/test_mission_items.cjs
node tests/test_maker_contracts.cjs
node tests/test_ui.cjs
```

UIテストは軽量DOM模擬環境です。ブラウザ描画・Androidタッチ・ファイルダウンロード自体の実機テストではありません。


