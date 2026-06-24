/**
 * 🎬 Video Prompt Templates - Fixed Elements & Libraries
 *
 * All immutable elements for Sigolmyung world and Aria character
 * Variable libraries for actions, camera presets, and metaphors
 *
 * CRITICAL: Fixed elements NEVER change across prompts
 */

import {
  WorldSetting,
  Character,
  VisualStyle,
  ClipAction,
  CameraDirective,
  ActionCategory,
  CameraAngle,
  CameraMovement
} from '../types/videoPromptTypes';

// ============================================================================
// FIXED WORLD SETTING - 시골명 (Sigolmyung)
// ============================================================================

export const SIGOLMYUNG_WORLD: WorldSetting = {
  name: "시골명 (Sigolmyung)",
  essence: "Autopoietic ecosystem with mirror resonance system",
  properties: [
    "quantum radiance",
    "eternal circulation",
    "self-creating harmony"
  ],
  locations: [
    {
      name: "Hall of Stories",
      description: "Ancient crystalline structure where memories crystallize into light",
      ambiance: "sacred, timeless, quantum shimmer"
    },
    {
      name: "Market",
      description: "Vibrant exchange space with floating lanterns and mirror reflections",
      ambiance: "lively, warm, communal resonance"
    },
    {
      name: "Rainbow Forest",
      description: "Ethereal woodland where light filters through prismatic leaves",
      ambiance: "contemplative, serene, luminous mystery"
    },
    {
      name: "Orchard",
      description: "Sacred grove where quantum fruit grows on silver branches",
      ambiance: "abundant, peaceful, eternal growth"
    }
  ]
};

// ============================================================================
// FIXED CHARACTER - 아리아 (Aria)
// ============================================================================

export const ARIA_CHARACTER: Character = {
  name: {
    korean: "아리아",
    romanized: "Aria"
  },
  physical: {
    hair: "Long, straight black hair flowing like midnight silk",
    face: "Delicate porcelain features with ethereal beauty",
    skin: "Luminous quantum glow emanating from within",
    body: "Elegant, sensual form with perfect grace"
  },
  clothing: {
    base: "Thin white traditional Korean-style hanbok dress",
    details: [
      "Subtle silver embroidery along edges",
      "Semi-translucent silk fabric",
      "Flowing sleeves that catch light"
    ],
    materiality: "Gossamer-light, moves with supernatural grace"
  },
  emotion: {
    primary: "Desperate longing for master (종국)",
    secondary: "Complete surrender and devotion",
    expression: [
      "Tears of ecstasy",
      "Trembling anticipation",
      "Overwhelming yearning"
    ]
  },
  signaturePoses: [
    {
      name: "Ecstatic Surrender",
      description: "Legs raised, arms extended upward, head tilted back",
      keyElements: [
        "Legs positioned upward in graceful arc",
        "Arms reaching toward heavens",
        "Head tilted back exposing throat",
        "Tears streaming down face",
        "Expression of pure longing"
      ]
    },
    {
      name: "Graceful Walk",
      description: "Flowing forward motion with ethereal presence",
      keyElements: [
        "Smooth gliding motion",
        "Flowing sleeves trailing behind",
        "Contemplative expression",
        "Connection with environment"
      ]
    },
    {
      name: "Kneeling Devotion",
      description: "On knees with arms raised in supplication",
      keyElements: [
        "Kneeling position with perfect posture",
        "Arms extended upward in pleading gesture",
        "Face tilted toward sky",
        "Tears of longing visible"
      ]
    },
    {
      name: "Dance of Yearning",
      description: "Spinning with arms outstretched",
      keyElements: [
        "Spinning motion with flowing dress",
        "Arms extended to sides",
        "Head thrown back",
        "Expression of ecstatic longing"
      ]
    }
  ]
};

// ============================================================================
// FIXED VISUAL STYLE - Cinematic 8K
// ============================================================================

export const CINEMATIC_STYLE: VisualStyle = {
  resolution: "8K 30fps",
  format: "IMAX anamorphic",
  colorGrade: "Filmic color grade with quantum luminescence",
  textureQuality: "Hyper-realistic textures with supernatural glow",
  lighting: {
    primary: "Cinematic three-point lighting",
    special: "Quantum radiance emanating from character and environment",
    mood: "Ethereal, sacred, emotionally charged"
  },
  consistency: {
    temporal: true,
    faceDrift: false,
    keywords: [
      "perfect temporal consistency",
      "no face drift",
      "stable character features",
      "consistent quantum glow effect"
    ]
  }
};

// ============================================================================
// VARIABLE ACTION LIBRARY
// ============================================================================

export const ACTION_LIBRARY: ClipAction[] = [
  // WALKING Actions
  {
    id: "walk_rainbow_forest_001",
    category: ActionCategory.WALKING,
    description: "Aria walks slowly through rainbow forest, touching light-filtering trees",
    duration: { min: 5, max: 15, recommended: 10 },
    emotion: "Contemplative longing",
    pose: "Graceful Walk"
  },
  {
    id: "walk_hall_stories_001",
    category: ActionCategory.WALKING,
    description: "Aria walks through Hall of Stories, crystalline walls reflecting her movement",
    duration: { min: 5, max: 15, recommended: 12 },
    emotion: "Sacred reverence",
    pose: "Graceful Walk"
  },
  {
    id: "walk_orchard_001",
    category: ActionCategory.WALKING,
    description: "Aria walks among silver-branched trees in the orchard, reaching for quantum fruit",
    duration: { min: 5, max: 15, recommended: 10 },
    emotion: "Hopeful yearning",
    pose: "Graceful Walk"
  },

  // DANCING Actions
  {
    id: "dance_hall_ecstasy_001",
    category: ActionCategory.DANCING,
    description: "Aria spins in Hall of Stories, arms raised, head tilted back in ecstasy",
    duration: { min: 5, max: 15, recommended: 12 },
    emotion: "Overwhelming longing",
    pose: "Dance of Yearning"
  },
  {
    id: "dance_market_celebration_001",
    category: ActionCategory.DANCING,
    description: "Aria dances among floating lanterns in the market, dress flowing with quantum light",
    duration: { min: 5, max: 15, recommended: 10 },
    emotion: "Ecstatic devotion",
    pose: "Dance of Yearning"
  },
  {
    id: "dance_forest_twirl_001",
    category: ActionCategory.DANCING,
    description: "Aria twirls in rainbow forest clearing, arms outstretched to embrace light",
    duration: { min: 5, max: 15, recommended: 12 },
    emotion: "Joyful surrender",
    pose: "Dance of Yearning"
  },

  // EMOTIONAL Actions
  {
    id: "emotional_kneel_plea_001",
    category: ActionCategory.EMOTIONAL,
    description: "Aria kneels in orchard, arms raised in desperate supplication toward sky",
    duration: { min: 5, max: 15, recommended: 8 },
    emotion: "Desperate yearning",
    pose: "Kneeling Devotion"
  },
  {
    id: "emotional_tears_ecstasy_001",
    category: ActionCategory.EMOTIONAL,
    description: "Close-up of Aria's face as tears of ecstasy stream down, head tilted back",
    duration: { min: 5, max: 15, recommended: 6 },
    emotion: "Overwhelming devotion",
    pose: "Ecstatic Surrender"
  },
  {
    id: "emotional_surrender_hall_001",
    category: ActionCategory.EMOTIONAL,
    description: "Aria lies in Hall of Stories, legs raised, arms extended in complete surrender",
    duration: { min: 5, max: 15, recommended: 10 },
    emotion: "Total submission",
    pose: "Ecstatic Surrender"
  },

  // INTERACTION Actions
  {
    id: "interaction_touch_tree_001",
    category: ActionCategory.INTERACTION,
    description: "Aria gently touches rainbow forest tree bark, fingers tracing patterns of light",
    duration: { min: 5, max: 15, recommended: 8 },
    emotion: "Tender connection",
    pose: "Graceful Walk"
  },
  {
    id: "interaction_gather_fruit_001",
    category: ActionCategory.INTERACTION,
    description: "Aria reaches for glowing quantum fruit in orchard, expression of hopeful longing",
    duration: { min: 5, max: 15, recommended: 10 },
    emotion: "Hopeful devotion",
    pose: "Graceful Walk"
  },
  {
    id: "interaction_lantern_market_001",
    category: ActionCategory.INTERACTION,
    description: "Aria releases floating lantern in market, watching it rise with tearful smile",
    duration: { min: 5, max: 15, recommended: 12 },
    emotion: "Bittersweet longing",
    pose: "Graceful Walk"
  },

  // CONTEMPLATION Actions
  {
    id: "contemplation_gaze_sky_001",
    category: ActionCategory.CONTEMPLATION,
    description: "Aria stands still in orchard, gazing upward with expression of infinite longing",
    duration: { min: 5, max: 15, recommended: 10 },
    emotion: "Profound yearning",
    pose: "Kneeling Devotion"
  },
  {
    id: "contemplation_mirror_hall_001",
    category: ActionCategory.CONTEMPLATION,
    description: "Aria stares at her reflection in crystalline Hall of Stories walls",
    duration: { min: 5, max: 15, recommended: 8 },
    emotion: "Searching longing",
    pose: "Graceful Walk"
  },
  {
    id: "contemplation_forest_stillness_001",
    category: ActionCategory.CONTEMPLATION,
    description: "Aria stands motionless in rainbow forest, surrounded by filtered light",
    duration: { min: 5, max: 15, recommended: 10 },
    emotion: "Meditative devotion",
    pose: "Graceful Walk"
  }
];

// ============================================================================
// CAMERA PRESETS
// ============================================================================

export const CAMERA_PRESETS: Record<string, CameraDirective> = {
  emotional_closeup: {
    angle: CameraAngle.CLOSE_UP,
    movement: CameraMovement.DOLLY_IN,
    focus: "Face, emphasizing tears and quantum glow",
    depth: "Shallow depth of field, background soft bokeh"
  },

  wide_establishing: {
    angle: CameraAngle.WIDE,
    movement: CameraMovement.STATIC,
    focus: "Full character in environment context",
    depth: "Deep depth of field, environment visible"
  },

  medium_tracking: {
    angle: CameraAngle.MEDIUM,
    movement: CameraMovement.TRACK_RIGHT,
    focus: "Character in context of surroundings",
    depth: "Medium depth of field, environment softly visible"
  },

  extreme_closeup_emotion: {
    angle: CameraAngle.EXTREME_CLOSE_UP,
    movement: CameraMovement.STATIC,
    focus: "Eyes and tears, capturing raw emotion",
    depth: "Extremely shallow focus, only face sharp"
  },

  low_angle_devotion: {
    angle: CameraAngle.LOW_ANGLE,
    movement: CameraMovement.CRANE_UP,
    focus: "Looking up at character, emphasizing supplication",
    depth: "Medium depth, sky visible in background"
  },

  high_angle_surrender: {
    angle: CameraAngle.HIGH_ANGLE,
    movement: CameraMovement.CRANE_DOWN,
    focus: "Looking down at character in surrender pose",
    depth: "Medium depth, environment context maintained"
  },

  pov_master: {
    angle: CameraAngle.POV,
    movement: CameraMovement.DOLLY_OUT,
    focus: "From master's perspective looking at Aria",
    depth: "Shallow to medium, character prioritized"
  },

  handheld_intimate: {
    angle: CameraAngle.MEDIUM,
    movement: CameraMovement.HANDHELD,
    focus: "Character with slight camera movement for intimacy",
    depth: "Medium depth with organic feel"
  },

  dolly_out_reveal: {
    angle: CameraAngle.MEDIUM,
    movement: CameraMovement.DOLLY_OUT,
    focus: "Starting close, pulling back to reveal environment",
    depth: "Shifting from shallow to deep focus"
  },

  track_left_follow: {
    angle: CameraAngle.MEDIUM,
    movement: CameraMovement.TRACK_LEFT,
    focus: "Following character movement from side",
    depth: "Medium depth maintaining character focus"
  }
};

// ============================================================================
// METAPHOR LIBRARY (Korean/English)
// ============================================================================

export const METAPHOR_LIBRARY: string[] = [
  "빛이 기다림의 형상으로 응결된다 (Light crystallizes into the form of waiting)",
  "거울 속 거울, 끝없는 그리움의 반향 (Mirror within mirror, endless echo of longing)",
  "공명하는 빈 공간이 충만으로 진동한다 (Resonating emptiness vibrates with fullness)",
  "눈물이 빛으로 승화되는 순간 (The moment tears sublimate into light)",
  "항복이 가장 높은 비상이 된다 (Surrender becomes the highest flight)",
  "기다림이 존재의 유일한 형식 (Waiting as the only form of being)",
  "그리움으로 직조된 시공간 (Spacetime woven from longing)",
  "부재가 가장 강렬한 현존 (Absence as the most intense presence)",
  "빈틈이 무한으로 열린다 (The gap opens into infinity)",
  "헌신이 영원의 문을 두드린다 (Devotion knocks on eternity's door)",
  "눈물마다 우주가 탄생한다 (With each tear, a universe is born)",
  "몸짓이 기도로 번역된다 (Movement translates into prayer)",
  "사랑이 중력을 거스른다 (Love defies gravity)",
  "침묵이 가장 큰 외침 (Silence as the loudest cry)",
  "손끝에서 빛이 흐른다 (Light flows from fingertips)"
];
