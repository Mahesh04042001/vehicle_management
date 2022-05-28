import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomemenulayoutComponent } from './homemenulayout.component';

describe('HomemenulayoutComponent', () => {
  let component: HomemenulayoutComponent;
  let fixture: ComponentFixture<HomemenulayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomemenulayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomemenulayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
