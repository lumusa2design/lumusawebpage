import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutmeComponent } from './aboutme.component';

describe('AboutmeComponent', () => {
  let component: AboutmeComponent;
  let fixture: ComponentFixture<AboutmeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutmeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
