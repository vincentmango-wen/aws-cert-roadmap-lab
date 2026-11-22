# Blog publication and indexing

The registry in src/contents/blog/blogPosts.ts is the global publication gate. A registry entry with published: false is unavailable in every language. For a published registry entry, each existing localized MDX file can independently set published: false. An omitted MDX publication flag defaults to true.

Lists, static parameters and detail routes use this two-level publication decision. The server passes published Blog locale availability to both desktop and mobile language switchers. Non-Blog navigation keeps its existing behavior.

## Indexing is separate from availability

A published noIndex article remains routable and selectable. Blog sitemap entries and hreflang clusters include only published, indexable locales. An unavailable or noIndex Japanese page is not an x-default target. Empty eligible sets emit no Blog sitemap entries.

Preserve existing metadata precedence: when localized MDX exists, its noIndex value (default false) supplies the article metadata. When that MDX is absent, registry metadata, including noIndex, applies. The sitemap follows this same resolved metadata rather than treating missing MDX as automatically indexable.

## Existing fallback is unchanged

Missing English or Chinese MDX retains registry metadata and uses the Japanese body when present. Missing Japanese content, or missing both the requested and fallback content, retains the existing empty-body behavior. Japanese frontmatter flags do not become overrides for another locale's registry fallback metadata. Changing this fallback contract requires a separate decision.

Homepage recommendations remain independently qualified by the existing three-language content, metadata and date requirements. Route availability does not imply homepage eligibility. No article dates, publication content, homepage ordering, badges, correction notes or colors are changed by this policy.

Regression coverage: blog-publication.test.tsx exercises unpublished registry/locales, noIndex, missing MDX, empty eligible sets, rendered navigation and SEO outputs; blog-locale-parity.test.ts preserves identity/date/content parity while allowing publication flags to differ. Existing real-content indexing and homepage tests remain in place.
