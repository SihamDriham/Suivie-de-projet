const menuUser = {
 items: [
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
         url: '/tables/ProjetUser'
       },
      {
        id: 'table',
        title: 'Liste de tâches',
        type: 'item',
        icon: 'feather icon-file-text',
        url: '/sample-page'
      },
       {
        id: 'table',
        title: 'Calendrier',
        type: 'item',
        icon: 'feather icon-book',
        url: '/calendar'
      }
     ]
   },
 ]
};

export default menuUser;
