import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RazorPayConfirmationComponent } from './razor-pay-confirmation.component';

describe('RazorPayConfirmationComponent', () => {
  let component: RazorPayConfirmationComponent;
  let fixture: ComponentFixture<RazorPayConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RazorPayConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RazorPayConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
