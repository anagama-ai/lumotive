<script lang="ts">
	type Spec = { label?: unknown; value?: unknown; unit?: unknown };
	type Mode = {
		name?: unknown;
		kind?: unknown;
		range?: unknown;
		rangeLabel?: unknown;
		rangeNote?: unknown;
		sliceRange?: unknown;
		sliceAngle?: unknown;
		sliceLabel?: unknown;
		sliceNote?: unknown;
		specs?: Spec[];
	};

	let { modes, fov, guide, footnote }: { modes: Mode[]; fov: number; guide: number; footnote: string } = $props();

	// Every diagram shares one distance scale, sized so the longest reach
	// (a slice included) fits the drawing.
	const VIEW = { width: 250, height: 260 };
	const SENSOR = { x: 18, y: 130 };
	const num = (value: unknown) => Number.parseFloat(String(value ?? '')) || 0;
	const text = (value: unknown) => String(value ?? '').trim();
	let half = $derived(fov / 2);
	let reach = $derived(Math.max(guide, ...modes.map((mode) => Math.max(num(mode.range), num(mode.sliceRange)))));
	let scale = $derived((VIEW.width - SENSOR.x - 10) / reach);

	const point = (r: number, deg: number) => {
		const rad = (deg * Math.PI) / 180;
		return [SENSOR.x + r * Math.cos(rad), SENSOR.y - r * Math.sin(rad)] as const;
	};
	const wedge = (metres: number, halfAngle: number) => {
		const r = metres * scale;
		const [x1, y1] = point(r, halfAngle);
		const [x2, y2] = point(r, -halfAngle);
		return `M${SENSOR.x} ${SENSOR.y} L${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2} Z`;
	};
	const arc = (metres: number, halfAngle: number) => {
		const r = metres * scale;
		const [x1, y1] = point(r, halfAngle);
		const [x2, y2] = point(r, -halfAngle);
		return `M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}`;
	};
	const degrees = (value: number) => `${Number(value.toFixed(1))}°`;
</script>

<div class="scan-modes">
	<div class="modes">
		{#each modes as mode, i (i)}
			{@const range = num(mode.range)}
			{@const r = range * scale}
			{@const slice = num(mode.sliceRange)}
			{@const label = text(mode.rangeLabel)}
			{@const note = text(mode.rangeNote)}
			<article class="mode">
				<svg viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} role="img" aria-label={`${text(mode.name)}: ${[label, note, slice ? `${text(mode.sliceLabel)} ${text(mode.sliceNote)}` : ''].filter(Boolean).join(', ')}; ${degrees(fov)} horizontal scan`}>
					<defs>
						<radialGradient id={`scan-fill-${i}`} cx={SENSOR.x} cy={SENSOR.y} r={Math.max(r, slice * scale, 60)} gradientUnits="userSpaceOnUse">
							<stop offset="0" stop-color="var(--color-brand-blue-dark)" stop-opacity=".95" />
							<stop offset="1" stop-color="var(--color-brand-blue)" stop-opacity=".45" />
						</radialGradient>
					</defs>
					{#if range < guide}<path class="guide" d={arc(guide, half + 10)} />{/if}
					<path class:faint={slice > 0} d={wedge(range, half)} fill={slice ? undefined : `url(#scan-fill-${i})`} />
					{#if slice}
						{@const [sx] = point(slice * scale, 0)}
						{@const [lx, ly] = point(r, -38)}
						<path d={wedge(slice, num(mode.sliceAngle) / 2 + 0.6)} fill={`url(#scan-fill-${i})`} />
						<text class="label" x={sx} y={SENSOR.y - 16} text-anchor="end">{text(mode.sliceLabel)}</text>
						<text class="tick" x={sx} y={SENSOR.y + 24} text-anchor="end">{text(mode.sliceNote)}</text>
						<text class="label" x={lx} y={ly + 20} text-anchor="middle">{label}</text>
					{:else if note}
						<text class="label" x={SENSOR.x + r + 14} y={SENSOR.y - 2}>{label}</text>
						<text class="tick" x={SENSOR.x + r + 14} y={SENSOR.y + 15}>{note}</text>
					{:else}
						<text class="label" x={SENSOR.x + r + 10} y={SENSOR.y + 6}>{label}</text>
					{/if}
					{#if i === 0}
						{@const [tx1, ty1] = point(r * 0.62, half + 14)}
						{@const [tx2, ty2] = point(r * 0.62, -half - 14)}
						{@const [mx, my] = point(guide * scale, half + 14)}
						<text class="tick" x={tx1} y={ty1} text-anchor="middle">+{degrees(half)}</text>
						<text class="tick" x={tx2} y={ty2 + 8} text-anchor="middle">−{degrees(half)}</text>
						<text class="tick" x={mx + 12} y={my - 4}>{guide} m</text>
					{/if}
					<rect x={SENSOR.x - 11} y={SENSOR.y - 11} width="22" height="22" rx="4" fill="var(--color-ink)" />
					<rect x={SENSOR.x - 6} y={SENSOR.y - 6} width="12" height="12" rx="1.5" fill="var(--color-brand-blue)" />
				</svg>
				<h3>{text(mode.name)}</h3>
				<p class="kind">{text(mode.kind)}</p>
				<dl>
					{#each mode.specs ?? [] as spec, s (s)}
						<dt>{text(spec.label)}</dt>
						<dd>{text(spec.value)}{#if text(spec.unit)}<small>{text(spec.unit)}</small>{/if}</dd>
					{/each}
				</dl>
			</article>
		{/each}
	</div>
	{#if footnote}
		<p class="footnote">
			{#each footnote.split('\n').filter((line) => line.trim()) as line, l (l)}<span>{line}</span>{/each}
		</p>
	{/if}
</div>

<style>
	/* Columns wrap as the row narrows: five across on a wide screen, then
	   three, two and one. Subgrid keeps the diagram, title, subtitle and specs
	   on shared rows, so a wrapped subtitle does not push one spec row lower.
	   Each column draws its rule on the left; the clipped overflow hides the
	   rule on whichever column starts a row, and the negative left margin
	   lines the first column's content up with the text around it. */
	.modes {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15.75rem, 1fr));
		row-gap: 3rem;
		margin-left: -1rem;
		overflow: hidden;
	}
	.mode {
		display: grid;
		grid-row: span 4;
		grid-template-rows: subgrid;
		/* A subgrid inherits the 3rem row gap; inside one mode the rows sit close. */
		row-gap: 0;
		margin-left: -1px;
		padding: 0 1rem;
		border-left: 1px solid var(--color-border);
	}
	svg { display: block; width: 100%; max-width: 20rem; height: auto; overflow: visible; }
	h3 { margin: 1.25rem 0 0; font-family: var(--font-body); font-size: 1.3rem; font-weight: 600; letter-spacing: -.01em; line-height: 1.25; }
	.kind { margin: .15rem 0 0; color: var(--color-muted); font-size: .95rem; }
	dl { display: grid; grid-template-columns: repeat(3, auto); justify-content: start; align-self: end; gap: 0 .75rem; margin: 1.25rem 0 0; }
	dt { grid-row: 1; color: var(--color-muted); font-size: .78rem; white-space: nowrap; }
	dd { grid-row: 2; margin: .15rem 0 0; font-size: 1.3rem; font-weight: 600; line-height: 1.2; white-space: nowrap; }
	dd small { margin-left: .1rem; font-size: .7rem; font-weight: 500; }
	.footnote { display: flex; flex-wrap: wrap; gap: .5rem 3rem; margin: 2.5rem 0 0; padding-top: 1rem; border-top: 1px solid var(--color-border); color: var(--color-muted); font-size: .85rem; }
	text { font-family: var(--font-body); }
	.label { fill: var(--color-brand-blue-dark); font-size: 17px; font-weight: 600; }
	.tick { fill: var(--color-muted); font-size: 12px; }
	.guide { fill: none; stroke: var(--color-muted); stroke-opacity: .45; stroke-dasharray: 1 4; stroke-linecap: round; }
	.faint { fill: rgb(0 120 208 / 14%); stroke: rgb(0 120 208 / 45%); }
</style>
