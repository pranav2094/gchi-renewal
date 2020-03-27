import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-policy-data-sync',
  templateUrl: './policy-data-sync.component.html',
  styleUrls: ['./policy-data-sync.component.scss']
})
export class PolicyDataSyncComponent implements OnInit {

  constructor(public router:Router) { }

  ngOnInit(): void {
    this.router.navigateByUrl('/renewal-policy');
  }

}
