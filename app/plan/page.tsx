"use client";

import { useMemo, useState } from "react";
import { sitePath } from "@/lib/site";

const DAYS = [
  ["Day 1", "John 1:1-18", "Meet the Word"],
  ["Day 2", "John 3:1-21", "New birth"],
  ["Day 3", "Psalm 23:1-6", "The Shepherd"],
  ["Day 4", "Romans 8:1-17", "Life in the Spirit"],
  ["Day 5", "James 1:19-27", "Hearing and doing"],
  ["Day 6", "Philippians 4:4-9", "Peace and practice"],
  ["Day 7", "Matthew 5:1-16", "Kingdom character"],
];
const KEY = "bible-study-reading-plan";

export default function PlanPage() {
  const [done, setDone] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(KEY) ?? "[]") as number[]; } catch { return []; }
  });
  const completed = useMemo(() => new Set(done), [done]);
  function toggle(index: number) {
    const next = completed.has(index) ? done.filter((item) => item !== index) : [...done, index].sort((a,b) => a-b);
    setDone(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }
  const progress = Math.round((done.length / DAYS.length) * 100);
  return <main className="action-page" style={{maxWidth:860}}>
    <a className="back-link" href={sitePath("/bible")}>← Back to Bible</a>
    <p className="eyebrow">READING PLAN</p>
    <h1>7 days. One simple rhythm.</h1>
    <p className="page-lede">Read the passage, understand it, remember one truth, and do one thing with it. Your progress stays on this device.</p>
    <section className="study-card" style={{marginBottom:18}}><strong>{done.length}/7 completed</strong><div style={{height:7,background:"var(--background)",borderRadius:99,marginTop:10,overflow:"hidden"}}><span style={{display:"block",height:"100%",width:`${progress}%`,background:"var(--accent)"}} /></div></section>
    <div style={{display:"grid",gap:10}}>{DAYS.map(([day,ref,title],index)=><article key={ref} className="study-card" style={{display:"flex",gap:16,alignItems:"center",justifyContent:"space-between"}}><div><p className="eyebrow" style={{margin:0}}>{day}</p><h2 style={{margin:"4px 0"}}>{title}</h2><strong>{ref}</strong></div><div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"flex-end"}}><a className="secondary-button" href={sitePath(`/study?minutes=10&reference=${encodeURIComponent(ref)}`)}>Study</a><button className="primary-button button-reset" type="button" onClick={() => toggle(index)}>{completed.has(index) ? "Completed ✓" : "Mark done"}</button></div></article>)}</div>
  </main>;
}
