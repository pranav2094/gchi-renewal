import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CommonMethodsService } from 'src/app/services/common-methods.service';
import { CommonServicesService } from 'src/app/services/common-services.service'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import * as _ from 'underscore';
import { Router } from '@angular/router';
import { DiseaseModalComponent } from '../disease-modal/disease-modal.component';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';



declare var $: any;

@Component({
  selector: 'app-renewal-policy',
  templateUrl: './renewal-policy.component.html',
  styleUrls: ['./renewal-policy.component.scss']
})
export class RenewalPolicyComponent implements OnInit {
  memmaxDOBHB: any; meminDOBHB: any;
  childmaxDOB: any; childminDOB: any;
  snackbarMessage: any;
  dateofBirth: any;
  showRenewal: boolean = false;
  insureDetails: any;
  applicantDetails: any;
  questionList: any; clear
  isPED: boolean = false;
  spinnerTxt: any;
  adultRelationShip = []; adultRelationArray = []; childRelationShip = []; childRelationArray = []; NomineeRelationship = [];
  applicantForm: FormGroup;
  planDetailsForm: FormGroup;
  submitted: boolean = false;
  pinData: any;
  stateCode: any; cityCode: any;
  isWhatsappConsent: boolean = false;
  isPolicyKit: boolean = false;
  isAutoRenewal: boolean = false;
  angForm: FormGroup;
  customerList: FormArray;
  memberType = [{ type: 'Adult', enabled: true , value :'Adult'}, { type: 'Kid', enabled: true, value:'Child'}];
  modify: boolean = false;
  defaultData = {};
  dateOfBirthArray = [];
  dobArray = [];
  customerDetails: any;
  showAddInsured: boolean = true;
  tempFormValues = [];
  adultCount: any;
  childCount: any;
  highestAge: any;
  policyDetails: any;
  isValidFormSubmitted = null;
  tenureArray: any = ['1', '2', '3', '4', '5'];
  sumInsuredArray: any =[];
  titleIDArray: any = ["Mr", "Mrs", "Ms"];
  tenure: any = "1";
  sumInsured: any = "500000";
  plan: any;
  stateArray: any = [];
  state: any;
  policyPremium:any;
  nomineeDetaiils:any;
  appointeeDetails:any;
  pedData = [];
  isInsuredChange:boolean=false;
  isRenewalEdited:boolean=false;
  proposalResponse:any;

  constructor(public matDialog: MatDialog, private router: Router, public cm: CommonMethodsService, public cs: CommonServicesService, private fb: FormBuilder) {
    this.policyDetails = JSON.parse(localStorage.getItem('policyDetails'));

  }

  ngOnInit(): void {
    var today = new Date();
    this.getDiseaseList();
    this.getRelation();
    this.getAllState();

    this.angForm = this.fb.group({
      Members: this.fb.array([])
    });


    this.planDetailsForm = this.fb.group({
      planName: [Validators.required],
      numberOfAdult: [Validators.required],
      numberOfChild: [Validators.required],
      ageEldestMember: [Validators.required],
      tenure: [],
      sumInsured: [],
      state: []
    })

    this.memmaxDOBHB = new Date(today.setFullYear(new Date().getFullYear() - 21));
    this.meminDOBHB = new Date(today.setFullYear(new Date().getFullYear() - 75));
    this.memmaxDOBHB = moment(this.memmaxDOBHB).format('YYYY-MM-DD');
    this.meminDOBHB = moment(this.meminDOBHB).format('YYYY-MM-DD');
    this.childmaxDOB = new Date(new Date().setMonth(new Date().getMonth() - 6));
    this.childminDOB = new Date(new Date().setFullYear(new Date().getFullYear() - 21));
    this.childmaxDOB = moment(this.childmaxDOB).format('YYYY-MM-DD');
    this.childminDOB = moment(this.childminDOB).format('YYYY-MM-DD');
    localStorage.modify = this.modify;
    this.applicantDetails = JSON.parse(localStorage.getItem("applicantDetails")) || '';
    this.fillApplicantForm(this.applicantDetails);
    const applicantAccountName = this.applicantForm.get('applicantAccountName');
    const applicantAccountNo = this.applicantForm.get('applicantAccountNo');
    const applicantIFSCCode = this.applicantForm.get('applicantIFSCCode');
    this.applicantForm.get('applicantAutoRenewal').valueChanges.subscribe(
      (valid: boolean) => {
        this.isAutoRenewal = valid;
        console.log(this.isAutoRenewal);
        
        if (valid) {
          applicantAccountName.setValidators([Validators.required]);
          applicantAccountNo.setValidators([Validators.required, Validators.pattern(/^\d{9,18}$/)]);
          applicantIFSCCode.setValidators([Validators.required]);
        }
        else {
          applicantAccountName.clearValidators();
          applicantAccountNo.clearValidators();
          applicantIFSCCode.clearValidators();
        }
        applicantAccountName.updateValueAndValidity();
        applicantAccountNo.updateValueAndValidity();
        applicantIFSCCode.updateValueAndValidity();
      });

  }

  fillForm(data) {
    this.customerList = this.angForm.get('Members') as FormArray;
    this.customerList.clear();
    if (data) {
      data.forEach(details => {
        this.customerList.push(this.createMembers(details));
      });
    } else {
      this.customerList.push(this.createMembers(this.defaultData));
    }
    this.adultChildCount();
 
  }
  fillApplicantForm(applicantDetails)
  {
    const applicantName = applicantDetails.applicantName || '';
    const mobileNumber = applicantDetails.mobileNumber  || '';
    const emailid = applicantDetails.emailid  || '';
    const applicantAadhar = applicantDetails.applicantAadhar || '';
    const applicantPan = applicantDetails.applicantPan  || '';
    const applicantAddress1 = applicantDetails.applicantAddress1  || '';
    const applicantAddress2 = applicantDetails.applicantAddress2  || '';
    const applicantPinCode = applicantDetails.applicantPinCode  || '';
    const applicantState = applicantDetails.applicantState  || '';
    const applicantCity = applicantDetails.applicantCity  || '';
    

    this.applicantForm = this.fb.group({
      applicantName: [applicantName , Validators.required],
      // applicantAadhar: ['', [Validators.required,Validators.pattern(/^\d{4}\d{4}\d{4}$/)]],
      // applicantPan: ['', [Validators.required,Validators.pattern(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/)]],
      mobileNumber: [mobileNumber, [Validators.required]],
      emailid: [emailid , [Validators.required]],
      applicantAadhar: [applicantAadhar ],
      applicantPan: [applicantPan],
      applicantAddress1: [applicantAddress1, [Validators.required]],
      applicantAddress2: [applicantAddress2, [Validators.required]],
      applicantPinCode: [applicantPinCode, [Validators.required]],
      applicantState: [applicantState, [Validators.required]],
      applicantCity: [applicantCity, [Validators.required]],
      applicantWhatsappConsent: [''],
      applicantPolicyKit: [''],
      applicantAutoRenewal: [''],
      applicantAccountName: [''],
      applicantAccountNo: [''],
      applicantIFSCCode: ['']
    });
    const applicantAccountName = this.applicantForm.get('applicantAccountName');
    const applicantAccountNo = this.applicantForm.get('applicantAccountNo');
    const applicantIFSCCode = this.applicantForm.get('applicantIFSCCode');
    this.applicantForm.get('applicantAutoRenewal').valueChanges.subscribe(
      (valid: boolean) => {
        this.isAutoRenewal = valid;
        if (valid) {
          applicantAccountName.setValidators([Validators.required]);
          applicantAccountNo.setValidators([Validators.required, Validators.pattern(/^\d{9,18}$/)]);
          applicantIFSCCode.setValidators([Validators.required]);
        }
        else {
          applicantAccountName.clearValidators();
          applicantAccountNo.clearValidators();
          applicantIFSCCode.clearValidators();
        }
        applicantAccountName.updateValueAndValidity();
        applicantAccountNo.updateValueAndValidity();
        applicantIFSCCode.updateValueAndValidity();
      });
  }

  createMembers(data) {
    const membertype = data["membertype"];
    const relationship = data["relationship"] || '';
    const insuredname = data["FullName"] || '';
    const insureddob = data["DateofBirth"] || '';
    const ped = data["PreExistingDisease"] || 'None';
    const title = data['Title'] || ''
    let form = this.fb.group({
      title: [title, Validators.required],
      insuredname: [insuredname, Validators.required],
      relationship: [relationship, Validators.required],
      insureddob: [new Date(insureddob), Validators.required],
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
  getDateOfBirth(ev: any) {
    console.log(ev.value);
    this.dateofBirth = moment(ev.value).format('YYYY-MM-DD');
  }
  getDobData(data) {
    let dob;
    for (let i = 0; i < data.length; i++) {
      dob = moment(data[i]['insureddob']).format('YYYY-MM-DD');
      this.dobArray[i] = { DateOfBirth: dob };
    }
    this.getDobArray(this.dobArray);
  }
  getInsuredDateOfBirth(ev: any, i) {
    let data = this.getFormValues();
    this.getDobData(data);
    this.getHighestAge();

  }
  getDobArray(dobArray) {
    let dob;
    this.dateOfBirthArray = [];
    dobArray.forEach((d, i) => {
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
  renewalType(val: any) {
    this.modify = val.target.value == "modify" ? true : false;
    console.log(this.modify);
    localStorage.modify = this.modify;
    console.log(this.customerDetails);

    if (!this.modify) {
      this.fillForm(this.customerDetails);
    }
  }
  checkDateOfBirth(target) {

    let date_of_birth = moment(new Date(this.policyDetails.CustDob)).format('YYYY-MM-DD');
    console.log(date_of_birth);

    if (this.cm.isUndefineORNull(this.dateofBirth)) {
      $('#doberror').html("Please enter date of birth");
      return false;
    } else {
      $('#doberror').html('');
      let same = new Date(date_of_birth).getTime() === new Date(this.dateofBirth).getTime();
      if (same) {
        this.showRenewal = true;
        this.RNFetch(this.policyDetails.PolicyNumber);
        this.scroll(target);
       
      } else {
        this.showRenewal = false;
        $('#doberror').html("Birth Date is mismatch");
        return false;
      }
    }
  }
  getHighestAge() {
    this.getDobData(this.getFormValues());
    let data = this.dateOfBirthArray;
    this.highestAge = 0;
    let tmp;
    console.log(data);

    for (let i = data.length - 1; i >= 0; i--) {
      tmp = data[i].age;
      if (tmp > this.highestAge)
        this.highestAge = tmp;
    }
    console.log(this.highestAge);

    return this.highestAge;
  }
  removeInsured(index) {
    this.Members.value.forEach((element, i) => {
      if (i == index) {
        this.Members.removeAt(index);
        this.dobArray.splice(index, 1);
        this.dateOfBirthArray.splice(index, 1);
      }
    });
    this.checkForm();
    console.log("Higest age is", this.highestAge);
    console.log("Adult Kid count is", this.adultChildCount());
  }
  addInsured() {
    let adultChildCount = this.adultChildCount();
    // let defaultData = adultChildCount['adultCount'] >= 2 ? 'Kid' : adultChildCount['childCount'] >= 3 ? 'Adult' : 'Kid' ;
    let defaultData = adultChildCount['childCount'] >= 3 ? 'Adult' : adultChildCount['adultCount'] >= 2 ? 'Kid' : 'Adult';
    //  adultChildCount['childCount'] > 3 ? 'Adult': 'Kid';   
    this.defaultData = { membertype: defaultData };
    console.log(this.defaultData);
    
    (this.angForm.controls['Members'] as FormArray).push(this.createMembers(this.defaultData));
    this.checkForm();
  
    console.log("Higest age is", this.highestAge);
    console.log("Adult Kid count is", this.adultChildCount());
  }
  getFormValues() {
    return this.angForm.controls.Members.value;
  }
  adultChildCount() {
    this.adultCount = 0;
    this.childCount = 0;
    this.getFormValues().forEach(element => {
      element.membertype == 'Adult' ? (this.adultCount += 1) : (this.childCount += 1);
    });
    return { adultCount: this.adultCount, childCount: this.childCount };
  }

  calculateQuote() {
    let membersAray = [];
    this.isValidFormSubmitted = false;
    
    if (this.angForm.invalid) {
      return;
    }
    this.checkForm();
    this.isValidFormSubmitted = true;
    
    this.insureDetails = JSON.parse(localStorage.getItem('insuredDetails'));

    this.Members.value.forEach((element, i) => {
      console.log(element);
      
      this.insureDetails[i].PreExistingDisease = element.ped;
      this.insureDetails[i].FullName = element.insuredname;
      this.insureDetails[i].DateofBirth = moment(element.insureddob).format('DD-mm-YYYY');
      this.insureDetails[i].KidAdultType = element.membertype;
      this.insureDetails[i].Title = element.title;
      this.insureDetails[i].relationship = element.relationship;
    });
    console.log("MOdified",this.insureDetails);
    
    this.insureDetails.forEach(function (element) {
      let obj = {
        MemberType: element.membertype,
        TitleID: element.title,
        Name: element.insuredname,
        RelationshipID: element.relationship,
        RelationshipName: element.relationship,
        DOB: moment(element.insureddob).format('DD-mm-YYYY'),
        Height: "0.0",
        Weight: "0",
        isExisting: "true",
        OtherDisease: "",
        Ailments: ""
      }
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
    if (msgData.length > 0) {
      msgData.forEach(element => {
        if (element['msg'] != '') {
          //.fire('Oops...', element['msg'], 'error');

          this.snackbarMessage=element['msg'];
          this.cm.getSnackbarMessage(this.snackbarMessage);
          return false;
        }
      });
    }
  }
  scroll(el:HTMLElement){
    setTimeout(() => {
      el.scrollIntoView({behavior:"smooth"});
    },500);
  }
  checkData() {
    let selfCount = 0;
    let childCount = 0
    let adultCount = 0
    let selfChildCount = 0
    let data = this.getFormValues();
    let msg = [];
    let text;
    let rel_data = []
    let isured_Data = JSON.parse(localStorage.getItem("insuredDetails"));
    data.forEach((element, i) => {

      rel_data.push(this.checkRelation(element, i));
      console.log(rel_data);
      
      selfCount = element["relationship"] == 'SELF' ? element["membertype"] == "Adult" ? (selfCount += 1) : (selfChildCount += 1) : selfCount;
      childCount = element["membertype"] == "Kid" ? (childCount += 1) : childCount;
      adultCount = element["membertype"] == "Adult" ? (adultCount += 1) : adultCount;
    });
    text = selfCount > 1 ? "you can add only one self realation" : selfCount == 0 ? "Please select atleast one self relation with Adult member" : '';
    msg.push({ msg: text });
    childCount > 3 ? msg.push({ msg: "You can add maximum 3 children" }) : msg.push({ msg: '' });
    adultCount > 2 ? msg.push({ msg: "You can add maximum 2 adults" }) : msg.push({ msg: '' });
    selfChildCount > 0 ? msg.push({ msg: "Please select self reltion with an Adult" }) : msg.push({ msg: '' });
    this.showAddInsured = data.length >= 5 ? false : true;
    this.msgFunction(msg);
  }
  checkRelation(elem, i){
    let data;
    this.adultRelationArray.forEach(e =>{
      if(elem["relationship"]==e["RelationshipName"]){
        data = {relation_name:e["RelationshipName"], relation_id:e["RelationshipID"]}
      }
    });
    return data;
  }

  checkthis(eve: any, i) {
    this.checkForm();
    this.tempFormValues = this.getFormValues();
    // this.tempFormValues.forEach( e=> {
    if (this.tempFormValues[i]['membertype'] != eve.target.value) {
      this.angForm.controls.Members.value[i]["membertype"] = this.tempFormValues[i]["membertype"];
      (<FormGroup>this.angForm.controls.Members)
        .setValue(this.tempFormValues, { onlySelf: true});
    }
    console.log("option click works")
  }

  checkForm() {
    this.checkData();
  }
  RNFetch(PolicyNo: any) {
    let membersAray = [];
    let policyData;
    let payload = {
      "UserType": "CUSTOMER",
      "PolicyNo": PolicyNo,
      "IsGchiRenewal": true
    };
    let payLoadStr = JSON.stringify(payload);

    // this.spinnerTxt = "Please wait... We are fetching policy details."
    // this.cm.showSpinner(true,this.spinnerTxt);
   
    // this.cs.postAPICallWithAuthToken('api/renewal/HealthPolicyRenewalRN', payLoadStr).subscribe((res) => {
    // this.cm.showSpinner(false);
    fetch("assets/js/response.json", { method: "GET" })
    .then(data => data.json())
    .then(res => {
      console.log(res);
      
      if(res.StatusCode ==1)
      {
        for (var i=0;i<res.HealthList.length;i++)
        {
        
          policyData = res.HealthList[i];
          let emailid =  policyData.Email.toLowerCase();
          console.log(emailid);
          this.applicantDetails ={ "applicantName": policyData.NameOfApplicant, "mobileNumber": policyData.Mobile, "emailid": emailid, "applicantAadhar": policyData.AadhaarNumber, "applicantPan": policyData.PANNumber, "applicantAddress1": policyData.AddressLine1, "applicantAddress2": policyData.AddressLine2, "applicantPinCode":policyData.Pincode, "applicantCity": policyData.CityName, "applicantState":policyData.StateName}
          policyData.InsuredDetails.forEach(element => {
            let obj = {
              membertype: element.KidAdultType,
              Title: element.Title,
              FullName: element.FullName,
              RelationshipID: element.RelationShipID,
              relationship: element.RelationwithApplicant,
              DateofBirth: element.DateofBirth,
              PreExistingDisease: element.PreExistingDisease,
              Height: element.Height,
              HeightInInches: element.HeightInInches,
              HeightInFeet: element.HeightInFeet,
              Weight: element.Weight,
              Addon1: element.Addon1,
              Addon2: element.Addon2,
              Addon3: element.Addon3,
              Addon4: element.Addon4,
              Addon5: element.Addon5,
              Addon6: element.Addon6,
            }
            membersAray.push(obj);  
          });
          this.insureDetails=membersAray;
          this.plan = policyData.PlanName;
          //this.state = policyData.StateID;
          this.state = 27;
          this.tenure = policyData.TenureYrs;
          this.sumInsured = policyData.SumInsured;
          this.sumInsuredArray = policyData.hospitalSIList;
       
          this.fillForm(this.insureDetails);
          this.fillApplicantForm(this.applicantDetails);
 
          
          this.customerDetails = this.insureDetails;
          this.getHighestAge();
          this.sumInsuredArray = policyData.hospitalSIList;
          this.policyPremium = policyData.TotalPremium1Year;
         
          this.policyDetails.PolicyPremium = policyData.TotalPremium1Year;
          this.policyDetails.sumInsured = policyData.SumInsured;
          this.policyDetails.tenure = policyData.TenureYrs;
          this.policyDetails.adultCount = this.adultCount;
          this.policyDetails.childCount =this.childCount;
          this.policyDetails.AgeOfEldest = policyData.AgeOfEldest;

          this.applicantDetails.stateID = policyData.StateID;
          this.applicantDetails.cityID = policyData.CityID;
          let nomineeDetaiils ={
            'NomineeName': policyData.NomineeName,
            'NomineeTitle' : policyData.NomineeTitle,
            'NomineeRelationShip':policyData.NomineeRelationShip,
            'NomineeDOB':policyData.NomineeDOB,
          }
          let appointeeDetails ={
            'AppointeeName':policyData.AppointeeName,
            'AppointeeDOB':policyData.AppointeeDOB,
            'AppointeeTitle':policyData.AppointeeTitle,
            'AppointeeRelationship':policyData.AppointeeRelationship
          }
        localStorage.setItem('insuredDetails', JSON.stringify(this.insureDetails));
        localStorage.setItem('applicantDetails', JSON.stringify(this.applicantDetails));
        localStorage.setItem("nomineeDetaiils",JSON.stringify(nomineeDetaiils));
        localStorage.setItem("appointeeDetails",JSON.stringify(appointeeDetails));
        localStorage.setItem("policyDetails",JSON.stringify(this.policyDetails));
        

    

        }
       
      }
      else{
        // Swal.fire('', "Something went wrong !!!", 'error');
        // return false;
  
      }
    });



  }
  changeSI(val: any) {
    console.log(val);
  }
  changeTenure(val: any) {
    console.log(val);
  }
  getAllState() {
    this.stateArray = [];
    this.cs.postWithParams('api/MotorMaster/GetAllStates', '').subscribe(res => {
      this.stateArray = res;
    }, err => {
      console.log(err);
    });

  }
  getDiseaseList() {
    this.cs.getWithParams('api/healthmaster/GetHealthAilmentList?isAgent=YES').subscribe(res => {
      this.questionList = res.Details;
    }, err => {
      console.log(err);
    });
  }
  getRelation() {
    this.spinnerTxt = "Please wait... We are fetching data."
    this.cm.showSpinner(true, this.spinnerTxt);
    this.cs.postAPICallWithAuthToken('api/healthmaster/GetHealthProposalRelationships?Product=CHI', '').subscribe(res => {
      this.cm.showSpinner(false);
      this.adultRelationArray = [];
      this.childRelationArray = [];
      this.NomineeRelationship = [];
      let relation1 ={
          'RelationshipID': "1020",
          'RelationshipName': "SELF",
          'KidAdultType': "Adult"
      }

      res.InsuredRelationship.forEach((relation: any) => {
        if (relation.KidAdultType == 'Adult') {
          this.adultRelationArray.push(relation);
        } else {
          this.childRelationArray.push(relation);
          this.childRelationArray = this.childRelationArray.filter(function (x) { return x.RelationshipName !== "SELF" && x.RelationshipName !== "SPOUSE" && x.RelationshipName !== "EMPLOYEE"; });

        }
      });
      this.adultRelationArray.push(relation1);
      res.NomineeAppointeeRelationship.forEach((rel: any) => {
        this.NomineeRelationship.push(rel);
      });
      
      this.adultRelationArray = _.sortBy(this.adultRelationArray, 'RelationshipName');
      this.NomineeRelationship = _.sortBy(this.NomineeRelationship, 'RelationshipName');
      window.localStorage.nomineeRelationship = JSON.stringify(this.NomineeRelationship);
      this.childRelationArray = _.sortBy(this.childRelationArray, 'RelationshipName');
    }, err => {
      // console.log(err);
    });
  }
  getPincodeDetails(ev: any) {

    if (ev.target.value.length == 6) {
      this.spinnerTxt = "Please wait... We are fetching data."
      this.cm.showSpinner(true, this.spinnerTxt);
      let body = ev.target.value;
      this.cs.postAPICallWithAuthToken('api/rtolist/GetStatesCityByPin', body).subscribe((res) => {
        this.cm.showSpinner(false);
        this.pinData = res;
        console.log("pincode", this.pinData);
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
  checkAutoRenewal() {
    console.log("click");


  }
  showPED(ev: any, i) {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "500px";
    dialogConfig.width = "600px";
    dialogConfig.data = this.questionList;
    const modalDialog = this.matDialog.open(DiseaseModalComponent, dialogConfig);
    const sub = modalDialog.componentInstance.onAdd.subscribe((data) => {
      // do something
      console.log(data);
      if(data!='no')
      {
        this.pedData.push({ped_index:i, disease_list: data});
        console.log(this.pedData);
        let isured_Data = JSON.parse(localStorage.getItem("insuredDetails"));
        let data1 = this.getFormValues();
        this.pedData.forEach((element, i) => {
          // if(this.pedData[i]["ped_index"]==i){
          isured_Data[element["ped_index"]].pedData = element["disease_list"];
          console.log(isured_Data);
          localStorage.setItem("insuredDetails",JSON.stringify(isured_Data));
          // }
        });
        this.Members.at(i).patchValue({ 'insureddiseas': 'Yes'});

      }
      else{
        this.Members.at(i).patchValue({ 'insureddiseas': 'None'});
      }
     
    });
    modalDialog.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }
  saveProposal(){
    
    this.insureDetails = JSON.parse(localStorage.getItem('insuredDetails'));
    this.applicantDetails = JSON.parse(localStorage.getItem('applicantDetails'));
    this.policyDetails = JSON.parse(localStorage.getItem('policyDetails'));
    this.nomineeDetaiils = JSON.parse(localStorage.getItem('nomineeDetaiils'));
    this.appointeeDetails = JSON.parse(localStorage.getItem("appointeeDetails"));
    let membersAray=[];
    if(this.policyDetails.sumInsured != this.sumInsured )
    {
      this.isRenewalEdited=true;
    }
       
    this.insureDetails.forEach(function (element) {
      let obj = {
        MemberType: element.membertype,
        TitleID: element.Title,
        Name: element.FullName,
        RelationshipID: element.RelationshipID,
        RelationshipName: element.relationship,
        DOB: element.DateofBirth,
        Height: element.Height,
        Weight: element.Weight,
        isExisting: "true",
        OtherDisease: element.PreExistingDisease,
        Ailments: ""
      }
      membersAray.push(obj);
    });
    console.log(this.modify);
    
    console.log(membersAray);
    let ProppsalRequest={
      "IsCustomerPID": "true",
      "UserType": "Agent",
      "ipaddress": "ISECURITY-GCHI",
      "IPGPayment": "true",
      // "PolicyNo": this.policyDetails.PolicyNumber,
       "PolicyNo": '4015i/OBOP/51969580/00/000',
      "VoluntaryDeductible": "0",
      "AgeOfEldest": this.policyDetails.AgeOfEldest,
      "NoOfAdults": this.policyDetails.adultCount,
      "NoOfKids": this.policyDetails.childCount,
      "NomineeDOB": this.nomineeDetaiils.NomineeDOB,
      "NomineeName": this.nomineeDetaiils.NomineeName,
      "NomineeRelationShip": this.nomineeDetaiils.NomineeRelationShip,
      "NomineeRelationShipID": "",
      "NomineeTitle": this.nomineeDetaiils.NomineeTitle,
      "IS_IBANK_RELATIONSHIP": "NO",
      "APS_ID": "",
      "CUSTOMER_REF_NO": "",
      "SubLimitApplicable": "NO SUBLIMIT",
      "SumInsured": this.policyDetails.sumInsured,
      "Tenure": this.policyDetails.tenure,
      "PaymentMode": "RAZORPAY",
      "CardType": "",
      "ModeID": "0",
      "CardHolderName": "",
      "CardNumber": "",
      "CVVNumber": "",
      "CardExpiryMonth": "",
      "CardExpiryYear": "",
      "PANNumber": this.applicantDetails.applicantPan,
      "AadhaarNumber": this.applicantDetails.applicantAadhar,
      "AppointeeLastName": this.appointeeDetails.AppointeeName,
      "AppointeeTitleID": this.appointeeDetails.AppointeeTitle,
      "AppointeeRelationShipID": "",
      "AppointeeRelationShipName": this.appointeeDetails.AppointeeRelationship,
      "AppointeeDOB": this.appointeeDetails.AppointeeDOB,
      "AddressLine1": this.applicantDetails.applicantAddress1,
      "AddressLine2": this.applicantDetails.applicantAddress2,
      "Landmark": "",
      "CityID": this.applicantDetails.cityID,
      "StateID": this.applicantDetails.stateID,
      "PincodeID": this.applicantDetails.applicantPinCode,
      "EmailID": this.applicantDetails.emailid,
      "MobileNo": this.applicantDetails.mobileNumber,
      "AreaVillageID": "0",
      "isInsuredChange": this.modify,
      "isRenewalEdited": this.isRenewalEdited,
      "Members": this.insureDetails,
      "GSTApplicable": "false",
      "UINApplicable": "false",
      "isGHD": "Yes"
      }
      console.log(ProppsalRequest);
      this.spinnerTxt = "Please wait... We are saving proposal details."
      this.cm.showSpinner(true,this.spinnerTxt);
     
      this.cs.postAPICallWithAuthToken('api/Renewal/SaveProposalRNGCHI', ProppsalRequest).subscribe((res) => {
      this.cm.showSpinner(false);
      console.log(res);
      if(res.StatusCode ==1)
      {
          this.proposalResponse = res.FinalPolicy;
          localStorage.setItem("proposalResponse",JSON.stringify(this.proposalResponse));
          this.router.navigateByUrl('/payment');
          
      }else
      {
        Swal.fire("",res.StatusMessage,"error");
        return;
      }
  
      });

 

  }
  onSubmit() {
  
  this.submitted = true;
  if (!this.applicantForm.valid) {
    return;
  }
  else{
    this.saveProposal();
  }
  }

}
