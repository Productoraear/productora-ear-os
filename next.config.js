/** @type {import('next').NextConfig} */
const config = {
  react: {
    useProductionBuild: true,
  },
  routes: [
    // Ruta prioritizada para eventos específicos con parámetros restrictivos
    {
      source: '/eventos/mariachi',
      destination: '/eventos/mariachi',
      exact: true,
    },
    // Ruta para servicios con categorías y provincias específicas usando regex más restrictivo
    {
      source: '/servicios/([a-z]{2,})/([a-z]{2,})',
      destination: '/servicios/:category/:province',
      exact: false,
      priority: 1,
    },
    // Ruta general cañero para servicios con parámetros dinámicos
    {
      source: '/servicios/([^/]+)',
      destination: '/404',
      exact: false,
      priority: 2,
    }
  ],
};

module.exports = config;