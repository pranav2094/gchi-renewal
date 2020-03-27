import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyDataSyncComponent } from './policy-data-sync.component';

describe('PolicyDataSyncComponent', () => {
  let component: PolicyDataSyncComponent;
  let fixture: ComponentFixture<PolicyDataSyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyDataSyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyDataSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
