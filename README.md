# Table filters

A small experimental web app built with **Vite + React + TypeScript + Tailwind CSS + shadcn/ui** that showcases:

- an **Excel-style table filters** (search, multi-select, sort per column),
- a **live HUD clock** with timezone-aware date/time.

It’s intended as a playground for reusable filtering components and UI styling, not as a full data-grid library.

---

## Screenshot

![Stark UI Filtered Table Screenshot](/src/assets/screenshot.png)

---

## Features

- 🔍 **Per-column filters**
  - Search within column values.
  - Multi-select via checkboxes.
  - “Clear filter” & “Apply filter” actions.
- ↕️ **Sorting**
  - Sort toggle per column (ascending / descending / none).
  - Numeric sort for the `Amount` column, string sort for others.
- 🧊 **Reusable `<DataTableFilter />` component**
  - Built on top of shadcn/ui (`Popover`, `Command`, `Checkbox`, `ScrollArea`, `Button`).
  - Configurable label, options, sort labels and value-to-label mapping.
- 💹 **Market dashboard look**
  - Stark Industries (SIA) header line.
  - Status badges for each row (`OPEN`, `CLOSED`, `PENDING`).
  - Glassy, cyan-accented dark theme.
- ⏱ **Live HUD clock**
  - Time and date in the user’s timezone.
  - Seconds included to reinforce the “live feed” feeling.

---

## Tech Stack

- **Build tool:** Vite (React + TypeScript template)
- **UI framework:** React 18
- **Styling:** Tailwind CSS
- **Component primitives:** shadcn/ui
- **Language:** TypeScript

---

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm (or another compatible package manager)

### Installation

```bash
# clone the repository
git clone https://github.com/frelseRS/shadcnUI-FilteredTable.git
cd shadcnUI-FilteredTable.git

# install dependencies
npm install

# run
npm run dev
```

### Customization Ideas

Some directions explorable from here:

- More column types

- Date columns with “Newest → Oldest / Oldest → Newest” labels.

- Boolean columns with quick toggles.

- Remote data

- Plug the table into an API and let filters drive query parameters.

- Keyboard navigation

- Add shortcuts to open/close filters and move between rows.


## License

MIT License

Copyright (c) 2025 sAlvo
...

Credits

- UI components based on shadcn/ui.

- Visual inspiration taken from the fictional Stark Industries dashboards.