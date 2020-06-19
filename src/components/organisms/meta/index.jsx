import React from 'react';
import PropTypes from 'typedefs/proptypes';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import config from 'config/global';
import literals from 'lang/en/client/common';

require('styles/index.scss'); // Do not change this to `import`, it's not going to work, no clue why

const propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  acceptsCookies: PropTypes.bool,
  meta: PropTypes.arrayOf(PropTypes.meta),
  logoSrc: PropTypes.string,
  structuredData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    slug: PropTypes.string,
    orgLogoSrc: PropTypes.string,
    firstSeen: PropTypes.string,
    lastUpdated: PropTypes.string,
  }),
  breadcrumbsData: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      name: PropTypes.string,
    })
  ),
  canonical: PropTypes.string,
};

/**
 * Creates the `<head>` metadata content.
 * Dependent on `react-helmet` external module.
 * @param {string} title - Page title (leave empty to use the website title)
 * @param {string} description - Page description (leave empty to use the website title)
 * @param {bool} acceptsCookies - Does the user accept cookies? (Redux-connected)
 * @param {*} meta - Array of metadata objects (if any)
 * @param {string} logoSrc - Page logo URI
 * @param {object} structuredData - Structured data for the page (if any)
 * @param {object} breadcrumbsData - Structured data for breadcrumbs (if any)
 * @param {string} canonical - Canonical slug (not full URL) of this page, if canonical
 */
const Meta = ({
  title,
  description = '',
  acceptsCookies,
  meta = [],
  logoSrc,
  structuredData,
  breadcrumbsData,
  canonical = '',
}) => {
  const metaDescription = description || literals.siteDescription;

  // Load scripts
  const scripts = [];
  if (structuredData) {
    scripts.push({
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': `${config.websiteUrl}${structuredData.slug}`,
        },
        'headline': structuredData.title,
        'image': [
          `${config.websiteUrl}${logoSrc}`,
        ],
        'datePublished': structuredData.firstSeen,
        'dateModified': structuredData.lastUpdated,
        'author': {
          '@type': 'Organization',
          'name': config.orgName,
          'logo': {
            '@type': 'ImageObject',
            'url': `${config.websiteUrl}${structuredData.orgLogoSrc}`,
          },
        },
        'publisher': {
          '@type': 'Organization',
          'name': config.orgName,
          'logo': {
            '@type': 'ImageObject',
            'url': `${config.websiteUrl}${structuredData.orgLogoSrc}`,
          },
        },
        'description': structuredData.description,
      }),
    });
  }

  if (breadcrumbsData) {
    scripts.push({
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbsData.map((breadcrumb, i) => ({
          '@type': 'ListItem',
          'position': i + 1,
          'item': {
            '@id': `${config.websiteUrl}${breadcrumb.url}`,
            'name': `${breadcrumb.name}`,
          },
        })),
      }),
    });
  }

  if(typeof window !== 'undefined' && acceptsCookies) {
    scripts.push({
      async: '',
      src: `https://www.googletagmanager.com/gtag/js?id=${config.googleAnalytics.id}`,
    });

    scripts.push({
      innerHTML: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag(
        'config',
        '${config.googleAnalytics.id}',
        ${JSON.stringify(config.googleAnalytics.config)}
      );
      `,
    });
    // Send a pageview only the first time that gtag is added (is this safe?)
    if(typeof gtag === 'undefined') {
      scripts.push({
        innerHTML: `
        var hasFired = false;
        if(!hasFired){
          window.gtag('event', 'page_view', { page_path: '${window.location.pathname}' });
          hasFired = true;
        }`,
      });
    }
  }

  return (
    <Helmet
      htmlAttributes={ { lang: 'en' } }
      title={ title ? title : literals.siteName }
      titleTemplate={ title ? `%s - ${literals.siteName}` : '%s' }
      meta={ [
        {
          name: `description`,
          content: metaDescription,
        },
        {
          name: `viewport`,
          content: `width=device-width, initial-scale=1`,
        },
        {
          property: `og:title`,
          content: title ? `${title} - ${literals.siteName}` : literals.siteName,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:image`,
          content: `${config.websiteUrl}${logoSrc}`,
        },
        {
          name: `twitter:site`,
          content: config.twitterAccount,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:title`,
          content: title ? `${title}` : literals.siteName,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: `twitter:image`,
          content: `${config.websiteUrl}${logoSrc}`,
        },
      ].concat(meta) }
      script={ scripts }
    >
      <link
        rel="preconnect dns-prefetch"
        key="preconnect-google-analytics"
        href="https://www.google-analytics.com"
      />
      {
        canonical ?
          <link
            rel="canonical"
            href={ `${config.websiteUrl}${canonical}` }
          />
          : null
      }
    </Helmet>
  );
};

Meta.propTypes = propTypes;

export default connect(
  state => ({
    acceptsCookies: state.shell.acceptsCookies,
  }),
  null
)(Meta);
