/* Standard Tactical square types (part of the system, not sample data). One-letter keys are used in map grids;
   packs may add their own terrains. Squares with no movement costs are impassable; facility = functions + durability. */
window.PROTacticalTerrains=Object.freeze({
 "p": {
  "name": "平原",
  "kind": "ground",
  "costs": {
   "ground": 1,
   "air": 1
  }
 },
 "b": {
  "name": "橋",
  "kind": "ground",
  "costs": {
   "ground": 1,
   "air": 1
  }
 },
 "f": {
  "name": "森林",
  "kind": "forest",
  "costs": {
   "ground": 2,
   "air": 1
  }
 },
 "m": {
  "name": "山岳",
  "kind": "mountain",
  "costs": {
   "ground": 3,
   "air": 1
  },
  "blockTags": [
   "車両"
  ]
 },
 "r": {
  "name": "河川",
  "kind": "water",
  "costs": {
   "water": 1,
   "underwater": 1,
   "air": 1
  }
 },
 "w": {
  "name": "浅瀬",
  "kind": "water",
  "costs": {
   "water": 1,
   "underwater": 1,
   "air": 1
  }
 },
 "d": {
  "name": "深水",
  "kind": "deep",
  "costs": {
   "water": 2,
   "underwater": 2,
   "air": 1
  }
 },
 "s": {
  "name": "宇宙",
  "kind": "space",
  "costs": {
   "space": 1
  }
 },
 "x": {
  "name": "デブリ",
  "kind": "debris",
  "costs": {
   "space": 2
  }
 },
 "k": {
  "name": "障害物",
  "kind": "impass",
  "costs": {}
 },
 "g": {
  "name": "閉じた門",
  "kind": "door",
  "costs": {}
 },
 "o": {
  "name": "開いた門",
  "kind": "ground",
  "costs": {
   "ground": 1,
   "air": 1
  }
 },
 "y": {
  "name": "補給基地",
  "kind": "facility",
  "costs": {
   "ground": 1,
   "air": 1
  },
  "facility": {
   "durability": 20,
   "functions": {
    "supply": {},
    "repair": {
     "pct": 20
    },
    "resupply": {
     "range": 3,
     "linePct": 30
    }
   }
  }
 },
 "c": {
  "name": "都市",
  "kind": "facility",
  "costs": {
   "ground": 1,
   "air": 1
  },
  "facility": {
   "durability": 20,
   "functions": {
    "income": {
     "amount": 1000
    },
    "defense": {
     "hitPt": -10
    }
   }
  }
 },
 "q": {
  "name": "本拠地",
  "kind": "facility",
  "costs": {
   "ground": 1,
   "air": 1
  },
  "facility": {
   "durability": 30,
   "functions": {
    "hq": {},
    "income": {
     "amount": 2000
    },
    "supply": {},
    "repair": {
     "pct": 20
    },
    "defense": {
     "hitPt": -15
    },
    "resupply": {
     "range": 2,
     "linePct": 30
    }
   }
  }
 }
});
