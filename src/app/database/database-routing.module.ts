import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AdminGuardService} from '../auth/guards/admin-guard.service';
import {DatabaseComponent} from './database.component';

const routes: Routes = [
	{
		path: 'database',
		canActivate: [AdminGuardService],
		component: DatabaseComponent
	},
	{
		path: 'database/:tab',
		canActivate: [AdminGuardService],
		component: DatabaseComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DatabaseRoutingModule {
}
