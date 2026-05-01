# Frontend Refinement Implementation Plan

This plan details the addition of the remaining project requirements, focusing on XLSX support, specific data upload categories, granular timetable views, and preparing the API architecture for FastAPI backend integration.

## Goal Description
To make the frontend 100% compliant with the project specifications by ensuring the upload system handles Excel files and specific entity categories, the timetable supports faculty/room specific views, and the codebase is ready for backend integration.

## User Review Required
> [!IMPORTANT]
> **API Centralization**: I will create a `services/api.ts` file that acts as a wrapper for all API calls. For now, it will return the mock data we've been using. When your backend is ready, you will only need to modify this single file instead of hunting down API calls in every component. Is this approach acceptable?

## Open Questions
- Do you have any specific requirements for how the Faculty/Room schedules should look when exported to PDF? (I plan to render the filtered view and allow export from there).

## Proposed Changes

---

### Phase 1: API Architecture Preparation
Centralizing all backend interactions.

#### [NEW] `services/api.ts`
- Create standard `async` functions: `login(username, password)`, `generateTimetable(params)`, `validateTimetable(data)`, `uploadData(category, file)`.
- Move the current mock data logic (delays and `localStorage`) into these functions.

#### [MODIFY] `app/login/page.tsx` & `app/generate/page.tsx`
- Refactor to use the new `api.ts` functions instead of inline mocking.

---

### Phase 2: Enhanced File Uploads
Supporting Excel and categorized data.

#### [NEW] Dependencies
- Run `npm install xlsx` to enable Excel file parsing in the browser.

#### [MODIFY] `app/upload/page.tsx`
- **File Type**: Update drag-and-drop to accept `.xlsx` alongside `.csv`.
- **Parsing**: Integrate the `xlsx` library to read Excel buffers and convert them to JSON, merging the logic with the existing `PapaParse` flow.
- **Categories**: Add a sleek dropdown/selector above the upload zone allowing the Admin to choose:
  - Faculty Data
  - Subject Data
  - Classroom Data
  - Class Group Data
  - Time Slot Data
- When "Confirm & Import" is clicked, it will call `api.uploadData(selectedCategory, parsedData)`.

---

### Phase 3: Faculty & Room Timetable Views
Enabling specific schedule viewing.

#### [MODIFY] `app/timetable/page.tsx`
- Add a filter toolbar above the grid.
- **Filter Types**: "Master View" (default), "By Faculty", "By Room".
- **Dynamic Options**: Automatically extract unique faculty names and rooms from the generated timetable to populate the secondary dropdown (e.g., Select Faculty -> [Dr. Smith, Prof. Alan]).
- **Grid Update**: When filtered, dim or hide unrelated slots so the user can easily see the specific faculty member's load. The PDF export will also respect this filtered view.

## Verification Plan

### Manual Verification
- Verify `npm install xlsx` succeeds.
- Test uploading an `.xlsx` file and ensure the preview table renders correctly.
- Test uploading with a specific category selected.
- In the Timetable page, select a specific Faculty and verify only their classes are highlighted.
- Test PDF export on the filtered timetable view.
- Ensure Login and Generate still function correctly using the new `api.ts` architecture.
