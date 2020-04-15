import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CommonMethodsService } from 'src/app/services/common-methods.service';
import {CommonServicesService} from 'src/app/services/common-services.service'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import * as _ from 'underscore';
import { Router } from '@angular/router';
import { DiseaseModalComponent } from '../disease-modal/disease-modal.component';
import { FormGroup,Validators, FormBuilder,FormArray } from '@angular/forms';


declare var $: any;

@Component({
  selector: 'app-renewal-policy',
  templateUrl: './renewal-policy.component.html',
  styleUrls: ['./renewal-policy.component.scss']
})
export class RenewalPolicyComponent implements OnInit {
  memmaxDOBHB: any; meminDOBHB: any; 
  childmaxDOB: any; childminDOB: any;
  snackbarMessage:any;
  dateofBirth:any;
  showRenewal:boolean=false;
  insureDetails:any;
  questionList:any;clear
  isPED:boolean=false;
  spinnerTxt:any;
  adultRelationShip = []; adultRelationArray = []; childRelationShip = []; childRelationArray = []; NomineeRelationship = [];
  applicantForm: FormGroup;
  planDetailsForm: FormGroup;
  submitted:boolean= false;
  pinData:any;
  stateCode:any;cityCode:any;
  isWhatsappConsent:boolean=false;
  isPolicyKit:boolean=false;
  isAutoRenewal:boolean=false;
  angForm: FormGroup;
  customerList: FormArray;
  memberType = [{type: 'adult', enabled:true}, {type:'child', enabled:true}];
  modify: boolean = false;
  defaultData = {};
  dateOfBirthArray = [];
  dobArray = [];
  customerDetails: any;
  showAddInsured: boolean= true;
  tempFormValues= [];
  adultCount:any;
  childCount:any;
  highestAge:any;
  policyDetails:any;
  isValidFormSubmitted = null;
  tenureArray:any=['1','2','3','4','5'];
  sumInsuredArray:any=['500000','700000','1000000','1500000','2000000'];
  titleIDArray:any=["Mr","Mrs","Ms"];
  tenure:any="1";
  sumInsured:any="500000";
  plan:any;
  stateArray:any=[];
  state:any;
  
  constructor(public matDialog: MatDialog,private router: Router, public cm:CommonMethodsService,public cs:CommonServicesService, private fb: FormBuilder) {
    this.policyDetails = JSON.parse(localStorage.getItem('policyDetails'));
    this.getPolicyDetails(this.policyDetails.policyNumber); 
   }

  ngOnInit(): void {
    var today = new Date();
    this.getDiseaseList();
    this.getRelation();
    this.getAllState()

    this.angForm = this.fb.group({
      Members: this.fb.array([])
    });
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

    this.planDetailsForm = this.fb.group({
      planName:[Validators.required],
      numberOfAdult:[Validators.required],
      numberOfChild:[Validators.required],
      ageEldestMember:[Validators.required],
      tenure:[],
      sumInsured:[],
      state:[]
    })
    
    this.memmaxDOBHB = new Date(today.setFullYear(new Date().getFullYear() - 21));
    this.meminDOBHB = new Date(today.setFullYear(new Date().getFullYear() - 75));
    this.memmaxDOBHB = moment(this.memmaxDOBHB).format('YYYY-MM-DD');
    this.meminDOBHB = moment(this.meminDOBHB).format('YYYY-MM-DD');
    this.childmaxDOB = new Date(new Date().setMonth(new Date().getMonth() - 6));
    this.childminDOB = new Date(new Date().setFullYear(new Date().getFullYear() - 21));
    this.childmaxDOB = moment(this.childmaxDOB).format('YYYY-MM-DD');
    this.childminDOB = moment(this.childminDOB).format('YYYY-MM-DD');
  }

  fillForm(data){
    this.customerList = this.angForm.get('Members') as FormArray;
    this.customerList.clear();
    if (data) {
      data.forEach(details => {
        console.log(details);
        this.customerList.push(this.createMembers(details));
      });
    } else {
      this.customerList.push(this.createMembers(this.defaultData));
    }
    this.adultChildCount();
  
  }
  createMembers(data) {
    const membertype = data["membertype"];
    const relationship = data["relationship"] || '';
    const insuredname = data["insuredname"] || '';
    const insureddob = data["insureddob"] || '';
    const ped = data["ped"] || 'no';
    const title = data['title']||''
    let form = this.fb.group({
      title:[title,Validators.required],
      insuredname: [ insuredname, Validators.required],
      relationship: [relationship, Validators.required],
      insureddob: [insureddob, Validators.required],
      membertype: [membertype],
      ped: [ped]
    });
    return form;
  }
  get Members(): FormArray {
    return this.angForm.get('Members') as FormArray;
  }
  get fval() {
    return this.angForm.controls;
  }
  getDateOfBirth(ev:any) {
    console.log(ev.value);
    this.dateofBirth = moment(ev.value).format('YYYY-MM-DD');
  }
  getDobData(data){
    let dob;
    for(let i=0; i<data.length; i++){
      dob = moment(data[i]['insureddob']).format('YYYY-MM-DD');
      this.dobArray[i] = { DateOfBirth: dob};
    }
    this.getDobArray(this.dobArray);
  }
  getInsuredDateOfBirth(ev:any, i) {
    let data = this.getFormValues();
    this.getDobData(data);
    // this.dobArray[i] = { DateOfBirth: dob };
    console.log(this.dobArray);
    console.log(this.dateOfBirthArray);
  }
  getDobArray(dobArray){
    let dob;
    this.dateOfBirthArray = [];
    dobArray.forEach((d, i)=> {
      dob = moment(d["DateOfBirth"]).format('YYYY-MM-DD');
      var ageDifMs = Date.now() - new Date(dob).getTime();
      var ageDate = new Date(ageDifMs); // miliseconds from epoch
      Math.abs(ageDate.getUTCFullYear() - 1970);
      this.dateOfBirthArray.push({ index: i, date: dob, age: Math.abs(ageDate.getUTCFullYear() - 1970) });
    });
  }
  get aaplicantFormControl() {
    return this.applicantForm.controls;
  }
  renewalType(val:any) {
    this.modify = val.target.value == "modify" ? true: false;
    if(!this.modify){
      this.fillForm(this.customerDetails);
    }
  }
  checkDateOfBirth() {
    
    let date_of_birth = moment(new Date(this.policyDetails.CustDob)).format('YYYY-MM-DD');
    if (this.cm.isUndefineORNull(this.dateofBirth)) {
      $('#doberror').html("Please enter date of birth");
      return false;
    } else {
      $('#doberror').html('');
      let same = new Date(date_of_birth).getTime() === new Date(this.dateofBirth).getTime();
      if (same) {
        this.showRenewal=true;
        this.fillForm(this.insureDetails);
        this.tempFormValues = this.getFormValues();
        console.log("Highest age is ", this.getHighestAge());
      } else {
        this.showRenewal=false;
        Swal.fire('Oops...', "Birth Date is Mismatch!!!", 'error');
        return false;
      }
    }
  }
  getHighestAge(){
    this.getDobData(this.getFormValues());
    let data = this.dateOfBirthArray;
    this.highestAge = 0;
    let tmp;
    for (let i = data.length - 1; i >= 0; i--) {
      tmp = data[i].age;
      if (tmp > this.highestAge)
      this.highestAge = tmp; 
    }
    return this.highestAge;
  }
  removeInsured(index){
    this.Members.value.forEach((element, i) => {
      if ( i == index) {
        this.Members.removeAt(index);
        this.dobArray.splice(index, 1);
        this.dateOfBirthArray.splice(index, 1);
      }
    });
    this.checkForm();
    console.log("Higest age is", this.highestAge);
    console.log("Adult child count is", this.adultChildCount());
  }
  addInsured(){
    let adultChildCount = this.adultChildCount();
    // let defaultData = adultChildCount['adultCount'] >= 2 ? 'child' : adultChildCount['childCount'] >= 3 ? 'adult' : 'child' ;
    let defaultData = adultChildCount['childCount'] >= 3 ? 'adult' : adultChildCount['adultCount'] >= 2? 'child' : 'adult' ;
    //  adultChildCount['childCount'] > 3 ? 'adult': 'child';   
    this.defaultData = {membertype: defaultData};
    (this.angForm.controls['Members'] as FormArray).push(this.createMembers(this.defaultData));
    this.checkForm();
    console.log("Higest age is", this.highestAge);
    console.log("Adult child count is", this.adultChildCount());
  }
  getFormValues(){
    return this.angForm.controls.Members.value;
  }
  adultChildCount() {  
    this.adultCount = 0;
    this.childCount = 0;
    this.getFormValues().forEach(element => {
      element.membertype == 'adult' ? (this.adultCount += 1 ) : (this.childCount += 1);
    }); 
    return {adultCount: this.adultCount, childCount: this.childCount};
  }
  calculateQuote(){
    let membersAray=[];
    this.isValidFormSubmitted = false;
    if (this.angForm.invalid) {
      return;
    }
    this.checkForm();
    this.isValidFormSubmitted = true;
    console.log("Plan detaila form",this.planDetailsForm.value);
    localStorage.setItem('insuredDetails', JSON.stringify(this.getFormValues()));

    this.insureDetails = JSON.parse(localStorage.getItem('insuredDetails'));
    console.log("InsuredDetails",this.insureDetails);
    
    this.insureDetails.forEach(function(element) {   
      console.log(element);
      
      let obj ={
        MemberType:element.membertype,
        TitleID:element.title ,
        Name: element.insuredname,
        RelationshipID: element.relationship,
        RelationshipName: element.relationship,
        DOB:moment(element.insureddob).format('DD-mm-YYYY'),
        Height: "0.0",
        Weight: "0",
        isExisting: "true",
        OtherDisease: "",
        Ailments: ""
    }
    console.log(obj);
    
      membersAray.push(obj);
    }.bind(this));
    // console.log(membersAray);

    
    // let requestBody={
    //   "UserType": "AGENT",
    //   "PolicyNo": this.policyDetails.policyNumber,
    //   "ipaddress": "ISECURITY-GCHI",
    //   "AddOnCovers1": "",
    //   "AddOnCovers1Flag": "true",
    //   "AddOnCovers2And4": "",
    //   "AddOnCovers2And4Flag": "",
    //   "AddOnCovers2And4Type": "",
    //   "AddOnCovers3": "",
    //   "AddOnCovers3Flag": "false",
    //   "AddOnCovers3Type": "",
    //   "AddOnCovers5": "",
    //   "AddOnCovers5Flag": "",
    //   "AddOnCovers6": "Adult 1",
    //   "AddOnCovers6Flag": "true",
    //   "VoluntaryDeductible": "0",
    //   "AgeOfEldest": "26-35",
    //   "NoOfAdults": this.planDetailsForm.value.numberOfAdult,
    //   "NoOfKids": this.planDetailsForm.value.numberOfChild,
    //   "NomineeDOB": "12-Jun-1985",
    //   "NomineeName": "Fhrhhrrh",
    //   "NomineeRelationShip": "1040",
    //   "NomineeTitle": "0",
    //   "SubLimitApplicable": "NO SUBLIMIT",
    //   "SumInsured": this.planDetailsForm.value.sumInsured,
    //   "Members": {
    //       "Member": [
    //           {
                 
    //           }
    //       ]
    //   },
    //   "CustStateName": "KERALA",
    //   "CustStateId": "62",
    //   "isGSTRegistered": true,
    //   "SoftCopyDiscount": ""
    // }


    // this.cs.postAPICallWithAuthToken('api/health/HealthPolicyRenewalCalculate',requestBody).subscribe(response => {

    // });
  }


  msgFunction(msgData) {
    if (msgData.length>0) {
      msgData.forEach(element => {
        if(element['msg'] != '') {
          Swal.fire('Oops...', element['msg'], 'error');
          return false;
        }
      });
    }
  }
  checkData(){
    let selfCount = 0;
    let childCount = 0
    let adultCount = 0
    let selfChildCount = 0
    let data = this.getFormValues();
    let msg = [];
    let text;

  


    data.forEach((element, i) => {

      // if (this.adultRelationArray[i].RelationshipID ==element["relationship"]) {
      //   this.selectedCountry = this.countries[i];
      // }

      selfCount = element["relationship"]=='1014'? element["membertype"]=="adult" ? (selfCount += 1): (selfChildCount+=1): selfCount;
      childCount = element["membertype"]=="child" ? ( childCount += 1 ) : childCount;
      adultCount = element["membertype"]=="adult" ? ( adultCount += 1 ) : adultCount;
    });
    text = selfCount>1 ? "you can add only one self realation": selfCount == 0 ? "Please select atleast one self relation with adult member":'';
    msg.push({msg: text});
    childCount > 3 ? msg.push({msg:"You can add maximum 3 children"}) : msg.push({msg: ''});
    adultCount > 2 ? msg.push({msg:"You can add maximum 2 adults"}) : msg.push({msg: ''});
    selfChildCount > 0 ? msg.push({msg:"Please select self reltion with an adult"}) : msg.push({msg: ''});
    this.showAddInsured = data.length >= 5 ? false : true;
    this.msgFunction(msg);
  }
  
  checkthis(eve: any, i){
    console.log(this.tempFormValues);
    this.checkForm();
    // this.tempFormValues.forEach( e=> {
      if(this.tempFormValues[i]['membertype']!=eve.target.value){
        this.angForm.controls.Members.value[i]["membertype"] = this.tempFormValues[i]["membertype"];
        // this.CountryResponse.country = selectedCountry;
        (<FormGroup>this.angForm.controls.Members)
            .setValue(this.tempFormValues, {onlySelf: true});
      }
    console.log("option click works")
  }

  checkForm() {
    this.checkData();
  }
  getPolicyDetails(PolicyNo) {
    let policyData;
    let payload = {
      "UserType": "Agent",
      "PolicyNo": PolicyNo
    };
    this.insureDetails=[{"title":"1","insuredname":"test1","relationship":"1014","insureddob":"1976-06-07T18:30:00.000Z","insureddiseas":"no","insuredgender":"Male","membertype":"adult", "ped": "yes"}
    ,{"title":"2","insuredname":"test1","relationship":"1045","insureddob":"1978-06-13T18:30:00.000Z","insureddiseas":"no","insuredgender":"Female","membertype":"adult", "ped": "no"}
    ,{"title":"1","insuredname":"test1233","relationship":"1072","insureddob":"2006-10-10T18:30:00.000Z","insureddiseas":"no","insuredgender":"Male","membertype":"child", "ped": "yes"}
    ,{"title":"3","insuredname":"test15434","relationship":"1123","insureddob":"2018-10-11T18:30:00.000Z","insureddiseas":"no","insuredgender":"Female","membertype":"child", "ped": "no"}]

    this.plan="Health Plan";
    this.state ="27";
    localStorage.setItem('insuredDetails', JSON.stringify(this.insureDetails));
    this.customerDetails = JSON.parse(localStorage.getItem('insuredDetails'));

    


    // let payLoadStr = JSON.stringify(payload);
    // this.cs.postAPICallWithAuthToken('api/renewal/HealthPolicyRenewalRN', payLoadStr).subscribe((res) => {
    // if(res.StatusCode ==1)
    // {
    //   this.cm.showSpinner(false);
    //   policyData = res;
    //   console.log(policyData);
     
    // }
    // else{
    //   Swal.fire('Oops...', "Something went wrong !!!", 'error');
    //   return false;

    // }
    // });

   
  }
  changeSI(val:any)
  {
    console.log(val);
    
  }
  changeTenure(val:any){
    console.log(val);
    
  }
  getAllState()
  {
    this.stateArray=[];
    this.cs.postWithParams('api/MotorMaster/GetAllStates','').subscribe(res => {
      this.stateArray = res;   
      console.log(this.stateArray);
      
    }, err => {
      console.log(err);
    });

  }
  getDiseaseList() {
    this.cs.getWithParams('api/healthmaster/GetHealthAilmentList?isAgent=YES').subscribe(res => {
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
