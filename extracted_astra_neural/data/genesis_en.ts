import { InitializedTool } from '../types';

export const genesis_en: InitializedTool[] = [
  {
    title: "Strategic Council (The Council)",
    points: [
      "Core decision-making engine.",
      "Convenes a panel of specialized AI personas.",
      "Analyzes a central dilemma from multiple, often conflicting, perspectives.",
      "Produces a synthesized report with actionable recommendations."
    ],
    design: "Designed to counteract cognitive biases (like confirmation bias) by forcing consideration of diverse viewpoints. It simulates a high-level strategic advisory board.",
    synergy: [
      "Can use outputs from the Value Proposition Arsenal as context.",
      "Insights from the Cultural Atlas can be injected into the dilemma for a more nuanced analysis.",
      "The results can feed into the Narrative Builder to create compelling stories."
    ],
    polymorphic: [
      "Artist: Deciding between a label deal and independent release.",
      "Entrepreneur: Evaluating a pivot in the business model.",
      "Manager: Formulating a crisis response strategy."
    ],
    kpis: [
      "Clarity of final recommendation.",
      "Identification of previously unconsidered risks or opportunities.",
      "User confidence in the strategic path forward."
    ],
    criticalConsiderations: [
      "The quality of the input dilemma is paramount.",
      "The user must be open to challenging their own assumptions."
    ]
  },
  {
    title: "Narrative Builder",
    points: [
      "Distills the essence of a project, brand, or individual.",
      "Uses the 'Why, How, What' framework (Golden Circle).",
      "Generates key communication assets: elevator pitch, manifesto, interview talking points."
    ],
    design: "Based on Simon Sinek's 'Start With Why'. It forces a purpose-driven approach to communication, ensuring that the core message resonates on an emotional level before explaining the functional aspects.",
    synergy: [
      "The defined 'Why' can serve as a guiding principle for the Strategic Council.",
      "The resulting elevator pitch is a key component for the Value Proposition Arsenal.",
      "The manifesto can guide content creation for marketing campaigns."
    ],
    polymorphic: [
      "Artist: Defining their core message for a new album cycle.",
      "Author: Creating a compelling author platform and book proposal.",
      "Startup: Aligning the founding team and creating an investor pitch."
    ],
    kpis: [
      "Consistency of messaging across generated assets.",
      "Emotional resonance of the manifesto.",
      "Conciseness and impact of the elevator pitch."
    ],
    criticalConsiderations: [
      "Requires genuine introspection from the user.",
      "The 'Why' must be authentic to be effective."
    ]
  },
  {
    title: "Value Proposition Arsenal",
    points: [
        "Develops tailored value propositions for different stakeholders.",
        "Identifies core project strengths and objectives.",
        "Anticipates questions, objections, and potential 'red flags' from each stakeholder's perspective."
    ],
    design: "Moves beyond a one-size-fits-all value proposition. It's a strategic empathy tool, forcing the user to see their project through the eyes of others (investors, fans, critics, etc.) and prepare targeted arguments.",
    synergy: [
        "Provides highly specific input for the Strategic Council.",
        "The core proposition can be refined using the Narrative Builder.",
        "The anticipated 'red flags' are perfect inputs for the Extreme Internal Audit."
    ],
    polymorphic: [
        "Filmmaker: Pitching a project to producers, then to distributors.",
        "Musician: Negotiating a contract with a label, then explaining its value to their fanbase.",
        "Entrepreneur: Selling their vision to an investor, a potential key hire, and an early adopter customer."
    ],
    kpis: [
        "Specificity and relevance of stakeholder-specific messaging.",
        "Accuracy in anticipating potential questions and objections.",
        "Strength of the 'red flag' identification."
    ],
    criticalConsiderations: [
        "Requires a clear understanding of what different stakeholders value.",
        "Can reveal fundamental weaknesses in the project's core offering."
    ]
  },
  {
    title: "Extreme Internal Audit (The Forge)",
    points: [
      "A radical honesty and first-principles thinking tool.",
      "Subjects a core directive, strategy, or belief to a brutal, unfiltered audit.",
      "Identifies hidden assumptions, analyzes via inversion (what guarantees failure?), and evaluates second and third-order consequences."
    ],
    design: "Designed as an ego-killer and a logic-tester. It forces the user to defend their ideas against a purely rational and pessimistic adversary, thereby forging them into something stronger or revealing their fatal flaws.",
    synergy: [
      "The ultimate stress test for any recommendation from the Strategic Council.",
      "Can be used to audit the core 'Why' from the Narrative Builder.",
      "Perfect for examining the 'red flags' identified by the Value Proposition Arsenal."
    ],
    polymorphic: [
      "Company: Auditing its mission statement for logical consistency.",
      "Individual: Examining a core belief about their career path.",
      "Project Manager: Stress-testing the core premise of a high-stakes project."
    ],
    kpis: [
      "Number and depth of identified core assumptions.",
      "Severity and plausibility of identified failure modes.",
      "Actionability of the final 'critical failure points' verdict."
    ],
    criticalConsiderations: [
      "The user must be prepared for an uncomfortable and challenging output.",
      "Its value is directly proportional to the user's honesty in their input directive."
    ]
  }
];