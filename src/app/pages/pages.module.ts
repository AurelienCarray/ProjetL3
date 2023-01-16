import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MatchComponent } from './match/match.component';
import { ContactComponent } from './contact/contact.component';
import { ClassementComponent } from './classement/classement.component';
import { ReglesComponent } from './regles/regles.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PariComponent } from './pari/pari.component';

const routes: Routes = [
  {path: 'classement-component', component: ClassementComponent},
  {path: 'match-component', component: MatchComponent},
  {path: 'pari-component', component: PariComponent},
  {path: '', redirectTo: 'match-component'}
];

@NgModule({
  declarations: [
    ContactComponent,
    ReglesComponent,
    ClassementComponent,
    ReglesComponent,
    MatchComponent,
    PariComponent
  ],
  imports: [RouterModule.forChild(routes), MatTableModule, SharedModule, MatPaginatorModule],
  exports: [RouterModule],
})
export class PagesModule {}
