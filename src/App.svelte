
<script lang="ts">
  import { writable } from 'svelte/store';
  import { Router, Route, Link, navigate } from 'svelte-routing';
  import HomePage from './pages/HomePage.svelte';
  import AdminLoginPage from './pages/AdminLoginPage.svelte';
  import AdminDashboardPage from './pages/admin/AdminDashboardPage.svelte';
  import PromoPage from './pages/promo/PromoPage.svelte';
  import NotFoundPage from './pages/NotFoundPage.svelte';


  import { log } from './lib/logger';
   import ForgotPasswordPage from './pages/ForgotPasswordPage.svelte';
  // Auth state
  const isAuthenticated = writable(false);
  function login() {
    log('Admin login triggered');
    isAuthenticated.set(true);
    log('Admin authenticated');
  }
  function logout() {
    log('Admin logout triggered');
    isAuthenticated.set(false);
    log('Admin unauthenticated');
    navigate('/admin');
  }
  log('App.svelte loaded');
  
</script>



<Router>
  <Route path="/">
    <HomePage />
  </Route>
  <Route path="/admin">
    <AdminLoginPage />
  </Route>
  <Route path="/admin-dashboard">
    <AdminDashboardPage />
  </Route>
  <Route path="/:storeRoute">
    <PromoPage />
  </Route>
  <Route path="/forgot-password">
    <ForgotPasswordPage />
  </Route>
  <Route path="*">
    <NotFoundPage />
  </Route>
</Router>