import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CommonMethodsService } from 'src/app/services/common-methods.service';
import {CommonServicesService} from 'src/app/services/common-services.service'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import * as _ from 'underscore';
import { Router } from '@angular/router';
import { DiseaseModalComponent } from '../disease-modal/disease-modal.component';
import { FormGroup,Validators, FormBuilder } from '@angular/forms';


declare var $: any;

@Component({
  selector: 'app-renewal-policy',
  templateUrl: './renewal-policy.component.html',
  styleUrls: ['./renewal-policy.component.scss']
})
export class RenewalPolicyComponent implements OnInit {
  memmaxDOBHB: any; meminDOBHB: any; 
  snackbarMessage:any;
  dateofBirth:any;
  showRenewal:boolean=false;
  insureDetails:{};
  questionList:any;
  iSPED:boolean=false;
  spinnerTxt:any;
  adultRelationShip = []; adultRelationArray = []; childRelationShip = []; childRelationArray = []; NomineeRelationship = [];
  applicantForm: FormGroup;
  submitted:boolean= false;
  pinData:any;
  stateCode:any;cityCode:any;
  isWhatsappConsent:boolean=false;
  isPolicyKit:boolean=false;
  isAutoRenewal:boolean=false;
 
  constructor(public matDialog: MatDialog,private router: Router, public cm:CommonMethodsService,public cs:CommonServicesService, private fb: FormBuilder) { }

  ngOnInit(): void {
    var today = new Date();
    
    this.memmaxDOBHB = new Date(today.setFullYear(new Date().getFullYear() - 21));
    this.meminDOBHB = new Date(today.setFullYear(new Date().getFullYear() - 75));
    this.memmaxDOBHB = moment(this.memmaxDOBHB).format('YYYY-MM-DD');
    this.meminDOBHB = moment(this.meminDOBHB).format('YYYY-MM-DD');
    this.getDiseaseList();
    this.getRelation();
    this.applicantForm = this.fb.group({
      applicantName: ['', Validators.required],
      applicantAadhar: ['', [Validators.required,Validators.pattern(/^\d{4}\d{4}\d{4}$/)]],
      applicantPan: ['', [Validators.required,Validators.pattern(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/)]],
      applicantAddress1: ['',  [Validators.required]],
      applicantAddress2: ['', [Validators.required]],
      applicantPinCode: ['', [Validators.required]],
      applicantState: ['', [Validators.required]],
      applicantCity: ['', [Validators.required]],
      applicantWhatsappConsent:[''],
      applicantPolicyKit:[''],
      applicantAutoRenewal:[''],
      applicantAccountName:['',[Validators.required]],
      applicantAccountNo:['',[Validators.required,Validators.pattern(/^\d{9,18}$/)]],
      applicantIFSCCode:['',[Validators.required,Validators.pattern(/^[A-Za-z]{4}[a-zA-Z0-9]{7}$/)]]
    });
  }
  get aaplicantFormControl() {
    return this.applicantForm.controls;
  }
  getDateOfBirth(ev:any)
  {
    console.log(ev.value);
    this.dateofBirth= moment(ev.value).format('YYYY-MM-DD');   
  }
  renewalType(val:any)
  {
    console.log(val.target.value);
  }
  checkDateOfBirth()
  {
    console.log(this.dateofBirth);
    let date_of_birth=new Date("1999-03-28");
    if(this.cm.isUndefineORNull(this.dateofBirth))
    {
      $('#doberror').html("Please enter date of birth");
      return false;
    }
    else{  
      $('#doberror').html(''); 
      let same = date_of_birth.getTime() === new Date(this.dateofBirth).getTime();  
      if(same)
      {
        this.showRenewal=true;
        this.getInsuredDetails();
      }
      else{
        this.showRenewal=false;
        Swal.fire('Oops...', "Birth Date is Mismatch!!!", 'error');
        return false;
      }
    }  
  }
  getInsuredDetails()
  {
    this.insureDetails=[{"insuredname":"test1","relationship":"SELF","insureddob":"1976-06-07T18:30:00.000Z","insureddiseas":"no","insuredgender":"Male","memberType":"adult"}
    ,{"insuredname":"test1","relationship":"SPOUSE","insureddob":"1978-06-13T18:30:00.000Z","insureddiseas":"no","insuredgender":"Female","memberType":"adult"}
    ,{"insuredname":"test1233","relationship":"SON","insureddob":"2006-10-10T18:30:00.000Z","insureddiseas":"no","insuredgender":"Male","memberType":"child"}
    ,{"insuredname":"test15434","relationship":"DAUGHTER","insureddob":"2018-10-11T18:30:00.000Z","insureddiseas":"no","insuredgender":"Female","memberType":"child"}]
  }
  getDiseaseList() {
    console.log("ok");
    this.cs.getWithParams('/api/healthmaster/GetHealthAilmentList?isAgent=YES').subscribe(res => {
      console.log("JSON Ailment", res.Details);
      this.questionList = res.Details;
    }, err => {
      console.log(err);
    });
  }
  getRelation() {
    this.spinnerTxt = "Please wait... We are fetching data."
    this.cm.showSpinner(true,this.spinnerTxt);
    this.cs.postWithParams('/api/healthmaster/GetHealthProposalRelationships?Product=CHI', '').subscribe(res => {
      this.cm.showSpinner(false);
      this.adultRelationArray = [];
      this.childRelationArray = [];
      this.NomineeRelationship = [];

      res.InsuredRelationship.forEach((relation: any) => {
        if (relation.KidAdultType == 'Adult') {
          this.adultRelationArray.push(relation);
        } else {
          this.childRelationArray.push(relation);
          this.childRelationArray  = this.childRelationArray.filter(function (x) { return x.RelationshipName !== "SELF" && x.RelationshipName !== "SPOUSE" && x.RelationshipName !== "EMPLOYEE"; });
          
        }
      });
      res.NomineeAppointeeRelationship.forEach((rel: any) => {
        this.NomineeRelationship.push(rel);
      });

      this.adultRelationArray = _.sortBy(this.adultRelationArray, 'RelationshipName');
      this.NomineeRelationship = _.sortBy(this.NomineeRelationship, 'RelationshipName');
      window.localStorage.nomineeRelationship = JSON.stringify(this.NomineeRelationship);
      this.childRelationArray = _.sortBy(this.childRelationArray, 'RelationshipName');
      console.log("adult array", this.adultRelationArray);
      console.log("child array", this.childRelationArray);

    }, err => {
      // console.log(err);
    });
  }
  getPincodeDetails(ev: any) {

    if (ev.target.value.length == 6) {
      this.spinnerTxt = "Please wait... We are fetching data."
      this.cm.showSpinner(true,this.spinnerTxt);
      let body = ev.target.value;
      this.cs.postWithParams('/api/rtolist/GetStatesCityByPin', body).subscribe((res) => {
        this.cm.showSpinner(false);
        this.pinData = res;
        console.log("pincode",this.pinData);
        if (this.pinData.StatusCode == 1) {
          this.stateCode = this.pinData.StateId;
          this.cityCode = this.pinData.CityList[0].CityID;
          this.applicantForm.patchValue({ 'applicantCity': this.pinData.CityList[0].CityName });
          this.applicantForm.patchValue({ 'applicantState': this.pinData.StateName });
          let proposalStateCity = { pin: body, city: this.pinData.CityList[0].CityName, state: this.pinData.StateName };
          localStorage.setItem('CoresspondentStateCity', JSON.stringify(proposalStateCity));
        }
        else {
          this.stateCode = '';
          this.cityCode = '';
          this.applicantForm.patchValue({ 'applicantCity': null });
          this.applicantForm.patchValue({ 'applicantState': null });
          let proposalStateCity = { pin: body, city: null, state: null };
          localStorage.setItem('CoresspondentStateCity', JSON.stringify(proposalStateCity));
        }

      });
    }
  }
  showPED(ev:any)
  {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "500px";
    dialogConfig.width = "600px";
    dialogConfig.data = this.questionList;
    const modalDialog = this.matDialog.open(DiseaseModalComponent, dialogConfig);
    console.log(dialogConfig);
  }

  onSubmit() {
    console.log("submit");
    
    this.submitted = true;
    if (this.applicantForm.valid) {
      alert('Form Submitted succesfully!!!\n Check the values in browser console.');
      console.table(this.applicantForm.value);
      this.router.navigateByUrl('/payment');
      
    }
  }

}
