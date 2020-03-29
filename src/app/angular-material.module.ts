import { NgModule } from '@angular/core';
import { 
   MatDatepickerModule, 
   MatNativeDateModule,
   MatFormFieldModule,
   MatInputModule,
   MatDialogModule
} from '@angular/material';

@NgModule({
   imports: [
      MatDatepickerModule,
      MatNativeDateModule,
      MatFormFieldModule,
      MatInputModule,
      MatDialogModule
   ],
   exports: [
      MatDatepickerModule,
      MatNativeDateModule,
      MatFormFieldModule,
      MatInputModule,
      MatDialogModule
   ]
})

export class AngularMaterialModule { }