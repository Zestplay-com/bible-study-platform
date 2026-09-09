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
- Development KJV sample dataset retained as a test fixture.
- Full 1769 KJV dataset integrated through the pinned `kjv` package.
- KJV provenance and licensing documented in `docs/CONTENT_LICENSES.md`.
- Bible provider interface, translation metadata, provider registry, and providers added.
- Bible chapter reader now reads through the provider abstraction.
- Provider-backed verse retrieval and full-text search tests added.
- Bible search page added at `/bible/search`.
- GitHub Actions now typechecks, tests, and builds before deployment.

## In Progress
- Improve Bible search relevance and reference parsing.
- Build the next Bible-reader verse-action layer.

## Remaining
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
- Advanced testing and deployment verification

## Important Decisions
- Bible is the center of the product.
- AI is a grounded study assistant, not a replacement for Scripture.
- Core loop: READ → UNDERSTAND → DISCOVER → REMEMBER → REFLECT → APPLY → TEST → LIVE.
- Build small, test, then continue.
- Bible UI depends on the BibleProvider abstraction so future licensed datasets can replace the production provider without changing the reader UI.
- The production KJV source is not copied into the repository as a large generated file; it is pinned as a dependency with documented provenance and licensing.

## Next Exact Action
Verify the new full-KJV build in GitHub Actions, then improve search/reference parsing and start the verse-action foundation.
