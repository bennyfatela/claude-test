import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('./views/Dashboard.vue'),
    },
    {
      path: '/players',
      name: 'Players',
      component: () => import('./views/Players.vue'),
    },
    {
      path: '/sessions',
      name: 'TrainingSessions',
      component: () => import('./views/TrainingSessions.vue'),
    },
    {
      path: '/games',
      name: 'Games',
      component: () => import('./views/Games.vue'),
    },
    {
      path: '/games/:id',
      name: 'GameDetails',
      component: () => import('./views/GameDetails.vue'),
    },
    {
      path: '/statistics',
      name: 'Statistics',
      component: () => import('./views/Statistics.vue'),
    },
  ],
});

export default router;
