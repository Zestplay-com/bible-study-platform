# Project State

## Current Phase
Foundation — Bible data layer.

## Current Objective
Build the Bible Study Platform incrementally and verify each stage before expanding it.

## Completed
- GitHub read/write connection verified.
- Temporary connectivity test created, verified, and removed.
- Next.js application foundation added.
- TypeScript configuration added.
- Mobile-first homepage added.
- Initial lazy-proof study experience represented in the UI.
- Bible book catalog added for all 66 Protestant Bible books.
- Development KJV sample dataset added.
- Bible provider interface, translation metadata, provider registry, and sample provider added.
- Bible chapter reader now reads through the provider abstraction instead of directly coupling the page to the sample dataset.

## In Progress
- Replace the development sample with a verified public-domain/licensed full Bible dataset.
- Bible search and verse-level retrieval UX.

## Remaining
- Bible search
- Verse actions
- AI Bible Teacher
- 5/10/20-minute study engine
- Memory system
- Quiz system
- Notes and bookmarks
- Reading plans
- Explore/knowledge system
- Sermon Studio
- Authentication and database
- Testing and deployment

## Important Decisions
- Bible is the center of the product.
- AI is a grounded study assistant, not a replacement for Scripture.
- Core loop: READ → UNDERSTAND → DISCOVER → REMEMBER → REFLECT → APPLY → TEST → LIVE.
- Build small, test, then continue.
- Bible UI depends on the BibleProvider abstraction so future licensed datasets can replace the development provider without changing the reader UI.

## Next Exact Action
Verify and integrate a full Bible dataset with clear licensing/public-domain status, then add provider-backed Bible search and verse retrieval tests.
