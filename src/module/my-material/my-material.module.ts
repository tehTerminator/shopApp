import { MatAutocompleteModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { NgModule } from '@angular/core';


@NgModule({
  declarations: [],
  imports: [
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class MyMaterialModule { }
