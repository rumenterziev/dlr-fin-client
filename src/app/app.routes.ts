import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { About } from './features/about/about';
import { Applications } from './features/applications/applications';
import { Converter } from './features/applications/converter/converter';
import { Assistant } from './features/applications/assistant/assistant';
import { ServerError } from './features/server-error/server-error';
import { NotFound } from './features/not-found/not-found';
import { Privacy } from './features/privacy/privacy';
import { Terms } from './features/terms/terms';
import { authGuard } from './core/guard/auth-guard';
import { Login } from './features/login/login';
import { Profile } from './features/profile/profile';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'applications', component: Applications },
  { path: 'applications/converter', component: Converter },
  { path: 'applications/chat-ai', component: Assistant, canActivate: [authGuard] },
  { path: 'about', component: About },
  { path: 'login', component: Login },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'privacy', component: Privacy },
  { path: 'terms', component: Terms },
  { path: 'server-error', component: ServerError },
  { path: '**', component: NotFound },
];
