import {
  TemplarAdmin,
  ArmouryItem,
  ConsumableStock,
  BookingRecord,
  FinanceTransaction,
  OperationalDayEvent,
  MediaPostDraft,
  MarketingCampaign,
  IntelligenceDocument,
  PendingApprovalAction,
  OperationalAlert
} from '../types';

export const initialAdmins: TemplarAdmin[] = [
  {
    id: 'admin-paul',
    name: 'Paul',
    callsign: 'Templar 1 (Actual)',
    role: 'manager',
    roleTitle: 'Site Manager & Commercial Director',
    permissions: ['all', 'finance:write', 'crm:write', 'media:publish', 'operations:approve'],
    badge: 'MANAGER',
    avatar: '👑'
  },
  {
    id: 'admin-storm',
    name: 'Storm',
    callsign: 'Templar 2 (Head Marshal)',
    role: 'head_marshal',
    roleTitle: 'Head Marshal & Operations Lead',
    permissions: ['operations:write', 'armoury:write', 'safety:enforce', 'chrono:signoff', 'incidents:log'],
    badge: 'HEAD MARSHAL',
    avatar: '⚡'
  }
];

export let templarArmoury: ArmouryItem[] = [
  {
    id: 'arm-01',
    assetTag: 'AEG-01',
    model: 'G&G CM16 Raider 2.0',
    category: 'aeg',
    serialNumber: 'GG-2024-99101',
    fpsChrono: 342,
    joules: 1.08,
    lastChronoDate: '2026-10-25',
    status: 'operational',
    batteryType: '7.4V LiPo 1200mAh Crane Deans',
    repairNotes: 'Hop-up rubber replaced with Maple Leaf Macaron 60°.'
  },
  {
    id: 'arm-02',
    assetTag: 'AEG-02',
    model: 'G&G CM16 Raider 2.0',
    category: 'aeg',
    serialNumber: 'GG-2024-99102',
    fpsChrono: 345,
    joules: 1.10,
    lastChronoDate: '2026-10-25',
    status: 'operational',
    batteryType: '7.4V LiPo 1200mAh Crane Deans'
  },
  {
    id: 'arm-03',
    assetTag: 'AEG-03',
    model: 'Specna Arms Edge SA-E03',
    category: 'aeg',
    serialNumber: 'SE-88301-A',
    fpsChrono: 338,
    joules: 1.06,
    lastChronoDate: '2026-10-25',
    status: 'operational',
    batteryType: '11.1V LiPo Stick Deans (Gate Aster inside)'
  },
  {
    id: 'arm-04',
    assetTag: 'AEG-04',
    model: 'Specna Arms Edge SA-E03',
    category: 'aeg',
    serialNumber: 'SE-88302-B',
    fpsChrono: 341,
    joules: 1.08,
    lastChronoDate: '2026-10-25',
    status: 'operational',
    batteryType: '11.1V LiPo Stick Deans'
  },
  {
    id: 'arm-05',
    assetTag: 'AEG-05',
    model: 'G&G CM16 Raider 2.0',
    category: 'aeg',
    serialNumber: 'GG-2024-99105',
    fpsChrono: 310,
    joules: 0.89,
    lastChronoDate: '2026-10-25',
    status: 'maintenance_due',
    batteryType: '7.4V LiPo 1200mAh',
    repairNotes: 'Low FPS detected on 0.20g. Suspect piston O-ring compression leak.'
  },
  {
    id: 'arm-06',
    assetTag: 'DMR-01',
    model: 'G&G TR16 MBR 308SR (Locked Semi-Auto)',
    category: 'dmr',
    serialNumber: 'GG-DMR-44021',
    fpsChrono: 442,
    joules: 1.81,
    lastChronoDate: '2026-10-25',
    status: 'operational',
    batteryType: '11.1V LiPo Stick',
    repairNotes: 'Mechanically locked to semi. Strict 30m Minimum Engagement Distance (MED) applied.'
  },
  {
    id: 'arm-07',
    assetTag: 'SNP-01',
    model: 'Tokyo Marui VSR-10 Pro-Sniper (Upgraded Spring)',
    category: 'sniper',
    serialNumber: 'TM-VSR-19044',
    fpsChrono: 494,
    joules: 2.26,
    lastChronoDate: '2026-10-25',
    status: 'operational',
    batteryType: 'Manual Bolt Action',
    repairNotes: 'Action Army hop unit + 90 degree zero trigger. Strict 30m MED enforced.'
  },
  {
    id: 'arm-08',
    assetTag: 'PST-01',
    model: 'Raven EU18 Full/Semi GBB Pistol',
    category: 'pistol',
    serialNumber: 'RV-EU18-301',
    fpsChrono: 295,
    joules: 0.81,
    lastChronoDate: '2026-10-25',
    status: 'operational',
    batteryType: 'Green Gas / Abbey Predator Ultra'
  },
  {
    id: 'arm-09',
    assetTag: 'AEG-06',
    model: 'Valken ASL Mod-M Combat Rifle',
    category: 'aeg',
    serialNumber: 'VK-ASL-201',
    fpsChrono: 0,
    joules: 0,
    lastChronoDate: '2026-10-18',
    status: 'in_repair',
    batteryType: '7.4V LiPo',
    repairNotes: 'Stripped bevel gear during Sunday afternoon skirmish. Replacement steel gears ordered.'
  }
];

export let templarConsumables: ConsumableStock[] = [
  {
    id: 'c-01',
    name: 'Geoff’s Super Precision 0.20g Bio BBs (1kg Bag)',
    category: 'bbs',
    stockLevel: 42,
    unit: 'bags (1kg)',
    reorderThreshold: 15,
    costPrice: 6.50,
    salePrice: 13.00
  },
  {
    id: 'c-02',
    name: 'Geoff’s Precision 0.25g Bio BBs (1kg Bag)',
    category: 'bbs',
    stockLevel: 36,
    unit: 'bags (1kg)',
    reorderThreshold: 12,
    costPrice: 7.20,
    salePrice: 15.00
  },
  {
    id: 'c-03',
    name: 'BLS Perfect 0.28g Bio BBs (1kg Bag)',
    category: 'bbs',
    stockLevel: 18,
    unit: 'bags (1kg)',
    reorderThreshold: 8,
    costPrice: 8.40,
    salePrice: 17.00
  },
  {
    id: 'c-04',
    name: 'Enola Gaye WP40 Wire Pull Smoke (Red / Black)',
    category: 'pyro',
    stockLevel: 68,
    unit: 'grenades',
    reorderThreshold: 25,
    costPrice: 3.10,
    salePrice: 6.50
  },
  {
    id: 'c-05',
    name: 'Enola Gaye EG67 Pea Fragmentation Pyro (18+ Only)',
    category: 'pyro',
    stockLevel: 52,
    unit: 'grenades',
    reorderThreshold: 20,
    costPrice: 3.80,
    salePrice: 7.50
  },
  {
    id: 'c-06',
    name: 'ActionSportGames Ultrair High Performance Gas 570ml',
    category: 'gas_co2',
    stockLevel: 22,
    unit: 'cans',
    reorderThreshold: 10,
    costPrice: 5.50,
    salePrice: 11.00
  }
];

export let templarBookings: BookingRecord[] = [
  {
    id: 'bk-101',
    bookingRef: 'TEM-2026-101',
    customerName: 'Marcus Vance',
    email: 'marcus.vance@example.co.uk',
    phone: '07700 900142',
    playerType: 'group_package',
    playerCount: 6,
    gameDate: '2026-11-08',
    totalAmount: 270.00,
    depositPaid: 100.00,
    balanceDue: 170.00,
    status: 'confirmed',
    waiverSigned: true,
    hireKitAssigned: ['AEG-01', 'AEG-02', 'AEG-03', 'AEG-04'],
    notes: 'Birthday stag group. Require 4 rental weapon packages + full face protection.'
  },
  {
    id: 'bk-102',
    bookingRef: 'TEM-2026-102',
    customerName: 'David H. Miller',
    email: 'd.miller.tactical@gmail.com',
    phone: '07890 123456',
    playerType: 'walk_on',
    playerCount: 2,
    gameDate: '2026-11-08',
    totalAmount: 50.00,
    depositPaid: 50.00,
    balanceDue: 0.00,
    status: 'confirmed',
    waiverSigned: true,
    ukaraNumber: 'UKARA-TMP-88319',
    hireKitAssigned: [],
    notes: 'Regular walk-on players. Bringing own HPA PolarStar & Tokyo Marui recoil shock.'
  },
  {
    id: 'bk-103',
    bookingRef: 'TEM-2026-103',
    customerName: 'Kieran Scott',
    email: 'k.scott@techcorp.co.uk',
    phone: '07411 987654',
    playerType: 'full_hire',
    playerCount: 1,
    gameDate: '2026-11-08',
    totalAmount: 45.00,
    depositPaid: 20.00,
    balanceDue: 25.00,
    status: 'confirmed',
    waiverSigned: false,
    hireKitAssigned: ['AEG-05'],
    notes: 'First time player. Needs safety briefing emphasis on eye pro seal in woodland.'
  },
  {
    id: 'bk-104',
    bookingRef: 'TEM-2026-104',
    customerName: 'Callum Gallagher',
    email: 'cal.gallagher@outlook.com',
    phone: '07999 444333',
    playerType: 'group_package',
    playerCount: 10,
    gameDate: '2026-11-15',
    totalAmount: 450.00,
    depositPaid: 150.00,
    balanceDue: 300.00,
    status: 'enquiry',
    waiverSigned: false,
    hireKitAssigned: [],
    notes: 'University Airsoft Society. Requested 8 hire packs + private briefing slot.'
  }
];

export let templarFinance: FinanceTransaction[] = [
  {
    id: 'fin-01',
    type: 'income',
    category: 'green_fees',
    amount: 1125.00,
    date: '2026-10-25',
    description: 'Sunday Woodland Skirmish: 45 Walk-on player green fees @ £25',
    paymentMethod: 'card',
    status: 'confirmed',
    approvedBy: 'Paul'
  },
  {
    id: 'fin-02',
    type: 'income',
    category: 'hire_packages',
    amount: 675.00,
    date: '2026-10-25',
    description: 'Sunday Hire Packages: 15 full kit rentals @ £45',
    paymentMethod: 'card',
    status: 'confirmed',
    approvedBy: 'Paul'
  },
  {
    id: 'fin-03',
    type: 'income',
    category: 'pyro_sales',
    amount: 420.00,
    date: '2026-10-25',
    description: 'Safe Zone Shop: Smoke grenades & EG67 pea frags cash/card sales',
    paymentMethod: 'cash',
    status: 'confirmed',
    approvedBy: 'Storm'
  },
  {
    id: 'fin-04',
    type: 'expense',
    category: 'site_rent',
    amount: 1200.00,
    date: '2026-10-01',
    description: 'Monthly Woodland Forestry Lease & Access Road License',
    paymentMethod: 'bacs',
    status: 'confirmed',
    approvedBy: 'Paul'
  },
  {
    id: 'fin-05',
    type: 'expense',
    category: 'marshal_wages',
    amount: 320.00,
    date: '2026-10-25',
    description: 'Sunday Game Marshalling Day Stipends (4 Marshals @ £80/day)',
    paymentMethod: 'bacs',
    status: 'confirmed',
    approvedBy: 'Storm'
  },
  {
    id: 'fin-06',
    type: 'expense',
    category: 'repairs',
    amount: 145.50,
    date: '2026-10-22',
    description: 'Armoury Parts: SHS 16:1 gearsets, Maple leaf hop buckings, Deans plugs',
    paymentMethod: 'card',
    status: 'confirmed',
    approvedBy: 'Storm'
  }
];

export let templarOperations: OperationalDayEvent = {
  id: 'ops-current',
  date: '2026-11-08',
  title: 'Sunday Woodland Skirmish: Operation Timber Wolf',
  briefingTheme: 'Woodland Bunkers & Downed Supply Helicopter Objective',
  weatherForecast: '13°C, Overcast with light drizzle, 9 mph NW wind. Woodland ground damp.',
  headMarshal: 'Storm',
  expectedPlayers: 58,
  schedule: [
    { time: '08:30', activity: 'Site Gates & Registration Open', location: 'Safe Zone Cabin', briefingNotes: 'Issue player wristbands, verify waivers, check age for pyro purchase.' },
    { time: '09:15', activity: 'Chrono Station Operational', location: 'Chrono Range (Target Netting)', briefingNotes: 'Strict 0.20g BB testing. AEG 350 FPS max, DMR 450 FPS (semi-locked), Bolt-action Sniper 500 FPS.' },
    { time: '10:00', activity: 'Mandatory Safety Briefing', location: 'Safe Zone Briefing Area', briefingNotes: 'Eye protection strictly kept on outside safe zone. "BLIND MAN" call protocol. 18+ for pyro.' },
    { time: '10:30', activity: 'Game 1: Forward Outpost Assault', location: 'Sectors Bravo & Charlie (Pine Ridge)', briefingNotes: 'Red Team attacks fortified trench, Blue Team defends with timed respawns.' },
    { time: '12:45', activity: 'Lunch Break & Armoury Recharge', location: 'Safe Zone & Canteen', briefingNotes: 'LiPo battery swap, BB refills, hot burgers/tea, chrono re-checks if needed.' },
    { time: '13:45', activity: 'Game 2: Downed Pilot extraction', location: 'Sectors Echo & Foxtrot (Deep Forest)', briefingNotes: 'Dual VIP extraction mission with smoke grenade signal flare points.' },
    { time: '16:15', activity: 'Final Stand & Surrender Settlement', location: 'The Alamo Bunker', briefingNotes: 'Fast-paced finale, high-intensity suppression fire.' },
    { time: '16:45', activity: 'Debrief, Kit Hand-in & Site Packdown', location: 'Safe Zone Cabin', briefingNotes: 'Count all rental rifles, inspect magazines, clear batteries to storage voltage.' }
  ],
  marshalRota: [
    { id: 'm-1', name: 'Storm', role: 'head_marshal', callsign: 'Templar 2', radioChannel: 'PMR Ch 1 (446.00625 MHz)', assignedSector: 'Overall Field Lead & Incident Control', status: 'on_duty' },
    { id: 'm-2', name: 'Gareth "Gaz"', role: 'chrono_marshal', callsign: 'Templar 3', radioChannel: 'PMR Ch 1', assignedSector: 'Chrono Station & Bunker Ridge', status: 'on_duty' },
    { id: 'm-3', name: 'Luke T.', role: 'field_marshal', callsign: 'Templar 4', radioChannel: 'PMR Ch 2', assignedSector: 'Sector Charlie (Pine Forest)', status: 'on_duty' },
    { id: 'm-4', name: 'Dan W.', role: 'first_aid', callsign: 'Templar 5 (Medic)', radioChannel: 'PMR Ch 1', assignedSector: 'Sector Echo & Safe Zone Patrol', status: 'on_duty' }
  ],
  safetyChecklist: [
    { id: 'sc-1', item: 'Perimeter warning signs checked along woodland public footpath boundary', category: 'boundary_netting', completed: true, checkedBy: 'Storm' },
    { id: 'sc-2', item: 'Safe zone clearing barrel loaded with dry sand and magazines strictly out', category: 'safe_zone', completed: true, checkedBy: 'Storm' },
    { id: 'sc-3', item: 'Chrono calibration verified using 0.20g test BB batch and certified Acetech unit', category: 'chrono', completed: true, checkedBy: 'Gaz' },
    { id: 'sc-4', item: 'First aid kits restocked (trauma bandages, eye wash saline, burn dressings, ice packs)', category: 'first_aid', completed: true, checkedBy: 'Dan W.' },
    { id: 'sc-5', item: 'Woodland trench fallen timber cleared and trip hazards spray-marked with orange fluor', category: 'pyro_bunkers', completed: true, checkedBy: 'Storm' }
  ],
  incidents: [
    {
      id: 'inc-01',
      timestamp: '2026-10-25 14:15',
      incidentType: 'chrono_violation',
      severity: 'moderate',
      involvedParty: 'Walk-on player (HPA rifle)',
      location: 'Sector Bravo Outpost',
      description: 'Player rifle was observed firing hot during skirmish. Re-tested at chrono: measured 382 FPS on 0.20g (32 FPS above site 350 limit). Tournament lock had been tampered with.',
      actionsTaken: 'Rifle removed from field for duration of the day. Player given verbal warning and allowed to continue using site rental AEG.',
      reportedBy: 'Gaz (Chrono Marshal)'
    }
  ],
  woodlandMaintenanceNotes: [
    'Pine ridge trench reinforcement holding well after recent rain.',
    'Bunker 3 needs 4 replacement sandbags before next major milsim event.',
    'Access track has deep puddles at gate 2; gravel top-up scheduled with local farmer.'
  ]
};

export let templarMediaDrafts: MediaPostDraft[] = [
  {
    id: 'med-01',
    platform: 'instagram',
    title: 'Sunday Woodland Skirmish: Operation Timber Wolf',
    content: 'Lock, load, and take the tree-line! 🌲🔥 Join us this Sunday at Templars Airsoft UK for Operation Timber Wolf. Intense woodland warfare across 40 acres of fortified trenches, sniper towers, and bunker complexes. Hire packages available for newcomers!\n\n📅 Sunday 8th November\n📍 Templars Woodland Site\n🎟️ Walk-on £25 | Full Hire £45\n\nDrop us a message or book your squad via our portal in bio!',
    hashtags: ['#TemplarsAirsoft', '#UKAirsoft', '#AirsoftWoodland', '#AirsoftUK', '#AirsoftCommunity', '#MilsimUK', '#AirsoftWeekend'],
    visualPrompt: 'Tactical airsoft operators maneuvering through lush UK pine woodland with atmospheric red smoke grenade, dark shadows, tactical gear.',
    targetAudience: 'Airsoft players in Berkshire, Hampshire, and Surrey (ages 16-45)',
    status: 'draft',
    scheduledDate: '2026-11-05 18:00',
    engagementEst: '1.2k reach, ~140 likes, 12 booking inquiries'
  },
  {
    id: 'med-02',
    platform: 'tiktok',
    title: 'POV: The Bunker Ambush at Templars Airsoft',
    content: 'When the other team thinks they cleared the trench... but your squad is waiting. 💥🔊 (Wait till the red smoke clears!)\n\nTag your buddy who always runs into the open first. Bookings link in bio!\n\n#Airsoft #AirsoftSniper #AirsoftFail #UKAirsoft #WoodlandAirsoft',
    hashtags: ['#Airsoft', '#UKAirsoft', '#AirsoftTrench', '#CQB', '#AirsoftPOV'],
    visualPrompt: 'First-person perspective running through a timber bunker with BB tracer rounds bouncing off wood.',
    targetAudience: 'Airsoft enthusiasts, gamers, and adrenaline seekers',
    status: 'pending_approval',
    scheduledDate: '2026-11-06 17:30',
    engagementEst: '8.5k views, ~900 likes'
  },
  {
    id: 'med-03',
    platform: 'facebook',
    title: 'Weekend Game Announcement & Chrono Policy Reminder',
    content: 'Attention Templars! Gates open 08:30 this Sunday. Please ensure all guns are chronoed with 0.20g BBs upon arrival. Remember: safety first in the safe zone—magazines out, chambers clear. Fresh shipment of Enola Gaye smokes and pea frags in the shop ready to roll! See you on the line.',
    hashtags: ['#TemplarsAirsoft', '#UKAirsoftGameDay', '#AirsoftSafeZone'],
    visualPrompt: 'Templars Airsoft safe zone with marshals and hire guns aligned neatly.',
    targetAudience: 'Registered Facebook page followers (2,400 local players)',
    status: 'draft'
  }
];

export let templarMarketing: MarketingCampaign[] = [
  {
    id: 'mkt-01',
    name: 'Autumn Woodland Newcomer Recruitment',
    channel: 'Meta Ads (Facebook & Instagram)',
    objective: 'Full Hire Package Bookings (£45)',
    budgetGBP: 150.00,
    spendGBP: 88.50,
    leadsGenerated: 34,
    bookingsConverted: 14,
    status: 'active',
    conversionRate: 41.2
  },
  {
    id: 'mkt-02',
    name: 'Local University Airsoft Society Partnership',
    channel: 'Direct Student Union Outreach',
    objective: 'Group Milsim Bookings',
    budgetGBP: 50.00,
    spendGBP: 20.00,
    leadsGenerated: 22,
    bookingsConverted: 8,
    status: 'active',
    conversionRate: 36.4
  }
];

export let templarIntelligence: IntelligenceDocument[] = [
  {
    id: 'intel-01',
    title: 'UK Airsoft FPS & Kinetic Energy Safety Limits (SOP-01)',
    category: 'safety',
    summary: 'Standard operating limits for AEGs, DMRs, and Bolt-Action Snipers across Templars Airsoft UK.',
    fullText: `TEMPLARS AIRSOFT UK - CHRONO SAFETY POLICY (REVISED 2026)
All weapons must be chronoed with supplied site 0.20g BBs. Maximum kinetic energy thresholds:
1. FULL-AUTO RIFLES & SMGs (AEG / GBB / HPA):
   - Maximum velocity: 350 FPS (1.14 Joules).
   - Engagement Distance: No minimum engagement distance (MED) outdoors; single shot recommended within 5 metres.

2. DESIGNATED MARKSMAN RIFLES (DMR):
   - Maximum velocity: 450 FPS (1.88 Joules).
   - Mandatory Requirement: Mechanically or electronically locked to SEMI-AUTOMATIC ONLY.
   - Minimum Engagement Distance: 30 Metres. Sidearm required within MED.

3. BOLT-ACTION SNIPER RIFLES:
   - Maximum velocity: 500 FPS (2.32 Joules).
   - Mandatory Requirement: Manual bolt-action operation only.
   - Minimum Engagement Distance: 30 Metres. Sidearm required within MED.

4. HPA (HIGH PRESSURE AIR) REGULATIONS:
   - All HPA regulators must have a tournament lock installed and zip-tied by a Templar Marshal upon passing chrono.
   - Any player found tampering with tournament locks will be immediately expelled from site with zero refund.`,
    version: '3.4',
    lastUpdated: '2026-10-15',
    tags: ['chrono', 'fps', 'energy', 'safety', 'hpa', 'dmr', 'sniper']
  },
  {
    id: 'intel-02',
    title: 'UKARA & VCRA 2006 Specific Defence Compliance Guide',
    category: 'ukara',
    summary: 'Legal requirements under Section 37 of the Violent Crime Reduction Act 2006 for realistic imitation firearms (RIFs).',
    fullText: `UKARA (United Kingdom Airsoft Retailers Association) COMPLIANCE AT TEMPLARS:
Under the Violent Crime Reduction Act 2006 (VCRA), it is an offence to sell, manufacture, or import a Realistic Imitation Firearm (RIF) unless the purchaser has a valid defence.

TEMPLARS DEFENCE VERIFICATION CRITERIA:
1. The player must be 18 years of age or older.
2. The player must attend a minimum of THREE games at Templars Airsoft UK (or affiliated registered sites) over a period of not less than 56 days (8 weeks).
3. The player must provide valid photo ID and proof of address.
4. Once verified, Site Manager Paul or Head Marshal Storm enters the player into the central UKARA database.
5. All memberships remain valid for 12 months and require ongoing renewal through active play.`,
    version: '2.1',
    lastUpdated: '2026-09-01',
    tags: ['ukara', 'vcra', 'law', 'defence', 'rif', 'compliance']
  },
  {
    id: 'intel-03',
    title: 'Woodland Field Marshalling Protocols & Emergency Procedures',
    category: 'sop',
    summary: 'Marshal radio frequencies, blind-man emergency calls, eye injury protocols, and boundary security.',
    fullText: `EMERGENCY ACTION PROTOCOL:
1. "BLIND MAN" EMERGENCY:
   - Any marshal, player, or staff member who spots an eye-protection displacement, member of the public in the game zone, or medical emergency MUST immediately shout "BLIND MAN! BLIND MAN!".
   - All players within earshot MUST immediately repeat the call, CEASE FIRING, set weapons to SAFE, point muzzles at the dirt, and remain stationary.
   - Marshals deploy on PMR Channel 1 to resolve the incident before giving "GAME ON".

2. HEAD MARSHAL RESPONSIBILITIES (Storm):
   - Conduct pre-game site sweep for fallen trees, barbed wire, and public footpath signs.
   - Lead the morning safety briefing at 10:00 sharp.
   - Inspect chrono station logs before Game 1 commences.

3. COMMERCIAL & SITE MANAGER (Paul):
   - Oversee player check-in, hire weapon assignment, and safe-zone operations.
   - Reconcile morning green fee revenue against waiver registrations.`,
    version: '4.0',
    lastUpdated: '2026-10-20',
    tags: ['marshals', 'emergency', 'blind_man', 'radio', 'first_aid']
  }
];

export let pendingApprovals: PendingApprovalAction[] = [
  {
    id: 'appr-01',
    actionType: 'publish_media',
    title: 'Publish TikTok Tactical Gameplay Clip',
    description: 'Jarvis formulated a short-form video draft for TikTok highlighting the timber bunker ambush with booking call to action.',
    department: 'media',
    payload: {
      draftId: 'med-02',
      platform: 'tiktok',
      scheduledDate: '2026-11-06 17:30'
    },
    requestedBy: 'Jarvis AI',
    timestamp: '2026-11-01 16:30',
    status: 'pending'
  },
  {
    id: 'appr-02',
    actionType: 'finance_mutation',
    title: 'Record Consumable BB Reorder (£180.00)',
    description: 'Jarvis identified stock level of 0.28g Bio BBs is near threshold (18 bags left). Proposes purchase order from Geoff’s Wholesale.',
    department: 'finance',
    payload: {
      type: 'expense',
      category: 'consumables',
      amount: 180.00,
      description: 'Wholesale order: 20x 1kg Geoff’s 0.28g Bio BBs @ £9/bag',
      paymentMethod: 'card'
    },
    requestedBy: 'Jarvis AI',
    timestamp: '2026-11-01 16:45',
    status: 'pending'
  }
];

export let operationalAlerts: OperationalAlert[] = [
  {
    id: 'alt-01',
    level: 'warning',
    title: 'AEG-05 Low FPS Detected (310 FPS)',
    message: 'Hire weapon AEG-05 is reading 35 FPS below optimal compression. Scheduled for Storm to service piston O-ring.',
    department: 'armoury',
    actionRequired: 'Inspect cylinder compression & hop bucking',
    timestamp: '2026-10-25 17:00'
  },
  {
    id: 'alt-02',
    level: 'info',
    title: '14 Full Hire Kits Allocated for Sunday',
    message: 'Marcus Vance group (6) + Callum Gallagher enquiry (8) will utilize 14 of 16 available hire rifles. Ensure all 11.1v batteries are balance-charged.',
    department: 'operations',
    actionRequired: 'Check battery charging bank in Safe Zone',
    timestamp: '2026-11-01 14:00'
  },
  {
    id: 'alt-03',
    level: 'critical',
    title: 'Pre-Game Footpath Perimeter Sweep Due',
    message: 'High winds over weekend. Storm must walk northern boundary along public right-of-way to ensure safety netting is intact.',
    department: 'operations',
    actionRequired: 'Complete Boundary Netting Safety Checklist item',
    timestamp: '2026-11-01 15:30'
  }
];
