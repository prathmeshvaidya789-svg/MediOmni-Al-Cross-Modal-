export const sampleSessions = [
  {
    _id: "ses_demo_cardio_pulmonary_001",
    title: "Cardiopulmonary Multimodal Diagnostic Panel",
    domain: "Healthcare",
    createdAt: new Date().toISOString(),
    files: [
      {
        filename: "Chest_CT_Angiogram_HighRes.dcm",
        originalName: "Chest_CT_Angiogram_HighRes.dcm",
        fileCategory: "image",
        size: 14200000,
        path: "Chest_CT_Angiogram_HighRes.dcm"
      },
      {
        filename: "Comprehensive_Metabolic_Panel_Lab.pdf",
        originalName: "Comprehensive_Metabolic_Panel_Lab.pdf",
        fileCategory: "document",
        size: 245000,
        path: "Comprehensive_Metabolic_Panel_Lab.pdf"
      },
      {
        filename: "Physician_Voice_Consultation_Note.mp3",
        originalName: "Physician_Voice_Consultation_Note.mp3",
        fileCategory: "audio",
        size: 3120000,
        path: "Physician_Voice_Consultation_Note.mp3"
      }
    ],
    prompt: "Evaluate acute dyspnea exacerbation correlating chest imaging with pulmonary acoustic cues and serum D-dimer biomarkers.",
    aiAnalysis: {
      summary: "Multi-modality concordance indicates early stage pulmonary congestion with reactive ground-glass attenuations in the lower left pulmonary lobe. The acoustic consultation note corroborates progressive exertional dyspnea (NYHA Class II-III) that was uncaptured in baseline EHR documentation.",
      keyFindings: [
        "Acoustic Auscultation Analysis: Fine inspiratory crackles detected at bilateral bases, prominent on left post-exertion.",
        "Diagnostic Radiology (CT): Trace pleural effusion with subsegmental atelectasis in the left basilar zone without focal consolidations.",
        "Biochemical Lab Panel: Elevated D-dimer (0.82 µg/mL FEU) and elevated BNP (380 pg/mL); normal renal clearance panel.",
        "Prescription Chart Cross-Check: Verified ACE-inhibitor dosage matching electronic medical record."
      ],
      crossModalCorrelation: "High cross-source concordant signal detected across acoustic consultation, high-resolution CT imaging, and biochemical laboratory markers. Acoustic auscultation timestamps perfectly align with CT atelectatic zones, confirming localized reactive congestion.",
      riskOrAnomalyAlerts: [
        "Elevated BNP (380 pg/mL) indicates ventricular strain secondary to mild volume overload.",
        "Mild exertional oxygen desaturation (93% on room air noted in audio consultation)."
      ],
      recommendedActions: [
        "Initiate low-dose loop diuretic therapy under close nephrologic monitoring.",
        "Order repeat transthoracic echocardiogram (TTE) within 72 hours to assess ejection fraction.",
        "Schedule continuous telemetry monitoring and recheck serum electrolytes in 24 hours.",
        "Export comprehensive multimodal diagnostic summary to hospital Epic/Cerner EHR."
      ],
      confidenceScore: 98,
      rawGeminiResponse: "Multimodal clinical reasoning generated via Google Gemini 1.5 Pro Cross-Modal Pipeline."
    },
    messages: [
      {
        role: "assistant",
        content: "**Executive Synthesis:**\nMulti-modality concordance indicates early stage pulmonary congestion with reactive ground-glass attenuations in the lower left pulmonary lobe. The acoustic consultation note corroborates progressive exertional dyspnea (NYHA Class II-III).\n\n**Cross-Modal Correlation:**\nHigh cross-source concordant signal detected across acoustic consultation, high-resolution CT imaging, and biochemical laboratory markers.",
        fileReferences: [
          "Chest_CT_Angiogram_HighRes.dcm",
          "Comprehensive_Metabolic_Panel_Lab.pdf",
          "Physician_Voice_Consultation_Note.mp3"
        ],
        timestamp: new Date().toISOString()
      },
      {
        role: "user",
        content: "What did the audio recording reveal that was missing from the lab PDF?",
        timestamp: new Date(Date.now() - 300000).toISOString()
      },
      {
        role: "assistant",
        content: "Based on the acoustic consultation recording (`Physician_Voice_Consultation_Note.mp3`):\n\n1. **Acoustic Nuance**: Inspiratory crackles were audible during exertion, whereas the written lab report only reported static resting vitals.\n2. **Symptom Chronology**: The patient verbally stated the dyspnea attacks occur specifically after 5-10 minutes of walking, demonstrating exertional orthopnea not captured in the static lab paperwork.\n3. **Recommendation**: Prioritize low-dose loop diuretic therapy and order repeat TTE as recommended.",
        fileReferences: [
          "Physician_Voice_Consultation_Note.mp3"
        ],
        timestamp: new Date(Date.now() - 240000).toISOString()
      }
    ],
    status: "completed"
  }
];
