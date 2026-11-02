export type SwarmTopology = 'hierarchical' | 'mesh' | 'ring' | 'star' | 'federated';
export type ActiveHarness = 'ruflo' | 'claude-code' | 'codex' | 'pi';
export type ActiveCompanion = 'jarvis' | 'cindy' | 'luna';

export type CompanionState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'executing' | 'error';
export type CompanionMood = 'tactical' | 'attentive' | 'protective' | 'action-oriented' | 'analytical';

// 8 Connected Departments for Templars Airsoft UK + preserved developer hubs
export type DepartmentTab = 
  | 'command'       // (1) Command Centre: Live business dashboard, tasks, alerts, daily briefings
  | 'media'         // (2) Media Studio: FB, IG, TikTok captions, poster generator, scripts, sponsors
  | 'marketing'     // (3) Marketing & Growth: Analytics, local marketing, conversion, reviews, campaigns
  | 'operations'    // (4) Operations: Game-day schedules, staff rotas, woodland maintenance, safety, incidents
  | 'armoury'       // (5) Armoury & Inventory: Weapons, serials, chrono FPS, repairs, consumables, allocations
  | 'finance'       // (6) Finance: Income, expenditure, liabilities, rent, insurance, event profit, cash flow
  | 'crm'           // (7) Customer CRM & Bookings: Players, enquiries, deposits, balances, hire, waivers, follow-ups
  | 'intelligence'  // (8) Intelligence: SOPs, UKARA regulations, insurance, research, specialist airsoft agents
  | 'brain3d'       // 3D Live Brain Neural Graph (Preserved)
  | 'vision'        // Optical Camera Surroundings Vision Hub (Preserved)
  | 'motion';       // Deterministic Motion Studio (Preserved)

export type TemplarRole = 'manager' | 'head_marshal';

export interface TemplarAdmin {
  id: string;
  name: 'Paul' | 'Storm';
  callsign: string;
  role: TemplarRole;
  roleTitle: string;
  permissions: string[];
  badge: string;
  avatar: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'idle' | 'working' | 'ready' | 'evaluating';
  specialty: string;
  confidence: number;
}

export interface SwarmStep {
  agent: string;
  role: string;
  action: string;
  content: string;
}

export interface SwarmMissionResult {
  mission: string;
  topology: SwarmTopology;
  summary: string;
  steps: SwarmStep[];
  codeSnippet: string;
  consensusScore: number;
  executionTimeMs: number;
}

export interface MemoryItem {
  id: string;
  key: string;
  value: string;
  namespace: 'patterns' | 'adrs' | 'guardrails' | 'benchmarks' | 'operations' | 'armoury' | 'finance';
  score: number;
  tags: string[];
  createdAt: string;
}

export interface ADRItem {
  id: string;
  number: number;
  title: string;
  status: 'Accepted' | 'Proposed' | 'Under Review' | 'Superseded';
  author: string;
  context: string;
  decision: string;
  consequences: string;
  date: string;
}

export interface MessageAttachment {
  type: 'image' | 'document';
  name: string;
  url?: string;
  content?: string;
  mimeType?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'jarvis' | 'cindy' | 'luna' | 'system';
  text: string;
  timestamp: string;
  suggestedAction?: string;
  attachments?: MessageAttachment[];
  harnessUsed?: ActiveHarness;
  pendingApproval?: PendingApprovalAction;
  agentTrace?: Array<{
    agent: string;
    role: string;
    action: string;
    status: 'pending' | 'success' | 'warn';
  }>;
}

export interface UserPreferences {
  activeAi: ActiveCompanion;
  activeHarness: ActiveHarness;
  companionTone: 'friendly' | 'analytical' | 'witty' | 'concise' | 'direct';
  voicePitch: number;
  voiceRate: number;
  proactiveLevel: 'subtle' | 'balanced' | 'autonomous';
  safetyEnvelope: 'strict' | 'standard' | 'developer';
  privacyMode: boolean;
  quietHours: boolean;
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: 'research' | 'code' | 'security' | 'memory' | 'motion' | 'system' | 'armoury' | 'finance' | 'operations';
  riskLevel: 'low' | 'medium' | 'high';
  requiredPermission: string;
  status: 'available' | 'active' | 'requires_auth';
  lastExecuted?: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  category: 'architecture' | 'policy' | 'workflow' | 'entity' | 'tool' | 'operations';
  summary: string;
  confidence: number;
  connections: string[];
  x?: number;
  y?: number;
  z?: number;
}

export interface MotionCritiqueScores {
  hook: number;
  readability: number;
  motionQuality: number;
  brandAccuracy: number;
  soundSync: number;
  averageScore: number;
  verdict: 'Approved (8+)' | 'Needs Re-render' | 'Passable';
  notes: string[];
}

export interface OpportunityItem {
  id: string;
  title: string;
  category: 'vision' | 'architecture' | 'performance' | 'security' | 'creative' | 'operations';
  impact: 'high' | 'critical' | 'strategic';
  nodesInvolved: string[];
  description: string;
  actionableStep: string;
  confidence: number;
}

export interface VisionScanResult {
  environmentSummary: string;
  detectedEntities: string[];
  lighting: string;
  facingMode: 'user' | 'environment';
  timestamp: string;
  opportunities: Array<{
    title: string;
    description: string;
    suggestedAction: string;
    impact: 'high' | 'critical' | 'strategic';
  }>;
}

// -------------------------------------------------------------
// TEMPLARS AIRSOFT UK DOMAIN MODELS
// -------------------------------------------------------------

export interface ArmouryItem {
  id: string;
  assetTag: string; // e.g. "AEG-01"
  model: string;    // e.g. "G&G CM16 Raider 2.0"
  category: 'aeg' | 'dmr' | 'sniper' | 'pistol' | 'shotgun';
  serialNumber: string;
  fpsChrono: number; // e.g. 342 fps on 0.20g
  joules: number;    // e.g. 1.08 J
  lastChronoDate: string;
  status: 'operational' | 'in_repair' | 'maintenance_due' | 'decommissioned';
  assignedToGameDay?: string;
  assignedPlayer?: string;
  repairNotes?: string;
  batteryType: string; // e.g. "7.4V LiPo 1200mAh Deans"
  totalRoundsFiredApprox?: number;
}

export interface ConsumableStock {
  id: string;
  name: string;
  category: 'bbs' | 'pyro' | 'gas_co2' | 'batteries' | 'refreshments';
  stockLevel: number;
  unit: string; // "bags (1kg)", "grenades", "cylinders"
  reorderThreshold: number;
  costPrice: number;
  salePrice: number;
}

export interface BookingRecord {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  playerType: 'walk_on' | 'full_hire' | 'group_package';
  playerCount: number;
  gameDate: string;
  depositPaid: number;
  balanceDue: number;
  totalAmount: number;
  status: 'enquiry' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled';
  waiverSigned: boolean;
  ukaraNumber?: string;
  hireKitAssigned: string[]; // Asset Tags like ["AEG-01", "AEG-04"]
  notes?: string;
  bookingRef: string;
}

export interface FinanceTransaction {
  id: string;
  type: 'income' | 'expense';
  category: 'green_fees' | 'hire_packages' | 'pyro_sales' | 'consumables' | 'site_rent' | 'insurance' | 'marshal_wages' | 'repairs' | 'utilities' | 'other';
  amount: number;
  date: string;
  description: string;
  paymentMethod: 'card' | 'cash' | 'bacs' | 'stripe';
  approvedBy?: string;
  status: 'confirmed' | 'pending_approval';
  receiptRef?: string;
}

export interface GameScheduleSlot {
  time: string;
  activity: string;
  location: string;
  briefingNotes: string;
}

export interface MarshalDuty {
  id: string;
  name: string;
  role: 'head_marshal' | 'chrono_marshal' | 'field_marshal' | 'first_aid';
  callsign: string;
  radioChannel: string;
  assignedSector: string;
  status: 'on_duty' | 'break' | 'off_duty';
}

export interface SafetyCheckItem {
  id: string;
  item: string;
  category: 'chrono' | 'boundary_netting' | 'safe_zone' | 'first_aid' | 'pyro_bunkers';
  completed: boolean;
  checkedBy?: string;
  timestamp?: string;
}

export interface IncidentRecord {
  id: string;
  timestamp: string;
  incidentType: 'injury' | 'chrono_violation' | 'hit_taking_dispute' | 'equipment_failure' | 'boundary_breach';
  severity: 'minor' | 'moderate' | 'major' | 'riddor_reportable';
  involvedParty: string;
  location: string;
  description: string;
  actionsTaken: string;
  reportedBy: string;
}

export interface OperationalDayEvent {
  id: string;
  date: string;
  title: string;
  briefingTheme: string;
  weatherForecast: string;
  headMarshal: string;
  expectedPlayers: number;
  schedule: GameScheduleSlot[];
  marshalRota: MarshalDuty[];
  safetyChecklist: SafetyCheckItem[];
  incidents: IncidentRecord[];
  woodlandMaintenanceNotes: string[];
}

export interface MediaPostDraft {
  id: string;
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube';
  title: string;
  content: string;
  hashtags: string[];
  visualPrompt: string;
  targetAudience: string;
  status: 'draft' | 'pending_approval' | 'scheduled' | 'published';
  scheduledDate?: string;
  engagementEst?: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  channel: string;
  objective: string;
  budgetGBP: number;
  spendGBP: number;
  leadsGenerated: number;
  bookingsConverted: number;
  status: 'active' | 'planning' | 'paused' | 'completed';
  conversionRate: number;
}

export interface IntelligenceDocument {
  id: string;
  title: string;
  category: 'sop' | 'safety' | 'ukara' | 'insurance' | 'woodland_zones' | 'scenarios' | 'first_aid';
  summary: string;
  fullText: string;
  version: string;
  lastUpdated: string;
  restrictedToRole?: 'manager' | 'head_marshal';
  tags: string[];
}

export interface PendingApprovalAction {
  id: string;
  actionType: 'finance_mutation' | 'publish_media' | 'schedule_shift' | 'send_communication' | 'weapon_status_change' | 'delete_record';
  title: string;
  description: string;
  department: DepartmentTab;
  payload: any;
  requestedBy: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface OperationalAlert {
  id: string;
  level: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  department: DepartmentTab;
  actionRequired?: string;
  timestamp: string;
}
