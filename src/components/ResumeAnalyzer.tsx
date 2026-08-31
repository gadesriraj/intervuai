import { createWorker } from 'tesseract.js';
import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
import { NavView, ResumeAnalysisResult } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  ArrowRight,
  RefreshCw,
  FileCode,
  ShieldCheck
} from 'lucide-react';

interface ResumeAnalyzerProps {
  setCurrentView: (view: NavView) => void;
}

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({ setCurrentView }) => {
  const { user, updateProfile } = useAuth();

  const [resumeText, setResumeText] = useState(user?.resumeText || '');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] =
  useState<ResumeAnalysisResult | null>(null);

const handleAnalyze = async () => {
  if (!resumeText.trim()) {
    alert('Please enter or upload your resume first.');
    return;
  }

  setLoading(true);
  setAnalysisResult(null);

  try {
    const res = await fetch('/api/resume/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeText,
        fileName: 'Candidate_Resume.pdf',
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data?.details ||
        data?.error ||
        `Resume analysis failed with status ${res.status}`
      );
    }

    if (!data || typeof data.resumeScore !== 'number') {
      throw new Error('The AI returned an invalid resume analysis.');
    }

    setAnalysisResult(data);

    updateProfile({
      resumeText,
      resumeScore: data.resumeScore,
      skills: data.extractedSkills || user?.skills,
    });

  } catch (err) {
    console.error('Resume analysis failed:', err);

    alert(
      err instanceof Error
        ? err.message
        : 'Resume analysis failed. Please check your Gemini API configuration.'
    );
  } finally {
    setLoading(false);
  }
};
const handleFileUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (file.type !== 'application/pdf') {
    alert('Please upload a PDF resume.');
    e.target.value = '';
    return;
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  if (file.size > MAX_FILE_SIZE) {
    alert('Resume file must be smaller than 5 MB.');
    e.target.value = '';
    return;
  }

  setLoading(true);
  setAnalysisResult(null);

  try {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise;

    let extractedText = '';

    // --------------------------------------------------
    // STEP 1: Try normal PDF text extraction
    // --------------------------------------------------

    for (
      let pageNumber = 1;
      pageNumber <= pdf.numPages;
      pageNumber++
    ) {
      const page = await pdf.getPage(pageNumber);

      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item: any) =>
          typeof item.str === 'string' ? item.str : ''
        )
        .join(' ');

      extractedText += pageText + '\n\n';
    }

    extractedText = extractedText.trim();

    // --------------------------------------------------
    // STEP 2: If normal extraction failed, use OCR
    // --------------------------------------------------

    if (extractedText.length < 200) {
      console.log(
        'Very little PDF text detected. Starting OCR...'
      );

      const worker = await createWorker('eng');

      let ocrText = '';

      for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
      ) {
        console.log(
          `OCR processing page ${pageNumber}/${pdf.numPages}`
        );

        const page = await pdf.getPage(pageNumber);

        const viewport = page.getViewport({
          scale: 2,
        });

        const canvas = document.createElement('canvas');

        const context = canvas.getContext('2d');

        if (!context) {
          throw new Error(
            'Unable to create canvas for OCR.'
          );
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        const image = canvas.toDataURL('image/png');

        const result = await worker.recognize(image);

        ocrText += result.data.text + '\n\n';

        canvas.remove();
      }

      await worker.terminate();

      extractedText = ocrText.trim();
    }

    // --------------------------------------------------
    // STEP 3: Validate extracted content
    // --------------------------------------------------

    if (!extractedText) {
      throw new Error(
        'Unable to extract readable text from this PDF.'
      );
    }

    if (extractedText.length < 50) {
      throw new Error(
        'The PDF does not contain enough readable resume content.'
      );
    }

    console.log(
      'Extracted resume characters:',
      extractedText.length
    );

    console.log(
      'Extracted resume text:',
      extractedText
    );

    setResumeText(extractedText);

    alert(
      `Resume uploaded successfully.\n\n${pdf.numPages} page(s) processed.`
    );

  } catch (error) {
    console.error(
      'PDF extraction/OCR failed:',
      error
    );

    alert(
      error instanceof Error
        ? error.message
        : 'Unable to read this PDF.'
    );

  } finally {
    setLoading(false);
  }
};
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900  flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" /> AI Resume Readiness & Skill Extractor
          </h1>
          <p className="text-xs text-slate-500  mt-1">
            Gemini AI parses your resume text, identifies high-impact keywords, scores your readiness, and customizes mock interview questions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600  bg-emerald-50  px-3 py-1.5 rounded-xl border border-emerald-200 ">
          <ShieldCheck className="w-4 h-4" /> 100% Private Parsing
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input Text & File Upload */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white  border border-slate-200  shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900  uppercase tracking-wider">
                Resume Content / Plain Text
              </label>

              <label className="cursor-pointer text-xs font-semibold text-indigo-600  hover:underline flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload File ( application/pdf , .pdf text)
                 <input
  type="file"
  accept="application/pdf,.pdf"
  onChange={handleFileUpload}
  className="hidden"
/> 
              </label>
            </div>

            <textarea
              rows={14}
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              placeholder="Paste your resume plain text or project experience here (Education, Experience, Technical Skills, Projects)..."
              className="w-full p-4 bg-slate-50  border border-slate-200  rounded-xl text-xs font-mono text-slate-900  focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-none"
            />

            <button
              onClick={handleAnalyze}
              disabled={loading || !resumeText.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Resume with Gemini AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate AI Resume Audit
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Analysis Report Output */}
        <div>
          {analysisResult ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Score Gauge */}
              <div className="p-6 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                    AI Resume Score
                  </span>
                  <div className="text-4xl font-black mt-1">
                    {analysisResult.resumeScore}<span className="text-lg text-slate-400 font-normal">/100</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-xs leading-normal">
                    {analysisResult.summary}
                  </p>
                </div>

                <div className="w-20 h-20 rounded-2xl bg-indigo-900/60 border border-indigo-700/50 flex items-center justify-center text-indigo-400 shadow-inner">
                  <Award className="w-10 h-10" />
                </div>
              </div>

              {/* Extracted Skills */}
              <div className="p-5 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900  flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Extracted Technical Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.extractedSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-indigo-50  text-indigo-700  border border-indigo-200  text-xs font-semibold"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Detected Weak Areas */}
              <div className="p-5 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600  flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Detected Resume Gaps
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700 ">
                  {analysisResult.detectedWeakAreas.map((wa, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{wa}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actionable Improvements */}
              <div className="p-5 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600  flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Actionable Bullet Point Improvements
                </h3>
                <ul className="space-y-2 text-xs text-slate-700 ">
                  {analysisResult.suggestedImprovements.map((imp, idx) => (
                    <li key={idx} className="p-2.5 rounded-xl bg-slate-50  border border-slate-100 ">
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Launch Tailored Mock Interview CTA */}
              <button
                onClick={() => setCurrentView('interview-setup')}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 text-xs flex items-center justify-center gap-2 transition-all"
              >
                Launch Tailored Mock Interview from Resume Skills <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-50  border border-dashed border-slate-300  text-center text-slate-500  space-y-3">
              <FileCode className="w-10 h-10 mx-auto text-slate-400" />
              <p className="text-sm font-semibold text-slate-800 ">
                No Resume Analyzed Yet
              </p>
              <p className="text-xs max-w-xs mx-auto">
                Paste your resume text on the left and click "Generate AI Resume Audit" to view score breakdowns and gap analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
