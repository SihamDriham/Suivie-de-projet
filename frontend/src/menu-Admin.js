const menuAdmin = {
 items: [
   {
     id: 'navigation',
     title: 'Navigation',
     type: 'group',
     icon: 'icon-navigation',
     children: [
       {
         id: 'dashboard',
         title: 'Tableau de bord',
         type: 'item',
         icon: 'feather icon-home',
         url: '/app/dashboard/default'
       }
     ]
   },

   {
     id: 'ui-forms',
     title: 'FORMS & TABLES',
     type: 'group',
     icon: 'icon-group',
     children: [
       {
         id: 'table',
         title: 'Projets',
         type: 'item',
         icon: 'feather icon-box',
         url: '/tables/AffichageProjets'
       },
       {
         id: 'table',
         title: 'Utilisateurs',
         type: 'item',
         icon: 'feather icon-server',
         url: '/tables/bootstrap'
       },
       {
        id: 'table',
        title: 'Calendrier',
        type: 'item',
        icon: 'feather icon-book',
        url: '/calendar'
      },
      {
        id: 'table',
        title: 'Liste de tâches',
        type: 'item',
        icon: 'feather icon-file-text',
        url: '/sample-page'
      }
     ]
   },
 ]
};

export default menuAdmin;
