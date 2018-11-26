import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiosPage } from './cambios.page';

describe('CambiosPage', () => {
  let component: CambiosPage;
  let fixture: ComponentFixture<CambiosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambiosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
