import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkTargetsComponent } from './work.targets.component';

describe('WorkTargetsComponent', () => {
  let component: WorkTargetsComponent;
  let fixture: ComponentFixture<WorkTargetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkTargetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkTargetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
