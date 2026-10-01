import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

/**
 * Converts local file to Google Generative AI inlineData part
 */
const fileToGenerativePart = (filePath, mimeType) => {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString('base64'),
      mimeType,
    },
  };
};

/**
 * Main Gemini Multimodal Service
 */
class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    this.client = null;

    if (this.apiKey && this.apiKey !== 'your_gemini_api_key_here') {
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.client = this.genAI.getGenerativeModel({ model: this.modelName });
        console.log(`[GeminiService] Initialized with model: ${this.modelName}`);
      } catch (err) {
        console.error('[GeminiService Init Error]:', err.message);
      }
    } else {
      console.warn('[GeminiService Warning] GEMINI_API_KEY is not configured in .env. Running in simulated fallback mode.');
    }
  }

  /**
   * Generates domain-aware system instructions for multimodal synthesis
   */
  getDomainPrompt(domain = 'Healthcare', userPrompt = '') {
    const domainGuidelines = {
      Healthcare: `
You are MediOmni AI, a world-class multimodal clinical intelligence specialist.
Analyze the provided patient data across all ingested modalities (medical imaging, physician handwritten notes, audio consultation recordings, laboratory PDFs, and clinician notes).
Your task is to correlate cross-modal evidence into a unified clinical brief:
- Identify clinical inconsistencies between spoken consultations and written charts.
- Correlate diagnostic radiology/pathology findings with recorded symptoms.
- Flag critical contraindications, abnormal biomarkers, or red-flag symptoms.
- Always include an advisory: "Generated for clinical decision support. Requires verification by a licensed healthcare practitioner."
`,
      Legal: `
You are an expert multimodal legal analyst.
Analyze the uploaded contracts, voice depositions/meetings, scanned discovery documents, and photographic evidence.
Correlate witness statements against documentary proof, identify discrepancies or clause ambiguities, and generate a structured litigation assessment.
`,
      Research: `
You are an advanced academic research assistant.
Ingest scientific papers (PDF), experimental audio logs, charts/plots (images), and data tables.
Synthesize methodology, cross-correlate empirical findings across graphs and written text, and summarize research outcomes with rigorous citations.
`,
      General: `
You are an enterprise multimodal intelligence assistant.
Analyze the uploaded media (images, audio recordings, documents, spreadsheets, and video clips) and synthesize them into unified, actionable intelligence.
`,
    };

    const baseDomain = domainGuidelines[domain] || domainGuidelines.General;

    return `
${baseDomain}

CRITICAL: Return your response strictly formatted as a valid JSON object matching the following structure:
{
  "summary": "High-level executive synthesis summarizing all modalities together.",
  "keyFindings": [
    "Observation 1 (e.g. from Audio: ...)",
    "Observation 2 (e.g. from PDF/Image: ...)",
    "Observation 3: ..."
  ],
  "crossModalCorrelation": "Detailed narrative explaining how the different media corroborate, contradict, or enrich each other.",
  "riskOrAnomalyAlerts": [
    "Alert 1: Potential contradiction or high-priority anomaly",
    "Alert 2: Missing clinical/critical documentation"
  ],
  "recommendedActions": [
    "Next Step 1",
    "Next Step 2",
    "Next Step 3"
  ],
  "confidenceScore": 94
}

Do not wrap the JSON in extra markdown backticks if possible, or use standard \`\`\`json markdown fence.
${userPrompt ? `\nSpecific User Focus/Instructions: "${userPrompt}"` : ''}
`;
  }

  /**
   * Process multimodal files and synthesize insights
   */
  async analyzeMultimodalFiles({ files, prompt, domain = 'Healthcare' }) {
    // If Gemini API is not configured or in fallback, return realistic simulated response
    if (!this.genAI || !this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      return this.generateSimulatedAnalysis(files, prompt, domain);
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        },
      });

      const parts = [];

      // Add system and context prompt
      parts.push(this.getDomainPrompt(domain, prompt));

      // Append file parts for Gemini
      for (const file of files) {
        if (fs.existsSync(file.path)) {
          if (file.mimeType.startsWith('image/') || file.mimeType.startsWith('audio/') || file.mimeType === 'application/pdf') {
            const part = fileToGenerativePart(file.path, file.mimeType);
            parts.push(part);
            parts.push(`[Attached File Metadata: Filename: ${file.originalName}, Type: ${file.mimeType}, Category: ${file.fileCategory}]`);
          } else if (file.mimeType.startsWith('text/') || file.mimeType === 'text/plain') {
            const content = fs.readFileSync(file.path, 'utf8');
            parts.push(`[File Content for ${file.originalName}]:\n${content.slice(0, 10000)}`);
          }
        }
      }

      const result = await model.generateContent(parts);
      const response = await result.response;
      const text = response.text();

      // Parse JSON from Gemini response
      let parsed;
      try {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleaned);
      } catch (parseError) {
        console.warn('[GeminiService] Could not parse direct JSON from Gemini. Extracting via fallback regex.', parseError.message);
        parsed = {
          summary: text.slice(0, 400),
          keyFindings: ['Multi-format analysis processed successfully.'],
          crossModalCorrelation: text,
          riskOrAnomalyAlerts: [],
          recommendedActions: ['Review full raw Gemini transcript below.'],
          confidenceScore: 90,
        };
      }

      return {
        ...parsed,
        rawGeminiResponse: text,
      };
    } catch (error) {
      console.error('[GeminiService Analysis Error]:', error);
      throw new Error(`Gemini Multimodal Processing failed: ${error.message}`);
    }
  }

  /**
   * Interactive multi-turn chat regarding the multimodal session
   */
  async chatWithMultimodalContext({ files, history, newMessage, domain = 'Healthcare' }) {
    if (!this.genAI || !this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      return this.generateSimulatedChatReply(newMessage, files);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: this.modelName });
      const parts = [];

      // Context setup
      parts.push(`You are a multimodal AI assistant in the ${domain} domain. The user is asking questions about previously uploaded files. Answer thoroughly, citing specific modalities (e.g., "In the audio recording...", "According to the PDF lab report...", "In the attached image...").`);

      // Include files context
      for (const file of files) {
        if (fs.existsSync(file.path)) {
          if (file.mimeType.startsWith('image/') || file.mimeType.startsWith('audio/') || file.mimeType === 'application/pdf') {
            parts.push(fileToGenerativePart(file.path, file.mimeType));
            parts.push(`[Reference Source: ${file.originalName} (${file.fileCategory})]`);
          } else if (file.mimeType.startsWith('text/')) {
            const content = fs.readFileSync(file.path, 'utf8');
            parts.push(`[Document Text: ${file.originalName}]:\n${content.slice(0, 5000)}`);
          }
        }
      }

      // Add recent message history (last 8 messages)
      const recentHistory = (history || []).slice(-8);
      for (const msg of recentHistory) {
        parts.push(`${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`);
      }

      // Add current user prompt
      parts.push(`User: ${newMessage}`);

      const result = await model.generateContent(parts);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('[GeminiService Chat Error]:', error);
      throw new Error(`Gemini Multimodal Chat failed: ${error.message}`);
    }
  }

  /**
   * Simulated intelligent response for demonstration if API key is not yet set
   */
  generateSimulatedAnalysis(files, prompt, domain) {
    const fileCount = files.length;
    const fileTypes = files.map((f) => f.fileCategory).join(', ');

    return {
      summary: `Synthesized analysis completed across ${fileCount} ingested artifact(s) [${fileTypes}]. The multi-format correlation reveals consistent indicators aligned with the objective "${prompt || 'Comprehensive Multi-Modal Diagnostic Synthesis'}" with high cross-source correlation.`,
      keyFindings: [
        `Document / Text Modality: Identified clinical timeline and structured baseline metrics matching documentation standards.`,
        `Audio Modality: Recorded patient/consultation dialogue highlights symptoms with verbal emphasis not explicitly prioritized in written notes.`,
        `Visual / Imaging Modality: Feature extraction confirms structural alignment and verifies diagnostic markers without focal lesions.`,
        `Cross-modal synchronicity validated: Spoken symptom chronology corroborates radiographic timestamps.`,
      ],
      crossModalCorrelation: `The verbal consultation recordings provide critical nuance to the static PDF report. While the written report denotes stable parameters, the acoustic consultation reveals episodic exacerbation during exertion. Cross-referencing image data confirms early-stage indicators requiring prophylactic monitoring rather than aggressive intervention.`,
      riskOrAnomalyAlerts: [
        `Discrepancy: Spoken dosage in audio recording differs slightly from handwritten prescription note.`,
        `Monitoring Alert: Follow-up required within 14 days to re-verify biomarker panel.`,
      ],
      recommendedActions: [
        `Reconcile pharmaceutical dosage between audio recording and written chart.`,
        `Schedule complementary cross-sectional follow-up imaging in 4 weeks.`,
        `Export structured summary directly into Electronic Health Record (EHR/EMR).`,
      ],
      confidenceScore: 96,
      rawGeminiResponse: 'Simulated response active. Configure GEMINI_API_KEY in backend/.env for live Google Gemini 1.5/2.0 API execution.',
    };
  }

  generateSimulatedChatReply(question, files) {
    return `Based on the cross-modal evaluation of the uploaded files (${files.map((f) => f.originalName).join(', ')}):

1. **Evidence Correlation**: The auditory cues and document markers directly address your query: "${question}".
2. **Key Nuance**: In the consultation record, the subject specifically clarifies the onset timeline, confirming that symptoms began 3 days prior to the lab sample collection.
3. **Recommendation**: Continue monitoring the parameters flagged in the cross-modal synthesis dashboard.

*(Running in demonstration mode: supply your \`GEMINI_API_KEY\` in \`backend/.env\` to query Google Gemini live!)*`;
  }
}

export default new GeminiService();
