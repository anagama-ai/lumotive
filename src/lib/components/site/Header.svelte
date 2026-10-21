<script lang="ts">
	type Link = { label?: string; url?: string; newTab?: boolean };
	type LinkItem = { blockType: 'link'; id?: string; label?: string; link?: Link };
	type SubItem = { id?: string; link?: Link; Description?: string; subitems?: SubItem[] };
	type SubMenu = { blockType: 'sub'; id?: string; label?: string; link?: Link; subitems?: SubItem[] };
	type HeaderData = { items?: Array<LinkItem | SubMenu>; buttons?: Array<{ id?: string; link?: Link }> };

	let { data = {} }: { data?: HeaderData } = $props();

	const href = (link?: Link) => link?.url || '#';

	let headerEl: HTMLElement | null = null;

	// Page 02: a top-level label goes to its own page when clicked; the arrow
	// (or hover, on desktop) opens its dropdown. A link cannot sit inside a
	// <summary> (it is already a button), so each group is a label link plus
	// a disclosure button that controls the list below it.
	let desktopOpen = $state<number | null>(null);
	let mobileOpen = $state<Record<number, boolean>>({});

	// Collapse every menu once a link is activated: after a client-side
	// navigation the mobile panel would otherwise keep covering the page,
	// including in-page anchor targets such as /applications#robotics.
	const collapseMenus = () => {
		desktopOpen = null;
		mobileOpen = {};
		for (const menu of headerEl?.querySelectorAll('details') ?? []) menu.open = false;
	};

	// Desktop menus also open on hover. Pointers that cannot hover (touch) are
	// skipped so the emulated mouseenter does not fight the tap on the arrow.
	const hoverOpen = (index: number, open: boolean) => {
		if (!matchMedia('(hover: hover)').matches) return;
		desktopOpen = open ? index : desktopOpen === index ? null : desktopOpen;
	};

	// Keyboard: leaving the group or pressing Escape closes it; Escape returns
	// focus to the arrow so the reader does not lose their place.
	const leaveGroup = (event: FocusEvent, index: number) => {
		const group = event.currentTarget as HTMLElement;
		if (!group.contains(event.relatedTarget as Node | null) && desktopOpen === index) desktopOpen = null;
	};
	const escapeGroup = (event: KeyboardEvent, index: number) => {
		if (event.key !== 'Escape' || desktopOpen !== index) return;
		desktopOpen = null;
		(event.currentTarget as HTMLElement).querySelector<HTMLButtonElement>('.nav-toggle')?.focus();
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
						<div
							class="nav-group"
							class:open={desktopOpen === index}
							role="presentation"
							onmouseenter={() => hoverOpen(index, true)}
							onmouseleave={() => hoverOpen(index, false)}
							onfocusout={(event) => leaveGroup(event, index)}
							onkeydown={(event) => escapeGroup(event, index)}
						>
							{#if item.link?.url}
								<a class="nav-label" href={item.link.url} onclick={collapseMenus}>{item.label}</a>
							{:else}
								<span class="nav-label">{item.label}</span>
							{/if}
							<button
								type="button"
								class="nav-toggle"
								aria-expanded={desktopOpen === index}
								aria-controls={`nav-menu-${index}`}
								aria-label={`${item.label} submenu`}
								onclick={() => (desktopOpen = desktopOpen === index ? null : index)}
							></button>
							<div class="nav-popover" id={`nav-menu-${index}`} hidden={desktopOpen !== index}>
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
										{#if subitem.subitems?.length}
											<div class="nav-nested">
												{#each subitem.subitems as child, childIndex (childIndex)}
													{#if child.link?.label}
														<a
															href={href(child.link)}
															target={child.link.newTab ? '_blank' : undefined}
															rel={child.link.newTab ? 'noreferrer' : undefined}
															onclick={collapseMenus}>{child.link.label}</a
														>
													{/if}
												{/each}
											</div>
										{/if}
									{/if}
								{/each}
							</div>
						</div>
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
								style={`--i:${index}`}
								href={href(item.link)}
								target={item.link.newTab ? '_blank' : undefined}
								rel={item.link.newTab ? 'noreferrer' : undefined}
								onclick={collapseMenus}>{item.link.label}</a
							>
						{:else if item.blockType === 'sub' && item.label}
							<div class="mobile-group" style={`--i:${index}`}>
								<div class="mobile-group-row">
									{#if item.link?.url}
										<a href={item.link.url} onclick={collapseMenus}>{item.label}</a>
									{:else}
										<span>{item.label}</span>
									{/if}
									<button
										type="button"
										class="mobile-toggle"
										aria-expanded={Boolean(mobileOpen[index])}
										aria-controls={`mobile-menu-${index}`}
										aria-label={`${item.label} submenu`}
										onclick={() => (mobileOpen = { ...mobileOpen, [index]: !mobileOpen[index] })}
									></button>
								</div>
								<div class="mobile-group-links" id={`mobile-menu-${index}`} hidden={!mobileOpen[index]}>
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
											{#if subitem.subitems?.length}
												<div>
													{#each subitem.subitems as child, childIndex (childIndex)}
														{#if child.link?.label}
															<a
																href={href(child.link)}
																target={child.link.newTab ? '_blank' : undefined}
																rel={child.link.newTab ? 'noreferrer' : undefined}
																onclick={collapseMenus}>{child.link.label}</a
															>
														{/if}
													{/each}
												</div>
											{/if}
										{/if}
									{/each}
								</div>
							</div>
						{/if}
					{/each}
					{#each data.buttons || [] as button, index (index)}
						{#if button.link?.label}
							<a
								class="header-button"
								style={`--i:${(data.items?.length ?? 0) + index}`}
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
	.nav-popover small, .mobile-panel small {
		display: block;
		margin-top: .35rem;
		color: var(--color-muted);
		font-size: .72rem;
		line-height: 1.4;
	}
	.nav-nested {
		margin: 0 0 .25rem 1rem;
		padding-left: .75rem;
		border-left: 1px solid var(--color-border);
	}
	/* Third-level rows (Transmit modules, iToF and dToF dev kits) keep their
	   smaller type but get the 44px target the rest of the menu has. */
	.nav-nested a {
		display: flex;
		min-height: 2.75rem;
		align-items: center;
		padding: 0 .8rem;
		font-size: .8rem;
	}
</style>
