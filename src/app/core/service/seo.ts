import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoData {
  title: string;
  description: string;
  /** Path-only canonical, e.g. '/about'. Origin is taken from window.location. */
  path?: string;
  /** Absolute or relative URL of the social preview image. */
  image?: string;
  /** 'website' or 'article'. */
  type?: string;
  /** Set to true on pages that should not be indexed (e.g. /profile). */
  noIndex?: boolean;
}

const SITE_NAME = 'Rumen Terziev — Software Engineer';
const DEFAULT_IMAGE = '/images/avatar.avif';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  update(data: SeoData): void {
    const pageTitle = data.title === SITE_NAME ? data.title : `${data.title} · Rumen Terziev`;
    this.title.setTitle(pageTitle);

    const origin = this.document.defaultView?.location?.origin ?? 'https://rumen.dev';
    const url = origin + (data.path ?? this.document.defaultView?.location?.pathname ?? '/');
    const image = data.image
      ? data.image.startsWith('http')
        ? data.image
        : origin + data.image
      : origin + DEFAULT_IMAGE;
    const type = data.type ?? 'website';

    this.setTag('name', 'description', data.description);
    this.setTag('name', 'robots', data.noIndex ? 'noindex, nofollow' : 'index, follow');

    this.setTag('property', 'og:title', pageTitle);
    this.setTag('property', 'og:description', data.description);
    this.setTag('property', 'og:url', url);
    this.setTag('property', 'og:type', type);
    this.setTag('property', 'og:image', image);
    this.setTag('property', 'og:site_name', SITE_NAME);

    this.setTag('name', 'twitter:card', 'summary_large_image');
    this.setTag('name', 'twitter:title', pageTitle);
    this.setTag('name', 'twitter:description', data.description);
    this.setTag('name', 'twitter:image', image);

    this.setCanonical(url);
  }

  private setTag(attr: 'name' | 'property', key: string, content: string): void {
    const selector = `${attr}="${key}"`;
    if (this.meta.getTag(selector)) {
      this.meta.updateTag({ [attr]: key, content });
    } else {
      this.meta.addTag({ [attr]: key, content });
    }
  }

  private setCanonical(url: string): void {
    const head = this.document.head;
    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
