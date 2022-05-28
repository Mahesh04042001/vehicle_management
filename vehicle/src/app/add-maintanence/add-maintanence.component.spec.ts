import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaintanenceComponent } from './add-maintanence.component';

describe('AddMaintanenceComponent', () => {
  let component: AddMaintanenceComponent;
  let fixture: ComponentFixture<AddMaintanenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMaintanenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMaintanenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
