import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";
import Types "../types/assets";

module {
  public type State = {
    promotions : Map.Map<Text, Types.Promotion>;
    priceLists : Map.Map<Text, Types.PriceList>;
    idCounter : { var value : Nat };
  };

  public func initState() : State {
    {
      promotions = Map.empty<Text, Types.Promotion>();
      priceLists = Map.empty<Text, Types.PriceList>();
      idCounter = { var value = 0 };
    };
  };

  // --- Promotions ---

  public func createPromotion(
    state : State,
    caller : Principal,
    input : Types.PromotionInput,
  ) : CommonTypes.Result<Types.Promotion, Text> {
    if (input.endDate <= input.startDate) {
      return #err("End date must be after start date");
    };
    state.idCounter.value += 1;
    let id = "promo-" # state.idCounter.value.toText();
    let promo : Types.Promotion = {
      id;
      promoName = input.promoName;
      startDate = input.startDate;
      endDate = input.endDate;
      product = input.product;
      resellerEligibility = input.resellerEligibility;
      description = input.description;
      callToAction = input.callToAction;
      fileKeys = input.fileKeys;
      createdBy = caller.toText();
      createdAt = Time.now();
    };
    state.promotions.add(id, promo);
    #ok(promo);
  };

  public func getPromotion(
    state : State,
    id : Text,
  ) : ?Types.Promotion {
    state.promotions.get(id);
  };

  public func updatePromotion(
    state : State,
    caller : Principal,
    id : Text,
    input : Types.PromotionInput,
  ) : CommonTypes.Result<Types.Promotion, Text> {
    switch (state.promotions.get(id)) {
      case null { #err("Promotion not found") };
      case (?existing) {
        if (input.endDate <= input.startDate) {
          return #err("End date must be after start date");
        };
        let updated : Types.Promotion = {
          existing with
          promoName = input.promoName;
          startDate = input.startDate;
          endDate = input.endDate;
          product = input.product;
          resellerEligibility = input.resellerEligibility;
          description = input.description;
          callToAction = input.callToAction;
          fileKeys = input.fileKeys;
        };
        state.promotions.add(id, updated);
        #ok(updated);
      };
    };
  };

  public func deletePromotion(
    state : State,
    caller : Principal,
    id : Text,
  ) : CommonTypes.Result<(), Text> {
    switch (state.promotions.get(id)) {
      case null { #err("Promotion not found") };
      case (?_) {
        state.promotions.remove(id);
        #ok(());
      };
    };
  };

  public func getAllPromotions(state : State) : [Types.Promotion] {
    state.promotions.values().toArray();
  };

  public func getPromotionsForPartner(
    state : State,
    partnerId : Text,
  ) : [Types.Promotion] {
    state.promotions.values().filter(func(p) {
      p.resellerEligibility.find(func(e : Text) : Bool { e == partnerId or e == "all" }) != null
    }).toArray();
  };

  // --- Price Lists ---

  public func createPriceList(
    state : State,
    caller : Principal,
    input : Types.PriceListInput,
  ) : CommonTypes.Result<Types.PriceList, Text> {
    state.idCounter.value += 1;
    let id = "pl-" # state.idCounter.value.toText();
    let pl : Types.PriceList = {
      id;
      name = input.name;
      region = input.region;
      currency = input.currency;
      productFamily = input.productFamily;
      effectiveDate = input.effectiveDate;
      expiryDate = input.expiryDate;
      fileKey = input.fileKey;
      version = input.version;
      createdBy = caller.toText();
      createdAt = Time.now();
    };
    state.priceLists.add(id, pl);
    #ok(pl);
  };

  public func getPriceList(
    state : State,
    id : Text,
  ) : ?Types.PriceList {
    state.priceLists.get(id);
  };

  public func updatePriceList(
    state : State,
    caller : Principal,
    id : Text,
    input : Types.PriceListInput,
  ) : CommonTypes.Result<Types.PriceList, Text> {
    switch (state.priceLists.get(id)) {
      case null { #err("Price list not found") };
      case (?existing) {
        let updated : Types.PriceList = {
          existing with
          name = input.name;
          region = input.region;
          currency = input.currency;
          productFamily = input.productFamily;
          effectiveDate = input.effectiveDate;
          expiryDate = input.expiryDate;
          fileKey = input.fileKey;
          version = input.version;
        };
        state.priceLists.add(id, updated);
        #ok(updated);
      };
    };
  };

  public func deletePriceList(
    state : State,
    caller : Principal,
    id : Text,
  ) : CommonTypes.Result<(), Text> {
    switch (state.priceLists.get(id)) {
      case null { #err("Price list not found") };
      case (?_) {
        state.priceLists.remove(id);
        #ok(());
      };
    };
  };

  public func getAllPriceLists(state : State) : [Types.PriceList] {
    state.priceLists.values().toArray();
  };
};
