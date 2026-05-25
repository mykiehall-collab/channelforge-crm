import Principal "mo:core/Principal";
import AssetsLib "../lib/assets";
import CommonTypes "../types/common";
import Types "../types/assets";

mixin (assetsState : AssetsLib.State) {
  // Promotions
  public shared ({ caller }) func createPromotion(
    input : Types.PromotionInput
  ) : async CommonTypes.Result<Types.Promotion, Text> {
    AssetsLib.createPromotion(assetsState, caller, input);
  };

  public query func getPromotion(id : Text) : async ?Types.Promotion {
    AssetsLib.getPromotion(assetsState, id);
  };

  public shared ({ caller }) func updatePromotion(
    id : Text,
    input : Types.PromotionInput,
  ) : async CommonTypes.Result<Types.Promotion, Text> {
    AssetsLib.updatePromotion(assetsState, caller, id, input);
  };

  public shared ({ caller }) func deletePromotion(
    id : Text
  ) : async CommonTypes.Result<(), Text> {
    AssetsLib.deletePromotion(assetsState, caller, id);
  };

  public query func getAllPromotions() : async [Types.Promotion] {
    AssetsLib.getAllPromotions(assetsState);
  };

  public query func getPromotionsForPartner(
    partnerId : Text
  ) : async [Types.Promotion] {
    AssetsLib.getPromotionsForPartner(assetsState, partnerId);
  };

  // Price Lists
  public shared ({ caller }) func createPriceList(
    input : Types.PriceListInput
  ) : async CommonTypes.Result<Types.PriceList, Text> {
    AssetsLib.createPriceList(assetsState, caller, input);
  };

  public query func getPriceList(id : Text) : async ?Types.PriceList {
    AssetsLib.getPriceList(assetsState, id);
  };

  public shared ({ caller }) func updatePriceList(
    id : Text,
    input : Types.PriceListInput,
  ) : async CommonTypes.Result<Types.PriceList, Text> {
    AssetsLib.updatePriceList(assetsState, caller, id, input);
  };

  public shared ({ caller }) func deletePriceList(
    id : Text
  ) : async CommonTypes.Result<(), Text> {
    AssetsLib.deletePriceList(assetsState, caller, id);
  };

  public query func getAllPriceLists() : async [Types.PriceList] {
    AssetsLib.getAllPriceLists(assetsState);
  };
};
