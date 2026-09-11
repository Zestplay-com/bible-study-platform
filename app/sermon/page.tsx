"use client";

import { useMemo, useState } from "react";
import { sitePath } from "@/lib/site";

const STEPS = ["Text", "Observation", "Meaning", "Application", "Outline"];
const KEY = "bible-study-sermon";

export default function SermonPage() {
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const outline = useMemo(() => `TEXT: ${reference || "Choose a passage"}\n\n1. WHAT DOES THE TEXT SAY?\n${notes || "Write your observations from the passage."}\n\n2. WHAT DOES IT MEAN?\nExplain the meaning from the immediate context and the wider teaching of Scripture.\n\n3. WHAT DOES IT REVEAL?\nWhat does this passage reveal about God, people, faith, sin, salvation, or obedience?\n\n4. HOW SHOULD WE RESPOND?\nGive clear applications that are grounded in the text.\n\n5. PRAYER\nTurn the main truth into a prayer.`, [reference, notes]);
  function save() { localStorage.setItem(KEY, JSON.stringify({reference,notes})); setSaved(true); }
  function load() { try { const data = JSON.parse(localStorage.getItem(KEY) ?? "null") as {reference?:string;notes?:string}|null; if(data){setReference(data.reference??"");setNotes(data.notes??"");}} catch {} }
  return <main className="action-page" style={{maxWidth:900}}>
    <a className="back-link" href={sitePath("/")}>← Home</a>
    <p className="eyebrow">SERMON STUDIO</p>
    <h1>Build the message from the text.</h1>
    <p className="page-lede">A simple workspace for moving from Scripture to observation, meaning, application, and a teachable outline. This is a preparation tool, not a replacement for prayer and study.</p>
    <section className="study-card" style={{display:"grid",gap:14}}><label><strong>Passage</strong><input value={reference} onChange={e=>setReference(e.target.value)} placeholder="John 3:16" style={{display:"block",width:"100%",marginTop:7,padding:13,border:"1px solid var(--line)",borderRadius:12,background:"var(--surface)",font:"inherit"}}/></label><label><strong>Observation notes</strong><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="What do you see? Repeated words? Commands? Promises? Contrast? Context?" rows={9} style={{display:"block",width:"100%",marginTop:7,padding:13,border:"1px solid var(--line)",borderRadius:12,background:"var(--surface)",font:"inherit"}}/></label><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button className="primary-button button-reset" onClick={save}>Save workspace</button><button className="secondary-button button-reset" onClick={load}>Load saved</button>{saved&&<span style={{padding:10}}>Saved ✓</span>}</div></section>
    <section className="study-card" style={{marginTop:14}}><p className="eyebrow">WORKFLOW</p><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{STEPS.map((step,i)=><span key={step} style={{padding:"8px 11px",border:"1px solid var(--line)",borderRadius:999,fontWeight:800,fontSize:12}}>{i+1}. {step}</span>)}</div></section>
    <section className="study-card" style={{marginTop:14}}><p className="eyebrow">DRAFT OUTLINE</p><pre style={{whiteSpace:"pre-wrap",fontFamily:"inherit",lineHeight:1.75}}>{outline}</pre></section>
  </main>;
}
