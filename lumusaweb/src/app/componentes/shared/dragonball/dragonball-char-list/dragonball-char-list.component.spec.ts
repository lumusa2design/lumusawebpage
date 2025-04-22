import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragonballCharListComponent } from './dragonball-char-list.component';

describe('DragonballCharListComponent', () => {
  let component: DragonballCharListComponent;
  let fixture: ComponentFixture<DragonballCharListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragonballCharListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DragonballCharListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
