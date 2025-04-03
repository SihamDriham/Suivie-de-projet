import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import { BASE_URL } from './config/constant';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    exact: true,
    path: '/login',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: true,
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: true,
    path: '/logout',
    element: lazy(() => import('./views/auth/logout/logout'))
  },
  {
    exact: true,
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    exact: true,
    path: '/auth/reset-password-1',
    element: lazy(() => import('./views/auth/reset-password/ResetPassword1'))
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: true,
        path: '/app/dashboard/default',
        element: lazy(() => import('./views/dashboard/index'))
      },
      {
        exact: true,
        path: '/basic/button',
        element: lazy(() => import('./views/ui-elements/basic/BasicButton'))
      },
      {
        exact: true,
        path: '/basic/badges',
        element: lazy(() => import('./views/ui-elements/basic/BasicBadges'))
      },
      {
        exact: true,
        path: '/basic/breadcrumb',
        element: lazy(() => import('./views/ui-elements/basic/BasicBreadcrumb'))
      },
      {
        exact: true,
        path: '/basic/pagination',
        element: lazy(() => import('./views/ui-elements/basic/BasicPagination'))
      },
      {
        exact: true,
        path: '/basic/collapse',
        element: lazy(() => import('./views/ui-elements/basic/BasicCollapse'))
      },
      {
        exact: true,
        path: '/basic/tabs-pills',
        element: lazy(() => import('./views/ui-elements/basic/BasicTabsPills'))
      },
      {
        exact: true,
        path: '/basic/typography/projects/:projetId/tasks',
        element: lazy(() => import('./views/ui-elements/basic/BasicTypography'))
      },      
      {
        exact: true,
        path: '/forms/form-basic',
        element: lazy(() => import('./views/forms/FormsElements'))
      },
      {
        exact: true,
        path: '/search',
        element: lazy(() => import('./views/search/projectSearch'))
      },
      {
        exact: true,
        path: '/forms/AddProject',
        element: lazy(() => import('./views/forms/AddProject'))
      },
      {
        exact: true,
        path: '/forms/AddTask/:phaseId/:projetId',
        element: lazy(() => import('./views/forms/AddTask'))
      },
      {
        exact: true,
        path: '/forms/AddConver/66322065ceedaf6c087aab29',
        element: lazy(() => import('./views/forms/AddConver'))
      },
      {
        exact: true,
        path: '/forms/ModifierProjet/:id',
        element: lazy(() => import('./views/forms/ModifierProjet'))
      },
      {
        exact: true,
        path: '/forms/ModifierRPU/:id/:projetId',
        element: lazy(() => import('./views/forms/ModifierRPU'))
      },
      {
        exact: true,
        path: '/forms/ModifierTache/:id/:phaseId/:projetId',
        element: lazy(() => import('./views/forms/ModifierTache'))
      },
      {
        exact: true,
        path: '/forms/RPU/:id',
        element: lazy(() => import('./views/forms/RPU'))
      },

      {
        exact: true,
        path: '/forms/phase/:projetId',
        element: lazy(() => import('./views/forms/AddPhase'))
      },

      {
        exact: true,
        path: '/forms/ModifierPhase/:id/:projetId',
        element: lazy(() => import('./views/forms/ModifierPhase'))
      },
      {
        exact: true,
        path: '/user/modifier/:id', 
        element: lazy(() => import('./views/forms/ModifierUser'))
      },

      {
        exact: true,
        path: '/tables/bootstrap',
        element: lazy(() => import('./views/tables/BootstrapTable'))
      },
      {
        exact: true,
        path: '/tables/projectResult',
        element: lazy(() => import('./views/search/projectResult'))
      },
      {
        exact: true,
        path: '/tables/projetResult',
        element: lazy(() => import('./views/search/projetResult'))
      },
      {
        exact: true,
        path: '/tables/phaseResult/:projetId',
        element: lazy(() => import('./views/search/phaseResult'))
      },
      {
        exact: true,
        path: '/tables/taskResult/:phaseId/:projetId',
        element: lazy(() => import('./views/search/taskResult'))
      },
      {
        exact: true,
        path: '/tables/tacheResult/:projetId',
        element: lazy(() => import('./views/search/tacheResult'))
      },
      {
        exact: true,
        path: '/tables/userResult',
        element: lazy(() => import('./views/search/userResult'))
      }, 
      {
        exact: true,
        path: '/tables/listResult',
        element: lazy(() => import('./views/search/listResult'))
      },
      // {
      //   exact: true,
      //   path: '/tables/result',
      //   element: lazy(() => import('./views/search/projectResult'))
      // },
      {
        exact: true,
        path: '/tables/AffichageTaches/:phaseId/:projetId',
        element: lazy(() => import('./views/tables/taches'))
      },
      {
        exact: true,
        path: '/tables/AffichageRPU/:projetId',
        element: lazy(() => import('./views/tables/afficheUsers'))
      },
      {
        exact: true,
        path: '/tables/phases/:projetId',
        element: lazy(() => import('./views/tables/phases'))
      },
      {
        exact: true,
        path: '/tables/ProjetUser',
        element: lazy(() => import('./views/tables/projetUser'))
      },
      {
        exact: true,
        path: '/tables/AffichageProjets',
        element: lazy(() => import('./views/tables/projects'))
      },
      {
        exact: true,
        path: '/charts/nvd3',
        element: lazy(() => import('./views/charts/nvd3-chart'))
      },
      {
        exact: true,
        path: '/sample-page',
        element: lazy(() => import('./views/extra/SamplePage'))
      },
      {
        exact: true,
        path: '/profile',
        element: lazy(() => import('./views/extra/profile'))
      },
      {
        exact: true,
        path: '/showAll',
        element: lazy(() => import('./views/extra/showAll'))
      },
      {
        path: '*',
        exact: true,
        element: () => <Navigate to={BASE_URL} />
      },
      {
        exact: true,
        path: '/calendar',
        element: lazy(() => import('./components/Calendar'))
      },
      {
        exact: true,
        path: '/edit-event/:idEvent',
        element: lazy(() => import('./views/forms/EditEvent'))
      },
      {
        exact: true,
        path: '/edit-detail/:detailId',
        element: lazy(() => import('./views/forms/EditDetails'))
      },
      {
        exact: true,
        path: '/add-detail/:jourId',
        element: lazy(() => import('./views/forms/add-detail'))
      },
      {
        exact: true,
        path: '/AddEvent/:projetId',
        element: lazy(() => import('./views/forms/AddEvent'))
      },
      {
        exact: true,
        path: '/AddDetails/:event_id',
        element: lazy(() => import('./views/forms/AddDetails'))
      }
    ]
  }
];

export default routes;
