import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmLab } from './algorithm-lab';

describe('AlgorithmLab', () => {
  let component: AlgorithmLab;
  let fixture: ComponentFixture<AlgorithmLab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlgorithmLab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlgorithmLab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
