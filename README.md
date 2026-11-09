# Game Development Portfolio

## Open the website

Double-click `index.html`. The portfolio is fully static and does not need a
local server, an internet connection, or a build step.

## Replace placeholder content

- Edit personal information in `index.html`.
- Add project links in `assets/data/projects.js`.
- Add project screenshots to `assets/images/projects/`, then fill in each empty
  `src` value in `assets/data/projects.js`.

Example screenshot entry:

```js
{ src: "assets/images/projects/example-screenshot.jpg", label: "Gameplay screenshot" }
```

## Skyfire Uprising Planning Document

The second project uses its own long-form reader. Other projects continue to use
the original project modal. Both work directly from `index.html` via `file://`.

- `assets/data/skyfire-document.js`: generated document blocks and shared heading data.
- `assets/images/skyfire/`: original images extracted from the supplied DOCX.
- `assets/js/skyfire-reader.js`: navigation, scroll tracking, mobile drawer, and image zoom.
- `assets/css/skyfire-reader.css`: styles scoped to this reader.

The source document is Chinese; its body is preserved in Chinese in both website
languages. The homepage card supports both English and Chinese.

To regenerate after editing the Word source (Python with `lxml` required):

```powershell
python scripts/import-skyfire.py "C:\path\to\updated-document.docx"
```

The importer verifies source paragraph preservation and saves original image bytes.
The two overview screenshots are figures 1 and 2; original figure labels and
references are shifted by 2, with image order and resource paths retained. The output
contains 31 headings, 24 images, and two data tables. Browser regression checks
are in `scripts/verify-skyfire.cjs`; screenshots are in `artifacts/skyfire-qa/`.

## Broken Throne Planning Document

The first project shares the existing document reader and CSS with Skyfire.
Each document has its own heading IDs, content, and image folder. Skyfire's
document data is not regenerated when importing Broken Throne.

- `assets/data/broken-throne-document.js`: original document blocks, table values,
  heading data, and top information table settings.
- `assets/images/broken-throne/`: 21 original images from the Word document.
- `scripts/import-broken-throne.py`: repeatable DOCX import with paragraph checks.
- `scripts/verify-broken-throne.cjs`: browser checks, including Skyfire regression.

```powershell
python scripts/import-broken-throne.py "C:\path\to\Broken-Throne.docx"
```

The imported source has six main chapters, 34 headings, and nine data tables.
The duplicate project information table in Chapter 1 is omitted from the webpage,
leaving eight body tables; the top information table has separate GitHub and video rows.
All 355 source
paragraphs/cell paragraphs are preserved in the data; cover text is excluded
from display. The empty column in the source DPS table is intentionally retained.
The original Chinese document is shown in both website languages; card copy is
localized. Screenshots are saved in `artifacts/broken-throne-qa/`.
