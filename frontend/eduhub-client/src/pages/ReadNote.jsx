
// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import { summarizePDF } from "../api/ai";

// // pdfjs build + worker 
// import * as pdfjsLib from "pdfjs-dist/build/pdf";
// import pdfWorker from "pdfjs-dist/build/pdf.worker.js?url";
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// export default function ReadNote() {
//   const { id } = useParams();
//   const navigate = useNavigate?.bind?.(null) || (() => {});
//   const [note, setNote] = useState(null);

//   // PDF state
//   const [pdfDoc, setPdfDoc] = useState(null);
//   const [pageCount, setPageCount] = useState(0);
//   const [pageNum, setPageNum] = useState(1);
//   const [zoom, setZoom] = useState(1.15);
//   const [twoPage, setTwoPage] = useState(false);
//   const [thumbnailsReady, setThumbnailsReady] = useState(false);

//   // Refs
//   const leftCanvasRef = useRef(null);
//   const rightCanvasRef = useRef(null);
//   const thumbsRef = useRef({});
//   const containerRef = useRef(null);

//   // Text + TTS
//   const [pageText, setPageText] = useState("");
//   const [sentences, setSentences] = useState([]);
//   const [currentSentence, setCurrentSentence] = useState(null);
//   const [reading, setReading] = useState(false);
//   const [rate, setRate] = useState(1.0);
//   const [voices, setVoices] = useState([]);
//   const [selectedVoice, setSelectedVoice] = useState(null);
//   const utterRef = useRef(null);
//   const tts = typeof window !== "undefined" ? window.speechSynthesis : null;

//   // Bookmarks & annotations
//   const [bookmarks, setBookmarks] = useState([]);
//   const [annotations, setAnnotations] = useState([]);
//   const [selectedAnnotation, setSelectedAnnotation] = useState(null);

//   // Search
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchCount, setSearchCount] = useState(0);

//   // UI states
//   const [loading, setLoading] = useState(true);
//   const [thumbLoading, setThumbLoading] = useState(false);

//   // AI & Notes
//   const [aiSummary, setAiSummary] = useState("");
//   const [aiLoading, setAiLoading] = useState(false);
//   const [userNotes, setUserNotes] = useState(() => {
//     try {
//       return localStorage.getItem(`notes-${id}`) || "";
//     } catch {
//       return "";
//     }
//   });

//   // --- Load note metadata & PDF ---
//   useEffect(() => {
//     let cancelled = false;
//     async function load() {
//       try {
//         setLoading(true);
//         const res = await axios.get(`http://127.0.0.1:5000/api/notes/${id}`);
//         if (cancelled) return;
//         setNote(res.data);

//         if (!res.data.file_url) {
//           setLoading(false);
//           return;
//         }

//         const loadingTask = pdfjsLib.getDocument(res.data.file_url);
//         const pdf = await loadingTask.promise;
//         setPdfDoc(pdf);
//         setPageCount(pdf.numPages);

//         // load last page saved in backend
//         try {
//           const last = await axios.get(`http://127.0.0.1:5000/api/notes/${id}/lastpage`);
//           if (last?.data?.last_page) {
//             setPageNum(Number(last.data.last_page));
//           }
//         } catch (e) {
//           // ignore
//         }
//       } catch (err) {
//         console.error("Failed to load note/pdf", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//     return () => { cancelled = true; };
//   }, [id]);

//   // --- Setup TTS voices ---
//   useEffect(() => {
//     if (!tts) return;
//     function update() {
//       const v = tts.getVoices?.() || [];
//       setVoices(v);
//       if (v.length && !selectedVoice) setSelectedVoice(v[0].name);
//     }
//     update();
//     window.speechSynthesis.onvoiceschanged = update;
//     return () => { window.speechSynthesis.onvoiceschanged = null; };
//   }, [selectedVoice]);

//   // --- When pdfDoc or page changes: render, thumbnails, load side data ---
//   useEffect(() => {
//     if (!pdfDoc) return;

//     (async () => {
//       await renderPages();
//       if (!thumbnailsReady) {
//         generateThumbnails();
//         setThumbnailsReady(true);
//       }

//       // load bookmarks & annotations for this note
//       loadBookmarks();
//       loadAnnotations();

//       // extract text for current pages
//       const leftText = await extractTextFromPage(pageNum);
//       let combined = leftText || "";
//       if (twoPage && pageNum + 1 <= pageCount) {
//         const rightText = await extractTextFromPage(pageNum + 1);
//         if (rightText) combined += "\n\n" + rightText;
//       }
//       setPageText(combined);
//       setSentences(splitIntoSentences(combined));

//       // save last page
//       debouncedSaveLastPage(pageNum);
//     })();

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pdfDoc, pageNum, zoom, twoPage]);

//   // --- Persist user notes locally ---
//   useEffect(() => {
//     try {
//       localStorage.setItem(`notes-${id}`, userNotes);
//     } catch {
//       // ignore
//     }
//   }, [userNotes, id]);

//   // Debounce last-page saving (simple)
//   const saveLastPage = async (p) => {
//     try {
//       await axios.post(`http://127.0.0.1:5000/api/notes/${id}/lastpage`, { page: p });
//     } catch {
//       // ignore
//     }
//   };
//   let lastPageTimer = useRef(null);
//   function debouncedSaveLastPage(p) {
//     if (lastPageTimer.current) clearTimeout(lastPageTimer.current);
//     lastPageTimer.current = setTimeout(() => saveLastPage(p), 500);
//   }

//   // --- Render helpers ---
//   async function renderPages() {
//     try {
//       await renderToCanvas(pageNum, leftCanvasRef.current, zoom);
//       if (twoPage && pageNum + 1 <= pageCount) {
//         await renderToCanvas(pageNum + 1, rightCanvasRef.current, zoom);
//       } else if (rightCanvasRef.current) {
//         const ctx = rightCanvasRef.current.getContext("2d");
//         ctx.clearRect(0, 0, rightCanvasRef.current.width, rightCanvasRef.current.height);
//       }
//     } catch (e) {
//       console.error("renderPages error", e);
//     }
//   }

//   async function renderToCanvas(pageNumber, canvasEl, scale) {
//     if (!pdfDoc || !canvasEl) return;
//     try {
//       const page = await pdfDoc.getPage(pageNumber);
//       const viewport = page.getViewport({ scale });
//       const canvas = canvasEl;
//       const ctx = canvas.getContext("2d");
//       const ratio = window.devicePixelRatio || 1;
//       canvas.width = Math.floor(viewport.width * ratio);
//       canvas.height = Math.floor(viewport.height * ratio);
//       canvas.style.width = `${Math.floor(viewport.width)}px`;
//       canvas.style.height = `${Math.floor(viewport.height)}px`;
//       ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       await page.render({ canvasContext: ctx, viewport }).promise;
//     } catch (err) {
//       console.error("renderToCanvas", err);
//     }
//   }

//   // --- Thumbnails ---
//   async function generateThumbnails() {
//     if (!pdfDoc) return;
//     setThumbLoading(true);
//     for (let p = 1; p <= pdfDoc.numPages; p++) {
//       try {
//         const page = await pdfDoc.getPage(p);
//         const scale = 0.12;
//         const viewport = page.getViewport({ scale });
//         let c = thumbsRef.current[p];
//         if (!c) {
//           c = document.createElement("canvas");
//           thumbsRef.current[p] = c;
//         }
//         c.width = Math.floor(viewport.width);
//         c.height = Math.floor(viewport.height);
//         await page.render({ canvasContext: c.getContext("2d"), viewport }).promise;
//       } catch (e) {
//         // continue
//       }
//     }
//     setThumbLoading(false);
//   }
//   function thumbData(p) {
//     const c = thumbsRef.current[p];
//     return c ? c.toDataURL() : null;
//   }

//   // --- Text extraction ---
//   async function extractTextFromPage(p) {
//     if (!pdfDoc) return "";
//     try {
//       const pg = await pdfDoc.getPage(p);
//       const content = await pg.getTextContent();
//       const text = content.items.map(i => i.str).join(" ");
//       return text;
//     } catch (e) {
//       return "";
//     }
//   }
//   function splitIntoSentences(text) {
//     if (!text) return [];
//     const norm = text.replace(/\s+/g, " ").trim();
//     if (!norm) return [];
//     const parts = norm.match(/[^.!?]+[.!?]?/g) || [norm];
//     return parts.map(s => s.trim()).filter(Boolean);
//   }

//   // --- TTS controls ---
//   function speakSentenceIndex(idx) {
//     if (!tts) return;
//     if (!sentences[idx]) return;
//     tts.cancel();
//     const utt = new SpeechSynthesisUtterance(sentences[idx]);
//     if (selectedVoice) {
//       const v = voices.find(vv => vv.name === selectedVoice);
//       if (v) utt.voice = v;
//     }
//     utt.rate = rate;
//     utt.onend = () => setReading(false);
//     utterRef.current = utt;
//     setCurrentSentence(idx);
//     setReading(true);
//     tts.speak(utt);
//   }
//   function startReadAll() {
//     if (!tts) return;
//     if (!sentences.length) return;
//     setReading(true);
//     let i = 0;
//     const playNext = () => {
//       if (i >= sentences.length) {
//         setReading(false);
//         setCurrentSentence(null);
//         return;
//       }
//       const s = new SpeechSynthesisUtterance(sentences[i]);
//       if (selectedVoice) {
//         const v = voices.find(vv => vv.name === selectedVoice);
//         if (v) s.voice = v;
//       }
//       s.rate = rate;
//       s.onend = () => { i++; setCurrentSentence(i); setTimeout(playNext, 120); };
//       utterRef.current = s;
//       tts.cancel();
//       tts.speak(s);
//     };
//     playNext();
//   }
//   function stopReading() {
//     if (!tts) return;
//     tts.cancel();
//     setReading(false);
//     setCurrentSentence(null);
//   }

//   // --- Bookmarks API ---
//   async function loadBookmarks() {
//     try {
//       const res = await axios.get(`http://127.0.0.1:5000/api/notes/${id}/bookmarks`);
//       setBookmarks(res.data || []);
//     } catch (e) {
//       setBookmarks([]);
//     }
//   }
//   async function addBookmark() {
//     try {
//       await axios.post(`http://127.0.0.1:5000/api/notes/${id}/bookmarks`, { page: pageNum, title: `Page ${pageNum}` });
//       await loadBookmarks();
//     } catch (e) { /* ignore */ }
//   }
//   async function delBookmark(bid) {
//     try {
//       await axios.delete(`http://127.0.0.1:5000/api/notes/${id}/bookmarks`, { data: { id: bid } });
//       await loadBookmarks();
//     } catch (e) { /* ignore */ }
//   }

//   // --- Annotations API ---
//   async function loadAnnotations() {
//     try {
//       const res = await axios.get(`http://127.0.0.1:5000/api/notes/${id}/annotations`);
//       setAnnotations(res.data || []);
//     } catch (e) {
//       setAnnotations([]);
//     }
//   }
//   async function saveAnnotation(page, x_pct, y_pct, text) {
//     try {
//       await axios.post(`http://127.0.0.1:5000/api/notes/${id}/annotations`, { page, x_pct, y_pct, text });
//       await loadAnnotations();
//     } catch (e) { /* ignore */ }
//   }
//   async function deleteAnnotation(aid) {
//     try {
//       await axios.delete(`http://127.0.0.1:5000/api/notes/${id}/annotations`, { data: { id: aid } });
//       await loadAnnotations();
//       setSelectedAnnotation(null);
//     } catch (e) { /* ignore */ }
//   }

//   function onCanvasClick(e, pageIndex) {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = (e.clientX - rect.left) / rect.width;
//     const y = (e.clientY - rect.top) / rect.height;
//     const txt = window.prompt("Annotation text:");
//     if (!txt) return;
//     saveAnnotation(pageIndex, x, y, txt);
//   }

//   // --- Save last page (debounced above) ---
//   // debouncedSaveLastPage(pageNum) is called elsewhere

//   // --- Search ---
//   function runSearch() {
//     if (!searchTerm) {
//       setSearchCount(0);
//       return;
//     }
//     const low = (pageText || "").toLowerCase();
//     const term = searchTerm.toLowerCase();
//     let idx = low.indexOf(term);
//     let count = 0;
//     while (idx !== -1) {
//       count++;
//       idx = low.indexOf(term, idx + term.length);
//     }
//     setSearchCount(count);
//   }

//   // --- Navigation helpers ---
//   function nextPage() {
//     const step = twoPage ? 2 : 1;
//     if (pageNum + step <= pageCount) setPageNum(pageNum + step);
//   }
//   function prevPage() {
//     const step = twoPage ? 2 : 1;
//     if (pageNum - step >= 1) setPageNum(pageNum - step);
//   }

//   // keyboard shortcuts
//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "ArrowRight") nextPage();
//       if (e.key === "ArrowLeft") prevPage();
//       if (e.key === " " ) { e.preventDefault(); reading ? stopReading() : startReadAll(); }
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [reading, pageNum, twoPage, pageText]);

//   // --- AI Summary (calls your backend which should call OpenAI) ---
//   async function generateSummary(scope = "page") {
//     // scope: "page" or "full"
//     try {
//       setAiLoading(true);
//       setAiSummary("");
//       const payload = {
//         note_id: id,
//         scope,
//         page: pageNum,
//         text: scope === "page" ? pageText : undefined
//       };
//       const res = await axios.post(`http://127.0.0.1:5000/api/ai/summary`, payload, { timeout: 120000 });
//       setAiSummary(res?.data?.summary || "No summary returned.");
//     } catch (e) {
//       console.error("AI summary error", e);
//       setAiSummary("❗ Error generating summary. Check backend logs.");
//     } finally {
//       setAiLoading(false);
//     }
//   }

//   function insertSummaryIntoNotes() {
//     if (!aiSummary) return;
//     setUserNotes(prev => (prev ? prev + "\n\n" : "") + aiSummary);
//   }

//   // Annotation overlays rendering
//   function overlaysForPage(p) {
//     return annotations.filter(a => Number(a.page) === Number(p)).map(a => {
//       const style = {
//         position: "absolute",
//         left: `${a.x_pct * 100}%`,
//         top: `${a.y_pct * 100}%`,
//         transform: "translate(-50%, -50%)",
//         zIndex: 60,
//         background: "rgba(255,250,240,0.95)",
//         borderRadius: 6,
//         padding: "4px 6px",
//         boxShadow: "0 6px 14px rgba(0,0,0,0.12)"
//       };
//       return (
//         <button key={a.id} style={style} onClick={() => setSelectedAnnotation(a)} title={a.text}>
//           🗒
//         </button>
//       );
//     });
//   }

//   function AnnotationPopup() {
//     if (!selectedAnnotation) return null;
//     const a = selectedAnnotation;
//     return (
//       <div style={{
//         position: "fixed", right: 22, bottom: 22, zIndex: 4000,
//         width: 300, background: "rgba(255,255,255,0.98)", borderRadius: 12, padding: 14,
//         boxShadow: "0 12px 40px rgba(0,0,0,0.12)"
//       }}>
//         <div style={{ fontWeight: 700, marginBottom: 8 }}>Annotation — Page {a.page}</div>
//         <div style={{ marginBottom: 10 }}>{a.text}</div>
//         <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
//           <button onClick={() => { setPageNum(Number(a.page)); setSelectedAnnotation(null); }} style={{ padding: "8px 10px", borderRadius: 8 }}>Go</button>
//           <button onClick={() => deleteAnnotation(a.id)} style={{ padding: "8px 10px", borderRadius: 8, background: "#fee2e2" }}>Delete</button>
//           <button onClick={() => setSelectedAnnotation(null)} style={{ padding: "8px 10px", borderRadius: 8 }}>Close</button>
//         </div>
//       </div>
//     );
//   }

//   // --- UI ---
//   return (
//     <div ref={containerRef} style={{
//       minHeight: "100vh", background: "linear-gradient(180deg, #f6f8fb 0%, #eef2f7 100%)",
//       padding: 20, boxSizing: "border-box", fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
//     }}>
//       {/* Top bar */}
//       <div style={{
//         display: "flex", alignItems: "center", gap: 16, marginBottom: 18
//       }}>
//         <button onClick={() => navigate("/mynotes")} style={{
//           padding: "8px 10px", borderRadius: 10, background: "rgba(255,255,255,0.8)", border: "none", boxShadow: "0 6px 18px rgba(16,24,40,0.04)"
//         }}>← Back</button>

//         <div>
//           <div style={{ display: "inline-block", padding: "6px 10px", background: "linear-gradient(90deg,#fff7ed,#fff4e6)", color: "#b45309", borderRadius: 999, fontWeight: 700, fontSize: 13 }}>Notes</div>
//           <h2 style={{ margin: "8px 0 0", fontSize: 20 }}>{note?.title || "Loading…"}</h2>
//           <div style={{ color: "#6b7280", fontSize: 13 }}>{note?.subject} • {note?.category}</div>
//         </div>

//         <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
//           <button onClick={() => reading ? stopReading() : startReadAll()} style={{
//             padding: "8px 12px", borderRadius: 10, background: reading ? "#ef4444" : "#fb923c", color: "#fff", border: "none", fontWeight: 700, boxShadow: "0 8px 24px rgba(251,146,60,0.18)"
//           }}>{reading ? "Stop" : "Read"}</button>

//           <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "rgba(255,255,255,0.7)", borderRadius: 10 }}>
//             <label style={{ fontSize: 13, color: "#374151" }}>Speed</label>
//             <input type="range" min="0.6" max="1.8" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} style={{ width: 140 }} />
//             <div style={{ fontWeight: 700 }}>{rate.toFixed(1)}x</div>
//           </div>

//           <select value={selectedVoice || ""} onChange={(e) => setSelectedVoice(e.target.value)} style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(16,24,40,0.06)" }}>
//             {voices.length ? voices.map(v => <option key={v.name} value={v.name}>{v.name} — {v.lang}</option>) : <option>Default</option>}
//           </select>
//         </div>
//       </div>

//       {/* Main layout */}
//       <div style={{ display: "flex", gap: 16 }}>
//         {/* Sidebar thumbnails & bookmarks */}
//         <aside style={{ width: 140, display: "flex", flexDirection: "column", gap: 12 }}>
//           <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 12, padding: 12, boxShadow: "0 10px 30px rgba(2,6,23,0.06)", overflow: "hidden" }}>
//             <div style={{ fontWeight: 800, marginBottom: 8 }}>Pages</div>
//             <div style={{ maxHeight: "68vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
//               {Array.from({ length: pageCount }, (_, i) => {
//                 const p = i + 1;
//                 const img = thumbData(p);
//                 const isSelected = p === pageNum || (twoPage && (p === pageNum + 1));
//                 return (
//                   <button key={p} onClick={() => setPageNum(p)} style={{
//                     display: "flex", gap: 8, alignItems: "center", border: "none", background: isSelected ? "linear-gradient(180deg,#fff,#fffdfa)" : "transparent",
//                     padding: 6, borderRadius: 10, cursor: "pointer"
//                   }}>
//                     <div style={{ width: 44, height: 64, borderRadius: 6, overflow: "hidden", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                       {img ? <img src={img} alt={`p${p}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ color: "#9ca3af" }}>{p}</div>}
//                     </div>
//                     <div style={{ textAlign: "left" }}>
//                       <div style={{ fontSize: 12, fontWeight: 700 }}>Page {p}</div>
//                       <div style={{ fontSize: 11, color: "#6b7280" }}>Tap to open</div>
//                     </div>
//                   </button>
//                 );
//               })}
//               {pageCount === 0 && <div style={{ color: "#9ca3af" }}>No pages</div>}
//             </div>
//           </div>

//           {/* Bookmarks box */}
//           <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 12, padding: 12, boxShadow: "0 10px 30px rgba(2,6,23,0.06)" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
//               <div style={{ fontWeight: 800 }}>Bookmarks</div>
//               <button onClick={addBookmark} style={{ fontSize: 12, borderRadius: 8, padding: "6px 8px", background: "#eef2ff" }}>+ Add</button>
//             </div>

//             <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//               {bookmarks.length ? bookmarks.map(b => (
//                 <div key={b.id}
//                   style={{ padding: 8, borderRadius: 8, background: "#fff", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <div style={{ fontSize: 13 }}>P{b.page}</div>
//                   <div style={{ display: 'flex', gap: 8 }}>
//                     <button onClick={() => setPageNum(Number(b.page))} style={{ fontSize: 12 }}>Go</button>
//                     <button onClick={() => delBookmark(b.id)} style={{ color: "#ef4444", fontSize: 12 }}>Del</button>
//                   </div>
//                 </div>
//               )) : <div style={{ color: "#9ca3af" }}>No bookmarks</div>}
//             </div>
//           </div>
//         </aside>

//         {/* Viewer */}
//         <main style={{ flex: 1 }}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
//             <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//               <button onClick={prevPage} style={{ padding: "6px 10px", borderRadius: 8, background: "#fff" }}>◀ Prev</button>
//               <div style={{ fontWeight: 700 }}>Page {pageNum}{twoPage ? ` & ${Math.min(pageNum + 1, pageCount)}` : ""} / {pageCount}</div>
//               <button onClick={nextPage} style={{ padding: "6px 10px", borderRadius: 8, background: "#fff" }}>Next ▶</button>
//             </div>

//             <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//               <button onClick={() => setZoom(z => Math.max(0.6, +(z - 0.1).toFixed(2)))} style={{ padding: "6px 10px", borderRadius: 8, background: "#fff" }}>−</button>
//               <div style={{ fontWeight: 700 }}>{Math.round(zoom * 100)}%</div>
//               <button onClick={() => setZoom(z => Math.min(3, +(z + 0.1).toFixed(2)))} style={{ padding: "6px 10px", borderRadius: 8, background: "#fff" }}>+</button>

//               <button onClick={() => setTwoPage(tp => !tp)} style={{ padding: "6px 10px", borderRadius: 8, background: "#fff" }}>{twoPage ? "Single Page" : "Two Page"}</button>

//               <button onClick={() => {
//                 if (!document.fullscreenElement) containerRef.current.requestFullscreen?.();
//                 else document.exitFullscreen();
//               }} style={{ padding: "6px 10px", borderRadius: 8, background: "#fff" }}>Full</button>
//             </div>
//           </div>

//           {/* Canvas container */}
//           <div style={{
//             background: "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(250,250,252,0.85))",
//             borderRadius: 14, padding: 18, boxShadow: "0 20px 60px rgba(14,20,30,0.06)"
//           }}>
//             <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
//               {/* left */}
//               <div style={{ position: "relative" }}>
//                 <div onClick={(e) => onCanvasClick(e, pageNum)} style={{ cursor: "crosshair" }}>
//                   <canvas ref={leftCanvasRef} style={{ display: "block", borderRadius: 8, background: "#fff", boxShadow: "0 10px 30px rgba(2,6,23,0.04)" }} />
//                 </div>
//                 <div style={{ position: "absolute", inset: 0 }}>
//                   {overlaysForPage(pageNum)}
//                 </div>
//               </div>

//               {/* right */}
//               {twoPage && pageNum + 1 <= pageCount && (
//                 <div style={{ position: "relative" }}>
//                   <div onClick={(e) => onCanvasClick(e, pageNum + 1)} style={{ cursor: "crosshair" }}>
//                     <canvas ref={rightCanvasRef} style={{ display: "block", borderRadius: 8, background: "#fff", boxShadow: "0 10px 30px rgba(2,6,23,0.04)" }} />
//                   </div>
//                   <div style={{ position: "absolute", inset: 0 }}>
//                     {overlaysForPage(pageNum + 1)}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* progress slider */}
//             <div style={{ marginTop: 12 }}>
//               <input type="range" min="1" max={pageCount || 1} value={pageNum} onChange={(e) => setPageNum(Number(e.target.value))} style={{ width: "100%" }} />
//             </div>
//           </div>

//           {/* bottom panels */}
//           <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
//             {/* Extracted Text + AI Summary + Notes */}
//             <section style={{ flex: 1 }}>
//               <div style={{ fontWeight: 800, marginBottom: 6 }}>Extracted Text (click sentence to play)</div>
//               <div style={{ background: "rgba(255,255,255,0.9)", padding: 12, borderRadius: 12, minHeight: 120, boxShadow: "0 10px 30px rgba(2,6,23,0.04)", overflowY: "auto" }}>
//                 {sentences.length ? sentences.map((s, i) => (
//                   <div key={i} onClick={() => speakSentenceIndex(i)} style={{
//                     padding: "10px 12px",
//                     marginBottom: 8,
//                     borderRadius: 10,
//                     background: currentSentence === i ? "linear-gradient(90deg,#fff7ed,#fff6f0)" : "#fff",
//                     cursor: "pointer",
//                     boxShadow: "0 6px 16px rgba(2,6,23,0.03)"
//                   }}>{s}</div>
//                 )) : <div style={{ color: "#9ca3af" }}>No text extracted for this view.</div>}
//               </div>

//               {/* AI Summary */}
//               <div style={{ marginTop: 18 }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
//                   <div style={{ fontWeight: 800 }}>AI Summary</div>
//                   <div style={{ display: "flex", gap: 8 }}>
//                     <button onClick={() => generateSummary("page")} style={{ padding: "6px 10px", borderRadius: 8, background: "#eef2ff" }}>
//                       {aiLoading ? "Generating…" : "Summarize Page"}
//                     </button>
//                     <button onClick={() => generateSummary("full")} style={{ padding: "6px 10px", borderRadius: 8, background: "#e0e7ff" }}>
//                       {aiLoading ? "Generating…" : "Summarize Full PDF"}
//                     </button>
//                   </div>
//                 </div>

//                 <div style={{
//                   background: "rgba(255,255,255,0.95)",
//                   padding: 12,
//                   borderRadius: 12,
//                   minHeight: 100,
//                   boxShadow: "0 10px 30px rgba(2,6,23,0.04)",
//                   whiteSpace: "pre-wrap"
//                 }}>
//                   {aiLoading ? "⏳ Generating summary…" : aiSummary || "No summary yet."}
//                 </div>

//                 <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
//                   <button onClick={insertSummaryIntoNotes} disabled={!aiSummary} style={{ padding: "6px 10px", borderRadius: 8, background: aiSummary ? "#fee2e2" : "#f3f4f6" }}>
//                     Insert into Notes
//                   </button>
//                   <button onClick={() => { setAiSummary(""); }} style={{ padding: "6px 10px", borderRadius: 8 }}>Clear</button>
//                 </div>
//               </div>

//               {/* My Notes */}
//               <div style={{ marginTop: 18 }}>
//                 <div style={{ fontWeight: 800, marginBottom: 6 }}>My Notes</div>
//                 <textarea
//                   value={userNotes}
//                   onChange={(e) => setUserNotes(e.target.value)}
//                   placeholder="Write your personal notes here. AI summary can be inserted."
//                   style={{
//                     width: "100%",
//                     minHeight: 160,
//                     padding: 12,
//                     borderRadius: 12,
//                     border: "1px solid rgba(16,24,40,0.08)",
//                     background: "rgba(255,255,255,0.8)",
//                     boxShadow: "0 10px 30px rgba(2,6,23,0.04)",
//                     resize: "vertical"
//                   }}
//                 />
//                 <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
//                   <button onClick={() => { try { navigator.clipboard.writeText(userNotes); } catch {} }} style={{ padding: "6px 10px", borderRadius: 8 }}>Copy</button>
//                   <button onClick={() => setUserNotes("")} style={{ padding: "6px 10px", borderRadius: 8 }}>Clear</button>
//                 </div>
//               </div>
//             </section>

//             {/* Right: Search & Annotations */}
//             <aside style={{ width: 320 }}>
//               <div style={{ background: "rgba(255,255,255,0.9)", padding: 12, borderRadius: 12, boxShadow: "0 10px 30px rgba(2,6,23,0.04)" }}>
//                 <div style={{ fontWeight: 800, marginBottom: 8 }}>Search in Page</div>
//                 <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
//                   <input placeholder="Search page text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid rgba(16,24,40,0.06)" }} />
//                   <button onClick={runSearch} style={{ padding: "8px 10px", borderRadius: 8, background: "#eef2ff" }}>Find</button>
//                 </div>
//                 <div style={{ color: "#6b7280", marginBottom: 8 }}>Matches: {searchCount}</div>

//                 <hr style={{ margin: "8px 0" }} />

//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
//                   <div style={{ fontWeight: 800 }}>Annotations</div>
//                   <div style={{ fontSize: 12, color: "#6b7280" }}>Tap canvas to add</div>
//                 </div>

//                 <div style={{ maxHeight: 160, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
//                   {annotations.length ? annotations.map(a => (
//                     <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 8, borderRadius: 8, background: "#fff" }}>
//                       <div style={{ fontSize: 13, lineHeight: 1 }}>{a.text.length > 60 ? a.text.slice(0, 60) + "…" : a.text}</div>
//                       <div style={{ display: "flex", gap: 8 }}>
//                         <button onClick={() => setPageNum(Number(a.page))} style={{ fontSize: 12 }}>Go</button>
//                         <button onClick={() => deleteAnnotation(a.id)} style={{ color: "#ef4444", fontSize: 12 }}>Del</button>
//                       </div>
//                     </div>
//                   )) : <div style={{ color: "#9ca3af" }}>No annotations</div>}
//                 </div>
//               </div>
//             </aside>
//           </div>
//         </main>
//       </div>

//       <AnnotationPopup />

//       {/* micro CSS */}
//       <style>{`
//         ::-webkit-scrollbar { width: 9px; height: 9px; }
//         ::-webkit-scrollbar-thumb { background: rgba(16,24,40,0.12); border-radius: 999px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         button { cursor: pointer; }
//       `}</style>
//     </div>
//   );
// }

// /**
//  * ReadNote.jsx - cleaned & fixed
//  * Features:
//  * - Load note metadata + PDF
//  * - Render single/two-page canvases
//  * - Thumbnails generation
//  * - Text extraction + sentence-splitting + TTS
//  * - Bookmarks & annotations (load/save/delete)
//  * - Local "My Notes" storage
//  * - AI Summary via POST /api/summary
//  */

// src/pages/ReadNote.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { summarizePDF } from "../api/ai";

// pdfjs build + worker
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.js?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * ReadNote.jsx
 * - Renders a PDF with single/two page view
 * - Thumbnails, bookmarks, annotations
 * - Text extraction + TTS
 * - AI Summary (calls POST /api/ai/summary via summarizePDF())
 */

export default function ReadNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);

  // PDF state
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [zoom, setZoom] = useState(1.15);
  const [twoPage, setTwoPage] = useState(false);
  const [thumbnailsReady, setThumbnailsReady] = useState(false);

  // Refs
  const leftCanvasRef = useRef(null);
  const rightCanvasRef = useRef(null);
  const thumbsRef = useRef({});
  const containerRef = useRef(null);

  // Text + TTS
  const [pageText, setPageText] = useState("");
  const [sentences, setSentences] = useState([]);
  const [currentSentence, setCurrentSentence] = useState(null);
  const [reading, setReading] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const utterRef = useRef(null);
  const tts = typeof window !== "undefined" ? window.speechSynthesis : null;

  // Bookmarks & annotations
  const [bookmarks, setBookmarks] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);

  // Search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCount, setSearchCount] = useState(0);

  // UI states
  const [loading, setLoading] = useState(true);
  const [thumbLoading, setThumbLoading] = useState(false);

  // AI & Notes
  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [userNotes, setUserNotes] = useState(() => {
    try {
      return localStorage.getItem(`notes-${id}`) || "";
    } catch {
      return "";
    }
  });

  // --- Load note metadata & PDF ---
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await axios.get(`http://127.0.0.1:5000/api/notes/${id}`);
        if (cancelled) return;
        setNote(res.data || null);

        if (!res.data?.file_url) {
          setLoading(false);
          return;
        }

        const loadingTask = pdfjsLib.getDocument(res.data.file_url);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setPageCount(pdf.numPages);

        // load last page saved in backend
        try {
          const last = await axios.get(`http://127.0.0.1:5000/api/notes/${id}/lastpage`);
          if (last?.data?.last_page) {
            setPageNum(Number(last.data.last_page));
          }
        } catch (e) {
          // ignore
        }
      } catch (err) {
        console.error("Failed to load note/pdf", err);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // --- Setup TTS voices ---
  useEffect(() => {
    if (!tts) return;
    function update() {
      const v = tts.getVoices?.() || [];
      setVoices(v);
      if (v.length && !selectedVoice) setSelectedVoice(v[0].name);
    }
    update();
    // note: some browsers require onvoiceschanged to be set
    window.speechSynthesis.onvoiceschanged = update;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  // --- When pdfDoc or page changes: render, thumbnails, load side data ---
  useEffect(() => {
    if (!pdfDoc) return;

    (async () => {
      await renderPages();
      if (!thumbnailsReady) {
        await generateThumbnails();
        setThumbnailsReady(true);
      }

      // load bookmarks & annotations for this note
      await loadBookmarks();
      await loadAnnotations();

      // extract text for current pages
      const leftText = await extractTextFromPage(pageNum);
      let combined = leftText || "";
      if (twoPage && pageNum + 1 <= pageCount) {
        const rightText = await extractTextFromPage(pageNum + 1);
        if (rightText) combined += "\n\n" + rightText;
      }
      setPageText(combined);
      setSentences(splitIntoSentences(combined));

      // save last page
      debouncedSaveLastPage(pageNum);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfDoc, pageNum, zoom, twoPage]);

  // --- Persist user notes locally ---
  useEffect(() => {
    try {
      localStorage.setItem(`notes-${id}`, userNotes);
    } catch {
      // ignore
    }
  }, [userNotes, id]);

  // Debounce last-page saving (simple)
  const saveLastPage = async (p) => {
    try {
      await axios.post(`http://127.0.0.1:5000/api/notes/${id}/lastpage`, { page: p });
    } catch {
      // ignore
    }
  };
  const lastPageTimer = useRef(null);
  function debouncedSaveLastPage(p) {
    if (lastPageTimer.current) clearTimeout(lastPageTimer.current);
    lastPageTimer.current = setTimeout(() => saveLastPage(p), 500);
  }

  // --- Render helpers ---
  async function renderPages() {
    try {
      await renderToCanvas(pageNum, leftCanvasRef.current, zoom);
      if (twoPage && pageNum + 1 <= pageCount) {
        await renderToCanvas(pageNum + 1, rightCanvasRef.current, zoom);
      } else if (rightCanvasRef.current) {
        const ctx = rightCanvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, rightCanvasRef.current.width, rightCanvasRef.current.height);
      }
    } catch (e) {
      console.error("renderPages error", e);
    }
  }

  async function renderToCanvas(pageNumber, canvasEl, scale) {
    if (!pdfDoc || !canvasEl) return;
    try {
      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const canvas = canvasEl;
      const ctx = canvas.getContext("2d");
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * ratio);
      canvas.height = Math.floor(viewport.height * ratio);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport }).promise;
    } catch (err) {
      console.error("renderToCanvas", err);
    }
  }

  // --- Thumbnails ---
  async function generateThumbnails() {
    if (!pdfDoc) return;
    setThumbLoading(true);
    for (let p = 1; p <= pdfDoc.numPages; p++) {
      try {
        const page = await pdfDoc.getPage(p);
        const scale = 0.12;
        const viewport = page.getViewport({ scale });
        let c = thumbsRef.current[p];
        if (!c) {
          c = document.createElement("canvas");
          thumbsRef.current[p] = c;
        }
        c.width = Math.floor(viewport.width);
        c.height = Math.floor(viewport.height);
        await page.render({ canvasContext: c.getContext("2d"), viewport }).promise;
      } catch (e) {
        // continue on error
      }
    }
    setThumbLoading(false);
  }
  function thumbData(p) {
    const c = thumbsRef.current[p];
    return c ? c.toDataURL() : null;
  }

  // --- Text extraction ---
  async function extractTextFromPage(p) {
    if (!pdfDoc) return "";
    try {
      const pg = await pdfDoc.getPage(p);
      const content = await pg.getTextContent();
      const text = content.items.map(i => i.str).join(" ");
      return text;
    } catch (e) {
      return "";
    }
  }
  function splitIntoSentences(text) {
    if (!text) return [];
    const norm = text.replace(/\s+/g, " ").trim();
    if (!norm) return [];
    const parts = norm.match(/[^.!?]+[.!?]?/g) || [norm];
    return parts.map(s => s.trim()).filter(Boolean);
  }

  // --- TTS controls ---
  function speakSentenceIndex(idx) {
    if (!tts) return;
    if (!sentences[idx]) return;
    tts.cancel();
    const utt = new SpeechSynthesisUtterance(sentences[idx]);
    if (selectedVoice) {
      const v = voices.find(vv => vv.name === selectedVoice);
      if (v) utt.voice = v;
    }
    utt.rate = rate;
    utt.onend = () => setReading(false);
    utterRef.current = utt;
    setCurrentSentence(idx);
    setReading(true);
    tts.speak(utt);
  }
  function startReadAll() {
    if (!tts) return;
    if (!sentences.length) return;
    setReading(true);
    let i = 0;
    const playNext = () => {
      if (i >= sentences.length) {
        setReading(false);
        setCurrentSentence(null);
        return;
      }
      const s = new SpeechSynthesisUtterance(sentences[i]);
      if (selectedVoice) {
        const v = voices.find(vv => vv.name === selectedVoice);
        if (v) s.voice = v;
      }
      s.rate = rate;
      s.onend = () => {
        i++;
        setCurrentSentence(i);
        setTimeout(playNext, 120);
      };
      utterRef.current = s;
      tts.cancel();
      tts.speak(s);
    };
    playNext();
  }
  function stopReading() {
    if (!tts) return;
    tts.cancel();
    setReading(false);
    setCurrentSentence(null);
  }

  // --- Bookmarks API ---
  async function loadBookmarks() {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/api/notes/${id}/bookmarks`);
      setBookmarks(res.data || []);
    } catch (e) {
      setBookmarks([]);
    }
  }
  async function addBookmark() {
    try {
      await axios.post(`http://127.0.0.1:5000/api/notes/${id}/bookmarks`, { page: pageNum, title: `Page ${pageNum}` });
      await loadBookmarks();
    } catch (e) {
      /* ignore */
    }
  }
  async function delBookmark(bid) {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/notes/${id}/bookmarks`, { data: { id: bid } });
      await loadBookmarks();
    } catch (e) {
      /* ignore */
    }
  }

  // --- Annotations API ---
  async function loadAnnotations() {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/api/notes/${id}/annotations`);
      setAnnotations(res.data || []);
    } catch (e) {
      setAnnotations([]);
    }
  }
  async function saveAnnotation(page, x_pct, y_pct, text) {
    try {
      await axios.post(`http://127.0.0.1:5000/api/notes/${id}/annotations`, { page, x_pct, y_pct, text });
      await loadAnnotations();
    } catch (e) {
      /* ignore */
    }
  }
  async function deleteAnnotation(aid) {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/notes/${id}/annotations`, { data: { id: aid } });
      await loadAnnotations();
      setSelectedAnnotation(null);
    } catch (e) {
      /* ignore */
    }
  }

  function onCanvasClick(e, pageIndex) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const txt = window.prompt("Annotation text:");
    if (!txt) return;
    saveAnnotation(pageIndex, x, y, txt);
  }

  // --- Save last page (debounced above) ---
  // debouncedSaveLastPage(pageNum) is called elsewhere

  // --- Search ---
  function runSearch() {
    if (!searchTerm) {
      setSearchCount(0);
      return;
    }
    const low = (pageText || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    let idx = low.indexOf(term);
    let count = 0;
    while (idx !== -1) {
      count++;
      idx = low.indexOf(term, idx + term.length);
    }
    setSearchCount(count);
  }

  // --- Navigation helpers ---
  function nextPage() {
    const step = twoPage ? 2 : 1;
    if (pageNum + step <= pageCount) setPageNum(pageNum + step);
  }
  function prevPage() {
    const step = twoPage ? 2 : 1;
    if (pageNum - step >= 1) setPageNum(pageNum - step);
  }

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
      if (e.key === " ") {
        e.preventDefault();
        reading ? stopReading() : startReadAll();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reading, pageNum, twoPage, pageText]);

  // --- AI Summary (calls your backend via summarizePDF) ---
  async function generateSummary(scope = "page") {
    try {
      setAiLoading(true);
      setAiSummary("");

      const payload = {
        note_id: id,
        scope,
        page: pageNum,
        text: scope === "page" ? pageText : undefined,
      };

      // use helper from src/api/ai.js
      const res = await summarizePDF(payload);
      setAiSummary(res?.summary || "No summary returned.");
    } catch (e) {
      console.error("AI summary error", e);
      const details = e?.response?.data?.details || e?.response?.data?.error || e?.message;
      setAiSummary("❗ Error generating summary. " + (details || ""));
    } finally {
      setAiLoading(false);
    }
  }

  function insertSummaryIntoNotes() {
    if (!aiSummary) return;
    setUserNotes((prev) => (prev ? prev + "\n\n" : "") + aiSummary);
  }

  // Annotation overlays rendering
  function overlaysForPage(p) {
    return annotations
      .filter((a) => Number(a.page) === Number(p))
      .map((a) => {
        const style = {
          position: "absolute",
          left: `${a.x_pct * 100}%`,
          top: `${a.y_pct * 100}%`,
          transform: "translate(-50%, -50%)",
          zIndex: 60,
          background: "rgba(255,250,240,0.95)",
          borderRadius: 6,
          padding: "4px 6px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
        };
        return (
          <button key={a.id} style={style} onClick={() => setSelectedAnnotation(a)} title={a.text}>
            🗒
          </button>
        );
      });
  }

  function AnnotationPopup() {
    if (!selectedAnnotation) return null;
    const a = selectedAnnotation;
    return (
      <div
        style={{
          position: "fixed",
          right: 22,
          bottom: 22,
          zIndex: 4000,
          width: 300,
          background: "rgba(255,255,255,0.98)",
          borderRadius: 12,
          padding: 14,
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Annotation — Page {a.page}</div>
        <div style={{ marginBottom: 10 }}>{a.text}</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={() => {
              setPageNum(Number(a.page));
              setSelectedAnnotation(null);
            }}
            style={{ padding: "8px 10px", borderRadius: 8 }}
          >
            Go
          </button>
          <button onClick={() => deleteAnnotation(a.id)} style={{ padding: "8px 10px", borderRadius: 8, background: "#fee2e2" }}>
            Delete
          </button>
          <button onClick={() => setSelectedAnnotation(null)} style={{ padding: "8px 10px", borderRadius: 8 }}>
            Close
          </button>
        </div>
      </div>
    );
  }

  // --- UI ---
  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f6f8fb 0%, #eef2f7 100%)",
        padding: 20,
        boxSizing: "border-box",
        fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      }}
    >
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
        <button
          onClick={() => navigate("/mynotes")}
          style={{
            padding: "8px 10px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.8)",
            border: "none",
            boxShadow: "0 6px 18px rgba(16,24,40,0.04)",
          }}
        >
          ← Back
        </button>

        <div>
          <div
            style={{
              display: "inline-block",
              padding: "6px 10px",
              background: "linear-gradient(90deg,#fff7ed,#fff4e6)",
              color: "#b45309",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            Notes
          </div>
          <h2 style={{ margin: "8px 0 0", fontSize: 20 }}>{note?.title || "Loading…"}</h2>
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            {note?.subject} • {note?.category}
          </div>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => (reading ? stopReading() : startReadAll())}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              background: reading ? "#ef4444" : "#fb923c",
              color: "#fff",
              border: "none",
              fontWeight: 700,
              boxShadow: "0 8px 24px rgba(251,146,60,0.18)",
            }}
          >
            {reading ? "Stop" : "Read"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "rgba(255,255,255,0.7)", borderRadius: 10 }}>
            <label style={{ fontSize: 13, color: "#374151" }}>Speed</label>
            <input type="range" min="0.6" max="1.8" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} style={{ width: 140 }} />
            <div style={{ fontWeight: 700 }}>{rate.toFixed(1)}x</div>
          </div>

          <select value={selectedVoice || ""} onChange={(e) => setSelectedVoice(e.target.value)} style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(16,24,40,0.06)" }}>
            {voices.length ? voices.map((v) => <option key={v.name} value={v.name}>{v.name} — {v.lang}</option>) : <option>Default</option>}
          </select>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: "flex", gap: 16 }}>
        {/* Sidebar thumbnails & bookmarks */}
        <aside style={{ width: 140, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 12, padding: 12, boxShadow: "0 10px 30px rgba(2,6,23,0.06)", overflow: "hidden" }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Pages</div>
            <div style={{ maxHeight: "68vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
              {Array.from({ length: pageCount }, (_, i) => {
                const p = i + 1;
                const img = thumbData(p);
                const isSelected = p === pageNum || (twoPage && p === pageNum + 1);
                return (
                  <button key={p} onClick={() => setPageNum(p)} style={{ display: "flex", gap: 8, alignItems: "center", border: "none", background: isSelected ? "linear-gradient(180deg,#fff,#fffdfa)" : "transparent", padding: 6, borderRadius: 10, cursor: "pointer" }}>
                    <div style={{ width: 44, height: 64, borderRadius: 6, overflow: "hidden", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {img ? <img src={img} alt={`p${p}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ color: "#9ca3af" }}>{p}</div>}
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>Page {p}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>Tap to open</div>
                    </div>
                  </button>
                );
              })}
              {pageCount === 0 && <div style={{ color: "#9ca3af" }}>No pages</div>}
            </div>
          </div>

          {/* Bookmarks box */}
          <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 12, padding: 12, boxShadow: "0 10px 30px rgba(2,6,23,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontWeight: 800 }}>Bookmarks</div>
              <button onClick={addBookmark} style={{ fontSize: 12, borderRadius: 8, padding: "6px 8px", background: "#eef2ff" }}>+ Add</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {bookmarks.length ? bookmarks.map((b) => (
                <div key={b.id} style={{ padding: 8, borderRadius: 8, background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 13 }}>P{b.page}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setPageNum(Number(b.page))} style={{ fontSize: 12 }}>Go</button>
                    <button onClick={() => delBookmark(b.id)} style={{ color: "#ef4444", fontSize: 12 }}>Del</button>
                  </div>
                </div>
              )) : <div style={{ color: "#9ca3af" }}>No bookmarks</div>}
            </div>
          </div>
        </aside>

        {/* Viewer */}
        <main style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={prevPage} style={{ padding: "6px 10px", borderRadius: 8, background: "#fff" }}>◀ Prev</button>
              <div style={{ fontWeight: 700 }}>Page {pageNum}{twoPage ? ` & ${Math.min(pageNum + 1, pageCount)}` : ""} / {pageCount}</div>
              <button onClick={nextPage} style={{ padding: "6px 10px", borderRadius: 8, background: "#fff" }}>Next ▶</button>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(2)))} style={{ padding: "6px 10px", borderRadius: 8, background: "#fff" }}>−</button>
              <div style={{ fontWeight: 700 }}>{Math.round(zoom * 100)}%</div>
              <button onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))} style={{ padding: "6px 10px", borderRadius: 8, background: "#fff" }}>+</button>

              <button onClick={() => setTwoPage((tp) => !tp)} style={{ padding: "6px 10px", borderRadius: 8, background: "#fff" }}>{twoPage ? "Single Page" : "Two Page"}</button>

              <button onClick={() => {
                if (!document.fullscreenElement) containerRef.current.requestFullscreen?.();
                else document.exitFullscreen();
              }} style={{ padding: "6px 10px", borderRadius: 8, background: "#fff" }}>Full</button>
            </div>
          </div>

          {/* Canvas container */}
          <div style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(250,250,252,0.85))", borderRadius: 14, padding: 18, boxShadow: "0 20px 60px rgba(14,20,30,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
              {/* left */}
              <div style={{ position: "relative" }}>
                <div onClick={(e) => onCanvasClick(e, pageNum)} style={{ cursor: "crosshair" }}>
                  <canvas ref={leftCanvasRef} style={{ display: "block", borderRadius: 8, background: "#fff", boxShadow: "0 10px 30px rgba(2,6,23,0.04)" }} />
                </div>
                <div style={{ position: "absolute", inset: 0 }}>{overlaysForPage(pageNum)}</div>
              </div>

              {/* right */}
              {twoPage && pageNum + 1 <= pageCount && (
                <div style={{ position: "relative" }}>
                  <div onClick={(e) => onCanvasClick(e, pageNum + 1)} style={{ cursor: "crosshair" }}>
                    <canvas ref={rightCanvasRef} style={{ display: "block", borderRadius: 8, background: "#fff", boxShadow: "0 10px 30px rgba(2,6,23,0.04)" }} />
                  </div>
                  <div style={{ position: "absolute", inset: 0 }}>{overlaysForPage(pageNum + 1)}</div>
                </div>
              )}
            </div>

            {/* progress slider */}
            <div style={{ marginTop: 12 }}>
              <input type="range" min="1" max={pageCount || 1} value={pageNum} onChange={(e) => setPageNum(Number(e.target.value))} style={{ width: "100%" }} />
            </div>
          </div>

          {/* bottom panels */}
          <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
            {/* Extracted Text + AI Summary + Notes */}
            <section style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>Extracted Text (click sentence to play)</div>
              <div style={{ background: "rgba(255,255,255,0.9)", padding: 12, borderRadius: 12, minHeight: 120, boxShadow: "0 10px 30px rgba(2,6,23,0.04)", overflowY: "auto" }}>
                {sentences.length ? sentences.map((s, i) => (
                  <div key={i} onClick={() => speakSentenceIndex(i)} style={{ padding: "10px 12px", marginBottom: 8, borderRadius: 10, background: currentSentence === i ? "linear-gradient(90deg,#fff7ed,#fff6f0)" : "#fff", cursor: "pointer", boxShadow: "0 6px 16px rgba(2,6,23,0.03)" }}>
                    {s}
                  </div>
                )) : <div style={{ color: "#9ca3af" }}>No text extracted for this view.</div>}
              </div>

              {/* AI Summary (placed right under Extracted Text: Option 1) */}
              <div style={{ marginTop: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ fontWeight: 800 }}>AI Summary</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => generateSummary("page")} disabled={aiLoading} style={{ padding: "6px 10px", borderRadius: 8, background: "#eef2ff" }}>
                      {aiLoading ? "Generating…" : "Summarize Page"}
                    </button>
                    
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.95)", padding: 12, borderRadius: 12, minHeight: 100, boxShadow: "0 10px 30px rgba(2,6,23,0.04)", whiteSpace: "pre-wrap" }}>
                  {aiLoading ? "⏳ Generating summary…" : aiSummary || "No summary yet."}
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={insertSummaryIntoNotes} disabled={!aiSummary} style={{ padding: "6px 10px", borderRadius: 8, background: aiSummary ? "#fee2e2" : "#f3f4f6" }}>
                    Insert into Notes
                  </button>
                  <button onClick={() => { setAiSummary(""); }} style={{ padding: "6px 10px", borderRadius: 8 }}>Clear</button>
                </div>
              </div>

              {/* My Notes */}
              <div style={{ marginTop: 18 }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>My Notes</div>
                <textarea value={userNotes} onChange={(e) => setUserNotes(e.target.value)} placeholder="Write your personal notes here. AI summary can be inserted." style={{ width: "100%", minHeight: 160, padding: 12, borderRadius: 12, border: "1px solid rgba(16,24,40,0.08)", background: "rgba(255,255,255,0.8)", boxShadow: "0 10px 30px rgba(2,6,23,0.04)", resize: "vertical" }} />
                <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button onClick={() => { try { navigator.clipboard.writeText(userNotes); } catch {} }} style={{ padding: "6px 10px", borderRadius: 8 }}>Copy</button>
                  <button onClick={() => setUserNotes("")} style={{ padding: "6px 10px", borderRadius: 8 }}>Clear</button>
                </div>
              </div>
            </section>

            {/* Right: Search & Annotations */}
            <aside style={{ width: 320 }}>
              <div style={{ background: "rgba(255,255,255,0.9)", padding: 12, borderRadius: 12, boxShadow: "0 10px 30px rgba(2,6,23,0.04)" }}>
                <div style={{ fontWeight: 800, marginBottom: 8 }}>Search in Page</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input placeholder="Search page text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid rgba(16,24,40,0.06)" }} />
                  <button onClick={runSearch} style={{ padding: "8px 10px", borderRadius: 8, background: "#eef2ff" }}>Find</button>
                </div>
                <div style={{ color: "#6b7280", marginBottom: 8 }}>Matches: {searchCount}</div>

                <hr style={{ margin: "8px 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontWeight: 800 }}>Annotations</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Tap canvas to add</div>
                </div>

                <div style={{ maxHeight: 160, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                  {annotations.length ? annotations.map((a) => (
                    <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 8, borderRadius: 8, background: "#fff" }}>
                      <div style={{ fontSize: 13, lineHeight: 1 }}>{a.text.length > 60 ? a.text.slice(0, 60) + "…" : a.text}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => setPageNum(Number(a.page))} style={{ fontSize: 12 }}>Go</button>
                        <button onClick={() => deleteAnnotation(a.id)} style={{ color: "#ef4444", fontSize: 12 }}>Del</button>
                      </div>
                    </div>
                  )) : <div style={{ color: "#9ca3af" }}>No annotations</div>}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      <AnnotationPopup />

      {/* micro CSS */}
      <style>{`
        ::-webkit-scrollbar { width: 9px; height: 9px; }
        ::-webkit-scrollbar-thumb { background: rgba(16,24,40,0.12); border-radius: 999px; }
        ::-webkit-scrollbar-track { background: transparent; }
        button { cursor: pointer; }
      `}</style>
    </div>
  );
}
