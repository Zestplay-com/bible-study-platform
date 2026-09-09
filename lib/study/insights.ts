export type WordStudy = {
  word: string;
  original: string;
  transliteration: string;
  meaning: string;
  whyItMatters: string;
};

export type StudyInsight = {
  key: string;
  theme: string;
  bigIdea: string;
  whatGodIsShowing: string[];
  context: string;
  words: WordStudy[];
  crossReferences: { reference: string; connection: string }[];
  questions: string[];
  application: string[];
  prayer: string;
};

const insights: Record<string, StudyInsight> = {
  "john 3:16": {
    key: "john 3:16",
    theme: "God's love and the gift of His Son",
    bigIdea: "God's love is not merely an emotion; He demonstrated it by giving His Son so that believers may have eternal life.",
    whatGodIsShowing: [
      "God is the initiator of salvation. The verse begins with what God loved and what God gave.",
      "God's love is wide enough to reach the world, but the promise is personally received by believing in Christ.",
      "Eternal life is presented as God's gift, not something a person earns by religious performance.",
    ],
    context: "John 3 records Jesus speaking with Nicodemus about the new birth, faith, and the Son of Man being lifted up. John 3:16 explains the heart behind God's saving action: love expressed through the giving of His Son.",
    words: [
      { word: "loved", original: "ἠγάπησεν", transliteration: "ēgapēsen", meaning: "loved; showed covenant-like, self-giving love", whyItMatters: "The emphasis is on God's deliberate action toward people, not merely a passing feeling." },
      { word: "world", original: "κόσμος", transliteration: "kosmos", meaning: "world; humanity/order of the world", whyItMatters: "It shows the remarkable scope of God's saving concern." },
      { word: "gave", original: "ἔδωκεν", transliteration: "edōken", meaning: "gave; granted or handed over", whyItMatters: "God's love becomes visible through sacrifice and giving." },
      { word: "believeth", original: "πιστεύων", transliteration: "pisteuōn", meaning: "believing; trusting, relying upon", whyItMatters: "Biblical belief is more than agreeing that Jesus exists; it involves trusting Him." },
      { word: "everlasting life", original: "ζωὴν αἰώνιον", transliteration: "zōēn aiōnion", meaning: "eternal life", whyItMatters: "Jesus offers a quality and destiny of life that comes from relationship with God." },
    ],
    crossReferences: [
      { reference: "Romans 5:8", connection: "God demonstrates His love by Christ dying for us while we were still sinners." },
      { reference: "1 John 4:9-10", connection: "God's love is revealed in sending His Son to bring life and reconciliation." },
      { reference: "Romans 8:32", connection: "The God who gave His Son is shown as the God who freely gives what we need." },
      { reference: "John 1:12", connection: "Those who receive Christ and believe in His name are given the right to become God's children." },
      { reference: "John 3:14-15", connection: "The surrounding verses connect believing in the lifted-up Son with receiving eternal life." },
    ],
    questions: [
      "What does this verse reveal about God's character?",
      "What is the difference between knowing about Jesus and trusting Jesus?",
      "What would change in my life if I truly believed God's love is this deliberate?",
    ],
    application: [
      "Receive God's love instead of trying to earn His acceptance.",
      "Trust Christ in one area where you have been depending only on yourself.",
      "Show sacrificial love to one person today without demanding something in return.",
    ],
    prayer: "Father, thank You for loving the world and giving Your Son. Help me to trust Christ, understand Your love, and live today as someone who has received Your grace.",
  },
  "psalms 23:1": {
    key: "psalms 23:1",
    theme: "The Lord as Shepherd",
    bigIdea: "David presents God as the personal Shepherd who leads, protects, and faithfully cares for His people.",
    whatGodIsShowing: ["God invites personal trust: He is not distant from His people.", "The Shepherd image points to guidance, protection, provision, and relationship.", "Contentment begins with knowing who is caring for you, not with possessing everything."],
    context: "Psalm 23 is a song of confident trust. Its shepherd imagery develops into green pastures, still waters, right paths, protection in the valley, a prepared table, and God's goodness following the believer.",
    words: [
      { word: "shepherd", original: "רֹעִי", transliteration: "rōʿî", meaning: "my shepherd; one who tends and cares for a flock", whyItMatters: "The possessive 'my' makes the relationship personal, not merely theological." },
      { word: "want", original: "אֶחְסָר", transliteration: "ʾeḥsār", meaning: "lack; be in need", whyItMatters: "David's confidence is that under God's care he will not ultimately lack what God's purpose requires." },
    ],
    crossReferences: [
      { reference: "John 10:11", connection: "Jesus identifies Himself as the good Shepherd who gives His life for the sheep." },
      { reference: "Ezekiel 34:11-16", connection: "God promises to seek, feed, bind up, and shepherd His scattered sheep." },
      { reference: "1 Peter 5:7", connection: "Believers can cast their cares on God because He cares for them." },
    ],
    questions: ["Where am I acting as though I have no Shepherd?", "What kind of guidance do I need from God right now?", "Which fear becomes smaller when I remember who is caring for me?"],
    application: ["Name one worry and deliberately entrust it to God in prayer.", "Follow one clear biblical instruction you already know instead of waiting for a new sign.", "Practice gratitude for God's present care."],
    prayer: "Lord, You are my Shepherd. Lead me, provide what I truly need, and teach me to trust Your care even when I cannot see the whole path.",
  },
  "proverbs 3:5": {
    key: "proverbs 3:5",
    theme: "Trusting God beyond self-reliance",
    bigIdea: "God calls His people to trust Him wholeheartedly rather than making their own understanding the final authority.",
    whatGodIsShowing: ["Wholehearted trust leaves room for God to correct our limited perspective.", "Human understanding is useful but cannot safely become our highest authority.", "The following verses connect trust with acknowledging God and allowing Him to direct our paths."],
    context: "Proverbs 3 teaches wisdom as a way of life. Verses 5-6 form a connected instruction: trust the Lord, reject self-sufficiency, acknowledge Him in every area, and expect His direction.",
    words: [
      { word: "trust", original: "בְּטַח", transliteration: "bǝṭaḥ", meaning: "trust; rely on, feel secure in", whyItMatters: "The command is relational dependence, not passive optimism." },
      { word: "heart", original: "לֵב", transliteration: "lēḇ", meaning: "heart; inner person, mind, will", whyItMatters: "Biblical 'heart' includes the center of thought, desire, and decision-making." },
    ],
    crossReferences: [
      { reference: "Psalm 37:5", connection: "Commit your way to the Lord, trust Him, and depend on His action." },
      { reference: "Jeremiah 17:7", connection: "The person who trusts in the Lord is described as blessed and securely rooted." },
      { reference: "James 1:5", connection: "When wisdom is lacking, believers are directed to ask God rather than rely only on themselves." },
    ],
    questions: ["Where is my own understanding competing with God's Word?", "What decision needs wholehearted trust instead of fear-driven control?", "What would acknowledging God look like practically today?"],
    application: ["Write down one decision you are controlling and submit it to God in prayer.", "Search Scripture for guidance before following your first impulse.", "Take one obedient step you already know God requires."],
    prayer: "Lord, I trust You. Teach me not to make my limited understanding the final authority. Direct my thoughts, decisions, and steps according to Your wisdom.",
  },
};

function normalizeReference(value: string) {
  return value.trim().toLowerCase().replace(/\bpsalm\b/g, "psalms").replace(/\s+/g, " ");
}

export function getStudyInsight(reference: string): StudyInsight | null {
  return insights[normalizeReference(reference)] ?? null;
}

export function getKnownInsightReferences() {
  return Object.keys(insights);
}
