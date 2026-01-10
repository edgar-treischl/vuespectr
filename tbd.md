# Prompt: Refactor a Plot to Be Truly Responsive

Refactor this plot so it behaves consistently at all sizes and matches the behavior of the other fixed plots.

Requirements:

- The plot must be wrapped in the shared PlotWrapper component.
- The wrapper, not the window, is the single source of truth for sizing.
- The plot must not rely on fixed font sizes, grid padding, or point sizes.
- Derive all visual sizes (fonts, labels, grid spacing, point radius) from the wrapper width.
- Resizing must trigger both:
  - a canvas resize
  - a rebuild of chart options using the new size
- For ECharts:
  - Do not initialize the chart until the wrapper has a non-zero width and height.
- Do not use inline heights, fixed pixel paddings, or hardcoded aspect assumptions.
- The plot must visually scale proportionally when the container grows or shrinks.
- Clean up ResizeObserver and chart instances on unmount.

Goal:

When the plot grows, everything grows together (labels, spacing, symbols), and all plots look visually consistent across pages and screen sizes.
