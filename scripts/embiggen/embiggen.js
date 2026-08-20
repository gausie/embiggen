'use strict';

var kolmafia = require('kolmafia');

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: true
          } : {
            done: false,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = true,
    u = false;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = true, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: true,
      configurable: true
    }
  }), Object.defineProperty(t, "prototype", {
    writable: false
  }), e && _setPrototypeOf(t, e);
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function () {
    return !!t;
  })();
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = true,
      o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = true, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _taggedTemplateLiteral(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, {
    raw: {
      value: Object.freeze(t)
    }
  }));
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

/** THIS FILE IS AUTOMATICALLY GENERATED. See tools/parseDefaultProperties.ts for more information */
var booleanProperties = ["abortOnChoiceWhenNotInChoice", "addChatCommandLine", "addCreationQueue", "addStatusBarToFrames", "allowCloseableDesktopTabs", "allowNegativeTally", "allowNonMoodBurning", "allowSummonBurning", "autoHighlightOnFocus", "broadcastEvents", "cacheMallSearches", "chatBeep", "chatLinksUseRelay", "compactChessboard", "copyAsHTML", "customizedTabs", "debugBuy", "debugConsequences", "debugFoxtrotRemoval", "debugPathnames", "debugTopMenuStyle", "gapProtection", "gitInstallDependencies", "gitShowCommitMessages", "gitUpdateOnLogin", "greenScreenProtection", "guiUsesOneWindow", "hideServerDebugText", "logAcquiredItems", "logBattleAction", "logBrowserInteractions", "logChatMessages", "logChatRequests", "logCleanedHTML", "logDecoratedResponses", "logFamiliarActions", "logGainMessages", "logReadableHTML", "logPreferenceChange", "logMonsterHealth", "logReverseOrder", "logStatGains", "logStatusEffects", "logStatusOnLogin", "macroDebug", "macroLens", "mementoListActive", "mergeHobopolisChat", "pingLogin", "pingStealthyTimein", "printStackOnAbort", "proxySet", "relayAddSounds", "relayAddsCustomCombat", "relayAddsDiscoHelper", "relayAddsGraphicalCLI", "relayAddsQuickScripts", "relayAddsRestoreLinks", "relayAddsUpArrowLinks", "relayAddsUseLinks", "relayAddsWikiLinks", "relayAllowRemoteAccess", "relayBrowserOnly", "relayCacheUncacheable", "relayFormatsChatText", "relayHidesJunkMallItems", "relayMaintainsEffects", "relayMaintainsHealth", "relayMaintainsMana", "relayOverridesImages", "relayRunsAfterAdventureScript", "relayRunsBeforeBattleScript", "relayRunsBeforePVPScript", "relayScriptButtonFirst", "relayTextualizesEffects", "relayTrimsZapList", "relayUsesInlineLinks", "relayUsesIntegratedChat", "relayWarnOnRecoverFailure", "removeMalignantEffects", "retryFailedNetworkRequests", "saveSettingsOnSet", "sharePriceData", "showAllRequests", "showExceptionalRequests", "stealthLogin", "svnAlwaysAdd", "svnAlwaysOverwrite", "svnInstallDependencies", "svnShowCommitMessages", "svnUpdateOnLogin", "switchEquipmentForBuffs", "syncAfterSvnUpdate", "useChatToolbar", "useContactsFrame", "useDevServer", "useDockIconBadge", "useHugglerChannel", "useImageCache", "useLastUserAgent", "useSystemTrayIcon", "useTabbedChatFrame", "useToolbars", "useCachedVolcanoMaps", "useZoneComboBox", "verboseSpeakeasy", "verboseFloundry", "wrapLongLines", "_faxDataChanged", "_gitUpdated", "_svnRepoFileFetched", "_svnUpdated", "antagonisticSnowmanKitAvailable", "arcadeGameHints", "armoryUnlocked", "autoForbidIgnoringStores", "autoCraft", "autoQuest", "autoEntangle", "autoGarish", "autoManaRestore", "autoFillMayoMinder", "autoPinkyRing", "autoPlantHardcore", "autoPlantSoftcore", "autoPotionID", "autoRepairBoxServants", "autoSatisfyWithCloset", "autoSatisfyWithCoinmasters", "autoSatisfyWithMall", "autoSatisfyWithNPCs", "autoSatisfyWithStash", "autoSatisfyWithStorage", "autoSatisfyWithShop", "autoSetConditions", "autoSteal", "autoTuxedo", "backupCameraReverserEnabled", "badMoonEncounter01", "badMoonEncounter02", "badMoonEncounter03", "badMoonEncounter04", "badMoonEncounter05", "badMoonEncounter06", "badMoonEncounter07", "badMoonEncounter08", "badMoonEncounter09", "badMoonEncounter10", "badMoonEncounter11", "badMoonEncounter12", "badMoonEncounter13", "badMoonEncounter14", "badMoonEncounter15", "badMoonEncounter16", "badMoonEncounter17", "badMoonEncounter18", "badMoonEncounter19", "badMoonEncounter20", "badMoonEncounter21", "badMoonEncounter22", "badMoonEncounter23", "badMoonEncounter24", "badMoonEncounter25", "badMoonEncounter26", "badMoonEncounter27", "badMoonEncounter28", "badMoonEncounter29", "badMoonEncounter30", "badMoonEncounter31", "badMoonEncounter32", "badMoonEncounter33", "badMoonEncounter34", "badMoonEncounter35", "badMoonEncounter36", "badMoonEncounter37", "badMoonEncounter38", "badMoonEncounter39", "badMoonEncounter40", "badMoonEncounter41", "badMoonEncounter42", "badMoonEncounter43", "badMoonEncounter44", "badMoonEncounter45", "badMoonEncounter46", "badMoonEncounter47", "badMoonEncounter48", "barrelShrineUnlocked", "batWingsBatHoleEntrance", "batWingsBatratBurrow", "batWingsBeanbatChamber", "batWingsGuanoJunction", "bigBrotherRescued", "blackBartsBootyAvailable", "bondAdv", "bondBeach", "bondBeat", "bondBooze", "bondBridge", "bondDesert", "bondDR", "bondDrunk1", "bondDrunk2", "bondHoney", "bondHP", "bondInit", "bondItem1", "bondItem2", "bondItem3", "bondJetpack", "bondMartiniDelivery", "bondMartiniPlus", "bondMartiniTurn", "bondMeat", "bondMox1", "bondMox2", "bondMPregen", "bondMus1", "bondMus2", "bondMys1", "bondMys2", "bondSpleen", "bondStat", "bondStat2", "bondStealth", "bondStealth2", "bondSymbols", "bondWar", "bondWeapon2", "bondWpn", "bookOfIronyAvailable", "booPeakLit", "bootsCharged", "breakfastCompleted", "burlyBodyguardReceivedBonus", "burrowgrubHiveUsed", "calzoneOfLegendEaten", "candyCaneSwordApartmentBuilding", "candyCaneSwordBlackForest", "candyCaneSwordBowlingAlley", "candyCaneSwordCopperheadClub", "candyCaneSwordDailyDungeon", "candyCaneSwordDefiledCranny", "candyCaneSwordFunHouse", "candyCaneSwordShore", "candyCaneSwordWarFratRoom", "candyCaneSwordWarFratZetas", "candyCaneSwordWarHippyBait", "candyCaneSwordWarHippyLine", "canteenUnlocked", "chaosButterflyThrown", "chatbotScriptExecuted", "chateauAvailable", "chatLiterate", "chatServesUpdates", "checkJackassHardcore", "checkJackassSoftcore", "clanAttacksEnabled", "coldAirportAlways", "considerShadowNoodles", "controlRoomUnlock", "concertVisited", "controlPanel1", "controlPanel2", "controlPanel3", "controlPanel4", "controlPanel5", "controlPanel6", "controlPanel7", "controlPanel8", "controlPanel9", "corralUnlocked", "crAlways", "crimbo23ArmoryAtWar", "crimbo23BarAtWar", "crimbo23CafeAtWar", "crimbo23CottageAtWar", "crimbo23FoundryAtWar", "cyberDatastickCollected", "dailyDungeonDone", "dampOldBootPurchased", "daycareOpen", "deepDishOfLegendEaten", "demonSummoned", "dinseyAudienceEngagement", "dinseyGarbagePirate", "dinseyRapidPassEnabled", "dinseyRollercoasterNext", "dinseySafetyProtocolsLoose", "doghouseBoarded", "dontStopForCounters", "drippingHallUnlocked", "drippyShieldUnlocked", "edUsedLash", "eldritchFissureAvailable", "eldritchHorrorAvailable", "enqueueForConsumption", "errorOnAmbiguousFold", "essenceOfAnnoyanceAvailable", "essenceOfBearAvailable", "expressCardUsed", "falloutShelterChronoUsed", "falloutShelterCoolingTankUsed", "fireExtinguisherBatHoleUsed", "fireExtinguisherChasmUsed", "fireExtinguisherCyrptUsed", "fireExtinguisherDesertUsed", "fireExtinguisherHaremUsed", "fistTeachingsHaikuDungeon", "fistTeachingsPokerRoom", "fistTeachingsBarroomBrawl", "fistTeachingsConservatory", "fistTeachingsBatHole", "fistTeachingsFunHouse", "fistTeachingsMenagerie", "fistTeachingsSlums", "fistTeachingsFratHouse", "fistTeachingsRoad", "fistTeachingsNinjaSnowmen", "flickeringPixel1", "flickeringPixel2", "flickeringPixel3", "flickeringPixel4", "flickeringPixel5", "flickeringPixel6", "flickeringPixel7", "flickeringPixel8", "floristFriarAvailable", "floristFriarChecked", "frAlways", "frCemetaryUnlocked", "friarsBlessingReceived", "frMountainsUnlocked", "frSwampUnlocked", "frVillageUnlocked", "frWoodUnlocked", "getawayCampsiteUnlocked", "ghostPencil1", "ghostPencil2", "ghostPencil3", "ghostPencil4", "ghostPencil5", "ghostPencil6", "ghostPencil7", "ghostPencil8", "ghostPencil9", "gingerAdvanceClockUnlocked", "gingerBlackmailAccomplished", "gingerbreadCityAvailable", "gingerExtraAdventures", "gingerNegativesDropped", "gingerSewersUnlocked", "gingerSubwayLineUnlocked", "gingerRetailUnlocked", "glitchItemAvailable", "grabCloversHardcore", "grabCloversSoftcore", "grandpaUnlockedBlankPrescriptionSheet", "grandpaUnlockedEelSauce", "grandpaUnlockedFishyWand", "grandpaUnlockedGlowingSyringe", "grandpaUnlockedGroupieSpangles", "grandpaUnlockedHairOfTheFish", "grandpaUnlockedHalibut", "grandpaUnlockedHeavilyInvestedInPunFutures", "grandpaUnlockedJellyfishGel", "grandpaUnlockedMarineAquamarine", "grandpaUnlockedMidgetClownfish", "grandpaUnlockedSeaRadish", "grandpaUnlockedTrophyFish", "grandpaUnlockedWaterPoloCap", "grandpaUnlockedWaterPoloMitt", "guideToSafariAvailable", "guyMadeOfBeesDefeated", "hallowienerDefiledNook", "hallowienerGuanoJunction", "hallowienerKnollGym", "hallowienerMadnessBakery", "hallowienerMiddleChamber", "hallowienerOvergrownLot", "hallowienerSkeletonStore", "hallowienerSmutOrcs", "hallowienerSonofaBeach", "hallowienerVolcoino", "hardcorePVPWarning", "harvestBatteriesHardcore", "harvestBatteriesSoftcore", "hasAutumnaton", "hasBartender", "hasChef", "hasCocktailKit", "hasCosmicBowlingBall", "hasDetectiveSchool", "hasMaydayContract", "hasOven", "hasRange", "hasShaker", "hasShrunkenHead", "hasSushiMat", "hasTwinkleVision", "haveBoxingDaydreamHardcore", "haveBoxingDaydreamSoftcore", "heartstoneBanishUnlocked", "heartstoneBuffUnlocked", "heartstoneKillUnlocked", "heartstoneLuckUnlocked", "heartstonePalsUnlocked", "heartstoneStunUnlocked", "hermitHax0red", "holidayHalsBookAvailable", "horseryAvailable", "hotAirportAlways", "intenseCurrents", "isMerkinGladiatorChampion", "isMerkinHighPriest", "itemBoughtPerAscension637", "itemBoughtPerAscension8266", "itemBoughtPerAscension10790", "itemBoughtPerAscension10794", "itemBoughtPerAscension10795", "itemBoughtPerCharacter6423", "itemBoughtPerCharacter6428", "itemBoughtPerCharacter6429", "kingLiberated", "lastPirateInsult1", "lastPirateInsult2", "lastPirateInsult3", "lastPirateInsult4", "lastPirateInsult5", "lastPirateInsult6", "lastPirateInsult7", "lastPirateInsult8", "lawOfAveragesAvailable", "leafletCompleted", "ledCandleDropped", "libraryCardUsed", "lockPicked", "logBastilleBattalionBattles", "loginRecoveryHardcore", "loginRecoverySoftcore", "lovebugsUnlocked", "loveTunnelAvailable", "lowerChamberUnlock", "madnessBakeryAvailable", "makeHandheldRadiosHardcore", "makeHandheldRadiosSoftcore", "makePocketWishesHardcore", "makePocketWishesSoftcore", "manualOfNumberologyAvailable", "mappingMonsters", "mapToAnemoneMinePurchased", "mapToKokomoAvailable", "mapToMadnessReefPurchased", "mapToTheDiveBarPurchased", "mapToTheMarinaraTrenchPurchased", "mapToTheSkateParkPurchased", "maraisBeaverUnlock", "maraisCorpseUnlock", "maraisDarkUnlock", "maraisVillageUnlock", "maraisWildlifeUnlock", "maraisWizardUnlock", "maximizerAlwaysCurrent", "maximizerCreateOnHand", "maximizerCurrentMallPrices", "maximizerFoldables", "maximizerIncludeAll", "maximizerNoAdventures", "maximizerUseScope", "merkinElementaryBathroomUnlock", "merkinElementaryJanitorUnlock", "merkinElementaryTeacherUnlock", "middleChamberUnlock", "milkOfMagnesiumActive", "moonTuned", "neverendingPartyAlways", "noncombatForcerActive", "oasisAvailable", "odeBuffbotCheck", "oilPeakLit", "oscusSodaUsed", "outrageousSombreroUsed", "overgrownLotAvailable", "ownsFloristFriar", "ownsSpeakeasy", "pathedSummonsHardcore", "pathedSummonsSoftcore", "pirateRealmUnlockedAnemometer", "pirateRealmUnlockedBlunderbuss", "pirateRealmUnlockedBreastplate", "pirateRealmUnlockedClipper", "pirateRealmUnlockedCrabsicle", "pirateRealmUnlockedFlag", "pirateRealmUnlockedFork", "pirateRealmUnlockedGoldRing", "pirateRealmUnlockedManOWar", "pirateRealmUnlockedPlushie", "pirateRealmUnlockedRadioRing", "pirateRealmUnlockedRhum", "pirateRealmUnlockedScurvySkillbook", "pirateRealmUnlockedShavingCream", "pirateRealmUnlockedSpyglass", "pirateRealmUnlockedTattoo", "pirateRealmUnlockedThirdCrewmate", "pirateRealmUnlockedTikiSkillbook", "pizzaOfLegendEaten", "popularTartUnlocked", "potatoAlarmClockUsed", "prAlways", "prayedForGlamour", "prayedForProtection", "prayedForVigor", "primaryLabCheerCoreGrabbed", "pumpkinSpiceWhorlUsed", "pyramidBombUsed", "rageGlandVented", "readManualHardcore", "readManualSoftcore", "relayDecorateJsCommands", "relayShowSpoilers", "relayShowWarnings", "rememberDesktopSize", "replicaChateauAvailable", "replicaNeverendingPartyAlways", "replicaWitchessSetAvailable", "requireBoxServants", "requireSewerTestItems", "restUsingCampAwayTent", "restUsingChateau", "ROMOfOptimalityAvailable", "safePickpocket", "schoolOfHardKnocksDiplomaAvailable", "scriptCascadingMenus", "serverAddsCustomCombat", "serverAddsBothCombat", "SHAWARMAInitiativeUnlocked", "showForbiddenStores", "showGainsPerUnit", "showIgnoringStorePrices", "showNoSummonOnly", "showTurnFreeOnly", "shubJigguwattDefeated", "skeletonStoreAvailable", "sleazeAirportAlways", "snojoAvailable", "sortByEffect", "sortByRoom", "spacegateAlways", "spacegateVaccine1", "spacegateVaccine2", "spacegateVaccine3", "spaceInvaderDefeated", "spelunkyHints", "spiceMelangeUsed", "spookyAirportAlways", "stenchAirportAlways", "stopForFixedWanderer", "stopForUltraRare", "styxPixieVisited", "superconductorDefeated", "suppressCyberRealmDarkMode", "suppressCyberRealmGreenImages", "suppressInappropriateNags", "suppressPowerPixellation", "suppressMallPriceCacheMessages", "telegraphOfficeAvailable", "telescopeLookedHigh", "timeTowerAvailable", "trackLightsOut", "uneffectWithHotTub", "universalSeasoningActive", "universalSeasoningAvailable", "useBookOfEverySkillHardcore", "useBookOfEverySkillSoftcore", "useCrimboToysHardcore", "useCrimboToysSoftcore", "verboseMaximizer", "visitLoungeHardcore", "visitLoungeSoftcore", "visitRumpusHardcore", "visitRumpusSoftcore", "voteAlways", "wildfireBarrelCaulked", "wildfireDusted", "wildfireFracked", "wildfirePumpGreased", "wildfireSprinkled", "yearbookCameraPending", "yogUrtDefeated", "youRobotScavenged", "_2002MrStoreCreditsCollected", "_affirmationCookieEaten", "_affirmationHateUsed", "_airFryerUsed", "_akgyxothUsed", "_alienAnimalMilkUsed", "_alienPlantPodUsed", "_allYearSucker", "_alliedRadioMaterielIntel", "_alliedRadioWildsunBoon", "_aprilShower", "_aprilShowerGlobsCollected", "_aprilShowerLungingThrustSmack", "_aprilShowerNorthernExplosion", "_aprilShowerSimmer", "_armyToddlerCast", "_aug1Cast", "_aug2Cast", "_aug3Cast", "_aug4Cast", "_aug5Cast", "_aug6Cast", "_aug7Cast", "_aug8Cast", "_aug9Cast", "_aug10Cast", "_aug11Cast", "_aug12Cast", "_aug13Cast", "_aug14Cast", "_aug15Cast", "_aug16Cast", "_aug17Cast", "_aug18Cast", "_aug19Cast", "_aug20Cast", "_aug21Cast", "_aug22Cast", "_aug23Cast", "_aug24Cast", "_aug25Cast", "_aug26Cast", "_aug27Cast", "_aug28Cast", "_aug29Cast", "_aug30Cast", "_aug31Cast", "_augTodayCast", "_authorsInkUsed", "_baconMachineUsed", "_bagOfCandy", "_bagOfCandyUsed", "_bagOTricksUsed", "_ballastTurtleUsed", "_ballInACupUsed", "_ballpit", "_barrelPrayer", "_bastilleLastBattleWon", "_beachCombing", "_bendHellUsed", "_blackMonolithUsed", "_blankoutUsed", "_bloodBagDoctorBag", "_bloodBagCloake", "_bloodBankIntimidated", "_bloodBankVisited", "_bonersSummoned", "_bookOfEverySkillUsed", "_borrowedTimeUsed", "_bowleggedSwaggerUsed", "_bowlFullOfJellyUsed", "_boxOfHammersUsed", "_brainPreservationFluidUsed", "_brassDreadFlaskUsed", "_cameraUsed", "_canSeekBirds", "_candyCaneSwordBackAlley", "_candyCaneSwordHauntedBedroom", "_candyCaneSwordHauntedLibrary", "_candyCaneSwordLyle", "_candyCaneSwordMadnessBakery", "_candyCaneSwordOvergrownLot", "_candyCaneSwordOvergrownShrine", "_candyCaneSwordPalindome", "_candyCaneSwordSouthOfTheBorder", "_candyCaneSwordSpookyForest", "_carboLoaded", "_cargoPocketEmptied", "_ceciHatUsed", "_chateauDeskHarvested", "_chateauMonsterFought", "_chibiChanged", "_chronerCrossUsed", "_chronerTriggerUsed", "_chubbyAndPlumpUsed", "_circadianRhythmsRecalled", "_circleDrumUsed", "_clanFortuneBuffUsed", "_clanRumpusSpot1Visited", "_clanRumpusSpot2Visited", "_clanRumpusSpot3Visited", "_clanRumpusSpot4Visited", "_clanRumpusSpot5Visited", "_clanRumpusSpot7Visited", "_clanRumpusSpot9Visited", "_claraBellUsed", "_coalPaperweightUsed", "_cocoaDispenserUsed", "_cocktailShakerUsed", "_coldAirportToday", "_coldOne", "_communismUsed", "_confusingLEDClockUsed", "_controlPanelUsed", "_cookbookbatRecipeDrops", "_coolerYetiAdventures", "_corruptedStardustUsed", "_cosmicSixPackConjured", "_crappyCameraUsed", "_creepyVoodooDollUsed", "_crimboPastDailySpecial", "_crimboPastMedicalGruel", "_crimboPastPrizeTurkey", "_crimboPastSmokingPope", "_crimboTraining", "_crimboTree", "_crToday", "_cursedKegUsed", "_cursedMicrowaveUsed", "_cyberTrashCollected", "_dailyDungeonMalwareUsed", "_darkChocolateHeart", "_daycareFights", "_daycareNap", "_daycareSpa", "_daycareToday", "_defectiveTokenChecked", "_defectiveTokenUsed", "_dinseyGarbageDisposed", "_discoKnife", "_distentionPillUsed", "_dnaHybrid", "_docClocksThymeCocktailDrunk", "_douseFoeSuccess", "_drippingHallDoor1", "_drippingHallDoor2", "_drippingHallDoor3", "_drippingHallDoor4", "_drippyCaviarUsed", "_drippyNuggetUsed", "_drippyPilsnerUsed", "_drippyPlumUsed", "_drippyWineUsed", "_eldritchHorrorEvoked", "_eldritchTentacleFought", "_eleventRestEffectGained", "_elfGuardHangoverCureUsed", "_emberingHulkFought", "_entauntaunedToday", "_envyfishEggUsed", "_epicMcTwistUsed", "_essentialTofuUsed", "_etchedHourglassUsed", "_eternalCarBatteryUsed", "_everfullGlassUsed", "_extraGreasySliderEaten", "_eyeAndATwistUsed", "_fancyChessSetUsed", "_falloutShelterSpaUsed", "_fancyHotDogEaten", "_faradayCageRestEffectGained", "_farmerItemsCollected", "_favoriteBirdVisited", "_firedJokestersGun", "_fireExtinguisherRefilled", "_fireStartingKitUsed", "_fireworksShop", "_fireworksShopHatBought", "_fireworksShopEquipmentBought", "_fireworkUsed", "_fishyPipeUsed", "_flagellateFlagonUsed", "_fleekMascaraUsed", "_floundryItemCreated", "_floundryItemUsed", "_freePillKeeperUsed", "_frToday", "_frostyMugUsed", "_fudgeSporkUsed", "_garbageItemChanged", "_giantGnawingBoneUsed", "_gingerBiggerAlligators", "_gingerbreadCityToday", "_gingerbreadClockAdvanced", "_gingerbreadClockVisited", "_gingerbreadColumnDestroyed", "_gingerbreadHouseRestEffectGained", "_gingerbreadMobHitUsed", "_glennGoldenDiceUsed", "_glitchItemImplemented", "_gnollEyeUsed", "_gnomePart", "_governmentPerDiemUsed", "_grimBuff", "_guildManualUsed", "_guzzlrQuestAbandoned", "_hardKnocksDiplomaUsed", "_heartstoneLuckUsed", "_hippyMeatCollected", "_hobbyHorseUsed", "_hodgmansBlanketDrunk", "_holidayFunUsed", "_holoWristCrystal", "_hotAirportToday", "_hungerSauceUsed", "_hyperinflatedSealLungUsed", "_iceHotelRoomsRaided", "_iceSculptureUsed", "_incredibleSelfEsteemCast", "_infernoDiscoVisited", "_infiniteJellyUsed", "_internetDailyDungeonMalwareBought", "_internetGallonOfMilkBought", "_internetPlusOneBought", "_internetPrintScreenButtonBought", "_internetViralVideoBought", "_interviewIsabella", "_interviewMasquerade", "_interviewVlad", "_inquisitorsUnidentifiableObjectUsed", "_ironicMoustache", "_jackassPlumberGame", "_jarlsCheeseSummoned", "_jarlsCreamSummoned", "_jarlsDoughSummoned", "_jarlsEggsSummoned", "_jarlsFruitSummoned", "_jarlsMeatSummoned", "_jarlsPotatoSummoned", "_jarlsVeggiesSummoned", "_jingleBellUsed", "_jukebox", "_kgbFlywheelCharged", "_kgbLeftDrawerUsed", "_kgbOpened", "_kgbRightDrawerUsed", "_kolConSixPackUsed", "_kolhsCutButNotDried", "_kolhsIsskayLikeAnAshtray", "_kolhsPoeticallyLicenced", "_kolhsSchoolSpirited", "_kudzuSaladEaten", "_lastCombatLost", "_lastCombatWon", "_latteBanishUsed", "_latteCopyUsed", "_latteDrinkUsed", "_leafAntEggCrafted", "_leafDayShortenerCrafted", "_leafTattooCrafted", "_leavesJumped", "_legendaryBeat", "_legendaryNoodlesSpleen", "_legendaryPastaWaveCast", "_legendarySpiceGhostFood", "_licenseToChillUsed", "_lodestoneUsed", "_lookingGlass", "_loveTunnelToday", "_loveTunnelUsed", "_luckyGoldRingVolcoino", "_lunchBreak", "_lupineHormonesUsed", "_lyleFavored", "_madLiquorDrunk", "_madTeaParty", "_mafiaMiddleFingerRingUsed", "_managerialManipulationUsed", "_mansquitoSerumUsed", "_mapToACandyRichBlockUsed", "_maydayDropped", "_mayoDeviceRented", "_mayoTankSoaked", "_meatballMachineUsed", "_meatifyMatterUsed", "_milkOfMagnesiumUsed", "_mimeArmyShotglassUsed", "_miniKiwiIntoxicatingSpiritsBought", "_miniKiwiTipiDrop", "_missGravesVermouthDrunk", "_missileLauncherUsed", "_mobiusRingPrimed", "_molehillMountainUsed", "_momFoodReceived", "_mrBurnsgerEaten", "_muffinOrderedToday", "_mulliganStewEaten", "_mushroomGardenVisited", "_mushroomHouseRestEffectGained", "_neverendingPartyToday", "_newYouQuestCompleted", "_olympicSwimmingPool", "_olympicSwimmingPoolItemFound", "_overflowingGiftBasketUsed", "_partyHard", "_pastaAdditive", "_perfectFreezeUsed", "_perfectlyFairCoinUsed", "_petePartyThrown", "_peteRiotIncited", "_photocopyUsed", "_pickyTweezersUsed", "_pickleJuiceDrunk", "_pingPongGame", "_pirateBellowUsed", "_pirateDinghyUsed", "_pirateForkUsed", "_pirateRealmSoldCompass", "_pirateRealmWindicleUsed", "_pixelOrbUsed", "_plumbersMushroomStewEaten", "_pneumaticityPotionUsed", "_porkElfMedicineCabinetUsed", "_porkElfNetiPotUsed", "_porkElfSinkUsed", "_porkElfToiletriesKitUsed", "_porkElfToiletUsed", "_portableSteamUnitUsed", "_pottedTeaTreeUsed", "_prToday", "_psychoJarFilled", "_psychoJarUsed", "_psychokineticHugUsed", "_pumpkinRestEffectGained", "_punchingMirrorUsed", "_rainStickUsed", "_redwoodRainStickUsed", "_replicaSnowconeTomeUsed", "_replicaResolutionLibramUsed", "_replicaSmithsTomeUsed", "_requestSandwichSucceeded", "_residenceCubeRestEffectGained", "_rhinestonesAcquired", "_saladForkUsed", "_seadentWaveUsed", "_seaJellyHarvested", "_septEmberBalanceChecked", "_setOfJacksUsed", "_sewingKitUsed", "_sexChanged", "_shadowAffinityToday", "_shadowForestLooted", "_shrubDecorated", "_silverDreadFlaskUsed", "_sitCourseCompleted", "_skateBuff1", "_skateBuff2", "_skateBuff3", "_skateBuff4", "_skateBuff5", "_sleazeAirportToday", "_snowballFactoryUsed", "_snowFortRestEffectGained", "_sobrieTeaUsed", "_softwareGlitchTurnReceived", "_sotParcelReturned", "_spacegateMurderbot", "_spacegateRuins", "_spacegateSpant", "_spacegateToday", "_spacegateVaccine", "_spaghettiBreakfast", "_spaghettiBreakfastEaten", "_spinmasterLatheVisited", "_spinningWheel", "_spookyAirportToday", "_stabonicScrollUsed", "_steelyEyedSquintUsed", "_stenchAirportToday", "_stinkyCheeseBanisherUsed", "_strangeStalagmiteUsed", "_streamsCrossed", "_structuralEmberUsed", "_stuffedPocketwatchUsed", "_styxSprayUsed", "_summonAnnoyanceUsed", "_summonCarrotUsed", "_summonResortPassUsed", "_sweetToothUsed", "_syntheticDogHairPillUsed", "_tacoFlierUsed", "_takerSpaceSuppliesDelivered", "_telegraphOfficeToday", "_templeHiddenPower", "_tempuraAirUsed", "_thesisDelivered", "_tiedUpFlamingLeafletFought", "_tiedUpFlamingMonsteraFought", "_tiedUpLeaviathanFought", "_timeSpinnerReplicatorUsed", "_toastSummoned", "_tonicDjinn", "_treasuryEliteMeatCollected", "_treasuryHaremMeatCollected", "_trivialAvocationsGame", "_tryptophanDartUsed", "_turtlePowerCast", "_twelveNightEnergyUsed", "_ultraMegaSourBallUsed", "_unblemishedPearlAnemoneMine", "_unblemishedPearlDiveBar", "_unblemishedPearlMadnessReef", "_unblemishedPearlMarinaraTrench", "_unblemishedPearlTheBriniestDeepests", "_victorSpoilsUsed", "_villainLairCanLidUsed", "_villainLairColorChoiceUsed", "_villainLairDoorChoiceUsed", "_villainLairFirecrackerUsed", "_villainLairSymbologyChoiceUsed", "_villainLairWebUsed", "_vmaskBanisherUsed", "_voraciTeaUsed", "_volcanoItemRedeemed", "_volcanoSuperduperheatedMetal", "_voodooSnuffUsed", "_voteToday", "_VYKEACafeteriaRaided", "_VYKEALoungeRaided", "_walfordQuestStartedToday", "_warbearBankUsed", "_warbearBreakfastMachineUsed", "_warbearGyrocopterUsed", "_warbearSodaMachineUsed", "_wildfireBarrelHarvested", "_witchessBuff", "_workshedItemUsed", "_yamBatteryUsed", "_zombieClover", "_preventScurvy", "lockedItem4637", "lockedItem4638", "lockedItem4639", "lockedItem4646", "lockedItem4647", "unknownRecipe3542", "unknownRecipe3543", "unknownRecipe3544", "unknownRecipe3545", "unknownRecipe3546", "unknownRecipe3547", "unknownRecipe3548", "unknownRecipe3749", "unknownRecipe3751", "unknownRecipe4172", "unknownRecipe4173", "unknownRecipe4174", "unknownRecipe5060", "unknownRecipe5061", "unknownRecipe5062", "unknownRecipe5063", "unknownRecipe5064", "unknownRecipe5066", "unknownRecipe5067", "unknownRecipe5069", "unknownRecipe5070", "unknownRecipe5072", "unknownRecipe5073", "unknownRecipe5670", "unknownRecipe5671", "unknownRecipe6501", "unknownRecipe6564", "unknownRecipe6565", "unknownRecipe6566", "unknownRecipe6567", "unknownRecipe6568", "unknownRecipe6569", "unknownRecipe6570", "unknownRecipe6571", "unknownRecipe6572", "unknownRecipe6573", "unknownRecipe6574", "unknownRecipe6575", "unknownRecipe6576", "unknownRecipe6577", "unknownRecipe6578", "unknownRecipe7752", "unknownRecipe7753", "unknownRecipe7754", "unknownRecipe7755", "unknownRecipe7756", "unknownRecipe7757", "unknownRecipe7758", "unknownRecipe10970", "unknownRecipe10971", "unknownRecipe10972", "unknownRecipe10973", "unknownRecipe10974", "unknownRecipe10975", "unknownRecipe10976", "unknownRecipe10977", "unknownRecipe10978", "unknownRecipe10988", "unknownRecipe10989", "unknownRecipe10990", "unknownRecipe10991", "unknownRecipe10992", "unknownRecipe11000"];
var numericProperties = ["coinMasterIndex", "dailyDeedsVersion", "defaultDropdown1", "defaultDropdown2", "defaultDropdownSplit", "defaultLimit", "fixedThreadPoolSize", "itemManagerIndex", "lastBuffRequestType", "lastGlobalCounterDay", "lastImageCacheClear", "pingDefaultTestPings", "pingLoginCount", "pingLoginGoal", "pingLoginThreshold", "pingTestPings", "previousUpdateRevision", "relayDelayForSVN", "relaySkillButtonCount", "scriptButtonPosition", "statusDropdown", "svnThreadPoolSize", "toolbarPosition", "_beachTides", "_g9Effect", "8BitBonusTurns", "8BitScore", "addingScrolls", "adventurerMeatsWorldPoints", "affirmationCookiesEaten", "aminoAcidsUsed", "antagonisticSnowmanKitCost", "ascensionsToday", "asolDeferredPoints", "asolPointsPigSkinner", "asolPointsCheeseWizard", "asolPointsJazzAgent", "autoAbortThreshold", "autoAntidote", "autoBuyPriceLimit", "autopsyTweezersUsed", "autumnatonQuestTurn", "availableCandyCredits", "availableDimes", "availableFunPoints", "availableMrStore2002Credits", "availableQuarters", "availableSeptEmbers", "availableStoreCredits", "availableSwagger", "avantGuardPoints", "averageSwagger", "awolMedicine", "awolPointsBeanslinger", "awolPointsCowpuncher", "awolPointsSnakeoiler", "awolDeferredPointsBeanslinger", "awolDeferredPointsCowpuncher", "awolDeferredPointsSnakeoiler", "awolVenom", "bagOTricksCharges", "ballpitBonus", "bankedKarma", "bartenderTurnsUsed", "basementMallPrices", "basementSafetyMargin", "batmanFundsAvailable", "batmanBonusInitialFunds", "batmanTimeLeft", "bearSwagger", "beeCounter", "beGregariousCharges", "beGregariousFightsLeft", "birdformCold", "birdformHot", "birdformRoc", "birdformSleaze", "birdformSpooky", "birdformStench", "blackBartsBootyCost", "blackPuddingsDefeated", "blackForestProgress", "blankOutUsed", "bloodweiserDrunk", "bodyguardCharge", "bondPoints", "bondVillainsDefeated", "boneAbacusVictories", "bookOfFactsGummi", "bookOfFactsPinata", "bookOfIronyCost", "booPeakProgress", "borisPoints", "breakableHandling", "breakableHandling1964", "breakableHandling9691", "breakableHandling9692", "breakableHandling9699", "breathitinCharges", "brodenBacteria", "brodenSprinkles", "buffBotMessageDisposal", "buffBotPhilanthropyType", "buffJimmyIngredients", "burnoutsDefeated", "burrowgrubSummonsRemaining", "bwApronMealsEaten", "camelSpit", "camerasUsed", "campAwayDecoration", "candyWitchTurnsUsed", "candyWitchCandyTotal", "carboLoading", "catBurglarBankHeists", "cellarLayout", "charitableDonations", "chasmBridgeProgress", "chefTurnsUsed", "chessboardsCleared", "chibiAlignment", "chibiBirthday", "chibiFitness", "chibiIntelligence", "chibiLastVisit", "chibiSocialization", "chilledToTheBone", "cinchoSaltAndLime", "cinderellaMinutesToMidnight", "cinderellaScore", "clubEmNextWeekMonsterTurn", "cocktailSummons", "commerceGhostCombats", "cookbookbatIngredientsCharge", "controlPanelOmega", "cornucopiasOpened", "cosmicBowlingBallReturnCombats", "cozyCounter6332", "cozyCounter6333", "cozyCounter6334", "craftingClay", "craftingLeather", "craftingPlansCharges", "craftingStraw", "crimbo16BeardChakraCleanliness", "crimbo16BootsChakraCleanliness", "crimbo16BungChakraCleanliness", "crimbo16CrimboHatChakraCleanliness", "crimbo16GutsChakraCleanliness", "crimbo16HatChakraCleanliness", "crimbo16JellyChakraCleanliness", "crimbo16LiverChakraCleanliness", "crimbo16NippleChakraCleanliness", "crimbo16NoseChakraCleanliness", "crimbo16ReindeerChakraCleanliness", "crimbo16SackChakraCleanliness", "crimboTrainingSkill", "crimboTreeDays", "cubelingProgress", "cupidBowFights", "currentExtremity", "currentHedgeMazeRoom", "currentMojoFilters", "currentNunneryMeat", "currentPortalEnergy", "currentReplicaStoreYear", "cursedMagnifyingGlassCount", "cyrptAlcoveEvilness", "cyrptCrannyEvilness", "cyrptNicheEvilness", "cyrptNookEvilness", "cyrptTotalEvilness", "darkGyfftePoints", "dartsThrown", "daycareEquipment", "daycareInstructorItemQuantity", "daycareInstructors", "daycareLastScavenge", "daycareToddlers", "dbNemesisSkill1", "dbNemesisSkill2", "dbNemesisSkill3", "desertExploration", "desktopHeight", "desktopWidth", "dinseyFilthLevel", "dinseyFunProgress", "dinseyNastyBearsDefeated", "dinseySocialJusticeIProgress", "dinseySocialJusticeIIProgress", "dinseyTouristsFed", "dinseyToxicMultiplier", "doctorBagQuestLights", "doctorBagUpgrades", "dreadScroll1", "dreadScroll2", "dreadScroll3", "dreadScroll4", "dreadScroll5", "dreadScroll6", "dreadScroll7", "dreadScroll8", "dripAdventuresSinceAscension", "drippingHallAdventuresSinceAscension", "drippingTreesAdventuresSinceAscension", "drippyBatsUnlocked", "drippyJuice", "drippyOrbsClaimed", "droneSelfDestructChipsUsed", "drunkenSwagger", "edDefeatAbort", "edPoints", "eldritchTentaclesFought", "electricKoolAidEaten", "elfGratitude", "encountersUntilDMTChoice", "encountersUntilYachtzeeChoice", "encountersUntilNEPChoice", "encountersUntilSRChoice", "ensorceleeLevel", "entauntaunedColdRes", "essenceOfAnnoyanceCost", "essenceOfBearCost", "extraRolloverAdventures", "falloutShelterLevel", "familiarSweat", "fingernailsClipped", "fistSkillsKnown", "flyeredML", "fossilB", "fossilD", "fossilN", "fossilP", "fossilS", "fossilW", "fratboysDefeated", "frenchGuardTurtlesFreed", "funGuyMansionKills", "garbageChampagneCharge", "garbageFireProgress", "garbageShirtCharge", "garbageTreeCharge", "garlandUpgrades", "getsYouDrunkTurnsLeft", "ghostPepperTurnsLeft", "gingerDigCount", "gingerLawChoice", "gingerMuscleChoice", "gingerTrainScheduleStudies", "gladiatorBallMovesKnown", "gladiatorBladeMovesKnown", "gladiatorNetMovesKnown", "glitchItemCost", "glitchItemImplementationCount", "glitchItemImplementationLevel", "glitchSwagger", "gloverPoints", "gnasirProgress", "goldenMrAccessories", "gongPath", "gooseDronesRemaining", "goreCollected", "gourdItemCount", "greyYouPoints", "grimoire1Summons", "grimoire2Summons", "grimoire3Summons", "grimstoneCharge", "guardTurtlesFreed", "guideToSafariCost", "guyMadeOfBeesCount", "guzzlrBronzeDeliveries", "guzzlrDeliveryProgress", "guzzlrGoldDeliveries", "guzzlrPlatinumDeliveries", "haciendaLayout", "hallowiener8BitRealm", "hallowienerCoinspiracy", "handfulOfTipsMeat", "hareMillisecondsSaved", "hareTurnsUsed", "heavyRainsStartingThunder", "heavyRainsStartingRain", "heavyRainsStartingLightning", "heroDonationBoris", "heroDonationJarlsberg", "heroDonationSneakyPete", "hiddenApartmentProgress", "hiddenBowlingAlleyProgress", "hiddenHospitalProgress", "hiddenOfficeProgress", "hiddenTavernUnlock", "highTopPumped", "hippiesDefeated", "holidayHalsBookCost", "holidaySwagger", "homemadeRobotUpgrades", "homebodylCharges", "hpAutoRecovery", "hpAutoRecoveryTarget", "iceSwagger", "ironicSwagger", "jarlsbergPoints", "juicyGarbageUsed", "jungCharge", "junglePuns", "knownAscensions", "kolhsTotalSchoolSpirited", "lassoTrainingCount", "lastAnticheeseDay", "lastArcadeAscension", "lastBadMoonReset", "lastBangPotionReset", "lastBattlefieldReset", "lastBeardBuff", "lastBreakfast", "lastCartographyBooPeak", "lastCartographyCastleTop", "lastCartographyDarkNeck", "lastCartographyDefiledNook", "lastCartographyFratHouse", "lastCartographyFratHouseVerge", "lastCartographyGuanoJunction", "lastCartographyHauntedBilliards", "lastCartographyHippyCampVerge", "lastCartographyZeppelinProtesters", "lastCastleGroundUnlock", "lastCastleTopUnlock", "lastCellarReset", "lastChanceThreshold", "lastChasmReset", "lastColosseumRoundWon", "lastCouncilVisit", "lastCounterDay", "lastDesertUnlock", "lastDispensaryOpen", "lastDMTDuplication", "lastDwarfFactoryReset", "lastEVHelmetValue", "lastEVHelmetReset", "lastEmptiedStorage", "lastFilthClearance", "lastGoofballBuy", "lastGuildStoreOpen", "lastGuyMadeOfBeesReset", "lastFratboyCall", "lastFriarCeremonyAscension", "lastFriarsElbowNC", "lastFriarsHeartNC", "lastFriarsNeckNC", "lastHippyCall", "lastIslandUnlock", "lastKeyotronUse", "lastKingLiberation", "lastLightsOutTurn", "lastMushroomPlot", "lastMiningReset", "lastNemesisReset", "lastPaperStripReset", "lastPirateEphemeraReset", "lastPirateInsultReset", "lastPlusSignUnlock", "lastQuartetAscension", "lastQuartetRequest", "lastSecondFloorUnlock", "lastShadowForgeUnlockAdventure", "lastKOLHSArtClassUnlockAdventure", "lastKOLHSChemClassUnlockAdventure", "lastKOLHSShopClassUnlockAdventure", "lastSkateParkReset", "lastStillBeatingSpleen", "lastTavernAscension", "lastTavernSquare", "lastTelescopeReset", "lastTempleAdventures", "lastTempleButtonsUnlock", "lastTempleUnlock", "lastThingWithNoNameDefeated", "lastTowelAscension", "lastTr4pz0rQuest", "lastTrainsetConfiguration", "lastVioletFogMap", "lastVoteMonsterTurn", "lastWartDinseyDefeated", "lastWuTangDefeated", "lastYearbookCameraAscension", "lastZapperWand", "lastZapperWandExplosionDay", "lawOfAveragesCost", "legacyPoints", "legendaryNoodlesAmygdala", "legendaryNoodlesSkin", "legendaryNoodlesStomach", "leprecondoLastNeedChange", "libramSummons", "lightsOutAutomation", "louvreDesiredGoal", "louvreGoal", "lovebugsAridDesert", "lovebugsBeachBuck", "lovebugsBooze", "lovebugsChroner", "lovebugsCoinspiracy", "lovebugsCyrpt", "lovebugsFreddy", "lovebugsFunFunds", "lovebugsHoboNickel", "lovebugsItemDrop", "lovebugsMeat", "lovebugsMeatDrop", "lovebugsMoxie", "lovebugsMuscle", "lovebugsMysticality", "lovebugsOilPeak", "lovebugsOrcChasm", "lovebugsPowder", "lovebugsWalmart", "lttQuestDifficulty", "lttQuestStageCount", "manaBurnSummonThreshold", "manaBurningThreshold", "manaBurningTrigger", "manorDrawerCount", "manualOfNumberologyCost", "mapToKokomoCost", "markYourTerritoryCharges", "masksUnlocked", "maximizerMRUSize", "maximizerCombinationLimit", "maximizerEquipmentLevel", "maximizerEquipmentScope", "maximizerMaxPrice", "maximizerPriceLevel", "maxManaBurn", "mayflyExperience", "mayoLevel", "meansuckerPrice", "mechanicalSongbirdProgress", "merkinVocabularyMastery", "miniAdvClass", "miniKiwiAiolisUsed", "miniMartinisDrunk", "mixedBerryJellyUses", "moleTunnelLevel", "momSeaMonkeeProgress", "mothershipProgress", "mpAutoRecovery", "mpAutoRecoveryTarget", "munchiesPillsUsed", "mushroomGardenCropLevel", "nanopolymerSpiderWebsUsed", "nextAprilBandTurn", "nextParanormalActivity", "nextQuantumFamiliarOwnerId", "nextQuantumFamiliarTurn", "noobPoints", "noobDeferredPoints", "noodleSummons", "nsContestants1", "nsContestants2", "nsContestants3", "nuclearAutumnPoints", "numericSwagger", "nunsVisits", "oilPeakProgress", "optimalSwagger", "optimisticCandleProgress", "palindomeDudesDefeated", "parasolUsed", "peaceTurkeyIndex", "pendingMapReflections", "phosphorTracesUses", "pingpongSkill", "pirateRealmPlasticPiratesDefeated", "pirateRealmShipsDestroyed", "pirateRealmStormsEscaped", "pirateSwagger", "plantingDay", "plumberBadgeCost", "plumberCostumeCost", "plumberPoints", "pokefamPoints", "poolSharkCount", "poolSkill", "powerPillProgress", "preworkoutPowderUses", "primaryLabGooIntensity", "prismaticSummons", "procrastinatorLanguageFluency", "promptAboutCrafting", "puzzleChampBonus", "pyramidPosition", "quantumPoints", "reagentSummons", "reanimatorArms", "reanimatorLegs", "reanimatorSkulls", "reanimatorWeirdParts", "reanimatorWings", "recentLocations", "redSnapperProgress", "relayPort", "relocatePygmyJanitor", "relocatePygmyLawyer", "rockinRobinProgress", "romanCandelabraRedCasts", "romanCandelabraBlueCasts", "romanCandelabraYellowCasts", "romanCandelabraGreenCasts", "romanCandelabraPurpleCasts", "ROMOfOptimalityCost", "rumpelstiltskinKidsRescued", "rumpelstiltskinTurnsUsed", "rwbMonsterCount", "safariSwagger", "sausageGrinderUnits", "schoolOfHardKnocksDiplomaCost", "schoolSwagger", "scrapbookCharges", "screechCombats", "scriptMRULength", "seadentConstructKills", "seadentLevel", "seaodesFound", "seaPoints", "SeasoningSwagger", "sexChanges", "shenInitiationDay", "shockingLickCharges", "shrunkenHeadZombieHP", "singleFamiliarRun", "skillBurn3", "skillBurn90", "skillBurn153", "skillBurn154", "skillBurn155", "skillBurn236", "skillBurn237", "skillBurn1019", "skillBurn5017", "skillBurn6014", "skillBurn6015", "skillBurn6016", "skillBurn6020", "skillBurn6021", "skillBurn6022", "skillBurn6023", "skillBurn6024", "skillBurn6026", "skillBurn6028", "skillBurn7323", "skillBurn14008", "skillBurn14028", "skillBurn14038", "skillBurn15011", "skillBurn15028", "skillBurn17005", "skillBurn22034", "skillBurn22035", "skillBurn23301", "skillBurn23302", "skillBurn23303", "skillBurn23304", "skillBurn23305", "skillBurn23306", "skillLevel46", "skillLevel47", "skillLevel48", "skillLevel117", "skillLevel118", "skillLevel121", "skillLevel128", "skillLevel134", "skillLevel135", "skillLevel144", "skillLevel180", "skillLevel188", "skillLevel227", "skillLevel245", "skillLevel7254", "slimelingFullness", "slimelingStacksDropped", "slimelingStacksDue", "smoresEaten", "smutOrcNoncombatProgress", "sneakyPetePoints", "snojoMoxieWins", "snojoMuscleWins", "snojoMysticalityWins", "sourceAgentsDefeated", "sourceEnlightenment", "sourceInterval", "sourcePoints", "sourceTerminalGram", "sourceTerminalPram", "sourceTerminalSpam", "spaceBabyLanguageFluency", "spacePirateLanguageFluency", "spelunkyNextNoncombat", "spelunkySacrifices", "spelunkyWinCount", "spookyPuttyCopiesMade", "spookyVHSTapeMonsterTurn", "statbotUses", "stockCertificateTurn", "sugarCounter4178", "sugarCounter4179", "sugarCounter4180", "sugarCounter4181", "sugarCounter4182", "sugarCounter4183", "sugarCounter4191", "summonAnnoyanceCost", "sweat", "tacoDanCocktailSauce", "tacoDanFishMeat", "takerSpaceAnchor", "takerSpaceGold", "takerSpaceMast", "takerSpaceRum", "takerSpaceSilk", "takerSpaceSpice", "tavernLayout", "telescopeUpgrades", "tempuraSummons", "timeposedTopHats", "timeSpinnerMedals", "timesRested", "tomeSummons", "totalCharitableDonations", "trainsetPosition", "tryToRememberCharges", "turtleBlessingTurns", "twinPeakProgress", "twoCRSPoints", "unicornHornInflation", "universalSeasoningCost", "usable1HWeapons", "usable1xAccs", "usable2HWeapons", "usable3HWeapons", "usableAccessories", "usableHats", "usableOffhands", "usableOther", "usablePants", "usableShirts", "valueOfAdventure", "valueOfInventory", "valueOfStill", "valueOfTome", "vintnerCharge", "vintnerWineLevel", "violetFogGoal", "walfordBucketProgress", "warehouseProgress", "welcomeBackAdv", "wereProfessorBite", "wereProfessorKick", "wereProfessorLiver", "wereProfessorPoints", "wereProfessorRend", "wereProfessorResearchPoints", "wereProfessorStomach", "wereProfessorTransformTurns", "whetstonesUsed", "wolfPigsEvicted", "wolfTurnsUsed", "writingDesksDefeated", "xoSkeleltonXProgress", "xoSkeleltonOProgress", "yearbookCameraAscensions", "yearbookCameraUpgrades", "youRobotBody", "youRobotBottom", "youRobotLeft", "youRobotPoints", "youRobotRight", "youRobotTop", "zeppelinProgress", "zeppelinProtestors", "zigguratLianas", "zombiePoints", "zootSpecimensPrepared", "zootomistPoints", "_absintheDrops", "_abstractionDropsCrown", "_aguaDrops", "_xenomorphCharge", "_alliedRadioDropsUsed", "_ancestralRecallCasts", "_antihangoverBonus", "_aprilShowerDiscoNap", "_aprilBandInstruments", "_aprilBandSaxophoneUses", "_aprilBandTomUses", "_aprilBandTubaUses", "_aprilBandStaffUses", "_aprilBandPiccoloUses", "_archSpadeDigs", "_astralDrops", "_augSkillsCast", "_assertYourAuthorityCast", "_automatedFutureManufactures", "_autumnatonQuests", "_backUpUses", "_badlyRomanticArrows", "_badgerCharge", "_balefulHowlUses", "_banderRunaways", "_baseballInnings", "_bastilleCheese", "_bastilleGames", "_bastilleGameTurn", "_bastilleLastCheese", "_batWingsCauldronUsed", "_batWingsFreeFights", "_batWingsRestUsed", "_batWingsSwoopUsed", "_bczBloodGeyserCasts", "_bczRefractedGazeCasts", "_bczSweatBulletsCasts", "_bczBloodBathCasts", "_bczDialitupCasts", "_bczSweatEquityCasts", "_bczBloodThinnerCasts", "_bczSpinalTapasCasts", "_bczPheromoneCocktailCasts", "_beanCannonUses", "_bearHugs", "_beerLensDrops", "_bellydancerPickpockets", "_benettonsCasts", "_beretBlastUses", "_beretBoastUses", "_beretBuskingUses", "_birdsSoughtToday", "_bookOfFactsWishes", "_bookOfFactsTatters", "_boomBoxFights", "_boomBoxSongsLeft", "_bootStomps", "_boxingGloveArrows", "_brickoEyeSummons", "_brickoFights", "_campAwayCloudBuffs", "_campAwaySmileBuffs", "_candyEggsDeviled", "_candySummons", "_captainHagnkUsed", "_carnieCandyDrops", "_carnivorousPottedPlantWins", "_carrotNoseDrops", "_catBurglarCharge", "_catBurglarHeistsComplete", "_cheerleaderSteam", "_chestXRayUsed", "_chibiAdventures", "_chipBags", "_chocolateCigarsUsed", "_chocolateCoveredPingPongBallsUsed", "_chocolateSculpturesUsed", "_chocolatesUsed", "_chronolithActivations", "_chronolithNextCost", "_cinchUsed", "_cinchoRests", "_circadianRhythmsAdventures", "_clanFortuneConsultUses", "_clipartSummons", "_clocksUsed", "_cloversPurchased", "_clubEmBattlefieldUsed", "_clubEmNextWeekUsed", "_clubEmTimeUsed", "_coldMedicineConsults", "_coldMedicineEquipmentTaken", "_companionshipCasts", "_concoctionDatabaseRefreshes", "_cookbookbatCrafting", "_cookbookbatCombatsUntilNewQuest", "_cosmicBowlingSkillsUsed", "_crimbo21ColdResistance", "_crimboPastDailySpecialPrice", "_cyberFreeFights", "_cyberZone1Turns", "_cyberZone2Turns", "_cyberZone3Turns", "_dailySpecialPrice", "_dartsLeft", "_daycareGymScavenges", "_daycareRecruits", "_deckCardsDrawn", "_deluxeKlawSummons", "_demandSandwich", "_detectiveCasesCompleted", "_disavowed", "_dnaPotionsMade", "_donhosCasts", "_douseFoeUses", "_dreamJarDrops", "_drunkPygmyBanishes", "_durableDolphinWhistleUsed", "_edDefeats", "_edLashCount", "_eldritchTentaclesFoughtToday", "_elfGuardCookingUsed", "_elronsCasts", "_enamorangs", "_energyCollected", "_expertCornerCutterUsed", "_extraTimeUsed", "_favorRareSummons", "_feastUsed", "_feelinTheRhythm", "_feelPrideUsed", "_feelExcitementUsed", "_feelHatredUsed", "_feelLonelyUsed", "_feelNervousUsed", "_feelEnvyUsed", "_feelDisappointedUsed", "_feelSuperiorUsed", "_feelLostUsed", "_feelNostalgicUsed", "_feelPeacefulUsed", "_fingertrapArrows", "_fireExtinguisherCharge", "_fitnessTrackingSteps", "_fragrantHerbsUsed", "_freeBeachWalksUsed", "_frButtonsPressed", "_fudgeWaspFights", "_gapBuffs", "_garbageFireDrops", "_garbageFireDropsCrown", "_generateIronyUsed", "_genieFightsUsed", "_genieWishesUsed", "_gibbererAdv", "_gibbererCharge", "_gingerbreadCityTurns", "_glarkCableUses", "_glitchMonsterFights", "_gnomeAdv", "_godLobsterFights", "_goldenMoneyCharge", "_gongDrops", "_gothKidCharge", "_gothKidFights", "_greyYouAdventures", "_grimBrotherCharge", "_grimFairyTaleDrops", "_grimFairyTaleDropsCrown", "_grimoireConfiscatorSummons", "_grimoireGeekySummons", "_grimstoneMaskDrops", "_grimstoneMaskDropsCrown", "_grooseCharge", "_grooseDrops", "_grubbyWoolDrops", "_guzzlrDeliveries", "_guzzlrGoldDeliveries", "_guzzlrPlatinumDeliveries", "_hareAdv", "_hareCharge", "_heartstoneBanishUsed", "_heartstoneBuffUsed", "_heartstoneKillUsed", "_heartstonePalsUsed", "_heartstoneStunUsed", "_highTopPumps", "_hipsterAdv", "_hoardedCandyDropsCrown", "_hoboUnderlingSummons", "_holidayMultitaskingUsed", "_holoWristDrops", "_holoWristProgress", "_hoboFortRestEffectsGained", "_hotAshesDrops", "_hotJellyUses", "_hotTubSoaks", "_humanMuskUses", "_iceballUses", "_inigosCasts", "_ironTricornHeadbuttUsed", "_jerksHealthMagazinesUsed", "_jiggleCheese", "_jiggleCream", "_jiggleLife", "_jiggleSteak", "_jitbCharge", "_juneCleaverAdvs", "_juneCleaverFightsLeft", "_juneCleaverEncounters", "_juneCleaverStench", "_juneCleaverSpooky", "_juneCleaverSleaze", "_juneCleaverHot", "_juneCleaverCold", "_juneCleaverSkips", "_jungDrops", "_kgbClicksUsed", "_kgbDispenserUses", "_kgbTranquilizerDartUses", "_klawSummons", "_kloopCharge", "_kloopDrops", "_knuckleboneDrops", "_knuckleboneRests", "_kolhsAdventures", "_kolhsSavedByTheBell", "_lastDailyDungeonRoom", "_lastFitzsimmonsHatch", "_lastMobiusStripTurn", "_lastSausageMonsterTurn", "_lastZomboEye", "_latteRefillsUsed", "_lawOfAveragesUsed", "_leafblowerML", "_leafLassosCrafted", "_leafMonstersFought", "_leavesBurned", "_legendaryLasagmbieMana", "_legendaryVermincelliFreeRats", "_legionJackhammerCrafting", "_leprecondoRearrangements", "_leprecondoFurniture", "_llamaCharge", "_longConUsed", "_lovebugsBeachBuck", "_lovebugsChroner", "_lovebugsCoinspiracy", "_lovebugsFreddy", "_lovebugsFunFunds", "_lovebugsHoboNickel", "_lovebugsWalmart", "_loveChocolatesUsed", "_lynyrdSnareUses", "_machineTunnelsAdv", "_macrometeoriteUses", "_mafiaThumbRingAdvs", "_mapToACandyRichBlockDrops", "_mayamRests", "_mayflowerDrops", "_mayflySummons", "_mcHugeLargeAvalancheUses", "_mcHugeLargeSkiPlowUses", "_mcHugeLargeSlashUses", "_meatCuteUsed", "_meatLoafUsed", "_mediumSiphons", "_meteoriteAdesUsed", "_meteorShowerUses", "_micrometeoriteUses", "_mildEvilPerpetrated", "_mimicEggsDonated", "_mimicEggsObtained", "_miniKiwiDrops", "_miniMartiniDrops", "_mobiusRingPrimedTurn", "_mobiusStripEncounters", "_monkeyPawWishesUsed", "_monsterHabitatsFightsLeft", "_monsterHabitatsRecalled", "_monstersMapped", "_mushroomGardenFights", "_nanorhinoCharge", "_navelRunaways", "_neverendingPartyFreeTurns", "_newYouQuestSharpensDone", "_newYouQuestSharpensToDo", "_nextColdMedicineConsult", "_nextQuantumAlignment", "_nightmareFuelCharges", "_noobSkillCount", "_nuclearStockpileUsed", "_oilExtracted", "_oldSchoolCocktailCraftingUsed", "_olfactionsUsed", "_optimisticCandleDropsCrown", "_oreDropsCrown", "_otoscopeUsed", "_oysterEggsFound", "_pantsgivingBanish", "_pantsgivingCount", "_pantsgivingCrumbs", "_pantsgivingFullness", "_pasteDrops", "_perilsForeseen", "_peteJukeboxFixed", "_peteJumpedShark", "_petePeeledOut", "_photoBoothEffects", "_photoBoothEquipment", "_pieDrops", "_piePartsCount", "_pirateRealmGold", "_pirateRealmGlue", "_pirateRealmGrog", "_pirateRealmGrub", "_pirateRealmGuns", "_pirateRealmIslandMonstersDefeated", "_pirateRealmSailingTurns", "_pirateRealmShipSpeed", "_pixieCharge", "_pocketProfessorLectures", "_poisonArrows", "_pokeGrowFertilizerDrops", "_poolGames", "_powderedGoldDrops", "_powderedMadnessUses", "_powerfulGloveBatteryPowerUsed", "_powerPillDrops", "_powerPillUses", "_precisionCasts", "_pyramidRestEffectsGained", "_questPartyFairItemsOpened", "_radlibSummons", "_raindohCopiesMade", "_rapidPrototypingUsed", "_raveStealCount", "_reflexHammerUsed", "_resolutionAdv", "_resolutionRareSummons", "_riftletAdv", "_robinEggDrops", "_roboDrops", "_rogueProgramCharge", "_romanticFightsLeft", "_saberForceMonsterCount", "_saberForceUses", "_saberMod", "_saltGrainsConsumed", "_sandwormCharge", "_saplingsPlanted", "_sausageFights", "_sausagesEaten", "_sausagesMade", "_seadentLightningUsed", "_sealFigurineUses", "_sealScreeches", "_sealsSummoned", "_shadowBricksUsed", "_shadowRiftCombats", "_shatteringPunchUsed", "_shortOrderCookCharge", "_shrubCharge", "_slimeVialsHarvested", "_sloppyDinerBeachBucks", "_smilesOfMrA", "_smithsnessSummons", "_smolderingSkeletonsDefeated", "_smoochArmyHQCombats", "_snojoFreeFights", "_snojoParts", "_snokebombUsed", "_snowconeSummons", "_snowglobeDrops", "_snowmanHatPlaceUsed", "_snowSuitCount", "_sourceTerminalDigitizeMonsterCount", "_sourceTerminalDigitizeUses", "_sourceTerminalDuplicateUses", "_sourceTerminalEnhanceUses", "_sourceTerminalExtrudes", "_sourceTerminalPortscanUses", "_spaceFurDropsCrown", "_spacegatePlanetIndex", "_spacegateTurnsLeft", "_spaceJellyfishDrops", "_speakeasyDrinksDrunk", "_speakeasyFreeFights", "_spelunkerCharges", "_spelunkingTalesDrops", "_spikolodonSpikeUses", "_spiritOfTheMountainsAdvs", "_spookyJellyUses", "_stackLumpsUses", "_steamCardDrops", "_stickerSummons", "_stinkyCheeseCount", "_stressBallSqueezes", "_sugarSummons", "_summonResortPassesUsed", "_surprisinglySweetSlashUsed", "_surprisinglySweetStabUsed", "_sweatOutSomeBoozeUsed", "_swordOfSWordsKills", "_swordOfSWordsMonsterChanged", "_taffyRareSummons", "_taffyYellowSummons", "_tearawayPantsAdvs", "_thanksgettingFoodsEaten", "_thingfinderCasts", "_thinknerdPackageDrops", "_thorsPliersCrafting", "_timeHelmetAdv", "_timeCopsFoughtToday", "_timeSpinnerMinutesUsed", "_tokenDrops", "_transponderDrops", "_turkeyBlastersUsed", "_turkeyBooze", "_turkeyMuscle", "_turkeyMyst", "_turkeyMoxie", "_unaccompaniedMinerUsed", "_unblemishedPearlAnemoneMineProgress", "_unblemishedPearlDiveBarProgress", "_unblemishedPearlMadnessReefProgress", "_unblemishedPearlMarinaraTrenchProgress", "_unblemishedPearlTheBriniestDeepestsProgress", "_unconsciousCollectiveCharge", "_universalSeasoningsUsed", "_universeCalculated", "_universeImploded", "_usedReplicaBatoomerang", "_vampyreCloakeFormUses", "_villainLairProgress", "_vitachocCapsulesUsed", "_vmaskAdv", "_voidFreeFights", "_volcanoItem1", "_volcanoItem2", "_volcanoItem3", "_volcanoItemCount1", "_volcanoItemCount2", "_volcanoItemCount3", "_voteFreeFights", "_VYKEACompanionLevel", "_wandOfPigificationUsed", "_warbearAutoAnvilCrafting", "_waxGlobDrops", "_whiteRiceDrops", "_witchessFights", "_xoHugsUsed", "_yellowPixelDropsCrown", "_zapCount", "_zombieSmashPocketsUsed", "lastNoncombat15", "lastNoncombat257", "lastNoncombat270", "lastNoncombat273", "lastNoncombat280", "lastNoncombat283", "lastNoncombat297", "lastNoncombat322", "lastNoncombat323", "lastNoncombat324", "lastNoncombat341", "lastNoncombat343", "lastNoncombat384", "lastNoncombat386", "lastNoncombat391", "lastNoncombat392", "lastNoncombat394", "lastNoncombat405", "lastNoncombat406", "lastNoncombat408", "lastNoncombat439", "lastNoncombat440", "lastNoncombat441", "lastNoncombat450", "lastNoncombat528", "lastNoncombat533", "lastNoncombat539", "lastNoncombat540", "lastNoncombat541", "lastNoncombat588", "lastNoncombat589", "lastNoncombat590", "lastNoncombat591", "lastNoncombat592"];
var monsterProperties = ["beGregariousMonster", "bodyguardChatMonster", "cameraMonster", "chateauMonster", "clubEmNextWeekMonster", "clumsinessGroveBoss", "crappyCameraMonster", "crudeMonster", "enamorangMonster", "envyfishMonster", "glacierOfJerksBoss", "holdHandsMonster", "iceSculptureMonster", "lastCopyableMonster", "longConMonster", "maelstromOfLoversBoss", "makeFriendsMonster", "merkinLockkeyMonster", "monkeyPointMonster", "motifMonster", "nosyNoseMonster", "olfactedMonster", "photocopyMonster", "rainDohMonster", "romanticTarget", "rufusDesiredEntity", "rwbMonster", "screencappedMonster", "shrunkenHeadZombieMonster", "spookyPuttyMonster", "spookyVHSTapeMonster", "stenchCursedMonster", "superficiallyInterestedMonster", "swordOfSWordsMonster", "waxMonster", "yearbookCameraTarget", "_afterimageMonster", "_beanballMonster", "_chainedRelativityMonster", "_chainedPurpleCandleMonster", "_chainedAfterimageMonster", "_cookbookbatQuestMonster", "_curveballMonster", "_gallapagosMonster", "_jiggleCreamedMonster", "_latteMonster", "_monsterHabitatsMonster", "_nanorhinoBanishedMonster", "_newYouQuestMonster", "_prankCardMonster", "_relativityMonster", "_saberForceMonster", "_screwballMonster", "_skullballMonster", "_sourceTerminalDigitizeMonster", "_trickCoinMonster", "_voteMonster"];
var monsterNumericProperties = ["swordOfSWordsMonster"];
var locationProperties = ["autumnatonQuestLocation", "currentJunkyardLocation", "doctorBagQuestLocation", "ghostLocation", "guzzlrQuestLocation", "holdHandsLocation", "lastAdventure", "nextAdventure", "nextSpookyravenElizabethRoom", "nextSpookyravenStephenRoom", "rwbLocation", "sourceOracleTarget", "_cookbookbatQuestLastLocation", "_floundryBassLocation", "_floundryCarpLocation", "_floundryCodLocation", "_floundryHatchetfishLocation", "_floundryTroutLocation", "_floundryTunaLocation", "_lastPirateRealmIsland", "_sotParcelLocation"];
var stringProperties = ["autoLogin", "browserBookmarks", "chatFontSize", "combatHotkey0", "combatHotkey1", "combatHotkey2", "combatHotkey3", "combatHotkey4", "combatHotkey5", "combatHotkey6", "combatHotkey7", "combatHotkey8", "combatHotkey9", "commandBufferGCLI", "commandBufferTabbedChat", "commandLineNamespace", "dailyDeedsOptions", "defaultBorderColor", "displayName", "externalEditor", "getBreakfast", "headerStates", "highlightList", "http.proxyHost", "http.proxyPassword", "http.proxyPort", "http.proxyUser", "https.proxyHost", "https.proxyPassword", "https.proxyPort", "https.proxyUser", "initialDesktop", "initialFrames", "lastRelayUpdate", "lastUserAgent", "lastUsername", "logPreferenceChangeFilter", "loginScript", "loginServerName", "loginWindowLogo", "logoutScript", "pingDefaultTestPage", "pingLatest", "pingLoginAbort", "pingLoginCheck", "pingLoginFail", "pingLongest", "pingShortest", "pingTestPage", "previousNotifyList", "previousUpdateVersion", "saveState", "saveStateActive", "scriptList", "swingLookAndFeel", "userAgent", "8BitColor", "afterAdventureScript", "antiScientificMethod", "autoOlfact", "autoPutty", "autumnatonUpgrades", "backupCameraMode", "banishedMonsters", "banishedPhyla", "banishingShoutMonsters", "baseballTeam", "batmanStats", "batmanZone", "batmanUpgrades", "battleAction", "beachHeadsUnlocked", "beastSkillsAvailable", "beastSkillsKnown", "beforePVPScript", "betweenBattleScript", "boomBoxSong", "breakfastAlways", "breakfastHardcore", "breakfastSoftcore", "buffBotCasting", "buyScript", "cargoPocketsEmptied", "cargoPocketScraps", "chatbotScript", "chatPlayerScript", "chibiName", "choiceAdventureScript", "chosenTrip", "clanFortuneReply1", "clanFortuneReply2", "clanFortuneReply3", "clanFortuneWord1", "clanFortuneWord2", "clanFortuneWord3", "coolerYetiMode", "counterScript", "copperheadClubHazard", "crimbo23ArmoryControl", "crimbo23BarControl", "crimbo23CafeControl", "crimbo23CottageControl", "crimbo23FoundryControl", "crimbotChassis", "crimbotArm", "crimbotPropulsion", "crystalBallPredictions", "csServicesPerformed", "currentAstralTrip", "currentDistillateMods", "currentEasyBountyItem", "currentHardBountyItem", "currentHippyStore", "currentJunkyardTool", "currentLlamaForm", "currentMood", "currentPVPSeason", "currentPvpVictories", "currentSpecialBountyItem", "currentSITSkill", "customCombatScript", "cyrusAdjectives", "defaultFlowerLossMessage", "defaultFlowerWinMessage", "demonName1", "demonName2", "demonName3", "demonName4", "demonName5", "demonName6", "demonName7", "demonName8", "demonName9", "demonName10", "demonName11", "demonName12", "demonName13", "demonName14", "demonName14Segments", "dinseyGatorStenchDamage", "dinseyRollercoasterStats", "dreadScrollGuesses", "duckAreasCleared", "duckAreasSelected", "edPiece", "enamorangMonsterTurn", "ensorcelee", "EVEDirections", "everfullDartPerks", "extraCosmeticModifiers", "familiarScript", "flagellateFlagonsActive", "forbiddenStores", "gameProBossSpecialPower", "gooseReprocessed", "grimoireSkillsHardcore", "grimoireSkillsSoftcore", "grimstoneMaskPath", "guzzlrQuestClient", "guzzlrQuestTier", "harvestGardenHardcore", "harvestGardenSoftcore", "heartstoneAttunementMods", "heartstoneAttunementWord", "heartstoneLetters", "holdHandsMonsterCount", "hpAutoRecoveryItems", "invalidBuffMessage", "jickSwordModifier", "juneCleaverQueue", "kingLiberatedScript", "lassoTraining", "lastAdventureContainer", "lastAdventureTrail", "lastBangPotion819", "lastBangPotion820", "lastBangPotion821", "lastBangPotion822", "lastBangPotion823", "lastBangPotion824", "lastBangPotion825", "lastBangPotion826", "lastBangPotion827", "lastChanceBurn", "lastChessboard", "lastCombatEnvironments", "lastDwarfDiceRolls", "lastDwarfDigitRunes", "lastDwarfEquipmentRunes", "lastDwarfFactoryItem118", "lastDwarfFactoryItem119", "lastDwarfFactoryItem120", "lastDwarfFactoryItem360", "lastDwarfFactoryItem361", "lastDwarfFactoryItem362", "lastDwarfFactoryItem363", "lastDwarfFactoryItem364", "lastDwarfFactoryItem365", "lastDwarfFactoryItem910", "lastDwarfFactoryItem3199", "lastDwarfOfficeItem3208", "lastDwarfOfficeItem3209", "lastDwarfOfficeItem3210", "lastDwarfOfficeItem3211", "lastDwarfOfficeItem3212", "lastDwarfOfficeItem3213", "lastDwarfOfficeItem3214", "lastDwarfOreRunes", "lastDwarfHopper1", "lastDwarfHopper2", "lastDwarfHopper3", "lastDwarfHopper4", "lastEncounter", "lastMacroError", "lastMessageId", "lastPaperStrip3144", "lastPaperStrip4138", "lastPaperStrip4139", "lastPaperStrip4140", "lastPaperStrip4141", "lastPaperStrip4142", "lastPaperStrip4143", "lastPaperStrip4144", "lastPirateEphemera", "lastPorkoBoard", "lastPorkoPayouts", "lastPorkoExpected", "lastSlimeVial3885", "lastSlimeVial3886", "lastSlimeVial3887", "lastSlimeVial3888", "lastSlimeVial3889", "lastSlimeVial3890", "lastSlimeVial3891", "lastSlimeVial3892", "lastSlimeVial3893", "lastSlimeVial3894", "lastSlimeVial3895", "lastSlimeVial3896", "lastSelectedFaxbot", "lastSuccessfulFaxbot", "latteIngredients", "latteModifier", "latteUnlocks", "ledCandleMode", "leprecondoCurrentNeed", "leprecondoDiscovered", "leprecondoInstalled", "leprecondoNeedOrder", "libramSkillsHardcore", "libramSkillsSoftcore", "louvreOverride", "lovePotion", "lttQuestName", "maximizerList", "maximizerMRUList", "maximizerLastFilters", "mayoInMouth", "mayoMinderSetting", "merkinCatalogChoices", "merkinQuestPath", "mimicEggMonsters", "mineLayout1", "mineLayout2", "mineLayout3", "mineLayout4", "mineLayout5", "mineLayout6", "mineState1", "mineState2", "mineState3", "mineState4", "mineState5", "mineState6", "mpAutoRecoveryItems", "nextDistillateMods", "nextQuantumFamiliarName", "nextQuantumFamiliarOwner", "noncombatForcers", "nsChallenge2", "nsChallenge3", "nsChallenge4", "nsChallenge5", "nsTowerDoorKeysUsed", "oceanAction", "oceanDestination", "parkaMode", "pastaThrall1", "pastaThrall2", "pastaThrall3", "pastaThrall4", "pastaThrall5", "pastaThrall6", "pastaThrall7", "pastaThrall8", "peteMotorbikeTires", "peteMotorbikeGasTank", "peteMotorbikeHeadlight", "peteMotorbikeCowling", "peteMotorbikeMuffler", "peteMotorbikeSeat", "pieStuffing", "plantingDate", "plantingLength", "plantingScript", "plumberCostumeWorn", "pokefamBoosts", "postAscensionScript", "preAscensionScript", "questClumsinessGrove", "questDoctorBag", "questECoBucket", "questESlAudit", "questESlBacteria", "questESlCheeseburger", "questESlCocktail", "questESlDebt", "questESlFish", "questESlMushStash", "questESlSalt", "questESlSprinkles", "questESpClipper", "questESpEVE", "questESpFakeMedium", "questESpGore", "questESpJunglePun", "questESpOutOfOrder", "questESpSerum", "questESpSmokes", "questEStFishTrash", "questEStGiveMeFuel", "questEStNastyBears", "questEStSocialJusticeI", "questEStSocialJusticeII", "questEStSuperLuber", "questEStWorkWithFood", "questEStZippityDooDah", "questEUNewYou", "questF01Primordial", "questF02Hyboria", "questF03Future", "questF04Elves", "questF05Clancy", "questG01Meatcar", "questG02Whitecastle", "questG03Ego", "questG04Nemesis", "questG05Dark", "questG06Delivery", "questG07Myst", "questG08Moxie", "questG09Muscle", "questGlacierOfJerks", "questGuzzlr", "questI01Scapegoat", "questI02Beat", "questL02Larva", "questL03Rat", "questL04Bat", "questL05Goblin", "questL06Friar", "questL07Cyrptic", "questL08Trapper", "questL09Topping", "questL10Garbage", "questL11Black", "questL11Business", "questL11Curses", "questL11Desert", "questL11Doctor", "questL11MacGuffin", "questL11Manor", "questL11Palindome", "questL11Pyramid", "questL11Ron", "questL11Shen", "questL11Spare", "questL11Worship", "questL12HippyFrat", "questL12War", "questL13Final", "questL13Warehouse", "questLTTQuestByWire", "questM01Untinker", "questM02Artist", "questM03Bugbear", "questM05Toot", "questM06Gourd", "questM07Hammer", "questM08Baker", "questM09Rocks", "questM10Azazel", "questM11Postal", "questM12Pirate", "questM13Escape", "questM14Bounty", "questM15Lol", "questM16Temple", "questM17Babies", "questM18Swamp", "questM19Hippy", "questM20Necklace", "questM21Dance", "questM22Shirt", "questM23Meatsmith", "questM24Doc", "questM25Armorer", "questM26Oracle", "questMaelstromOfLovers", "questPAGhost", "questRufus", "questS01OldGuy", "questS02Monkees", "raveCombo1", "raveCombo2", "raveCombo3", "raveCombo4", "raveCombo5", "raveCombo6", "recoveryScript", "relayChatCLITrigger", "relayCounters", "retroCapeSuperhero", "retroCapeWashingInstructions", "royalty", "rufusQuestTarget", "rufusQuestType", "scriptMRUList", "seahorseName", "shadowLabyrinthGoal", "shadowRiftIngress", "shrubGarland", "shrubGifts", "shrubLights", "shrubTopper", "shrunkenHeadZombieAbilities", "sideDefeated", "sidequestArenaCompleted", "sidequestFarmCompleted", "sidequestJunkyardCompleted", "sidequestLighthouseCompleted", "sidequestNunsCompleted", "sidequestOrchardCompleted", "skateParkStatus", "snowsuit", "sourceTerminalChips", "sourceTerminalEducate1", "sourceTerminalEducate2", "sourceTerminalEnquiry", "sourceTerminalEducateKnown", "sourceTerminalEnhanceKnown", "sourceTerminalEnquiryKnown", "sourceTerminalExtrudeKnown", "spadingData", "spadingScript", "speakeasyName", "spelunkyStatus", "spelunkyUpgrades", "spookyravenRecipeUsed", "stationaryButton1", "stationaryButton2", "stationaryButton3", "stationaryButton4", "stationaryButton5", "stockCertificateTurns", "streamCrossDefaultTarget", "sweetSynthesisBlacklist", "telescope1", "telescope2", "telescope3", "telescope4", "telescope5", "testudinalTeachings", "textColors", "thanksMessage", "tomeSkillsHardcore", "tomeSkillsSoftcore", "trackVoteMonster", "trackedMonsters", "trackedPhyla", "trainsetConfiguration", "umbrellaState", "umdLastObtained", "vintnerWineEffect", "vintnerWineName", "vintnerWineType", "violetFogLayout", "volcanoMaze1", "volcanoMaze2", "volcanoMaze3", "volcanoMaze4", "volcanoMaze5", "warProgress", "watchedPreferences", "wereProfessorAdvancedResearch", "workteaClue", "yourFavoriteBird", "yourFavoriteBirdMods", "youRobotCPUUpgrades", "zootGraftedMods", "zootMilkCrueltyMods", "zootMilkKindnessMods", "_automatedFutureSide", "_bastilleBoosts", "_bastilleChoice1", "_bastilleChoice2", "_bastilleChoice3", "_bastilleCurrentStyles", "_bastilleEnemyCastle", "_bastilleEnemyName", "_bastilleLastBattleResults", "_bastilleLastEncounter", "_bastilleStats", "_beachHeadsUsed", "_beachLayout", "_beachMinutes", "_birdOfTheDay", "_birdOfTheDayMods", "_bittycar", "_campAwaySmileBuffSign", "_citizenZone", "_citizenZoneMods", "_cloudTalkMessage", "_cloudTalkSmoker", "_coatOfPaintModifier", "_cupidBowFamiliars", "_currentDartboard", "_curveballFightsLeft", "_cyberZone1Defense", "_cyberZone1Hacker", "_cyberZone1Owner", "_cyberZone2Defense", "_cyberZone2Hacker", "_cyberZone2Owner", "_cyberZone3Defense", "_cyberZone3Hacker", "_cyberZone3Owner", "_deckCardsSeen", "_feastedFamiliars", "_floristPlantsUsed", "_frAreasUnlocked", "_frHoursLeft", "_frMonstersKilled", "_futuristicCollarModifier", "_futuristicHatModifier", "_futuristicShirtModifier", "_horsery", "_horseryCrazyMox", "_horseryCrazyMus", "_horseryCrazyMys", "_horseryCrazyName", "_horseryCurrentName", "_horseryDarkName", "_horseryNormalName", "_horseryPaleName", "_jickJarAvailable", "_jiggleCheesedMonsters", "_lastCombatActions", "_lastCombatStarted", "_locketMonstersFought", "_mayamSymbolsUsed", "_mummeryMods", "_mummeryUses", "_newYouQuestSkill", "_noHatModifier", "_pantogramModifier", "_perilLocations", "_pirateRealmCrewmate", "_pirateRealmCrewmate1", "_pirateRealmCrewmate2", "_pirateRealmCrewmate3", "_pirateRealmShip", "_pottedPowerPlant", "_questESp", "_questPartyFair", "_questPartyFairProgress", "_questPartyFairQuest", "_questPirateRealm", "_roboDrinks", "_roninStoragePulls", "_savageBeastMods", "_seadentWaveZone", "_spacegateAnimalLife", "_spacegateCoordinates", "_spacegateGear", "_spacegateHazards", "_spacegateIntelligentLife", "_spacegatePlanetName", "_spacegatePlantLife", "_stolenAccordions", "_tempRelayCounters", "_timeSpinnerFoodAvailable", "_trickOrTreatBlock", "_unknownEasyBountyItem", "_unknownHardBountyItem", "_unknownSpecialBountyItem", "_untakenEasyBountyItem", "_untakenHardBountyItem", "_untakenSpecialBountyItem", "_userMods", "_villainLairColor", "_villainLairKey", "_voteLocal1", "_voteLocal2", "_voteLocal3", "_voteLocal4", "_voteMonster1", "_voteMonster2", "_voteModifier", "_VYKEACompanionType", "_VYKEACompanionRune", "_VYKEACompanionName"];
var numericOrStringProperties = ["statusEngineering", "statusGalley", "statusMedbay", "statusMorgue", "statusNavigation", "statusScienceLab", "statusSonar", "statusSpecialOps", "statusWasteProcessing", "choiceAdventure2", "choiceAdventure3", "choiceAdventure4", "choiceAdventure5", "choiceAdventure6", "choiceAdventure7", "choiceAdventure8", "choiceAdventure9", "choiceAdventure10", "choiceAdventure11", "choiceAdventure12", "choiceAdventure14", "choiceAdventure15", "choiceAdventure16", "choiceAdventure17", "choiceAdventure18", "choiceAdventure19", "choiceAdventure20", "choiceAdventure21", "choiceAdventure22", "choiceAdventure23", "choiceAdventure24", "choiceAdventure25", "choiceAdventure26", "choiceAdventure27", "choiceAdventure28", "choiceAdventure29", "choiceAdventure40", "choiceAdventure41", "choiceAdventure42", "choiceAdventure45", "choiceAdventure46", "choiceAdventure47", "choiceAdventure71", "choiceAdventure72", "choiceAdventure73", "choiceAdventure74", "choiceAdventure75", "choiceAdventure76", "choiceAdventure77", "choiceAdventure86", "choiceAdventure87", "choiceAdventure88", "choiceAdventure89", "choiceAdventure90", "choiceAdventure91", "choiceAdventure105", "choiceAdventure106", "choiceAdventure107", "choiceAdventure108", "choiceAdventure109", "choiceAdventure110", "choiceAdventure111", "choiceAdventure112", "choiceAdventure113", "choiceAdventure114", "choiceAdventure115", "choiceAdventure116", "choiceAdventure117", "choiceAdventure118", "choiceAdventure120", "choiceAdventure123", "choiceAdventure125", "choiceAdventure126", "choiceAdventure127", "choiceAdventure129", "choiceAdventure131", "choiceAdventure132", "choiceAdventure135", "choiceAdventure136", "choiceAdventure137", "choiceAdventure138", "choiceAdventure139", "choiceAdventure140", "choiceAdventure141", "choiceAdventure142", "choiceAdventure143", "choiceAdventure144", "choiceAdventure145", "choiceAdventure146", "choiceAdventure147", "choiceAdventure148", "choiceAdventure149", "choiceAdventure151", "choiceAdventure152", "choiceAdventure153", "choiceAdventure154", "choiceAdventure155", "choiceAdventure156", "choiceAdventure157", "choiceAdventure158", "choiceAdventure159", "choiceAdventure160", "choiceAdventure161", "choiceAdventure162", "choiceAdventure163", "choiceAdventure164", "choiceAdventure165", "choiceAdventure166", "choiceAdventure167", "choiceAdventure168", "choiceAdventure169", "choiceAdventure170", "choiceAdventure171", "choiceAdventure172", "choiceAdventure177", "choiceAdventure178", "choiceAdventure180", "choiceAdventure181", "choiceAdventure182", "choiceAdventure184", "choiceAdventure185", "choiceAdventure186", "choiceAdventure187", "choiceAdventure188", "choiceAdventure189", "choiceAdventure191", "choiceAdventure197", "choiceAdventure198", "choiceAdventure199", "choiceAdventure200", "choiceAdventure201", "choiceAdventure202", "choiceAdventure203", "choiceAdventure204", "choiceAdventure205", "choiceAdventure206", "choiceAdventure207", "choiceAdventure208", "choiceAdventure211", "choiceAdventure212", "choiceAdventure213", "choiceAdventure214", "choiceAdventure215", "choiceAdventure216", "choiceAdventure217", "choiceAdventure218", "choiceAdventure219", "choiceAdventure220", "choiceAdventure221", "choiceAdventure222", "choiceAdventure223", "choiceAdventure224", "choiceAdventure225", "choiceAdventure230", "choiceAdventure272", "choiceAdventure273", "choiceAdventure276", "choiceAdventure277", "choiceAdventure278", "choiceAdventure279", "choiceAdventure280", "choiceAdventure281", "choiceAdventure282", "choiceAdventure283", "choiceAdventure284", "choiceAdventure285", "choiceAdventure286", "choiceAdventure287", "choiceAdventure288", "choiceAdventure289", "choiceAdventure290", "choiceAdventure291", "choiceAdventure292", "choiceAdventure293", "choiceAdventure294", "choiceAdventure295", "choiceAdventure296", "choiceAdventure297", "choiceAdventure298", "choiceAdventure299", "choiceAdventure302", "choiceAdventure303", "choiceAdventure304", "choiceAdventure305", "choiceAdventure306", "choiceAdventure307", "choiceAdventure308", "choiceAdventure309", "choiceAdventure310", "choiceAdventure311", "choiceAdventure317", "choiceAdventure318", "choiceAdventure319", "choiceAdventure320", "choiceAdventure321", "choiceAdventure322", "choiceAdventure326", "choiceAdventure327", "choiceAdventure328", "choiceAdventure329", "choiceAdventure330", "choiceAdventure331", "choiceAdventure332", "choiceAdventure333", "choiceAdventure334", "choiceAdventure335", "choiceAdventure336", "choiceAdventure337", "choiceAdventure338", "choiceAdventure339", "choiceAdventure340", "choiceAdventure341", "choiceAdventure342", "choiceAdventure343", "choiceAdventure344", "choiceAdventure345", "choiceAdventure346", "choiceAdventure347", "choiceAdventure348", "choiceAdventure349", "choiceAdventure350", "choiceAdventure351", "choiceAdventure352", "choiceAdventure353", "choiceAdventure354", "choiceAdventure355", "choiceAdventure356", "choiceAdventure357", "choiceAdventure358", "choiceAdventure360", "choiceAdventure361", "choiceAdventure362", "choiceAdventure363", "choiceAdventure364", "choiceAdventure365", "choiceAdventure366", "choiceAdventure367", "choiceAdventure372", "choiceAdventure376", "choiceAdventure387", "choiceAdventure388", "choiceAdventure389", "choiceAdventure390", "choiceAdventure391", "choiceAdventure392", "choiceAdventure393", "choiceAdventure395", "choiceAdventure396", "choiceAdventure397", "choiceAdventure398", "choiceAdventure399", "choiceAdventure400", "choiceAdventure401", "choiceAdventure402", "choiceAdventure403", "choiceAdventure423", "choiceAdventure424", "choiceAdventure425", "choiceAdventure426", "choiceAdventure427", "choiceAdventure428", "choiceAdventure429", "choiceAdventure430", "choiceAdventure431", "choiceAdventure432", "choiceAdventure433", "choiceAdventure435", "choiceAdventure438", "choiceAdventure439", "choiceAdventure442", "choiceAdventure444", "choiceAdventure445", "choiceAdventure446", "choiceAdventure447", "choiceAdventure448", "choiceAdventure449", "choiceAdventure451", "choiceAdventure452", "choiceAdventure453", "choiceAdventure454", "choiceAdventure455", "choiceAdventure456", "choiceAdventure457", "choiceAdventure458", "choiceAdventure460", "choiceAdventure461", "choiceAdventure462", "choiceAdventure463", "choiceAdventure464", "choiceAdventure465", "choiceAdventure467", "choiceAdventure468", "choiceAdventure469", "choiceAdventure470", "choiceAdventure471", "choiceAdventure472", "choiceAdventure473", "choiceAdventure474", "choiceAdventure475", "choiceAdventure477", "choiceAdventure478", "choiceAdventure480", "choiceAdventure483", "choiceAdventure484", "choiceAdventure485", "choiceAdventure486", "choiceAdventure488", "choiceAdventure489", "choiceAdventure490", "choiceAdventure491", "choiceAdventure496", "choiceAdventure497", "choiceAdventure502", "choiceAdventure503", "choiceAdventure504", "choiceAdventure505", "choiceAdventure506", "choiceAdventure507", "choiceAdventure509", "choiceAdventure510", "choiceAdventure511", "choiceAdventure512", "choiceAdventure513", "choiceAdventure514", "choiceAdventure515", "choiceAdventure517", "choiceAdventure518", "choiceAdventure519", "choiceAdventure521", "choiceAdventure522", "choiceAdventure523", "choiceAdventure527", "choiceAdventure528", "choiceAdventure529", "choiceAdventure530", "choiceAdventure531", "choiceAdventure532", "choiceAdventure533", "choiceAdventure534", "choiceAdventure535", "choiceAdventure536", "choiceAdventure538", "choiceAdventure539", "choiceAdventure542", "choiceAdventure543", "choiceAdventure544", "choiceAdventure546", "choiceAdventure548", "choiceAdventure549", "choiceAdventure550", "choiceAdventure551", "choiceAdventure552", "choiceAdventure553", "choiceAdventure554", "choiceAdventure556", "choiceAdventure557", "choiceAdventure558", "choiceAdventure559", "choiceAdventure560", "choiceAdventure561", "choiceAdventure562", "choiceAdventure563", "choiceAdventure564", "choiceAdventure565", "choiceAdventure566", "choiceAdventure567", "choiceAdventure568", "choiceAdventure569", "choiceAdventure571", "choiceAdventure572", "choiceAdventure573", "choiceAdventure574", "choiceAdventure575", "choiceAdventure576", "choiceAdventure577", "choiceAdventure578", "choiceAdventure579", "choiceAdventure581", "choiceAdventure582", "choiceAdventure583", "choiceAdventure584", "choiceAdventure594", "choiceAdventure595", "choiceAdventure596", "choiceAdventure597", "choiceAdventure598", "choiceAdventure599", "choiceAdventure600", "choiceAdventure603", "choiceAdventure604", "choiceAdventure616", "choiceAdventure634", "choiceAdventure640", "choiceAdventure654", "choiceAdventure655", "choiceAdventure656", "choiceAdventure657", "choiceAdventure658", "choiceAdventure664", "choiceAdventure669", "choiceAdventure670", "choiceAdventure671", "choiceAdventure672", "choiceAdventure673", "choiceAdventure674", "choiceAdventure675", "choiceAdventure676", "choiceAdventure677", "choiceAdventure678", "choiceAdventure679", "choiceAdventure681", "choiceAdventure683", "choiceAdventure684", "choiceAdventure685", "choiceAdventure686", "choiceAdventure687", "choiceAdventure688", "choiceAdventure689", "choiceAdventure690", "choiceAdventure691", "choiceAdventure692", "choiceAdventure693", "choiceAdventure694", "choiceAdventure695", "choiceAdventure696", "choiceAdventure697", "choiceAdventure698", "choiceAdventure700", "choiceAdventure701", "choiceAdventure705", "choiceAdventure706", "choiceAdventure707", "choiceAdventure708", "choiceAdventure709", "choiceAdventure710", "choiceAdventure711", "choiceAdventure712", "choiceAdventure713", "choiceAdventure714", "choiceAdventure715", "choiceAdventure716", "choiceAdventure717", "choiceAdventure721", "choiceAdventure725", "choiceAdventure729", "choiceAdventure733", "choiceAdventure737", "choiceAdventure741", "choiceAdventure745", "choiceAdventure749", "choiceAdventure753", "choiceAdventure771", "choiceAdventure778", "choiceAdventure780", "choiceAdventure781", "choiceAdventure783", "choiceAdventure784", "choiceAdventure785", "choiceAdventure786", "choiceAdventure787", "choiceAdventure788", "choiceAdventure789", "choiceAdventure791", "choiceAdventure793", "choiceAdventure794", "choiceAdventure795", "choiceAdventure796", "choiceAdventure797", "choiceAdventure803", "choiceAdventure805", "choiceAdventure808", "choiceAdventure809", "choiceAdventure813", "choiceAdventure815", "choiceAdventure830", "choiceAdventure832", "choiceAdventure833", "choiceAdventure834", "choiceAdventure835", "choiceAdventure837", "choiceAdventure838", "choiceAdventure839", "choiceAdventure840", "choiceAdventure841", "choiceAdventure842", "choiceAdventure851", "choiceAdventure852", "choiceAdventure853", "choiceAdventure854", "choiceAdventure855", "choiceAdventure856", "choiceAdventure857", "choiceAdventure858", "choiceAdventure866", "choiceAdventure873", "choiceAdventure875", "choiceAdventure876", "choiceAdventure877", "choiceAdventure878", "choiceAdventure879", "choiceAdventure880", "choiceAdventure881", "choiceAdventure882", "choiceAdventure888", "choiceAdventure889", "choiceAdventure918", "choiceAdventure919", "choiceAdventure920", "choiceAdventure921", "choiceAdventure923", "choiceAdventure924", "choiceAdventure925", "choiceAdventure926", "choiceAdventure927", "choiceAdventure928", "choiceAdventure929", "choiceAdventure930", "choiceAdventure931", "choiceAdventure932", "choiceAdventure940", "choiceAdventure941", "choiceAdventure942", "choiceAdventure943", "choiceAdventure944", "choiceAdventure945", "choiceAdventure946", "choiceAdventure950", "choiceAdventure955", "choiceAdventure957", "choiceAdventure958", "choiceAdventure959", "choiceAdventure960", "choiceAdventure961", "choiceAdventure962", "choiceAdventure963", "choiceAdventure964", "choiceAdventure965", "choiceAdventure966", "choiceAdventure970", "choiceAdventure973", "choiceAdventure974", "choiceAdventure975", "choiceAdventure976", "choiceAdventure977", "choiceAdventure979", "choiceAdventure980", "choiceAdventure981", "choiceAdventure982", "choiceAdventure983", "choiceAdventure988", "choiceAdventure989", "choiceAdventure993", "choiceAdventure998", "choiceAdventure1000", "choiceAdventure1003", "choiceAdventure1005", "choiceAdventure1006", "choiceAdventure1007", "choiceAdventure1008", "choiceAdventure1009", "choiceAdventure1010", "choiceAdventure1011", "choiceAdventure1012", "choiceAdventure1013", "choiceAdventure1015", "choiceAdventure1016", "choiceAdventure1017", "choiceAdventure1018", "choiceAdventure1019", "choiceAdventure1020", "choiceAdventure1021", "choiceAdventure1022", "choiceAdventure1023", "choiceAdventure1026", "choiceAdventure1027", "choiceAdventure1028", "choiceAdventure1029", "choiceAdventure1030", "choiceAdventure1031", "choiceAdventure1032", "choiceAdventure1033", "choiceAdventure1034", "choiceAdventure1035", "choiceAdventure1036", "choiceAdventure1037", "choiceAdventure1038", "choiceAdventure1039", "choiceAdventure1040", "choiceAdventure1041", "choiceAdventure1042", "choiceAdventure1044", "choiceAdventure1045", "choiceAdventure1046", "choiceAdventure1048", "choiceAdventure1051", "choiceAdventure1052", "choiceAdventure1053", "choiceAdventure1054", "choiceAdventure1055", "choiceAdventure1056", "choiceAdventure1057", "choiceAdventure1059", "choiceAdventure1060", "choiceAdventure1061", "choiceAdventure1062", "choiceAdventure1065", "choiceAdventure1067", "choiceAdventure1068", "choiceAdventure1069", "choiceAdventure1070", "choiceAdventure1071", "choiceAdventure1073", "choiceAdventure1077", "choiceAdventure1080", "choiceAdventure1081", "choiceAdventure1082", "choiceAdventure1083", "choiceAdventure1084", "choiceAdventure1085", "choiceAdventure1091", "choiceAdventure1094", "choiceAdventure1095", "choiceAdventure1096", "choiceAdventure1097", "choiceAdventure1102", "choiceAdventure1106", "choiceAdventure1107", "choiceAdventure1108", "choiceAdventure1110", "choiceAdventure1114", "choiceAdventure1115", "choiceAdventure1116", "choiceAdventure1118", "choiceAdventure1119", "choiceAdventure1120", "choiceAdventure1121", "choiceAdventure1122", "choiceAdventure1123", "choiceAdventure1171", "choiceAdventure1172", "choiceAdventure1173", "choiceAdventure1174", "choiceAdventure1175", "choiceAdventure1193", "choiceAdventure1195", "choiceAdventure1196", "choiceAdventure1197", "choiceAdventure1198", "choiceAdventure1199", "choiceAdventure1202", "choiceAdventure1203", "choiceAdventure1204", "choiceAdventure1205", "choiceAdventure1206", "choiceAdventure1207", "choiceAdventure1208", "choiceAdventure1209", "choiceAdventure1210", "choiceAdventure1211", "choiceAdventure1212", "choiceAdventure1213", "choiceAdventure1214", "choiceAdventure1215", "choiceAdventure1219", "choiceAdventure1222", "choiceAdventure1223", "choiceAdventure1224", "choiceAdventure1225", "choiceAdventure1226", "choiceAdventure1227", "choiceAdventure1228", "choiceAdventure1229", "choiceAdventure1236", "choiceAdventure1237", "choiceAdventure1238", "choiceAdventure1239", "choiceAdventure1240", "choiceAdventure1241", "choiceAdventure1242", "choiceAdventure1243", "choiceAdventure1244", "choiceAdventure1245", "choiceAdventure1246", "choiceAdventure1247", "choiceAdventure1248", "choiceAdventure1249", "choiceAdventure1250", "choiceAdventure1251", "choiceAdventure1252", "choiceAdventure1253", "choiceAdventure1254", "choiceAdventure1255", "choiceAdventure1256", "choiceAdventure1266", "choiceAdventure1280", "choiceAdventure1281", "choiceAdventure1282", "choiceAdventure1283", "choiceAdventure1284", "choiceAdventure1285", "choiceAdventure1286", "choiceAdventure1287", "choiceAdventure1288", "choiceAdventure1289", "choiceAdventure1290", "choiceAdventure1291", "choiceAdventure1292", "choiceAdventure1293", "choiceAdventure1294", "choiceAdventure1295", "choiceAdventure1296", "choiceAdventure1297", "choiceAdventure1298", "choiceAdventure1299", "choiceAdventure1300", "choiceAdventure1301", "choiceAdventure1302", "choiceAdventure1303", "choiceAdventure1304", "choiceAdventure1305", "choiceAdventure1307", "choiceAdventure1310", "choiceAdventure1312", "choiceAdventure1313", "choiceAdventure1314", "choiceAdventure1315", "choiceAdventure1316", "choiceAdventure1317", "choiceAdventure1318", "choiceAdventure1319", "choiceAdventure1321", "choiceAdventure1322", "choiceAdventure1323", "choiceAdventure1324", "choiceAdventure1325", "choiceAdventure1326", "choiceAdventure1327", "choiceAdventure1328", "choiceAdventure1332", "choiceAdventure1333", "choiceAdventure1335", "choiceAdventure1340", "choiceAdventure1341", "choiceAdventure1345", "choiceAdventure1389", "choiceAdventure1392", "choiceAdventure1397", "choiceAdventure1399", "choiceAdventure1405", "choiceAdventure1411", "choiceAdventure1415", "choiceAdventure1427", "choiceAdventure1428", "choiceAdventure1429", "choiceAdventure1430", "choiceAdventure1431", "choiceAdventure1432", "choiceAdventure1433", "choiceAdventure1434", "choiceAdventure1436", "choiceAdventure1460", "choiceAdventure1461", "choiceAdventure1467", "choiceAdventure1468", "choiceAdventure1469", "choiceAdventure1470", "choiceAdventure1471", "choiceAdventure1472", "choiceAdventure1473", "choiceAdventure1474", "choiceAdventure1475", "choiceAdventure1486", "choiceAdventure1487", "choiceAdventure1488", "choiceAdventure1489", "choiceAdventure1491", "choiceAdventure1494", "choiceAdventure1505", "choiceAdventure1528", "choiceAdventure1534", "choiceAdventure1538", "choiceAdventure1539", "choiceAdventure1540", "choiceAdventure1541", "choiceAdventure1542", "choiceAdventure1545", "choiceAdventure1546", "choiceAdventure1547", "choiceAdventure1548", "choiceAdventure1549", "choiceAdventure1550", "choiceAdventure1591"];
var familiarProperties = ["commaFamiliar", "cupidBowLastFamiliar", "nextQuantumFamiliar", "stillsuitFamiliar", "zootGraftedButtCheekLeftFamiliar", "zootGraftedButtCheekRightFamiliar", "zootGraftedFootLeftFamiliar", "zootGraftedFootRightFamiliar", "zootGraftedHandLeftFamiliar", "zootGraftedHandRightFamiliar", "zootGraftedHeadFamiliar", "zootGraftedNippleLeftFamiliar", "zootGraftedNippleRightFamiliar", "zootGraftedShoulderLeftFamiliar", "zootGraftedShoulderRightFamiliar"];
var familiarNumericProperties = ["cupidBowLastFamiliar", "zootGraftedButtCheekLeftFamiliar", "zootGraftedButtCheekRightFamiliar", "zootGraftedFootLeftFamiliar", "zootGraftedFootRightFamiliar", "zootGraftedHandLeftFamiliar", "zootGraftedHandRightFamiliar", "zootGraftedHeadFamiliar", "zootGraftedNippleLeftFamiliar", "zootGraftedNippleRightFamiliar", "zootGraftedShoulderLeftFamiliar", "zootGraftedShoulderRightFamiliar"];
var statProperties = ["nsChallenge1", "snojoSetting"];
var phylumProperties = ["dnaSyringe", "locketPhylum", "redSnapperPhylum", "_circadianRhythmsPhylum"];
var itemProperties = ["commerceGhostItem", "daycareInstructorItem", "doctorBagQuestItem", "dolphinItem", "eweItem", "guzzlrQuestBooze", "implementGlitchItem", "muffinOnOrder", "rufusDesiredArtifact", "rufusDesiredItems", "shenQuestItem", "trapperOre", "walfordBucketItem", "_cookbookbatQuestIngredient", "_crimboPastDailySpecialItem", "_dailySpecial", "_pirateRealmCurio"];
var itemNumericProperties = ["daycareInstructorItem", "_crimboPastDailySpecialItem"];

var booleanPropertiesSet = new Set(booleanProperties);
var numericPropertiesSet = new Set(numericProperties);
var numericOrStringPropertiesSet = new Set(numericOrStringProperties);
var stringPropertiesSet = new Set(stringProperties);
var locationPropertiesSet = new Set(locationProperties);
var monsterPropertiesSet = new Set(monsterProperties);
var familiarPropertiesSet = new Set(familiarProperties);
var statPropertiesSet = new Set(statProperties);
var phylumPropertiesSet = new Set(phylumProperties);
var itemPropertiesSet = new Set(itemProperties);
/**
 * Determine whether a property has a boolean value
 *
 * @param property Property to check
 * @returns Whether the supplied property has a boolean value
 */
function isBooleanProperty(property) {
  return booleanPropertiesSet.has(property);
}
/**
 * Determine whether a property has a numeric value
 *
 * @param property Property to check
 * @returns Whether the supplied property has a numeric value
 */
function isNumericProperty(property) {
  return numericPropertiesSet.has(property);
}
/**
 * Determine whether a property has a numeric or string value
 *
 * @param property Property to check
 * @returns Whether the supplied property has a numeric or string value
 */
function isNumericOrStringProperty(property) {
  return numericOrStringPropertiesSet.has(property);
}
/**
 * Determine whether a property has a string value
 *
 * @param property Property to check
 * @returns Whether the supplied property has a string value
 */
function isStringProperty(property) {
  return stringPropertiesSet.has(property);
}
/**
 * Determine whether a property has a Location value
 *
 * @param property Property to check
 * @returns Whether the supplied property has a Location value
 */
function isLocationProperty(property) {
  return locationPropertiesSet.has(property);
}
/**
 * Determine whether a property has a Monster value
 *
 * @param property Property to check
 * @returns Whether the supplied property has a Monster value
 */
function isMonsterProperty(property) {
  return monsterPropertiesSet.has(property);
}
/**
 * Determine whether a property has a Familiar value
 *
 * @param property Property to check
 * @returns Whether the supplied property has a Familiar value
 */
function isFamiliarProperty(property) {
  return familiarPropertiesSet.has(property);
}
/**
 * Determine whether a property has a Stat value
 *
 * @param property Property to check
 * @returns Whether the supplied property has a Stat value
 */
function isStatProperty(property) {
  return statPropertiesSet.has(property);
}
/**
 * Determine whether a property has a Phylum value
 *
 * @param property Property to check
 * @returns Whether the supplied property has a Phylum value
 */
function isPhylumProperty(property) {
  return phylumPropertiesSet.has(property);
}
/**
 * Determine whether a property has an Item value
 *
 * @param property Property to check
 * @returns Whether the supplied property has an Item value
 */
function isItemProperty(property) {
  return itemPropertiesSet.has(property);
}

var createPropertyGetter = transform => (property, default_) => {
  var value = kolmafia.getProperty(property);
  if (default_ !== undefined && value === "") {
    return default_;
  }
  return transform(value, property);
};
function createMafiaClassPropertyGetter(Type,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
toType) {
  var numericPropertyNames = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return createPropertyGetter((value, property) => {
    if (value === "") return null;
    var v = numericPropertyNames.includes(property) ? value.match(/^[0-9]+$/) ? toType(parseInt(value)) : null : toType(value);
    return v === Type.none ? null : v;
  });
}
var getString = createPropertyGetter(value => value);
var getBoolean = createPropertyGetter(value => value === "true");
var getNumber = createPropertyGetter(value => Number(value));
var getFamiliar = createMafiaClassPropertyGetter(kolmafia.Familiar, kolmafia.toFamiliar, familiarNumericProperties);
var getItem = createMafiaClassPropertyGetter(kolmafia.Item, kolmafia.toItem, itemNumericProperties);
var getLocation = createMafiaClassPropertyGetter(kolmafia.Location, kolmafia.toLocation);
var getMonster = createMafiaClassPropertyGetter(kolmafia.Monster, kolmafia.toMonster, monsterNumericProperties);
var getPhylum = createMafiaClassPropertyGetter(kolmafia.Phylum, kolmafia.toPhylum);
var getStat = createMafiaClassPropertyGetter(kolmafia.Stat, kolmafia.toStat);
/**
 * Gets the value of a mafia property, either built in or custom
 *
 * @param property Name of the property
 * @param _default Default value for the property to take if not set
 * @returns Value of the mafia property
 */
function get(property, _default) {
  var value = getString(property);
  // Handle known properties.
  if (isBooleanProperty(property)) {
    return getBoolean(property, _default) ?? false;
  } else if (isNumericProperty(property)) {
    return getNumber(property, _default) ?? 0;
  } else if (isNumericOrStringProperty(property)) {
    return value.match(/^\d+$/) ? parseInt(value) : value;
  } else if (isLocationProperty(property)) {
    return getLocation(property, _default);
  } else if (isMonsterProperty(property)) {
    return getMonster(property, _default);
  } else if (isFamiliarProperty(property)) {
    return getFamiliar(property, _default);
  } else if (isStatProperty(property)) {
    return getStat(property, _default);
  } else if (isPhylumProperty(property)) {
    return getPhylum(property, _default);
  } else if (isItemProperty(property)) {
    return getItem(property, _default);
  } else if (isStringProperty(property)) {
    return value === "" && _default !== undefined ? _default : value;
  }
  // Not a KnownProperty from here on out.
  if (_default instanceof kolmafia.Location) {
    return getLocation(property, _default);
  } else if (_default instanceof kolmafia.Monster) {
    return getMonster(property, _default);
  } else if (_default instanceof kolmafia.Familiar) {
    return getFamiliar(property, _default);
  } else if (_default instanceof kolmafia.Stat) {
    return getStat(property, _default);
  } else if (_default instanceof kolmafia.Phylum) {
    return getPhylum(property, _default);
  } else if (_default instanceof kolmafia.Item) {
    return getItem(property, _default);
  } else if (typeof _default === "boolean") {
    return value === "true" ? true : value === "false" ? false : _default;
  } else if (typeof _default === "number") {
    return value === "" ? _default : parseInt(value);
  } else if (value === "") {
    return _default === undefined ? "" : _default;
  } else {
    return value;
  }
}
/**
 * Sets the value of a mafia property, either built in or custom
 *
 * @param property Name of the property
 * @param value Value to give the property
 * @returns Value that was set
 */
function _set(property, value) {
  var stringValue = value === null ? "" : value.toString();
  kolmafia.setProperty(property, stringValue);
  return value;
}
/**
 * Sets the value of a set of mafia properties
 *
 * @param properties Set of properties
 */
function setProperties(properties) {
  for (var _i = 0, _Object$entries = Object.entries(properties); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      prop = _Object$entries$_i[0],
      value = _Object$entries$_i[1];
    _set(prop, value);
  }
}
/**
 * Carries out a callback during which a set of properties will be set as supplied
 *
 * @param properties Properties to set during callback
 * @param callback Callback to execute with set properties
 * @returns Return value of the supplied callback
 */
function withProperties(properties, callback) {
  var propertiesBackup = Object.fromEntries(Object.entries(properties).map(_ref => {
    var _ref2 = _slicedToArray(_ref, 1),
      prop = _ref2[0];
    return [prop, get(prop)];
  }));
  setProperties(properties);
  try {
    return callback();
  } finally {
    setProperties(propertiesBackup);
  }
}
/**
 * Carries out a callback during which a property will be set as supplied
 *
 * @param property Property to set during callback
 * @param value Value to set property during callback
 * @param callback Callback to execute with set properties
 * @returns Return value of the supplied callback
 */
function withProperty(property, value, callback) {
  return withProperties({
    [property]: value
  }, callback);
}
var PropertiesManager = /*#__PURE__*/function () {
  function PropertiesManager() {
    _classCallCheck(this, PropertiesManager);
    _defineProperty(this, "properties", {});
  }
  return _createClass(PropertiesManager, [{
    key: "storedValues",
    get: function get() {
      return this.properties;
    }
    /**
     * Sets a collection of properties to the given values, storing the old values.
     *
     * @param propertiesToSet A Properties object, keyed by property name.
     */
  }, {
    key: "set",
    value: function set(propertiesToSet) {
      for (var _i2 = 0, _Object$entries2 = Object.entries(propertiesToSet); _i2 < _Object$entries2.length; _i2++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
          propertyName = _Object$entries2$_i[0],
          propertyValue = _Object$entries2$_i[1];
        if (!(propertyName in this.properties)) {
          this.properties[propertyName] = kolmafia.propertyExists(propertyName) ? get(propertyName) : PropertiesManager.EMPTY_PREFERENCE;
        }
        _set(propertyName, propertyValue);
      }
    }
    /**
     * Sets a collection of choice adventure properties to the given values, storing the old values.
     *
     * @param choicesToSet An object keyed by choice adventure number.
     */
  }, {
    key: "setChoices",
    value: function setChoices(choicesToSet) {
      this.set(Object.fromEntries(Object.entries(choicesToSet).map(_ref5 => {
        var _ref6 = _slicedToArray(_ref5, 2),
          choiceNumber = _ref6[0],
          choiceValue = _ref6[1];
        return ["choiceAdventure".concat(choiceNumber), choiceValue];
      })));
    }
    /**
     * Sets a single choice adventure property to the given value, storing the old value.
     *
     * @param choiceToSet The number of the choice adventure to set the property for.
     * @param value The value to assign to that choice adventure.
     */
  }, {
    key: "setChoice",
    value: function setChoice(choiceToSet, value) {
      this.setChoices({
        [choiceToSet]: value
      });
    }
    /**
     * Resets the given properties to their original stored value. Does not delete entries from the manager.
     *
     * @param properties Collection of properties to reset.
     */
  }, {
    key: "reset",
    value: function reset() {
      for (var _len = arguments.length, properties = new Array(_len), _key = 0; _key < _len; _key++) {
        properties[_key] = arguments[_key];
      }
      for (var _i3 = 0, _properties = properties; _i3 < _properties.length; _i3++) {
        var property = _properties[_i3];
        if (!(property in this.properties)) continue;
        var value = this.properties[property];
        if (value === PropertiesManager.EMPTY_PREFERENCE) {
          kolmafia.removeProperty(property);
        } else {
          _set(property, value);
        }
      }
    }
    /**
     * Iterates over all stored values, setting each property back to its original stored value. Does not delete entries from the manager.
     */
  }, {
    key: "resetAll",
    value: function resetAll() {
      this.reset.apply(this, _toConsumableArray(Object.keys(this.properties)));
    }
    /**
     * Stops storing the original values of inputted properties.
     *
     * @param properties Properties for the manager to forget.
     */
  }, {
    key: "clear",
    value: function clear() {
      for (var _len2 = arguments.length, properties = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        properties[_key2] = arguments[_key2];
      }
      for (var _i4 = 0, _properties2 = properties; _i4 < _properties2.length; _i4++) {
        var property = _properties2[_i4];
        if (this.properties[property]) {
          delete this.properties[property];
        }
      }
    }
    /**
     * Clears all properties.
     */
  }, {
    key: "clearAll",
    value: function clearAll() {
      this.properties = {};
    }
    /**
     * Increases a numeric property to the given value if necessary.
     *
     * @param property The numeric property we want to potentially raise.
     * @param value The minimum value we want that property to have.
     * @returns Whether we needed to change the property.
     */
  }, {
    key: "setMinimumValue",
    value: function setMinimumValue(property, value) {
      if (get(property, 0) < value) {
        this.set({
          [property]: value
        });
        return true;
      }
      return false;
    }
    /**
     * Decrease a numeric property to the given value if necessary.
     *
     * @param property The numeric property we want to potentially lower.
     * @param value The maximum value we want that property to have.
     * @returns Whether we needed to change the property.
     */
  }, {
    key: "setMaximumValue",
    value: function setMaximumValue(property, value) {
      if (get(property, 0) > value) {
        this.set({
          [property]: value
        });
        return true;
      }
      return false;
    }
    /**
     * Creates a new PropertiesManager with identical stored values to this one.
     *
     * @returns A new PropertiesManager, with identical stored values to this one.
     */
  }, {
    key: "clone",
    value: function clone() {
      var newGuy = new PropertiesManager();
      newGuy.properties = this.storedValues;
      return newGuy;
    }
    /**
     * Clamps a numeric property, modulating it up or down to fit within a specified range
     *
     * @param property The numeric property to clamp
     * @param min The lower bound for what we want the property to be allowed to be.
     * @param max The upper bound for what we want the property to be allowed to be.
     * @returns Whether we ended up changing the property or not.
     */
  }, {
    key: "clamp",
    value: function clamp(property, min, max) {
      if (max < min) return false;
      var start = get(property);
      this.setMinimumValue(property, min);
      this.setMaximumValue(property, max);
      return start !== get(property);
    }
    /**
     * Determines whether this PropertiesManager has identical stored values to another.
     *
     * @param other The PropertiesManager to compare to this one.
     * @returns Whether their StoredValues are identical.
     */
  }, {
    key: "equals",
    value: function equals(other) {
      var thisProps = Object.entries(this.storedValues);
      var otherProps = new Map(Object.entries(other.storedValues));
      if (thisProps.length !== otherProps.size) return false;
      for (var _i5 = 0, _thisProps = thisProps; _i5 < _thisProps.length; _i5++) {
        var _thisProps$_i = _slicedToArray(_thisProps[_i5], 2),
          propertyName = _thisProps$_i[0],
          propertyValue = _thisProps$_i[1];
        if (otherProps.get(propertyName) === propertyValue) return false;
      }
      return true;
    }
    /**
     * Merges a PropertiesManager onto this one, letting the input win in the event that both PropertiesManagers have a value stored.
     *
     * @param other The PropertiesManager to be merged onto this one.
     * @returns A new PropertiesManager with stored values from both its parents.
     */
  }, {
    key: "merge",
    value: function merge(other) {
      var newGuy = new PropertiesManager();
      newGuy.properties = _objectSpread2(_objectSpread2({}, this.properties), other.properties);
      return newGuy;
    }
    /**
     * Merges an arbitrary collection of PropertiesManagers, letting the rightmost PropertiesManager win in the event of verlap.
     *
     * @param mergees The PropertiesManagers to merge together.
     * @returns A PropertiesManager that is just an amalgam of all the constituents.
     */
  }], [{
    key: "merge",
    value: function merge() {
      for (var _len3 = arguments.length, mergees = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        mergees[_key3] = arguments[_key3];
      }
      if (mergees.length === 0) return new PropertiesManager();
      return mergees.reduce((a, b) => a.merge(b));
    }
  }]);
}();
_defineProperty(PropertiesManager, "EMPTY_PREFERENCE", Symbol("empty preference"));

/**
 * Clamp a number between lower and upper bounds.
 *
 * @param n Number to clamp.
 * @param min Lower bound.
 * @param max Upper bound.
 * @returns Clamped value
 */
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
/**
 * Splits a string by commas while also respecting escaping commas with a backslash
 *
 * @param str String to split
 * @returns List of tokens
 */
function splitByCommasWithEscapes(str) {
  var returnValue = [];
  var ignoreNext = false;
  var currentString = "";
  var _iterator2 = _createForOfIteratorHelper(str.split("")),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var char = _step2.value;
      if (char === "\\") {
        ignoreNext = true;
      } else {
        if (char == "," && !ignoreNext) {
          returnValue.push(currentString.trim());
          currentString = "";
        } else {
          currentString += char;
        }
        ignoreNext = false;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  returnValue.push(currentString.trim());
  return returnValue;
}

var concatTemplateString = function concatTemplateString(literals) {
  for (var _len = arguments.length, placeholders = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    placeholders[_key - 1] = arguments[_key];
  }
  return literals.raw.reduce((acc, literal, i) => acc + literal + (placeholders[i] ?? ""), "");
};
var handleTypeGetError = (Type, error) => {
  var message = "".concat(error);
  var match = message.match(RegExp("Bad ".concat(Type.name.toLowerCase(), " value: .*")));
  if (match) {
    kolmafia.print("".concat(match[0], "; if you're certain that this ").concat(Type.name, " exists and is spelled correctly, please update KoLMafia"), "red");
  } else {
    kolmafia.print(message);
  }
};
var createSingleConstant = (Type, converter) => {
  var tagFunction = function tagFunction(literals) {
    for (var _len2 = arguments.length, placeholders = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      placeholders[_key2 - 1] = arguments[_key2];
    }
    var input = concatTemplateString.apply(void 0, [literals].concat(placeholders));
    try {
      return Type.get(input);
    } catch (error) {
      handleTypeGetError(Type, error);
    }
    kolmafia.abort();
  };
  tagFunction.cls = Type;
  tagFunction.none = Type.none;
  tagFunction.get = name => {
    var value = converter(name);
    return value === Type.none ? null : value;
  };
  return tagFunction;
};
var createPluralConstant = Type => {
  var tagFunction = function tagFunction(literals) {
    for (var _len3 = arguments.length, placeholders = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      placeholders[_key3 - 1] = arguments[_key3];
    }
    var input = concatTemplateString.apply(void 0, [literals].concat(placeholders));
    if (input === "") {
      return Type.all();
    }
    try {
      return Type.get(splitByCommasWithEscapes(input));
    } catch (error) {
      handleTypeGetError(Type, error);
    }
    kolmafia.abort();
  };
  tagFunction.all = () => Type.all();
  return tagFunction;
};
/**
 * A Bounty specified by name.
 *
 * @category In-game constant
 */
createSingleConstant(kolmafia.Bounty, kolmafia.toBounty);
/**
 * A list of Bounties specified by a comma-separated list of names.
 * For a list of all possible Bounties, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Bounty);
/**
 * A Class specified by name.
 *
 * @category In-game constant
 */
var $class = createSingleConstant(kolmafia.Class, kolmafia.toClass);
/**
 * A list of Classes specified by a comma-separated list of names.
 * For a list of all possible Classes, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Class);
/**
 * A Coinmaster specified by name.
 *
 * @category In-game constant
 */
createSingleConstant(kolmafia.Coinmaster, kolmafia.toCoinmaster);
/**
 * A list of Coinmasters specified by a comma-separated list of names.
 * For a list of all possible Coinmasters, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Coinmaster);
/**
 * An Effect specified by name.
 *
 * @category In-game constant
 */
var $effect = createSingleConstant(kolmafia.Effect, kolmafia.toEffect);
/**
 * A list of Effects specified by a comma-separated list of names.
 * For a list of all possible Effects, leave the template string blank.
 *
 * @category In-game constant
 */
var $effects = createPluralConstant(kolmafia.Effect);
/**
 * An Element specified by name.
 *
 * @category In-game constant
 */
var $element = createSingleConstant(kolmafia.Element, kolmafia.toElement);
/**
 * A list of Elements specified by a comma-separated list of names.
 * For a list of all possible Elements, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Element);
/**
 * A Familiar specified by name.
 *
 * @category In-game constant
 */
var $familiar = createSingleConstant(kolmafia.Familiar, kolmafia.toFamiliar);
/**
 * A list of Familiars specified by a comma-separated list of names.
 * For a list of all possible Familiars, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Familiar);
/**
 * An Item specified by name.
 *
 * @category In-game constant
 */
var $item = createSingleConstant(kolmafia.Item, kolmafia.toItem);
/**
 * A list of Items specified by a comma-separated list of names.
 * For a list of all possible Items, leave the template string blank.
 *
 * @category In-game constant
 */
var $items = createPluralConstant(kolmafia.Item);
/**
 * A Location specified by name.
 *
 * @category In-game constant
 */
createSingleConstant(kolmafia.Location, kolmafia.toLocation);
/**
 * A list of Locations specified by a comma-separated list of names.
 * For a list of all possible Locations, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Location);
/**
 * A Modifier specified by name.
 *
 * @category In-game constant
 */
var $modifier = createSingleConstant(kolmafia.Modifier, kolmafia.toModifier);
/**
 * A list of Modifiers specified by a comma-separated list of names.
 * For a list of all possible Modifiers, leave the template string blank.
 *
 * @category In-game constant
 */
var $modifiers = createPluralConstant(kolmafia.Modifier);
/**
 * A Monster specified by name.
 *
 * @category In-game constant
 */
createSingleConstant(kolmafia.Monster, kolmafia.toMonster);
/**
 * A list of Monsters specified by a comma-separated list of names.
 * For a list of all possible Monsters, leave the template string blank.
 *
 * @category In-game constant
 */
var $monsters = createPluralConstant(kolmafia.Monster);
/**
 * A Path specified by name.
 *
 * @category In-game constant
 */
createSingleConstant(kolmafia.Path, kolmafia.toPath);
/**
 * A list of Paths specified by a comma-separated list of names.
 * For a list of all possible Paths, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Path);
/**
 * A Phylum specified by name.
 *
 * @category In-game constant
 */
createSingleConstant(kolmafia.Phylum, kolmafia.toPhylum);
/**
 * A list of Phyla specified by a comma-separated list of names.
 * For a list of all possible Phyla, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Phylum);
/**
 * A Servant specified by name.
 *
 * @category In-game constant
 */
createSingleConstant(kolmafia.Servant, kolmafia.toServant);
/**
 * A list of Servants specified by a comma-separated list of names.
 * For a list of all possible Servants, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Servant);
/**
 * A Skill specified by name.
 *
 * @category In-game constant
 */
var $skill = createSingleConstant(kolmafia.Skill, kolmafia.toSkill);
/**
 * A list of Skills specified by a comma-separated list of names.
 * For a list of all possible Skills, leave the template string blank.
 *
 * @category In-game constant
 */
var $skills = createPluralConstant(kolmafia.Skill);
/**
 * A Slot specified by name.
 *
 * @category In-game constant
 */
var $slot = createSingleConstant(kolmafia.Slot, kolmafia.toSlot);
/**
 * A list of Slots specified by a comma-separated list of names.
 * For a list of all possible Slots, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Slot);
/**
 * A Stat specified by name.
 *
 * @category In-game constant
 */
var $stat = createSingleConstant(kolmafia.Stat, kolmafia.toStat);
/**
 * A list of Stats specified by a comma-separated list of names.
 * For a list of all possible Stats, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Stat);
/**
 * A Thrall specified by name.
 *
 * @category In-game constant
 */
createSingleConstant(kolmafia.Thrall, kolmafia.toThrall);
/**
 * A list of Thralls specified by a comma-separated list of names.
 * For a list of all possible Thralls, leave the template string blank.
 *
 * @category In-game constant
 */
createPluralConstant(kolmafia.Thrall);

var _templateObject$5, _templateObject10$3, _templateObject11$3, _templateObject12$2, _templateObject13$2, _templateObject14$1, _templateObject15$1, _templateObject16$1, _templateObject17$1, _templateObject18$1, _templateObject19$1, _templateObject20$1, _templateObject21$1, _templateObject22, _templateObject23, _templateObject24, _templateObject25, _templateObject26, _templateObject27, _templateObject28, _templateObject29, _templateObject30, _templateObject31, _templateObject32, _templateObject33, _templateObject34, _templateObject35, _templateObject47, _templateObject48, _templateObject49, _templateObject50, _templateObject51, _templateObject52, _templateObject53;
/**
 * Determines the current maximum Accordion Thief songs the player can have in their head
 *
 * @category General
 * @returns Maximum number of songs for player
 */
function getSongLimit() {
  return 3 + (kolmafia.booleanModifier("Four Songs") ? 1 : 0) + kolmafia.numericModifier("Additional Song");
}
/**
 * Determine whether the Skill or Effect provided is an Accordion Thief song
 *
 * @category General
 * @param skillOrEffect The Skill or Effect
 * @returns Whether it's a song
 */
function isSong(skillOrEffect) {
  if (skillOrEffect instanceof kolmafia.Effect && skillOrEffect.attributes.includes("song")) {
    return true;
  } else {
    var skill = skillOrEffect instanceof kolmafia.Effect ? kolmafia.toSkill(skillOrEffect) : skillOrEffect;
    return skill.class === $class(_templateObject$5 || (_templateObject$5 = _taggedTemplateLiteral(["Accordion Thief"]))) && skill.buff;
  }
}
/**
 * List all active Effects
 *
 * @category General
 * @returns List of Effects
 */
function getActiveEffects() {
  return Object.keys(kolmafia.myEffects()).map(e => kolmafia.Effect.get(e));
}
/**
 * List currently active Accordion Thief songs
 *
 * @category General
 * @returns List of song Effects
 */
function getActiveSongs() {
  return getActiveEffects().filter(isSong);
}
/**
 * List number of active Accordion Thief songs
 *
 * @category General
 * @returns Number of songs
 */
function getSongCount() {
  return getActiveSongs().length;
}
/**
 * Determine whether the player "has" any entity which one could feasibly "have".
 *
 * @category General
 * @param thing Thing to check
 * @param quantity Minimum quantity the player must have to pass
 * @returns Whether the player meets the requirements of owning the supplied thing
 */
function have(thing) {
  var quantity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  if (thing instanceof kolmafia.Effect) {
    return kolmafia.haveEffect(thing) >= quantity;
  }
  if (thing instanceof kolmafia.Familiar) {
    return kolmafia.haveFamiliar(thing);
  }
  if (thing instanceof kolmafia.Item) {
    return kolmafia.availableAmount(thing) >= quantity;
  }
  if (thing instanceof kolmafia.Servant) {
    return kolmafia.haveServant(thing);
  }
  if (thing instanceof kolmafia.Skill) {
    return kolmafia.haveSkill(thing);
  }
  if (thing instanceof kolmafia.Thrall) {
    var thrall = kolmafia.myThrall();
    return thrall.id === thing.id && thrall.level >= quantity;
  }
  return false;
}
var Wanderer;
(function (Wanderer) {
  Wanderer["Digitize"] = "Digitize Monster";
  Wanderer["Enamorang"] = "Enamorang Monster";
  Wanderer["Familiar"] = "Familiar";
  Wanderer["Holiday"] = "Holiday Monster";
  Wanderer["Kramco"] = "Kramco";
  Wanderer["Nemesis"] = "Nemesis Assassin";
  Wanderer["Portscan"] = "portscan.edu";
  Wanderer["Romantic"] = "Romantic Monster";
  Wanderer["Vote"] = "Vote Monster";
})(Wanderer || (Wanderer = {}));
[Wanderer.Digitize, Wanderer.Portscan];
new Map([["El Dia De Los Muertos Borrachos", $monsters(_templateObject10$3 || (_templateObject10$3 = _taggedTemplateLiteral(["Novia Cad\xE1ver, Novio Cad\xE1ver, Padre Cad\xE1ver, Persona Inocente Cad\xE1ver"])))], ["Feast of Boris", $monsters(_templateObject11$3 || (_templateObject11$3 = _taggedTemplateLiteral(["Candied Yam Golem, Malevolent Tofurkey, Possessed Can of Cranberry Sauce, Stuffing Golem"])))], ["Talk Like a Pirate Day", $monsters(_templateObject12$2 || (_templateObject12$2 = _taggedTemplateLiteral(["ambulatory pirate, migratory pirate, peripatetic pirate"])))]]);
new Map([["standing around flexing their muscles and using grip exercisers", $stat(_templateObject13$2 || (_templateObject13$2 = _taggedTemplateLiteral(["Muscle"])))], ["sitting around playing chess and solving complicated-looking logic puzzles", $stat(_templateObject14$1 || (_templateObject14$1 = _taggedTemplateLiteral(["Mysticality"])))], ["all wearing sunglasses and dancing", $stat(_templateObject15$1 || (_templateObject15$1 = _taggedTemplateLiteral(["Moxie"])))]]);
new Map([["people, all of whom appear to be on fire", $element(_templateObject16$1 || (_templateObject16$1 = _taggedTemplateLiteral(["hot"])))], ["people, surrounded by a cloud of eldritch mist", $element(_templateObject17$1 || (_templateObject17$1 = _taggedTemplateLiteral(["spooky"])))], ["greasy-looking people furtively skulking around", $element(_templateObject18$1 || (_templateObject18$1 = _taggedTemplateLiteral(["sleaze"])))], ["people, surrounded by garbage and clouds of flies", $element(_templateObject19$1 || (_templateObject19$1 = _taggedTemplateLiteral(["stench"])))], ["people, clustered around a group of igloos", $element(_templateObject20$1 || (_templateObject20$1 = _taggedTemplateLiteral(["cold"])))]]);
new Map([["smoldering bushes on the outskirts of a hedge maze", $element(_templateObject21$1 || (_templateObject21$1 = _taggedTemplateLiteral(["hot"])))], ["creepy-looking black bushes on the outskirts of a hedge maze", $element(_templateObject22 || (_templateObject22 = _taggedTemplateLiteral(["spooky"])))], ["purplish, greasy-looking hedges", $element(_templateObject23 || (_templateObject23 = _taggedTemplateLiteral(["sleaze"])))], ["nasty-looking, dripping green bushes on the outskirts of a hedge maze", $element(_templateObject24 || (_templateObject24 = _taggedTemplateLiteral(["stench"])))], ["frost-rimed bushes on the outskirts of a hedge maze", $element(_templateObject25 || (_templateObject25 = _taggedTemplateLiteral(["cold"])))]]);
new Map([["smoke rising from deeper within the maze", $element(_templateObject26 || (_templateObject26 = _taggedTemplateLiteral(["hot"])))], ["a miasma of eldritch vapors rising from deeper within the maze", $element(_templateObject27 || (_templateObject27 = _taggedTemplateLiteral(["spooky"])))], ["a greasy purple cloud hanging over the center of the maze", $element(_templateObject28 || (_templateObject28 = _taggedTemplateLiteral(["sleaze"])))], ["a cloud of green gas hovering over the maze", $element(_templateObject29 || (_templateObject29 = _taggedTemplateLiteral(["stench"])))], ["wintry mists rising from deeper within the maze", $element(_templateObject30 || (_templateObject30 = _taggedTemplateLiteral(["cold"])))]]);
new Map([["with lava slowly oozing out of it", $element(_templateObject31 || (_templateObject31 = _taggedTemplateLiteral(["hot"])))], ["surrounded by creepy black mist", $element(_templateObject32 || (_templateObject32 = _taggedTemplateLiteral(["spooky"])))], ["that occasionally vomits out a greasy ball of hair", $element(_templateObject33 || (_templateObject33 = _taggedTemplateLiteral(["sleaze"])))], ["disgorging a really surprising amount of sewage", $element(_templateObject34 || (_templateObject34 = _taggedTemplateLiteral(["stench"])))], ["occasionally disgorging a bunch of ice cubes", $element(_templateObject35 || (_templateObject35 = _taggedTemplateLiteral(["cold"])))]]);
/**
 * Calculate the total weight of a given familiar, including soup & modifiers
 * @param familiar The familiar to use--defaults to your current one
 * @param considerAdjustment Whether to include your `weightAdjustment` in the calculation
 * @returns The total weight of the given familiar
 */
function totalFamiliarWeight() {
  var familiar = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : kolmafia.myFamiliar();
  var considerAdjustment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return clamp(clamp(kolmafia.familiarWeight(familiar), have($effect(_templateObject47 || (_templateObject47 = _taggedTemplateLiteral(["Fidoxene"])))) ? 20 : 0, Infinity) + familiar.soupWeight + (considerAdjustment ? kolmafia.weightAdjustment() : 0) + (familiar.feasted ? 10 : 0), 1, Infinity);
}
var regularFamiliarTags = Object.freeze(["animal", "insect", "haseyes", "haswings", "fast", "bite", "flies", "hashands", "wearsclothes", "organic", "vegetable", "hovers", "edible", "food", "sentient", "cute", "mineral", "polygonal", "object", "undead", "cantalk", "evil", "orb", "spooky", "sleaze", "aquatic", "swims", "isclothes", "phallic", "stench", "hot", "hasbeak", "haslegs", "robot", "technological", "hard", "cold", "hasbones", "hasclaws", "reallyevil", "good", "person", "humanoid", "animatedart", "software", "hasshell", "hasstinger"]);
new Set(regularFamiliarTags);
new Map([[$familiar(_templateObject48 || (_templateObject48 = _taggedTemplateLiteral(["Nursine"]))), ["ult_bearhug"]], [$familiar(_templateObject49 || (_templateObject49 = _taggedTemplateLiteral(["Caramel"]))), ["ult_sticktreats"]], [$familiar(_templateObject50 || (_templateObject50 = _taggedTemplateLiteral(["Smashmoth"]))), ["ult_owlstare"]], [$familiar(_templateObject51 || (_templateObject51 = _taggedTemplateLiteral(["Slotter"]))), ["ult_bloodbath"]], [$familiar(_templateObject52 || (_templateObject52 = _taggedTemplateLiteral(["Cornbeefadon"]))), ["ult_pepperscorn"]], [$familiar(_templateObject53 || (_templateObject53 = _taggedTemplateLiteral(["Mu"]))), ["ult_rainbowstorm"]]]);

/**
 * No spending limit unless one is asked for. Doubles as the sentinel for "the
 * user didn't set a budget"; an open-ended goal still gets a rail of its own,
 * since "as high as possible" with no ceiling would buy the entire mall.
 */
var NO_MEAT_LIMIT = Infinity;

/** The rail on a bare modifier, which has no target value to stop it. */
var OPEN_ENDED_MEAT_LIMIT = 10000;

/**
 * Efficiency cap applied to a goal with no target value, unless the command
 * gives one. `null` leaves such goals uncapped.
 *
 * A goal with a number stops when it reaches that number, so it needs no cap and
 * must not have one — a filter there could reject the very effect that closes
 * the gap and turn a run that used to succeed into one that reports itself
 * short. Open-ended goals have no such stopping condition, so value for money is
 * what keeps them sensible.
 */
var OPEN_ENDED_EFFICIENCY = null;
function defaultOptions() {
  return {
    silent: false,
    ignorePercentages: false,
    allowLimitedBuffs: false,
    maxMeatToSpend: NO_MEAT_LIMIT,
    dryRun: false
  };
}
/**
 * Which way a target wants its modifier pushed: `1` up, `-1` down. An
 * open-ended goal always means "up"; `-combat` is the only way to ask for less,
 * and it carries an explicit negative value.
 */
function directionOf(target) {
  return target.value === null || target.value >= 0 ? 1 : -1;
}
function newRunState() {
  return {
    meatSpent: 0,
    meatPerAdventureSpent: 0,
    blockedSources: new Set()
  };
}

/**
 * Group a number with commas for display: `1234567.5` -> `"1,234,567.5"`.
 *
 * Hand-rolled rather than `toLocaleString`, which mafia's Rhino doesn't
 * implement dependably, and built from string slicing rather than a lookbehind
 * regex for the same reason. Rounds to two decimal places; trailing zeroes are
 * dropped, so whole numbers stay whole.
 */
function formatNumber(value) {
  if (!isFinite(value)) return String(value);
  var rounded = Math.round(value * 100) / 100;
  var magnitude = Math.abs(rounded);
  var whole = Math.floor(magnitude);
  var remaining = String(whole);
  var grouped = "";
  while (remaining.length > 3) {
    grouped = ",".concat(remaining.slice(-3)).concat(grouped);
    remaining = remaining.slice(0, -3);
  }
  grouped = remaining + grouped;

  // `String(0.25).slice(1)` is ".25" — the decimals with their point attached.
  var fraction = Math.round((magnitude - whole) * 100) / 100;
  var decimals = fraction > 0 ? String(fraction).slice(1) : "";
  return "".concat(rounded < 0 ? "-" : "").concat(grouped).concat(decimals);
}

/** Parse a CLI token as a number, tolerating thousands separators. */
function parseNumber(token) {
  var cleaned = token.replace(/,/g, "");
  if (cleaned === "" || !/\d/.test(cleaned)) return null;
  var value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

var _templateObject$4, _templateObject2$4;

/** Abbreviations mafia's own lookup won't recognise, mapped to canonical names. */
var ALIASES = {
  init: "initiative",
  item: "item drop",
  meat: "meat drop",
  mus: "muscle",
  mys: "mysticality",
  myst: "mysticality",
  mox: "moxie",
  da: "damage absorption",
  dr: "damage reduction",
  mp: "maximum mp",
  hp: "maximum hp",
  ml: "monster level",
  combat: "combat rate"
};
var ALL_RESISTANCES = $modifiers(_templateObject$4 || (_templateObject$4 = _taggedTemplateLiteral(["Cold Resistance, Hot Resistance, Sleaze Resistance, Stench Resistance, Spooky Resistance"])));

/** Modifiers conventionally displayed as percentages. */
var SHOWN_AS_PERCENT = new Set($modifiers(_templateObject2$4 || (_templateObject2$4 = _taggedTemplateLiteral(["Combat Rate, Initiative, Item Drop, Meat Drop"]))));

/** Expand an abbreviation to a canonical name mafia can resolve ("cold res" -> "cold resistance"). */
function expandAbbreviation(phrase) {
  return ALIASES[phrase] ?? phrase.replace(/\bres\b/, "resistance");
}

/** Turn one user phrase into the modifier(s) it names, or nothing if unrecognised. */
function resolveModifiers(phrase) {
  phrase = phrase.toLowerCase();
  if (phrase === "all res") return _toConsumableArray(ALL_RESISTANCES);
  if (phrase === "mainstat") phrase = kolmafia.myPrimestat().toString().toLowerCase();
  var modifier = kolmafia.Modifier.get(expandAbbreviation(phrase));
  return modifier === kolmafia.Modifier.none ? [] : [modifier];
}
function addTargets(targets, unrecognised, phrase, value) {
  if (phrase === "-combat") {
    if (value > 0) value = -value;else if (value === 0) value = -25;
    phrase = "combat";
  }

  // Validate the modifier before touching any state, so a typo can't silently
  // tighten the meat budget or half-apply a command.
  var modifiers = resolveModifiers(phrase);
  if (modifiers.length === 0) {
    unrecognised.push(phrase);
    return;
  }

  // A bare modifier with no number means "as much as possible". `null` says
  // exactly that, so the solver maximises against the budget instead of chasing
  // an arbitrarily large stand-in number. Such a goal has no stopping condition
  // of its own, so `main.ts` gives it a spending rail — done there, per goal,
  // rather than here, where it would clamp the budget for every other goal too.
  var goal = value === 0 ? null : value;
  var _iterator = _createForOfIteratorHelper(modifiers),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var modifier = _step.value;
      targets.push({
        modifier,
        value: goal
      });
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
function parseCommand(input) {
  var options = defaultOptions();
  var targets = [];
  var unrecognised = [];
  var minTurns = 1;
  var maxEfficiency = null;
  var meatPerAdventureLimit = 0;
  var pendingValue = 0;
  var currentModifier = "";
  var _iterator2 = _createForOfIteratorHelper(input.split(" ")),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var token = _step2.value;
      if (token === "") continue;
      switch (token) {
        case "turns":
        case "turn":
          minTurns = Math.max(1, pendingValue);
          pendingValue = 0;
          currentModifier = "";
          continue;
        case "eff":
        case "efficiency":
          maxEfficiency = pendingValue;
          pendingValue = 0;
          currentModifier = "";
          continue;
        case "meatperadventure":
        case "mpa":
          meatPerAdventureLimit = pendingValue;
          pendingValue = 0;
          currentModifier = "";
          continue;
        case "totalmeat":
          options.maxMeatToSpend = pendingValue;
          pendingValue = 0;
          currentModifier = "";
          continue;
        // A flag that takes no number sits anywhere in the command, so it must
        // leave a half-read modifier alone — clearing it would silently throw the
        // goal away, as `embiggen item plan` used to.
        case "absolute":
        case "nopercentage":
          options.ignorePercentages = true;
          continue;
        case "limited":
          options.allowLimitedBuffs = true;
          continue;
        case "silent":
          options.silent = true;
          continue;
        case "plan":
        case "dryrun":
          options.dryRun = true;
          continue;
      }
      var numeric = parseNumber(token);
      if (numeric !== null) {
        if (currentModifier !== "") {
          addTargets(targets, unrecognised, currentModifier, pendingValue);
          currentModifier = "";
        }
        pendingValue = numeric;
      } else {
        currentModifier = currentModifier === "" ? token : "".concat(currentModifier, " ").concat(token);
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  if (currentModifier !== "") {
    addTargets(targets, unrecognised, currentModifier, pendingValue);
  }
  return {
    targets,
    unrecognised,
    minTurns,
    maxEfficiency,
    meatPerAdventureLimit,
    options
  };
}
function describeGoals(targets, minTurns) {
  var parts = targets.map(_ref => {
    var modifier = _ref.modifier,
      value = _ref.value;
    if (value === null) return "".concat(modifier, " as high as possible");
    var direction = value > 0 ? " up to " : " down to ";
    var suffix = SHOWN_AS_PERCENT.has(modifier) ? "%" : "";
    return "".concat(modifier).concat(direction).concat(formatNumber(value)).concat(suffix);
  });
  var turns = minTurns !== 1 ? ", for ".concat(minTurns, " turns") : "";
  return "Buffing ".concat(parts.join(", ")).concat(turns, "...");
}
function printUsage() {
  kolmafia.printHtml("<strong>silent</strong>: don't output text (useful in libraries)");
  kolmafia.printHtml("<strong>plan/dryrun</strong>: print the plan and its cost without buying anything");
  kolmafia.printHtml("<strong>limited</strong>: allow limited buffs");
  kolmafia.printHtml("<strong>absolute/nopercentage</strong>: don't take into account percentage buffs for muscle/mysticality/moxie/hp/mp");
  kolmafia.printHtml("<strong>X turns/turn</strong>: number of turns to gain");
  kolmafia.printHtml("<strong>X totalmeat</strong>: total meat to spend. No limit by default, except that a goal " + "with no target value is capped at ".concat(formatNumber(OPEN_ENDED_MEAT_LIMIT), " meat, having ") + "nothing else to stop it.");
  kolmafia.printHtml("<strong>X efficiency/eff</strong>: set efficiency limit, which avoids expensive effects");
  kolmafia.printHtml("<strong>X meatperadventure/mpa</strong>: cap the meat spent per adventure of effect, shared across all effects.");
  kolmafia.printHtml("");
  kolmafia.printHtml("Example usage:");
  kolmafia.printHtml("<strong>embiggen 400 initiative</strong>: buff to 400 initiative, as efficiently as possible");
  kolmafia.printHtml("<strong>embiggen 20 familiar weight 50 turns</strong>: buff to 20 familiar weight, for a minimum of 50 turns");
  kolmafia.printHtml("<strong>embiggen 400 init 20 familiar weight 300 muscle 50 turns</strong>: buff familiar weight up to 20, initiative up to 400, and muscle up to 300, for 50 turns.");
  kolmafia.printHtml("<strong>embiggen 10000 monster level 10000 totalmeat</strong>: spend 10k meat on +monster level");
  kolmafia.printHtml("<strong>embiggen weapon damage 0.5 efficiency</strong>: gain weapon damage while only using cheap effect sources - efficiency value can be tuned");
  kolmafia.printHtml("<strong>embiggen hp 100 mpa</strong>: gain HP while spending up to one hundred meat per adventure of effect, total, across all effects gained. Better than efficiency.");
}

var _templateObject$3, _templateObject2$3, _templateObject3$3, _templateObject4$3, _templateObject5$3, _templateObject6$3, _templateObject7$3, _templateObject8$3, _templateObject9$3, _templateObject0$2, _templateObject1$2, _templateObject10$2, _templateObject11$2, _templateObject12$1, _templateObject13$1;
function activeBasestat(stat) {
  var value = kolmafia.myBasestat(stat);
  var limit = kolmafia.numericModifier("".concat(stat, " Limit"));
  var capped = limit > 0 && limit < value ? limit : value;
  return capped < 0 ? 1 : capped;
}

/**
 * An effect's contribution to a modifier, folding percentage bonuses back onto
 * the relevant base value. This is the one calculation the old string parser
 * really bought us; everything else mafia now answers directly.
 */
function effectiveModifier(effect, modifier, options) {
  var base = kolmafia.numericModifier(effect, modifier);
  if (options.ignorePercentages) return base;
  var fold = (percent, stat) => {
    var amount = kolmafia.numericModifier(effect, percent);
    return amount !== 0 ? amount / 100 * activeBasestat(stat) : 0;
  };
  switch (modifier) {
    case $modifier(_templateObject$3 || (_templateObject$3 = _taggedTemplateLiteral(["Muscle"]))):
      return base + fold($modifier(_templateObject2$3 || (_templateObject2$3 = _taggedTemplateLiteral(["Muscle Percent"]))), $stat(_templateObject3$3 || (_templateObject3$3 = _taggedTemplateLiteral(["Muscle"]))));
    case $modifier(_templateObject4$3 || (_templateObject4$3 = _taggedTemplateLiteral(["Mysticality"]))):
      return base + fold($modifier(_templateObject5$3 || (_templateObject5$3 = _taggedTemplateLiteral(["Mysticality Percent"]))), $stat(_templateObject6$3 || (_templateObject6$3 = _taggedTemplateLiteral(["Mysticality"]))));
    case $modifier(_templateObject7$3 || (_templateObject7$3 = _taggedTemplateLiteral(["Moxie"]))):
      return base + fold($modifier(_templateObject8$3 || (_templateObject8$3 = _taggedTemplateLiteral(["Moxie Percent"]))), $stat(_templateObject9$3 || (_templateObject9$3 = _taggedTemplateLiteral(["Moxie"]))));
    // These two formulas are approximations inherited from the ASH version.
    case $modifier(_templateObject0$2 || (_templateObject0$2 = _taggedTemplateLiteral(["Maximum MP"]))):
      return base + effectiveModifier(effect, $modifier(_templateObject1$2 || (_templateObject1$2 = _taggedTemplateLiteral(["Mysticality"]))), options) / 100 * (1 + kolmafia.numericModifier($modifier(_templateObject10$2 || (_templateObject10$2 = _taggedTemplateLiteral(["Maximum MP Percent"])))) / 100);
    case $modifier(_templateObject11$2 || (_templateObject11$2 = _taggedTemplateLiteral(["Maximum HP"]))):
      return base + effectiveModifier(effect, $modifier(_templateObject12$1 || (_templateObject12$1 = _taggedTemplateLiteral(["Muscle"]))), options) / 100 * (1 + kolmafia.numericModifier($modifier(_templateObject13$1 || (_templateObject13$1 = _taggedTemplateLiteral(["Maximum HP Percent"])))) / 100);
    default:
      return base;
  }
}

var _templateObject$2, _templateObject2$2, _templateObject3$2, _templateObject4$2, _templateObject5$2, _templateObject6$2, _templateObject7$2, _templateObject8$2, _templateObject9$2, _templateObject0$1, _templateObject1$1, _templateObject10$1, _templateObject11$1, _templateObject12, _templateObject13, _templateObject14, _templateObject15, _templateObject16, _templateObject17, _templateObject18, _templateObject19, _templateObject20, _templateObject21;
var FIXED_BLOCKED_EFFECTS = new Set($effects(_templateObject$2 || (_templateObject$2 = _taggedTemplateLiteral(["Cowrruption, Visions of the Deep Dark Deeps"]))));
var CHEAT_CODES = new Set($skills(_templateObject2$2 || (_templateObject2$2 = _taggedTemplateLiteral(["CHEAT CODE: Triple Size, CHEAT CODE: Invisible Avatar"]))));
var BLESSINGS = new Set($skills(_templateObject3$2 || (_templateObject3$2 = _taggedTemplateLiteral(["Blessing of the Storm Tortoise, Blessing of She-Who-Was, Blessing of the War Snapper"]))));
var DISDAINS = $effects(_templateObject4$2 || (_templateObject4$2 = _taggedTemplateLiteral(["Disdain of the War Snapper, Disdain of She-Who-Was, Disdain of the Storm Tortoise"])));

/** Songs that additionally require an accordion thief of at least level 15. */
var RICHIE_SONGS = new Set($skills(_templateObject5$2 || (_templateObject5$2 = _taggedTemplateLiteral(["The Ballad of Richie Thingfinder, Benetton's Medley of Diversity, Elron's Explosive Etude, Chorale of Companionship, Prelude of Precision"]))));
var MUTUAL_EXCLUSION_SETS = [$effects(_templateObject6$2 || (_templateObject6$2 = _taggedTemplateLiteral(["Snarl of the Timberwolf, Scowl of the Auk, Stiff Upper Lip, Patient Smile, Quiet Determination, Arched Eyebrow of the Archmage, Wizard Squint, Quiet Judgement, Icy Glare, Wry Smile, Disco Leer, Disco Smirk, Suspicious Gaze, Knowing Smile, Quiet Desperation"]))), $effects(_templateObject7$2 || (_templateObject7$2 = _taggedTemplateLiteral(["Song of the North, Song of Slowness, Song of Starch, Song of Sauce, Song of Bravado"]))), $effects(_templateObject8$2 || (_templateObject8$2 = _taggedTemplateLiteral(["Purple Tongue, Green Tongue, Orange Tongue, Red Tongue, Blue Tongue"]))), $effects(_templateObject9$2 || (_templateObject9$2 = _taggedTemplateLiteral(["Broken Heart, Fiery Heart, Cold Hearted, Sweet Heart, Withered Heart, Lustful Heart"]))), $effects(_templateObject0$1 || (_templateObject0$1 = _taggedTemplateLiteral(["Bloody Potato Bits, Legendary Bloody Potato Bits"]))), $effects(_templateObject1$1 || (_templateObject1$1 = _taggedTemplateLiteral(["Slinking Noodle Glob, Legendary Slinking Noodle Glob"]))), $effects(_templateObject10$1 || (_templateObject10$1 = _taggedTemplateLiteral(["Whispering Strands, Legendary Whispering Strands"]))), $effects(_templateObject11$1 || (_templateObject11$1 = _taggedTemplateLiteral(["Macaroni Coating, Legendary Macaroni Coating"]))), $effects(_templateObject12 || (_templateObject12 = _taggedTemplateLiteral(["Penne Fedora, Legendary Penne Fedora"]))), $effects(_templateObject13 || (_templateObject13 = _taggedTemplateLiteral(["Pasta Eyeball, Legendary Pasta Eyeball"]))), $effects(_templateObject14 || (_templateObject14 = _taggedTemplateLiteral(["Spice Haze, Legendary Spice Haze"])))];
var HEARTSTONE_SKILLS = [[kolmafia.Skill.get("Heartstone: %banish"), "heartstoneBanishUnlocked"], [kolmafia.Skill.get("Heartstone: %buff"), "heartstoneBuffUnlocked"], [kolmafia.Skill.get("Heartstone: %kill"), "heartstoneKillUnlocked"], [kolmafia.Skill.get("Heartstone: %luck"), "heartstoneLuckUnlocked"], [kolmafia.Skill.get("Heartstone: %pals"), "heartstonePalsUnlocked"], [kolmafia.Skill.get("Heartstone: %stun"), "heartstoneStunUnlocked"]];
var ALWAYS_BLOCKED_SKILLS = $skills(_templateObject15 || (_templateObject15 = _taggedTemplateLiteral(["Drench Yourself in Sweat, Spirit of Peppermint, Spirit of Cayenne, Spirit of Garlic, Spirit of Wormwood, Spirit of Bacon Grease"])));

// Items mafia can't acquire cleanly, or that we simply never want to use.
var UNWANTED_ITEMS = $items(_templateObject16 || (_templateObject16 = _taggedTemplateLiteral(["M-242, snake, sparkler, Mer-kin strongjuice, Mer-kin smartjuice, Mer-kin cooljuice, pirate tract, pirate pamphlet, pirate brochure, elven suicide capsule, Ghost Dog Chow, Yummy Tummy bean"])));

/** Skills whose buffs clash with our own class kit, so gaining them would bounce. */
function classConflictSkills() {
  if (kolmafia.myClass() === $class(_templateObject17 || (_templateObject17 = _taggedTemplateLiteral(["Turtle Tamer"])))) return _toConsumableArray(BLESSINGS);
  if (kolmafia.myClass() === $class(_templateObject18 || (_templateObject18 = _taggedTemplateLiteral(["Pastamancer"])))) {
    return kolmafia.Thrall.all().map(thrall => thrall.skill).filter(skill => skill !== $skill(_templateObject19 || (_templateObject19 = _taggedTemplateLiteral(["none"]))));
  }
  return [];
}

/** Heartstone skills the player hasn't unlocked. */
function lockedHeartstoneSkills() {
  return HEARTSTONE_SKILLS.filter(_ref => {
    var _ref2 = _slicedToArray(_ref, 2),
      skill = _ref2[0],
      pref = _ref2[1];
    return skill !== $skill(_templateObject20 || (_templateObject20 = _taggedTemplateLiteral(["none"]))) && !get(pref, false);
  }).map(_ref3 => {
    var _ref4 = _slicedToArray(_ref3, 1),
      skill = _ref4[0];
    return skill;
  });
}

/** Skills with a per-day cap, treated as limited buffs and skipped by default. */
function dailyLimitedSkills() {
  return kolmafia.Skill.all().filter(skill => skill.dailylimit > 0 || skill.dailylimitpref !== "");
}

/** Crystallized pumpkin spice is only worth using in autumn (Sep–Nov). */
function outOfSeasonItems() {
  var month = Number(kolmafia.todayToString().slice(4, 6));
  return month < 9 || month > 11 ? [$item(_templateObject21 || (_templateObject21 = _taggedTemplateLiteral(["crystallized pumpkin spice"])))] : [];
}
function buildRestrictions(options) {
  var blockedSkills = new Set([].concat(_toConsumableArray(classConflictSkills()), _toConsumableArray(ALWAYS_BLOCKED_SKILLS), _toConsumableArray(lockedHeartstoneSkills()), _toConsumableArray(options.allowLimitedBuffs ? [] : dailyLimitedSkills())));
  var blockedItems = new Set([].concat(_toConsumableArray(outOfSeasonItems()), _toConsumableArray(UNWANTED_ITEMS)));
  return {
    blockedSkills,
    blockedItems
  };
}

/**
 * Song slots free right now, less any another target has claimed.
 *
 * libram reads all of this from game data: which effects are songs, and a limit
 * that accounts for Four Songs and Additional Song rather than just Mariachi
 * Memory. The list of songs we used to keep here went stale every time KoL
 * added one.
 */
function freeSongSlots() {
  var reserved = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return Math.max(0, getSongLimit() - getSongCount() - reserved);
}

/** Effect -> the group it belongs to, so the planner can look one up directly. */
var EXCLUSION_GROUPS = indexExclusionGroups();
function indexExclusionGroups() {
  var index = new Map();
  for (var _i = 0, _MUTUAL_EXCLUSION_SET = MUTUAL_EXCLUSION_SETS; _i < _MUTUAL_EXCLUSION_SET.length; _i++) {
    var members = _MUTUAL_EXCLUSION_SET[_i];
    var group = {
      id: "exclusion:".concat(members[0]),
      members
    };
    var _iterator = _createForOfIteratorHelper(members),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var effect = _step.value;
        index.set(effect, group);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  return index;
}

/**
 * A stable id shared by every effect that competes for the same slot, or
 * `undefined` for an effect that clashes with nothing. The planner treats a
 * group as "pick at most one" rather than locking in whichever came first.
 */
function exclusionGroupId(effect) {
  var _EXCLUSION_GROUPS$get;
  return (_EXCLUSION_GROUPS$get = EXCLUSION_GROUPS.get(effect)) === null || _EXCLUSION_GROUPS$get === void 0 ? void 0 : _EXCLUSION_GROUPS$get.id;
}

/**
 * The sibling already up in this effect's group, if any.
 *
 * Gaining the effect would overwrite that sibling, so the planner prices the
 * swap at the difference rather than writing the whole group off.
 */
function activeExclusionSibling(effect) {
  var group = EXCLUSION_GROUPS.get(effect);
  if (!group) return undefined;
  return group.members.find(member => member !== effect && kolmafia.haveEffect(member) > 0);
}

/** Turtle tamer blessings bounce each other, so never recast over an active one. */
function isBlessing(skill) {
  return BLESSINGS.has(skill);
}
function anyDisdainActive() {
  return DISDAINS.some(effect => kolmafia.haveEffect(effect) > 0);
}

/**
 * The buffing problem, stated honestly: choose a set of effects that moves a
 * modifier at least `need` points, as cheaply as possible. That is a minimum-cost
 * covering knapsack, and this module solves it over plain numbers.
 *
 * Deliberately free of `kolmafia` imports — `plan.ts` translates game state into
 * `Candidate`s first. That seam is what makes the algorithm unit-testable.
 */

/** Progress and cost are compared with a tolerance; they are sums of floats. */
var EPSILON = 1e-9;

/** Cells along the DP's progress axis. Sets the resolution, and the cost. */
var DEFAULT_MAX_CELLS = 1500;

/** Times to halve the quantum when every candidate rounds away to nothing. */
var QUANTUM_RETRIES = 3;

/**
 * Cells below the goal to reconstruct and re-check on exact floats. Gains are
 * rounded down, so the shortfall of a set scored just under the goal is at most
 * one quantum per effect chosen — far inside this window.
 */
var RECONSTRUCT_SCAN = 64;

/** A way to move the modifier, already costed and sign-normalised. */

/** A `SolveRequest` with defaults filled in and unusable candidates removed. */

function capacityOf(capacities, slot) {
  var value = capacities[slot];
  return value === undefined ? Infinity : value;
}

/**
 * Drop group members that another member of the same group beats on both axes.
 *
 * Only sound *within* an exclusion group, where at most one member is ever
 * chosen. Globally it would be wrong: with `need = 10`, A (progress 6, cost 1)
 * beats B (progress 5, cost 1) on both axes, yet the only solution is A *and* B.
 */
function pruneDominated(candidates) {
  var byGroup = new Map();
  var _iterator = _createForOfIteratorHelper(candidates),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var candidate = _step.value;
      if (candidate.group === undefined) continue;
      var members = byGroup.get(candidate.group);
      if (members) members.push(candidate);else byGroup.set(candidate.group, [candidate]);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var dropped = new Set();
  var _iterator2 = _createForOfIteratorHelper(byGroup.values()),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _members = _step2.value;
      // Cheapest first, so every earlier member costs no more than the current one;
      // it therefore dominates unless the current one makes strictly more progress.
      var ordered = _members.slice().sort((a, b) => a.cost - b.cost || b.progress - a.progress);
      var bestProgress = -Infinity;
      var _iterator3 = _createForOfIteratorHelper(ordered),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var member = _step3.value;
          if (member.progress > bestProgress + EPSILON) bestProgress = member.progress;else dropped.add(member);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return dropped.size === 0 ? candidates : candidates.filter(c => !dropped.has(c));
}

/** Normalise a request: drop what we can't use, and collapse duplicate ids. */
function prepareCandidates(request) {
  var slotCapacity = request.slotCapacity ?? {};
  var budget = Math.max(0, request.budget);

  // Cheapest wins for a repeated id; ties go to the larger gain.
  var byId = new Map();
  var _iterator4 = _createForOfIteratorHelper(request.candidates),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var candidate = _step4.value;
      var progress = candidate.progress,
        cost = candidate.cost;
      if (!isFinite(progress) || progress <= 0) continue;
      if (!isFinite(cost) || cost < 0) continue;
      var existing = byId.get(candidate.id);
      if (!existing || cost < existing.cost || cost === existing.cost && progress > existing.progress) {
        byId.set(candidate.id, candidate);
      }
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  var budgetBound = false;
  var affordable = [];
  var _iterator5 = _createForOfIteratorHelper(byId.values()),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var _candidate = _step5.value;
      // A slot class with no free slots rules its members out entirely.
      if (_candidate.slot !== undefined && capacityOf(slotCapacity, _candidate.slot) < 1) continue;
      if (_candidate.cost > budget) budgetBound = true;else affordable.push(_candidate);
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
  return {
    candidates: pruneDominated(affordable),
    need: request.need,
    budget,
    slotCapacity,
    budgetBound
  };
}
function unsatisfiedReason(prepared, priceBlocked) {
  if (prepared.budgetBound || priceBlocked) return "budget-capped";
  if (prepared.candidates.length === 0) return "empty";
  return "unreachable";
}

/**
 * The capacity-limited class the DP has to track, if any.
 *
 * A class only earns an axis when more candidates compete for it than there are
 * slots; songs affecting any one modifier rarely fill the rack, so this usually
 * costs nothing. Only one class is tracked, because KoL has only one — accordion
 * songs. A second *binding* class would go unconstrained.
 */

function bindingSlot(candidates, capacities) {
  var counts = new Map();
  var _iterator6 = _createForOfIteratorHelper(candidates),
    _step6;
  try {
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      var candidate = _step6.value;
      if (candidate.slot === undefined) continue;
      counts.set(candidate.slot, (counts.get(candidate.slot) ?? 0) + 1);
    }
  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }
  var _iterator7 = _createForOfIteratorHelper(counts),
    _step7;
  try {
    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
      var _step7$value = _slicedToArray(_step7.value, 2),
        slot = _step7$value[0],
        count = _step7$value[1];
      var capacity = capacityOf(capacities, slot);
      if (isFinite(capacity) && count > capacity) return {
        slot,
        capacity
      };
    }
  } catch (err) {
    _iterator7.e(err);
  } finally {
    _iterator7.f();
  }
  return null;
}

/** The most progress any valid selection could make, respecting the constraints. */
function achievableProgress(candidates, axis) {
  var groupBest = new Map();
  var slotted = [];
  var total = 0;
  var _iterator8 = _createForOfIteratorHelper(candidates),
    _step8;
  try {
    for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
      var candidate = _step8.value;
      if (candidate.group !== undefined) {
        var current = groupBest.get(candidate.group) ?? 0;
        if (candidate.progress > current) groupBest.set(candidate.group, candidate.progress);
      } else if (axis && candidate.slot === axis.slot) {
        slotted.push(candidate.progress);
      } else {
        total += candidate.progress;
      }
    }
  } catch (err) {
    _iterator8.e(err);
  } finally {
    _iterator8.f();
  }
  var _iterator9 = _createForOfIteratorHelper(groupBest.values()),
    _step9;
  try {
    for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
      var best = _step9.value;
      total += best;
    }
  } catch (err) {
    _iterator9.e(err);
  } finally {
    _iterator9.f();
  }
  if (axis) {
    slotted.sort((a, b) => b - a);
    for (var i = 0; i < Math.min(axis.capacity, slotted.length); i++) total += slotted[i];
  }
  return total;
}

/**
 * Candidates in DP layer order: ungrouped first, then each exclusion group's
 * members contiguously so a group can be skipped in one jump.
 */
function layerOrder(candidates) {
  var items = [];
  var groups = new Map();
  var _iterator0 = _createForOfIteratorHelper(candidates),
    _step0;
  try {
    for (_iterator0.s(); !(_step0 = _iterator0.n()).done;) {
      var candidate = _step0.value;
      if (candidate.group === undefined) {
        items.push(candidate);
        continue;
      }
      var members = groups.get(candidate.group);
      if (members) members.push(candidate);else groups.set(candidate.group, [candidate]);
    }

    // -1 for a layer that stands alone, otherwise the first layer of its group.
  } catch (err) {
    _iterator0.e(err);
  } finally {
    _iterator0.f();
  }
  var groupStart = [];
  for (var i = 0; i < items.length; i++) groupStart.push(-1);
  var _iterator1 = _createForOfIteratorHelper(groups.values()),
    _step1;
  try {
    for (_iterator1.s(); !(_step1 = _iterator1.n()).done;) {
      var _members2 = _step1.value;
      var start = items.length;
      var _iterator10 = _createForOfIteratorHelper(_members2),
        _step10;
      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var member = _step10.value;
          items.push(member);
          groupStart.push(start);
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }
    }
  } catch (err) {
    _iterator1.e(err);
  } finally {
    _iterator1.f();
  }
  return {
    items,
    groupStart
  };
}

/**
 * Exact minimum-cost cover by dynamic programming.
 *
 * `best[j]` is the least cost to move the modifier at least `j` quantised
 * points, so **one table answers both usage modes**: "reach X" reads the top
 * cell, and "spend up to N meat" reads the highest cell still within budget.
 *
 * The table is bounded by what is physically achievable rather than by the
 * goal, so an open-ended goal — `need` of `Infinity` — costs no more than a
 * modest one.
 */
function solve(request) {
  var prepared = prepareCandidates(request);
  var candidates = prepared.candidates,
    need = prepared.need,
    budget = prepared.budget;
  if (need <= EPSILON || candidates.length === 0) {
    return {
      chosen: [],
      cost: 0,
      progress: 0,
      satisfied: need <= EPSILON,
      reason: need <= EPSILON ? "solved" : unsatisfiedReason(prepared, false),
      stats: {
        candidates: candidates.length,
        cells: 0,
        quantum: 0
      }
    };
  }
  var maxCells = Math.max(1, Math.floor(request.maxCells ?? DEFAULT_MAX_CELLS));
  var axis = bindingSlot(candidates, prepared.slotCapacity);
  var states = axis ? axis.capacity + 1 : 1;
  var rawCap = Math.min(need, achievableProgress(candidates, axis));
  var _layerOrder = layerOrder(candidates),
    items = _layerOrder.items,
    groupStart = _layerOrder.groupStart;

  // Round gains DOWN and the goal UP, so a plan the table believes covers the
  // goal really does; the residual re-plan mops up the rounding.
  var quantum = rawCap / maxCells;
  var cells = 0;
  var steps = [];
  for (var attempt = 0;; attempt++) {
    cells = Math.max(1, Math.ceil(rawCap / quantum));
    steps = items.map(item => Math.min(cells, Math.floor(item.progress / quantum)));
    if (steps.some(step => step > 0) || attempt >= QUANTUM_RETRIES) break;
    quantum /= 2;
  }

  // `best[state * width + j]`: least cost to move `j` quantised points having
  // used `state` of the limited slots. Slot state 0 is the start.
  var width = cells + 1;
  var best = [];
  for (var i = 0; i < states * width; i++) best.push(Infinity);
  best[0] = 0;

  // 1 for a layer that consumes a slot, 0 otherwise.
  var slotStep = items.map(item => axis && item.slot === axis.slot ? 1 : 0);
  var words = Math.ceil(states * width / 32);
  var used = [];
  for (var _i = 0; _i < items.length * words; _i++) used.push(0);
  var mark = (layer, at) => {
    used[layer * words + (at >> 5)] |= 1 << (at & 31);
  };
  var marked = (layer, at) => (used[layer * words + (at >> 5)] & 1 << (at & 31)) !== 0;

  // Descending `j` reads only cells this layer hasn't written, giving 0/1
  // semantics; descending slot state does the same across the slot axis. Group
  // members all read a snapshot from before the group, so at most one of them
  // can appear in any chain.
  var groupSnapshot = null;
  for (var layer = 0; layer < items.length; layer++) {
    // Snapshot before the skip: a group whose first member rounds away to
    // nothing must still get its own snapshot for the members that follow.
    var start = groupStart[layer];
    if (start === -1) groupSnapshot = null;else if (start === layer) groupSnapshot = best.slice();
    var step = steps[layer];
    if (step <= 0) continue;
    var weight = items[layer].cost;
    var source = groupSnapshot ?? best;
    var takesSlot = slotStep[layer];
    for (var state = states - 1; state >= 0; state--) {
      // Taking this item uses a slot, so there has to be one spare.
      if (takesSlot > 0 && axis && state >= axis.capacity) continue;
      var from = state * width;
      var to = (state + takesSlot) * width;
      for (var j = cells; j >= 1; j--) {
        var previous = source[from + (j - step > 0 ? j - step : 0)];
        var candidate = previous + weight;
        if (candidate < best[to + j] - EPSILON) {
          best[to + j] = candidate;
          mark(layer, to + j);
        }
      }
    }
  }
  var reconstruct = (targetCell, targetState) => {
    var picked = [];
    var cell = targetCell;
    var state = targetState;
    for (var _layer = items.length - 1; _layer >= 0 && cell > 0; _layer--) {
      if (!marked(_layer, state * width + cell)) continue;
      picked.push(items[_layer]);
      var _step11 = steps[_layer];
      cell = cell - _step11 > 0 ? cell - _step11 : 0;
      state -= slotStep[_layer];
      // A group member's predecessor is the state from before the whole group.
      if (groupStart[_layer] !== -1) _layer = groupStart[_layer];
    }
    return picked.reverse();
  };
  var totals = set => {
    var cost = 0;
    var progress = 0;
    var _iterator11 = _createForOfIteratorHelper(set),
      _step12;
    try {
      for (_iterator11.s(); !(_step12 = _iterator11.n()).done;) {
        var item = _step12.value;
        cost += item.cost;
        progress += item.progress;
      }
    } catch (err) {
      _iterator11.e(err);
    } finally {
      _iterator11.f();
    }
    return {
      cost,
      progress
    };
  };

  // Rounding gains down means the top cell over-covers: a set the table scores
  // just short of the goal usually clears it on the exact floats, for less meat.
  // The shortfall is at most one quantum per chosen effect, so a short scan down
  // from the top finds it.
  var chosen = [];
  var cheapest = Infinity;
  var scanFloor = Math.max(0, cells - RECONSTRUCT_SCAN);
  for (var _j = cells; _j >= scanFloor; _j--) {
    for (var _state = 0; _state < states; _state++) {
      var _weight = best[_state * width + _j];
      if (!isFinite(_weight) || _weight > budget + EPSILON || _weight >= cheapest) continue;
      var set = reconstruct(_j, _state);
      var _totals = totals(set),
        _cost = _totals.cost,
        _progress = _totals.progress;
      if (_progress + EPSILON < need || _cost > budget + EPSILON) continue;
      chosen = set;
      cheapest = _weight;
    }
  }

  // Nothing covers the goal, so fall back to the most progress the budget buys.
  if (cheapest === Infinity) {
    for (var _j2 = cells; _j2 >= 1 && chosen.length === 0; _j2--) {
      for (var _state2 = 0; _state2 < states; _state2++) {
        var _weight2 = best[_state2 * width + _j2];
        // An unreachable cell is `Infinity`, which an unlimited budget would
        // otherwise happily "afford".
        if (!isFinite(_weight2) || _weight2 > budget + EPSILON) continue;
        chosen = reconstruct(_j2, _state2);
        break;
      }
    }
  }
  var _totals2 = totals(chosen),
    cost = _totals2.cost,
    progress = _totals2.progress;
  var satisfied = progress + EPSILON >= need;
  var stats = {
    candidates: candidates.length,
    cells,
    quantum
  };
  if (satisfied) {
    return {
      chosen,
      cost,
      progress,
      satisfied: true,
      reason: "solved",
      stats
    };
  }

  // Short of the goal: say whether more meat would have helped.
  var topWeight = Infinity;
  for (var _state3 = 0; _state3 < states; _state3++) {
    topWeight = Math.min(topWeight, best[_state3 * width + cells]);
  }
  var priceBlocked = isFinite(topWeight) && topWeight > budget + EPSILON;
  return {
    chosen,
    cost,
    progress,
    satisfied: false,
    reason: unsatisfiedReason(prepared, priceBlocked),
    stats
  };
}

var _templateObject$1, _templateObject2$1, _templateObject3$1, _templateObject4$1, _templateObject5$1, _templateObject6$1, _templateObject7$1, _templateObject8$1, _templateObject9$1, _templateObject0, _templateObject1, _templateObject10, _templateObject11;

/** Cap on uses of one source in a single step, inherited from the ASH version. */
var MAX_USES = 10;

/**
 * The most we will pay for one copy of anything.
 *
 * mafia's own auto-buy ceiling, so the limit is whatever the user already told
 * mafia rather than a number this script invented. `buy` with an explicit price
 * bypasses the setting, so we have to apply it ourselves. Zero means no limit,
 * matching how mafia reads it.
 */
function priceCeiling() {
  var limit = get("autoBuyPriceLimit", 20000);
  return limit > 0 ? limit : Infinity;
}
var HOLO_RECORDS = new Set($items(_templateObject$1 || (_templateObject$1 = _taggedTemplateLiteral(["Shrieking Weasel holo-record, Power-Guy 2000 holo-record, Lucky Strikes holo-record, EMD holo-record, Superdrifter holo-record, The Pigs holo-record, Drunk Uncles holo-record"]))));
/** A single way to gain an effect: either an item to use or a skill to cast. */
var Source = /*#__PURE__*/function () {
  function Source(effect, turnsPerUse) {
    _classCallCheck(this, Source);
    this.effect = effect;
    this.turnsPerUse = turnsPerUse;
  }
  return _createClass(Source, [{
    key: "warmPrice",
    value: function warmPrice(_canAccessMall) {
      // Only items have a mall price worth pre-fetching.
    }

    /** Uses needed to hold the effect for `minTurns`, given `active` turns already up. */
  }, {
    key: "usesFor",
    value: function usesFor(minTurns, active) {
      return clamp(Math.ceil((minTurns - active) / Math.max(1, this.turnsPerUse)), 1, MAX_USES);
    }

    /**
     * What it really costs to hold this effect for the whole requirement. The old
     * scoring priced a single use and then bought several, so a short potion
     * looked far cheaper than it was.
     */
  }, {
    key: "costFor",
    value: function costFor(minTurns, active) {
      return this.baseCost * this.usesFor(minTurns, active);
    }
  }, {
    key: "meatPerAdventure",
    value: function meatPerAdventure() {
      return this.baseCost / this.turnsPerUse;
    }
  }]);
}();
var ItemSource = /*#__PURE__*/function (_Source) {
  function ItemSource(effect, item) {
    var _this;
    _classCallCheck(this, ItemSource);
    _this = _callSuper(this, ItemSource, [effect, kolmafia.numericModifier(item, "Effect Duration")]);
    _this.item = item;
    return _this;
  }
  _inherits(ItemSource, _Source);
  return _createClass(ItemSource, [{
    key: "description",
    get: function get() {
      return "Item ".concat(this.item, ": ").concat(this.turnsPerUse, " turns of ").concat(this.effect);
    }
  }, {
    key: "key",
    get: function get() {
      return this.item;
    }
  }, {
    key: "baseCost",
    get: function get() {
      if (this.item.reusable && kolmafia.availableAmount(this.item) > 0) return 0;
      var cost = 0;
      if (this.item.tradeable) {
        var price = kolmafia.historicalPrice(this.item);
        cost += price <= 0 ? 999999999 : price;
      } else {
        cost += 100000;
      }
      return cost;
    }
  }, {
    key: "warmPrice",
    value: function warmPrice(canAccessMall) {
      if (this.item.tradeable && canAccessMall) kolmafia.mallPrice(this.item);
    }
  }, {
    key: "feasible",
    value: function feasible(_options, canAccessMall) {
      var owned = kolmafia.availableAmount(this.item);
      if (!this.item.tradeable && owned === 0) return false;
      if (owned === 0 && !canAccessMall) return false;
      if (owned === 0 && this.item.tradeable && kolmafia.historicalPrice(this.item) > priceCeiling()) {
        return false;
      }
      if (!this.item.tradeable && !this.item.reusable) return false;
      if (this.item.reusable && this.item.dailyusesleft === 0) return false;
      return true;
    }
  }, {
    key: "plan",
    value: function plan(options, state, canAccessMall) {
      var uses = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var meatCap = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : Infinity;
      // Only the copies we don't already have need buying — and a reusable item
      // serves every use from the one copy, so buying `uses` of it would be meat
      // spent on nothing (and meat the solver scored at zero, since `baseCost`
      // treats an owned reusable as free).
      var owned = kolmafia.availableAmount(this.item);
      var needed = this.item.reusable ? 1 : uses;
      var toBuy = Math.max(0, needed - owned);
      var unitPrice = 0;
      var wish = false;
      var meatCost = 0;
      if (toBuy > 0) {
        if (!this.item.tradeable || !canAccessMall) return null;

        // `retrievePrice` walks the listings, so this is what the whole batch
        // really costs rather than the cheapest listing multiplied out. The
        // ceiling for `buy` is then the price of the last copy in the batch.
        meatCost = kolmafia.retrievePrice(this.item, owned + toBuy) - kolmafia.retrievePrice(this.item, owned);
        unitPrice = toBuy > 1 ? meatCost - (kolmafia.retrievePrice(this.item, owned + toBuy - 1) - kolmafia.retrievePrice(this.item, owned)) : meatCost;
        var wishPrice = kolmafia.mallPrice($item(_templateObject2$1 || (_templateObject2$1 = _taggedTemplateLiteral(["pocket wish"]))));
        if (unitPrice >= 50000 && unitPrice >= wishPrice) {
          wish = true;
          unitPrice = wishPrice;
          meatCost = wishPrice * toBuy;
        }
        if (unitPrice > priceCeiling()) return null;
        // The goal's own slice as well as the run-wide limit, so a per-goal rail
        // still bites in a mode whose solver budget is denominated in something else.
        if (state.meatSpent + meatCost > Math.min(meatCap, options.maxMeatToSpend)) return null;
      }
      if (!this.item.tradeable && !this.item.reusable) return null;
      if (this.item.reusable && this.item.dailyusesleft === 0) return null;
      return {
        meatCost,
        unitPrice,
        toBuy,
        wish
      };
    }

    /**
     * Buy what we're short of, then use what we have.
     *
     * `mallPrice` is the cheapest listing, but listings ladder upwards, so asking
     * for several copies can cost more per copy than that suggests. Capping `buy`
     * at the price we planned for means a steep ladder gets us fewer copies rather
     * than a bigger bill — the next plan sees the shortfall and decides again.
     */
  }, {
    key: "apply",
    value: function apply(amount, plan) {
      var spent = 0;
      if (plan.toBuy > 0 && plan.unitPrice > 0) {
        var bought = kolmafia.buy(plan.toBuy, this.item, plan.unitPrice);
        // Getting the whole batch costs what `plan` priced it at. Falling short
        // means the ladder moved, and the last-copy ceiling is the best bound left.
        spent = bought === plan.toBuy ? plan.meatCost : bought * plan.unitPrice;
      }
      var usable = Math.min(amount, kolmafia.availableAmount(this.item));
      if (usable <= 0) return spent;

      // With the mall shut off, `use` cannot quietly top up what `buy` declined to
      // overpay for; it can only spend what we already hold.
      withProperty("autoSatisfyWithMall", false, () => {
        // Using more than one d12 at a time skips the effect, so pace them out.
        if (this.item === $item(_templateObject3$1 || (_templateObject3$1 = _taggedTemplateLiteral(["d12"])))) {
          for (var i = 0; i < usable; i++) kolmafia.use(1, this.item);
        } else {
          kolmafia.use(usable, this.item);
        }
      });
      return spent;
    }
  }]);
}(Source);
var SkillSource = /*#__PURE__*/function (_Source2) {
  function SkillSource(effect, skill) {
    var _this2;
    _classCallCheck(this, SkillSource);
    _this2 = _callSuper(this, SkillSource, [effect, kolmafia.turnsPerCast(skill)]);
    _this2.skill = skill;
    return _this2;
  }
  _inherits(SkillSource, _Source2);
  return _createClass(SkillSource, [{
    key: "description",
    get: function get() {
      return "Skill ".concat(this.skill, ": ").concat(this.turnsPerUse, " turns of ").concat(this.effect);
    }
  }, {
    key: "key",
    get: function get() {
      return this.skill;
    }
  }, {
    key: "baseCost",
    get: function get() {
      return kolmafia.mpCost(this.skill) * 2;
    }

    // A skill costs no meat, so there is nothing extra for `plan` to check.
  }, {
    key: "feasible",
    value: function feasible(_options, _canAccessMall) {
      if (!have(this.skill) || !kolmafia.isUnrestricted(this.skill)) return false;
      if (kolmafia.advCost(this.skill) > 0) return false;
      if (kolmafia.mpCost(this.skill) > kolmafia.myMaxmp()) return false;
      if (kolmafia.hpCost(this.skill) >= kolmafia.myHp()) return false;
      if (kolmafia.soulsauceCost(this.skill) > kolmafia.mySoulsauce()) return false;
      if (RICHIE_SONGS.has(this.skill) && (kolmafia.myClass() !== $class(_templateObject4$1 || (_templateObject4$1 = _taggedTemplateLiteral(["Accordion Thief"]))) || kolmafia.myLevel() < 15)) {
        return false;
      }

      // Don't recast a blessing while a rival blessing is active — they bounce.
      if (isBlessing(this.skill) && kolmafia.myClass() !== $class(_templateObject5$1 || (_templateObject5$1 = _taggedTemplateLiteral(["Turtle Tamer"]))) && anyDisdainActive()) {
        return false;
      }
      return !(CHEAT_CODES.has(this.skill) && kolmafia.availableAmount($item(_templateObject6$1 || (_templateObject6$1 = _taggedTemplateLiteral(["Powerful Glove"])))) === 0);
    }
  }, {
    key: "plan",
    value: function plan(options, _state, canAccessMall) {
      return this.feasible(options, canAccessMall) ? {
        meatCost: 0,
        unitPrice: 0,
        toBuy: 0,
        wish: false
      } : null;
    }

    /** How many casts our HP and soulsauce pools allow right now (capped at 10). */
  }, {
    key: "affordableCasts",
    get: function get() {
      var limit = (cost, pool) => cost > 0 ? Math.max(1, Math.floor((pool - 1) / cost)) : 10;
      return Math.min(10, limit(kolmafia.hpCost(this.skill), kolmafia.myHp()), limit(kolmafia.soulsauceCost(this.skill), kolmafia.mySoulsauce()));
    }
  }, {
    key: "apply",
    value: function apply(amount) {
      var needGlove = CHEAT_CODES.has(this.skill) && !kolmafia.haveEquipped($item(_templateObject7$1 || (_templateObject7$1 = _taggedTemplateLiteral(["Powerful Glove"]))));
      var saved = needGlove ? kolmafia.equippedItem($slot(_templateObject8$1 || (_templateObject8$1 = _taggedTemplateLiteral(["acc1"])))) : null;
      if (needGlove) kolmafia.equip($slot(_templateObject9$1 || (_templateObject9$1 = _taggedTemplateLiteral(["acc1"]))), $item(_templateObject0 || (_templateObject0 = _taggedTemplateLiteral(["Powerful Glove"]))));
      kolmafia.useSkill(Math.min(this.affordableCasts, amount), this.skill);
      if (saved && saved !== $item(_templateObject1 || (_templateObject1 = _taggedTemplateLiteral(["none"])))) kolmafia.equip($slot(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["acc1"]))), saved);
      return 0;
    }
  }]);
}(Source);
/** Path- and progress-dependent state that decides which sources are even candidates. */
function hasG(name) {
  return name.toLowerCase().includes("g");
}
function isCandidateItem(item, effect, ctx) {
  // In ronin we can only use what we own or can craft without spending a turn.
  if (ctx.inRonin && kolmafia.availableAmount(item) + kolmafia.creatableAmount(item) === 0) {
    return false;
  }
  if (ctx.inRonin && kolmafia.availableAmount(item) === 0 && kolmafia.creatableAmount(item) !== 0 && kolmafia.craftType(item).includes("Cooking (fancy)")) {
    return false;
  }
  if (ctx.blockedItems.has(item)) return false;
  if (HOLO_RECORDS.has(item) && !ctx.inNuclearAutumn) return false;
  if (item.fullness > 0 || item.inebriety > 0 || item.spleen > 0) return false;
  // G-Lover may only touch items and effects whose names contain a "g".
  if (ctx.inGLover && (!hasG(item.name) || !hasG(effect.name))) return false;
  return true;
}
function isCandidateSkill(skill, ctx) {
  if (ctx.blockedSkills.has(skill)) return false;
  return !ctx.inGLover || hasG(skill.name);
}

/** Every item/skill that pushes `target`'s modifier in the desired direction. */
function sourcesFor(target, options, restrictions) {
  var path = kolmafia.myPath().name;
  var context = {
    inGLover: path === "G-Lover",
    inNuclearAutumn: path === "Nuclear Autumn",
    inRonin: !kolmafia.canInteract(),
    blockedItems: restrictions.blockedItems,
    blockedSkills: restrictions.blockedSkills
  };
  var sources = [];
  for (var _i = 0, _effectsFor = effectsFor(target, options); _i < _effectsFor.length; _i++) {
    var _effect = _effectsFor[_i];
    for (var _i2 = 0, _itemsGranting = itemsGranting(_effect); _i2 < _itemsGranting.length; _i2++) {
      var _item = _itemsGranting[_i2];
      if (isCandidateItem(_item, _effect, context)) {
        sources.push(new ItemSource(_effect, _item));
      }
    }
    for (var _i3 = 0, _skillsGranting = skillsGranting(_effect); _i3 < _skillsGranting.length; _i3++) {
      var _skill = _skillsGranting[_i3];
      if (isCandidateSkill(_skill, context)) {
        sources.push(new SkillSource(_effect, _skill));
      }
    }
  }
  return sources;
}
var effectIndex = new Map();

/**
 * Every effect that pushes `modifier` the wanted way, memoised for the session.
 *
 * Scanning `Effect.all()` costs a native call per effect, and we re-plan several
 * times per target — `all res` alone asks five times. Which *way* an effect
 * moves a modifier doesn't change as we buff, even where percentages are folded
 * onto a live base stat, so only the membership is cached; `plan.ts` reads the
 * amounts fresh each time.
 */
function effectsFor(target, options) {
  var wantPositive = directionOf(target) > 0;
  var modifier = target.modifier;
  var key = "".concat(modifier, "|").concat(wantPositive, "|").concat(options.ignorePercentages);
  var cached = effectIndex.get(key);
  if (!cached) {
    cached = kolmafia.Effect.all().filter(effect => {
      var value = effectiveModifier(effect, modifier, options);
      return wantPositive ? value > 0 : value < 0;
    });
    effectIndex.set(key, cached);
  }
  return cached;
}
var itemIndex = null;
var skillIndex = null;
function itemsGranting(effect) {
  itemIndex ?? (itemIndex = indexByEffect(kolmafia.Item.all(), item => kolmafia.effectModifier(item, "Effect")));
  return itemIndex.get(effect) ?? [];
}
function skillsGranting(effect) {
  skillIndex ?? (skillIndex = indexByEffect(kolmafia.Skill.all(), skill => kolmafia.toEffect(skill)));
  return skillIndex.get(effect) ?? [];
}

/** Group things by the effect they grant, skipping those that grant nothing. */
function indexByEffect(things, grantedBy) {
  var index = new Map();
  var _iterator = _createForOfIteratorHelper(things),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var thing = _step.value;
      var _effect2 = grantedBy(thing);
      if (_effect2 === $effect(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["none"])))) continue;
      var list = index.get(_effect2);
      if (list) list.push(thing);else index.set(_effect2, [thing]);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return index;
}

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9;

/** The one slot class KoL limits: accordion songs share a rack of 3 or 4. */
var SONG_SLOT = "song";

/** Live value of a modifier, reading buffed stats where mafia has no plain modifier. */
function currentValue(modifier) {
  switch (modifier) {
    case $modifier(_templateObject || (_templateObject = _taggedTemplateLiteral(["Muscle"]))):
      return kolmafia.myBuffedstat($stat(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["Muscle"]))));
    case $modifier(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["Mysticality"]))):
      return kolmafia.myBuffedstat($stat(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["Mysticality"]))));
    case $modifier(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["Moxie"]))):
      return kolmafia.myBuffedstat($stat(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["Moxie"]))));
    case $modifier(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["Maximum MP"]))):
      return kolmafia.myMaxmp();
    case $modifier(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["Maximum HP"]))):
      return kolmafia.myMaxhp();
    case $modifier(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["Familiar Weight"]))):
      // libram folds in soup weight, Fidoxene's floor and a feasted familiar,
      // none of which `familiarWeight` alone reports.
      return totalFamiliarWeight();
    default:
      return kolmafia.numericModifier(modifier);
  }
}

/**
 * How far the modifier still has to move, as a positive number. Zero or less
 * means the target is met.
 *
 * Flipping the sign here is what lets one solver serve `400 initiative` and
 * `-combat` alike: past this point everything is "more is better".
 *
 * An open-ended goal is genuinely infinite demand. The solver caps its table at
 * what is actually achievable, so this asks for everything and gets back the
 * most the budget will buy — no arbitrary stand-in number required.
 */
function needFor(target) {
  if (target.value === null) return Infinity;
  return directionOf(target) * (target.value - currentValue(target.modifier));
}

/**
 * What a plan is denominated in.
 *
 * `meat` is the total to hold every chosen effect for `minTurns`, bounded by
 * `totalmeat`. `meat-per-adventure` is what `meatperadventure` asks for: a
 * limit on the summed price per adventure of effect. Each is a plain budget in
 * its own currency, so the solver handles either without a second dimension —
 * but only one at a time, which is why `meatperadventure` picks the currency.
 */

function costModeFor(target) {
  return target.meatPerAdventureLimit > 0 ? "meat-per-adventure" : "meat";
}

/** What this target may spend, in whatever currency it is planning in. */
function budgetFor(target, options, state) {
  if (costModeFor(target) === "meat-per-adventure") {
    return Math.max(0, target.meatPerAdventureLimit - state.meatPerAdventureSpent);
  }
  return Math.max(0, Math.min(target.meatCap, options.maxMeatToSpend) - state.meatSpent);
}
/** How much an effect moves this target's modifier, in the wanted direction. */
function contributionToward(effect, target, options) {
  return directionOf(target) * effectiveModifier(effect, target.modifier, options);
}

/** What a source costs this target, in the currency the target is planning in. */
function priceOf(source, context, active) {
  if (context.freeEffects.has(source.effect)) return 0;
  return costModeFor(context.target) === "meat-per-adventure" ? source.meatPerAdventure() : source.costFor(context.target.minTurns, active);
}

/** The sources for one effect, cheapest first, with the winner's price. */
function rankByPrice(sources, context, active) {
  // Decorate-sort-undecorate: `priceOf` reaches into mafia, so pay for it once
  // per source rather than twice per comparison.
  var priced = sources.map(source => ({
    source,
    price: priceOf(source, context, active)
  }));
  priced.sort((a, b) => a.price - b.price);
  return {
    sources: priced.map(entry => entry.source),
    price: priced.length > 0 ? priced[0].price : Infinity
  };
}

/**
 * Meat per point of modifier per turn of effect — the number behind `X
 * efficiency`.
 *
 * Kept on roughly its historical scale, because users have memorised values, but
 * without the remaining-need clamp, which compared against the wrong reading of
 * the modifier and never bit.
 */
function efficiencyOf(source, target, progress) {
  var gained = progress * Math.min(target.reasonableTurns, source.turnsPerUse);
  return gained > 0 ? source.baseCost / gained : Infinity;
}

/** Whether `X efficiency` rules this source out. */
function tooInefficient(source, target, progress) {
  if (target.maxEfficiency === null || source.baseCost <= 0) return false;
  return efficiencyOf(source, target, progress) > target.maxEfficiency;
}

/** What the modifier owes to effects that are up but expire before `minTurns`. */
function shortfallFor(target, options) {
  var total = 0;
  var _iterator = _createForOfIteratorHelper(effectsFor(target, options)),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var effect = _step.value;
      var turns = kolmafia.haveEffect(effect);
      if (turns <= 0 || turns >= target.minTurns) continue;
      var contribution = contributionToward(effect, target, options);
      if (contribution > 0) total += contribution;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return total;
}

/** Sources still worth costing, grouped by the effect they grant. */
function usableByEffect(sources, context) {
  var byEffect = new Map();
  var _iterator2 = _createForOfIteratorHelper(sources),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var source = _step2.value;
      if (FIXED_BLOCKED_EFFECTS.has(source.effect)) continue;
      if (context.done.has(source.effect)) continue;
      if (context.state.blockedSources.has(source.key)) continue;
      if (kolmafia.haveEffect(source.effect) >= context.target.minTurns) continue;
      if (!source.feasible(context.options, context.canAccessMall)) continue;
      var existing = byEffect.get(source.effect);
      if (existing) existing.push(source);else byEffect.set(source.effect, [source]);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return byEffect;
}

/**
 * Turn every way of gaining an effect into at most one costed `Candidate`.
 *
 * Sources granting the same effect are interchangeable as far as the modifier
 * is concerned, so the cheapest sets the candidate's price; the rest stay in
 * order as fallbacks for when a source silently grants nothing.
 *
 * Costs start from mafia's cached historical prices. Fetching a live mall price
 * is a server round trip, so only the most promising `prewarm` candidates get
 * one, and their costs are then recomputed.
 */
function buildCandidates(sources, context) {
  var prewarm = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var target = context.target,
    options = context.options;
  var build = {
    candidates: [],
    sourcesFor: new Map(),
    shortfall: shortfallFor(target, options)
  };
  var _iterator3 = _createForOfIteratorHelper(usableByEffect(sources, context)),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var _step3$value = _slicedToArray(_step3.value, 2),
        effect = _step3$value[0],
        granting = _step3$value[1];
      var active = kolmafia.haveEffect(effect);
      var gain = contributionToward(effect, target, options);

      // Gaining this overwrites any rival already up, so only the difference is
      // new — and if we are the ones relying on that rival, don't touch it. The
      // old code wrote the whole group off the moment one member landed; pricing
      // the swap instead means a better member can still displace a worse one.
      var rival = activeExclusionSibling(effect);
      if (rival && (context.freeEffects.has(rival) || context.done.has(rival))) continue;
      // Only a rival that outlasts the goal is really banked. One that expires
      // first is already counted in `shortfall`, and charging for it here too
      // would make displacing it look half as good as it is.
      var displaced = rival && kolmafia.haveEffect(rival) >= target.minTurns ? contributionToward(rival, target, options) : 0;
      var progress = gain - displaced;
      if (progress <= 0) continue;

      // Ranking is the expensive part, so it happens after the cheap rejections.
      var ranked = rankByPrice(granting, context, active);
      if (tooInefficient(ranked.sources[0], target, progress)) continue;
      build.candidates.push({
        id: effect.name,
        progress,
        cost: ranked.price,
        group: exclusionGroupId(effect),
        // Renewing a song that's already up takes no new slot, and `freeSongSlots`
        // has already discounted it from the rack. Claiming one anyway would make
        // a full rack block the very renewal that keeps it full.
        slot: isSong(effect) && active === 0 ? SONG_SLOT : undefined
      });
      build.sourcesFor.set(effect.name, ranked.sources);
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  if (prewarm > 0) refreshFrontRunners(build, context, prewarm);
  return build;
}

/** Look up live mall prices for the best-looking candidates and re-cost them. */
function refreshFrontRunners(build, context, count) {
  var front = build.candidates.slice().sort((a, b) => a.cost / a.progress - b.cost / b.progress).slice(0, count);
  var _iterator4 = _createForOfIteratorHelper(front),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var candidate = _step4.value;
      // Only the source we would actually reach for is worth a live lookup. A
      // fallback is consulted only when the primary silently grants nothing, and
      // pricing every one of them turns 20 round trips into hundreds.
      var sources = build.sourcesFor.get(candidate.id);
      if (sources && sources.length > 0) sources[0].warmPrice(context.canAccessMall);
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  var _iterator5 = _createForOfIteratorHelper(front),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var _candidate = _step5.value;
      var _sources = build.sourcesFor.get(_candidate.id);
      if (!_sources || _sources.length === 0) continue;
      var ranked = rankByPrice(_sources, context, kolmafia.haveEffect(_sources[0].effect));
      build.sourcesFor.set(_candidate.id, ranked.sources);
      _candidate.cost = ranked.price;
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
}

/** The question this target is asking the solver, given what we just costed. */
function solveRequestFor(build, context) {
  return {
    candidates: build.candidates,
    // Effects that expire before `minTurns` are in the reading but will not
    // last, so their contribution counts against us until something replaces it.
    need: needFor(context.target) + build.shortfall,
    budget: budgetFor(context.target, context.options, context.state),
    slotCapacity: {
      [SONG_SLOT]: context.freeSongSlots
    }
  };
}

/** What one target should assume the other targets are taking care of. */

/**
 * Work out which effects are worth buying because they serve several targets.
 *
 * Targets are executed one after another, so a later target already benefits
 * from whatever an earlier one put up. What that misses is the effect no single
 * target can justify but two together can — `400 init 20 familiar weight` may
 * share a potion neither would buy alone.
 *
 * Two rounds of coordinate descent: the first prices each effect at a fraction
 * of its cost according to how many targets it advances, which surfaces the
 * shared ones; the second re-solves at honest prices with the other targets'
 * picks free. It is a heuristic — a joint solve over every target at once is
 * combinatorial — but it is cheap and it finds the overlap.
 */
function planShared(targets, sourcesPer, options, state) {
  var nothingShared = targets.map(() => ({
    freeEffects: new Set(),
    reservedSongSlots: 0
  }));
  if (targets.length < 2) return nothingShared;
  var canAccessMall = get("autoSatisfyWithMall", false);
  var slots = freeSongSlots();
  var contexts = targets.map(target => ({
    target,
    options,
    state,
    canAccessMall,
    freeSongSlots: slots,
    freeEffects: new Set(),
    done: new Set()
  }));

  // One sweep of the sources per target — the expensive part. Both rounds below
  // re-price what it found rather than asking mafia again.
  var builds = targets.map((_, i) => buildCandidates(sourcesPer[i], contexts[i]));
  var serves = new Map();
  var _iterator6 = _createForOfIteratorHelper(builds),
    _step6;
  try {
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      var build = _step6.value;
      var _iterator0 = _createForOfIteratorHelper(build.candidates),
        _step0;
      try {
        for (_iterator0.s(); !(_step0 = _iterator0.n()).done;) {
          var candidate = _step0.value;
          serves.set(candidate.id, (serves.get(candidate.id) ?? 0) + 1);
        }
      } catch (err) {
        _iterator0.e(err);
      } finally {
        _iterator0.f();
      }
    }
  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }
  var solveWith = (index, free, discount) => {
    var build = builds[index];
    var request = solveRequestFor(build, contexts[index]);
    request.candidates = build.candidates.map(candidate => {
      var cost = free.has(candidate.id) ? 0 : discount ? candidate.cost / Math.max(1, serves.get(candidate.id) ?? 1) : candidate.cost;
      return cost === candidate.cost ? candidate : _objectSpread2(_objectSpread2({}, candidate), {}, {
        cost
      });
    });
    return new Set(solve(request).chosen.map(candidate => candidate.id));
  };
  var unionExcept = (chosen, skip) => {
    var union = new Set();
    for (var i = 0; i < chosen.length; i++) {
      if (i === skip) continue;
      var _iterator7 = _createForOfIteratorHelper(chosen[i]),
        _step7;
      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var id = _step7.value;
          union.add(id);
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    }
    return union;
  };

  // Round one, at a discount, each target seeing what the earlier ones took.
  var draft = [];
  for (var i = 0; i < targets.length; i++) draft.push(solveWith(i, unionExcept(draft, i), true));
  // Round two, at honest prices, each target seeing every other target's picks.
  var chosen = targets.map((_, i) => solveWith(i, unionExcept(draft, i), false));

  // The effect behind a candidate id, without round-tripping through the name —
  // KoL has effects that share one.
  var effectFor = (index, id) => {
    var _builds$index$sources;
    return (_builds$index$sources = builds[index].sourcesFor.get(id)) === null || _builds$index$sources === void 0 || (_builds$index$sources = _builds$index$sources[0]) === null || _builds$index$sources === void 0 ? void 0 : _builds$index$sources.effect;
  };
  return targets.map((_, i) => {
    // Goals execute in order, so only an *earlier* goal's purchase is genuinely
    // free to this one. Crediting a later goal's pick would leave whichever of
    // them runs first paying for something neither plan budgeted.
    var freeEffects = new Set();
    for (var earlier = 0; earlier < i; earlier++) {
      var _iterator8 = _createForOfIteratorHelper(chosen[earlier]),
        _step8;
      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var id = _step8.value;
          var effect = effectFor(earlier, id);
          if (effect) freeEffects.add(effect);
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
    }

    // Hold slots only for songs a later goal will have to cast itself: ones this
    // goal isn't already casting, and that aren't up (a renewal takes no slot).
    var reserved = new Set();
    for (var later = i + 1; later < targets.length; later++) {
      var _iterator9 = _createForOfIteratorHelper(chosen[later]),
        _step9;
      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var _id = _step9.value;
          if (chosen[i].has(_id) || reserved.has(_id)) continue;
          var _effect = effectFor(later, _id);
          if (_effect && isSong(_effect) && kolmafia.haveEffect(_effect) === 0) reserved.add(_id);
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }
    }
    return {
      freeEffects,
      reservedSongSlots: reserved.size
    };
  });
}

/** Candidates whose live mall price we look up before committing to a plan. */
var PREWARM_COUNT = 20;

/** How many times we re-plan after the world fails to match the plan. */
var MAX_REPLANS = 12;
/**
 * Bring one effect up to `minTurns`, trying each source in turn.
 *
 * A source can silently grant nothing — a spent consumable, an exhausted
 * limited buff, mafia being out of sync. When that happens we block that source
 * and try another way to the same effect rather than giving up on the effect.
 */
function gainEffect(effect, sources, context, target) {
  var options = context.options,
    state = context.state;
  var _iterator = _createForOfIteratorHelper(sources),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var source = _step.value;
      if (state.blockedSources.has(source.key)) continue;
      var before = kolmafia.haveEffect(effect);
      if (before >= target.minTurns) return {
        turns: before,
        exhausted: false
      };
      var uses = source.usesFor(target.minTurns, before);
      var plan = source.plan(options, state, context.canAccessMall, uses, target.meatCap);
      if (!plan) continue;
      if (plan.wish) kolmafia.abort("wish for ".concat(effect));
      if (!options.silent) kolmafia.printHtml("".concat(source.description, " x").concat(uses));
      // Charged on what was actually bought, and charged whether or not the
      // effect then landed — the meat is gone either way.
      state.meatSpent += source.apply(uses, plan);
      var after = kolmafia.haveEffect(effect);
      if (after === before) {
        kolmafia.refreshStatus();
        after = kolmafia.haveEffect(effect);
      }
      if (after !== before) {
        // Counted run-wide so the `meatperadventure` allowance survives re-planning
        // rather than being handed out again on every pass.
        state.meatPerAdventureSpent += source.meatPerAdventure();
        return {
          turns: after,
          exhausted: false
        };
      }
      if (!options.silent) kolmafia.printHtml("".concat(source.description, " gained no turns; skipping it."));
      state.blockedSources.add(source.key);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return {
    turns: kolmafia.haveEffect(effect),
    exhausted: true
  };
}

/** Print what the solver decided and why it stopped where it did. */
function describePlan(result, build, target, need, elapsed) {
  // With a goal, report where we land — measured off the gap rather than the
  // live reading, so effects that are up but about to expire aren't counted
  // twice. Open-ended, there is nothing to land on, so report the gain.
  var outcome = target.value === null ? "+".concat(formatNumber(result.progress)) : "reaching ".concat(formatNumber(target.value - directionOf(target) * (need - result.progress)), " ") + "(".concat(formatNumber(need), " to go)");
  kolmafia.printHtml("".concat(target.modifier, ": ").concat(result.chosen.length, " effects for ").concat(formatNumber(result.cost), " meat, ") + "".concat(outcome, " [").concat(result.reason, ", ").concat(result.stats.candidates, " candidates, ").concat(elapsed, "ms]"));
  var _iterator2 = _createForOfIteratorHelper(result.chosen),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _build$sourcesFor$get;
      var candidate = _step2.value;
      // The efficiency is what `X efficiency` compares against, so showing it here
      // is how you pick a number for it.
      var source = (_build$sourcesFor$get = build.sourcesFor.get(candidate.id)) === null || _build$sourcesFor$get === void 0 ? void 0 : _build$sourcesFor$get[0];
      var efficiency = source ? efficiencyOf(source, target, candidate.progress) : Infinity;
      kolmafia.printHtml("&nbsp;&nbsp;".concat(candidate.id, ": +").concat(formatNumber(candidate.progress), " over ") + "".concat(formatNumber((source === null || source === void 0 ? void 0 : source.turnsPerUse) ?? 0), " turns for ").concat(formatNumber(candidate.cost), " meat ") + "(".concat(formatNumber(efficiency), " efficiency)"));
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}

/** Apply effect sources until `target` is met, or nothing affordable is left. */
function raiseModifier(target, options, state, sources) {
  var freeEffects = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : new Set();
  var reservedSongSlots = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  var canAccessMall = get("autoSatisfyWithMall", false);
  /** Effects we've finished with, whether they landed or turned out unusable. */
  var done = new Set();
  var contextNow = () => ({
    target,
    options,
    state,
    canAccessMall,
    freeSongSlots: freeSongSlots(reservedSongSlots),
    freeEffects,
    done
  });
  for (var replan = 0; replan < MAX_REPLANS; replan++) {
    var context = contextNow();
    var started = kolmafia.gametimeToInt();
    var build = buildCandidates(sources, context, PREWARM_COUNT);
    var request = solveRequestFor(build, context);
    if (request.need <= 0) return;
    var result = solve(request);
    if (!options.silent) {
      describePlan(result, build, target, request.need, kolmafia.gametimeToInt() - started);
    }
    if (result.chosen.length === 0) {
      if (!options.silent) {
        kolmafia.print("Nothing left that moves ".concat(target.modifier, " (").concat(result.reason, ")."), "red");
      }
      return;
    }
    if (options.dryRun) return;
    var applied = 0;
    var _iterator3 = _createForOfIteratorHelper(result.chosen),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var _sources$;
        var candidate = _step3.value;
        // Take the effect from its own sources rather than re-resolving the name,
        // which KoL lets more than one effect share.
        var _sources = build.sourcesFor.get(candidate.id) ?? [];
        var effect = (_sources$ = _sources[0]) === null || _sources$ === void 0 ? void 0 : _sources$.effect;
        if (!effect) continue;
        var step = gainEffect(effect, _sources, context, target);
        if (step.exhausted) {
          done.add(effect);
          continue;
        }
        applied++;
        if (step.turns >= target.minTurns) done.add(effect);
      }

      // Nothing landed, so another identical pass would only repeat itself. The
      // plan was a prediction either way; the next lap re-measures and re-prices.
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    if (applied === 0) return;
  }
}

var VERSION = "2.0.0";

/** Printed before anything else, so `embiggen help` says which build this is. */
function printBanner() {
  kolmafia.printHtml("embiggen v".concat(VERSION));
}

/**
 * How much `RunState.meatSpent` may reach by the time this goal is done.
 *
 * Each goal gets an even slice of what's left, so one that can never be
 * satisfied cannot swallow the whole budget; whatever it doesn't spend rolls on
 * to the next. A goal with no target value has nothing else to stop it, so it
 * gets a rail of its own — applied here rather than by clamping the run-wide
 * budget every other goal is working to.
 */
function capFor(goal, options, state, remaining) {
  var share = (options.maxMeatToSpend - state.meatSpent) / remaining;
  var railed = goal.value === null && options.maxMeatToSpend === NO_MEAT_LIMIT;
  return state.meatSpent + (railed ? Math.min(share, OPEN_ENDED_MEAT_LIMIT) : share);
}

/** What we actually ended up with, against what was asked for. */
function printOutcome(goals, state) {
  var _iterator = _createForOfIteratorHelper(goals),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var goal = _step.value;
      var value = formatNumber(currentValue(goal.modifier));
      // An open-ended goal can't fall short — it got whatever the budget bought.
      if (goal.value === null) {
        kolmafia.print("".concat(goal.modifier, ": ").concat(value), "blue");
        continue;
      }
      var met = needFor(goal) <= 0;
      kolmafia.print("".concat(goal.modifier, ": ").concat(value, " of ").concat(formatNumber(goal.value)).concat(met ? "" : " — short"), met ? "green" : "red");
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  kolmafia.printHtml("Spent ".concat(formatNumber(state.meatSpent), " meat."));
}
function main(input) {
  if (input.trim() === "" || input.includes("help")) {
    printBanner();
    printUsage();
    return;
  }
  var _parseCommand = parseCommand(input),
    targets = _parseCommand.targets,
    unrecognised = _parseCommand.unrecognised,
    minTurns = _parseCommand.minTurns,
    maxEfficiency = _parseCommand.maxEfficiency,
    meatPerAdventureLimit = _parseCommand.meatPerAdventureLimit,
    options = _parseCommand.options;
  if (!options.silent) {
    printBanner();
    if (options.maxMeatToSpend !== NO_MEAT_LIMIT) {
      kolmafia.printHtml("Spending up to ".concat(formatNumber(options.maxMeatToSpend), " meat in total."));
    } else if (targets.some(_ref => {
      var value = _ref.value;
      return value === null;
    })) {
      kolmafia.printHtml("No total spending limit, so each goal with no target value is capped at " + "".concat(formatNumber(OPEN_ENDED_MEAT_LIMIT), " meat. Set your own with ") + "<strong>X totalmeat</strong>.");
    }
    if (maxEfficiency !== null) kolmafia.printHtml("".concat(formatNumber(maxEfficiency), " efficiency"));
    if (meatPerAdventureLimit > 0) {
      kolmafia.printHtml("".concat(formatNumber(meatPerAdventureLimit), " meat per adventure of effect, across all effects."));
    }
    if (!kolmafia.canInteract()) {
      kolmafia.printHtml("We're not in ronin, so we might break. I didn't test for this.");
    }
  }

  // Fail fast: a misunderstood modifier means the whole command is suspect, so
  // report it and buff nothing rather than silently half-applying.
  if (unrecognised.length > 0) {
    if (!options.silent) {
      var _iterator2 = _createForOfIteratorHelper(unrecognised),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var phrase = _step2.value;
          kolmafia.printHtml("Did not recognise modifier \"".concat(phrase, "\"."));
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
    return;
  }
  if (targets.length === 0) {
    if (!options.silent) {
      kolmafia.printHtml("Did not recognise \"".concat(input, "\"."));
      printUsage();
    }
    return;
  }
  if (!options.silent) kolmafia.printHtml(describeGoals(targets, minTurns));
  var restrictions = buildRestrictions(options);
  var state = newRunState();
  var reasonableTurns = Math.max(minTurns, Math.min(kolmafia.myAdventures(), 20));
  var goals = targets.map(_ref2 => {
    var modifier = _ref2.modifier,
      value = _ref2.value;
    return {
      modifier,
      value,
      minTurns,
      reasonableTurns,
      // An open-ended goal has nothing else to stop it, so it gets the default
      // cap; one with a target value stops when it gets there, and capping it
      // could reject the effect that would have closed the gap.
      maxEfficiency: maxEfficiency ?? (value === null ? OPEN_ENDED_EFFICIENCY : null),
      meatPerAdventureLimit,
      meatCap: NO_MEAT_LIMIT
    };
  });
  for (var i = 0; i < goals.length; i++) goals[i].meatCap = capFor(goals[i], options, state, goals.length);

  // Work out up front which effects serve more than one goal, so no goal turns
  // down a buff that only pays for itself once another goal shares the bill.
  // Caps are set first, so this plans against the budgets execution will have.
  var sourcesPer = goals.map(goal => sourcesFor(goal, options, restrictions));
  var shared = planShared(goals, sourcesPer, options, state);
  for (var _i = 0; _i < goals.length; _i++) {
    // Re-derived as we go, so whatever an earlier goal didn't spend rolls on.
    goals[_i].meatCap = capFor(goals[_i], options, state, goals.length - _i);
    var _shared$_i = shared[_i],
      freeEffects = _shared$_i.freeEffects,
      reservedSongSlots = _shared$_i.reservedSongSlots;
    raiseModifier(goals[_i], options, state, sourcesPer[_i], freeEffects, reservedSongSlots);
  }
  if (options.silent) return;
  if (options.dryRun) kolmafia.printHtml("Dry run: nothing was bought or cast.");else printOutcome(goals, state);
}

exports.main = main;
