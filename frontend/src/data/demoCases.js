// 5 Standard Demonstration Test Cases for EcoSort AI (1M1B / IBM SkillsBuild / AICTE submission)

const makeSvgDataUri = (bg, emoji, label, sub) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg[0]}" />
        <stop offset="100%" stop-color="${bg[1]}" />
      </linearGradient>
    </defs>
    <rect width="600" height="400" fill="url(#g)" rx="24"/>
    <circle cx="300" cy="180" r="100" fill="white" opacity="0.15"/>
    <text x="300" y="210" font-size="90" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    <text x="300" y="320" font-family="'Outfit', sans-serif" font-weight="700" font-size="28" fill="#FFFFFF" text-anchor="middle">${label}</text>
    <text x="300" y="355" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" fill="rgba(255,255,255,0.8)" text-anchor="middle">${sub}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const DEMO_CASES = [
  {
    id: 'plastic-bottle',
    name: 'Plastic Water Bottle',
    badge: 'Recyclable/Dry',
    emoji: '🧴',
    description: 'Empty PET plastic beverage bottle with cap',
    image: makeSvgDataUri(['#1E3A8A', '#2563EB'], '🧴', 'PET Plastic Water Bottle', 'Dry Recyclable Packaging'),
    expected: {
      item: 'PET Plastic Water Bottle',
      category: 'Recyclable/Dry',
      bin: 'Dry Waste / Recycling Bin (Blue)',
      confidence: 0.96,
      disposal_action: 'Empty any remaining liquid. Rinse lightly. Crush to save space. Place into the blue dry recyclables bin.',
      disposal_steps: [
        'Empty any remaining liquid',
        'Rinse lightly to remove residue',
        'Crush or flatten bottle to save bin volume',
        'Place into the blue dry recyclables bin'
      ],
      material_breakdown: [
        { material: 'Polyethylene Terephthalate (PET #1)', percentage_estimate: '92%' },
        { material: 'Polypropylene (PP) closure/cap', percentage_estimate: '8%' }
      ],
      alternative_categories_considered: [
        { category: 'General/Non-Recyclable', why_rejected: 'Clean PET is universally accepted in mechanical recycling streams.' }
      ],
      environmental_impact: {
        co2_or_resource_note: 'Recycling 1 ton of PET plastic saves approx. 3.8 barrels of crude oil feedstocks (SDG 12.5).',
        decomposition_time_estimate: 'Standard PET takes 450+ years to break down in landfill environments.'
      },
      image_quality_note: 'Clear high-contrast synthetic sample; object contours distinct.',
      sustainability_tip: 'Recycling 1 ton of PET plastic saves approx. 3.8 barrels of crude oil and prevents microplastic ocean contamination (SDG 12).',
      reason: 'Visible clear polyethylene terephthalate (PET #1) material with standard threaded neck and recyclable polymer structure.',
      uncertainty: '',
      source: 'demo-preset',
      verification: {
        checked_by: 'groq-qwen',
        agreement: 'agree',
        note: 'PET bottles with PP caps are standard dry recyclables; recommendations are logically sound.'
      }
    }
  },
  {
    id: 'banana-peel',
    name: 'Banana Peel',
    badge: 'Organic/Wet',
    emoji: '🍌',
    description: 'Fresh organic fruit peel scrap',
    image: makeSvgDataUri(['#065F46', '#10B981'], '🍌', 'Fresh Banana Peel', 'Biodegradable Organic Waste'),
    expected: {
      item: 'Banana Peel Scrap',
      category: 'Organic/Wet',
      bin: 'Wet / Organic Compost Bin (Green)',
      confidence: 0.98,
      disposal_action: 'Place directly into the green wet-waste bin or campus compost bin. Keep away from plastic packaging.',
      disposal_steps: [
        'Ensure no plastic stickers or packaging remain attached',
        'Place into the green wet/organic compost bin',
        'Keep separate from dry recyclables to prevent mold'
      ],
      material_breakdown: [
        { material: 'Organic botanical biomass (cellulose, potassium, moisture)', percentage_estimate: '100%' }
      ],
      alternative_categories_considered: [
        { category: 'General/Non-Recyclable', why_rejected: 'Pure biological plant matter readily composts aerobically without toxic byproducts.' }
      ],
      environmental_impact: {
        co2_or_resource_note: 'Diverting organics from landfills eliminates anaerobic decay and associated methane generation.',
        decomposition_time_estimate: 'Decomposes in 2 to 6 weeks under active composting conditions.'
      },
      image_quality_note: 'Clear organic scrap benchmark.',
      sustainability_tip: 'Organic matter in landfills releases potent methane gas. Aerobic composting transforms it into nutrient-rich soil humus (SDG 12.5).',
      reason: 'Fibrous organic biomass exhibiting natural epidermal oxidation and high moisture content suitable for biological decomposition.',
      uncertainty: '',
      source: 'demo-preset',
      verification: {
        checked_by: 'groq-qwen',
        agreement: 'agree',
        note: 'Fresh fruit peel is unambiguous biodegradable organic matter.'
      }
    }
  },
  {
    id: 'cardboard-box',
    name: 'Cardboard Box',
    badge: 'Recyclable/Dry',
    emoji: '📦',
    description: 'Corrugated postal packaging carton',
    image: makeSvgDataUri(['#B45309', '#D97706'], '📦', 'Corrugated Cardboard Box', 'Dry Fibrous Recyclable'),
    expected: {
      item: 'Corrugated Shipping Box',
      category: 'Recyclable/Dry',
      bin: 'Dry Waste / Paper Recycling (Blue)',
      confidence: 0.95,
      disposal_action: 'Remove excessive packing tape. Flatten carton completely to maximize recycling bin capacity. Ensure carton remains dry.',
      disposal_steps: [
        'Peel away heavy plastic tape or shipping labels if feasible',
        'Flatten carton completely to maximize recycling bin capacity',
        'Store dry — keep away from wet/greasy kitchen waste'
      ],
      material_breakdown: [
        { material: 'Kraft unbleached corrugated cellulose fiber', percentage_estimate: '96%' },
        { material: 'Adhesive tape / starch binder', percentage_estimate: '4%' }
      ],
      alternative_categories_considered: [
        { category: 'General/Non-Recyclable', why_rejected: 'Clean dry kraft fiber is prime pulp grade; only soiled/greasy cardboard is rejected.' }
      ],
      environmental_impact: {
        co2_or_resource_note: 'Recycled corrugated cardboard requires 75% less energy and 50% less water than virgin timber pulp.',
        decomposition_time_estimate: 'Takes 2 to 4 months to biodegrade, but mechanical repulping saves trees immediately.'
      },
      image_quality_note: 'Benchmark cardboard geometry with clear edges.',
      sustainability_tip: 'Recycled corrugated cardboard requires 75% less energy and 50% less water than producing virgin cardboard pulp from felled timber.',
      reason: 'Uncontaminated kraft paper fiber fluting with dry surface structure ready for pulp repulping.',
      uncertainty: '',
      source: 'demo-preset',
      verification: {
        checked_by: 'groq-qwen',
        agreement: 'agree',
        note: 'Uncontaminated cardboard is classified as Dry/Recyclable across all municipal frameworks.'
      }
    }
  },
  {
    id: 'alkaline-battery',
    name: 'Alkaline Battery',
    badge: 'Hazardous/Special',
    emoji: '🔋',
    description: 'Standard AA/AAA cylindrical battery',
    image: makeSvgDataUri(['#991B1B', '#DC2626'], '🔋', 'Alkaline AA Battery', 'Hazardous / E-Waste'),
    expected: {
      item: 'Alkaline Household Battery',
      category: 'Hazardous/Special',
      bin: 'E-Waste / Hazardous Deposit Box (Red)',
      confidence: 0.93,
      disposal_action: 'NEVER discard in general domestic or wet waste. Place tape across terminal contacts and drop off at designated campus e-waste collection kiosk.',
      disposal_steps: [
        'Apply small piece of electrical/clear tape across both terminals (+/-) to prevent short-circuiting',
        'Keep dry and do not puncture the steel casing',
        'Deposit in dedicated red Hazardous/E-Waste collection kiosk'
      ],
      material_breakdown: [
        { material: 'Steel casing & nickel-plated mesh', percentage_estimate: '45%' },
        { material: 'Zinc anode & manganese dioxide cathode paste', percentage_estimate: '40%' },
        { material: 'Potassium hydroxide electrolyte', percentage_estimate: '15%' }
      ],
      alternative_categories_considered: [
        { category: 'Recyclable/Dry', why_rejected: 'Cannot be placed in standard curbside bins due to fire risk and corrosive chemical content.' },
        { category: 'General/Non-Recyclable', why_rejected: 'Heavy metals leach into groundwater if landfilled; specialized e-waste recovery is legally mandated in many regions.' }
      ],
      environmental_impact: {
        co2_or_resource_note: 'Specialized recycling recovers zinc, manganese, and steel feedstocks while preventing chemical leaching (SDG 12.4).',
        decomposition_time_estimate: 'Metal casing resists degradation for 100+ years while slowly releasing corrosive alkaline electrolytes.'
      },
      image_quality_note: 'Benchmark battery schematic.',
      sustainability_tip: 'Batteries contain heavy metals (zinc, manganese) that cause toxic chemical leaching into groundwater tables if sent to standard landfills (SDG 12.4).',
      reason: 'Cylindrical metal galvanic cell casing posing hazardous chemical leaching risks upon incineration or degradation.',
      uncertainty: '',
      source: 'demo-preset',
      verification: {
        checked_by: 'groq-qwen',
        agreement: 'agree',
        note: 'Hazardous/Special classification is safety-critical; batteries must never enter domestic streams.'
      }
    }
  },
  {
    id: 'mixed-waste',
    name: 'Mixed Food + Plastic Wrap',
    badge: 'Unknown/Uncertain',
    emoji: '🥤',
    description: 'Plastic food container with unseparated leftover sauce',
    image: makeSvgDataUri(['#78350F', '#B45309'], '🥤', 'Mixed Plastic + Food Residue', 'Responsible AI: Abstains & Flags'),
    expected: {
      item: 'Contaminated Mixed Food Packaging',
      category: 'Unknown/Uncertain',
      bin: 'Segregation Required Prior to Disposal',
      confidence: 0.62,
      disposal_action: 'DO NOT throw as a single piece. Scrape food residue into the green organic bin. Wash the plastic tray clean for the blue bin, or dispose soiled film into general waste.',
      disposal_steps: [
        'Scrape all leftover food residue into the green organic/wet bin',
        'Rinse the polymer base container thoroughly until grease-free',
        'If cleaned: place rigid plastic base in blue recycling bin',
        'If unwashed or heavily grease-permeated: dispose in black general waste bin'
      ],
      material_breakdown: [
        { material: 'Polypropylene (PP #5) food tray', percentage_estimate: '60%' },
        { material: 'Organic sauce & food residue', percentage_estimate: '30%' },
        { material: 'Flexible polyethylene sealant film', percentage_estimate: '10%' }
      ],
      alternative_categories_considered: [
        { category: 'Recyclable/Dry', why_rejected: 'Grease and food residue contaminate paper/plastic recycling lots and render polymers un-recyclable.' },
        { category: 'Organic/Wet', why_rejected: 'Non-biodegradable synthetic polymer tray cannot enter composting systems.' }
      ],
      environmental_impact: {
        co2_or_resource_note: 'Recycling contamination is a leading reason municipal recycling loads are sent to landfills.',
        decomposition_time_estimate: 'Organic portion decomposes in weeks, but the plastic tray persists for 20-400 years.'
      },
      image_quality_note: 'Multiple conflicting waste fractions visually detectable in sample.',
      sustainability_tip: 'Co-mingling organic food waste with recyclable polymers ruins entire batches of recyclables at sorting facilities.',
      reason: 'Image reveals multiple composite materials: organic food leftovers adhering to polymer packaging, causing cross-contamination.',
      uncertainty: '⚠️ Mixed waste detected: multiple conflicting waste streams are present. Separating organic fractions from recyclable polymer fractions is necessary before binning.',
      source: 'demo-preset',
      verification: {
        checked_by: 'groq-qwen',
        agreement: 'agree',
        note: 'Refusing to assign a single bin for mixed composite waste is correct Responsible-AI behavior.'
      }
    }
  }
];
