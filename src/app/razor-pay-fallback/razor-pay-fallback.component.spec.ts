import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RazorPayFallbackComponent } from './razor-pay-fallback.component';

describe('RazorPayFallbackComponent', () => {
  let component: RazorPayFallbackComponent;
  let fixture: ComponentFixture<RazorPayFallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RazorPayFallbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RazorPayFallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
