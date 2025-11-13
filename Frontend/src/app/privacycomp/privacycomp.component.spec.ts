import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacycompComponent } from './privacycomp.component';

describe('PrivacycompComponent', () => {
  let component: PrivacycompComponent;
  let fixture: ComponentFixture<PrivacycompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacycompComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacycompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
