<script lang="ts">
	type Link = { label?: string; url?: string; newTab?: boolean };
	type LinkItem = { blockType: 'link'; id?: string; label?: string; link?: Link };
	type SubItem = { id?: string; link?: Link; Description?: string };
	type SubMenu = { blockType: 'sub'; id?: string; label?: string; link?: Link; subitems?: SubItem[] };
	type HeaderData = { items?: Array<LinkItem | SubMenu>; buttons?: Array<{ id?: string; link?: Link }> };

	let { data = {} }: { data?: HeaderData } = $props();

	const href = (link?: Link) => link?.url || '#';

	let headerEl: HTMLElement | null = null;

	// Menus are plain <details>, so they stay open after a client-side
	// navigation. Collapse them once a link is activated; otherwise the mobile
	// panel keeps covering the page — including in-page anchor targets such as
	// /applications#robotics.
	const collapseMenus = () => {
		for (const menu of headerEl?.querySelectorAll('details') ?? []) menu.open = false;
	};
</script>

<header class="site-header" data-lumotive-header bind:this={headerEl}>
	<div class="container header-inner">
		<a class="site-logo" href="/" aria-label="Lumotive home">
			<img src="/lumotive/logos/lumotive-wordmark.png" alt="Lumotive" width="1080" height="176" />
		</a>

		{#if data.items?.length}
			<nav class="desktop-nav" aria-label="Main navigation">
				{#each data.items as item, index (index)}
					{#if item.blockType === 'link' && item.link?.label}
						<a
							href={href(item.link)}
							target={item.link.newTab ? '_blank' : undefined}
							rel={item.link.newTab ? 'noreferrer' : undefined}
							onclick={collapseMenus}>{item.link.label}</a
						>
					{:else if item.blockType === 'sub' && item.label}
						<details class="nav-group">
							<summary>{item.label}</summary>
							<div class="nav-popover">
								{#each item.subitems || [] as subitem, index (index)}
									{#if subitem.link?.label}
										<a
											href={href(subitem.link)}
											target={subitem.link.newTab ? '_blank' : undefined}
											rel={subitem.link.newTab ? 'noreferrer' : undefined}
											onclick={collapseMenus}
										>
											{subitem.link.label}
											{#if subitem.Description}<small>{subitem.Description}</small>{/if}
										</a>
									{/if}
								{/each}
							</div>
						</details>
					{/if}
				{/each}
			</nav>
		{/if}

		{#if data.buttons?.length}
			<div class="header-actions">
				{#each data.buttons as button, index (index)}
					{#if button.link?.label}
						<a
							class="header-button"
							href={href(button.link)}
							target={button.link.newTab ? '_blank' : undefined}
							rel={button.link.newTab ? 'noreferrer' : undefined}>{button.link.label}</a
						>
					{/if}
				{/each}
			</div>
		{/if}

		{#if data.items?.length || data.buttons?.length}
			<details class="mobile-nav">
				<summary aria-label="Toggle navigation"></summary>
				<nav class="mobile-panel" aria-label="Mobile navigation">
					{#each data.items || [] as item, index (index)}
						{#if item.blockType === 'link' && item.link?.label}
							<a
								href={href(item.link)}
								target={item.link.newTab ? '_blank' : undefined}
								rel={item.link.newTab ? 'noreferrer' : undefined}
								onclick={collapseMenus}>{item.link.label}</a
							>
						{:else if item.blockType === 'sub' && item.label}
							<details>
								<summary>{item.label}</summary>
								<div>
									{#each item.subitems || [] as subitem, index (index)}
										{#if subitem.link?.label}
											<a
												href={href(subitem.link)}
												target={subitem.link.newTab ? '_blank' : undefined}
												rel={subitem.link.newTab ? 'noreferrer' : undefined}
												onclick={collapseMenus}
												>{subitem.link.label}</a
											>
										{/if}
									{/each}
								</div>
							</details>
						{/if}
					{/each}
					{#each data.buttons || [] as button, index (index)}
						{#if button.link?.label}
							<a
								class="header-button"
								href={href(button.link)}
								target={button.link.newTab ? '_blank' : undefined}
								rel={button.link.newTab ? 'noreferrer' : undefined}
								onclick={collapseMenus}>{button.link.label}</a
							>
						{/if}
					{/each}
				</nav>
			</details>
		{/if}
	</div>
</header>

<style>
	.nav-popover small {
		display: block;
		margin-top: .35rem;
		color: var(--color-muted);
		font-size: .72rem;
		line-height: 1.4;
	}
</style>
