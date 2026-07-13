declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"articles": {
"ar/game-anti-cheats.md": {
	id: "ar/game-anti-cheats.md";
  slug: "ar/game-anti-cheats";
  body: string;
  collection: "articles";
  data: any
} & { render(): Render[".md"] };
"ar/malware-development-concepts.md": {
	id: "ar/malware-development-concepts.md";
  slug: "ar/malware-development-concepts";
  body: string;
  collection: "articles";
  data: any
} & { render(): Render[".md"] };
"ar/malware-packers.md": {
	id: "ar/malware-packers.md";
  slug: "ar/malware-packers";
  body: string;
  collection: "articles";
  data: any
} & { render(): Render[".md"] };
"ar/pagefile-deleted-contact-dfir.md": {
	id: "ar/pagefile-deleted-contact-dfir.md";
  slug: "ar/pagefile-deleted-contact-dfir";
  body: string;
  collection: "articles";
  data: any
} & { render(): Render[".md"] };
"ar/real-time-phishing-agents.md": {
	id: "ar/real-time-phishing-agents.md";
  slug: "ar/real-time-phishing-agents";
  body: string;
  collection: "articles";
  data: any
} & { render(): Render[".md"] };
"en/game-anti-cheats.md": {
	id: "en/game-anti-cheats.md";
  slug: "en/game-anti-cheats";
  body: string;
  collection: "articles";
  data: any
} & { render(): Render[".md"] };
"en/malware-development-concepts.md": {
	id: "en/malware-development-concepts.md";
  slug: "en/malware-development-concepts";
  body: string;
  collection: "articles";
  data: any
} & { render(): Render[".md"] };
"en/malware-packers.md": {
	id: "en/malware-packers.md";
  slug: "en/malware-packers";
  body: string;
  collection: "articles";
  data: any
} & { render(): Render[".md"] };
"en/pagefile-deleted-contact-dfir.md": {
	id: "en/pagefile-deleted-contact-dfir.md";
  slug: "en/pagefile-deleted-contact-dfir";
  body: string;
  collection: "articles";
  data: any
} & { render(): Render[".md"] };
"en/real-time-phishing-agents.md": {
	id: "en/real-time-phishing-agents.md";
  slug: "en/real-time-phishing-agents";
  body: string;
  collection: "articles";
  data: any
} & { render(): Render[".md"] };
};
"presentations": {
"ar/cryptography-for-hackers.md": {
	id: "ar/cryptography-for-hackers.md";
  slug: "ar/cryptography-for-hackers";
  body: string;
  collection: "presentations";
  data: any
} & { render(): Render[".md"] };
"ar/cyber-101.md": {
	id: "ar/cyber-101.md";
  slug: "ar/cyber-101";
  body: string;
  collection: "presentations";
  data: any
} & { render(): Render[".md"] };
"ar/dlls-in-practice.md": {
	id: "ar/dlls-in-practice.md";
  slug: "ar/dlls-in-practice";
  body: string;
  collection: "presentations";
  data: any
} & { render(): Render[".md"] };
"ar/eternalblue-anatomy.md": {
	id: "ar/eternalblue-anatomy.md";
  slug: "ar/eternalblue-anatomy";
  body: string;
  collection: "presentations";
  data: any
} & { render(): Render[".md"] };
"ar/mapping-social-networks.md": {
	id: "ar/mapping-social-networks.md";
  slug: "ar/mapping-social-networks";
  body: string;
  collection: "presentations";
  data: any
} & { render(): Render[".md"] };
"ar/snort-rules.md": {
	id: "ar/snort-rules.md";
  slug: "ar/snort-rules";
  body: string;
  collection: "presentations";
  data: any
} & { render(): Render[".md"] };
"ar/threat-to-risk.md": {
	id: "ar/threat-to-risk.md";
  slug: "ar/threat-to-risk";
  body: string;
  collection: "presentations";
  data: any
} & { render(): Render[".md"] };
"ar/twinsanity-recon-talk.md": {
	id: "ar/twinsanity-recon-talk.md";
  slug: "ar/twinsanity-recon-talk";
  body: string;
  collection: "presentations";
  data: any
} & { render(): Render[".md"] };
"en/cryptography-for-hackers.md": {
	id: "en/cryptography-for-hackers.md";
  slug: "en/cryptography-for-hackers";
  body: string;
  collection: "presentations";
  data: any
} & { render(): Render[".md"] };
"en/cyber-101.md": {
	id: "en/cyber-101.md";
  slug: "en/cyber-101";
  body: string;
  collection: "presentations";
  data: any
} & { render(): Render[".md"] };
"en/dlls-in-practice.md": {
	id: "en/dlls-in-practice.md";
  slug: "en/dlls-in-practice";
  body: string;
  collection: "presentations";
  data: any
} & { render(): Render[".md"] };
"en/eternalblue-anatomy.md": {
	id: "en/eternalblue-anatomy.md";
  slug: "en/eternalblue-anatomy";
  body: string;
  collection: "presentations";
  data: any
} & { render(): Render[".md"] };
"en/mapping-social-networks.md": {
	id: "en/mapping-social-networks.md";
  slug: "en/mapping-social-networks";
  body: string;
  collection: "presentations";
  data: any
} & { render(): Render[".md"] };
"en/snort-rules.md": {
	id: "en/snort-rules.md";
  slug: "en/snort-rules";
  body: string;
  collection: "presentations";
  data: any
} & { render(): Render[".md"] };
"en/threat-to-risk.md": {
	id: "en/threat-to-risk.md";
  slug: "en/threat-to-risk";
  body: string;
  collection: "presentations";
  data: any
} & { render(): Render[".md"] };
"en/twinsanity-recon-talk.md": {
	id: "en/twinsanity-recon-talk.md";
  slug: "en/twinsanity-recon-talk";
  body: string;
  collection: "presentations";
  data: any
} & { render(): Render[".md"] };
};
"projects": {
"ar/cyber-station-slides.md": {
	id: "ar/cyber-station-slides.md";
  slug: "ar/cyber-station-slides";
  body: string;
  collection: "projects";
  data: any
} & { render(): Render[".md"] };
"ar/digital-forensic-toolkit.md": {
	id: "ar/digital-forensic-toolkit.md";
  slug: "ar/digital-forensic-toolkit";
  body: string;
  collection: "projects";
  data: any
} & { render(): Render[".md"] };
"ar/evil-spark.md": {
	id: "ar/evil-spark.md";
  slug: "ar/evil-spark";
  body: string;
  collection: "projects";
  data: any
} & { render(): Render[".md"] };
"ar/python-email-extractor.md": {
	id: "ar/python-email-extractor.md";
  slug: "ar/python-email-extractor";
  body: string;
  collection: "projects";
  data: any
} & { render(): Render[".md"] };
"ar/twinsanity-recon.md": {
	id: "ar/twinsanity-recon.md";
  slug: "ar/twinsanity-recon";
  body: string;
  collection: "projects";
  data: any
} & { render(): Render[".md"] };
"en/cyber-station-slides.md": {
	id: "en/cyber-station-slides.md";
  slug: "en/cyber-station-slides";
  body: string;
  collection: "projects";
  data: any
} & { render(): Render[".md"] };
"en/digital-forensic-toolkit.md": {
	id: "en/digital-forensic-toolkit.md";
  slug: "en/digital-forensic-toolkit";
  body: string;
  collection: "projects";
  data: any
} & { render(): Render[".md"] };
"en/evil-spark.md": {
	id: "en/evil-spark.md";
  slug: "en/evil-spark";
  body: string;
  collection: "projects";
  data: any
} & { render(): Render[".md"] };
"en/python-email-extractor.md": {
	id: "en/python-email-extractor.md";
  slug: "en/python-email-extractor";
  body: string;
  collection: "projects";
  data: any
} & { render(): Render[".md"] };
"en/twinsanity-recon.md": {
	id: "en/twinsanity-recon.md";
  slug: "en/twinsanity-recon";
  body: string;
  collection: "projects";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = never;
}
