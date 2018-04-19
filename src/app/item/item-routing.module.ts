import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EmployeeGuardService} from '../auth/guards/employee-guard.service';
import {BranchGuardService} from '../branch/branch-guard.service';
import {ItemDetailComponent} from './item-detail/item-detail.component';
import {ItemSearchComponent} from './item-search/item-search.component';

const routes: Routes = [
	{
		path: 'item',
		canActivate: [EmployeeGuardService, BranchGuardService],
		children: [
			{
				path: 'search',
				component: ItemSearchComponent
			},
			{
				path: ':id/detail',
				component: ItemDetailComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ItemRoutingModule {
}
