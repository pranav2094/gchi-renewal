import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import {CommonMethodsService} from 'src/app/common-methods.service' 


@Component({
  selector: 'app-disease-modal',
  templateUrl: './disease-modal.component.html',
  styleUrls: ['./disease-modal.component.scss']
})
export class DiseaseModalComponent implements OnInit {

  diseaseForm: FormGroup;
  diseasesList;
  constructor(public dialogRef: MatDialogRef<DiseaseModalComponent>, public cm:CommonMethodsService,public fb: FormBuilder) { 
    this.diseaseForm = this.fb.group({
      checkArray: this.fb.array([], [Validators.required])
    })
  }

  ngOnInit() {
      this.diseasesList = this.dialogRef._containerInstance._config.data;
      console.log(this.diseasesList);
  }
  close() {
    this.dialogRef.close();
  }
  saveDisease() {
    console.log("MODAL==", this.diseaseForm.value);
    if (this.diseaseForm.value != undefined) {
      this.cm.selctedDiseaseList = this.diseaseForm.value;
      this.dialogRef.close();
    }
  }

  onCheckboxChange(e) {
    const checkArray: FormArray = this.diseaseForm.get('checkArray') as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  

}
