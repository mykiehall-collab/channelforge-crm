var CustomFieldObjectType = /* @__PURE__ */ ((CustomFieldObjectType2) => {
  CustomFieldObjectType2["distributorProfile"] = "distributorProfile";
  CustomFieldObjectType2["mdfRequest"] = "mdfRequest";
  CustomFieldObjectType2["businessPlan"] = "businessPlan";
  CustomFieldObjectType2["marketingActivity"] = "marketingActivity";
  CustomFieldObjectType2["resellerProfile"] = "resellerProfile";
  CustomFieldObjectType2["promotion"] = "promotion";
  CustomFieldObjectType2["customerAccount"] = "customerAccount";
  CustomFieldObjectType2["opportunity"] = "opportunity";
  CustomFieldObjectType2["userProfile"] = "userProfile";
  CustomFieldObjectType2["dealRegistration"] = "dealRegistration";
  return CustomFieldObjectType2;
})(CustomFieldObjectType || {});
var MdfRequestStatus = /* @__PURE__ */ ((MdfRequestStatus2) => {
  MdfRequestStatus2["cancelled"] = "cancelled";
  MdfRequestStatus2["pending"] = "pending";
  MdfRequestStatus2["paid"] = "paid";
  MdfRequestStatus2["approved"] = "approved";
  MdfRequestStatus2["rejected"] = "rejected";
  return MdfRequestStatus2;
})(MdfRequestStatus || {});
var RiskTier = /* @__PURE__ */ ((RiskTier2) => {
  RiskTier2["Low"] = "Low";
  RiskTier2["High"] = "High";
  RiskTier2["Medium"] = "Medium";
  RiskTier2["Healthy"] = "Healthy";
  RiskTier2["Critical"] = "Critical";
  return RiskTier2;
})(RiskTier || {});
var SmartQueryType = /* @__PURE__ */ ((SmartQueryType2) => {
  SmartQueryType2["CustomersNoActivePipeline"] = "CustomersNoActivePipeline";
  SmartQueryType2["InactiveResellers"] = "InactiveResellers";
  SmartQueryType2["AccountsNoEngagement"] = "AccountsNoEngagement";
  SmartQueryType2["HighRiskRenewals"] = "HighRiskRenewals";
  SmartQueryType2["ContractsMissingPlans"] = "ContractsMissingPlans";
  SmartQueryType2["StalledApprovals"] = "StalledApprovals";
  SmartQueryType2["DecliningEngagement"] = "DecliningEngagement";
  SmartQueryType2["HighGrowthOpportunities"] = "HighGrowthOpportunities";
  SmartQueryType2["TopPerformingDistributors"] = "TopPerformingDistributors";
  SmartQueryType2["PendingDRsOver14Days"] = "PendingDRsOver14Days";
  SmartQueryType2["ResellersBelowTarget"] = "ResellersBelowTarget";
  SmartQueryType2["RenewalsExpiringNextMonth"] = "RenewalsExpiringNextMonth";
  return SmartQueryType2;
})(SmartQueryType || {});
export {
  CustomFieldObjectType as C,
  MdfRequestStatus as M,
  RiskTier as R,
  SmartQueryType as S
};
