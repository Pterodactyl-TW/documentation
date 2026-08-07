export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData, // site metadata
  isServer // is this enhancement applied in server-rendering or client
}) => {
  // '/discord' isn't a VuePress page (it's a static redirect file in .vuepress/public),
  // so client-side navigation to it (e.g. typing the URL while the SPA is already loaded)
  // would otherwise hit the catch-all 404 route instead of the static file. Register it
  // as a real route so it works the same whether hit as a fresh page load or via the SPA.
  router.addRoutes([
    {
      path: '/discord',
      beforeEnter: (to, from, next) => {
        window.location.href = 'https://discord.gg/qHjdfGnztZ'
      }
    },
    {
      path: '/discord/',
      beforeEnter: (to, from, next) => {
        window.location.href = 'https://discord.gg/qHjdfGnztZ'
      }
    }
  ])

  findVersionedPaths(siteData.themeConfig.sidebar).forEach(vp => {
    router.addRoutes(
      router.options.routes.map(route => {
        if (route.path.startsWith(vp.path + vp.currentVersion)) {
          return [
            {
              path: route.path.replace(vp.currentVersion, "current"),
              redirect: route.path
            }, {
              path: route.path.replace(vp.currentVersion + "/", ""),
              redirect: route.path
            }
          ]
        }
        return undefined
      }).filter(x => x).flat().concat([
        { path: '/panel/1.0/upgrade/1.0.html', redirect: '/panel/1.0/updating.html' },
        { path: '/panel/1.0/upgrade/0.7_to_1.0.html', redirect: '/panel/1.0/legacy_upgrade.html' },
      ])
    )
  })
}

function findVersionedPaths(paths) {
  return Object.entries(paths).map(([path, children]) => {
    return children
      .filter(child => Array.isArray(child.versions))
      .map(child => ({ ...child, path: pathJoin(path, child.path) }))
  }).flat()
}

// https://stackoverflow.com/a/29855282/4430124
function pathJoin(...parts) {
  const separator = '/';
  const replace = new RegExp(separator + '{1,}', 'g');

  return parts.join(separator).replace(replace, separator);
}
