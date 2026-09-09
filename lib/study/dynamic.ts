import type { BibleProvider } from "@/lib/bible/provider";
import type { StudyInsight } from "./insights";

const lexicon: Record<string, StudyInsight["words"][number]> = {
  love:{word:"love",original:"ἀγάπη / אָהַב",transliteration:"agapē / ʾahav",meaning:"love, covenant loyalty, affection or deliberate care",whyItMatters:"Biblical love is often shown through action, loyalty and self-giving, not emotion alone."},
  faith:{word:"faith",original:"πίστις / אֱמוּנָה",transliteration:"pistis / ʾemunah",meaning:"faith, trust, faithfulness",whyItMatters:"Faith involves trusting God and living in response to that trust."},
  believe:{word:"believe",original:"πιστεύω",transliteration:"pisteuō",meaning:"believe, trust, rely upon",whyItMatters:"Biblical believing is more than agreeing with a statement; it calls for personal trust."},
  grace:{word:"grace",original:"χάρις",transliteration:"charis",meaning:"grace, favor, gracious gift",whyItMatters:"Grace highlights God's freely given favor rather than something earned."},
  truth:{word:"truth",original:"ἀλήθεια / אֱמֶת",transliteration:"alētheia / ʾemet",meaning:"truth, reality, faithfulness",whyItMatters:"Truth is connected with what is reliable and faithful before God."},
  spirit:{word:"spirit",original:"πνεῦμα / רוּחַ",transliteration:"pneuma / ruach",meaning:"spirit, breath, wind",whyItMatters:"Context determines whether the word points to God's Spirit, the human spirit, or breath/wind."},
  word:{word:"word",original:"λόγος / דָּבָר",transliteration:"logos / davar",meaning:"word, message, matter",whyItMatters:"God's word reveals, commands, promises and accomplishes His purposes."},
  pray:{word:"pray",original:"προσεύχομαι / פָּלַל",transliteration:"proseuchomai / palal",meaning:"pray, appeal to God, intercede",whyItMatters:"Prayer expresses relational dependence on God."},
  prayer:{word:"prayer",original:"προσευχή",transliteration:"proseuchē",meaning:"prayer, an appeal or request directed to God",whyItMatters:"Prayer moves biblical truth from information into dependence, worship and petition."},
  save:{word:"save",original:"σῴζω / יָשַׁע",transliteration:"sōzō / yasha",meaning:"save, rescue, deliver",whyItMatters:"Salvation language describes God's rescue from danger, sin and its consequences."},
  salvation:{word:"salvation",original:"σωτηρία / יְשׁוּעָה",transliteration:"sōtēria / yeshuah",meaning:"salvation, deliverance, rescue",whyItMatters:"Salvation is God's work of rescue and restoration."},
  righteous:{word:"righteous",original:"δίκαιος / צַדִּיק",transliteration:"dikaios / tsaddiq",meaning:"righteous, just, upright",whyItMatters:"Righteousness describes what is right before God and faithful living."},
  fear:{word:"fear",original:"φόβος / יָרֵא",transliteration:"phobos / yare",meaning:"fear, awe, reverence",whyItMatters:"Context matters: fear can mean terror, while fear of the Lord commonly carries reverence and submission."},
  trust:{word:"trust",original:"בָּטַח",transliteration:"batach",meaning:"trust, rely upon, feel secure in",whyItMatters:"Trust transfers confidence from self-sufficiency to God's character and promises."},
  wisdom:{word:"wisdom",original:"σοφία / חָכְמָה",transliteration:"sophia / chokmah",meaning:"wisdom, skill for godly living",whyItMatters:"Biblical wisdom is practical: it teaches a person how to live rightly before God."},
  heart:{word:"heart",original:"καρδία / לֵב",transliteration:"kardia / lev",meaning:"heart, inner person, mind and will",whyItMatters:"The biblical heart includes thought, desire, intention and decision, not only emotion."},
  mercy:{word:"mercy",original:"ἔλεος / חֶסֶד",transliteration:"eleos / hesed",meaning:"mercy, compassion, steadfast love",whyItMatters:"Mercy emphasizes God's compassionate action toward people who need His help."},
  holy:{word:"holy",original:"ἅγιος / קָדוֹשׁ",transliteration:"hagios / qadosh",meaning:"holy, set apart, sacred",whyItMatters:"Holiness speaks of God's distinctness and purity and the calling for His people to belong to Him."},
  glory:{word:"glory",original:"δόξα / כָּבוֹד",transliteration:"doxa / kavod",meaning:"glory, honor, splendor",whyItMatters:"Glory draws attention to God's greatness and the honor due to Him."},
  peace:{word:"peace",original:"εἰρήνη / שָׁלוֹם",transliteration:"eirēnē / shalom",meaning:"peace, wholeness, well-being",whyItMatters:"Biblical peace can describe wholeness and restored relationship, not only quiet feelings."},
  hope:{word:"hope",original:"ἐλπίς / תִּקְוָה",transliteration:"elpis / tiqvah",meaning:"hope, confident expectation",whyItMatters:"Biblical hope looks forward with confidence grounded in God's character and promises."},
  joy:{word:"joy",original:"χαρά / שִׂמְחָה",transliteration:"chara / simchah",meaning:"joy, gladness",whyItMatters:"Joy in Scripture can remain rooted in God even when circumstances are difficult."},
  sin:{word:"sin",original:"ἁμαρτία / חָטָא",transliteration:"hamartia / chata",meaning:"sin, missing the mark, wrongdoing",whyItMatters:"Sin is treated as a real moral and relational problem before God."},
  worship:{word:"worship",original:"προσκυνέω / שָׁחָה",transliteration:"proskyneō / shachah",meaning:"worship, bow down, honor",whyItMatters:"Worship involves giving God rightful honor and responding to who He is."},
  serve:{word:"serve",original:"διακονέω / עָבַד",transliteration:"diakoneō / avad",meaning:"serve, minister, work",whyItMatters:"Biblical service turns devotion into practical action for God and others."},
  repent:{word:"repent",original:"μετανοέω / שׁוּב",transliteration:"metanoeō / shuv",meaning:"repent, turn, change direction",whyItMatters:"Repentance involves a genuine turning from sin toward God, not merely regret."},
};

const stopWords=new Set("the and of to in a for is that with as on this it by from be are was were or an his her their he she they you your i my we our not but have has had do does did will shall can may all into unto upon when what who how why".split(/\s+/));

function parseReference(reference:string){const match=reference.trim().match(/^(.+?)\s+(\d+):(\d+)$/);return match?{bookName:match[1],chapter:Number(match[2]),verse:Number(match[3])}:null;}

export function buildDynamicInsight(reference:string,text:string,provider?:BibleProvider,translationId="kjv"):StudyInsight{
  const parsed=parseReference(reference);
  const bookId=parsed?.bookName.toLowerCase().replace(/\s+/g,"-");
  const nearby=parsed&&provider&&bookId?provider.getChapter(translationId,bookId,parsed.chapter):[];
  const index=nearby.findIndex(v=>v.reference.toLowerCase()===reference.toLowerCase());
  const before=index>0?nearby[index-1]:null; const after=index>=0&&index<nearby.length-1?nearby[index+1]:null;
  const tokens=text.toLowerCase().replace(/[^a-z\s]/g," ").split(/\s+/).filter(w=>w.length>3&&!stopWords.has(w));
  const unique=[...new Set(tokens)].slice(0,3);
  const words=unique.map(w=>lexicon[w]).filter(Boolean).slice(0,4);
  if(!words.length) words.push({word:parsed?.bookName??"passage",original:"Hebrew / Greek lexicon",transliteration:"context required",meaning:"The exact original-language word and grammatical form should be checked in the verse itself.",whyItMatters:"This prevents inventing a Hebrew or Greek meaning from an English translation."});
  let related=provider?.search?unique.flatMap(q=>provider.search!(translationId,q)).filter(v=>v.reference.toLowerCase()!==reference.toLowerCase()):[];
  related=[...new Map(related.map(v=>[v.reference,v])).values()].slice(0,5);
  return {key:reference.toLowerCase(),theme:`A closer look at ${reference}`,bigIdea:`This passage deserves more than a quick definition. Read its words, immediate context, wider biblical connections, and the response it calls for.`,whatGodIsShowing:[`Start with what the inspired text actually says before deciding what it means for us.`,`Look for what this passage reveals about God's character, purposes, promises, commands, or human response.`,`Let application grow from the passage and remain consistent with the wider teaching of Scripture.`],context:before||after?`The immediate context matters. ${before?`The preceding verse (${before.reference}) says: “${before.text}” `:""}${after?`The following verse (${after.reference}) says: “${after.text}”`:""} Read the whole chapter to see the complete thought.`:`Read the whole chapter around ${reference}. Look for speaker, audience, setting, repeated ideas, commands, promises, contrasts and movement.`,words,crossReferences:related.map(v=>({reference:v.reference,connection:`This passage shares a meaningful word or phrase with ${reference}. Compare both passages in context; a matching word does not automatically mean identical meaning.`})),questions:[`What does the passage clearly say, and what am I assuming?`,`What does this reveal about God, Christ, the Spirit, people, sin, faith or obedience?`,`How does the surrounding chapter control the meaning of this verse?`,`Which connected Scriptures confirm, expand or balance this truth?`],application:[`Write the main truth of this passage in one sentence.`,`Identify one attitude, decision or action that should change because of what you learned.`,`Pray the truth back to God and choose one concrete step of obedience today.`],prayer:`Lord, help me understand ${reference} faithfully. Show me what Your Word says, protect me from forcing my own ideas onto it, and give me grace to obey the truth You have revealed.`};
}
