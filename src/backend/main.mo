import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import CompanyLib "lib/company";
import AccountsLib "lib/accounts";
import DealsLib "lib/deals";
import PlansLib "lib/plans";
import AssetsLib "lib/assets";
import AlertsLib "lib/alerts";
import TiersLib "lib/tiers";
import ForexLib "lib/forex";
import NotificationsLib "lib/notifications";
import MixinCompany "mixins/company-api";
import MixinAccounts "mixins/accounts-api";
import MixinDeals "mixins/deals-api";
import MixinPlans "mixins/plans-api";
import MixinAssets "mixins/assets-api";
import MixinAlerts "mixins/alerts-api";
import MixinTiers "mixins/tiers-api";
import MixinForex "mixins/forex-api";
import MixinNotifications "mixins/notifications-api";
import QuartersLib "lib/quarters";
import TargetsLib "lib/targets";
import MixinQuarters "mixins/quarters-api";
import DistributorLib "lib/distributor";
import MessagingLib "lib/messaging";
import ProfilesLib "lib/profiles";
import MixinDistributor "mixins/distributor-api";
import MixinMessaging "mixins/messaging-api";
import MixinProfiles "mixins/profiles-api";









import AuthLib "lib/auth";
import MixinAuth "mixins/auth-api";
import Time "mo:core/Time";
import NotificationRulesLib "lib/notification-rules";
import MixinNotificationRules "mixins/notification-rules-api";

import CustomFieldsLib "lib/custom-fields";
import CustomerIdLib "lib/customer-id";
import OpportunitiesLib "lib/opportunities";
import MdfRequestsLib "lib/mdf-requests";
import MarketingLib "lib/marketing-activities";
import VisibilityLib "lib/visibility-rules";
import MixinCustomFields "mixins/custom-fields-api";
import MixinCustomerId "mixins/customer-id-api";
import MixinOpportunities "mixins/opportunities-api";
import MixinMdfRequests "mixins/mdf-requests-api";
import MixinMarketing "mixins/marketing-activities-api";
import MixinVisibility "mixins/visibility-rules-api";
import ForgeAILib "lib/forgeai";
import MixinForgeAI "mixins/forgeai-api";
import AIProviderLib "lib/ai-provider";
import MixinAIProvider "mixins/ai-provider-api";
import CreditsLib "lib/creditsLib";
import MixinCredits "mixins/credits-api";
import LayoutBuilderLib "lib/layout-builder";
import MixinLayoutBuilder "mixins/layout-builder-api";






actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Domain state
  let companyState = CompanyLib.initState();
  let accountsState = AccountsLib.initState();
  let dealsState = DealsLib.initState();
  let plansState = PlansLib.initState();
  let assetsState = AssetsLib.initState();
  let alertsState = AlertsLib.initState();
  let tiersState = TiersLib.initState();
  let forexState = ForexLib.initState();
  let notificationsState = NotificationsLib.initState();
  let quartersState     = QuartersLib.initState();
  let targetsState      = TargetsLib.initState();
  let distributorState  = DistributorLib.initState();
  let messagingState    = MessagingLib.initState();
  let profilesState     = ProfilesLib.initState();

  let authState = AuthLib.initState();
  let notificationRulesState = NotificationRulesLib.initState();

  let forgeaiState = ForgeAILib.initState();
  let customFieldsState = CustomFieldsLib.initState();
  let customerIdState   = CustomerIdLib.initState();
  let opportunitiesState = OpportunitiesLib.initState();
  let mdfRequestsState  = MdfRequestsLib.initState();
  let marketingState    = MarketingLib.initState();
  let visibilityState   = VisibilityLib.initState();
  let aiProviderState = AIProviderLib.initState();
  let creditsState = CreditsLib.initState();
  let layoutBuilderState = LayoutBuilderLib.initState();

  // TODO-SECURITY Remove test accounts before live launch
  // Seed flag — persists across calls; seeding runs only once on first install.
  let _testSeedState = { var seeded = false };
  // Inline seed: run once at canister install time (actor let-bindings execute on first deploy).
  do {
    if (not _testSeedState.seeded) {
      _testSeedState.seeded := true;
      let now = Time.now();

      // ── Test company: Vendor ──────────────────────────────────────────────
      companyState.companies.add("test-vendor-001", {
        id             = "test-vendor-001";
        companyType    = #Vendor;
        companyName    = "Test Vendor Co";
        companyId      = "test-vendor-001";
        emailDomain    = "test.channelforge.net";
        partnerDomains = [];
        logoKey        = null;
        vendorId       = null;
        activationStatus = #Active;
        setupComplete  = true;
        claimedAt      = ?now;
        claimedBy      = ?"test-seed";
        createdAt      = now;
      });
      companyState.userProfiles.add("test-user-vendor", {
        id             = "test-user-vendor";
        companyId      = "test-vendor-001";
        role           = #VendorPrimaryAdmin;
        permissions    = [];
        fullName       = "Vendor Test Admin";
        email          = "vendor@test.channelforge.net";
        isPrimaryAdmin = true;
        createdAt      = now;
      });
      AuthLib.initUserAuthState(authState, "test-user-vendor", "test-vendor-001");
      let _vendorPwHash = AuthLib.makePasswordHash(authState, "Test1234!");
      switch (authState.userAuthStates.get("test-user-vendor")) {
        case (?a) {
          authState.userAuthStates.add("test-user-vendor", {
            a with passwordHash = ?_vendorPwHash;
          });
        };
        case null {};
      };

      // ── Test company: Distributor ─────────────────────────────────────────
      companyState.companies.add("test-distributor-001", {
        id             = "test-distributor-001";
        companyType    = #Distributor;
        companyName    = "Test Distributor Co";
        companyId      = "test-distributor-001";
        emailDomain    = "test.channelforge.net";
        partnerDomains = [];
        logoKey        = null;
        vendorId       = null;
        activationStatus = #Active;
        setupComplete  = true;
        claimedAt      = ?now;
        claimedBy      = ?"test-seed";
        createdAt      = now;
      });
      companyState.userProfiles.add("test-user-distributor", {
        id             = "test-user-distributor";
        companyId      = "test-distributor-001";
        role           = #DistributorPrimaryAdmin;
        permissions    = [];
        fullName       = "Distributor Test Admin";
        email          = "distributor@test.channelforge.net";
        isPrimaryAdmin = false;
        createdAt      = now;
      });
      AuthLib.initUserAuthState(authState, "test-user-distributor", "test-distributor-001");
      let _distPwHash = AuthLib.makePasswordHash(authState, "Test1234!");
      switch (authState.userAuthStates.get("test-user-distributor")) {
        case (?a) {
          authState.userAuthStates.add("test-user-distributor", {
            a with passwordHash = ?_distPwHash;
          });
        };
        case null {};
      };

      // ── Test company: Reseller ────────────────────────────────────────────
      companyState.companies.add("test-reseller-001", {
        id             = "test-reseller-001";
        companyType    = #Reseller;
        companyName    = "Test Reseller Co";
        companyId      = "test-reseller-001";
        emailDomain    = "test.channelforge.net";
        partnerDomains = [];
        logoKey        = null;
        vendorId       = null;
        activationStatus = #Active;
        setupComplete  = true;
        claimedAt      = ?now;
        claimedBy      = ?"test-seed";
        createdAt      = now;
      });
      companyState.userProfiles.add("test-user-reseller", {
        id             = "test-user-reseller";
        companyId      = "test-reseller-001";
        role           = #ResellerPrimaryAdmin;
        permissions    = [];
        fullName       = "Reseller Test Admin";
        email          = "reseller@test.channelforge.net";
        isPrimaryAdmin = true;
        createdAt      = now;
      });
      AuthLib.initUserAuthState(authState, "test-user-reseller", "test-reseller-001");
      let _resellerPwHash = AuthLib.makePasswordHash(authState, "Test1234!");
      switch (authState.userAuthStates.get("test-user-reseller")) {
        case (?a) {
          authState.userAuthStates.add("test-user-reseller", {
            a with passwordHash = ?_resellerPwHash;
          });
        };
        case null {};
      };

      // TODO-SECURITY: Remove before live launch — dummy customer accounts for Vendor workspace
      let _d30  = now + 30  * 86_400_000_000_000;
      let _d60  = now + 60  * 86_400_000_000_000;
      let _d90  = now + 90  * 86_400_000_000_000;
      let _d180 = now + 180 * 86_400_000_000_000;
      let _dOver = now - 15 * 86_400_000_000_000;  // 15 days overdue
      let _d45  = now + 45  * 86_400_000_000_000;

      // ── Vendor accounts ───────────────────────────────────────────────────
      accountsState.accounts.add("acc-v-001", {
        id = "acc-v-001";
        accountName = "Meridian Global Solutions";
        customerDomain = "meridianglobal.co.uk";
        customerIdNumber = ?"MGS-0001";
        resellerOwnerId = "test-reseller-001";
        vendorOwnerId = "test-vendor-001";
        distributorIds = ["test-distributor-001"];
        sites = [];
        reassignmentLog = [];
        renewalDate = _d30;
        contractType = "Annual";
        productList = ["ChannelForge Professional 50-seat"];
        licenceQuantity = 50;
        estimatedRenewalValue = 85000.0;
        status = #AtRisk;
        createdAt = now;
        updatedAt = now;
      }); // TODO-SECURITY: Remove before live launch

      accountsState.accounts.add("acc-v-002", {
        id = "acc-v-002";
        accountName = "Apex Dynamics Ltd";
        customerDomain = "apexdynamics.com";
        customerIdNumber = ?"APX-0002";
        resellerOwnerId = "test-reseller-001";
        vendorOwnerId = "test-vendor-001";
        distributorIds = ["test-distributor-001"];
        sites = [];
        reassignmentLog = [];
        renewalDate = _d60;
        contractType = "Annual";
        productList = ["Forge Enterprise Suite", "ForgeAI Pro"];
        licenceQuantity = 120;
        estimatedRenewalValue = 218000.0;
        status = #Active;
        createdAt = now;
        updatedAt = now;
      }); // TODO-SECURITY: Remove before live launch

      accountsState.accounts.add("acc-v-003", {
        id = "acc-v-003";
        accountName = "Pinnacle Financial Services";
        customerDomain = "pinnaclefs.co.uk";
        customerIdNumber = ?"PFS-0003";
        resellerOwnerId = "test-reseller-001";
        vendorOwnerId = "test-vendor-001";
        distributorIds = [];
        sites = [];
        reassignmentLog = [];
        renewalDate = _dOver;
        contractType = "Multi-Year";
        productList = ["ChannelForge Professional 50-seat"];
        licenceQuantity = 30;
        estimatedRenewalValue = 52000.0;
        status = #AtRisk;
        createdAt = now;
        updatedAt = now;
      }); // TODO-SECURITY: Remove before live launch

      accountsState.accounts.add("acc-v-004", {
        id = "acc-v-004";
        accountName = "Stratton Technology Partners";
        customerDomain = "strattontech.com";
        customerIdNumber = ?"STP-0004";
        resellerOwnerId = "test-reseller-001";
        vendorOwnerId = "test-vendor-001";
        distributorIds = ["test-distributor-001"];
        sites = [];
        reassignmentLog = [];
        renewalDate = _d180;
        contractType = "Annual";
        productList = ["Forge Enterprise Suite"];
        licenceQuantity = 200;
        estimatedRenewalValue = 245000.0;
        status = #Active;
        createdAt = now;
        updatedAt = now;
      }); // TODO-SECURITY: Remove before live launch

      accountsState.accounts.add("acc-v-005", {
        id = "acc-v-005";
        accountName = "Quantum Retail Group";
        customerDomain = "quantumretail.co.uk";
        customerIdNumber = ?"QRG-0005";
        resellerOwnerId = "test-reseller-001";
        vendorOwnerId = "test-vendor-001";
        distributorIds = [];
        sites = [];
        reassignmentLog = [];
        renewalDate = _d90;
        contractType = "Annual";
        productList = ["ChannelForge Essentials 25-seat"];
        licenceQuantity = 25;
        estimatedRenewalValue = 18500.0;
        status = #Prospect;
        createdAt = now;
        updatedAt = now;
      }); // TODO-SECURITY: Remove before live launch

      // ── Distributor accounts ──────────────────────────────────────────────
      accountsState.accounts.add("acc-d-001", {
        id = "acc-d-001";
        accountName = "Harrington Manufacturing UK";
        customerDomain = "harringtonmfg.co.uk";
        customerIdNumber = ?"HMU-1001";
        resellerOwnerId = "test-reseller-001";
        vendorOwnerId = "test-vendor-001";
        distributorIds = ["test-distributor-001"];
        sites = [];
        reassignmentLog = [];
        renewalDate = _d45;
        contractType = "Annual";
        productList = ["ChannelForge Professional 50-seat"];
        licenceQuantity = 60;
        estimatedRenewalValue = 96000.0;
        status = #Active;
        createdAt = now;
        updatedAt = now;
      }); // TODO-SECURITY: Remove before live launch

      accountsState.accounts.add("acc-d-002", {
        id = "acc-d-002";
        accountName = "Vantage Infrastructure Ltd";
        customerDomain = "vantageinfra.com";
        customerIdNumber = ?"VIL-1002";
        resellerOwnerId = "test-reseller-001";
        vendorOwnerId = "test-vendor-001";
        distributorIds = ["test-distributor-001"];
        sites = [];
        reassignmentLog = [];
        renewalDate = _dOver;
        contractType = "Annual";
        productList = ["Forge Enterprise Suite"];
        licenceQuantity = 80;
        estimatedRenewalValue = 134000.0;
        status = #AtRisk;
        createdAt = now;
        updatedAt = now;
      }); // TODO-SECURITY: Remove before live launch

      accountsState.accounts.add("acc-d-003", {
        id = "acc-d-003";
        accountName = "Clearstone Legal Group";
        customerDomain = "clearstonelegal.co.uk";
        customerIdNumber = ?"CLG-1003";
        resellerOwnerId = "test-reseller-001";
        vendorOwnerId = "test-vendor-001";
        distributorIds = ["test-distributor-001"];
        sites = [];
        reassignmentLog = [];
        renewalDate = _d90;
        contractType = "Multi-Year";
        productList = ["ChannelForge Professional 50-seat", "ForgeAI Pro"];
        licenceQuantity = 45;
        estimatedRenewalValue = 78500.0;
        status = #Active;
        createdAt = now;
        updatedAt = now;
      }); // TODO-SECURITY: Remove before live launch

      accountsState.accounts.add("acc-d-004", {
        id = "acc-d-004";
        accountName = "Northgate Logistics PLC";
        customerDomain = "northgatelogistics.com";
        customerIdNumber = ?"NGL-1004";
        resellerOwnerId = "test-reseller-001";
        vendorOwnerId = "test-vendor-001";
        distributorIds = ["test-distributor-001"];
        sites = [];
        reassignmentLog = [];
        renewalDate = _d180;
        contractType = "Annual";
        productList = ["Forge Enterprise Suite"];
        licenceQuantity = 150;
        estimatedRenewalValue = 195000.0;
        status = #Active;
        createdAt = now;
        updatedAt = now;
      }); // TODO-SECURITY: Remove before live launch

      accountsState.accounts.add("acc-d-005", {
        id = "acc-d-005";
        accountName = "Alderton Healthcare Systems";
        customerDomain = "aldertonhealth.co.uk";
        customerIdNumber = ?"AHS-1005";
        resellerOwnerId = "test-reseller-001";
        vendorOwnerId = "test-vendor-001";
        distributorIds = ["test-distributor-001"];
        sites = [];
        reassignmentLog = [];
        renewalDate = _d60;
        contractType = "Annual";
        productList = ["ChannelForge Essentials 25-seat"];
        licenceQuantity = 20;
        estimatedRenewalValue = 14800.0;
        status = #Churned;
        createdAt = now;
        updatedAt = now;
      }); // TODO-SECURITY: Remove before live launch

      // ── Reseller accounts ─────────────────────────────────────────────────
      accountsState.accounts.add("acc-r-001", {
        id = "acc-r-001";
        accountName = "Castleford Digital Agency";
        customerDomain = "castleforddigital.co.uk";
        customerIdNumber = ?"CDA-2001";
        resellerOwnerId = "test-reseller-001";
        vendorOwnerId = "test-vendor-001";
        distributorIds = [];
        sites = [];
        reassignmentLog = [];
        renewalDate = _d30;
        contractType = "Annual";
        productList = ["ChannelForge Essentials 25-seat"];
        licenceQuantity = 15;
        estimatedRenewalValue = 11250.0;
        status = #Active;
        createdAt = now;
        updatedAt = now;
      }); // TODO-SECURITY: Remove before live launch

      accountsState.accounts.add("acc-r-002", {
        id = "acc-r-002";
        accountName = "Elmwood Construction Group";
        customerDomain = "elmwoodconstruction.com";
        customerIdNumber = ?"ECG-2002";
        resellerOwnerId = "test-reseller-001";
        vendorOwnerId = "test-vendor-001";
        distributorIds = [];
        sites = [];
        reassignmentLog = [];
        renewalDate = _dOver;
        contractType = "Annual";
        productList = ["ChannelForge Professional 50-seat"];
        licenceQuantity = 40;
        estimatedRenewalValue = 64000.0;
        status = #AtRisk;
        createdAt = now;
        updatedAt = now;
      }); // TODO-SECURITY: Remove before live launch

      accountsState.accounts.add("acc-r-003", {
        id = "acc-r-003";
        accountName = "Redwood Media & Events";
        customerDomain = "redwoodmedia.co.uk";
        customerIdNumber = ?"RME-2003";
        resellerOwnerId = "test-reseller-001";
        vendorOwnerId = "test-vendor-001";
        distributorIds = [];
        sites = [];
        reassignmentLog = [];
        renewalDate = _d60;
        contractType = "Annual";
        productList = ["ChannelForge Essentials 25-seat"];
        licenceQuantity = 10;
        estimatedRenewalValue = 7500.0;
        status = #Active;
        createdAt = now;
        updatedAt = now;
      }); // TODO-SECURITY: Remove before live launch

      accountsState.accounts.add("acc-r-004", {
        id = "acc-r-004";
        accountName = "Bluefield Energy Services";
        customerDomain = "bluefieldenergy.com";
        customerIdNumber = ?"BES-2004";
        resellerOwnerId = "test-reseller-001";
        vendorOwnerId = "test-vendor-001";
        distributorIds = [];
        sites = [];
        reassignmentLog = [];
        renewalDate = _d90;
        contractType = "Multi-Year";
        productList = ["ChannelForge Professional 50-seat"];
        licenceQuantity = 55;
        estimatedRenewalValue = 91000.0;
        status = #Active;
        createdAt = now;
        updatedAt = now;
      }); // TODO-SECURITY: Remove before live launch

      accountsState.accounts.add("acc-r-005", {
        id = "acc-r-005";
        accountName = "Thornton Retail Solutions";
        customerDomain = "thorntonretail.co.uk";
        customerIdNumber = ?"TRS-2005";
        resellerOwnerId = "test-reseller-001";
        vendorOwnerId = "test-vendor-001";
        distributorIds = [];
        sites = [];
        reassignmentLog = [];
        renewalDate = _d180;
        contractType = "Annual";
        productList = ["Forge Enterprise Suite"];
        licenceQuantity = 75;
        estimatedRenewalValue = 112500.0;
        status = #Prospect;
        createdAt = now;
        updatedAt = now;
      }); // TODO-SECURITY: Remove before live launch

      // ── Opportunities — Vendor workspace ──────────────────────────────────
      ignore OpportunitiesLib.createOpportunity(
        opportunitiesState,
        {
          opportunityName   = "Q2 Enterprise Renewal — Apex Dynamics Ltd";
          revenueEstimate   = 218000;
          stage             = #negotiation;
          closeDate         = _d30;
          customerAccountId = ?"acc-v-002";
          associatedDealIds = [];
          vendorOwnerId     = "test-vendor-001";
          distributorId     = ?"test-distributor-001";
          resellerId        = ?"test-reseller-001";
        },
        "test-user-vendor",
        now,
      ); // TODO-SECURITY: Remove before live launch

      ignore OpportunitiesLib.createOpportunity(
        opportunitiesState,
        {
          opportunityName   = "New Business — Stratton Technology Partners";
          revenueEstimate   = 125000;
          stage             = #proposal;
          closeDate         = _d60;
          customerAccountId = ?"acc-v-004";
          associatedDealIds = [];
          vendorOwnerId     = "test-vendor-001";
          distributorId     = ?"test-distributor-001";
          resellerId        = ?"test-reseller-001";
        },
        "test-user-vendor",
        now,
      ); // TODO-SECURITY: Remove before live launch

      ignore OpportunitiesLib.createOpportunity(
        opportunitiesState,
        {
          opportunityName   = "Meridian Global — Upsell to Enterprise Suite";
          revenueEstimate   = 42000;
          stage             = #qualification;
          closeDate         = _d45;
          customerAccountId = ?"acc-v-001";
          associatedDealIds = [];
          vendorOwnerId     = "test-vendor-001";
          distributorId     = ?"test-distributor-001";
          resellerId        = ?"test-reseller-001";
        },
        "test-user-vendor",
        now,
      ); // TODO-SECURITY: Remove before live launch

      ignore OpportunitiesLib.createOpportunity(
        opportunitiesState,
        {
          opportunityName   = "Quantum Retail — Initial Licence Deal";
          revenueEstimate   = 18500;
          stage             = #prospecting;
          closeDate         = _d90;
          customerAccountId = ?"acc-v-005";
          associatedDealIds = [];
          vendorOwnerId     = "test-vendor-001";
          distributorId     = null;
          resellerId        = ?"test-reseller-001";
        },
        "test-user-vendor",
        now,
      ); // TODO-SECURITY: Remove before live launch

      ignore OpportunitiesLib.createOpportunity(
        opportunitiesState,
        {
          opportunityName   = "Pinnacle Financial — Renewal Recovery";
          revenueEstimate   = 52000;
          stage             = #closedWon;
          closeDate         = now - 5 * 86_400_000_000_000;
          customerAccountId = ?"acc-v-003";
          associatedDealIds = [];
          vendorOwnerId     = "test-vendor-001";
          distributorId     = null;
          resellerId        = ?"test-reseller-001";
        },
        "test-user-vendor",
        now,
      ); // TODO-SECURITY: Remove before live launch

      // ── Opportunities — Distributor workspace ─────────────────────────────
      ignore OpportunitiesLib.createOpportunity(
        opportunitiesState,
        {
          opportunityName   = "Harrington Manufacturing — Annual Renewal";
          revenueEstimate   = 96000;
          stage             = #negotiation;
          closeDate         = _d45;
          customerAccountId = ?"acc-d-001";
          associatedDealIds = [];
          vendorOwnerId     = "test-vendor-001";
          distributorId     = ?"test-distributor-001";
          resellerId        = ?"test-reseller-001";
        },
        "test-user-distributor",
        now,
      ); // TODO-SECURITY: Remove before live launch

      ignore OpportunitiesLib.createOpportunity(
        opportunitiesState,
        {
          opportunityName   = "Vantage Infrastructure — Emergency Renewal";
          revenueEstimate   = 134000;
          stage             = #proposal;
          closeDate         = _d30;
          customerAccountId = ?"acc-d-002";
          associatedDealIds = [];
          vendorOwnerId     = "test-vendor-001";
          distributorId     = ?"test-distributor-001";
          resellerId        = ?"test-reseller-001";
        },
        "test-user-distributor",
        now,
      ); // TODO-SECURITY: Remove before live launch

      ignore OpportunitiesLib.createOpportunity(
        opportunitiesState,
        {
          opportunityName   = "Northgate Logistics — Expand to 200 Seats";
          revenueEstimate   = 260000;
          stage             = #qualification;
          closeDate         = _d60;
          customerAccountId = ?"acc-d-004";
          associatedDealIds = [];
          vendorOwnerId     = "test-vendor-001";
          distributorId     = ?"test-distributor-001";
          resellerId        = ?"test-reseller-001";
        },
        "test-user-distributor",
        now,
      ); // TODO-SECURITY: Remove before live launch

      ignore OpportunitiesLib.createOpportunity(
        opportunitiesState,
        {
          opportunityName   = "Alderton Healthcare — Win-Back Campaign";
          revenueEstimate   = 14800;
          stage             = #closedLost;
          closeDate         = now - 10 * 86_400_000_000_000;
          customerAccountId = ?"acc-d-005";
          associatedDealIds = [];
          vendorOwnerId     = "test-vendor-001";
          distributorId     = ?"test-distributor-001";
          resellerId        = ?"test-reseller-001";
        },
        "test-user-distributor",
        now,
      ); // TODO-SECURITY: Remove before live launch

      ignore OpportunitiesLib.createOpportunity(
        opportunitiesState,
        {
          opportunityName   = "Clearstone Legal — ForgeAI Pro Add-On";
          revenueEstimate   = 24000;
          stage             = #prospecting;
          closeDate         = _d90;
          customerAccountId = ?"acc-d-003";
          associatedDealIds = [];
          vendorOwnerId     = "test-vendor-001";
          distributorId     = ?"test-distributor-001";
          resellerId        = ?"test-reseller-001";
        },
        "test-user-distributor",
        now,
      ); // TODO-SECURITY: Remove before live launch

      // ── Opportunities — Reseller workspace ───────────────────────────────
      ignore OpportunitiesLib.createOpportunity(
        opportunitiesState,
        {
          opportunityName   = "Castleford Digital — Licence Renewal";
          revenueEstimate   = 11250;
          stage             = #negotiation;
          closeDate         = _d30;
          customerAccountId = ?"acc-r-001";
          associatedDealIds = [];
          vendorOwnerId     = "test-vendor-001";
          distributorId     = null;
          resellerId        = ?"test-reseller-001";
        },
        "test-user-reseller",
        now,
      ); // TODO-SECURITY: Remove before live launch

      ignore OpportunitiesLib.createOpportunity(
        opportunitiesState,
        {
          opportunityName   = "Elmwood Construction — Overdue Renewal Recovery";
          revenueEstimate   = 64000;
          stage             = #proposal;
          closeDate         = _d30;
          customerAccountId = ?"acc-r-002";
          associatedDealIds = [];
          vendorOwnerId     = "test-vendor-001";
          distributorId     = null;
          resellerId        = ?"test-reseller-001";
        },
        "test-user-reseller",
        now,
      ); // TODO-SECURITY: Remove before live launch

      ignore OpportunitiesLib.createOpportunity(
        opportunitiesState,
        {
          opportunityName   = "Bluefield Energy — Upsell to Enterprise Suite";
          revenueEstimate   = 48000;
          stage             = #qualification;
          closeDate         = _d60;
          customerAccountId = ?"acc-r-004";
          associatedDealIds = [];
          vendorOwnerId     = "test-vendor-001";
          distributorId     = null;
          resellerId        = ?"test-reseller-001";
        },
        "test-user-reseller",
        now,
      ); // TODO-SECURITY: Remove before live launch

      ignore OpportunitiesLib.createOpportunity(
        opportunitiesState,
        {
          opportunityName   = "Thornton Retail — New Enterprise Licence";
          revenueEstimate   = 112500;
          stage             = #closedWon;
          closeDate         = now - 3 * 86_400_000_000_000;
          customerAccountId = ?"acc-r-005";
          associatedDealIds = [];
          vendorOwnerId     = "test-vendor-001";
          distributorId     = null;
          resellerId        = ?"test-reseller-001";
        },
        "test-user-reseller",
        now,
      ); // TODO-SECURITY: Remove before live launch

      ignore OpportunitiesLib.createOpportunity(
        opportunitiesState,
        {
          opportunityName   = "Redwood Media — Renewal and Expansion";
          revenueEstimate   = 15000;
          stage             = #prospecting;
          closeDate         = _d90;
          customerAccountId = ?"acc-r-003";
          associatedDealIds = [];
          vendorOwnerId     = "test-vendor-001";
          distributorId     = null;
          resellerId        = ?"test-reseller-001";
        },
        "test-user-reseller",
        now,
      ); // TODO-SECURITY: Remove before live launch
    };
  };

  // Mixin composition — all public methods come from mixins
  include MixinCompany(companyState, alertsState, notificationsState);
  include MixinAccounts(accountsState, companyState, alertsState);
  include MixinDeals(dealsState, alertsState, notificationsState);
  include MixinPlans(plansState);
  include MixinAssets(assetsState);
  include MixinAlerts(alertsState);
  include MixinTiers(tiersState, alertsState);
  include MixinForex(forexState, alertsState);
  include MixinNotifications(notificationsState);
  include MixinQuarters(quartersState, targetsState, dealsState, companyState, alertsState);
  include MixinDistributor(distributorState, companyState, accountsState, alertsState);
  include MixinMessaging(messagingState, companyState);
  include MixinProfiles(profilesState, companyState);
  include MixinAuth(authState, companyState, alertsState);
  include MixinForgeAI(forgeaiState, accountsState, dealsState, messagingState, plansState, notificationsState, companyState);
    include MixinCustomFields(customFieldsState);
  include MixinCustomerId(customerIdState);
  include MixinOpportunities(opportunitiesState);
  include MixinMdfRequests(mdfRequestsState);
  include MixinMarketing(marketingState);
  include MixinVisibility(visibilityState);
include MixinAIProvider(aiProviderState);
include MixinNotificationRules(notificationRulesState, notificationsState, alertsState);
  include MixinCredits(creditsState);
  include MixinLayoutBuilder(layoutBuilderState);
};
