import { Component, OnInit,Inject, EventEmitter } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import {CommonMethodsService} from 'src/app/services/common-methods.service' 


@Component({
  selector: 'app-disease-modal',
  templateUrl: './disease-modal.component.html',
  styleUrls: ['./disease-modal.component.scss']
})
export class DiseaseModalComponent implements OnInit {

  onAdd = new EventEmitter();
  diseaseForm: FormGroup;
  modify:boolean=false;
  diseasesList;
  constructor(public dialogRef: MatDialogRef<DiseaseModalComponent>, public cm:CommonMethodsService,public fb: FormBuilder) { 
    
    this.diseaseForm = this.fb.group({
      checkArray: this.fb.array([], [Validators.required])
    })
  }

  ngOnInit() {
      this.modify = localStorage.modify;
      console.log(this.modify);
      
      this.diseasesList = this.dialogRef._containerInstance._config.data;
      console.log(this.diseasesList);
  }
  close() {
    this.dialogRef.close();
  }
  saveDisease() {

    if (this.diseaseForm.value != undefined) {

      this.cm.selctedDiseaseList = this.diseaseForm.value;
      this.onAdd.emit(JSON.stringify(this.cm.selctedDiseaseList.checkArray));
      if(this.cm.selctedDiseaseList.checkArray.length==0)
      {
        alert("Please select Pre Existing Disease from list");     
      }
      else{
        this.dialogRef.close();
      }
    }
  }

  cancelPED()
  {
    this.onAdd.emit("no");
    this.dialogRef.close();
    
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
