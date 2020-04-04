import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-policy-data-sync',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss']
})
export class SwapComponent implements OnInit {

  constructor(public router:Router,public activeRoute:ActivatedRoute) { }

  ngOnInit(): void {
    localStorage.clear();
    let policyno = this.activeRoute.snapshot.queryParams.policyno;
    console.log(policyno);
    console.log("decoded", decodeURIComponent(policyno));
    
    this.router.navigateByUrl('/renewal-policy');
  }

}
