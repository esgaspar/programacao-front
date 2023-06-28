import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoluntarioComponent } from './voluntario.component';

describe('VoluntarioComponent', () => {
  let component: VoluntarioComponent;
  let fixture: ComponentFixture<VoluntarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoluntarioComponent]
    });
    fixture = TestBed.createComponent(VoluntarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
