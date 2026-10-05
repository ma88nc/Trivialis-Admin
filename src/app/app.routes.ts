import { Routes } from '@angular/router';
import { Welcome } from './welcome';
import { QuestionMaintenance } from './admin/question-maintenance/question-maintenance';

export const routes: Routes = [
    { path: '', component: Welcome },
    { path: 'admin', component: QuestionMaintenance},
    { path: '**', redirectTo: ''}
];
