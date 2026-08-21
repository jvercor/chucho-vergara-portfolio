# Model Hero uses a full-bleed canvas with an absolute text overlay

The original Model Hero split the viewport 50/50 between a text column and a Three.js canvas column using CSS flexbox. On intermediate breakpoints (roughly 640–900 px) the flex child containing the canvas had an undefined height — `self-stretch` requires the parent row to have a resolved height, and the interaction with `calc(100svh + 10.4rem)` and padding caused the canvas to receive zero or incorrect dimensions before the `ResizeObserver` could correct it. The model appeared cropped or invisible at those sizes.

We replaced the split layout with a full-bleed canvas: the `ModelViewer` is absolutely positioned to fill the entire hero (`inset-0`). Text content is an absolutely positioned overlay (`z-10`) anchored to the left side. The canvas always receives the full hero dimensions — there are no flex children with implicit heights. The `ResizeObserver` now also recalculates the model's scale and horizontal pan on every resize, shifting the model rightward on wide aspect ratios so the text overlay and the model remain visually separated without a hard layout boundary.

## Considered options

- **Fix the flex heights explicitly** — adding `min-h-0` and `flex-1 min-h-full` to the canvas child resolves the flex shrink issue but still ties canvas height to the column layout, which has other edge cases at tall/narrow viewports.
- **Full-bleed canvas with absolute text overlay** — chosen: canvas always fills the hero, model pan adapts to aspect ratio, no layout-height ambiguity at any breakpoint. Matches the approach used by clevante.cz (the design reference).
