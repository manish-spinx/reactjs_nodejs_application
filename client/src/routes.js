import React from 'react';
import requiresAuth from './views/HOC/requiresAuth';


const Breadcrumbs = React.lazy(() => import('./views/Base/Breadcrumbs'));
const Cards = React.lazy(() => import('./views/Base/Cards'));
const Carousels = React.lazy(() => import('./views/Base/Carousels'));
const Collapses = React.lazy(() => import('./views/Base/Collapses'));
const Dropdowns = React.lazy(() => import('./views/Base/Dropdowns'));
const Forms = React.lazy(() => import('./views/Base/Forms'));


// custom component with routing
const Custom_users = React.lazy(() => import('./views/Base/User/User'));
const Custom_edit_users = React.lazy(() => import('./views/Base/User/Edituser'));
const Custom_users_list = React.lazy(() => import('./views/Base/User/Listuser'));
const Custom_users_profile = React.lazy(() => import('./views/Base/User/Userprofile'));
const Custom_change_password = React.lazy(() => import('./views/Base/User/Changepassword'));
const Datatablelistuser = React.lazy(() => import('./views/Base/User/Datatablelistuser'));
const NewDatatablelistuser = React.lazy(() => import('./views/Base/User/NewDatatablelistuser'));


// Job Titles Module Routes
const Listjob = React.lazy(() => import('./views/Base/Jobtitles/Listjob'));
const Addjob = React.lazy(() => import('./views/Base/Jobtitles/Addjob'));
const Editjob = React.lazy(() => import('./views/Base/Jobtitles/Editjob'));

// Peoples Module Routes
const Addpeople = React.lazy(() => import('./views/Base/Peoples/Addpeople'));
const Listpeople = React.lazy(() => import('./views/Base/Peoples/Listpeople'));
const Editpeople = React.lazy(() => import('./views/Base/Peoples/Editpeople'));
//test people
const Managepeople = React.lazy(() => import('./views/Base/Peoples/Managepeople'));


// Article Module Routes
const Listarticle = React.lazy(() => import('./views/Base/Articles/Listarticle'));
const Addarticle = React.lazy(() => import('./views/Base/Articles/Addarticle'));
const Editarticle = React.lazy(() => import('./views/Base/Articles/Editarticle'));
const Managearticle = React.lazy(() => import('./views/Base/Articles/Managearticle'));

// Strategies Module Routes
const Liststrategies = React.lazy(() => import('./views/Base/Strategies/Liststrategies'));
const Managestrategy = React.lazy(() => import('./views/Base/Strategies/Managestrategy'));

// Contact US Module Routes
const Listcontactus = React.lazy(() => import('./views/Base/Conatctus/Listcontactus'));

// Page Module Routes
const Listpage = React.lazy(() => import('./views/Base/Pages/Listpage'));
const Managepage = React.lazy(() => import('./views/Base/Pages/Managepage'));

// Portfolio Module Routes
const Listportfolio = React.lazy(() => import('./views/Base/Portfolio/Listportfolio'));
const Manageportfolio = React.lazy(() => import('./views/Base/Portfolio/Manageportfolio'));


const Jumbotrons = React.lazy(() => import('./views/Base/Jumbotrons'));
const ListGroups = React.lazy(() => import('./views/Base/ListGroups'));
const Navbars = React.lazy(() => import('./views/Base/Navbars'));
const Navs = React.lazy(() => import('./views/Base/Navs'));
const Paginations = React.lazy(() => import('./views/Base/Paginations'));
const Popovers = React.lazy(() => import('./views/Base/Popovers'));
const ProgressBar = React.lazy(() => import('./views/Base/ProgressBar'));
const Switches = React.lazy(() => import('./views/Base/Switches'));
const Tables = React.lazy(() => import('./views/Base/Tables'));
const Tabs = React.lazy(() => import('./views/Base/Tabs'));
const Tooltips = React.lazy(() => import('./views/Base/Tooltips'));
const BrandButtons = React.lazy(() => import('./views/Buttons/BrandButtons'));
const ButtonDropdowns = React.lazy(() => import('./views/Buttons/ButtonDropdowns'));
const ButtonGroups = React.lazy(() => import('./views/Buttons/ButtonGroups'));
const Buttons = React.lazy(() => import('./views/Buttons/Buttons'));
const Charts = React.lazy(() => import('./views/Charts'));
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const CoreUIIcons = React.lazy(() => import('./views/Icons/CoreUIIcons'));
const Flags = React.lazy(() => import('./views/Icons/Flags'));
const FontAwesome = React.lazy(() => import('./views/Icons/FontAwesome'));
const SimpleLineIcons = React.lazy(() => import('./views/Icons/SimpleLineIcons'));
const Alerts = React.lazy(() => import('./views/Notifications/Alerts'));
const Badges = React.lazy(() => import('./views/Notifications/Badges'));
const Modals = React.lazy(() => import('./views/Notifications/Modals'));
const Colors = React.lazy(() => import('./views/Theme/Colors'));
const Typography = React.lazy(() => import('./views/Theme/Typography'));
const Widgets = React.lazy(() => import('./views/Widgets/Widgets'));
const Users = React.lazy(() => import('./views/Users/Users'));
const User = React.lazy(() => import('./views/Users/User'));


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: requiresAuth(Dashboard) },
  { path: '/theme', exact: true, name: 'Theme', component: Colors},
  { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/theme/typography', name: 'Typography', component: Typography },
  { path: '/base', exact: true, name: 'Base', component: Cards },
  { path: '/base/cards', name: 'Cards', component: Cards },
  { path: '/base/forms', name: 'Forms', component: Forms },
  
  { path: '/admin/add_user', name: 'Add User', component: Custom_users },
  { path: '/admin/edit_user/:id', name: 'Edit User', component: Custom_edit_users },  
  { path: '/admin/user_profile', name: 'User', component:  Custom_users_profile},
  { path: '/admin/change_password', name: 'User', component:  Custom_change_password},

  { path: '/admin/old_list_user', name: 'User', component:  Datatablelistuser},
  { path: '/admin/old_datatable_user', name: 'User', component:  Datatablelistuser},  
  { path: '/admin/list_user', name: 'User', component:  NewDatatablelistuser},

  //{ path: '/admin/datatable_user', name: 'User', component:  Datatablelistuser},

  /****************Job-Titles-Module**********Routes*******************/
  { path: '/admin/list_job', name: 'Job Titles List', component:  requiresAuth(Listjob)},
  { path: '/admin/add_job', name: 'Add Job Title', component:  requiresAuth(Addjob)},
  { path: '/admin/edit_job/:id', name: 'Edit Job Title', component:  requiresAuth(Editjob)},

  /****************People-Module**********Routes*******************/
  //{ path: '/admin/add_people', name: 'Add People', component: Addpeople},
  //{ path: '/admin/edit_people/:id', name: 'Edit People', component: Editpeople},

  { path: '/admin/add_people', name: 'Add People', component: requiresAuth(Managepeople)},
  { path: '/admin/edit_people/:id', name: 'Edit People', component: requiresAuth(Managepeople)},
  { path: '/admin/list_peoples', name: 'People List', component: requiresAuth(Listpeople)},
  
  // testing purpose
  //{ path: '/admin/add_people_test', name: 'Add People Test', component: Managepeople},
  //{ path: '/admin/edit_people_test/:id', name: 'Edit People Test', component: Managepeople},

  /****************Article-Module**********Routes*******************/
  { path: '/admin/list_articles', name: 'Article List', component: requiresAuth(Listarticle)},
  //{ path: '/admin/add_article', name: 'Add Article', component: Addarticle},
  //{ path: '/admin/edit_article/:id', name: 'Edit Article', component: Editarticle},

  { path: '/admin/add_article', name: 'Add Article', component: requiresAuth(Managearticle)},
  { path: '/admin/edit_article/:id', name: 'Edit Article', component: requiresAuth(Managearticle)},

  /****************Strategies-Module**********Routes*******************/
  { path: '/admin/list_strategies', name: 'Strategies List', component: requiresAuth(Liststrategies)},
  { path: '/admin/add_strategies', name: 'Add Strategies', component: requiresAuth(Managestrategy)},
  { path: '/admin/edit_strategies/:id', name: 'Edit Strategies', component: requiresAuth(Managestrategy)},
  /****************Contact US Module**********Routes*******************/
  { path: '/admin/list_contact_us', name: 'Contact List', component: requiresAuth(Listcontactus)},


  /****************Page Module**********Routes*******************/
  { path: '/admin/list_pages', name: 'Page List', component: requiresAuth(Listpage)},
  { path: '/admin/edit_page/:id', name: 'Edit Page', component: requiresAuth(Managepage)},

  
  /****************Portfolio Module**********Routes*******************/
  { path: '/admin/list_portfolio', name: 'Portfolio List', component: requiresAuth(Listportfolio)},  
  { path: '/admin/add_portfolio', name: 'Add Portfolio', component: requiresAuth(Manageportfolio)},
  { path: '/admin/edit_portfolio/:id', name: 'Edit Portfolio', component: requiresAuth(Manageportfolio)},

  
  { path: '/base/switches', name: 'Switches', component: Switches },
  { path: '/base/tables', name: 'Tables', component: Tables },
  { path: '/base/tabs', name: 'Tabs', component: Tabs },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  { path: '/base/carousels', name: 'Carousel', component: Carousels },
  { path: '/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/base/dropdowns', name: 'Dropdowns', component: Dropdowns },
  { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/base/navbars', name: 'Navbars', component: Navbars },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/buttons', exact: true, name: 'Buttons', component: Buttons },
  { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  { path: '/buttons/button-dropdowns', name: 'Button Dropdowns', component: ButtonDropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/font-awesome', name: 'Font Awesome', component: FontAwesome },
  { path: '/icons/simple-line-icons', name: 'Simple Line Icons', component: SimpleLineIcons },
  { path: '/notifications', exact: true, name: 'Notifications', component: Alerts },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/users', exact: true,  name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },
];

export default routes;
