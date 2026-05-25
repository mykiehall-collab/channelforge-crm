module {
  public type WidgetType = {
    #KpiCard;
    #LineGraph;
    #BarChart;
    #PipelineBoard;
    #AccountHealth;
    #AiInsights;
    #ActivityFeed;
    #RenewalTracker;
    #OpportunitySummary;
    #MessagingWidget;
    #SlaTracking;
    #Forecasting;
    #OperationalAlerts;
    #TerritoryPerformance;
    #MdfTracking;
    #ResellerPerformance;
    #DistributorPerformance;
    #AiUsage;
    #ComputeStorage;
    #Custom_;
  };

  public type WidgetSize = {
    #Small_;
    #Medium_;
    #Large_;
    #Wide;
    #Tall;
    #FullWidth;
  };

  public type WidgetConfig = {
    widgetId : Text;
    widgetType : WidgetType;
    title : Text;
    size : WidgetSize;
    posX : Nat;
    posY : Nat;
    roleFilter : [Text];
    deptFilter : [Text];
    territoryFilter : ?Text;
    accountFilter : ?Text;
    dateRange : ?Text;
    aiSummaryEnabled : Bool;
    refreshIntervalSecs : ?Nat;
    isPinned : Bool;
    customConfig : Text;
  };

  public type DashboardTemplateType = {
    #Department_;
    #Role_;
    #OrgType_;
  };

  public type DashboardLayout = {
    id : Text;
    name : Text;
    description : Text;
    widgets : [WidgetConfig];
    isTemplate : Bool;
    templateType : ?DashboardTemplateType;
    assignedTo : [Text];
    createdBy : Text;
    createdAt : Int;
    updatedAt : Int;
  };
}
