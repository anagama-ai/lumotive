<script lang="ts">
	import type { FormSubmissionResult, PublicForms } from '$lib/forms';
	import type { MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import type { TeaserPost } from '$lib/posts.server';
	import Cards from './Cards.svelte';
	import CardsApplicationBento from './CardsApplicationBento.svelte';
	import CardsAwardCards from './CardsAwardCards.svelte';
	import CardsComparisonCards from './CardsComparisonCards.svelte';
	import CardsComparisonTable from './CardsComparisonTable.svelte';
	import CardsDesignSpace from './CardsDesignSpace.svelte';
	import CardsFlowDiagram from './CardsFlowDiagram.svelte';
	import CardsFlowPanels from './CardsFlowPanels.svelte';
	import CardsIconCards from './CardsIconCards.svelte';
	import CardsIconQuad from './CardsIconQuad.svelte';
	import CardsMediaCards from './CardsMediaCards.svelte';
	import CardsPeelBento from './CardsPeelBento.svelte';
	import CardsPeelScene from './CardsPeelScene.svelte';
	import CardsPeelSwap from './CardsPeelSwap.svelte';
	import CardsSpecComparison from './CardsSpecComparison.svelte';
	import CardsSpecPanels from './CardsSpecPanels.svelte';
	import CardsTeamCards from './CardsTeamCards.svelte';
	import CardsTextCards from './CardsTextCards.svelte';
	import Cta from './Cta.svelte';
	import CtaDefault from './CtaDefault.svelte';
	import CtaFabric from './CtaFabric.svelte';
	import CtaLattice from './CtaLattice.svelte';
	import CtaLightField from './CtaLightField.svelte';
	import CtaSpectrum from './CtaSpectrum.svelte';
	import CtaSplitLinks from './CtaSplitLinks.svelte';
	import Form from './Form.svelte';
	import FormPipedrive from './FormPipedrive.svelte';
	import Hero from './Hero.svelte';
	import OpenRoles from './OpenRoles.svelte';
	import HeroBand from './HeroBand.svelte';
	import HeroFullHeight from './HeroFullHeight.svelte';
	import HeroSplit from './HeroSplit.svelte';
	import LogosGridOnDark from './LogosGridOnDark.svelte';
	import LogosLabelled from './LogosLabelled.svelte';
	import LogosMarquee from './LogosMarquee.svelte';
	import LogosSceneBand from './LogosSceneBand.svelte';
	import MediaVideoEmbed from './MediaVideoEmbed.svelte';
	import Prose from './Prose.svelte';
	import PostsFeatured from './PostsFeatured.svelte';
	import SplitDarkPanel from './SplitDarkPanel.svelte';
	import SplitDefault from './SplitDefault.svelte';
	import SplitPeelBleed from './SplitPeelBleed.svelte';
	import SplitStackedCard from './SplitStackedCard.svelte';
	import StatsCentered from './StatsCentered.svelte';
	import StatsDarkTraits from './StatsDarkTraits.svelte';
	import StatsLightTraits from './StatsLightTraits.svelte';
	import StatsPeelScene from './StatsPeelScene.svelte';
	import StatsSceneBand from './StatsSceneBand.svelte';
	import StatsSpecPills from './StatsSpecPills.svelte';
	import TestimonialsPeelScene from './TestimonialsPeelScene.svelte';
	import Timeline from './Timeline.svelte';

	const PEEL_SUFFIXES = ['PeelScene', 'PeelSwap', 'PeelBleed'];
	const isPeel = (section?: Section) =>
		!!section && PEEL_SUFFIXES.some((suffix) => section.type.endsWith(suffix));
	const isSceneBand = (section?: Section) =>
		section?.type === 'logosSceneBand' || section?.type === 'statsSceneBand';

	let {
		sections = [],
		media = {},
		forms = {},
		posts = [],
		result = null
	}: {
		sections?: Section[];
		media?: MediaMap;
		forms?: PublicForms;
		posts?: TeaserPost[];
		result?: FormSubmissionResult | null;
	} = $props();
</script>

{#snippet renderSection(section: Section, band?: Section)}
	{#if section.type === 'heroFullHeight'}
		<HeroFullHeight {section} {media} />
	{:else if section.type === 'heroBand'}
		<HeroBand {section} {media} />
	{:else if section.type === 'heroSplit'}
		<HeroSplit {section} {media} />
	{:else if section.type === 'cardsPeelScene'}
		<CardsPeelScene {section} {media} {band} />
	{:else if section.type === 'cardsPeelBento'}
		<CardsPeelBento {section} {media} />
	{:else if section.type === 'cardsPeelSwap'}
		<CardsPeelSwap {section} {media} {band} />
	{:else if section.type === 'cardsFlowPanels'}
		<CardsFlowPanels {section} {media} />
	{:else if section.type === 'cardsFlowDiagram'}
		<CardsFlowDiagram {section} {media} />
	{:else if section.type === 'cardsIconCards'}
		<CardsIconCards {section} {media} />
	{:else if section.type === 'cardsIconQuad'}
		<CardsIconQuad {section} {media} />
	{:else if section.type === 'cardsMediaCards'}
		<CardsMediaCards {section} {media} />
	{:else if section.type === 'cardsTextCards'}
		<CardsTextCards {section} {media} />
	{:else if section.type === 'cardsSpecPanels'}
		<CardsSpecPanels {section} {media} />
	{:else if section.type === 'cardsSpecComparison'}
		<CardsSpecComparison {section} {media} />
	{:else if section.type === 'cardsComparisonCards'}
		<CardsComparisonCards {section} {media} />
	{:else if section.type === 'cardsComparisonTable'}
		<CardsComparisonTable {section} {media} />
	{:else if section.type === 'cardsDesignSpace'}
		<CardsDesignSpace {section} {media} />
	{:else if section.type === 'cardsApplicationBento'}
		<CardsApplicationBento {section} {media} />
	{:else if section.type === 'cardsAwardCards'}
		<CardsAwardCards {section} {media} />
	{:else if section.type === 'cardsTeamCards'}
		<CardsTeamCards {section} {media} />
	{:else if section.type === 'splitDefault'}
		<SplitDefault {section} {media} />
	{:else if section.type === 'splitDarkPanel'}
		<SplitDarkPanel {section} {media} />
	{:else if section.type === 'splitPeelBleed'}
		<SplitPeelBleed {section} {media} {band} />
	{:else if section.type === 'splitStackedCard'}
		<SplitStackedCard {section} {media} />
	{:else if section.type === 'logosMarquee'}
		<LogosMarquee {section} {media} />
	{:else if section.type === 'logosGridOnDark'}
		<LogosGridOnDark {section} {media} />
	{:else if section.type === 'logosLabelled'}
		<LogosLabelled {section} {media} />
	{:else if section.type === 'logosSceneBand'}
		<LogosSceneBand {section} {media} />
	{:else if section.type === 'statsCentered'}
		<StatsCentered {section} {media} />
	{:else if section.type === 'statsDarkTraits'}
		<StatsDarkTraits {section} {media} />
	{:else if section.type === 'statsLightTraits'}
		<StatsLightTraits {section} {media} />
	{:else if section.type === 'openRoles'}
		<OpenRoles {section} {media} />
	{:else if section.type === 'statsSpecPills'}
		<StatsSpecPills {section} {media} />
	{:else if section.type === 'statsPeelScene'}
		<StatsPeelScene {section} {media} {band} />
	{:else if section.type === 'statsSceneBand'}
		<StatsSceneBand {section} {media} />
	{:else if section.type === 'testimonialsPeelScene'}
		<TestimonialsPeelScene {section} {media} {band} />
	{:else if section.type === 'mediaVideoEmbed'}
		<MediaVideoEmbed {section} {media} />
	{:else if section.type === 'ctaDefault'}
		<CtaDefault {section} {media} />
	{:else if section.type === 'ctaSplitLinks'}
		<CtaSplitLinks {section} {media} />
	{:else if section.type === 'ctaLattice'}
		<CtaLattice {section} {media} />
	{:else if section.type === 'ctaFabric'}
		<CtaFabric {section} {media} />
	{:else if section.type === 'ctaLightField'}
		<CtaLightField {section} {media} />
	{:else if section.type === 'ctaSpectrum'}
		<CtaSpectrum {section} {media} />
	{:else if section.type === 'timeline'}
		<Timeline {section} {media} />
	{:else if section.type === 'postsFeatured'}
		<PostsFeatured {section} {media} {posts} />
	{:else if section.type === 'hero'}
		<Hero {section} {media} />
	{:else if section.type === 'prose'}
		<Prose {section} />
	{:else if section.type === 'cards'}
		<Cards {section} />
	{:else if section.type === 'cta'}
		<Cta {section} />
	{:else if section.type === 'form'}
		<Form {section} {forms} {result} />
	{:else if section.type === 'formPipedrive'}
		<FormPipedrive {section} />
	{/if}
{/snippet}

{#each sections as section, index (section.id)}
	{@const previous = sections[index - 1]}
	{@const next = sections[index + 1]}
	{@const band = isPeel(section) && isSceneBand(next) ? next : undefined}
	{#if !(isSceneBand(section) && isPeel(previous))}
		{@render renderSection(section, band)}
	{/if}
{/each}
