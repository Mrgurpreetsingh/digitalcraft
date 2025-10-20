// Utilitaires SEO simples sans dépendances externes

// Changer le titre de la page
export const setPageTitle = (title) => {
  document.title = title ? `${title} | DigitalCraft` : 'DigitalCraft';
};

// Changer la description
export const setPageDescription = (description) => {
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    document.head.appendChild(metaDescription);
  }
  metaDescription.content = description;
};

// Changer l'URL canonique
export const setCanonicalUrl = (url) => {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = `https://digitalcraft.fr${url}`;
};

// Configuration SEO par page
export const pageSEO = {
  home: {
    title: 'Agence Web & Marketing Digital',
    description: 'DigitalCraft, agence web spécialisée dans la création de sites web, applications mobiles et marketing digital.',
    url: '/'
  },
  services: {
    title: 'Nos Services - Création Web & Applications',
    description: 'Découvrez nos services de création de sites web, applications mobiles et marketing digital.',
    url: '/services'
  },
  portfolio: {
    title: 'Portfolio - Nos Réalisations',
    description: 'Découvrez nos réalisations en création de sites web et applications mobiles.',
    url: '/portfolio'
  },
  contact: {
    title: 'Contact - DigitalCraft',
    description: 'Contactez DigitalCraft pour vos projets web et applications mobiles.',
    url: '/contact'
  },
  devis: {
    title: 'Devis Gratuit - Création Site Web',
    description: 'Demandez un devis gratuit pour votre projet web ou application mobile.',
    url: '/devis'
  }
};

// Fonction pour appliquer le SEO d'une page
export const applyPageSEO = (pageKey) => {
  const seo = pageSEO[pageKey] || pageSEO.home;
  
  setPageTitle(seo.title);
  setPageDescription(seo.description);
  setCanonicalUrl(seo.url);
}; 