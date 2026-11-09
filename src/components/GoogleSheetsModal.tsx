import React, { useState, useEffect } from 'react';
import { 
  X, 
  Table, 
  ExternalLink, 
  Plus, 
  FolderDown, 
  Check, 
  Copy, 
  AlertCircle, 
  FileSpreadsheet, 
  Sparkles, 
  RefreshCw,
  LogOut,
  ChevronRight,
  Database
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  googleSignIn, 
  logoutGoogle, 
  getAccessToken, 
  initAuth 
} from '../services/google-auth';
import { 
  createSpreadsheet, 
  listUserSpreadsheets, 
  getSpreadsheetDetails, 
  appendRowsToSpreadsheet,
  GoogleSpreadsheetItem,
  SpreadsheetDetails
} from '../services/google-sheets';
import { parseOcrTextToTable, ParsedTableData } from '../utils/sheets-helpers';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawText: string;
  documentTitle?: string;
  onImportToEditor?: (text: string, title: string) => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  rawText,
  documentTitle = 'OCR Document',
  onImportToEditor,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tabs: 'export' | 'browse'
  const [activeTab, setActiveTab] = useState<'export' | 'browse'>('export');

  // Export mode: 'new' | 'append'
  const [exportMode, setExportMode] = useState<'new' | 'append'>('new');
  const [sheetTitle, setSheetTitle] = useState(`OCR - ${documentTitle} (${new Date().toLocaleDateString()})`);
  
  // Parsed table data
  const [tableData, setTableData] = useState<ParsedTableData>(() => 
    parseOcrTextToTable(rawText, documentTitle)
  );

  // Existing spreadsheets state
  const [userSpreadsheets, setUserSpreadsheets] = useState<GoogleSpreadsheetItem[]>([]);
  const [isLoadingSheets, setIsLoadingSheets] = useState(false);
  const [selectedSpreadsheetId, setSelectedSpreadsheetId] = useState<string>('');
  const [selectedSheetDetails, setSelectedSheetDetails] = useState<SpreadsheetDetails | null>(null);
  const [selectedSheetTab, setSelectedSheetTab] = useState<string>('');

  // Confirmation modal state (Mandatory per Workspace Skill for mutating operations)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmActionType, setConfirmActionType] = useState<'create' | 'append'>('create');

  // Execution state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<{
    url: string;
    title: string;
    action: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Update parsed table data whenever rawText changes
  useEffect(() => {
    if (rawText) {
      setTableData(parseOcrTextToTable(rawText, documentTitle));
      setSheetTitle(`OCR - ${documentTitle} (${new Date().toLocaleDateString()})`);
    }
  }, [rawText, documentTitle]);

  // Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setIsAuthenticated(true);
        setUserEmail(user.email || null);
        setUserName(user.displayName || user.email || 'Google User');
        setUserPhoto(user.photoURL || null);
      },
      () => {
        setIsAuthenticated(false);
        setUserEmail(null);
        setUserName(null);
        setUserPhoto(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch spreadsheets once authenticated and browsing or appending
  useEffect(() => {
    if (isAuthenticated && (activeTab === 'browse' || exportMode === 'append')) {
      loadSpreadsheets();
    }
  }, [isAuthenticated, activeTab, exportMode]);

  const loadSpreadsheets = async () => {
    try {
      setIsLoadingSheets(true);
      setErrorMessage(null);
      const token = await getAccessToken();
      if (!token) return;
      const list = await listUserSpreadsheets(token);
      setUserSpreadsheets(list);
      if (list.length > 0 && !selectedSpreadsheetId) {
        setSelectedSpreadsheetId(list[0].id);
        fetchTabsForSpreadsheet(list[0].id);
      }
    } catch (err: any) {
      console.error('Error fetching spreadsheets:', err);
      setErrorMessage(err.message || 'Unable to load Google Sheets. Please ensure permissions are granted.');
    } finally {
      setIsLoadingSheets(false);
    }
  };

  const fetchTabsForSpreadsheet = async (sheetId: string) => {
    try {
      const token = await getAccessToken();
      if (!token) return;
      const details = await getSpreadsheetDetails(token, sheetId);
      setSelectedSheetDetails(details);
      if (details.sheets.length > 0) {
        setSelectedSheetTab(details.sheets[0].title);
      }
    } catch (err: any) {
      console.error('Error fetching sheet tabs:', err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoggingIn(true);
      setErrorMessage(null);
      const res = await googleSignIn();
      if (res) {
        setIsAuthenticated(true);
        setUserEmail(res.user.email);
        setUserName(res.user.displayName || res.user.email);
        setUserPhoto(res.user.photoURL);
      }
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      setErrorMessage(err.message || 'Google Sign-In failed or popup was closed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleSignOut = async () => {
    await logoutGoogle();
    setIsAuthenticated(false);
    setUserEmail(null);
    setSuccessResult(null);
  };

  // Step 1: Prompt user for confirmation before mutating/creating spreadsheet data
  const handleInitiateExport = (type: 'create' | 'append') => {
    setErrorMessage(null);
    setConfirmActionType(type);
    setShowConfirmDialog(true);
  };

  // Step 2: Execute after explicit user confirmation
  const handleConfirmedExport = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Google access token is missing or expired. Please sign in again.');
      }

      if (confirmActionType === 'create') {
        const res = await createSpreadsheet(
          token,
          sheetTitle,
          tableData.headers,
          tableData.rows
        );
        setSuccessResult({
          url: res.spreadsheetUrl,
          title: res.title,
          action: 'Created new spreadsheet',
        });
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } else {
        if (!selectedSpreadsheetId || !selectedSheetTab) {
          throw new Error('Please select an existing spreadsheet and target tab.');
        }

        const rowsToAppend = tableData.rows;
        await appendRowsToSpreadsheet(
          token,
          selectedSpreadsheetId,
          selectedSheetTab,
          rowsToAppend
        );

        const targetSheet = userSpreadsheets.find((s) => s.id === selectedSpreadsheetId);
        setSuccessResult({
          url: `https://docs.google.com/spreadsheets/d/${selectedSpreadsheetId}`,
          title: targetSheet?.name || 'Existing Spreadsheet',
          action: `Appended ${rowsToAppend.length} rows to "${selectedSheetTab}"`,
        });
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      console.error('Export error:', err);
      setErrorMessage(err.message || 'Export to Google Sheets failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (successResult?.url) {
      navigator.clipboard.writeText(successResult.url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-emerald-50/70 dark:bg-emerald-950/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Google Sheets Integration
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Export OCR extracted data directly into Google Sheets or browse existing sheets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Ribbon or Status */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          {isAuthenticated ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                {userPhoto ? (
                  <img src={userPhoto} alt="Google avatar" className="w-6 h-6 rounded-full border border-emerald-400" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                    G
                  </div>
                )}
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  Connected as <span className="font-bold text-emerald-600 dark:text-emerald-400">{userEmail || userName}</span>
                </span>
              </div>
              <button
                onClick={handleGoogleSignOut}
                className="flex items-center gap-1 text-slate-500 hover:text-red-600 transition-colors font-medium text-[11px]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-slate-500 dark:text-slate-400">
                Sign in with Google to export to Google Sheets with your account permission.
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        {isAuthenticated && (
          <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 pt-2 gap-2 bg-slate-100/40 dark:bg-slate-800/20 text-xs">
            <button
              onClick={() => { setActiveTab('export'); setSuccessResult(null); }}
              className={`pb-2.5 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'export'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Export OCR Data</span>
            </button>
            <button
              onClick={() => { setActiveTab('browse'); setSuccessResult(null); }}
              className={`pb-2.5 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'browse'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FolderDown className="w-3.5 h-3.5" />
              <span>My Google Drive Spreadsheets</span>
            </button>
          </div>
        )}

        {/* Modal Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Not Signed In: Official Google Material Sign-In Button */}
          {!isAuthenticated ? (
            <div className="py-8 px-4 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shadow-inner">
                <FileSpreadsheet className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Connect Your Google Account
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Export OCR receipts, invoices, and table scans directly to Google Sheets in your Google Drive with full user permission.
                </p>
              </div>

              {/* Official Google Material Button */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoggingIn}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                  <span>{isLoggingIn ? 'Connecting to Google...' : 'Sign in with Google'}</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                Uses official Google Sheets & Drive OAuth APIs with bank-grade TLS 1.3 token security.
              </div>
            </div>
          ) : successResult ? (
            /* Success State */
            <div className="py-8 px-4 text-center space-y-5 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center">
                <Check className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Export Successful!
                </h4>
                <p className="text-xs text-slate-500">
                  {successResult.action}: <strong className="text-slate-800 dark:text-slate-200">{successResult.title}</strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <a
                  href={successResult.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in Google Sheets</span>
                </a>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:border-emerald-500 transition-all flex items-center gap-1.5"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Sheet Link'}</span>
                </button>
                <button
                  onClick={() => setSuccessResult(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 transition-all"
                >
                  Export Another
                </button>
              </div>
            </div>
          ) : activeTab === 'export' ? (
            /* Export Workflow */
            <div className="space-y-5">
              {/* Destination Mode Selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setExportMode('new')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    exportMode === 'new'
                      ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs mb-1">
                    <Plus className="w-4 h-4 text-emerald-600" />
                    <span>Create New Spreadsheet</span>
                  </div>
                  <p className="text-[11px] opacity-80">
                    Generates a formatted Google Sheet in your Drive with frozen headers.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setExportMode('append')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    exportMode === 'append'
                      ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs mb-1">
                    <FolderDown className="w-4 h-4 text-emerald-600" />
                    <span>Append to Existing Sheet</span>
                  </div>
                  <p className="text-[11px] opacity-80">
                    Adds rows to an existing spreadsheet tab in your Google Drive.
                  </p>
                </button>
              </div>

              {/* Mode-Specific Settings */}
              {exportMode === 'new' ? (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Spreadsheet Name
                  </label>
                  <input
                    type="text"
                    value={sheetTitle}
                    onChange={(e) => setSheetTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter sheet title..."
                  />
                </div>
              ) : (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Select Target Spreadsheet
                    </label>
                    <button
                      onClick={loadSpreadsheets}
                      className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1 font-medium"
                    >
                      <RefreshCw className="w-3 h-3" /> Refresh
                    </button>
                  </div>

                  {isLoadingSheets ? (
                    <div className="text-center py-4 text-xs text-slate-400">Loading spreadsheets from Drive...</div>
                  ) : userSpreadsheets.length === 0 ? (
                    <div className="text-xs text-slate-500 italic">No spreadsheets found in your Google Drive.</div>
                  ) : (
                    <div className="space-y-2">
                      <select
                        value={selectedSpreadsheetId}
                        onChange={(e) => {
                          setSelectedSpreadsheetId(e.target.value);
                          fetchTabsForSpreadsheet(e.target.value);
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
                      >
                        {userSpreadsheets.map((sheet) => (
                          <option key={sheet.id} value={sheet.id}>
                            {sheet.name} (Modified: {new Date(sheet.modifiedTime).toLocaleDateString()})
                          </option>
                        ))}
                      </select>

                      {/* Sheet Tab Picker */}
                      {selectedSheetDetails && (
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mt-2 mb-1">
                            Target Tab / Sheet Name
                          </label>
                          <select
                            value={selectedSheetTab}
                            onChange={(e) => setSelectedSheetTab(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
                          >
                            {selectedSheetDetails.sheets.map((tab) => (
                              <option key={tab.sheetId} value={tab.title}>
                                {tab.title} ({tab.rowCount} rows)
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Data Preview Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Table className="w-3.5 h-3.5 text-emerald-600" />
                    Structured Table Preview ({tableData.rows.length} rows, {tableData.headers.length} columns)
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Auto-parsed from OCR layout
                  </span>
                </div>

                <div className="max-h-52 overflow-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-inner">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-emerald-600 text-white font-semibold sticky top-0">
                        {tableData.headers.map((h, i) => (
                          <th key={i} className="px-3 py-2 border-r border-emerald-500/50 last:border-r-0 whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                      {tableData.rows.slice(0, 10).map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-3 py-1.5 border-r border-slate-100 dark:border-slate-800/60 last:border-r-0 truncate max-w-[200px]">
                              {String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {tableData.rows.length > 10 && (
                    <div className="p-2 text-center text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800/30">
                      + {tableData.rows.length - 10} more rows
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleInitiateExport(exportMode === 'new' ? 'create' : 'append')}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>
                    {exportMode === 'new' ? 'Create Google Sheet' : 'Append to Google Sheet'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            /* Browse Google Drive Spreadsheets */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Spreadsheets in your Google Drive ({userSpreadsheets.length})
                </span>
                <button
                  onClick={loadSpreadsheets}
                  className="text-emerald-600 hover:underline flex items-center gap-1 font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh List
                </button>
              </div>

              {isLoadingSheets ? (
                <div className="text-center py-12 text-xs text-slate-400">Loading your spreadsheets...</div>
              ) : userSpreadsheets.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-400 space-y-2">
                  <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-300" />
                  <p>No spreadsheets found in your Google Drive.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 max-h-72 overflow-y-auto">
                  {userSpreadsheets.map((sheet) => (
                    <div
                      key={sheet.id}
                      className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                          <FileSpreadsheet className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                            {sheet.name}
                          </h5>
                          <span className="text-[10px] text-slate-400">
                            Modified: {new Date(sheet.modifiedTime).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {sheet.webViewLink && (
                          <a
                            href={sheet.webViewLink}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Open in Google Sheets"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => {
                            setSelectedSpreadsheetId(sheet.id);
                            setExportMode('append');
                            setActiveTab('export');
                            fetchTabsForSpreadsheet(sheet.id);
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                        >
                          Append OCR Data →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Confirmation Modal (MANDATORY for Workspace Destructive/Mutating Operations) */}
        {showConfirmDialog && (
          <div className="absolute inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center space-x-3 text-emerald-600">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Confirm Google Sheets Operation
                  </h4>
                  <p className="text-[11px] text-slate-500">Explicit User Authorization</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                <p className="text-slate-700 dark:text-slate-300">
                  {confirmActionType === 'create' ? (
                    <>
                      Create a new Google Spreadsheet titled <strong>"{sheetTitle}"</strong> in your Google Drive with <strong>{tableData.rows.length} rows</strong> of extracted OCR data?
                    </>
                  ) : (
                    <>
                      Append <strong>{tableData.rows.length} rows</strong> of extracted OCR data to tab <strong>"{selectedSheetTab}"</strong> in your selected spreadsheet?
                    </>
                  )}
                </p>
                <p className="text-[11px] text-slate-400">
                  This will use your Google Account permission to write to Google Sheets.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmDialog(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmedExport}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
                >
                  Confirm & Export
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
