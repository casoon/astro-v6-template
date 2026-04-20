---
name: local-business-seo
description: Local SEO patterns for company/business websites. Use this skill when adding LocalBusiness JSON-LD, geo meta tags, regional keywords, areaServed schemas, or optimizing for local search visibility.
---

# Local Business SEO Skill

Patterns for optimizing Astro business websites for local search visibility (e.g. "Webentwicklung Rostock", "SEO Agentur Rostock").

## 1. LocalBusiness JSON-LD (Homepage)

Full structured data on the homepage with address, phone, geo coordinates, and founder:

```astro
---
// src/components/seo/LocalBusinessSchema.astro
export interface Props {
  name: string;
  description: string;
  url: string;
  telephone: string;
  email?: string;
  foundingDate?: string;
  founder?: { name: string; jobTitle?: string };
  address: {
    street: string;
    city: string;
    postalCode: string;
    region: string;       // e.g. "Mecklenburg-Vorpommern"
    regionCode: string;   // e.g. "DE-MV"
    country: string;      // e.g. "DE"
  };
  geo: { latitude: number; longitude: number };
  logo?: string;
  image?: string;
  sameAs?: string[];       // Social profiles
  openingHours?: string;   // e.g. "Mo-Fr 09:00-17:00"
  priceRange?: string;     // e.g. "€€"
}

const { name, description, url, telephone, email, foundingDate, founder, address, geo, logo, image, sameAs, openingHours, priceRange } = Astro.props;

const schema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": name,
  "description": description,
  "url": url,
  "@id": `${url}#organization`,
  "telephone": telephone,
  ...(email && { "email": email }),
  ...(foundingDate && { "foundingDate": foundingDate }),
  ...(founder && {
    "founder": {
      "@type": "Person",
      "name": founder.name,
      ...(founder.jobTitle && { "jobTitle": founder.jobTitle }),
    },
  }),
  "address": {
    "@type": "PostalAddress",
    "streetAddress": address.street,
    "addressLocality": address.city,
    "postalCode": address.postalCode,
    "addressRegion": address.region,
    "addressCountry": address.country,
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": geo.latitude,
    "longitude": geo.longitude,
  },
  ...(logo && { "logo": logo }),
  ...(image && { "image": image }),
  ...(sameAs && { "sameAs": sameAs }),
  ...(openingHours && { "openingHoursSpecification": { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": openingHours.split("-")[0]?.split(" ")[1], "closes": openingHours.split("-")[1] } }),
  ...(priceRange && { "priceRange": priceRange }),
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

### Usage on Homepage

```astro
<LocalBusinessSchema
  name="casoon - Digitale Systeme"
  description="Webentwicklung, SEO & digitale Systeme aus Rostock"
  url="https://casoon.dev"
  telephone="+49-XXX-XXXXXXX"
  email="info@casoon.dev"
  foundingDate="20XX-01-01"
  founder={{ name: "Name", jobTitle: "Geschäftsführer" }}
  address={{
    street: "Straße Nr.",
    city: "Rostock",
    postalCode: "18XXX",
    region: "Mecklenburg-Vorpommern",
    regionCode: "DE-MV",
    country: "DE",
  }}
  geo={{ latitude: 54.0467, longitude: 12.0803 }}
  logo="https://casoon.dev/logo.png"
  sameAs={["https://github.com/casoon", "https://linkedin.com/..."]}
/>
```

## 2. Geo-Meta-Tags (Global via BaseHead/BaseLayout)

Add geo meta tags globally so they appear on **every page**:

```astro
---
// In BaseHead.astro or BaseLayout.astro <head>
export interface GeoMeta {
  region: string;      // ISO 3166-2, e.g. "DE-MV"
  placename: string;   // City name
  latitude: number;
  longitude: number;
}

const geo: GeoMeta = {
  region: "DE-MV",
  placename: "Rostock",
  latitude: 54.0467,
  longitude: 12.0803,
};
---

<!-- Geo Meta Tags -->
<meta name="geo.region" content={geo.region} />
<meta name="geo.placename" content={geo.placename} />
<meta name="geo.position" content={`${geo.latitude};${geo.longitude}`} />
<meta name="ICBM" content={`${geo.latitude}, ${geo.longitude}`} />
```

### Configuration Pattern

Store geo config centrally (e.g. in `src/config/business.ts`):

```typescript
// src/config/business.ts
export const businessConfig = {
  name: "casoon - Digitale Systeme",
  city: "Rostock",
  region: "Mecklenburg-Vorpommern",
  regionCode: "DE-MV",
  country: "DE",
  geo: { latitude: 54.0467, longitude: 12.0803 },
  telephone: "+49-XXX-XXXXXXX",
  email: "info@casoon.dev",
  url: "https://casoon.dev",
} as const;
```

## 3. areaServed – Hierarchisches Geo-Schema (Service-Seiten)

Für Service-Seiten (Webentwicklung, SEO, E-Commerce etc.) ein mehrstufiges `areaServed`:

```astro
---
// ServiceSchema.astro – JSON-LD for service pages
export interface Props {
  serviceName: string;
  serviceDescription: string;
  serviceUrl: string;
  providerName: string;
  providerUrl: string;
}

const { serviceName, serviceDescription, serviceUrl, providerName, providerUrl } = Astro.props;

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": serviceName,
  "description": serviceDescription,
  "url": serviceUrl,
  "provider": {
    "@type": "LocalBusiness",
    "name": providerName,
    "url": providerUrl,
    "@id": `${providerUrl}#organization`,
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Rostock",
      "containedInPlace": {
        "@type": "State",
        "name": "Mecklenburg-Vorpommern",
      },
    },
    {
      "@type": "State",
      "name": "Mecklenburg-Vorpommern",
      "containedInPlace": {
        "@type": "Country",
        "name": "Deutschland",
      },
    },
    {
      "@type": "Country",
      "name": "Deutschland",
    },
  ],
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

### Usage auf Service-Seiten

```astro
<ServiceSchema
  serviceName="Webentwicklung Rostock"
  serviceDescription="Professionelle Webentwicklung mit Astro, React und modernen Web-Technologien"
  serviceUrl="https://casoon.dev/webentwicklung"
  providerName="casoon - Digitale Systeme"
  providerUrl="https://casoon.dev"
/>
```

## 4. Regionale Keywords in Titles & Descriptions

Pattern für lokalisierte SEO-Titel mit Ortsbezug:

```typescript
// src/config/seo.ts
export const localSeoPages = {
  home: {
    title: "Webentwicklung & Digitale Systeme Rostock | casoon",
    description: "Professionelle Webentwicklung, SEO & digitale Systeme aus Rostock. Moderne Websites mit Astro, React und Tailwind.",
  },
  webentwicklung: {
    title: "Webentwicklung Rostock | Moderne Websites & Web-Apps | casoon",
    description: "Webentwicklung aus Rostock: performante Websites und Web-Applikationen mit Astro, React und TypeScript.",
  },
  seo: {
    title: "SEO Rostock | Suchmaschinenoptimierung & lokale SEO | casoon",
    description: "SEO-Agentur Rostock: technisches SEO, lokale Suchmaschinenoptimierung und Content-Strategie für bessere Rankings.",
  },
  ecommerce: {
    title: "E-Commerce Rostock | Online-Shops & digitale Marktplätze | casoon",
    description: "E-Commerce-Lösungen aus Rostock: performante Online-Shops mit modernen Technologien und optimierter Conversion.",
  },
  cloud: {
    title: "Cloud-Entwicklung Rostock | Serverless & Edge Computing | casoon",
    description: "Cloud-Entwicklung aus Rostock: Serverless-Architekturen, Edge Computing und skalierbare Cloud-Lösungen.",
  },
  apps: {
    title: "App-Entwicklung Rostock | Progressive Web Apps | casoon",
    description: "App-Entwicklung aus Rostock: Progressive Web Apps und mobile Anwendungen mit modernen Frameworks.",
  },
} as const;
```

### Regeln für lokale Keywords

- **Title**: Ort immer im Titel, möglichst vorn → "Webentwicklung Rostock | ..."
- **Description**: Ort natürlich einbauen, nicht keyword-stuffing → "...aus Rostock"
- **Max. Länge**: Title ≤ 60 Zeichen, Description ≤ 160 Zeichen
- **Markenname**: Am Ende nach Pipe `|`
- **H1**: Ort in der Hauptüberschrift, z.B. "Webentwicklung aus Rostock"

## 5. Implementierungs-Checkliste

### Neue Unternehmenswebseite aufsetzen

1. `src/config/business.ts` anlegen mit Firmendaten, Geo-Koordinaten, Kontakt
2. `src/config/seo.ts` mit lokalisierten Titles/Descriptions pro Seite
3. Geo-Meta-Tags in `BaseHead.astro` / `BaseLayout.astro` einbauen (global)
4. `LocalBusinessSchema.astro` auf Homepage einbinden
5. `ServiceSchema.astro` auf jeder Service-Seite mit `areaServed`-Hierarchie
6. Titles/Descriptions aus `seo.ts` in `<PageSEO>` verwenden
7. OG-Images mit regionalem Bezug generieren

### Validierung

- [Google Rich Results Test](https://search.google.com/test/rich-results) für JSON-LD
- [Schema.org Validator](https://validator.schema.org/) für Structured Data
- Google Search Console → Abdeckung prüfen nach Deploy
- `<meta name="geo.*">` Tags im HTML-Source prüfen

### E2E-Test-Pattern

```typescript
// e2e/tests/local-seo.spec.ts
test('homepage has LocalBusiness JSON-LD', async ({ page }) => {
  await page.goto('/');
  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
  const schemas = jsonLd.map((s) => JSON.parse(s));
  const localBusiness = schemas.find((s) => s['@type'] === 'LocalBusiness');
  expect(localBusiness).toBeDefined();
  expect(localBusiness.address.addressLocality).toBe('Rostock');
  expect(localBusiness.geo.latitude).toBe(54.0467);
});

test('all pages have geo meta tags', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="geo.region"]')).toHaveAttribute('content', 'DE-MV');
  await expect(page.locator('meta[name="geo.placename"]')).toHaveAttribute('content', 'Rostock');
});

test('service pages have areaServed schema', async ({ page }) => {
  await page.goto('/webentwicklung');
  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
  const schemas = jsonLd.map((s) => JSON.parse(s));
  const service = schemas.find((s) => s['@type'] === 'Service');
  expect(service?.areaServed).toHaveLength(3);
  expect(service?.areaServed[0]['@type']).toBe('City');
});
```

## 6. Ranking-Strategie: Was wirklich funktioniert

Erfolgreiche lokale Seiten belegen viele Keywords in den ersten 10–20 Ergebnissen — nicht durch Black-Hat-Taktiken, sondern durch drei konsequent durchgezogene Grundprinzipien:

### 6.1 Lokale Substanz, nicht lokale Keyword-Dichte

Der Ort erscheint auf Service-Seiten 20–32x — aber nie als bloße Wiederholung. Die Ortsreferenz ist immer an echten Aussagen verankert:

> "Webentwicklung aus Rostock für Unternehmen in der Region"

Das unterscheidet sich von Keyword-Stuffing, weil der Satz **auch ohne den Ortsnamen Sinn ergibt**. Test: Streiche den Ort — bleibt eine sinnvolle Aussage? Dann ist es echte Substanz.

### 6.2 Prozesstiefe als Vertrauenssignal

Die stärksten Seiten erklären nicht nur *was* der Betreiber macht, sondern *wie* — mit konkreten Prozessbeschreibungen, Phaseneinteilungen und realen Entscheidungspunkten. Das zeigt Kompetenz und hält Nutzer auf der Seite (→ niedriger Bounce, höhere Verweildauer).

**Umsetzung:**
- 5-Schritt-Prozesse mit Zwischentiteln
- Phase 1 / Phase 2 / Phase 3 Struktur mit realen Entscheidungspunkten
- Konkretes statt Allgemeines: "Wir prüfen Ihr CMS auf..." statt "Wir analysieren Ihre Website"

**Content-Tiefe:** Ziel ~4.000 Wörter pro Service-Seite, starke Seiten erreichen 6.000–8.000 Wörter.

### 6.3 Breites Service-Spektrum mit einzelnen Landing-Pages

Jede Leistung bekommt eine **eigene URL** mit eigenem Title-Tag und eigener Meta-Description. Das erzeugt viele Einstiegspunkte für verschiedene Suchanfragen und stärkt die interne Verlinkung.

```
/webentwicklung        → eigene H1, eigener Title, eigene Description
/seo                   → eigene H1, eigener Title, eigene Description
/ecommerce             → eigene H1, eigener Title, eigene Description
/cloud                 → eigene H1, eigener Title, eigene Description
```

Nicht: eine `/leistungen`-Seite mit Abschnitten für alle Dienste.

### 6.4 Weitere Ranking-Hebel

- **Schema.org LocalBusiness-Markup** — wenn Adresse + Kontakt vorhanden sind (→ Abschnitt 1)
- **BreadcrumbList-Schema** — auf allen Unterseiten für bessere SERP-Darstellung
- **FAQ-Schema** — auf Service-Seiten mit häufigen Fragen zum Dienst
- **Heading-Hierarchie flach halten** — nicht zu viele gleichrangige H2; eine klare H1 → 2–4 H2 → H3-Details
- **Interne Verlinkung** — jede Service-Seite verlinkt auf verwandte Dienste + Homepage

### 6.5 BreadcrumbList-Schema

```astro
---
// BreadcrumbSchema.astro
export interface Props {
  items: { name: string; url: string }[];
}

const { items } = Astro.props;

const schema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url,
  })),
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

```astro
<BreadcrumbSchema items={[
  { name: "Home", url: "https://casoon.dev" },
  { name: "Webentwicklung", url: "https://casoon.dev/webentwicklung" },
]} />
```

### 6.6 FAQ-Schema

```astro
---
// FaqSchema.astro
export interface Props {
  questions: { question: string; answer: string }[];
}

const { questions } = Astro.props;

const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": questions.map((q) => ({
    "@type": "Question",
    "name": q.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": q.answer,
    },
  })),
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

## 7. i18n-Hinweise für lokale SEO

Bei mehrsprachigen Seiten (de/en):

- **Deutsche Seiten**: Ort auf Deutsch → "Rostock", "Mecklenburg-Vorpommern"
- **Englische Seiten**: Ort auf Englisch → "Rostock" (bleibt gleich), "Mecklenburg-Western Pomerania"
- JSON-LD `areaServed`: Sprache des jeweiligen Dokuments verwenden
- Geo-Meta-Tags: Sprachunabhängig (ISO-Codes), auf allen Sprachversionen identisch
- `hreflang`-Tags verweisen korrekt auf Sprachvarianten (wird durch Sitemap-Config abgedeckt)
