// Definition of attributes and simplified levels
const attributes = {
  precision: {
    name: "AI Diagnostic Accuracy",
    levels: [
      "Moderate (approx. 85%)",
      "High (95% or higher)"
    ]
  },
  explainability: {
    name: "AI Explainability",
    levels: [
      "Does not explain the result (black box)",
      "Explains the result understandably"
    ]
  },
  validation: {
    name: "AI Clinical Validation",
    levels: [
      "Low scientific evidence",
      "High scientific evidence"
    ]
  },
  control: {
    name: "Professional Control of AI",
    levels: [
      "Provides recommendations",
      "Makes automatic decisions"
    ]
  },
  transparency: {
    name: "Transparency about AI limitations",
    levels: [
      "Does not inform about limitations or error rates",
      "Informs about limitations and error rates"
    ]
  }
};

// Definition of the 5 TASKS (Comparison between 3 systems)
// Indices: 0 is the first level, 1 is the second level (see above)
const comparisons = [
  {
    id: 1,
    title: "TASK 1 OF 5",
    systemA: { precision: 1, explainability: 1, validation: 1, control: 1, transparency: 1 },
    systemB: { precision: 1, explainability: 1, validation: 1, control: 0, transparency: 1 },
    systemC: { precision: 1, explainability: 0, validation: 1, control: 1, transparency: 1 }
  },
  {
    id: 2,
    title: "TASK 2 OF 5",
    systemA: { precision: 1, explainability: 0, validation: 0, control: 1, transparency: 1 },
    systemB: { precision: 0, explainability: 0, validation: 1, control: 1, transparency: 0 },
    systemC: { precision: 0, explainability: 1, validation: 1, control: 1, transparency: 0 }
  },
  {
    id: 3,
    title: "TASK 3 OF 5",
    systemA: { precision: 1, explainability: 0, validation: 0, control: 0, transparency: 1 },
    systemB: { precision: 0, explainability: 1, validation: 0, control: 0, transparency: 1 },
    systemC: { precision: 1, explainability: 1, validation: 1, control: 1, transparency: 0 }
  },
  {
    id: 4,
    title: "TASK 4 OF 5",
    systemA: { precision: 1, explainability: 1, validation: 1, control: 0, transparency: 0 },
    systemB: { precision: 0, explainability: 1, validation: 0, control: 0, transparency: 0 },
    systemC: { precision: 0, explainability: 0, validation: 0, control: 1, transparency: 0 }
  },
  {
    id: 5,
    title: "TASK 5 OF 5",
    systemA: { precision: 0, explainability: 0, validation: 0, control: 0, transparency: 1 },
    systemB: { precision: 0, explainability: 0, validation: 1, control: 0, transparency: 0 },
    systemC: { precision: 1, explainability: 1, validation: 0, control: 0, transparency: 1 }
  }
];

// Function to get system description
function getSystemDescription(system) {
  return {
    precision: attributes.precision.levels[system.precision],
    explainability: attributes.explainability.levels[system.explainability],
    validation: attributes.validation.levels[system.validation],
    control: attributes.control.levels[system.control],
    transparency: attributes.transparency.levels[system.transparency]
  };
}
